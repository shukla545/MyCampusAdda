import { Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Badge from '../common/Badge.jsx';
import Button from '../common/Button.jsx';

export default function AdminListingTable({ listings, onDelete, onAction }) {
  if (!listings.length) {
    return <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm font-semibold text-slate-500 shadow-sm">No listings found.</div>;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr><th className="px-4 py-3">Listing</th><th>Type</th><th>Status</th><th>Badges</th><th>Price</th><th>Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {listings.map((listing) => (
              <tr key={listing._id} className="text-slate-700">
                <td className="px-4 py-4 font-bold text-slate-950">{listing.title}<p className="text-xs font-medium text-slate-500">{listing.area}</p></td>
                <td>{listing.type}</td>
                <td><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold">{listing.status}</span></td>
                <td><div className="flex gap-2">{listing.isVerified && <Badge type="verified">Verified</Badge>}{listing.isFeatured && <Badge type="featured">Featured</Badge>}</div></td>
                <td>{listing.priceText || listing.price}</td>
                <td>
                  <div className="flex flex-wrap gap-2">
                    <Button as={Link} to={`/admin/edit-listing/${listing._id}`} variant="secondary" className="px-3 py-2"><Edit className="h-4 w-4" /></Button>
                    <Button variant="subtle" className="px-3 py-2" onClick={() => onAction(listing._id, 'approve')} disabled={listing.status === 'approved'}>Approve</Button>
                    <Button variant="subtle" className="px-3 py-2" onClick={() => onAction(listing._id, 'reject')} disabled={listing.status === 'rejected'}>Reject</Button>
                    <Button variant="subtle" className="px-3 py-2" onClick={() => onAction(listing._id, 'verify')}>{listing.isVerified ? 'Unverify' : 'Verify'}</Button>
                    <Button variant="subtle" className="px-3 py-2" onClick={() => onAction(listing._id, 'feature')}>{listing.isFeatured ? 'Unfeature' : 'Feature'}</Button>
                    <button onClick={() => onDelete(listing)} className="rounded-xl p-2 text-rose-600 hover:bg-rose-50"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
