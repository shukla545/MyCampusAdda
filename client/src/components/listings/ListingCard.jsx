import { Link } from 'react-router-dom';
import { MapPin, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Badge from '../common/Badge.jsx';
import Button from '../common/Button.jsx';
import FacilityPills from './FacilityPills.jsx';
import { PLACEHOLDER_IMAGE } from '../../utils/constants.js';
import { formatPrice } from '../../utils/formatPrice.js';
import { openWhatsAppForListing } from '../../utils/whatsapp.js';

export default function ListingCard({ listing }) {
  const hasPhone = String(listing.whatsappNumber || '').replace(/\D/g, '').length >= 10;
  const facilities = listing.type === 'mess' && listing.messDetails?.offlineOnly
    ? ['Offline only', ...(listing.facilities || [])]
    : listing.facilities || [];

  return (
    <motion.article whileHover={{ y: -4 }} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-soft">
      <div className="relative h-52 overflow-hidden bg-slate-100">
        <img src={listing.images?.[0] || PLACEHOLDER_IMAGE} alt={listing.title} className="h-full w-full object-cover transition duration-500 hover:scale-105" />
        <div className="absolute left-3 top-3 flex gap-2">
          {listing.isVerified && <Badge type="verified">Verified</Badge>}
          {listing.isFeatured && <Badge type="featured">Featured</Badge>}
        </div>
      </div>
      <div className="space-y-4 p-5">
        <div>
          <h3 className="line-clamp-2 text-lg font-extrabold text-slate-950">{listing.title}</h3>
          <p className="mt-1 flex items-center gap-1 text-sm text-slate-500"><MapPin className="h-4 w-4" />{listing.area} · {listing.distanceText}</p>
        </div>
        <div>
          <p className="text-2xl font-extrabold text-slate-950">{listing.priceText || formatPrice(listing.price)}</p>
          <p className="text-xs font-semibold uppercase text-slate-400">{listing.type === 'pg' ? 'PG / Hostel' : 'Mess / Tiffin'}</p>
        </div>
        <FacilityPills facilities={facilities} limit={4} />
        <div className="grid grid-cols-2 gap-3">
          <Button variant="secondary" disabled={!hasPhone} onClick={() => openWhatsAppForListing(listing)}><MessageCircle className="h-4 w-4" />{hasPhone ? 'WhatsApp' : 'No number'}</Button>
          <Button as={Link} to={`/listing/${listing.slug}`}>View Details</Button>
        </div>
      </div>
    </motion.article>
  );
}
