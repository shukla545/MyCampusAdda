import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { CheckCircle2, MessageSquareText, ShieldCheck } from 'lucide-react';
import Container from '../components/common/Container.jsx';
import Button from '../components/common/Button.jsx';
import FormInput from '../components/forms/FormInput.jsx';
import FormTextarea from '../components/forms/FormTextarea.jsx';
import api from '../api/axios.js';

export default function Contact() {
  const [otpSent, setOtpSent] = useState(false);
  const [done, setDone] = useState(false);
  const [devOtp, setDevOtp] = useState('');
  const { register, handleSubmit, watch, reset, formState: { errors, isSubmitting } } = useForm();
  const email = watch('email');

  const requestOtp = async () => {
    if (!email) {
      toast.error('Enter your email first');
      return;
    }
    try {
      const { data } = await api.post('/contact/otp', { email });
      setOtpSent(true);
      setDevOtp(data.devOtp || '');
      toast.success(data.message || 'OTP sent');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not send OTP');
    }
  };

  const submit = async (values) => {
    try {
      await api.post('/contact/messages', values);
      setDone(true);
      setOtpSent(false);
      setDevOtp('');
      reset();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not send message');
    }
  };

  if (done) {
    return (
      <Container className="grid min-h-[60vh] place-items-center py-16">
        <div className="max-w-xl rounded-xl border border-slate-200 bg-white p-8 text-center shadow-soft">
          <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-500" />
          <h1 className="mt-5 text-3xl font-extrabold text-slate-950">Message sent</h1>
          <p className="mt-3 text-slate-600">Thanks. Your verified message is saved for the MyCampusAdda admin.</p>
          <Button className="mt-6" onClick={() => setDone(false)}>Send another message</Button>
        </div>
      </Container>
    );
  }

  return (
    <main className="bg-slate-50 py-10">
      <Container className="max-w-4xl">
        <div className="mb-7 grid gap-5 lg:grid-cols-[1fr_360px] lg:items-end">
          <div>
            <p className="font-bold text-indigo-600">Verified contact</p>
            <h1 className="mt-2 text-4xl font-extrabold text-slate-950">Contact MyCampusAdda</h1>
            <p className="mt-3 max-w-2xl text-slate-600">Any query related to the website? Please message the admin or developer after verifying your email.</p>
          </div>
          <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4 text-sm font-semibold text-indigo-800">
            <div className="flex items-start gap-3">
              <MessageSquareText className="mt-0.5 h-5 w-5" />
              <p>Your email is used only for OTP verification before sending a message.</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(submit)} className="rounded-xl border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <FormInput label="Your name" {...register('name')} />
            <div>
              <FormInput label="Email address" type="email" placeholder="you@gmail.com" error={errors.email?.message} {...register('email', { required: 'Email is required' })} />
              <Button type="button" variant="secondary" className="mt-3 w-full" onClick={requestOtp}>
                <ShieldCheck className="h-4 w-4" />{otpSent ? 'Resend OTP' : 'Send OTP'}
              </Button>
              {otpSent && <p className="mt-2 text-xs font-semibold text-emerald-600">OTP is valid for 10 minutes.{devOtp ? ` Dev OTP: ${devOtp}` : ''}</p>}
            </div>
            <FormInput label="OTP" placeholder="6 digit OTP" error={errors.otp?.message} {...register('otp', { required: 'OTP is required' })} />
            <FormInput label="Subject" placeholder="Listing correction, support, business help..." {...register('subject')} />
            <div className="md:col-span-2">
              <FormTextarea label="Message" error={errors.message?.message} {...register('message', { required: 'Message is required', minLength: { value: 10, message: 'Message must be at least 10 characters' } })} />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button disabled={isSubmitting || !otpSent} className="w-full sm:w-auto">{isSubmitting ? 'Sending...' : 'Send verified message'}</Button>
          </div>
        </form>
      </Container>
    </main>
  );
}
