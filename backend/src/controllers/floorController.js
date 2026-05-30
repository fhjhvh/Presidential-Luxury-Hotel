import * as floorService from '../services/floorService.js';

export const createFloor = async (req, res, next) => {
  try {
    const floor = await floorService.createFloor(req.body);
    res.status(201).json(floor);
  } catch (error) {
    next(error);
  }
};

export const getAllFloors = async (req, res, next) => {
  try {
    const floors = await floorService.getAllFloors();
    res.json(floors);
  } catch (error) {
    next(error);
  }
};

export const getFloorById = async (req, res, next) => {
  try {
    const floor = await floorService.getFloorById(req.params.id);
    if (!floor) {
      return res.status(404).json({ error: 'Floor not found' });
    }
    res.json(floor);
  } catch (error) {
    next(error);
  }
};

export const updateFloor = async (req, res, next) => {
  try {
    const floor = await floorService.updateFloor(req.params.id, req.body);
    res.json(floor);
  } catch (error) {
    next(error);
  }
};

export const deleteFloor = async (req, res, next) => {
  try {
    await floorService.deleteFloor(req.params.id);
    res.json({ message: 'Floor deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const updateFloorOrder = async (req, res, next) => {
  try {
    const floors = await floorService.updateFloorOrder(req.body.floors);
    res.json(floors);
  } catch (error) {
    next(error);
  }
};
