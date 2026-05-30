import * as parkingService from '../services/parkingService.js';

export const createParkingSpot = async (req, res, next) => {
  try {
    const spot = await parkingService.createParkingSpot(req.body);
    res.status(201).json(spot);
  } catch (error) {
    next(error);
  }
};

export const getAllParkingSpots = async (req, res, next) => {
  try {
    const spots = await parkingService.getAllParkingSpots();
    res.json(spots);
  } catch (error) {
    next(error);
  }
};

export const getParkingSpotById = async (req, res, next) => {
  try {
    const spot = await parkingService.getParkingSpotById(req.params.id);
    if (!spot) {
      return res.status(404).json({ error: 'Parking spot not found' });
    }
    res.json(spot);
  } catch (error) {
    next(error);
  }
};

export const updateParkingSpot = async (req, res, next) => {
  try {
    const spot = await parkingService.updateParkingSpot(req.params.id, req.body);
    res.json(spot);
  } catch (error) {
    next(error);
  }
};

export const deleteParkingSpot = async (req, res, next) => {
  try {
    await parkingService.deleteParkingSpot(req.params.id);
    res.json({ message: 'Parking spot deleted successfully' });
  } catch (error) {
    next(error);
  }
};
