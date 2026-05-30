import express from 'express';
import prisma from '../config/database.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-hotel-system';

// Optional auth middleware - extracts user if token present
const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      // Fetch actual user from database
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId }
      });
      if (user) {
        req.user = user;
      }
    } catch (error) {
      // Token invalid, continue without user
      console.log('Optional auth - token invalid:', error.message);
    }
  }
  next();
};

// Required auth middleware
const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // Fetch actual user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

const generateBookingNumber = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 6);
  return `SVC-${timestamp}-${random}`.toUpperCase();
};

// Service pricing configuration
const SERVICE_PRICING = {
  spa: {
    base: 150,
    durations: { '30min': 0.5, '60min': 1, '90min': 1.4, '120min': 1.8 },
    types: { 'relaxation': 1, 'deep_tissue': 1.2, 'hot_stone': 1.3, 'aromatherapy': 1.1, 'couples': 1.8 },
    locations: { 'spa_room': 1, 'private_suite': 1.5, 'in_room': 1.3 }
  },
  gym: {
    base: 50,
    days: { '1': 1, '3': 2.5, '7': 5, '14': 8, '30': 12 },
    trainer: { 'yes': 80, 'no': 0 }
  },
  pool: {
    base: 40,
    types: { 'shared': 1, 'private': 3 },
    durations: { '1hour': 1, '2hours': 1.8, 'half_day': 3, 'full_day': 5 },
    coach: { 'yes': 60, 'no': 0 }
  },
  driver: {
    base: 100,
    tripTypes: { 'airport_transfer': 1, 'city_tour': 2, 'full_day': 4, 'hourly': 0.5 },
    carTypes: { 'sedan': 1, 'suv': 1.3, 'luxury': 2, 'limousine': 3 }
  },
  butler: {
    base: 200,
    durations: { '2hours': 1, '4hours': 1.8, 'half_day': 2.5, 'full_day': 4 },
    serviceTypes: { 'basic': 1, 'premium': 1.5, 'exclusive': 2 }
  }
};

// Calculate price based on service type and options
const calculatePrice = (serviceType, options) => {
  const config = SERVICE_PRICING[serviceType];
  if (!config) return 0;

  let price = config.base;

  switch (serviceType) {
    case 'spa':
      price *= config.durations[options.duration] || 1;
      price *= config.types[options.sessionType] || 1;
      price *= config.locations[options.location] || 1;
      break;
    case 'gym':
      price *= config.days[options.days] || 1;
      price += config.trainer[options.personalTrainer] || 0;
      break;
    case 'pool':
      price *= config.types[options.poolType] || 1;
      price *= config.durations[options.duration] || 1;
      price += config.coach[options.swimmingCoach] || 0;
      break;
    case 'driver':
      price *= config.tripTypes[options.tripType] || 1;
      price *= config.carTypes[options.carType] || 1;
      break;
    case 'butler':
      price *= config.durations[options.duration] || 1;
      price *= config.serviceTypes[options.serviceType] || 1;
      break;
  }

  return Math.round(price * 100) / 100;
};

