import express from 'express';
import * as chatController from '../controllers/chatController.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.post('/', authenticate, chatController.createChatSession);
router.get('/my-sessions', authenticate, chatController.getUserChatSessions);
router.get('/:id', authenticate, chatController.getChatSession);
router.post('/:sessionId/messages', authenticate, chatController.addMessage);
router.patch('/:id/data', authenticate, chatController.updateChatSessionData);
router.patch('/:id/close', authenticate, chatController.closeChatSession);

router.get(
  '/active/all',
  authenticate,
  authorize('ADMIN', 'STAFF_RECEPTION'),
  chatController.getActiveSessions
);

router.patch(
  '/:id/assign',
  authenticate,
  authorize('ADMIN', 'STAFF_RECEPTION'),
  chatController.assignStaffToSession
);

export default router;
