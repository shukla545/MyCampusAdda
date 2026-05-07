import College from '../models/College.js';
import Listing from '../models/Listing.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';
import { resolveCollege } from '../utils/resolveCollege.js';

export const getColleges = asyncHandler(async (req, res) => {
  const colleges = await College.find({ isActive: true }).sort('name');
  res.json(colleges);
});

export const getCollegeBySlug = asyncHandler(async (req, res) => {
  const college = await resolveCollege({ slug: req.params.slug });
  if (!college) {
    res.status(404);
    throw new Error('College not found');
  }

  const [totalPG, totalMess, verified, featuredPG, featuredMess] = await Promise.all([
    Listing.countDocuments({ college: college._id, type: 'pg', status: 'approved' }),
    Listing.countDocuments({ college: college._id, type: 'mess', status: 'approved' }),
    Listing.countDocuments({ college: college._id, status: 'approved', isVerified: true }),
    Listing.find({ college: college._id, type: 'pg', status: 'approved', isFeatured: true }).limit(4),
    Listing.find({ college: college._id, type: 'mess', status: 'approved', isFeatured: true }).limit(4)
  ]);

  res.json({ college, stats: { totalPG, totalMess, verified }, featuredPG, featuredMess });
});
