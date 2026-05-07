import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import ListingForm from '../../components/admin/ListingForm.jsx';
import api from '../../api/axios.js';

export default function AdminAddListing() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initial = { type: params.get('type') || 'pg', status: 'pending', isVerified: false, isFeatured: false };
  const submit = async (payload) => {
    await api.post('/admin/listings', payload);
    toast.success('Listing created');
    navigate('/admin/listings');
  };
  return <ListingForm initial={initial} onSubmit={submit} />;
}