// Create service booking (REQUIRES authentication - user must be logged in)
router.post('/book', requireAuth, async (req, res) => {
  try {
    const { serviceType, bookingDetails, formData, roomBookingId } = req.body;

    if (!serviceType) {
      return res.status(400).json({ error: 'Service type is required' });
    }

    // User info comes from token - no need to ask again
    const user = req.user;

    const totalPrice = calculatePrice(serviceType, bookingDetails || {});

    // ── BUSINESS RULE: the service date MUST fall within an active room
    // booking's check-in → check-out range. A guest can only reserve hotel
    // services for days they are actually staying. (Phase B — items 5 & 6)
    const serviceDateRaw = bookingDetails?.date;
    if (!serviceDateRaw) {
      return res.status(400).json({ error: 'Please choose a date for this service.' });
    }
    const serviceDay = new Date(serviceDateRaw);
    if (Number.isNaN(serviceDay.getTime())) {
      return res.status(400).json({ error: 'Invalid service date.' });
    }
    serviceDay.setHours(12, 0, 0, 0); // compare at mid-day to avoid TZ edge cases

    // Pull the guest's active room bookings.
    const activeBookings = await prisma.booking.findMany({
      where: {
        userId: user.id,
        status: { in: ['CONFIRMED', 'PENDING', 'CHECKED_IN'] },
      },
      orderBy: { checkInDate: 'asc' },
      include: { room: true },
    });

    // Find the booking whose stay window covers the requested service date.
    // If the client specified a roomBookingId, it must be THAT booking.
    const covering = activeBookings.find((b) => {
      if (roomBookingId && b.id !== roomBookingId) return false;
      const ci = new Date(b.checkInDate);  ci.setHours(0, 0, 0, 0);
      const co = new Date(b.checkOutDate); co.setHours(23, 59, 59, 999);
      return serviceDay >= ci && serviceDay <= co;
    });

    if (!covering) {
      return res.status(400).json({
        error: 'You must have a valid room reservation covering this date before booking hotel services.',
        code: 'NO_COVERING_BOOKING',
      });
    }

    const linkedBookingId = covering.id;

    const booking = await prisma.serviceBooking.create({
      data: {
        bookingNumber: generateBookingNumber(),
        serviceType,
        userId: user.id,
        roomBookingId: linkedBookingId,
        guestName: `${user.firstName} ${user.lastName}`,
        guestEmail: user.email,
        guestPhone: user.phone || null,
        roomNumber: covering.room?.roomNumber || null,
        bookingDate: new Date(serviceDateRaw),
        startTime: bookingDetails?.time || null,
        duration: bookingDetails?.duration || null,
        totalPrice,
        status: 'CONFIRMED',
        formData: JSON.stringify(formData || {}),
        notes: bookingDetails?.notes || null
      }
    });

    res.status(201).json({
      success: true,
      booking,
      message: `Your ${serviceType} booking has been confirmed!`
    });
  } catch (error) {
    console.error('Service booking error:', error);
    res.status(500).json({ error: 'Failed to create service booking' });
  }
});

// GET user's service bookings (requires auth)
router.get('/my-bookings', requireAuth, async (req, res) => {
  try {
    const bookings = await prisma.serviceBooking.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ bookings });
  } catch (error) {
    console.error('Error fetching user service bookings:', error);
    res.status(500).json({ error: 'Failed to fetch service bookings' });
  }
});

// GET service bookings by email (fallback for token issues)
router.get('/by-email/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      return res.json({ bookings: [] });
    }
    
    const bookings = await prisma.serviceBooking.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json({ bookings });
  } catch (error) {
    console.error('Error fetching service bookings by email:', error);
    res.status(500).json({ error: 'Failed to fetch service bookings' });
  }
});

