import express from 'express';
import * as foodController from '../controllers/foodController.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', foodController.getAllFoodItems);
router.get('/:id', foodController.getFoodItemById);

router.post('/', foodController.createFoodItem);

router.put('/:id', foodController.updateFoodItem);

router.delete('/:id', foodController.deleteFoodItem);

export default router;
