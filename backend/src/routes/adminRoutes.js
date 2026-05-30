import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import prisma from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SETTINGS_FILE = path.join(__dirname, '../../data/settings.json');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'admin-secret-key-hotel-system-2024';
const INITIAL_PASSWORD = 'Ammar2001';
const PASSWORD_HINT = 'amar';

// Initialize admin account if not exists
const initializeAdmin = async () => {
  try {
    const existingAdmin = await prisma.admin.findFirst();
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(INITIAL_PASSWORD, 12);
      await prisma.admin.create({
        data: {
          username: 'admin',
          passwordHash: hashedPassword,
          passwordHint: PASSWORD_HINT
        }
      });
      console.log('✅ Admin account initialized');
    }
  } catch (error) {
    console.error('Admin initialization error:', error.message);
  }
};

// Initialize on module load
initializeAdmin();

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    const admin = await prisma.admin.findFirst();
    if (!admin) {
      return res.status(401).json({ error: 'Admin account not configured' });
    }

    const isValidPassword = await bcrypt.compare(password, admin.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = jwt.sign(
      { adminId: admin.id, role: 'ADMIN' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      admin: {
        id: admin.id,
        username: admin.username
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get password hint (for forgot password)
router.get('/password-hint', async (req, res) => {
  try {
    const admin = await prisma.admin.findFirst();
    if (!admin) {
      return res.status(404).json({ error: 'Admin account not found' });
    }
    res.json({ hint: admin.passwordHint });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get hint' });
  }
});

// Middleware to verify admin token
const verifyAdminToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Admin authentication required' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Change admin password (protected)
router.put('/change-password', verifyAdminToken, async (req, res) => {
  try {
    const { currentPassword, newPassword, newHint } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password required' });
    }

    const admin = await prisma.admin.findFirst();
    const isValidPassword = await bcrypt.compare(currentPassword, admin.passwordHash);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await prisma.admin.update({
      where: { id: admin.id },
      data: {
        passwordHash: hashedPassword,
        passwordHint: newHint || admin.passwordHint
      }
    });

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// Verify admin session
router.get('/verify', verifyAdminToken, (req, res) => {
  res.json({ valid: true, adminId: req.admin.adminId });
});

// Get dashboard statistics
router.get('/statistics', verifyAdminToken, async (req, res) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [totalBookings, bookings, totalRooms, availableRooms, activeBookings, totalOrders, orders, todayOrders, totalUsers, totalServices] = await Promise.all([
      prisma.booking.count(),
      prisma.booking.findMany({ select: { finalPrice: true } }),
      prisma.room.count(),
      prisma.room.count({ where: { status: 'AVAILABLE' } }),
      prisma.booking.count({ where: { status: { in: ['CONFIRMED', 'CHECKED_IN'] } } }),
      prisma.order.count(),
      prisma.order.findMany({ select: { totalPrice: true } }),
      prisma.order.findMany({ where: { createdAt: { gte: todayStart } }, select: { totalPrice: true } }),
      prisma.user.count(),
      prisma.serviceBooking.count(),
    ]);

    const totalRevenue = bookings.reduce((sum, b) => sum + (b.finalPrice || 0), 0) +
                         orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
    const todayRevenue = todayOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
    const occupancyRate = totalRooms > 0 ? Math.round((activeBookings / totalRooms) * 100) : 0;

    res.json({
      totalBookings,
      totalRevenue,
      totalRooms,
      availableRooms,
      activeBookings,
      totalOrders,
      totalUsers,
      totalServices,
      todayRevenue,
      occupancyRate,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get statistics' });
  }
});

// Store Items CRUD
router.get('/store-items', verifyAdminToken, async (req, res) => {
  try {
    const items = await prisma.storeItem.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get store items' });
  }
});

router.post('/store-items', verifyAdminToken, async (req, res) => {
  try {
    const { name, nameAr, description, category, price, quantity, image } = req.body;
    const item = await prisma.storeItem.create({
      data: { name, nameAr, description, category, price: parseFloat(price), quantity: parseInt(quantity) || 0, image }
    });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create store item' });
  }
});

router.put('/store-items/:id', verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, nameAr, description, category, price, quantity, image, isAvailable } = req.body;
    const item = await prisma.storeItem.update({
      where: { id },
      data: { 
        name, nameAr, description, category, 
        price: parseFloat(price), 
        quantity: parseInt(quantity) || 0, 
        image, 
        isAvailable 
      }
    });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update store item' });
  }
});

router.delete('/store-items/:id', verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    const orderItemCount = await prisma.orderItem.count({ where: { itemId: id } });
    if (orderItemCount > 0) {
      await prisma.storeItem.update({ where: { id }, data: { isAvailable: false } });
      return res.json({ success: true, softDeleted: true, message: `Item has ${orderItemCount} linked order(s) — marked as unavailable instead of deleting.` });
    }
    await prisma.storeItem.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    if (error.code === 'P2003' || error.code === 'P2014') {
      try {
        await prisma.storeItem.update({ where: { id: req.params.id }, data: { isAvailable: false } });
        return res.json({ success: true, softDeleted: true, message: 'Item has linked orders — marked as unavailable.' });
      } catch (_) {
        return res.status(409).json({ error: 'Cannot delete item — it has linked orders.' });
      }
    }
    res.status(500).json({ error: 'Failed to delete store item' });
  }
});

// Orders CRUD
router.get('/orders', verifyAdminToken, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: { item: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get orders' });
  }
});

