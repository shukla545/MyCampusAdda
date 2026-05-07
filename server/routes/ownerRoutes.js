import express from 'express';
import { body } from 'express-validator';
import { createOwnerSubmission } from '../controllers/ownerController.js';
import { protectUser } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';

const router = express.Router();

router.post(
  '/',
  protectUser,
  [
    body('ownerName').notEmpty().withMessage('Owner name is required'),
    body('businessName').notEmpty().withMessage('Business name is required'),
    body('businessType').isIn(['pg', 'mess']).withMessage('Business type must be pg or mess'),
    body('phone').optional({ checkFalsy: true }).custom((value) => {
      const text = String(value || '').trim().toLowerCase();
      if (['na', 'n/a', 'not available'].includes(text)) return true;
      return String(value).replace(/\D/g, '').length >= 10;
    }).withMessage('Enter a valid WhatsApp number or leave it blank')
  ],
  validate,
  createOwnerSubmission
);

export default router;
