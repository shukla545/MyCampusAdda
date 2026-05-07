import mongoose from 'mongoose';

const userOtpSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    otpHash: { type: String, required: true },
    purpose: { type: String, enum: ['signup'], default: 'signup', index: true },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
    attempts: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model('UserOtp', userOtpSchema);
