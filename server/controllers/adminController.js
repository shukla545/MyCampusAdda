import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Listing from '../models/Listing.js';
import OwnerSubmission from '../models/OwnerSubmission.js';
import Admin from '../models/Admin.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';
import { sanitizePhone } from '../utils/sanitizePhone.js';
import { createUniqueListingSlug } from '../utils/createUniqueListingSlug.js';
import { resolveCollege } from '../utils/resolveCollege.js';
import { buildListingQuery } from './listingController.js';

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

const splitLines = (value = '') =>
  Array.isArray(value)
    ? value.map((item) => String(item).trim()).filter(Boolean)
    : String(value).split('\n').map((item) => item.trim()).filter(Boolean);

const cleanText = (value) => {
  if (value === undefined || value === null) return undefined;
  const text = String(value).trim();
  return text || undefined;
};

const cleanNumber = (value) => {
  if (value === undefined || value === null || value === '') return undefined;
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
};

const cleanBoolean = (value) => value === true || value === 'true' || value === 'on';

const normalizeListingPayload = async (body, listingId) => {
  const collegeId = typeof body.college === 'object' ? body.college?._id : body.college || body.collegeId;
  const college = await resolveCollege({ id: collegeId, slug: body.collegeSlug });
  if (!college) throw new Error('No active college found. Please seed a college before saving listings.');

  return {
    title: body.title,
    slug: await createUniqueListingSlug(body.slug || body.title, listingId),
    type: body.type,
    college: college._id,
    area: cleanText(body.area),
    address: cleanText(body.address),
    distanceText: cleanText(body.distanceText),
    price: cleanNumber(body.price),
    priceText: cleanText(body.priceText),
    description: cleanText(body.description),
    images: body.images || [],
    contactName: cleanText(body.contactName),
    whatsappNumber: sanitizePhone(body.whatsappNumber),
    facilities: body.facilities || splitLines(body.facilitiesText),
    status: body.status || 'pending',
    isVerified: cleanBoolean(body.isVerified),
    isFeatured: cleanBoolean(body.isFeatured),
    faqs: body.faqs || [],
    pgDetails: body.type === 'pg' ? body.pgDetails || {} : undefined,
    messDetails: body.type === 'mess' ? body.messDetails || {} : undefined
  };
};

export const loginAdmin = asyncHandler(async (req, res) => {
  const admin = await Admin.findOne({ email: req.body.email?.toLowerCase() });
  if (!admin || !(await bcrypt.compare(req.body.password, admin.passwordHash))) {
    res.status(401);
    throw new Error('Invalid admin credentials');
  }

  res.json({
    token: signToken(admin._id),
    admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role }
  });
});

export const getMe = asyncHandler(async (req, res) => {
  res.json(req.admin);
});

export const getDashboard = asyncHandler(async (req, res) => {
  const [totalListings, totalPGs, totalMess, pendingListings, approvedListings, featuredListings, verifiedListings, newSubmissions, recentListings, recentSubmissions] = await Promise.all([
    Listing.countDocuments(),
    Listing.countDocuments({ type: 'pg' }),
    Listing.countDocuments({ type: 'mess' }),
    Listing.countDocuments({ status: 'pending' }),
    Listing.countDocuments({ status: 'approved' }),
    Listing.countDocuments({ isFeatured: true }),
    Listing.countDocuments({ isVerified: true }),
    OwnerSubmission.countDocuments({ status: 'new' }),
    Listing.find().sort({ createdAt: -1 }).limit(6).populate('college', 'name'),
    OwnerSubmission.find().sort({ createdAt: -1 }).limit(6).populate('college', 'name')
  ]);

  res.json({ totalListings, totalPGs, totalMess, pendingListings, approvedListings, featuredListings, verifiedListings, newSubmissions, recentListings, recentSubmissions });
});

export const getAdminListings = asyncHandler(async (req, res) => {
  const filter = await buildListingQuery(req.query, false);
  const listings = await Listing.find(filter).populate('college', 'name slug').sort({ createdAt: -1 });
  res.json(listings);
});

export const getAdminListing = asyncHandler(async (req, res) => {
  const listing = await Listing.findById(req.params.id).populate('college', 'name slug');
  if (!listing) {
    res.status(404);
    throw new Error('Listing not found');
  }
  res.json(listing);
});

export const createListing = asyncHandler(async (req, res) => {
  const payload = await normalizeListingPayload(req.body);
  const listing = await Listing.create(payload);
  res.status(201).json(listing);
});

