import * as foodService from '../services/foodService.js';

export const createFoodItem = async (req, res, next) => {
  try {
    const item = await foodService.createFoodItem(req.body);
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};

export const getAllFoodItems = async (req, res, next) => {
  try {
    const items = await foodService.getAllFoodItems(req.query);
    res.json(items);
  } catch (error) {
    next(error);
  }
};

export const getFoodItemById = async (req, res, next) => {
  try {
    const item = await foodService.getFoodItemById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Food item not found' });
    }
    res.json(item);
  } catch (error) {
    next(error);
  }
};

export const updateFoodItem = async (req, res, next) => {
  try {
    const item = await foodService.updateFoodItem(req.params.id, req.body);
    res.json(item);
  } catch (error) {
    next(error);
  }
};

export const deleteFoodItem = async (req, res, next) => {
  try {
    await foodService.deleteFoodItem(req.params.id);
    res.json({ message: 'Food item deleted successfully' });
  } catch (error) {
    next(error);
  }
};
