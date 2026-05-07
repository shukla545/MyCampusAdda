import Listing from '../models/Listing.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';
import { resolveCollege } from '../utils/resolveCollege.js';

const buildListingQuery = async (query, publicOnly = true) => {
  const filter = {};
  if (publicOnly) filter.status = 'approved';
  else if (query.status) filter.status = query.status;

  if (query.college) {
    const college = await resolveCollege({ slug: query.college });
    if (college) filter.college = college._id;
  }
  if (query.type) filter.type = query.type;
  if (query.verified === 'true') filter.isVerified = true;
  if (query.featured === 'true') filter.isFeatured = true;
  if (query.minPrice || query.maxPrice) {
    filter.price = {};
    if (query.minPrice) filter.price.$gte = Number(query.minPrice);
    if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
  }
  if (query.gender) filter['pgDetails.gender'] = query.gender;
  if (query.foodIncluded === 'true') filter['pgDetails.foodIncluded'] = true;
  if (query.sharingType) filter['pgDetails.sharingType'] = new RegExp(query.sharingType, 'i');
  if (query.foodType) filter['messDetails.foodType'] = query.foodType;
  if (query.meals) filter['messDetails.meals'] = { $in: String(query.meals).split(',') };
  if (query.trialAvailable === 'true') filter['messDetails.trialAvailable'] = true;
  if (query.search) {
    const search = new RegExp(query.search, 'i');
    filter.$or = [{ title: search }, { area: search }, { facilities: search }, { description: search }];
  }
  return filter;
};

const sortMap = {
  'price-asc': { price: 1 },
  'price-desc': { price: -1 },
  newest: { createdAt: -1 },
  featured: { isFeatured: -1, createdAt: -1 }
};

export const getListings = asyncHandler(async (req, res) => {
  const filter = await buildListingQuery(req.query, true);
  const sort = sortMap[req.query.sort] || sortMap.featured;
  const listings = await Listing.find(filter).populate('college', 'name slug area city').sort(sort);
  res.json(listings);
});

export const getListingBySlug = asyncHandler(async (req, res) => {
  const listing = await Listing.findOneAndUpdate(
    { slug: req.params.slug, status: 'approved' },
    { $inc: { viewCount: 1 } },
    { new: true }
  ).populate('college', 'name slug area city');

  if (!listing) {
    res.status(404);
    throw new Error('Listing not found');
  }

  const similarListings = await Listing.find({
    _id: { $ne: listing._id },
    college: listing.college._id,
    type: listing.type,
    status: 'approved'
  }).limit(3);

  res.json({ listing, similarListings });
});

export const recordWhatsappClick = asyncHandler(async (req, res) => {
  await Listing.findByIdAndUpdate(req.params.id, { $inc: { whatsappClickCount: 1 } });
  res.json({ message: 'WhatsApp click recorded' });
});

export { buildListingQuery };
