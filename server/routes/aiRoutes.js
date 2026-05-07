import express from 'express';
import { generateDescription, generateFaqs, suggestImprovements } from '../controllers/aiController.js';

const router = express.Router();

router.post('/generate-description', generateDescription);
router.post('/generate-faqs', generateFaqs);
router.post('/suggest-improvements', suggestImprovements);

export default router;