// Cancel service booking (requires auth) - 50% fee
router.post('/bookings/:id/cancel', requireAuth, async (req, res) => {
  try {
    const booking = await prisma.serviceBooking.findUnique({
      where: { id: req.params.id }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.userId !== req.user.id) {
      return res.status(403).json({ error: 'You can only cancel your own bookings' });
    }

    if (booking.status === 'CANCELLED') {
      return res.status(400).json({ error: 'Booking is already cancelled' });
    }

    if (booking.status === 'COMPLETED') {
      return res.status(400).json({ error: 'Cannot cancel completed booking' });
    }

    // Apply 50% cancellation fee
    const cancellationFee = booking.totalPrice * 0.5;
    const refundAmount = booking.totalPrice - cancellationFee;

    const updatedBooking = await prisma.serviceBooking.update({
      where: { id: req.params.id },
      data: { 
        status: 'CANCELLED',
        notes: `${booking.notes || ''}\n[CANCELLED] Refund: $${refundAmount.toFixed(2)}, Fee: $${cancellationFee.toFixed(2)}`
      }
    });

    res.json({
      booking: updatedBooking,
      cancellationFee,
      refundAmount,
      message: `Service booking cancelled. Refund: $${refundAmount.toFixed(2)} (50% fee: $${cancellationFee.toFixed(2)})`
    });
  } catch (error) {
    console.error('Cancel service booking error:', error);
    res.status(500).json({ error: 'Failed to cancel service booking' });
  }
});

// Reschedule service booking (requires auth) - 20% price increase
router.post('/bookings/:id/reschedule', requireAuth, async (req, res) => {
  try {
    const { newDate, newTime } = req.body;

    if (!newDate) {
      return res.status(400).json({ error: 'New date is required' });
    }

    const booking = await prisma.serviceBooking.findUnique({
      where: { id: req.params.id }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.userId !== req.user.id) {
      return res.status(403).json({ error: 'You can only reschedule your own bookings' });
    }

    if (booking.status === 'CANCELLED' || booking.status === 'COMPLETED') {
      return res.status(400).json({ error: 'Cannot reschedule cancelled or completed booking' });
    }

    // Same business rule on reschedule: the new date must still fall within
    // the linked room booking's stay window.
    if (booking.roomBookingId) {
      const roomBooking = await prisma.booking.findUnique({ where: { id: booking.roomBookingId } });
      if (roomBooking) {
        const nd = new Date(newDate); nd.setHours(12, 0, 0, 0);
        const ci = new Date(roomBooking.checkInDate);  ci.setHours(0, 0, 0, 0);
        const co = new Date(roomBooking.checkOutDate); co.setHours(23, 59, 59, 999);
        if (Number.isNaN(nd.getTime()) || nd < ci || nd > co) {
          return res.status(400).json({
            error: 'The new date must fall within your room reservation dates.',
            code: 'OUTSIDE_BOOKING_RANGE',
          });
        }
      }
    }

    // Apply 20% reschedule fee
    const rescheduleFee = booking.totalPrice * 0.2;
    const newTotalPrice = booking.totalPrice + rescheduleFee;

    const updatedBooking = await prisma.serviceBooking.update({
      where: { id: req.params.id },
      data: { 
        bookingDate: new Date(newDate),
        startTime: newTime || booking.startTime,
        totalPrice: newTotalPrice,
        status: 'RESCHEDULED',
        notes: `${booking.notes || ''}\n[RESCHEDULED] New price: $${newTotalPrice.toFixed(2)} (+20% fee: $${rescheduleFee.toFixed(2)})`
      }
    });

    res.json({
      booking: updatedBooking,
      rescheduleFee,
      newTotalPrice,
      message: `Service booking rescheduled. New price: $${newTotalPrice.toFixed(2)} (+20% fee: $${rescheduleFee.toFixed(2)})`
    });
  } catch (error) {
    console.error('Reschedule service booking error:', error);
    res.status(500).json({ error: 'Failed to reschedule service booking' });
  }
});

// Get all service bookings (admin)
router.get('/bookings', async (req, res) => {
  try {
    const { serviceType, status } = req.query;
    const where = {};
    
    if (serviceType) where.serviceType = serviceType;
    if (status) where.status = status;

    const bookings = await prisma.serviceBooking.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching service bookings:', error);
    res.status(500).json({ error: 'Failed to fetch service bookings' });
  }
});

// Get booking by ID
router.get('/bookings/:id', async (req, res) => {
  try {
    const booking = await prisma.serviceBooking.findUnique({
      where: { id: req.params.id }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

// Update booking status (admin)
router.patch('/bookings/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    const booking = await prisma.serviceBooking.update({
      where: { id: req.params.id },
      data: { status }
    });

    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update booking status' });
  }
});

// Get service pricing
router.get('/pricing', (req, res) => {
  res.json(SERVICE_PRICING);
});

// Calculate price endpoint
router.post('/calculate-price', (req, res) => {
  const { serviceType, options } = req.body;
  const price = calculatePrice(serviceType, options || {});
  res.json({ price });
});

export default router;
