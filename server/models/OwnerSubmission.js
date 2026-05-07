import mongoose from 'mongoose';

const ownerSubmissionSchema = new mongoose.Schema(
  {
    ownerName: { type: String, required: true },
    businessName: { type: String, required: true },
    businessType: { type: String, enum: ['pg', 'mess'], required: true },
    phone: String,
    ownerEmail: String,
    ownerUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    address: String,
    college: { type: mongoose.Schema.Types.ObjectId, ref: 'College' },
    listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing' },
    message: String,
    images: [String],
    status: { type: String, enum: ['new', 'contacted', 'approved', 'converted', 'rejected'], default: 'new' },
    adminNotes: String
  },
  { timestamps: true }
);

export default mongoose.model('OwnerSubmission', ownerSubmissionSchema);
