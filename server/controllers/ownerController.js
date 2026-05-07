import { asyncHandler } from '../middleware/errorMiddleware.js';
import OwnerSubmission from '../models/OwnerSubmission.js';
import Listing from '../models/Listing.js';
import { sanitizePhone } from '../utils/sanitizePhone.js';
import { createUniqueListingSlug } from '../utils/createUniqueListingSlug.js';
import { resolveCollege } from '../utils/resolveCollege.js';

const splitLines = (value = '') =>
  Array.isArray(value)
    ? value.map((item) => String(item).trim()).filter(Boolean)
    : String(value).split('\n').map((item) => item.trim()).filter(Boolean);

const optionalNumber = (value) => {
  if (value === undefined || value === null || value === '') return undefined;
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
};

const optionalBoolean = (value) => value === true || value === 'true' || value === 'on';

export const createOwnerSubmission = asyncHandler(async (req, res) => {
  const ownerName = req.body.ownerName || req.user?.name;
  const college = await resolveCollege({ slug: req.body.collegeSlug });
  if (!college) {
    res.status(400);
    throw new Error('No active college found. Please seed a college before accepting listings.');
  }

  const phone = sanitizePhone(req.body.phone);
  const images = req.body.images || [];
  const facilities = splitLines(req.body.facilitiesText || req.body.facilities);
  const listing = await Listing.create({
    title: req.body.businessName,
    slug: await createUniqueListingSlug(req.body.businessName),
    type: req.body.businessType,
    college: college._id,
    area: req.body.area,
    address: req.body.address,
    distanceText: req.body.distanceText,
    price: optionalNumber(req.body.price),
    priceText: req.body.priceText,
    description: req.body.description || req.body.message,
    images,
    contactName: ownerName,
    contactEmail: req.user?.email,
    ownerUser: req.user?._id,
    whatsappNumber: phone,
    facilities,
    status: 'pending',
    pgDetails: req.body.businessType === 'pg' ? {
      gender: req.body.gender || undefined,
      sharingType: req.body.sharingType,
      foodIncluded: optionalBoolean(req.body.foodIncluded),
      deposit: optionalNumber(req.body.deposit),
      availableBeds: optionalNumber(req.body.availableBeds)
    } : undefined,
    messDetails: req.body.businessType === 'mess' ? {
      foodType: req.body.foodType || undefined,
      meals: splitLines(req.body.mealsText || req.body.meals),
      monthlyPrice: optionalNumber(req.body.monthlyPrice || req.body.price),
      trialAvailable: optionalBoolean(req.body.trialAvailable),
      offlineOnly: optionalBoolean(req.body.offlineOnly)
    } : undefined
  });

  const submission = await OwnerSubmission.create({
    ownerName,
    ownerEmail: req.user?.email,
    ownerUser: req.user?._id,
    businessName: req.body.businessName,
    businessType: req.body.businessType,
    phone,
    address: req.body.address,
    college: college._id,
    listing: listing._id,
    message: req.body.message,
    images,
    status: 'new'
  });

  res.status(201).json({ message: 'Submission received', submission, listing });
});
