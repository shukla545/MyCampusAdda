import express from 'express';
import rateLimit from 'express-rate-limit';
import { body } from 'express-validator';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import {
  getContactMessages,
  markContactMessageRead,
  requestContactOtp,
  submitContactMessage
} from '../controllers/contactController.js';

const router = express.Router();
const otpLimiter = rateLimit({ windowMs: 60 * 1000, max: 3, standardHeaders: true, legacyHeaders: false });

router.post('/otp', otpLimiter, [body('email').isEmail().withMessage('Valid email is required')], validate, requestContactOtp);
router.post(
  '/messages',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('otp').notEmpty().withMessage('OTP is required'),
    body('message').isLength({ min: 10 }).withMessage('Message must be at least 10 characters')
  ],
  validate,
  submitContactMessage
);
router.get('/admin/messages', protect, getContactMessages);
router.patch('/admin/messages/:id/read', protect, markContactMessageRead);

export default router;
