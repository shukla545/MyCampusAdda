import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import AdminListingTable from '../../components/admin/AdminListingTable.jsx';
import ConfirmModal from '../../components/common/ConfirmModal.jsx';
import SearchInput from '../../components/common/SearchInput.jsx';
import FormSelect from '../../components/forms/FormSelect.jsx';
import api from '../../api/axios.js';
import { cleanParams } from '../../utils/filters.js';

export default function AdminListings() {
  const [listings, setListings] = useState([]);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [target, setTarget] = useState(null);
  const load = () => api.get('/admin/listings', { params: cleanParams({ search, type, status }) }).then(({ data }) => setListings(data)).catch(() => setListings([]));
  useEffect(() => { load(); }, [search, type, status]);
  const action = async (id, actionName) => {
    try {
      await api.patch(`/admin/listings/${id}/${actionName}`);
      toast.success('Listing updated');
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not update listing');
    }
  };
  const remove = async () => {
    try {
      await api.delete(`/admin/listings/${target._id}`);
      toast.success('Listing deleted');
      setTarget(null);
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not delete listing');
    }
  };
  return (
    <div className="grid gap-5">
      <div className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_180px_180px]">
        <SearchInput value={search} onChange={setSearch} placeholder="Search listings" />
        <FormSelect label="" value={type} onChange={(e) => setType(e.target.value)}><option value="">All types</option><option value="pg">PG</option><option value="mess">Mess</option></FormSelect>
        <FormSelect label="" value={status} onChange={(e) => setStatus(e.target.value)}><option value="">All status</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option></FormSelect>
      </div>
      <AdminListingTable listings={listings} onDelete={setTarget} onAction={action} />
      <ConfirmModal open={Boolean(target)} title="Delete listing?" message="This permanently removes the listing from the database." onCancel={() => setTarget(null)} onConfirm={remove} />
    </div>
  );
}
