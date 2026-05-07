const disclaimer = 'Rent, menu, availability and facilities may change. Please confirm directly with owner.';

export const unrelatedAnswer =
  'I can help with PG, Mess, budget, facilities, rent and listings near Thakur College. Please ask a CampusNest related question.';

export const buildSuggestedActions = (intent) => {
  const actions = [];
  if (intent.website) actions.push({ label: 'Contact CampusNest', path: '/contact' });
  if (intent.wantsPG || intent.type === 'pg') actions.push({ label: 'Explore PGs', path: '/college/thakur-college/pg' });
  if (intent.wantsMess || intent.type === 'mess') actions.push({ label: 'Explore Mess', path: '/college/thakur-college/mess' });
  if (!actions.length) {
    actions.push({ label: 'Explore PGs', path: '/college/thakur-college/pg' });
    actions.push({ label: 'Explore Mess', path: '/college/thakur-college/mess' });
  }
  return actions;
};

const describeListing = (listing) => {
  const price = listing.priceText || (listing.price ? `Rs. ${listing.price}` : 'price not listed');
  const distance = listing.distanceText || listing.area || 'distance not listed';
  return `${listing.title} (${price}, ${distance})`;
};

export const fallbackAnswer = ({ intent, listings, searchMeta = {} }) => {
  if (intent.website && !intent.wantsPG && !intent.wantsMess) {
    return 'Yes, you can contact the CampusNest admin from the Contact page. For safety, you will need to verify your email with a 10 minute OTP before sending a message.';
  }

  if (!listings.length) {
    return `I do not have approved listings for that exact request right now. Try browsing PG or Mess listings, or ask with a different area, budget or food preference. ${disclaimer}`;
  }

  const typeText = intent.type === 'pg' ? 'PG' : intent.type === 'mess' ? 'Mess/Tiffin' : 'listing';
  const topListings = listings.slice(0, 3).map(describeListing).join('; ');

  if (searchMeta.usedClosestListings) {
    return `I could not find an approved ${typeText} under Rs. ${searchMeta.requestedBudget}. Closest approved options I can see are: ${topListings}. ${disclaimer}`;
  }

  const preferenceParts = [];
  if (intent.gender) preferenceParts.push(intent.gender);
  if (intent.foodType) preferenceParts.push(intent.foodType);
  if (intent.budget) preferenceParts.push(`under Rs. ${intent.budget}`);
  const preference = preferenceParts.length ? ` for ${preferenceParts.join(', ')}` : '';

  return `I found ${listings.length} approved ${typeText} option${listings.length > 1 ? 's' : ''}${preference}: ${topListings}. ${disclaimer}`;
};

export { disclaimer };
