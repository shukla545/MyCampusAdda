import express from 'express';
import { getListings, getListingBySlug, recordWhatsappClick } from '../controllers/listingController.js';

const router = express.Router();

router.get('/', getListings);
router.get('/:slug', getListingBySlug);
router.post('/:id/whatsapp-click', recordWhatsappClick);

export default router;
