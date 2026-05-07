import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import BackButton from '../../components/common/BackButton.jsx';
import Button from '../../components/common/Button.jsx';
import FormInput from '../../components/forms/FormInput.jsx';
import api from '../../api/axios.js';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();

  useEffect(() => {
    if (localStorage.getItem('campusnest_admin_token') || localStorage.getItem('mca_admin_token')) navigate('/admin/dashboard', { replace: true });
  }, [navigate]);

  const submit = async (values) => {
    try {
      const { data } = await api.post('/admin/login', values);
      localStorage.setItem('campusnest_admin_token', data.token);
      localStorage.removeItem('mca_admin_token');
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };
  return (
    <main className="min-h-screen bg-slate-50 p-4">
      <div className="mx-auto flex w-full max-w-5xl justify-start py-4">
        <BackButton fallback="/" />
      </div>
      <div className="grid min-h-[calc(100vh-96px)] place-items-center">
      <form onSubmit={handleSubmit(submit)} className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-soft">
        <h1 className="text-3xl font-extrabold text-slate-950">Admin login</h1>
        <p className="mt-2 text-sm text-slate-500">Use the seeded admin credentials from server env.</p>
        <div className="mt-6 grid gap-4">
          <FormInput label="Email" type="email" {...register('email', { required: true })} />
          <FormInput label="Password" type="password" {...register('password', { required: true })} />
          <Button disabled={isSubmitting}>{isSubmitting ? 'Signing in...' : 'Sign in'}</Button>
        </div>
      </form>
      </div>
    </main>
  );
}
