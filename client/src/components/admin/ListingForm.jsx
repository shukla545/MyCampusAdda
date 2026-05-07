import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../common/Button.jsx';
import FormInput from '../forms/FormInput.jsx';
import FormSelect from '../forms/FormSelect.jsx';
import FormTextarea from '../forms/FormTextarea.jsx';
import FormCheckbox from '../forms/FormCheckbox.jsx';
import ImageUploader from './ImageUploader.jsx';
import AIHelperPanel from './AIHelperPanel.jsx';

const splitLines = (value = '') => String(value).split('\n').map((item) => item.trim()).filter(Boolean);
const optionalText = (value) => {
  const text = String(value || '').trim();
  return text || undefined;
};
const optionalNumber = (value) => (value === '' || value === undefined || value === null ? undefined : Number(value));

export default function ListingForm({ initial = {}, onSubmit }) {
  const [images, setImages] = useState(initial.images || []);
  const [type, setType] = useState(initial.type || 'pg');
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm({ defaultValues: initial });

  useEffect(() => {
    setValue('type', type);
  }, [type, setValue]);

  const submit = async (values) => {
    const payload = {
      ...values,
      type,
      images,
      price: optionalNumber(values.price),
      facilities: splitLines(values.facilitiesText),
      faqs: splitLines(values.faqsText).map((line) => {
        const [question, ...answer] = line.split('|');
        return { question: question?.trim(), answer: answer.join('|').trim() };
      }).filter((item) => item.question),
      pgDetails: type === 'pg' ? {
        gender: optionalText(values.gender),
        sharingType: optionalText(values.sharingType),
        foodIncluded: Boolean(values.foodIncluded),
        deposit: optionalNumber(values.deposit),
        availableBeds: optionalNumber(values.availableBeds),
        rules: splitLines(values.rulesText)
      } : undefined,
      messDetails: type === 'mess' ? {
        foodType: optionalText(values.foodType),
        meals: splitLines(values.mealsText),
        monthlyPrice: optionalNumber(values.monthlyPrice || values.price),
        trialAvailable: Boolean(values.trialAvailable),
        offlineOnly: Boolean(values.offlineOnly),
        weeklyMenu: splitLines(values.weeklyMenuText).map((line) => {
          const [day, items = ''] = line.split('|');
          return { day: day?.trim(), items: items.split(',').map((item) => item.trim()).filter(Boolean) };
        }).filter((item) => item.day)
      } : undefined
    };
    await onSubmit(payload);
  };

  const values = watch();
  return (
    <form onSubmit={handleSubmit(submit)} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-5 flex flex-col gap-3 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-950">Listing details</h2>
          <p className="mt-1 text-sm text-slate-500">Fill the basics first. Advanced details are optional.</p>
        </div>
        <Button disabled={isSubmitting} className="w-full sm:w-auto">{isSubmitting ? 'Saving...' : 'Save listing'}</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FormInput label="Listing name" error={errors.title?.message} {...register('title', { required: 'Listing name is required' })} />
        <FormSelect label="Type" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="pg">PG/Hostel</option><option value="mess">Mess/Tiffin</option>
        </FormSelect>
        <FormInput label="Area" {...register('area')} />
        <FormInput label={type === 'mess' ? 'Starting price' : 'Monthly price'} type="number" error={errors.price?.message} {...register('price')} />
        <FormInput label="Contact name" {...register('contactName')} />
        <FormInput label="WhatsApp number" placeholder="Optional" error={errors.whatsappNumber?.message} {...register('whatsappNumber')} />
        <FormSelect label="Status" {...register('status')}><option value="pending">Pending approval</option><option value="approved">Approved live</option><option value="rejected">Rejected hidden</option></FormSelect>
        <div className="grid grid-cols-2 gap-3 pt-7"><FormCheckbox label="Verified" {...register('isVerified')} /><FormCheckbox label="Featured" {...register('isFeatured')} /></div>
        <div className="md:col-span-2"><FormTextarea label="Address" {...register('address')} /></div>
        <div className="md:col-span-2"><FormTextarea label="Short description" {...register('description')} /></div>

        {type === 'pg' ? (
          <>
            <FormSelect label="Gender" {...register('gender')}><option value="boys">Boys</option><option value="girls">Girls</option><option value="co-living">Co-living</option></FormSelect>
            <FormInput label="Sharing type" {...register('sharingType')} />
            <FormInput label="Available beds" type="number" {...register('availableBeds')} />
            <div className="pt-7"><FormCheckbox label="Food included" {...register('foodIncluded')} /></div>
          </>
        ) : (
          <>
            <FormSelect label="Food type" {...register('foodType')}><option value="veg">Veg</option><option value="non-veg">Non-veg</option><option value="both">Both</option></FormSelect>
            <FormInput label="Meal plan price" type="number" {...register('monthlyPrice')} />
            <div className="pt-7"><FormCheckbox label="Trial available" {...register('trialAvailable')} /></div>
            <div className="pt-7"><FormCheckbox label="Offline only" {...register('offlineOnly')} /></div>
            <div className="md:col-span-2"><FormTextarea label="Meals" placeholder={'lunch\ndinner'} {...register('mealsText')} /></div>
          </>
        )}
      </div>

      <div className="mt-5">
        <ImageUploader images={images} onChange={setImages} />
      </div>

      <details className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <summary className="cursor-pointer text-sm font-extrabold text-slate-800">Advanced details</summary>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <FormInput label="Distance text" placeholder="8 min walk" {...register('distanceText')} />
          <FormInput label="Price text" placeholder="From Rs. 12,500/month" {...register('priceText')} />
          {type === 'pg' ? (
            <>
              <FormInput label="Deposit" type="number" {...register('deposit')} />
              <div className="md:col-span-2"><FormTextarea label="Rules" placeholder="One per line" {...register('rulesText')} /></div>
            </>
          ) : (
            <div className="md:col-span-2"><FormTextarea label="Weekly menu" placeholder="Monday | Dal, Rice, Roti" {...register('weeklyMenuText')} /></div>
          )}
          <div className="md:col-span-2"><FormTextarea label="Facilities" placeholder="One per line" {...register('facilitiesText')} /></div>
          <div className="md:col-span-2"><FormTextarea label="FAQs" placeholder="Question | Answer, one per line" {...register('faqsText')} /></div>
        </div>
        <div className="mt-4">
          <AIHelperPanel values={{ ...values, type, images }} onDescription={(text) => text && setValue('description', text)} onFaqs={(text) => text && setValue('faqsText', text)} />
        </div>
      </details>

      <div className="mt-5 flex justify-end">
        <Button disabled={isSubmitting} className="w-full sm:w-auto">{isSubmitting ? 'Saving...' : 'Save listing'}</Button>
      </div>
    </form>
  );
}
