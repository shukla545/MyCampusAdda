import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema(
  {
    question: String,
    answer: String
  },
  { _id: false }
);

const weeklyMenuSchema = new mongoose.Schema(
  {
    day: String,
    items: [String]
  },
  { _id: false }
);

const listingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    type: { type: String, enum: ['pg', 'mess'], required: true },
    college: { type: mongoose.Schema.Types.ObjectId, ref: 'College', required: true },
    area: String,
    address: String,
    distanceText: String,
    price: Number,
    priceText: String,
    description: String,
    images: [String],
    contactName: String,
    contactEmail: String,
    ownerUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    whatsappNumber: String,
    facilities: [String],
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending', index: true },
    isVerified: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    viewCount: { type: Number, default: 0 },
    whatsappClickCount: { type: Number, default: 0 },
    faqs: [faqSchema],
    pgDetails: {
      gender: { type: String, enum: ['boys', 'girls', 'co-living'] },
      sharingType: String,
      foodIncluded: Boolean,
      deposit: Number,
      availableBeds: Number,
      rules: [String]
    },
    messDetails: {
      foodType: { type: String, enum: ['veg', 'non-veg', 'both'] },
      meals: [String],
      monthlyPrice: Number,
      trialAvailable: Boolean,
      offlineOnly: { type: Boolean, default: false },
      weeklyMenu: [weeklyMenuSchema]
    }
  },
  { timestamps: true }
);

export default mongoose.model('Listing', listingSchema);
