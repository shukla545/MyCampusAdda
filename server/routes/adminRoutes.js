import express from 'express';
import rateLimit from 'express-rate-limit';
import { body } from 'express-validator';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import {
  loginAdmin,
  getMe,
  getDashboard,
  getAdminListings,
  getAdminListing,
  createListing,
  updateListing,
  deleteListing,
  setListingStatus,
  toggleListingFlag,
  getSubmissions,
  getSubmission,
  updateSubmissionStatus,
  updateSubmissionNotes,
  approveSubmission,
  rejectSubmission
} from '../controllers/adminController.js';

const router = express.Router();
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 15, standardHeaders: true, legacyHeaders: false });

const listingValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('type').isIn(['pg', 'mess']).withMessage('Type must be pg or mess'),
  body('price').optional({ checkFalsy: true }).isNumeric().withMessage('Price must be a number'),
  body('whatsappNumber').optional({ checkFalsy: true }).custom((value) => {
    const text = String(value || '').trim().toLowerCase();
    if (['na', 'n/a', 'not available'].includes(text)) return true;
    return String(value).replace(/\D/g, '').length >= 10;
  }).withMessage('Enter a valid WhatsApp number or leave it blank')
];

router.post('/login', authLimiter, [body('email').isEmail(), body('password').notEmpty()], validate, loginAdmin);
router.get('/me', protect, getMe);
router.get('/dashboard', protect, getDashboard);
router.get('/listings', protect, getAdminListings);
router.get('/listings/:id', protect, getAdminListing);
router.post('/listings', protect, listingValidation, validate, createListing);
router.put('/listings/:id', protect, listingValidation, validate, updateListing);
router.delete('/listings/:id', protect, deleteListing);
router.patch('/listings/:id/approve', protect, setListingStatus('approved'));
router.patch('/listings/:id/reject', protect, setListingStatus('rejected'));
router.patch('/listings/:id/verify', protect, toggleListingFlag('isVerified'));
router.patch('/listings/:id/feature', protect, toggleListingFlag('isFeatured'));
router.get('/submissions', protect, getSubmissions);
router.get('/submissions/:id', protect, getSubmission);
router.patch('/submissions/:id/approve', protect, approveSubmission);
router.patch('/submissions/:id/reject', protect, rejectSubmission);
router.patch('/submissions/:id/status', protect, updateSubmissionStatus);
router.patch('/submissions/:id/notes', protect, updateSubmissionNotes);

export default router;