router.post('/orders', verifyAdminToken, async (req, res) => {
  try {
    const { clientName, roomNumber, items, notes } = req.body;
    
    const orderNumber = `ORD-${Date.now()}`;
    let totalPrice = 0;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        clientName,
        roomNumber,
        totalPrice: 0,
        notes,
        items: {
          create: await Promise.all(items.map(async (item) => {
            const storeItem = await prisma.storeItem.findUnique({ where: { id: item.itemId } });
            const itemTotal = storeItem.price * item.quantity;
            totalPrice += itemTotal;
            return {
              itemId: item.itemId,
              quantity: item.quantity,
              price: storeItem.price
            };
          }))
        }
      },
      include: { items: { include: { item: true } } }
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { totalPrice }
    });

    res.json({ ...order, totalPrice });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

router.put('/orders/:id/status', verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await prisma.order.update({
      where: { id },
      data: { status }
    });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

router.delete('/orders/:id', verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.order.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

// Service Bookings - Admin view
router.get('/service-bookings', verifyAdminToken, async (req, res) => {
  try {
    const bookings = await prisma.serviceBooking.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get service bookings' });
  }
});

router.put('/service-bookings/:id/status', verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const booking = await prisma.serviceBooking.update({
      where: { id },
      data: { status }
    });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update service booking status' });
  }
});

// Room Bookings - Admin view (with linked services and orders)
router.get('/room-bookings', verifyAdminToken, async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        room: true,
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        },
        serviceBookings: true,
        orders: {
          include: {
            items: { include: { item: true } }
          }
        }
      }
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get room bookings' });
  }
});

router.put('/room-bookings/:id/status', verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const booking = await prisma.booking.update({
      where: { id },
      data: { status },
      include: { room: true }
    });

    // Update room status based on booking status
    if (status === 'CHECKED_IN') {
      await prisma.room.update({
        where: { id: booking.roomId },
        data: { status: 'OCCUPIED' }
      });
    } else if (status === 'CHECKED_OUT' || status === 'CANCELLED') {
      await prisma.room.update({
        where: { id: booking.roomId },
        data: { status: 'AVAILABLE' }
      });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update room booking status' });
  }
});

