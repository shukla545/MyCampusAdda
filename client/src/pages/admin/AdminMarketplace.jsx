import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';
import Button from '../../components/common/Button.jsx';
import ConfirmModal from '../../components/common/ConfirmModal.jsx';
import FormSelect from '../../components/forms/FormSelect.jsx';
import SearchInput from '../../components/common/SearchInput.jsx';
import api from '../../api/axios.js';
import { cleanParams } from '../../utils/filters.js';

const money = (value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(value || 0));

export default function AdminMarketplace() {
  const [listings, setListings] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');
  const [target, setTarget] = useState(null);

  const load = () => {
    api.get('/admin/marketplace', { params: cleanParams({ search, status, category }) })
      .then(({ data }) => setListings(data || []))
      .catch(() => setListings([]));
  };

  useEffect(() => { load(); }, [search, status, category]);

  const action = async (id, actionName) => {
    try {
      await api.patch(`/admin/marketplace/${id}/${actionName}`);
      toast.success('Marketplace product updated');
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not update product');
    }
  };

  const remove = async () => {
    try {
      await api.delete(`/admin/marketplace/${target._id}`);
      toast.success('Product deleted');
      setTarget(null);
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not delete product');
    }
  };

  return (
    <div className="grid gap-5">
      <div className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_180px_200px]">
        <SearchInput value={search} onChange={setSearch} placeholder="Search products, seller, branch" />
        <FormSelect label="" value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="">All status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </FormSelect>
        <FormSelect label="" value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="">All categories</option>
          <option value="books">Books</option>
          <option value="notes">Notes</option>
          <option value="project">Project</option>
          <option value="question-papers">Question Papers</option>
          <option value="lab-files">Lab Files</option>
          <option value="other">Other</option>
        </FormSelect>
      </div>

      {!listings.length ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm font-semibold text-slate-500 shadow-sm">No marketplace products found.</div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Product</th>
                  <th>Seller</th>
                  <th>Branch</th>
                  <th>Phone</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {listings.map((listing) => (
                  <tr key={listing._id} className="text-slate-700">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <img src={listing.images?.[0]} alt={`${listing.title} product`} className="h-14 w-14 rounded-lg object-cover" />
                        <div>
                          <p className="font-extrabold text-slate-950">{listing.title}</p>
                          <p className="mt-1 text-xs font-semibold text-slate-500">{listing.category}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <p className="font-bold text-slate-900">{listing.sellerName}</p>
                      <p className="text-xs text-slate-500">{listing.seller?.email}</p>
                    </td>
                    <td>{listing.branch}</td>
                    <td>
                      <p>+{listing.primaryPhone}</p>
                      {listing.extraPhone && <p className="text-xs text-slate-500">+{listing.extraPhone}</p>}
                    </td>
                    <td>
                      {listing.marketPrice ? <p className="text-xs font-bold text-slate-400 line-through">{money(listing.marketPrice)}</p> : null}
                      <p className="font-extrabold text-slate-900">{listing.priceText || `Rs. ${listing.price}`}</p>
                    </td>
                    <td><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold capitalize">{listing.status}</span></td>
                    <td>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="subtle" className="px-3 py-2" onClick={() => action(listing._id, 'approve')} disabled={listing.status === 'approved'}>Approve</Button>
                        <Button variant="subtle" className="px-3 py-2" onClick={() => action(listing._id, 'reject')} disabled={listing.status === 'rejected'}>Reject</Button>
                        <button onClick={() => setTarget(listing)} className="rounded-xl p-2 text-rose-600 hover:bg-rose-50"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <ConfirmModal open={Boolean(target)} title="Delete marketplace product?" message="This permanently removes the product from the database." onCancel={() => setTarget(null)} onConfirm={remove} />
    </div>
  );
}
