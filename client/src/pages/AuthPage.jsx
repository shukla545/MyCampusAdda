import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { LockKeyhole, MailCheck, ShieldCheck, UserPlus } from 'lucide-react';
import Button from '../components/common/Button.jsx';
import Container from '../components/common/Container.jsx';
import FormInput from '../components/forms/FormInput.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const cleanNext = (value) => (value && value.startsWith('/') && !value.startsWith('//') ? value : '/');

export default function AuthPage() {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isSignup = pathname.includes('signup');
  const nextPath = useMemo(() => cleanNext(searchParams.get('next')), [searchParams]);
  const { user, loading, requestSignupOtp, completeSignup, login } = useAuth();
  const [otpSent, setOtpSent] = useState(false);
  const [devOtp, setDevOtp] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  useEffect(() => {
    if (!loading && user) navigate(nextPath, { replace: true });
  }, [loading, navigate, nextPath, user]);

  const requestOtp = async (values) => {
    try {
      const { devOtp: nextDevOtp, message } = await requestSignupOtp({
        name: values.name,
        email: values.email
      });
      setOtpSent(true);
      setDevOtp(nextDevOtp || '');
      toast.success(message || 'OTP sent to your email');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not send OTP');
    }
  };

  const signup = async (values) => {
    if (!otpSent) {
      await requestOtp(values);
      return;
    }

    try {
      await completeSignup(values);
      toast.success('Account created');
      navigate(nextPath, { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Signup failed');
    }
  };

  const loginUser = async (values) => {
    try {
      await login(values);
      toast.success('Logged in');
      navigate(nextPath, { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <main className="bg-slate-50 py-10">
      <Container className="grid min-h-[70vh] place-items-center">
        <div className="w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
          <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
            <div className="bg-brand p-8 text-white sm:p-10">
              <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-brand-gold ring-1 ring-white/10">
                <ShieldCheck className="h-4 w-4" /> Verified student access
              </p>
              <h1 className="mt-6 text-4xl font-extrabold leading-tight">
                Login once, then use Campus AI and list a business safely.
              </h1>
              <p className="mt-4 leading-7 text-slate-300">
                Email verification keeps fake emails away from owner submissions and AI usage. Admin credentials can also login here for user-side access.
              </p>
              <div className="mt-8 grid gap-3 text-sm font-semibold text-slate-200">
                <div className="rounded-xl bg-white/10 p-4">Signup uses name, email OTP and password.</div>
                <div className="rounded-xl bg-white/10 p-4">Session stays active until logout using a secure cookie.</div>
                <div className="rounded-xl bg-white/10 p-4">Chatbot and business listing are available after login.</div>
                <div className="rounded-xl bg-white/10 p-4">Admins get one fresh AI answer every time they login again.</div>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="mb-6 grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
                <Link to={`/login?next=${encodeURIComponent(nextPath)}`} className={`rounded-lg px-4 py-3 text-center text-sm font-extrabold transition ${!isSignup ? 'bg-white text-brand shadow-sm' : 'text-slate-500'}`}>
                  Login
                </Link>
                <Link to={`/signup?next=${encodeURIComponent(nextPath)}`} className={`rounded-lg px-4 py-3 text-center text-sm font-extrabold transition ${isSignup ? 'bg-white text-brand shadow-sm' : 'text-slate-500'}`}>
                  Signup
                </Link>
              </div>

              {isSignup ? (
                <form onSubmit={handleSubmit(signup)} className="grid gap-4">
                  <div>
                    <UserPlus className="h-7 w-7 text-brand" />
                    <h2 className="mt-3 text-2xl font-extrabold text-slate-950">Create account</h2>
                    <p className="mt-1 text-sm text-slate-500">First verify your email, then set your password.</p>
                  </div>
                  <FormInput label="Full name" error={errors.name?.message} {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Enter your full name' } })} />
                  <FormInput label="Email address" type="email" error={errors.email?.message} {...register('email', { required: 'Email is required' })} />
                  {otpSent && (
                    <>
                      <FormInput label="Email OTP" placeholder="6 digit OTP" error={errors.otp?.message} {...register('otp', { required: 'OTP is required' })} />
                      <FormInput label="Create password" type="password" error={errors.password?.message} {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Use at least 8 characters' } })} />
                      <p className="rounded-xl bg-emerald-50 px-4 py-3 text-xs font-bold text-emerald-700">
                        OTP is valid for 10 minutes.{devOtp ? ` Dev OTP: ${devOtp}` : ''}
                      </p>
                    </>
                  )}
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button disabled={isSubmitting} className="w-full sm:flex-1">
                      {isSubmitting ? 'Please wait...' : otpSent ? 'Create account' : 'Send OTP'}
                    </Button>
                    {otpSent && (
                      <Button type="button" variant="secondary" disabled={isSubmitting} onClick={handleSubmit(requestOtp)} className="w-full sm:w-auto">
                        Resend OTP
                      </Button>
                    )}
                  </div>
                </form>
              ) : (
                <form onSubmit={handleSubmit(loginUser)} className="grid gap-4">
                  <div>
                    <LockKeyhole className="h-7 w-7 text-brand" />
                    <h2 className="mt-3 text-2xl font-extrabold text-slate-950">Welcome back</h2>
                    <p className="mt-1 text-sm text-slate-500">Login with your verified email and password.</p>
                  </div>
                  <FormInput label="Email address" type="email" error={errors.email?.message} {...register('email', { required: 'Email is required' })} />
                  <FormInput label="Password" type="password" error={errors.password?.message} {...register('password', { required: 'Password is required' })} />
                  <Button disabled={isSubmitting}>{isSubmitting ? 'Signing in...' : 'Login'}</Button>
                  <Link to={`/signup?next=${encodeURIComponent(nextPath)}`} className="inline-flex items-center gap-2 text-sm font-bold text-brand hover:text-brand-dark">
                    <MailCheck className="h-4 w-4" /> New here? Verify email and signup
                  </Link>
                </form>
              )}
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