// All Bookings Summary - Combined view for admin dashboard
router.get('/all-bookings', verifyAdminToken, async (req, res) => {
  try {
    const [roomBookings, serviceBookings, orders] = await Promise.all([
      prisma.booking.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50,
        include: {
          room: true,
          user: {
            select: { firstName: true, lastName: true, email: true }
          }
        }
      }),
      prisma.serviceBooking.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50,
        include: {
          user: {
            select: { firstName: true, lastName: true, email: true }
          }
        }
      }),
      prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50,
        include: {
          items: { include: { item: true } },
          user: {
            select: { firstName: true, lastName: true, email: true }
          }
        }
      })
    ]);

    res.json({
      roomBookings,
      serviceBookings,
      orders
    });
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    res.status(500).json({ error: 'Failed to get all bookings' });
  }
});

// ── AI Concierge Analytics ──────────────────────────────────────
router.get('/concierge/stats', verifyAdminToken, async (req, res) => {
  try {
    const days   = Math.min(Math.max(parseInt(req.query.period) || 30, 1), 365);
    const since  = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // ── Parallel aggregations ────────────────────────────────────
    const [
      totalSessions,
      recShown,
      bookingStarted,
      msgAggregate,
      purposeGroups,
      roomTypeGroups,
      topRooms,
      recentSessions,
      prefCounts,
    ] = await Promise.all([

      prisma.conciergeSession.count({ where: { startedAt: { gte: since } } }),

      prisma.conciergeSession.count({
        where: { startedAt: { gte: since }, recommendationShown: true },
      }),

      prisma.conciergeSession.count({
        where: { startedAt: { gte: since }, bookingInitiated: true },
      }),

      prisma.conciergeSession.aggregate({
        where: { startedAt: { gte: since } },
        _sum: { totalMessages: true },
        _avg: { totalMessages: true },
      }),

      prisma.conciergeSession.groupBy({
        by: ['detectedPurpose'],
        where: { startedAt: { gte: since }, detectedPurpose: { not: null } },
        _count: { detectedPurpose: true },
        orderBy: { _count: { detectedPurpose: 'desc' } },
      }),

      prisma.conciergeSession.groupBy({
        by: ['recommendedRoomType'],
        where: { startedAt: { gte: since }, recommendedRoomType: { not: null } },
        _count: { recommendedRoomType: true },
        orderBy: { _count: { recommendedRoomType: 'desc' } },
      }),

      prisma.conciergeSession.groupBy({
        by: ['recommendedRoomNum', 'recommendedRoomType'],
        where: { startedAt: { gte: since }, recommendedRoomNum: { not: null } },
        _count: { recommendedRoomNum: true },
        orderBy: { _count: { recommendedRoomNum: 'desc' } },
        take: 10,
      }),

      prisma.conciergeSession.findMany({
        where: { startedAt: { gte: since } },
        orderBy: { startedAt: 'desc' },
        take: 25,
        select: {
          id: true, sessionToken: true, language: true, totalMessages: true,
          detectedPurpose: true, detectedGuests: true, detectedBudget: true,
          recommendedRoomNum: true, recommendedRoomType: true,
          recommendationShown: true, bookingInitiated: true, startedAt: true,
        },
      }),

      // Individual preference counts
      Promise.all([
        prisma.conciergeSession.count({ where: { startedAt: { gte: since }, prefSpa:     true } }),
        prisma.conciergeSession.count({ where: { startedAt: { gte: since }, prefView:    true } }),
        prisma.conciergeSession.count({ where: { startedAt: { gte: since }, prefButler:  true } }),
        prisma.conciergeSession.count({ where: { startedAt: { gte: since }, prefQuiet:   true } }),
        prisma.conciergeSession.count({ where: { startedAt: { gte: since }, prefBalcony: true } }),
        prisma.conciergeSession.count({ where: { startedAt: { gte: since }, prefPool:    true } }),
        prisma.conciergeSession.count({ where: { startedAt: { gte: since }, prefSuite:   true } }),
      ]),
    ]);

    // ── Daily activity via raw SQL ───────────────────────────────
    const dailyRaw = await prisma.$queryRaw`
      SELECT
        DATE(startedAt)                                               AS date,
        COUNT(*)                                                      AS sessions,
        SUM(CASE WHEN recommendationShown = 1 THEN 1 ELSE 0 END)     AS recommendations,
        SUM(CASE WHEN bookingInitiated    = 1 THEN 1 ELSE 0 END)     AS bookings
      FROM concierge_sessions
      WHERE startedAt >= ${since}
      GROUP BY DATE(startedAt)
      ORDER BY date ASC
    `;

    const dailyActivity = dailyRaw.map(r => ({
      date:            r.date instanceof Date ? r.date.toISOString().split('T')[0] : String(r.date),
      sessions:        Number(r.sessions),
      recommendations: Number(r.recommendations),
      bookings:        Number(r.bookings),
    }));

    // ── Language breakdown ───────────────────────────────────────
    const langGroups = await prisma.conciergeSession.groupBy({
      by: ['language'],
      where: { startedAt: { gte: since } },
      _count: { language: true },
      orderBy: { _count: { language: 'desc' } },
    });

    // ── Format response ──────────────────────────────────────────
    const recRate       = totalSessions > 0 ? Math.round((recShown / totalSessions) * 100) : 0;
    const convRate      = recShown > 0       ? Math.round((bookingStarted / recShown) * 100) : 0;
    const avgMessages   = Math.round((msgAggregate._avg?.totalMessages ?? 0) * 10) / 10;

    const [prefSpa, prefView, prefButler, prefQuiet, prefBalcony, prefPool, prefSuite] = prefCounts;

    res.json({
      period: days,
      summary: {
        totalSessions,
        totalMessages:    msgAggregate._sum?.totalMessages ?? 0,
        recommendationsShown: recShown,
        bookingInitiated: bookingStarted,
        recommendationRate: recRate,
        bookingConversionRate: convRate,
        avgMessagesPerSession: avgMessages,
      },
      purposeBreakdown: purposeGroups.map(g => ({
        purpose:    g.detectedPurpose || 'unknown',
        count:      g._count.detectedPurpose,
        percentage: totalSessions > 0 ? Math.round((g._count.detectedPurpose / totalSessions) * 100) : 0,
      })),
      roomTypeBreakdown: roomTypeGroups.map(g => ({
        roomType:   g.recommendedRoomType,
        count:      g._count.recommendedRoomType,
        percentage: recShown > 0 ? Math.round((g._count.recommendedRoomType / recShown) * 100) : 0,
      })),
      topRecommendedRooms: topRooms.map(g => ({
        roomNumber: g.recommendedRoomNum,
        roomType:   g.recommendedRoomType,
        count:      g._count.recommendedRoomNum,
      })),
      topPreferences: [
        { name: 'Spa & Wellness',   key: 'spa',     count: prefSpa     },
        { name: 'Panoramic View',   key: 'view',    count: prefView    },
        { name: 'Butler Service',   key: 'butler',  count: prefButler  },
        { name: 'Quiet & Peaceful', key: 'quiet',   count: prefQuiet   },
        { name: 'Balcony / Terrace',key: 'balcony', count: prefBalcony },
        { name: 'Pool Access',      key: 'pool',    count: prefPool    },
        { name: 'Suite / Penthouse',key: 'suite',   count: prefSuite   },
      ]
        .filter(p => p.count > 0)
        .sort((a, b) => b.count - a.count),
      languageBreakdown: langGroups.map(g => ({
        language:   g.language,
        count:      g._count.language,
        percentage: totalSessions > 0 ? Math.round((g._count.language / totalSessions) * 100) : 0,
      })),
      dailyActivity,
      recentSessions,
    });

  } catch (error) {
    console.error('Concierge stats error:', error);
    res.status(500).json({ error: 'Failed to load AI analytics' });
  }
});

