import slugify from 'slugify';
import MarketplaceListing from '../models/MarketplaceListing.js';
import User from '../models/User.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';
import { sanitizePhone } from '../utils/sanitizePhone.js';
import { getPublicMarketplacePassPlans, MARKETPLACE_FREE_LIMIT } from '../utils/marketplacePlans.js';
import { getTcetEmail, hasTcetSellerAccess } from '../utils/userAccess.js';

const categoryLabels = {
  books: 'Books',
  notes: 'Notes',
  project: 'Project',
  'question-papers': 'Question Papers',
  'lab-files': 'Lab Files',
  other: 'Other'
};

const cleanText = (value) => {
  if (value === undefined || value === null) return undefined;
  const text = String(value).trim().replace(/\s+/g, ' ');
  return text || undefined;
};

const cleanLongText = (value) => {
  if (value === undefined || value === null) return undefined;
  const text = String(value).trim();
  return text || undefined;
};

const cleanImages = (images) =>
  (Array.isArray(images) ? images : [])
    .map((image) => String(image || '').trim())
    .filter(Boolean)
    .slice(0, 8);

const cleanPrice = (value) => {
  const price = Number(value);
  return Number.isFinite(price) && price >= 0 ? price : undefined;
};

const createMarketplaceSlug = async (title, listingId) => {
  const base = slugify(title || 'study-material', { lower: true, strict: true }) || 'study-material';
  let slug = base;
  let suffix = 2;
  const query = listingId ? { slug, _id: { $ne: listingId } } : { slug };
  while (await MarketplaceListing.exists(query)) {
    slug = `${base}-${suffix}`;
    suffix += 1;
    query.slug = slug;
  }
  return slug;
};

const toPublicListing = (listing) => ({
  id: listing._id,
  title: listing.title,
  slug: listing.slug,
  category: listing.category,
  categoryLabel: categoryLabels[listing.category] || 'Material',
  condition: listing.condition,
  price: listing.price,
  priceText: listing.priceText,
  description: listing.description,
  images: listing.images || [],
  status: listing.status,
  availability: listing.availability,
  viewCount: listing.viewCount,
  contactLocked: true,
  createdAt: listing.createdAt
});

const toSellerListing = (listing) => ({
  ...toPublicListing(listing),
  sellerName: listing.sellerName,
  primaryPhone: listing.primaryPhone,
  extraPhone: listing.extraPhone,
  branch: listing.branch,
  studentDetails: listing.studentDetails,
  passUsed: listing.passUsed,
  adminNotes: listing.adminNotes,
  contactViewCount: listing.contactViewCount
});

const sellerAllowance = (user, activeListingCount) => ({
  freeLimit: MARKETPLACE_FREE_LIMIT,
  activeListingCount,
  freeRemaining: Math.max(0, MARKETPLACE_FREE_LIMIT - activeListingCount),
  sellPasses: user?.marketplaceSellPasses || 0,
  tcetEmail: getTcetEmail(user),
  tcetEmailVerified: hasTcetSellerAccess(user),
  plans: getPublicMarketplacePassPlans()
});

export const getMarketplaceListings = asyncHandler(async (req, res) => {
  const filter = { status: 'approved', availability: 'available' };
  if (req.query.category) filter.category = req.query.category;
  if (req.query.condition) filter.condition = req.query.condition;
  if (req.query.search) {
    const search = new RegExp(String(req.query.search).trim(), 'i');
    filter.$or = [
      { title: search },
      { description: search },
      { branch: search }
    ];
  }

  const sortMap = {
    newest: { createdAt: -1 },
    popular: { viewCount: -1, createdAt: -1 },
    'price-asc': { price: 1 },
    'price-desc': { price: -1 }
  };
  const sort = sortMap[req.query.sort] || sortMap.newest;

  const listings = await MarketplaceListing.find(filter).sort(sort).limit(80);
  res.json({ listings: listings.map(toPublicListing), contactDisclaimer: 'Pay only after you receive and inspect the product. Do not pay in advance.' });
});

export const getMarketplaceListingBySlug = asyncHandler(async (req, res) => {
  const listing = await MarketplaceListing.findOneAndUpdate(
    { slug: req.params.slug, status: 'approved', availability: 'available' },
    { $inc: { viewCount: 1 } },
    { new: true }
  );

  if (!listing) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json({
    listing: toPublicListing(listing),
    contactDisclaimer: 'Pay only after you receive and inspect the product. Do not pay in advance.'
  });
});

export const getMarketplaceContact = asyncHandler(async (req, res) => {
  const listing = await MarketplaceListing.findOneAndUpdate(
    { slug: req.params.slug, status: 'approved', availability: 'available' },
    { $inc: { contactViewCount: 1 } },
    { new: true }
  );

  if (!listing) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json({
    contact: {
      sellerName: listing.sellerName,
      primaryPhone: listing.primaryPhone,
      extraPhone: listing.extraPhone,
      branch: listing.branch,
      studentDetails: listing.studentDetails
    },
    disclaimer: 'Pay only after you receive and inspect the product. Do not pay in advance.'
  });
});

