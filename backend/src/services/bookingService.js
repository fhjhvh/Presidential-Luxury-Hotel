import prisma from '../config/database.js';
import { calculateDiscount, applyDiscount } from '../utils/discounts.js';
import bcrypt from 'bcryptjs';

// Check room availability for specific dates
const checkRoomAvailabilityInternal = async (roomId, checkInDate, checkOutDate, excludeBookingId = null) => {
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);

  const whereClause = {
    roomId,
    status: { notIn: ['CANCELLED', 'CHECKED_OUT'] },
    OR: [
      {
        checkInDate: { lte: checkOut },
        checkOutDate: { gte: checkIn },
      },
    ],
  };

  if (excludeBookingId) {
    whereClause.id = { not: excludeBookingId };
  }

  const conflictingBooking = await prisma.booking.findFirst({
    where: whereClause,
  });

  return !conflictingBooking;
};

const generateBookingNumber = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `BKG-${timestamp}-${random}`.toUpperCase();
};

export const createBooking = async (bookingData, user) => {
  const { roomId, checkInDate, checkOutDate, numberOfGuests, specialRequests, guestPreferences } = bookingData;

  const room = await prisma.room.findUnique({
    where: { id: roomId },
  });

  if (!room) {
    throw new Error('Room not found');
  }

  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);

  // Check date-based availability (not just room status)
  const isAvailable = await checkRoomAvailabilityInternal(roomId, checkIn, checkOut);
  if (!isAvailable) {
    throw new Error('Room is not available for the selected dates');
  }
  const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

  const totalPrice = room.currentPrice * nights;

  const guestProfile = await prisma.guestProfile.findUnique({
    where: { userId: user.id },
  });

  let discountRate = 0;
  if (guestProfile) {
    discountRate = calculateDiscount(user, guestProfile);
  }

  const pricing = applyDiscount(totalPrice, discountRate);

  const booking = await prisma.booking.create({
    data: {
      bookingNumber: generateBookingNumber(),
      userId: user.id,
      roomId,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      numberOfGuests,
      totalPrice: pricing.originalPrice,
      discountApplied: pricing.discount,
      finalPrice: pricing.finalPrice,
      specialRequests,
      guestPreferences,
      status: 'PENDING',
    },
    include: {
      room: true,
      user: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
        },
      },
    },
  });

  await prisma.room.update({
    where: { id: roomId },
    data: { status: 'RESERVED' },
  });

  if (guestProfile) {
    await prisma.guestProfile.update({
      where: { userId: user.id },
      data: {
        isFirstVisit: false,
        totalStays: { increment: 1 },
        totalSpent: { increment: pricing.finalPrice },
      },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { role: 'GUEST_RETURNING' },
    });
  }

  return booking;
};

