import express from 'express';
import * as bookingController from '../controllers/bookingController.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import prisma from '../config/database.js';

const router = express.Router();

// Public guest booking (no authentication required)
router.post('/guest', bookingController.createGuestBooking);

// Authenticated booking
router.post('/', authenticate, bookingController.createBooking);

// Cancel booking (with refund calculation)
router.post('/:id/cancel', authenticate, bookingController.cancelBooking);

// Reschedule booking (with 20% price increase)
router.post('/:id/reschedule', authenticate, bookingController.rescheduleBooking);

router.get('/my-bookings', authenticate, bookingController.getUserBookings);

// Get bookings by email (fallback for token issues)
router.get('/by-email/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      return res.json({ bookings: [] });
    }
    
    const bookings = await prisma.booking.findMany({
      where: { userId: user.id },
      include: { 
        room: true,
        serviceBookings: true,
        orders: {
          include: {
            items: { include: { item: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json({ bookings });
  } catch (error) {
    console.error('Error fetching bookings by email:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Cancel booking by email (fallback for token issues)
router.post('/cancel-by-email', async (req, res) => {
  try {
    const { bookingId, email } = req.body;
    
    if (!bookingId || !email) {
      return res.status(400).json({ error: 'Booking ID and email are required' });
    }
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { room: true }
    });
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    if (booking.userId !== user.id) {
      return res.status(403).json({ error: 'Not authorized to cancel this booking' });
    }
    
    if (['CANCELLED', 'CHECKED_OUT'].includes(booking.status)) {
      return res.status(400).json({ error: 'Booking cannot be cancelled' });
    }
    
    // Calculate 50% cancellation fee
    const cancellationFee = booking.finalPrice * 0.5;
    const refundAmount = booking.finalPrice - cancellationFee;
    
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'CANCELLED' },
      include: { room: true }
    });
    
    // Update room status
    await prisma.room.update({
      where: { id: booking.roomId },
      data: { status: 'AVAILABLE' }
    });
    
    res.json({
      success: true,
      booking: updatedBooking,
      cancellationFee,
      refundAmount,
      message: `Booking cancelled. Cancellation fee: $${cancellationFee.toFixed(2)}, Refund: $${refundAmount.toFixed(2)}`
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
});

// Reschedule booking by email (fallback for token issues)
router.post('/reschedule-by-email', async (req, res) => {
  try {
    const { bookingId, email, newCheckInDate, newCheckOutDate } = req.body;
    
    if (!bookingId || !email || !newCheckInDate || !newCheckOutDate) {
      return res.status(400).json({ error: 'Booking ID, email, and new dates are required' });
    }
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { room: true }
    });
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    if (booking.userId !== user.id) {
      return res.status(403).json({ error: 'Not authorized to reschedule this booking' });
    }
    
    if (['CANCELLED', 'CHECKED_OUT', 'CHECKED_IN'].includes(booking.status)) {
      return res.status(400).json({ error: 'Booking cannot be rescheduled' });
    }
    
    const checkIn = new Date(newCheckInDate);
    const checkOut = new Date(newCheckOutDate);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    
    // Check room availability for new dates
    const conflictingBookings = await prisma.booking.findMany({
      where: {
        roomId: booking.roomId,
        id: { not: bookingId },
        status: { notIn: ['CANCELLED', 'CHECKED_OUT'] },
        OR: [
          { AND: [{ checkInDate: { lte: checkIn } }, { checkOutDate: { gt: checkIn } }] },
          { AND: [{ checkInDate: { lt: checkOut } }, { checkOutDate: { gte: checkOut } }] },
          { AND: [{ checkInDate: { gte: checkIn } }, { checkOutDate: { lte: checkOut } }] }
        ]
      }
    });
    
    if (conflictingBookings.length > 0) {
      return res.status(400).json({ error: 'Room is not available for the new dates' });
    }
    
    // Calculate new price with 20% increase
    const basePrice = booking.room.currentPrice * nights;
    const rescheduleFee = basePrice * 0.2;
    const newTotalPrice = basePrice + rescheduleFee;
    
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        checkInDate: checkIn,
        checkOutDate: checkOut,
        totalPrice: basePrice,
        finalPrice: newTotalPrice,
        status: 'RESCHEDULED'
      },
      include: { room: true }
    });
    
    res.json({
      success: true,
      booking: updatedBooking,
      rescheduleFee,
      newTotalPrice,
      message: `Booking rescheduled. New total: $${newTotalPrice.toFixed(2)} (includes 20% reschedule fee)`
    });
  } catch (error) {
    console.error('Error rescheduling booking:', error);
    res.status(500).json({ error: 'Failed to reschedule booking' });
  }
});

router.get('/:id', authenticate, bookingController.getBookingById);

router.get(
  '/',
  authenticate,
  authorize('ADMIN', 'STAFF_RECEPTION', 'STAFF_ACCOUNTING'),
  bookingController.getAllBookings
);

router.patch(
  '/:id/status',
  authenticate,
  authorize('ADMIN', 'STAFF_RECEPTION'),
  bookingController.updateBookingStatus
);

export default router;
