import express from 'express';
import rateLimit from 'express-rate-limit';
import { protect, protectUser } from '../middleware/authMiddleware.js';
import { uploadImages } from '../middleware/uploadMiddleware.js';
import { uploadImagesController } from '../controllers/uploadController.js';

const router = express.Router();
const ownerUploadLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 12, standardHeaders: true, legacyHeaders: false });

router.post('/admin', protect, uploadImages, uploadImagesController('admin'));
router.post('/owner', ownerUploadLimiter, protectUser, uploadImages, uploadImagesController('owner'));

export default router;
