const disclaimer = 'Rent, menu, availability and facilities may change. Please confirm directly with owner.';

export const unrelatedAnswer =
  'I can help with TCET Marketplace, study material selling, PG, Mess, budget, facilities, rent and listings near Thakur College. Please ask a CampusNest related question.';

export const buildSuggestedActions = (intent) => {
  const actions = [];
  if (intent.marketplace) {
    actions.push({ label: 'Browse Marketplace', path: '/marketplace' });
    actions.push({ label: 'Sell Study Material', path: '/marketplace/sell' });
  }
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
  if (intent.marketplace) {
    return 'CampusNest Marketplace is for TCET students to sell old books, notes, lab files and projects. Buyers can browse with any account, while sellers use a verified TCET email ending with @tcetmumbai.in before listing. Sellers upload at least 1 product image, add product and contact details, then wait for admin approval before the product goes live. First 2 product listings are free; after that sellers can buy Sell Passes: Rs. 12 for 1 product, Rs. 35 for 3 products, or Rs. 50 for 5 products. Seller contact details unlock only after buyer login. Safety note: pay only after you receive and inspect the product. Do not pay in advance.';
  }

  if (intent.website && !intent.wantsPG && !intent.wantsMess) {
    return 'Yes, logged-in students can contact the CampusNest admin from the Contact page. Your account email is used for the reply.';
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
