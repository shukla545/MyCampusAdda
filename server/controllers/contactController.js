import crypto from 'crypto';
import validator from 'validator';
import ContactOtp from '../models/ContactOtp.js';
import ContactMessage from '../models/ContactMessage.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';
import { sendOtpEmail } from '../services/contact/sendOtpEmail.js';

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

const hashOtp = (email, otp) =>
  crypto.createHash('sha256').update(`${email}:${otp}:${process.env.JWT_SECRET || 'mycampusadda'}`).digest('hex');

const createOtp = () => String(Math.floor(100000 + Math.random() * 900000));

const isProduction = process.env.NODE_ENV === 'production';
const OTP_EXPIRY_SECONDS = 10 * 60;

export const requestContactOtp = asyncHandler(async (req, res) => {
  const email = normalizeEmail(req.body.email);
  if (!validator.isEmail(email)) {
    res.status(422);
    throw new Error('Enter a valid email address');
  }

  const otp = createOtp();
  await ContactOtp.findOneAndUpdate(
    { email },
    {
      email,
      otpHash: hashOtp(email, otp),
      expiresAt: new Date(Date.now() + OTP_EXPIRY_SECONDS * 1000),
      attempts: 0
    },
    { upsert: true, new: true }
  );

  const emailResult = await sendOtpEmail({ email, otp });
  res.json({
    success: true,
    message: emailResult.sent ? 'OTP sent to your email' : 'Development OTP generated',
    expiresInSeconds: OTP_EXPIRY_SECONDS,
    devOtp: !emailResult.sent && !isProduction ? otp : undefined
  });
});

export const submitContactMessage = asyncHandler(async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const otp = String(req.body.otp || '').trim();
  const message = String(req.body.message || '').trim();

  if (!validator.isEmail(email)) {
    res.status(422);
    throw new Error('Enter a valid email address');
  }
  if (!otp || otp.length !== 6) {
    res.status(422);
    throw new Error('Enter the 6 digit OTP');
  }
  if (!message || message.length < 10) {
    res.status(422);
    throw new Error('Message must be at least 10 characters');
  }

  const otpRecord = await ContactOtp.findOne({ email });
  if (!otpRecord || otpRecord.expiresAt < new Date()) {
    res.status(400);
    throw new Error('OTP expired. Please request a new OTP.');
  }
  if (otpRecord.attempts >= 5) {
    res.status(429);
    throw new Error('Too many OTP attempts. Please request a new OTP.');
  }
  if (otpRecord.otpHash !== hashOtp(email, otp)) {
    otpRecord.attempts += 1;
    await otpRecord.save();
    res.status(400);
    throw new Error('Invalid OTP');
  }

  const contactMessage = await ContactMessage.create({
    name: req.body.name,
    email,
    subject: req.body.subject,
    message
  });
  await ContactOtp.deleteOne({ email });

  res.status(201).json({ success: true, message: 'Message sent to MyCampusAdda admin', contactMessage });
});

export const getContactMessages = asyncHandler(async (req, res) => {
  const messages = await ContactMessage.find().sort({ createdAt: -1 }).limit(100);
  res.json(messages);
});

export const markContactMessageRead = asyncHandler(async (req, res) => {
  const message = await ContactMessage.findByIdAndUpdate(req.params.id, { status: 'read' }, { new: true });
  if (!message) {
    res.status(404);
    throw new Error('Message not found');
  }
  res.json(message);
});