export const getUserBookings = async (userId) => {
  return await prisma.booking.findMany({
    where: { userId },
    include: {
      room: true,
      serviceBookings: true,
      orders: {
        include: {
          items: {
            include: { item: true }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getBookingById = async (bookingId) => {
  return await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      room: true,
      user: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
        },
      },
    },
  });
};

export const updateBookingStatus = async (bookingId, status) => {
  const booking = await prisma.booking.update({
    where: { id: bookingId },
    data: { status },
    include: { room: true },
  });

  if (status === 'CHECKED_IN') {
    await prisma.room.update({
      where: { id: booking.roomId },
      data: { status: 'OCCUPIED' },
    });
  } else if (status === 'CHECKED_OUT' || status === 'CANCELLED') {
    await prisma.room.update({
      where: { id: booking.roomId },
      data: { status: 'AVAILABLE' },
    });
  }

  return booking;
};

export const getAllBookings = async (filters = {}) => {
  const where = {};

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.roomId) {
    where.roomId = filters.roomId;
  }

  return await prisma.booking.findMany({
    where,
    include: {
      room: true,
      user: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

// Guest booking - creates or finds guest user
export const createGuestBooking = async (bookingData) => {
  const { 
    roomId, 
    checkInDate, 
    checkOutDate, 
    numberOfGuests, 
    specialRequests, 
    guestPreferences,
    guestInfo 
  } = bookingData;

  // Validate required guest info
  if (!guestInfo || !guestInfo.email || !guestInfo.firstName || !guestInfo.lastName) {
    throw new Error('Guest information (email, firstName, lastName) is required');
  }

  const room = await prisma.room.findUnique({
    where: { id: roomId },
  });

  if (!room) {
    throw new Error('Room not found');
  }

  // Check date-based availability
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  const isAvailable = await checkRoomAvailabilityInternal(roomId, checkIn, checkOut);
  if (!isAvailable) {
    throw new Error('Room is not available for the selected dates');
  }

  // Find or create guest user
  let user = await prisma.user.findUnique({
    where: { email: guestInfo.email },
  });

  if (!user) {
    // Create new guest user with random password (they can reset later)
    const randomPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    user = await prisma.user.create({
      data: {
        email: guestInfo.email,
        password: hashedPassword,
        firstName: guestInfo.firstName,
        lastName: guestInfo.lastName,
        phone: guestInfo.phone || null,
        role: 'GUEST_NEW',
      },
    });

    // Create guest profile
    await prisma.guestProfile.create({
      data: {
        userId: user.id,
        isFirstVisit: true,
        discountRate: 0,
      },
    });
  }

  const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
  const totalPrice = room.currentPrice * nights;

  const booking = await prisma.booking.create({
    data: {
      bookingNumber: generateBookingNumber(),
      userId: user.id,
      roomId,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      numberOfGuests,
      totalPrice: totalPrice,
      discountApplied: 0,
      finalPrice: totalPrice,
      specialRequests,
      guestPreferences,
      status: 'CONFIRMED',
    },
    include: {
      room: true,
      user: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
        },
      },
    },
  });

  // Update room status
  await prisma.room.update({
    where: { id: roomId },
    data: { status: 'RESERVED' },
  });

  return booking;
};

// Cancel booking with 50% refund
export const cancelBooking = async (bookingId, userId) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { room: true },
  });

  if (!booking) {
    throw new Error('Booking not found');
  }

  if (booking.userId !== userId) {
    throw new Error('You can only cancel your own bookings');
  }

  if (booking.status === 'CANCELLED') {
    throw new Error('Booking is already cancelled');
  }

  if (booking.status === 'CHECKED_IN' || booking.status === 'CHECKED_OUT') {
    throw new Error('Cannot cancel a booking that has already started or completed');
  }

  // Calculate refund (50% cancellation fee)
  const cancellationFee = booking.finalPrice * 0.5;
  const refundAmount = booking.finalPrice - cancellationFee;

  const updatedBooking = await prisma.booking.update({
    where: { id: bookingId },
    data: { 
      status: 'CANCELLED',
      specialRequests: `${booking.specialRequests || ''}\n[CANCELLED] Refund: $${refundAmount.toFixed(2)}, Fee: $${cancellationFee.toFixed(2)}`,
    },
    include: { room: true },
  });

  // Make room available again
  await prisma.room.update({
    where: { id: booking.roomId },
    data: { status: 'AVAILABLE' },
  });

  return {
    booking: updatedBooking,
    cancellationFee,
    refundAmount,
    message: `Booking cancelled. Refund amount: $${refundAmount.toFixed(2)} (50% cancellation fee: $${cancellationFee.toFixed(2)})`
  };
};

// Reschedule booking with 20% price increase
export const rescheduleBooking = async (bookingId, userId, newCheckInDate, newCheckOutDate) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { room: true },
  });

  if (!booking) {
    throw new Error('Booking not found');
  }

  if (booking.userId !== userId) {
    throw new Error('You can only reschedule your own bookings');
  }

  if (booking.status === 'CANCELLED') {
    throw new Error('Cannot reschedule a cancelled booking');
  }

  if (booking.status === 'CHECKED_IN' || booking.status === 'CHECKED_OUT') {
    throw new Error('Cannot reschedule a booking that has already started or completed');
  }

  const newCheckIn = new Date(newCheckInDate);
  const newCheckOut = new Date(newCheckOutDate);
  
  if (newCheckIn >= newCheckOut) {
    throw new Error('Check-out date must be after check-in date');
  }

  // Check if room is available for new dates (excluding current booking)
  const isAvailable = await checkRoomAvailabilityInternal(booking.roomId, newCheckIn, newCheckOut, bookingId);
  if (!isAvailable) {
    throw new Error('Room is not available for the selected dates');
  }

  const nights = Math.ceil((newCheckOut - newCheckIn) / (1000 * 60 * 60 * 24));
  const basePrice = booking.room.currentPrice * nights;
  
  // Apply 20% reschedule fee
  const rescheduleFee = basePrice * 0.2;
  const newTotalPrice = basePrice + rescheduleFee;

  const updatedBooking = await prisma.booking.update({
    where: { id: bookingId },
    data: { 
      checkInDate: newCheckIn,
      checkOutDate: newCheckOut,
      totalPrice: basePrice,
      finalPrice: newTotalPrice,
      status: 'RESCHEDULED',
      specialRequests: `${booking.specialRequests || ''}\n[RESCHEDULED] New price: $${newTotalPrice.toFixed(2)} (+20% fee: $${rescheduleFee.toFixed(2)})`,
    },
    include: { room: true },
  });

  return {
    booking: updatedBooking,
    rescheduleFee,
    newTotalPrice,
    message: `Booking rescheduled. New price: $${newTotalPrice.toFixed(2)} (+20% reschedule fee: $${rescheduleFee.toFixed(2)})`
  };
};

// Check room availability for specific dates (exported version)
export const checkRoomAvailability = async (roomId, checkInDate, checkOutDate, excludeBookingId = null) => {
  return await checkRoomAvailabilityInternal(roomId, checkInDate, checkOutDate, excludeBookingId);
};
