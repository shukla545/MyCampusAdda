import Listing from '../models/Listing.js';
import { generateSlug } from './generateSlug.js';

export const createUniqueListingSlug = async (value, excludeId) => {
  const baseSlug = generateSlug(value) || `listing-${Date.now()}`;
  let slug = baseSlug;
  let suffix = 2;
  const query = excludeId ? { slug, _id: { $ne: excludeId } } : { slug };

  while (await Listing.exists(query)) {
    slug = `${baseSlug}-${suffix}`;
    query.slug = slug;
    suffix += 1;
  }

  return slug;
};