export const updateListing = asyncHandler(async (req, res) => {
  const payload = await normalizeListingPayload(req.body, req.params.id);
  const listing = await Listing.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });
  if (!listing) {
    res.status(404);
    throw new Error('Listing not found');
  }
  res.json(listing);
});

export const deleteListing = asyncHandler(async (req, res) => {
  const listing = await Listing.findByIdAndDelete(req.params.id);
  if (!listing) {
    res.status(404);
    throw new Error('Listing not found');
  }
  res.json({ message: 'Listing deleted' });
});

export const setListingStatus = (status) => asyncHandler(async (req, res) => {
  const listing = await Listing.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!listing) {
    res.status(404);
    throw new Error('Listing not found');
  }
  res.json(listing);
});

export const toggleListingFlag = (field) => asyncHandler(async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    res.status(404);
    throw new Error('Listing not found');
  }
  listing[field] = !listing[field];
  await listing.save();
  res.json(listing);
});

export const getSubmissions = asyncHandler(async (req, res) => {
  const submissions = await OwnerSubmission.find()
    .populate('college', 'name slug')
    .populate('listing', 'title slug status price priceText area images')
    .sort({ createdAt: -1 });
  res.json(submissions);
});

export const getSubmission = asyncHandler(async (req, res) => {
  const submission = await OwnerSubmission.findById(req.params.id)
    .populate('college', 'name slug')
    .populate('listing', 'title slug status price priceText area images');
  if (!submission) {
    res.status(404);
    throw new Error('Submission not found');
  }
  res.json(submission);
});

export const updateSubmissionStatus = asyncHandler(async (req, res) => {
  const nextStatus = req.body.status;
  if (nextStatus === 'approved' || nextStatus === 'rejected') {
    const result = await getSubmissionWithListing(req.params.id);
    if (!result) {
      res.status(404);
      throw new Error('Submission not found');
    }
    result.listing.status = nextStatus;
    result.submission.status = nextStatus;
    await Promise.all([result.listing.save(), result.submission.save()]);
    res.json(result.submission);
    return;
  }

  const submission = await OwnerSubmission.findByIdAndUpdate(req.params.id, { status: nextStatus }, { new: true });
  if (!submission) {
    res.status(404);
    throw new Error('Submission not found');
  }
  res.json(submission);
});

export const updateSubmissionNotes = asyncHandler(async (req, res) => {
  const submission = await OwnerSubmission.findByIdAndUpdate(req.params.id, { adminNotes: req.body.adminNotes }, { new: true });
  res.json(submission);
});

const getSubmissionWithListing = async (id) => {
  const submission = await OwnerSubmission.findById(id);
  if (!submission) return null;

  let listing = submission.listing ? await Listing.findById(submission.listing) : null;
  if (!listing) {
    const college = await resolveCollege({ id: submission.college });
    if (!college) {
      const error = new Error('No active college found. Please seed a college before approving submissions.');
      error.statusCode = 400;
      throw error;
    }
    listing = await Listing.create({
      title: submission.businessName,
      slug: await createUniqueListingSlug(submission.businessName),
      type: submission.businessType,
      college: college._id,
      address: submission.address,
      images: submission.images || [],
      contactName: submission.ownerName,
      whatsappNumber: sanitizePhone(submission.phone),
      description: submission.message,
      status: 'pending',
      messDetails: submission.businessType === 'mess' ? { offlineOnly: true } : undefined
    });
    submission.listing = listing._id;
  }

  return { submission, listing };
};

export const approveSubmission = asyncHandler(async (req, res) => {
  const result = await getSubmissionWithListing(req.params.id);
  if (!result) {
    res.status(404);
    throw new Error('Submission not found');
  }

  result.listing.status = 'approved';
  result.submission.status = 'approved';
  await Promise.all([result.listing.save(), result.submission.save()]);

  res.json({ message: 'Submission approved', submission: result.submission, listing: result.listing });
});

export const rejectSubmission = asyncHandler(async (req, res) => {
  const result = await getSubmissionWithListing(req.params.id);
  if (!result) {
    res.status(404);
    throw new Error('Submission not found');
  }

  result.listing.status = 'rejected';
  result.submission.status = 'rejected';
  await Promise.all([result.listing.save(), result.submission.save()]);

  res.json({ message: 'Submission rejected', submission: result.submission, listing: result.listing });
});
