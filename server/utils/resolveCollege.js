import mongoose from 'mongoose';
import College from '../models/College.js';

const DEFAULT_COLLEGE_SLUG = 'thakur-college';

export const resolveCollege = async ({ id, slug } = {}) => {
  if (id && mongoose.Types.ObjectId.isValid(String(id))) {
    const college = await College.findById(id);
    if (college) return college;
  }

  const collegeSlug = slug || DEFAULT_COLLEGE_SLUG;
  const bySlug = await College.findOne({ slug: collegeSlug, isActive: true });
  if (bySlug) return bySlug;

  if (collegeSlug === DEFAULT_COLLEGE_SLUG) {
    const thakurCollege = await College.findOne({
      isActive: true,
      $or: [
        { name: /thakur/i },
        { slug: /thakur/i }
      ]
    });
    if (thakurCollege) return thakurCollege;
  }

  return College.findOne({ isActive: true }).sort({ createdAt: 1 });
};
