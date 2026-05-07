import { format } from 'date-fns';
import { CheckCircle2, Pencil, XCircle } from 'lucide-react';
import Button from '../common/Button.jsx';

export default function SubmissionTable({ submissions, onStatus, onApprove, onReject, onEditListing }) {
  if (!submissions.length) {
    return <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm font-semibold text-slate-500 shadow-sm">No submissions yet.</div>;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr><th className="px-4 py-3">Business</th><th>Owner</th><th>Type</th><th>Linked listing</th><th>Status</th><th>Submitted</th><th>Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {submissions.map((item) => (
              <tr key={item._id} className="text-slate-700">
                <td className="px-4 py-4">
                  <p className="font-extrabold text-slate-950">{item.businessName}</p>
                  <p className="mt-1 max-w-xs truncate text-xs font-medium text-slate-500">{item.address || item.message || '-'}</p>
                </td>
                <td><p className="font-semibold">{item.ownerName}</p><p className="text-xs text-slate-500">{item.phone}</p></td>
                <td className="uppercase">{item.businessType}</td>
                <td>
                  <span className={`rounded-full px-3 py-1 text-xs font-extrabold ${item.listing?.status === 'approved' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                    {item.listing?.status || 'pending'}
                  </span>
                </td>
                <td>
                  <select className="input py-2" value={item.status} onChange={(event) => onStatus(item._id, event.target.value)}>
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="approved">Approved</option>
                    <option value="converted">Converted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </td>
                <td>{item.createdAt ? format(new Date(item.createdAt), 'dd MMM yyyy') : '-'}</td>
                <td>
                  <div className="flex flex-wrap gap-2">
                    <Button type="button" className="px-3 py-2" onClick={() => onApprove(item._id)} disabled={item.listing?.status === 'approved'}>
                      <CheckCircle2 className="h-4 w-4" />Approve
                    </Button>
                    <Button type="button" variant="secondary" className="px-3 py-2" onClick={() => onEditListing(item.listing?._id)}>
                      <Pencil className="h-4 w-4" />Edit
                    </Button>
                    <Button type="button" variant="danger" className="px-3 py-2" onClick={() => onReject(item._id)} disabled={item.status === 'rejected'}>
                      <XCircle className="h-4 w-4" />Reject
                    </Button>
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
