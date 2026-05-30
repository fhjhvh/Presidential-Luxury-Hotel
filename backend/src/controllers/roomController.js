import * as roomService from '../services/roomService.js';

export const createRoom = async (req, res, next) => {
  try {
    const room = await roomService.createRoom(req.body);
    res.status(201).json(room);
  } catch (error) {
    next(error);
  }
};

export const getAllRooms = async (req, res, next) => {
  try {
    const rooms = await roomService.getAllRooms(req.query);
    res.json(rooms);
  } catch (error) {
    next(error);
  }
};

export const getRoomById = async (req, res, next) => {
  try {
    const room = await roomService.getRoomById(req.params.id);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    res.json(room);
  } catch (error) {
    next(error);
  }
};

export const updateRoom = async (req, res, next) => {
  try {
    const room = await roomService.updateRoom(req.params.id, req.body);
    res.json(room);
  } catch (error) {
    next(error);
  }
};

export const deleteRoom = async (req, res, next) => {
  try {
    await roomService.deleteRoom(req.params.id);
    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const filterRoomsByPreferences = async (req, res, next) => {
  try {
    const rooms = await roomService.filterRoomsByPreferences(req.body);
    res.json(rooms);
  } catch (error) {
    next(error);
  }
};
