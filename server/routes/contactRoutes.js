import express from 'express';
import rateLimit from 'express-rate-limit';
import { body } from 'express-validator';
import { protect, protectUser } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import {
  getContactMessages,
  markContactMessageRead,
  replyToContactMessage,
  requestContactOtp,
  submitContactMessage
} from '../controllers/contactController.js';

const router = express.Router();
const otpLimiter = rateLimit({ windowMs: 60 * 1000, max: 3, standardHeaders: true, legacyHeaders: false });

router.post('/otp', otpLimiter, [body('email').isEmail().withMessage('Valid email is required')], validate, requestContactOtp);
router.post(
  '/messages',
  protectUser,
  [
    body('message').trim().isLength({ min: 3 }).withMessage('Message must be at least 3 characters')
  ],
  validate,
  submitContactMessage
);
router.get('/admin/messages', protect, getContactMessages);
router.patch('/admin/messages/:id/read', protect, markContactMessageRead);
router.post('/admin/messages/:id/reply', protect, [body('reply').isLength({ min: 5 }).withMessage('Reply is required')], validate, replyToContactMessage);

export default router;