// Reports — time-range filtered analytics
router.get('/reports', verifyAdminToken, async (req, res) => {
  try {
    const { range = 'monthly' } = req.query;
    const now = new Date();
    let startDate;
    if (range === 'daily') {
      startDate = new Date(now); startDate.setHours(0, 0, 0, 0);
    } else if (range === 'yearly') {
      startDate = new Date(now.getFullYear(), 0, 1);
    } else {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    const [
      totalBookings, bookings,
      totalOrders, orders,
      totalServices, services,
      totalRooms, availableRooms, activeBookings,
      totalUsers, newUsers,
    ] = await Promise.all([
      prisma.booking.count({ where: { createdAt: { gte: startDate } } }),
      prisma.booking.findMany({ where: { createdAt: { gte: startDate } }, select: { finalPrice: true, status: true } }),
      prisma.order.count({ where: { createdAt: { gte: startDate } } }),
      prisma.order.findMany({ where: { createdAt: { gte: startDate } }, select: { totalPrice: true, status: true } }),
      prisma.serviceBooking.count({ where: { createdAt: { gte: startDate } } }),
      prisma.serviceBooking.findMany({ where: { createdAt: { gte: startDate } }, select: { totalPrice: true, status: true } }),
      prisma.room.count(),
      prisma.room.count({ where: { status: 'AVAILABLE' } }),
      prisma.booking.count({ where: { status: { in: ['CONFIRMED', 'CHECKED_IN'] } } }),
      prisma.user.count(),
      prisma.user.count({ where: { createdAt: { gte: startDate } } }),
    ]);

    const bookingRevenue  = bookings.reduce((s, b) => s + (b.finalPrice || 0), 0);
    const orderRevenue    = orders.reduce((s, o) => s + (o.totalPrice || 0), 0);
    const serviceRevenue  = services.reduce((s, sv) => s + (sv.totalPrice || 0), 0);
    const totalRevenue    = bookingRevenue + orderRevenue + serviceRevenue;
    const occupancyRate   = totalRooms > 0 ? Math.round((activeBookings / totalRooms) * 100) : 0;

    res.json({
      range, startDate,
      totalBookings, bookingRevenue,
      totalOrders, orderRevenue,
      totalServices, serviceRevenue,
      totalRevenue,
      totalRooms, availableRooms, activeBookings, occupancyRate,
      totalUsers, newUsers,
      confirmedBookings:  bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'CHECKED_IN').length,
      completedBookings:  bookings.filter(b => b.status === 'CHECKED_OUT' || b.status === 'COMPLETED').length,
      cancelledBookings:  bookings.filter(b => b.status === 'CANCELLED').length,
    });
  } catch (error) {
    console.error('Reports error:', error);
    res.status(500).json({ error: 'Failed to get reports' });
  }
});

