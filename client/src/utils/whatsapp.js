import api from '../api/axios.js';
import { WHATSAPP_MESSAGE } from './constants.js';

export const buildWhatsAppUrl = (number, message = WHATSAPP_MESSAGE) => {
  const digits = String(number || '').replace(/\D/g, '');
  const normalized = digits.length === 10 ? `91${digits}` : digits;
  if (!normalized) return '';
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
};

export const openWhatsAppForListing = async (listing) => {
  try {
    if (listing?._id) await api.post(`/listings/${listing._id}/whatsapp-click`);
  } catch {
    // Analytics should never block the contact action.
  }
  const url = buildWhatsAppUrl(listing?.whatsappNumber);
  if (url) window.open(url, '_blank', 'noopener,noreferrer');
};
