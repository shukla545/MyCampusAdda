import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button.jsx';
import SubmissionTable from '../../components/admin/SubmissionTable.jsx';
import api from '../../api/axios.js';

export default function AdminSubmissions() {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const load = () => api.get('/admin/submissions').then(({ data }) => setSubmissions(data)).catch(() => setSubmissions([]));
  useEffect(() => { load(); }, []);
  const status = async (id, value) => {
    try {
      await api.patch(`/admin/submissions/${id}/status`, { status: value });
      toast.success('Submission updated');
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not update submission');
    }
  };
  const approve = async (id) => {
    try {
      await api.patch(`/admin/submissions/${id}/approve`);
      toast.success('Listing approved and live');
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not approve listing');
    }
  };
  const reject = async (id) => {
    try {
      await api.patch(`/admin/submissions/${id}/reject`);
      toast.success('Submission rejected');
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not reject submission');
    }
  };
  const editListing = (listingId) => {
    if (listingId) navigate(`/admin/edit-listing/${listingId}`);
  };
  return (
    <div className="grid gap-5">
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600">Owner submissions create pending listings. Approve one to show it on the website.</p>
        <Button as="a" href="/admin/add-listing" variant="secondary">Create listing manually</Button>
      </div>
      <SubmissionTable submissions={submissions} onStatus={status} onApprove={approve} onReject={reject} onEditListing={editListing} />
    </div>
  );
}
