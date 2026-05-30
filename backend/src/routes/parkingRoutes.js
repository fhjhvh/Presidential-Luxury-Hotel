import express from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../config/database.js';
import * as parkingController from '../controllers/parkingController.js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-hotel-system';

// Required auth — mirrors serviceRoutes
const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  try {
    const decoded = jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) return res.status(401).json({ error: 'User not found' });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

const genReservationNumber = () =>
  `PARK-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`.toUpperCase();

// ── Parking RESERVATIONS (persisted, linked to user + room booking) ──────
// NOTE: these MUST be declared before the "/:id" spot route below, otherwise
// "/my-reservations" would be captured as a spot id.

// Create a parking reservation
router.post('/reserve', requireAuth, async (req, res) => {
  try {
    const { parkingType = 'self', roomBookingId, reservationDate, startTime, endTime, notes } = req.body;
    const user = req.user;

    // Resolve the linked room booking (explicit id → else nearest active one)
    let linkedBooking = null;
    if (roomBookingId) {
      linkedBooking = await prisma.booking.findFirst({
        where: { id: roomBookingId, userId: user.id },
        include: { room: true },
      });
    }
    if (!linkedBooking) {
      linkedBooking = await prisma.booking.findFirst({
        where: { userId: user.id, status: { in: ['CONFIRMED', 'PENDING', 'CHECKED_IN'] } },
        orderBy: { checkInDate: 'asc' },
        include: { room: true },
      });
    }

    // Date window: explicit → else derive from the booking → else today
    let date = reservationDate ? new Date(reservationDate) : null;
    if ((!date || Number.isNaN(date.getTime())) && linkedBooking) date = new Date(linkedBooking.checkInDate);
    if (!date || Number.isNaN(date.getTime())) date = new Date();

    // Assign a real spot if one is free; otherwise synthesise a spot number.
    let spotNumber;
    const freeSpot = await prisma.parkingSpot.findFirst({
      where: { status: 'AVAILABLE', ...(parkingType ? {} : {}) },
      orderBy: { spotNumber: 'asc' },
    });
    if (freeSpot) {
      spotNumber = freeSpot.spotNumber;
      await prisma.parkingSpot.update({ where: { id: freeSpot.id }, data: { status: 'RESERVED' } });
    } else {
      const prefix = { valet: 'V', self: 'S', vip: 'VIP', ev: 'EV' }[parkingType] || 'P';
      spotNumber = `${prefix}-${Math.floor(100 + Math.random() * 900)}`;
    }

    const reservation = await prisma.parkingReservation.create({
      data: {
        reservationNumber: genReservationNumber(),
        userId: user.id,
        roomBookingId: linkedBooking?.id || null,
        guestName: `${user.firstName} ${user.lastName}`,
        guestEmail: user.email,
        spotNumber,
        parkingType,
        reservationDate: date,
        startTime: startTime || (linkedBooking ? new Date(linkedBooking.checkInDate).toISOString() : null),
        endTime:   endTime   || (linkedBooking ? new Date(linkedBooking.checkOutDate).toISOString() : null),
        status: 'CONFIRMED',
        price: 0, // complimentary for all guests
        notes: notes || null,
      },
    });

    res.status(201).json({ success: true, reservation });
  } catch (error) {
    console.error('Parking reservation error:', error);
    res.status(500).json({ error: 'Failed to create parking reservation' });
  }
});

// Current user's parking reservations
router.get('/my-reservations', requireAuth, async (req, res) => {
  try {
    const reservations = await prisma.parkingReservation.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ reservations });
  } catch (error) {
    console.error('Error fetching parking reservations:', error);
    res.status(500).json({ error: 'Failed to fetch parking reservations' });
  }
});

// Fallback by email (for token edge cases — mirrors other modules)
router.get('/reservations/by-email/:email', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { email: req.params.email } });
    if (!user) return res.json({ reservations: [] });
    const reservations = await prisma.parkingReservation.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ reservations });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch parking reservations' });
  }
});

// Cancel a parking reservation
router.post('/reservations/:id/cancel', requireAuth, async (req, res) => {
  try {
    const reservation = await prisma.parkingReservation.findUnique({ where: { id: req.params.id } });
    if (!reservation) return res.status(404).json({ error: 'Reservation not found' });
    if (reservation.userId !== req.user.id) return res.status(403).json({ error: 'Not your reservation' });

    const updated = await prisma.parkingReservation.update({
      where: { id: req.params.id },
      data: { status: 'CANCELLED' },
    });
    // Free the spot if it was a real one
    await prisma.parkingSpot.updateMany({
      where: { spotNumber: reservation.spotNumber, status: 'RESERVED' },
      data: { status: 'AVAILABLE' },
    });
    res.json({ success: true, reservation: updated });
  } catch (error) {
    res.status(500).json({ error: 'Failed to cancel parking reservation' });
  }
});

// ── Parking SPOTS (admin CRUD) ──────────────────────────────────────────
router.get('/', parkingController.getAllParkingSpots);
router.get('/:id', parkingController.getParkingSpotById);
router.post('/', parkingController.createParkingSpot);
router.put('/:id', parkingController.updateParkingSpot);
router.delete('/:id', parkingController.deleteParkingSpot);

export default router;
