import dotenv from 'dotenv';
import mongoose from 'mongoose';
import College from '../models/College.js';
import Listing from '../models/Listing.js';
import { generateSlug } from './generateSlug.js';

dotenv.config();

const image = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80';

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const college = await College.findOne({ slug: 'thakur-college' });
  if (!college) throw new Error('Run npm run seed:college first.');

  const samples = [
    {
      title: 'Aarav Boys PG Thakur Village',
      type: 'pg',
      area: 'Thakur Village',
      price: 12500,
      priceText: 'From Rs. 12,500/month',
      distanceText: '8 min walk',
      description: 'Clean, student-friendly boys PG close to Thakur College with Wi-Fi, meals, laundry support and secure entry.',
      facilities: ['Wi-Fi', 'Meals', 'Laundry', 'CCTV', 'Study desk'],
      pgDetails: { gender: 'boys', sharingType: 'Double sharing', foodIncluded: true, deposit: 25000, availableBeds: 4, rules: ['No smoking', 'Visitor entry by approval'] }
    },
    {
      title: 'Mira Girls Hostel Kandivali',
      type: 'pg',
      area: 'Kandivali East',
      price: 15000,
      priceText: 'From Rs. 15,000/month',
      distanceText: '12 min by auto',
      description: 'Verified girls hostel with tidy rooms, homely meals, power backup and quick access to campus.',
      facilities: ['Wi-Fi', 'Homely food', 'Power backup', 'Housekeeping'],
      pgDetails: { gender: 'girls', sharingType: 'Triple sharing', foodIncluded: true, deposit: 30000, availableBeds: 3, rules: ['Entry closes at 10 PM'] }
    },
    {
      title: 'Campus Bowl Mess',
      type: 'mess',
      area: 'Thakur Village',
      price: 3200,
      priceText: 'Rs. 3,200/month',
      distanceText: '5 min walk',
      description: 'Affordable veg mess with fresh lunch and dinner plans for students around Thakur College.',
      facilities: ['Veg meals', 'Monthly plan', 'Trial meal', 'Tiffin available'],
      messDetails: { foodType: 'veg', meals: ['lunch', 'dinner'], monthlyPrice: 3200, trialAvailable: true, weeklyMenu: [{ day: 'Monday', items: ['Dal', 'Rice', 'Sabzi', 'Roti'] }] }
    },
    {
      title: 'Adda Tiffin Service',
      type: 'mess',
      area: 'Kandivali East',
      price: 3800,
      priceText: 'Rs. 3,800/month',
      distanceText: '10 min by auto',
      description: 'Flexible veg and non-veg tiffin service with lunch and dinner delivery options near campus.',
      facilities: ['Veg and non-veg', 'Delivery', 'Flexible meals'],
      messDetails: { foodType: 'both', meals: ['lunch', 'dinner'], monthlyPrice: 3800, trialAvailable: true, weeklyMenu: [{ day: 'Friday', items: ['Paneer rice bowl', 'Chicken curry option'] }] }
    }
  ];

  for (const item of samples) {
    await Listing.findOneAndUpdate(
      { slug: generateSlug(item.title) },
      {
        ...item,
        slug: generateSlug(item.title),
        college: college._id,
        address: `${item.area}, Mumbai`,
        images: [image],
        contactName: 'MyCampusAdda Partner',
        whatsappNumber: '919876543210',
        status: 'approved',
        isVerified: true,
        isFeatured: true,
        faqs: [{ question: 'Can students visit before booking?', answer: 'Yes, contact the owner on WhatsApp to schedule a visit.' }]
      },
      { upsert: true, new: true }
    );
  }

  console.log('Seeded sample listings');
  await mongoose.disconnect();
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
