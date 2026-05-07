import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, default: 'admin' }
  },
  { timestamps: true }
);

export default mongoose.model('Admin', adminSchema);
