import crypto from 'crypto';
import validator from 'validator';
import ContactOtp from '../models/ContactOtp.js';
import ContactMessage from '../models/ContactMessage.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';
import { getAdminContactEmail, sendAdminContactEmail } from '../services/contact/sendAdminContactEmail.js';
import { sendOtpEmail } from '../services/contact/sendOtpEmail.js';
import { sendReplyEmail } from '../services/contact/sendReplyEmail.js';

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

const hashOtp = (email, otp) =>
  crypto.createHash('sha256').update(`${email}:${otp}:${process.env.JWT_SECRET || 'campusnest'}`).digest('hex');

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
  const email = normalizeEmail(req.user?.email || req.body.email);
  const message = String(req.body.message || '').trim();
  const subject = String(req.body.subject || '').trim() || 'CampusNest support message';

  if (!validator.isEmail(email)) {
    res.status(422);
    throw new Error('Your login email is invalid. Please logout and login again.');
  }
  if (!message || message.length < 3) {
    res.status(422);
    throw new Error('Message must be at least 3 characters');
  }

  const contactMessage = await ContactMessage.create({
    name: String(req.body.name || req.user?.name || email.split('@')[0]).trim(),
    email,
    subject,
    message
  });

  let adminEmailSent = false;
  try {
    const emailResult = await sendAdminContactEmail({ contactMessage });
    adminEmailSent = Boolean(emailResult.sent);
  } catch (error) {
    console.error(error.message);
  }

  res.status(201).json({
    success: true,
    message: adminEmailSent ? 'Message sent to CampusNest admin' : 'Message saved for CampusNest admin',
    adminEmail: getAdminContactEmail(),
    contactMessage
  });
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

export const replyToContactMessage = asyncHandler(async (req, res) => {
  const reply = String(req.body.reply || '').trim();
  if (!reply || reply.length < 5) {
    res.status(422);
    throw new Error('Reply must be at least 5 characters');
  }

  const message = await ContactMessage.findById(req.params.id);
  if (!message) {
    res.status(404);
    throw new Error('Message not found');
  }

  const emailResult = await sendReplyEmail({
    toEmail: message.email,
    toName: message.name,
    subject: req.body.subject || `Re: ${message.subject || 'CampusNest support'}`,
    reply,
    originalMessage: message.message
  });

  message.status = 'replied';
  message.replyMessage = reply;
  message.repliedAt = new Date();
  await message.save();

  res.json({
    success: true,
    message: emailResult.sent ? 'Reply emailed to user' : 'Reply saved. Email sending is not configured in this environment.',
    contactMessage: message
  });
});
