import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { CheckCircle2 } from 'lucide-react';
import Container from '../components/common/Container.jsx';
import Button from '../components/common/Button.jsx';
import FormCheckbox from '../components/forms/FormCheckbox.jsx';
import FormInput from '../components/forms/FormInput.jsx';
import FormSelect from '../components/forms/FormSelect.jsx';
import FormTextarea from '../components/forms/FormTextarea.jsx';
import ImageUploader from '../components/admin/ImageUploader.jsx';
import Seo from '../components/common/Seo.jsx';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function BusinessRegister() {
  const [done, setDone] = useState(false);
  const [images, setImages] = useState([]);
  const { user } = useAuth();
  const { register, handleSubmit, watch, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { businessType: 'pg', collegeSlug: 'thakur-college' }
  });
  const businessType = watch('businessType');

  useEffect(() => {
    if (user?.name) setValue('ownerName', user.name);
  }, [setValue, user]);

  const submit = async (payload) => {
    try {
      await api.post('/owner-submissions', { ...payload, images, collegeSlug: 'thakur-college' });
      reset({ businessType: 'pg', collegeSlug: 'thakur-college' });
      setImages([]);
      setDone(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Submission failed');
    }
  };

  if (done) {
    return (
      <Container className="grid min-h-[70vh] place-items-center py-16">
        <div className="max-w-xl rounded-xl border border-slate-200 bg-white p-8 text-center shadow-soft">
          <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-500" />
          <h1 className="mt-5 text-3xl font-extrabold text-slate-950">Your business has been submitted.</h1>
          <p className="mt-3 text-slate-600">After approval, your business will appear on MyCampusAdda. You will get a message from our team.</p>
          <Button className="mt-6" onClick={() => setDone(false)}>Add another listing</Button>
        </div>
      </Container>
    );
  }

  return (
    <main className="bg-slate-50 py-10">
      <Seo
        title="List your PG or Mess near Thakur College"
        description="Submit your PG, hostel, mess or tiffin business for review on MyCampusAdda near Thakur College, Kandivali."
      />
      <Container className="max-w-4xl">
        <div className="mb-6">
          <p className="font-bold text-brand">Owner onboarding</p>
          <h1 className="mt-2 text-4xl font-extrabold text-slate-950">List your PG/Mess</h1>
          <p className="mt-3 text-slate-500">Fill the main details once. Photos upload first, then the listing goes to admin for approval.</p>
          <p className="mt-3 inline-flex rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700 ring-1 ring-emerald-100">
            Verified as {user?.email}
          </p>
        </div>

        <form onSubmit={handleSubmit(submit)} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <FormInput label="Owner name" error={errors.ownerName?.message} {...register('ownerName', { required: 'Owner name is required' })} />
            <FormInput label="WhatsApp number" placeholder="Optional if not available" error={errors.phone?.message} {...register('phone', {
              validate: (value) => {
                if (!value) return true;
                const text = String(value).trim().toLowerCase();
                if (['na', 'n/a', 'not available'].includes(text)) return true;
                return String(value).replace(/\D/g, '').length >= 10 || 'Enter a valid number or leave it blank';
              }
            })} />
            <FormInput label="Business name" error={errors.businessName?.message} {...register('businessName', { required: 'Business name is required' })} />
            <FormSelect label="Business type" {...register('businessType')}><option value="pg">PG/Hostel</option><option value="mess">Mess/Tiffin</option></FormSelect>
            <FormInput label="Area" {...register('area')} />
            <FormInput label="Monthly price" type="number" {...register('price')} />
            <div className="md:col-span-2"><FormTextarea label="Address" {...register('address')} /></div>
            <div className="md:col-span-2"><FormTextarea label="Short description" {...register('description')} /></div>

            {businessType === 'pg' ? (
              <>
                <FormSelect label="For" {...register('gender')}><option value="">Select</option><option value="boys">Boys</option><option value="girls">Girls</option><option value="co-living">Co-living</option></FormSelect>
                <FormInput label="Sharing type" placeholder="Single, double, triple" {...register('sharingType')} />
                <div className="pt-7"><FormCheckbox label="Food included" {...register('foodIncluded')} /></div>
              </>
            ) : (
              <>
                <FormSelect label="Food type" {...register('foodType')}><option value="">Select</option><option value="veg">Veg</option><option value="non-veg">Non-veg</option><option value="both">Both</option></FormSelect>
                <FormTextarea label="Meals" placeholder={'lunch\ndinner'} {...register('mealsText')} />
                <div className="pt-7"><FormCheckbox label="Trial available" {...register('trialAvailable')} /></div>
                <div className="pt-7"><FormCheckbox label="Offline only" {...register('offlineOnly')} /></div>
              </>
            )}

            <div className="md:col-span-2"><FormTextarea label="Facilities" placeholder="One per line" {...register('facilitiesText')} /></div>
            <div className="md:col-span-2"><ImageUploader images={images} onChange={setImages} owner /></div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button disabled={isSubmitting} className="w-full sm:w-auto">{isSubmitting ? 'Submitting...' : 'Submit for approval'}</Button>
          </div>
        </form>
      </Container>
    </main>
  );
}
