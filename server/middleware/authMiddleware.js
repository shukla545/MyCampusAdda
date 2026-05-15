import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import User from '../models/User.js';
import { asyncHandler } from './errorMiddleware.js';
import { applyTcetEmailIfNeeded } from '../utils/userAccess.js';

export const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.split(' ')[1] : null;

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, token missing');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select('-passwordHash');
    if (!admin) {
      res.status(401);
      throw new Error('Admin account not found');
    }
    req.admin = admin;
    next();
  } catch (error) {
    res.status(401);
    throw new Error('Not authorized, token invalid');
  }
});

export const protectUser = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  const bearerToken = header.startsWith('Bearer ') ? header.split(' ')[1] : null;
  const tokens = [
    bearerToken,
    req.cookies?.campusnest_user_token,
    req.cookies?.mca_user_token
  ].filter(Boolean);

  if (!tokens.length) {
    res.status(401);
    throw new Error('Please login to continue');
  }

  for (const token of tokens) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.type !== 'user') {
        continue;
      }
      const user = await User.findById(decoded.id).select('-passwordHash');
      if (!user || !user.emailVerified) {
        continue;
      }
      req.user = await applyTcetEmailIfNeeded(user);
      next();
      return;
    } catch (error) {
      // Try the next available session source. Browsers can keep an old cookie
      // while the fresh login token is present in localStorage.
    }
  }

  res.status(401);
  throw new Error('Please login again');
});
