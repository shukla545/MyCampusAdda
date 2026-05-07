import mongoose from 'mongoose';

const chatPaymentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    planId: { type: String, required: true },
    credits: { type: Number, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    paymentMode: { type: String, enum: ['checkout', 'qr', 'payment_link'], default: 'checkout', index: true },
    razorpayOrderId: { type: String, required: true, unique: true, index: true },
    razorpayQrCodeId: { type: String, index: true },
    qrImageUrl: String,
    qrCloseBy: Number,
    razorpayPaymentLinkId: { type: String, index: true },
    paymentLinkUrl: String,
    razorpayPaymentId: String,
    status: { type: String, enum: ['created', 'paid', 'failed'], default: 'created', index: true },
    rawPayload: mongoose.Schema.Types.Mixed,
    paidAt: Date
  },
  { timestamps: true }
);

export default mongoose.model('ChatPayment', chatPaymentSchema);
