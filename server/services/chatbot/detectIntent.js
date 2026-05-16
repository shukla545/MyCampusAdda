const relatedKeywords = [
  'pg', 'hostel', 'room', 'rent', 'deposit', 'boys pg', 'girls pg', 'mess', 'tiffin',
  'food', 'lunch', 'dinner', 'veg', 'non-veg', 'non veg', 'budget', 'thakur college',
  'kandivali', 'move-in', 'move in', 'facilities', 'wifi', 'wi-fi', 'study table',
  'laundry', 'ac', 'distance', 'near', 'college', 'stay', 'bed', 'meal', 'menu',
  'campusnest', 'website', 'contact', 'support', 'admin', 'owner', 'developer',
  'message', 'help', 'complaint', 'correction', 'study material', 'old books', 'notes',
  'sell product', 'sell books', 'project', 'marketplace', 'seller contact', 'sell pass',
  'calculator', 'drafter', 'roller scale', 'lab coat', 'engineering tools', 'equipment'
];

const pgKeywords = ['pg', 'hostel', 'room', 'stay', 'bed', 'rent', 'deposit'];
const messKeywords = ['mess', 'tiffin', 'food', 'lunch', 'dinner', 'meal', 'menu', 'veg', 'non-veg', 'non veg'];
const moveInKeywords = ['move-in', 'move in', 'moving', 'shift', 'checklist', 'plan'];
const websiteKeywords = ['campusnest', 'website', 'contact', 'support', 'admin', 'owner', 'developer', 'message', 'complaint', 'correction'];
const marketplaceKeywords = ['study material', 'old books', 'notes', 'sell product', 'sell books', 'project', 'marketplace', 'seller contact', 'sell pass', 'product listing', 'calculator', 'drafter', 'roller scale', 'lab coat', 'engineering tools', 'equipment'];
const sellKeywords = ['sell', 'selling', 'list product', 'add product', 'upload', 'bech', 'old material', 'sell material'];
const sellerContactKeywords = ['seller contact', 'seller number', 'contact number', 'phone number', 'unlock contact', 'view contact'];
const marketplacePriceKeywords = ['sell pass', 'pass', 'price', 'pricing', 'free listing', 'free listings', '12', '35', '50'];

const includesAny = (text, words) => words.some((word) => text.includes(word));

const extractBudget = (text) => {
  const matches = text.match(/\b\d{3,6}\b/g);
  if (!matches) return null;
  return Math.max(...matches.map((value) => Number(value)).filter((value) => Number.isFinite(value)));
};

export const detectIntent = (message = '') => {
  const text = String(message).toLowerCase();
  const related = includesAny(text, relatedKeywords);
  const wantsPG = includesAny(text, pgKeywords);
  const wantsMess = includesAny(text, messKeywords);
  const moveIn = includesAny(text, moveInKeywords);
  const website = includesAny(text, websiteKeywords);
  const marketplace = includesAny(text, marketplaceKeywords);
  const wantsSell = marketplace && includesAny(text, sellKeywords);
  const wantsSellerContact = marketplace && includesAny(text, sellerContactKeywords);
  const wantsMarketplacePricing = marketplace && includesAny(text, marketplacePriceKeywords);
  const gender = text.includes('boys') || text.includes('boy') ? 'boys'
    : text.includes('girls') || text.includes('girl') ? 'girls'
      : text.includes('co-living') || text.includes('coliving') ? 'co-living'
        : null;
  const foodType = text.includes('non-veg') || text.includes('non veg') ? 'non-veg'
    : text.includes('veg') ? 'veg'
      : null;

  return {
    related,
    type: wantsPG && !wantsMess ? 'pg' : wantsMess && !wantsPG ? 'mess' : null,
    budget: extractBudget(text),
    gender,
    foodType,
    moveIn,
    website,
    marketplace,
    wantsSell,
    wantsSellerContact,
    wantsMarketplacePricing,
    wantsPG,
    wantsMess,
    terms: relatedKeywords.filter((word) => text.includes(word))
  };
};
