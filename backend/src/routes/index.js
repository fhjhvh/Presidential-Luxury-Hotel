import express from 'express';
import authRoutes from './authRoutes.js';
import roomRoutes from './roomRoutes.js';
import bookingRoutes from './bookingRoutes.js';
import chatRoutes from './chatRoutes.js';
import userRoutes from './userRoutes.js';
import floorRoutes from './floorRoutes.js';
import featureRoutes from './featureRoutes.js';
import foodRoutes from './foodRoutes.js';
import parkingRoutes from './parkingRoutes.js';
import adminRoutes from './adminRoutes.js';
import storeRoutes from './storeRoutes.js';
import settingsRoutes from './settingsRoutes.js';
import serviceRoutes from './serviceRoutes.js';
import conciergeRoutes from './conciergeRoutes.js';
import vipRoutes from './vipRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/rooms', roomRoutes);
router.use('/bookings', bookingRoutes);
router.use('/chat', chatRoutes);
router.use('/users', userRoutes);
router.use('/concierge', conciergeRoutes);
router.use('/floors', floorRoutes);
router.use('/features', featureRoutes);
router.use('/food', foodRoutes);
router.use('/parking', parkingRoutes);
router.use('/admin', adminRoutes);
router.use('/store', storeRoutes);
router.use('/settings', settingsRoutes);
router.use('/services', serviceRoutes);
router.use('/vip', vipRoutes);

router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
