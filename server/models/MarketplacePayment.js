import mongoose from 'mongoose';

const marketplacePaymentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    planId: { type: String, required: true },
    passes: { type: Number, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    razorpayOrderId: { type: String, required: true, unique: true, index: true },
    razorpayPaymentId: String,
    status: { type: String, enum: ['created', 'paid', 'failed'], default: 'created', index: true },
    rawPayload: mongoose.Schema.Types.Mixed,
    paidAt: Date
  },
  { timestamps: true }
);

export default mongoose.model('MarketplacePayment', marketplacePaymentSchema);
