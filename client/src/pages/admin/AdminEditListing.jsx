import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import ListingForm from '../../components/admin/ListingForm.jsx';
import api from '../../api/axios.js';

const toForm = (listing) => ({
  ...listing,
  facilitiesText: listing.facilities?.join('\n') || '',
  faqsText: listing.faqs?.map((faq) => `${faq.question} | ${faq.answer}`).join('\n') || '',
  gender: listing.pgDetails?.gender,
  sharingType: listing.pgDetails?.sharingType,
  foodIncluded: listing.pgDetails?.foodIncluded,
  deposit: listing.pgDetails?.deposit,
  availableBeds: listing.pgDetails?.availableBeds,
  rulesText: listing.pgDetails?.rules?.join('\n') || '',
  foodType: listing.messDetails?.foodType,
  mealsText: listing.messDetails?.meals?.join('\n') || '',
  monthlyPrice: listing.messDetails?.monthlyPrice,
  trialAvailable: listing.messDetails?.trialAvailable,
  offlineOnly: listing.messDetails?.offlineOnly,
  weeklyMenuText: listing.messDetails?.weeklyMenu?.map((day) => `${day.day} | ${day.items.join(', ')}`).join('\n') || ''
});

export default function AdminEditListing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initial, setInitial] = useState(null);
  useEffect(() => {
    api.get(`/admin/listings/${id}`).then(({ data }) => setInitial(toForm(data))).catch(() => setInitial(null));
  }, [id]);
  const submit = async (payload) => {
    await api.put(`/admin/listings/${id}`, payload);
    toast.success('Listing updated');
    navigate('/admin/listings');
  };
  if (!initial) return <div className="grid min-h-[40vh] place-items-center"><LoadingSpinner /></div>;
  return <ListingForm initial={initial} onSubmit={submit} />;
}