// Footer Settings
const readSettings = () => {
  try {
    const dataDir = path.join(__dirname, '../../data');
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    if (!fs.existsSync(SETTINGS_FILE)) {
      fs.writeFileSync(SETTINGS_FILE, JSON.stringify({ footer: {} }, null, 2));
    }
    return JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8'));
  } catch (e) { return { footer: {} }; }
};

const writeSettings = (settings) => {
  const dataDir = path.join(__dirname, '../../data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
};

router.get('/settings/footer', verifyAdminToken, (req, res) => {
  try {
    const settings = readSettings();
    res.json(settings.footer || {});
  } catch (error) {
    res.status(500).json({ error: 'Failed to get footer settings' });
  }
});

router.put('/settings/footer', verifyAdminToken, (req, res) => {
  try {
    const settings = readSettings();
    settings.footer = { ...settings.footer, ...req.body };
    writeSettings(settings);
    res.json({ success: true, footer: settings.footer });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save footer settings' });
  }
});

// ── Users management ──────────────────────────────────────────
router.get('/users', verifyAdminToken, async (_req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        phone: true,
        createdAt: true,
        guestProfile: {
          select: { isFirstVisit: true, totalStays: true, totalSpent: true, discountRate: true }
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.delete('/users/:id', verifyAdminToken, async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

export default router;
