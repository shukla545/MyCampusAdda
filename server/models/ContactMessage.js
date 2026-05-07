import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    phone: String,
    subject: String,
    message: { type: String, required: true },
    status: { type: String, enum: ['new', 'read'], default: 'new', index: true }
  },
  { timestamps: true }
);

export default mongoose.model('ContactMessage', contactMessageSchema);
