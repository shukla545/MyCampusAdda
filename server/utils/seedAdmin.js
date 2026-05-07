import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';

dotenv.config();

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const email = process.env.ADMIN_EMAIL || 'admin@campusnest.online';
  const existing = await Admin.findOne({ email });
  if (existing) {
    console.log(`Admin already exists: ${email}`);
    await mongoose.disconnect();
    return;
  }
  const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin12345', 12);
  await Admin.create({ name: process.env.ADMIN_NAME || 'Nikhil', email, passwordHash, role: 'admin' });
  console.log(`Seeded admin: ${email}`);
  await mongoose.disconnect();
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
