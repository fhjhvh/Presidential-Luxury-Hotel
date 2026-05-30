import * as bookingService from '../services/bookingService.js';

export const createBooking = async (req, res, next) => {
  try {
    const booking = await bookingService.createBooking(req.body, req.user);
    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
};

export const createGuestBooking = async (req, res, next) => {
  try {
    const booking = await bookingService.createGuestBooking(req.body);
    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
};

export const cancelBooking = async (req, res, next) => {
  try {
    const result = await bookingService.cancelBooking(req.params.id, req.user.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const rescheduleBooking = async (req, res, next) => {
  try {
    const { newCheckInDate, newCheckOutDate } = req.body;
    if (!newCheckInDate || !newCheckOutDate) {
      return res.status(400).json({ error: 'New check-in and check-out dates are required' });
    }
    const result = await bookingService.rescheduleBooking(req.params.id, req.user.id, newCheckInDate, newCheckOutDate);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getUserBookings = async (req, res, next) => {
  try {
    const bookings = await bookingService.getUserBookings(req.user.id);
    res.json({ bookings });
  } catch (error) {
    next(error);
  }
};

export const getBookingById = async (req, res, next) => {
  try {
    const booking = await bookingService.getBookingById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    next(error);
  }
};

export const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const booking = await bookingService.updateBookingStatus(req.params.id, status);
    res.json(booking);
  } catch (error) {
    next(error);
  }
};

export const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await bookingService.getAllBookings(req.query);
    res.json(bookings);
  } catch (error) {
    next(error);
  }
};
