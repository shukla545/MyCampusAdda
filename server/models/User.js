import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    emailVerified: { type: Boolean, default: true },
    tcetEmail: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
    tcetEmailVerified: { type: Boolean, default: false },
    tcetEmailVerifiedAt: Date,
    role: { type: String, default: 'user' },
    freeChatUsed: { type: Boolean, default: false },
    freeChatCount: { type: Number, default: 0, min: 0 },
    chatCredits: { type: Number, default: 0, min: 0 },
    marketplaceSellPasses: { type: Number, default: 0, min: 0 },
    totalChatMessages: { type: Number, default: 0 },
    lastChatAt: Date
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
