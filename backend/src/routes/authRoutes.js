import express from 'express';
import * as authController from '../controllers/authController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authenticate, authController.logout);
router.get('/profile', authenticate, authController.getProfile);

// Verify token endpoint - used by frontend to validate stored token
router.get('/verify', authenticate, (req, res) => {
  res.json({ valid: true, user: { id: req.user.id, email: req.user.email } });
});

// Debug endpoint - check auth status without requiring auth
router.get('/debug', async (req, res) => {
  const authHeader = req.headers.authorization;
  const hasToken = !!authHeader && authHeader.startsWith('Bearer ');
  
  let tokenValid = false;
  let userId = null;
  let error = null;
  
  if (hasToken) {
    const token = authHeader.split(' ')[1];
    try {
      const jwt = await import('jsonwebtoken');
      const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-hotel-system';
      const decoded = jwt.default.verify(token, JWT_SECRET);
      tokenValid = true;
      userId = decoded.userId;
    } catch (e) {
      error = e.message;
    }
  }
  
  res.json({
    hasAuthHeader: hasToken,
    tokenValid,
    userId,
    error,
    timestamp: new Date().toISOString()
  });
});

export default router;
