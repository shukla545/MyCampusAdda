import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import Admin from '../models/Admin.js';
import User from '../models/User.js';
import UserOtp from '../models/UserOtp.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';
import { sendSignupOtpEmail } from '../services/auth/sendSignupOtpEmail.js';

const COOKIE_NAME = 'campusnest_user_token';
const LEGACY_COOKIE_NAME = 'mca_user_token';
const OTP_EXPIRY_SECONDS = 10 * 60;
const TCET_EMAIL_DOMAIN = 'tcetmumbai.in';
const isProduction = process.env.NODE_ENV === 'production';

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();
const cleanName = (name) => String(name || '').trim().replace(/\s+/g, ' ');
const createOtp = () => String(Math.floor(100000 + Math.random() * 900000));

const hashOtp = (email, otp, purpose = 'signup') =>
  crypto.createHash('sha256').update(`${email}:${otp}:${process.env.JWT_SECRET || 'campusnest'}:${purpose}`).digest('hex');

const signUserToken = (id) => jwt.sign({ id, type: 'user' }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

const cookieOptions = {
  httpOnly: true,
  sameSite: isProduction ? 'none' : 'lax',
  secure: isProduction,
  maxAge: 7 * 24 * 60 * 60 * 1000
};

const toPublicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  emailVerified: user.emailVerified,
  tcetEmail: user.tcetEmail,
  tcetEmailVerified: Boolean(user.tcetEmailVerified),
  role: user.role,
  freeChatUsed: Boolean(user.freeChatUsed),
  remainingFreeMessages: user.freeChatUsed ? 0 : 1,
  chatCredits: user.chatCredits || 0,
  marketplaceSellPasses: user.marketplaceSellPasses || 0,
  totalChatMessages: user.totalChatMessages || 0
});

const setUserCookie = (res, user) => {
  res.cookie(COOKIE_NAME, signUserToken(user._id), cookieOptions);
};

const clearUserCookie = (res) => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    sameSite: isProduction ? 'none' : 'lax',
    secure: isProduction
  });
  res.clearCookie(LEGACY_COOKIE_NAME, {
    httpOnly: true,
    sameSite: isProduction ? 'none' : 'lax',
    secure: isProduction
  });
};

export const requestSignupOtp = asyncHandler(async (req, res) => {
  const name = cleanName(req.body.name);
  const email = normalizeEmail(req.body.email);

  if (!name || name.length < 2) {
    res.status(422);
    throw new Error('Enter your full name');
  }
  if (!validator.isEmail(email)) {
    res.status(422);
    throw new Error('Enter a valid email address');
  }

  const existingUser = await User.findOne({ email });
  const existingAdmin = await Admin.findOne({ email });
  if (existingUser || existingAdmin) {
    res.status(409);
    throw new Error('Account already exists. Please login instead.');
  }

  const otp = createOtp();
  await UserOtp.findOneAndUpdate(
    { email, purpose: 'signup' },
    {
      name,
      email,
      purpose: 'signup',
      otpHash: hashOtp(email, otp, 'signup'),
      expiresAt: new Date(Date.now() + OTP_EXPIRY_SECONDS * 1000),
      attempts: 0
    },
    { upsert: true, new: true }
  );

  const emailResult = await sendSignupOtpEmail({ email, name, otp });
  res.json({
    success: true,
    message: emailResult.sent ? 'OTP sent to your email' : 'Development OTP generated',
    expiresInSeconds: OTP_EXPIRY_SECONDS,
    devOtp: !emailResult.sent && !isProduction ? otp : undefined
  });
});

export const verifySignup = asyncHandler(async (req, res) => {
  const name = cleanName(req.body.name);
  const email = normalizeEmail(req.body.email);
  const otp = String(req.body.otp || '').trim();
  const password = String(req.body.password || '');

  if (!name || name.length < 2) {
    res.status(422);
    throw new Error('Enter your full name');
  }
  if (!validator.isEmail(email)) {
    res.status(422);
    throw new Error('Enter a valid email address');
  }
  if (!otp || otp.length !== 6) {
    res.status(422);
    throw new Error('Enter the 6 digit OTP');
  }
  if (password.length < 8) {
    res.status(422);
    throw new Error('Password must be at least 8 characters');
  }

  const existingUser = await User.findOne({ email });
  const existingAdmin = await Admin.findOne({ email });
  if (existingUser || existingAdmin) {
    res.status(409);
    throw new Error('Account already exists. Please login instead.');
  }

  const otpRecord = await UserOtp.findOne({ email, purpose: 'signup' });
  if (!otpRecord || otpRecord.expiresAt < new Date()) {
    res.status(400);
    throw new Error('OTP expired. Please request a new OTP.');
  }
  if (otpRecord.attempts >= 5) {
    res.status(429);
    throw new Error('Too many OTP attempts. Please request a new OTP.');
  }
  if (otpRecord.otpHash !== hashOtp(email, otp, 'signup')) {
    otpRecord.attempts += 1;
    await otpRecord.save();
    res.status(400);
    throw new Error('Invalid OTP');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash, emailVerified: true });
  await UserOtp.deleteOne({ email, purpose: 'signup' });
  setUserCookie(res, user);

  res.status(201).json({ success: true, message: 'Account created', user: toPublicUser(user) });
});

