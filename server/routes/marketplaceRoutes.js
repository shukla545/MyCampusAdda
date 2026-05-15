import express from 'express';
import { body } from 'express-validator';
import {
  createMarketplaceListing,
  deleteMyMarketplaceListing,
  getMarketplaceContact,
  getMarketplaceListingBySlug,
  getMarketplaceListings,
  getMyMarketplaceListings,
  updateMyMarketplaceListing
} from '../controllers/marketplaceController.js';
import { protectUser } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';

const router = express.Router();

const phoneValidator = (value) => String(value || '').replace(/\D/g, '').length >= 10;

const marketplaceFieldsValidation = [
  body('title').trim().isLength({ min: 4 }).withMessage('Product title is required'),
  body('category').optional({ checkFalsy: true }).isIn(['books', 'notes', 'project', 'question-papers', 'lab-files', 'other']).withMessage('Select a valid category'),
  body('price').isFloat({ min: 0 }).withMessage('Enter a valid selling price'),
  body('marketPrice').optional({ checkFalsy: true }).isFloat({ min: 0 }).withMessage('Enter a valid market price'),
  body('description').trim().isLength({ min: 20 }).withMessage('Write at least 20 characters about the product'),
  body('primaryPhone').custom(phoneValidator).withMessage('Enter a valid contact number'),
  body('extraPhone').optional({ checkFalsy: true }).custom(phoneValidator).withMessage('Enter a valid optional number'),
  body('branch').trim().notEmpty().withMessage('Branch is required'),
];

const marketplaceValidation = [
  ...marketplaceFieldsValidation,
  body('images').isArray({ min: 1 }).withMessage('Upload at least 1 image')
];

const marketplaceUpdateValidation = [
  ...marketplaceFieldsValidation,
  body('images').optional().isArray().withMessage('Images must be a list')
];

router.get('/', getMarketplaceListings);
router.get('/mine', protectUser, getMyMarketplaceListings);
router.post('/', protectUser, marketplaceValidation, validate, createMarketplaceListing);
router.patch('/:id', protectUser, marketplaceUpdateValidation, validate, updateMyMarketplaceListing);
router.delete('/:id', protectUser, deleteMyMarketplaceListing);
router.get('/:slug', getMarketplaceListingBySlug);
router.get('/:slug/contact', protectUser, getMarketplaceContact);

export default router;
