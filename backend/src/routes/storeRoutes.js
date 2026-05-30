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

// GET all available store items (public)
router.get('/items', async (req, res) => {
  try {
    const items = await prisma.storeItem.findMany({
      where: { isAvailable: true },
      orderBy: { category: 'asc' }
    });
    res.json(items);
  } catch (error) {
    console.error('Error fetching store items:', error);
    res.status(500).json({ error: 'Failed to fetch store items' });
  }
});

// GET single item
router.get('/items/:id', async (req, res) => {
  try {
    const item = await prisma.storeItem.findUnique({
      where: { id: req.params.id }
    });
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch item' });
  }
});

// CREATE order (REQUIRES authentication - user must be logged in)
router.post('/orders', requireAuth, async (req, res) => {
  try {
    const { items, notes, orderType, roomBookingId, deliveryType, roomNumber: bodyRoomNumber, totalAmount } = req.body;
    const user = req.user;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Items are required' });
    }

    const orderNumber = `ORD-${Date.now()}`;
    const isRestaurant = orderType === 'RESTAURANT';
    let totalPrice = 0;
    let orderItemsCreate = undefined;

    if (isRestaurant) {
      // Restaurant items are virtual menu items — not stored in the store DB.
      // Total comes from the frontend (pre-calculated) or we sum from the items array.
      totalPrice = totalAmount
        ? Number(totalAmount)
        : items.reduce((sum, i) => sum + (Number(i.price) * Number(i.quantity)), 0);
      // OrderItem rows are not created for restaurant orders because itemId is required
      // by the schema and restaurant items have no store DB ID.
      // Item details are already serialized into the `notes` field by the frontend.
    } else {
      // Market orders: validate each item against the store DB
      const resolvedItems = await Promise.all(items.map(async (item) => {
        if (!item.itemId) throw new Error('itemId is required for market items');
        const storeItem = await prisma.storeItem.findUnique({ where: { id: item.itemId } });
        if (!storeItem) throw new Error(`Item not found in store`);
        if (storeItem.quantity < item.quantity) throw new Error(`Insufficient stock for ${storeItem.name}`);
        totalPrice += storeItem.price * item.quantity;
        return { itemId: item.itemId, quantity: item.quantity, price: storeItem.price };
      }));
      orderItemsCreate = { create: resolvedItems };
    }

    // Resolve room booking
    let linkedBookingId = roomBookingId || null;
    let resolvedRoomNumber = bodyRoomNumber || null;

    // Always try to find the user's active booking so the order links to it when possible
    const activeBooking = await prisma.booking.findFirst({
      where: {
        userId: user.id,
        status: { in: ['CONFIRMED', 'PENDING', 'CHECKED_IN'] },
        checkOutDate: { gte: new Date() }
      },
      orderBy: { checkInDate: 'asc' },
      include: { room: true }
    });
    if (activeBooking) {
      linkedBookingId = linkedBookingId || activeBooking.id;
      resolvedRoomNumber = resolvedRoomNumber || activeBooking.room?.roomNumber;
    }

    // Market orders require an active room booking (charges go to the room bill).
    // Restaurant table-service orders don't require a room booking.
    if (!isRestaurant && !linkedBookingId) {
      return res.status(400).json({
        error: 'You must have an active room booking to place store orders. Please book a room first.'
      });
    }

    // Build order data
    const orderData = {
      orderNumber,
      userId: user.id,
      roomBookingId: linkedBookingId,
      clientName: `${user.firstName} ${user.lastName}`,
      roomNumber: resolvedRoomNumber || '',
      orderType: orderType || 'MARKET',
      totalPrice,
      notes,
      status: 'PENDING',
    };
    if (orderItemsCreate) orderData.items = orderItemsCreate;

    const order = await prisma.order.create({
      data: orderData,
      include: { items: { include: { item: true } } }
    });

    // Decrement stock only for market orders
    if (!isRestaurant) {
      for (const item of items) {
        await prisma.storeItem.update({
          where: { id: item.itemId },
          data: { quantity: { decrement: item.quantity } }
        });
      }
    }

    res.status(201).json(order);
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ error: error.message || 'Failed to create order' });
  }
});

// GET user's orders (requires auth)
router.get('/my-orders', requireAuth, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: { items: { include: { item: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ orders });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// GET orders by email (fallback for token issues)
router.get('/orders/by-email/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      return res.json({ orders: [] });
    }
    
    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: { items: { include: { item: true } } },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json({ orders });
  } catch (error) {
    console.error('Error fetching orders by email:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Cancel order (requires auth)
router.post('/orders/:id/cancel', requireAuth, async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.userId !== req.user.id) {
      return res.status(403).json({ error: 'You can only cancel your own orders' });
    }

    if (order.status === 'CANCELLED') {
      return res.status(400).json({ error: 'Order is already cancelled' });
    }

    if (order.status === 'DELIVERED') {
      return res.status(400).json({ error: 'Cannot cancel delivered order' });
    }

    // Apply 50% cancellation fee
    const cancellationFee = order.totalPrice * 0.5;
    const refundAmount = order.totalPrice - cancellationFee;

    const updatedOrder = await prisma.order.update({
      where: { id: req.params.id },
      data: { 
        status: 'CANCELLED',
        notes: `${order.notes || ''}\n[CANCELLED] Refund: $${refundAmount.toFixed(2)}, Fee: $${cancellationFee.toFixed(2)}`
      },
      include: { items: { include: { item: true } } }
    });

    res.json({
      order: updatedOrder,
      cancellationFee,
      refundAmount,
      message: `Order cancelled. Refund: $${refundAmount.toFixed(2)} (50% fee: $${cancellationFee.toFixed(2)})`
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ error: 'Failed to cancel order' });
  }
});

// GET order status (by order number)
router.get('/orders/:orderNumber', async (req, res) => {
  try {
    const order = await prisma.order.findFirst({
      where: { orderNumber: req.params.orderNumber },
      include: { items: { include: { item: true } } }
    });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

export default router;
