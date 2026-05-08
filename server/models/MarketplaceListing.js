import mongoose from 'mongoose';

const marketplaceListingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    sellerName: { type: String, required: true, trim: true },
    primaryPhone: { type: String, required: true, trim: true },
    extraPhone: { type: String, trim: true },
    branch: { type: String, required: true, trim: true },
    semester: { type: String, trim: true },
    studentDetails: { type: String, trim: true },
    category: {
      type: String,
      enum: ['books', 'notes', 'project', 'question-papers', 'lab-files', 'other'],
      default: 'books',
      index: true
    },
    subject: { type: String, trim: true },
    condition: {
      type: String,
      enum: ['new', 'like-new', 'good', 'used'],
      default: 'good'
    },
    price: { type: Number, required: true, min: 0 },
    priceText: String,
    description: { type: String, required: true, trim: true },
    images: [{ type: String, required: true }],
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true
    },
    availability: {
      type: String,
      enum: ['available', 'sold'],
      default: 'available',
      index: true
    },
    passUsed: { type: Boolean, default: false },
    adminNotes: String,
    viewCount: { type: Number, default: 0 },
    contactViewCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

marketplaceListingSchema.index({
  title: 'text',
  description: 'text',
  subject: 'text',
  branch: 'text'
});

export default mongoose.model('MarketplaceListing', marketplaceListingSchema);
