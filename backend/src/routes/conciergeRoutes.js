import express from 'express';
import { chat, logEvent } from '../controllers/conciergeController.js';

const router = express.Router();

router.post('/chat',  chat);
router.post('/event', logEvent);

export default router;
