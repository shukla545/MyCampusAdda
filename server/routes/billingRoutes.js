import express from 'express';
import { body } from 'express-validator';
import {
  checkChatCreditPaymentLink,
  checkChatCreditQrPayment,
  createChatCreditOrder,
  createChatCreditQr,
  createMarketplacePassOrder,
  getChatPlans,
  getMarketplacePassPlans,
  verifyChatCreditPayment,
  verifyMarketplacePassPayment
} from '../controllers/billingController.js';
import { protectUser } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';

const router = express.Router();

router.get('/plans', getChatPlans);
router.get('/marketplace-plans', getMarketplacePassPlans);
router.post('/create-order', protectUser, [body('planId').notEmpty().withMessage('Plan is required')], validate, createChatCreditOrder);
router.post('/verify', protectUser, verifyChatCreditPayment);
router.post('/marketplace/create-order', protectUser, [body('planId').notEmpty().withMessage('Plan is required')], validate, createMarketplacePassOrder);
router.post('/marketplace/verify', protectUser, verifyMarketplacePassPayment);
router.post('/create-qr', protectUser, [body('planId').notEmpty().withMessage('Plan is required')], validate, createChatCreditQr);
router.post('/qr-status', protectUser, [body('qrCodeId').notEmpty().withMessage('QR code id is required')], validate, checkChatCreditQrPayment);
router.post('/payment-link-status', protectUser, [body('paymentLinkId').notEmpty().withMessage('Payment link id is required')], validate, checkChatCreditPaymentLink);

export default router;
