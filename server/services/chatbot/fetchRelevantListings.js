import Listing from '../../models/Listing.js';

const textForListing = (listing) => [
  listing.title,
  listing.area,
  listing.address,
  listing.distanceText,
  listing.description,
  ...(listing.facilities || []),
  listing.pgDetails?.gender,
  listing.pgDetails?.sharingType,
  listing.pgDetails?.foodIncluded ? 'food included' : '',
  listing.messDetails?.foodType,
  ...(listing.messDetails?.meals || []),
  listing.messDetails?.offlineOnly ? 'offline only' : ''
].filter(Boolean).join(' ').toLowerCase();

const scoreListing = (listing, intent) => {
  const text = textForListing(listing);
  let score = 0;
  if (listing.isFeatured) score += 8;
  if (listing.isVerified) score += 6;
  if (intent.gender && listing.pgDetails?.gender === intent.gender) score += 10;
  if (intent.foodType && ['both', intent.foodType].includes(listing.messDetails?.foodType)) score += 10;
  if (intent.budget && listing.price) score += Math.max(0, 10 - Math.abs(listing.price - intent.budget) / 1000);
  intent.terms.forEach((term) => {
    if (text.includes(term)) score += 3;
  });
  return score;
};

const sortListings = (listings, intent) => listings
  .map((listing) => ({ listing, score: scoreListing(listing, intent) }))
  .sort((a, b) => b.score - a.score || (a.listing.price || Number.MAX_SAFE_INTEGER) - (b.listing.price || Number.MAX_SAFE_INTEGER))
  .map(({ listing }) => listing);

export const fetchRelevantListings = async ({ intent, currentListingSlug }) => {
  const baseFilter = { status: 'approved' };
  if (intent.type) baseFilter.type = intent.type;
  if (intent.gender) baseFilter['pgDetails.gender'] = intent.gender;
  if (intent.foodType) baseFilter['messDetails.foodType'] = { $in: intent.foodType === 'veg' ? ['veg', 'both'] : ['non-veg', 'both'] };

  const currentListing = currentListingSlug
    ? await Listing.findOne({ slug: currentListingSlug, status: 'approved' }).populate('college', 'name slug')
    : null;

  let candidates = await Listing.find(baseFilter).populate('college', 'name slug').limit(30);
  let relaxedFilters = [];

  if (!candidates.length && intent.gender) {
    const relaxed = { ...baseFilter };
    delete relaxed['pgDetails.gender'];
    candidates = await Listing.find(relaxed).populate('college', 'name slug').limit(30);
    relaxedFilters.push('gender');
  }

  if (!candidates.length && intent.foodType) {
    const relaxed = { ...baseFilter };
    delete relaxed['messDetails.foodType'];
    candidates = await Listing.find(relaxed).populate('college', 'name slug').limit(30);
    relaxedFilters.push('food type');
  }

  if (!candidates.length && intent.type) {
    candidates = await Listing.find({ status: 'approved' }).populate('college', 'name slug').limit(30);
    relaxedFilters.push('listing type');
  }

  const budgetCandidates = intent.budget
    ? candidates.filter((listing) => listing.price && listing.price <= intent.budget)
    : candidates;
  const budgetMatched = !intent.budget || budgetCandidates.length > 0;
  const picked = sortListings(budgetMatched ? budgetCandidates : candidates, intent).slice(0, 5);

  let listings = picked;
  if (currentListing && !listings.some((listing) => listing._id.equals(currentListing._id))) {
    listings = [currentListing, ...listings].slice(0, 5);
  }

  return {
    listings,
    searchMeta: {
      budgetMatched,
      relaxedFilters,
      requestedBudget: intent.budget,
      usedClosestListings: Boolean(intent.budget && !budgetMatched && listings.length)
    }
  };
};
