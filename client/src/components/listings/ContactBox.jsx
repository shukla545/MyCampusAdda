import { useState } from 'react';
import { MessageCircle, Phone } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../common/Button.jsx';
import { openWhatsAppForListing } from '../../utils/whatsapp.js';

export default function ContactBox({ listing }) {
  const [revealed, setRevealed] = useState(false);
  const phone = listing?.whatsappNumber || '';
  const hasPhone = phone.replace(/\D/g, '').length >= 10;
  const masked = phone ? `${phone.slice(0, 4)} ${phone.slice(4, 6)}XX XXXX` : 'Not available';
  const reportWrongInfo = () => {
    const subject = `Wrong info report: ${listing?.title || 'Listing'}`;
    const body = [
      `Listing: ${listing?.title || '-'}`,
      `Page: ${window.location.href}`,
      '',
      'What information is wrong?'
    ].join('\n');
    window.location.href = `mailto:campusnest.online@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    toast.success('Opening report email');
  };

  return (
    <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
      <h3 className="text-lg font-extrabold text-slate-950">Contact owner</h3>
      <p className="mt-1 text-sm text-slate-500">Ask availability, photos, visit timing, and final pricing directly.</p>
      <div className="mt-5 rounded-2xl bg-slate-50 p-4">
        <p className="text-xs font-bold uppercase text-slate-400">WhatsApp number</p>
        <p className="mt-1 flex items-center gap-2 text-lg font-bold text-slate-950"><Phone className="h-4 w-4" />{hasPhone ? (revealed ? phone : masked) : 'Not available'}</p>
        {hasPhone ? <button className="mt-2 text-sm font-semibold text-brand" onClick={() => setRevealed(true)}>Show number</button> : <p className="mt-2 text-sm font-semibold text-slate-500">Contact details are not available yet.</p>}
      </div>
      <Button className="mt-5 w-full" disabled={!hasPhone} onClick={() => openWhatsAppForListing(listing)}><MessageCircle className="h-4 w-4" />{hasPhone ? 'Contact on WhatsApp' : 'WhatsApp not available'}</Button>
      <button type="button" onClick={reportWrongInfo} className="mt-4 w-full rounded-xl px-4 py-3 text-sm font-semibold text-slate-500 transition hover:bg-brand-soft hover:text-brand">Report wrong info</button>
    </div>
  );
}
