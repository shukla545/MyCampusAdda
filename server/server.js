import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db.js';
import collegeRoutes from './routes/collegeRoutes.js';
import listingRoutes from './routes/listingRoutes.js';
import marketplaceRoutes from './routes/marketplaceRoutes.js';
import ownerRoutes from './routes/ownerRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';
import billingRoutes from './routes/billingRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import chatbotRoutes from './routes/chatbotRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import { protect } from './middleware/authMiddleware.js';
import { handleRazorpayWebhook } from './controllers/billingController.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const allowedOrigins = (process.env.CLIENT_URLS || process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

connectDB();

app.use(helmet());
app.use(compression());
app.post('/api/billing/webhook', express.raw({ type: 'application/json' }), handleRazorpayWebhook);
app.use(cookieParser());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

const ownerLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, standardHeaders: true, legacyHeaders: false });

app.get('/api/health', (req, res) => res.json({
  ok: true,
  app: 'CampusNest API',
  version: 'contact-otp-free-2026-05-16',
  contactOtpRequired: false
}));
app.use('/api/auth', authRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/colleges', collegeRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/owner-submissions', ownerLimiter, ownerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/ai', protect, aiRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/contact', contactRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`CampusNest API running on port ${port}`);
});
