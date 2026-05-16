import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { CheckCircle2, Mail, MapPin, MessageSquareText } from 'lucide-react';
import Container from '../components/common/Container.jsx';
import Button from '../components/common/Button.jsx';
import FormInput from '../components/forms/FormInput.jsx';
import FormTextarea from '../components/forms/FormTextarea.jsx';
import Seo from '../components/common/Seo.jsx';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';

const ADMIN_EMAIL = 'campusnest.online@gmail.com';

export default function Contact() {
  const [done, setDone] = useState(false);
  const { user } = useAuth();
  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm();

  useEffect(() => {
    if (user?.name) setValue('name', user.name);
  }, [setValue, user]);

  const submit = async (values) => {
    try {
      await api.post('/contact/messages', {
        name: values.name || user?.name,
        subject: values.subject || 'CampusNest support message',
        message: String(values.message || '').trim()
      });
      setDone(true);
      reset({ name: user?.name || '', subject: '', message: '' });
    } catch (error) {
      const firstError = error.response?.data?.errors?.[0]?.msg;
      toast.error(firstError || error.response?.data?.message || 'Could not send message');
    }
  };

  if (done) {
    return (
      <Container className="grid min-h-[60vh] place-items-center py-16">
        <div className="max-w-xl rounded-xl border border-slate-200 bg-white p-8 text-center shadow-soft">
          <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-500" />
          <h1 className="mt-5 text-3xl font-extrabold text-slate-950">Message sent</h1>
          <p className="mt-3 text-slate-600">Thanks. Your message is saved for the CampusNest admin. We can reply from {ADMIN_EMAIL} to your account email.</p>
          <Button className="mt-6" onClick={() => setDone(false)}>Send another message</Button>
        </div>
      </Container>
    );
  }

  return (
    <main className="bg-slate-50 py-10">
      <Seo
        title="Contact CampusNest"
        description="Contact CampusNest for PG, hostel, mess and tiffin listing support near Thakur College, Kandivali."
      />
      <Container className="max-w-4xl">
        <div className="mb-7 grid gap-5 lg:grid-cols-[1fr_360px] lg:items-end">
          <div>
            <p className="font-bold text-brand">Logged-in support</p>
            <h1 className="mt-2 text-4xl font-extrabold text-slate-950">Contact CampusNest</h1>
            <p className="mt-3 max-w-2xl text-slate-600">Send website feedback, listing corrections or payment support from your logged-in account.</p>
          </div>
          <div className="rounded-xl border border-brand/10 bg-brand-soft p-4 text-sm font-semibold text-brand">
            <div className="flex items-start gap-3">
              <MessageSquareText className="mt-0.5 h-5 w-5" />
              <p>Replies go directly to your account email: {user?.email}</p>
            </div>
            <div className="mt-4 grid gap-2 border-t border-brand/10 pt-4 text-slate-700">
              <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-brand" />{ADMIN_EMAIL}</p>
              <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-brand" />Kandivali East, Mumbai</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(submit)} className="rounded-xl border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <FormInput label="Your name" {...register('name')} />
            <div>
              <label className="label">Account email</label>
              <input className="input bg-slate-50 text-slate-500" value={user?.email || ''} readOnly />
            </div>
            <FormInput label="Subject" placeholder="Listing correction, support, business help..." {...register('subject')} />
            <div className="md:col-span-2">
              <FormTextarea label="Message" error={errors.message?.message} {...register('message', { required: 'Message is required', minLength: { value: 3, message: 'Message must be at least 3 characters' } })} />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button disabled={isSubmitting} className="w-full sm:w-auto">{isSubmitting ? 'Sending...' : 'Send message'}</Button>
          </div>
        </form>
      </Container>
    </main>
  );
}
