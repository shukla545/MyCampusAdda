import { Link } from 'react-router-dom';
import clsx from 'clsx';
import Button from '../common/Button.jsx';

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={clsx('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div className={clsx('max-w-[86%] rounded-2xl px-4 py-3 text-sm leading-6', isUser ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-800')}>
        <p className="whitespace-pre-line">{message.text}</p>
        {!isUser && message.relatedListings?.length > 0 && (
          <div className="mt-3 grid gap-2">
            {message.relatedListings.map((listing) => (
              <div key={listing.slug} className="rounded-xl border border-slate-200 bg-white p-3 text-slate-800">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-extrabold text-slate-950">{listing.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{listing.priceText || 'Price on request'} / {listing.distanceText || listing.area || 'Distance not available'}</p>
                  </div>
                  {listing.isVerified && <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">Verified</span>}
                </div>
                <Button as={Link} to={`/listing/${listing.slug}`} className="mt-3 w-full px-3 py-2 text-xs">View</Button>
              </div>
            ))}
          </div>
        )}
        {!isUser && message.suggestedActions?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {message.suggestedActions.map((action) => (
              <Link key={`${action.label}-${action.path}`} to={action.path} className="rounded-full border border-indigo-100 bg-white px-3 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-50">
                {action.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
