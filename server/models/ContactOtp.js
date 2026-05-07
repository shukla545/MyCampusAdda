import mongoose from 'mongoose';

const contactOtpSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    otpHash: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
    attempts: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model('ContactOtp', contactOtpSchema);
