import express from 'express';
import * as userController from '../controllers/userController.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.get('/profile', authenticate, userController.getProfile);
router.put('/profile', authenticate, userController.updateProfile);

router.get(
  '/',
  authenticate,
  authorize('ADMIN'),
  userController.getAllUsers
);

router.get(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  userController.getUserById
);

router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  userController.deleteUser
);

export default router;
