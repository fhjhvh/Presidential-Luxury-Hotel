import express from 'express';
import prisma from '../config/database.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-hotel-system';

const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) return res.status(401).json({ error: 'User not found' });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

const generateBookingNumber = () => {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `VIP-${ts}-${rand}`;
};

// ── Server-side price catalogue (mirrors frontend for verification) ──────────

const VIP_PRICING = {
  comfort: {
    base: 299,
    options: {
      romantic_dim: 25, memory_foam: 20,
      lavender: 30, vanilla: 30, oud: 45, citrus: 30, rose: 35,
      navy: 15, burgundy: 15,
      piano: 20, ambient: 20, romantic: 20, nature: 20,
      candles: 40, flowers: 55, chocolate: 65, welcome_drink: 35,
    },
  },
  honeymoon: {
    base: 499,
    options: {
      rose_petals: 80, candle_pathway: 120, balloons: 95, just_married: 45,
      candle_style: 35,
      dinner_italian: 180, dinner_arabic: 160, dinner_intl: 200,
      cake_chocolate: 85, cake_vanilla: 85, fruit_platter: 65,
      fresh_juice: 40, sparkling: 55,
      photographer: 250, music_setup: 75, late_checkout: 60,
      gift_box: 150, private_celebration: 200,
    },
  },
  events: {
    base: 799,
    options: {
      wedding: 200, engagement: 150, private_party: 50,
      medium: 250, large: 600,
      classic: 150, luxury_gold: 350, floral: 250, modern_minimal: 200,
      buffet: 180, open_menu: 220, custom_catering: 350,
      basic: 300, full_pro: 800,
      calm_bg: 100, dj: 500, live_band: 1200,
      cake_design: 120, stage_setup: 300, lighting_effects: 200,
      welcome_service: 150, laundry: 80, post_cleaning: 180,
    },
  },
};

const calculateVipPrice = (serviceKey, selections = {}) => {
  const config = VIP_PRICING[serviceKey];
  if (!config) return 0;

  let total = config.base;
  const flatten = (val) => Array.isArray(val) ? val : (val ? [val] : []);

  Object.values(selections).forEach(val => {
    flatten(val).forEach(optId => {
      const extra = config.options[optId];
      if (extra) total += extra;
    });
  });

  return Math.round(total * 100) / 100;
};

// ── POST /vip/book ────────────────────────────────────────────────────────────

router.post('/book', requireAuth, async (req, res) => {
  try {
    const { serviceType, roomBookingId, bookingDetails, formData } = req.body;

    if (!serviceType || !serviceType.startsWith('vip_')) {
      return res.status(400).json({ error: 'Invalid VIP service type.' });
    }

    const serviceKey = serviceType.replace('vip_', '');

    if (!VIP_PRICING[serviceKey]) {
      return res.status(400).json({ error: `Unknown VIP service: ${serviceKey}` });
    }

    const user = req.user;

    // Resolve room booking
    let linkedBookingId = roomBookingId || null;
    if (!linkedBookingId) {
      const activeBooking = await prisma.booking.findFirst({
        where: {
          userId: user.id,
          status: { in: ['CONFIRMED', 'PENDING', 'CHECKED_IN'] },
          checkOutDate: { gte: new Date() },
        },
        orderBy: { checkInDate: 'asc' },
        include: { room: true },
      });
      if (activeBooking) linkedBookingId = activeBooking.id;
    }

    if (!linkedBookingId) {
      return res.status(400).json({
        error: 'An active room booking is required to add VIP services. Please book a room first.',
      });
    }

    // Recalculate price server-side
    const selections = formData?.selections || {};
    const totalPrice = calculateVipPrice(serviceKey, selections);

    const booking = await prisma.serviceBooking.create({
      data: {
        bookingNumber:  generateBookingNumber(),
        serviceType,
        userId:         user.id,
        roomBookingId:  linkedBookingId,
        guestName:      `${user.firstName} ${user.lastName}`,
        guestEmail:     user.email,
        guestPhone:     user.phone || null,
        roomNumber:     null,
        bookingDate:    new Date(bookingDetails?.date || Date.now()),
        startTime:      null,
        duration:       null,
        totalPrice,
        status:         'CONFIRMED',
        formData:       JSON.stringify({ ...formData, serviceKey, recalculatedPrice: totalPrice }),
        notes:          bookingDetails?.notes || null,
      },
    });

    res.status(201).json({
      success: true,
      booking,
      message: `Your ${serviceKey} VIP experience has been reserved!`,
    });
  } catch (error) {
    console.error('VIP booking error:', error);
    res.status(500).json({ error: 'Failed to create VIP booking.' });
  }
});

// ── GET /vip/my-bookings ──────────────────────────────────────────────────────

router.get('/my-bookings', requireAuth, async (req, res) => {
  try {
    const bookings = await prisma.serviceBooking.findMany({
      where: {
        userId: req.user.id,
        serviceType: { startsWith: 'vip_' },
      },
      orderBy: { createdAt: 'desc' },
      include: {
        roomBooking: {
          include: { room: { select: { roomNumber: true, type: true } } },
        },
      },
    });
    res.json({ bookings });
  } catch (error) {
    console.error('VIP bookings fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch VIP bookings.' });
  }
});

export default router;