export const loginUser = asyncHandler(async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const password = String(req.body.password || '');
  let user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    const admin = await Admin.findOne({ email });
    if (admin && await bcrypt.compare(password, admin.passwordHash)) {
      user = await User.findOneAndUpdate(
        { email },
        {
          name: admin.name || 'Admin',
          email,
          passwordHash: admin.passwordHash,
          emailVerified: true,
          role: 'admin'
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }
  }

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }
  if (!user.emailVerified) {
    res.status(403);
    throw new Error('Please verify your email before logging in');
  }

  if (user.role === 'admin') {
    user.freeChatUsed = false;
    await user.save();
  }

  setUserCookie(res, user);
  res.json({ success: true, message: 'Logged in', user: toPublicUser(user) });
});

export const logoutUser = asyncHandler(async (req, res) => {
  clearUserCookie(res);
  res.json({ success: true, message: 'Logged out' });
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  res.json({ user: toPublicUser(req.user) });
});

export const requestTcetSellerOtp = asyncHandler(async (req, res) => {
  const email = normalizeEmail(req.body.email);

  if (!validator.isEmail(email) || !email.endsWith(`@${TCET_EMAIL_DOMAIN}`)) {
    res.status(422);
    throw new Error(`Use your TCET email ending with @${TCET_EMAIL_DOMAIN}`);
  }

  const existingUser = await User.findOne({ tcetEmail: email, _id: { $ne: req.user._id } });
  if (existingUser) {
    res.status(409);
    throw new Error('This TCET email is already linked with another CampusNest account.');
  }

  const otp = createOtp();
  await UserOtp.findOneAndUpdate(
    { email, purpose: 'tcet-seller' },
    {
      name: req.user.name,
      email,
      purpose: 'tcet-seller',
      otpHash: hashOtp(email, otp, 'tcet-seller'),
      expiresAt: new Date(Date.now() + OTP_EXPIRY_SECONDS * 1000),
      attempts: 0
    },
    { upsert: true, new: true }
  );

  const emailResult = await sendSignupOtpEmail({
    email,
    name: req.user.name,
    otp,
    subject: 'Verify your TCET seller email',
    heading: 'Verify your TCET seller email',
    intro: 'use this OTP to unlock study material selling on CampusNest:'
  });

  res.json({
    success: true,
    message: emailResult.sent ? 'OTP sent to your TCET email' : 'Development OTP generated',
    expiresInSeconds: OTP_EXPIRY_SECONDS,
    devOtp: !emailResult.sent && !isProduction ? otp : undefined
  });
});

export const verifyTcetSellerEmail = asyncHandler(async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const otp = String(req.body.otp || '').trim();

  if (!validator.isEmail(email) || !email.endsWith(`@${TCET_EMAIL_DOMAIN}`)) {
    res.status(422);
    throw new Error(`Use your TCET email ending with @${TCET_EMAIL_DOMAIN}`);
  }
  if (!otp || otp.length !== 6) {
    res.status(422);
    throw new Error('Enter the 6 digit OTP');
  }

  const existingUser = await User.findOne({ tcetEmail: email, _id: { $ne: req.user._id } });
  if (existingUser) {
    res.status(409);
    throw new Error('This TCET email is already linked with another CampusNest account.');
  }

  const otpRecord = await UserOtp.findOne({ email, purpose: 'tcet-seller' });
  if (!otpRecord || otpRecord.expiresAt < new Date()) {
    res.status(400);
    throw new Error('OTP expired. Please request a new OTP.');
  }
  if (otpRecord.attempts >= 5) {
    res.status(429);
    throw new Error('Too many OTP attempts. Please request a new OTP.');
  }
  if (otpRecord.otpHash !== hashOtp(email, otp, 'tcet-seller')) {
    otpRecord.attempts += 1;
    await otpRecord.save();
    res.status(400);
    throw new Error('Invalid OTP');
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      tcetEmail: email,
      tcetEmailVerified: true,
      tcetEmailVerifiedAt: new Date()
    },
    { new: true, runValidators: true }
  ).select('-passwordHash');
  await UserOtp.deleteOne({ email, purpose: 'tcet-seller' });

  res.json({ success: true, message: 'TCET email verified. You can now sell study material.', user: toPublicUser(user) });
});
