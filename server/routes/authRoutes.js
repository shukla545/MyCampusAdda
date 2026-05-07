import express from 'express';
import rateLimit from 'express-rate-limit';
import { body } from 'express-validator';
import { getCurrentUser, loginUser, logoutUser, requestSignupOtp, verifySignup } from '../controllers/authController.js';
import { protectUser } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';

const router = express.Router();
const authLimiter = rateLimit({ windowMs: 60 * 1000, max: 8, standardHeaders: true, legacyHeaders: false });

router.post(
  '/signup/request-otp',
  authLimiter,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required')
  ],
  validate,
  requestSignupOtp
);

router.post(
  '/signup/verify',
  authLimiter,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('otp').notEmpty().withMessage('OTP is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
  ],
  validate,
  verifySignup
);

router.post(
  '/login',
  authLimiter,
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  validate,
  loginUser
);

router.post('/logout', logoutUser);
router.get('/me', protectUser, getCurrentUser);

export default router;
