import express from 'express';
import rateLimit from 'express-rate-limit';
import { body } from 'express-validator';
import { askChatbot } from '../controllers/chatbotController.js';
import { protectUser } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';

const router = express.Router();
const chatbotLimiter = rateLimit({ windowMs: 60 * 1000, max: 20, standardHeaders: true, legacyHeaders: false });

router.post(
  '/ask',
  chatbotLimiter,
  protectUser,
  [
    body('message').trim().notEmpty().withMessage('Message is required'),
    body('currentPage').optional().isString(),
    body('currentListingSlug').optional().isString()
  ],
  validate,
  askChatbot
);

export default router;
