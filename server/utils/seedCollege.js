import dotenv from 'dotenv';
import mongoose from 'mongoose';
import College from '../models/College.js';

dotenv.config();

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const college = await College.findOneAndUpdate(
    { slug: 'thakur-college' },
    {
      name: 'Thakur College',
      slug: 'thakur-college',
      city: 'Mumbai',
      area: 'Kandivali East',
      address: 'Thakur Village, Kandivali East, Mumbai',
      description: 'A focused launch college for CampusNest listings around Thakur Village and nearby student-friendly areas.',
      isActive: true
    },
    { upsert: true, new: true }
  );
  console.log(`Seeded college: ${college.name}`);
  await mongoose.disconnect();
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