export const getMyMarketplaceListings = asyncHandler(async (req, res) => {
  const [listings, activeListingCount, user] = await Promise.all([
    MarketplaceListing.find({ seller: req.user._id }).sort({ createdAt: -1 }),
    MarketplaceListing.countDocuments({ seller: req.user._id, status: { $ne: 'rejected' } }),
    User.findById(req.user._id).select('-passwordHash')
  ]);

  res.json({
    listings: listings.map(toSellerListing),
    allowance: sellerAllowance(user, activeListingCount)
  });
});

export const createMarketplaceListing = asyncHandler(async (req, res) => {
  if (!hasTcetSellerAccess(req.user)) {
    res.status(403).json({
      success: false,
      code: 'TCET_EMAIL_REQUIRED',
      message: 'Verify your TCET email before selling study material.'
    });
    return;
  }

  const images = cleanImages(req.body.images);
  const title = cleanText(req.body.title);
  const description = cleanLongText(req.body.description);
  const price = cleanPrice(req.body.price);
  const primaryPhone = sanitizePhone(req.body.primaryPhone);
  const extraPhone = req.body.extraPhone ? sanitizePhone(req.body.extraPhone) : undefined;
  const sellerName = cleanText(req.body.sellerName) || req.user.name;
  const branch = cleanText(req.body.branch);

  if (!images.length) {
    res.status(422);
    throw new Error('Upload at least 1 product image');
  }
  if (!title || title.length < 4) {
    res.status(422);
    throw new Error('Product title is required');
  }
  if (!description || description.length < 20) {
    res.status(422);
    throw new Error('Write at least 20 characters about the product');
  }
  if (price === undefined) {
    res.status(422);
    throw new Error('Enter a valid selling price');
  }
  if (!primaryPhone || primaryPhone.length < 10) {
    res.status(422);
    throw new Error('Enter a valid contact number');
  }
  if (!branch) {
    res.status(422);
    throw new Error('Branch is required');
  }

  const activeListingCount = await MarketplaceListing.countDocuments({ seller: req.user._id, status: { $ne: 'rejected' } });
  let passUsed = false;
  let updatedUser = req.user;

  if (activeListingCount >= MARKETPLACE_FREE_LIMIT) {
    updatedUser = await User.findOneAndUpdate(
      { _id: req.user._id, marketplaceSellPasses: { $gt: 0 } },
      { $inc: { marketplaceSellPasses: -1 } },
      { new: true }
    ).select('-passwordHash');

    if (!updatedUser) {
      res.status(402).json({
        success: false,
        code: 'SELL_PASS_REQUIRED',
        message: 'Your 2 free product listings are used. Buy a Sell Pass to add more products.',
        allowance: sellerAllowance(req.user, activeListingCount)
      });
      return;
    }
    passUsed = true;
  }

  try {
    const listing = await MarketplaceListing.create({
      title,
      slug: await createMarketplaceSlug(title),
      seller: req.user._id,
      sellerName,
      primaryPhone,
      extraPhone,
      branch,
      studentDetails: cleanLongText(req.body.studentDetails),
      category: cleanText(req.body.category) || 'books',
      condition: cleanText(req.body.condition) || 'good',
      price,
      priceText: `Rs. ${price}`,
      description,
      images,
      status: 'pending',
      passUsed
    });

    res.status(201).json({
      success: true,
      message: 'Product submitted. Wait for admin approval.',
      listing: toSellerListing(listing),
      allowance: sellerAllowance(updatedUser, activeListingCount + 1)
    });
  } catch (error) {
    if (passUsed) {
      await User.findByIdAndUpdate(req.user._id, { $inc: { marketplaceSellPasses: 1 } });
    }
    throw error;
  }
});

export const getAdminMarketplaceListings = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.category) filter.category = req.query.category;
  if (req.query.search) {
    const search = new RegExp(String(req.query.search).trim(), 'i');
    filter.$or = [
      { title: search },
      { sellerName: search },
      { branch: search },
      { primaryPhone: search },
      { description: search }
    ];
  }

  const listings = await MarketplaceListing.find(filter)
    .populate('seller', 'name email')
    .sort({ createdAt: -1 });
  res.json(listings);
});

export const setMarketplaceListingStatus = (status) => asyncHandler(async (req, res) => {
  const listing = await MarketplaceListing.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!listing) {
    res.status(404);
    throw new Error('Marketplace product not found');
  }
  res.json(listing);
});

export const deleteMarketplaceListing = asyncHandler(async (req, res) => {
  const listing = await MarketplaceListing.findByIdAndDelete(req.params.id);
  if (!listing) {
    res.status(404);
    throw new Error('Marketplace product not found');
  }
  res.json({ message: 'Marketplace product deleted' });
});
