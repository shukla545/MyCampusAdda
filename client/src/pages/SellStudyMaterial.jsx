import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CheckCircle2, Clock, CreditCard, IndianRupee, MailCheck, PackagePlus, ShieldCheck, Smartphone, UploadCloud } from 'lucide-react';
import Button from '../components/common/Button.jsx';
import Container from '../components/common/Container.jsx';
import FormInput from '../components/forms/FormInput.jsx';
import FormSelect from '../components/forms/FormSelect.jsx';
import FormTextarea from '../components/forms/FormTextarea.jsx';
import ImageUploader from '../components/admin/ImageUploader.jsx';
import Seo from '../components/common/Seo.jsx';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';

const loadRazorpayCheckout = () =>
  new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = resolve;
    script.onerror = () => reject(new Error('Could not load Razorpay Checkout'));
    document.body.appendChild(script);
  });

const defaultValues = {
  category: 'books',
  condition: 'good',
  branch: ''
};

const passText = (count) => `${count} Sell Pass${count === 1 ? '' : 'es'}`;

export default function SellStudyMaterial() {
  const { user, refreshUser } = useAuth();
  const [images, setImages] = useState([]);
  const [myListings, setMyListings] = useState([]);
  const [allowance, setAllowance] = useState(null);
  const [done, setDone] = useState(null);
  const [plans, setPlans] = useState([]);
  const [buyingPlan, setBuyingPlan] = useState('');
  const [showPassPlans, setShowPassPlans] = useState(false);
  const [tcetEmail, setTcetEmail] = useState(user?.tcetEmail || '');
  const [tcetOtp, setTcetOtp] = useState('');
  const [tcetOtpSent, setTcetOtpSent] = useState(false);
  const [tcetDevOtp, setTcetDevOtp] = useState('');
  const [verifyingTcet, setVerifyingTcet] = useState(false);
  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({ defaultValues });

  const loadMine = useCallback(() => {
    api.get('/marketplace/mine')
      .then(({ data }) => {
        setMyListings(data.listings || []);
        setAllowance(data.allowance);
        setPlans(data.allowance?.plans || []);
      })
      .catch(() => {
        setMyListings([]);
      });
  }, []);

  useEffect(() => {
    loadMine();
    api.get('/billing/marketplace-plans').then(({ data }) => setPlans(data.plans || [])).catch(() => {});
  }, [loadMine]);

  useEffect(() => {
    if (user?.name) setValue('sellerName', user.name);
  }, [setValue, user]);

  useEffect(() => {
    if (user?.tcetEmail) setTcetEmail(user.tcetEmail);
  }, [user?.tcetEmail]);

  const freeRemaining = allowance?.freeRemaining ?? 2;
  const sellPasses = allowance?.sellPasses ?? user?.marketplaceSellPasses ?? 0;
  const sellerVerified = Boolean(user?.tcetEmailVerified || allowance?.tcetEmailVerified);
  const needsMoreSlots = freeRemaining <= 0 && sellPasses <= 0;

  const requestTcetOtp = async () => {
    setVerifyingTcet(true);
    try {
      const { data } = await api.post('/auth/seller-tcet/request-otp', { email: tcetEmail });
      setTcetOtpSent(true);
      setTcetDevOtp(data.devOtp || '');
      toast.success(data.message || 'OTP sent to TCET email');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not send TCET OTP');
    } finally {
      setVerifyingTcet(false);
    }
  };

  const verifyTcetOtp = async () => {
    setVerifyingTcet(true);
    try {
      const { data } = await api.post('/auth/seller-tcet/verify', { email: tcetEmail, otp: tcetOtp });
      toast.success(data.message || 'TCET email verified');
      setTcetOtp('');
      setTcetDevOtp('');
      await refreshUser();
      loadMine();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not verify TCET email');
    } finally {
      setVerifyingTcet(false);
    }
  };

  const submit = async (payload) => {
    if (!sellerVerified) {
      toast.error('Verify your TCET email before selling study material.');
      return;
    }

    if (needsMoreSlots) {
      setShowPassPlans(true);
      toast.error('Your free slots are used. Buy a Sell Pass to add more products.');
      return;
    }

    if (!images.length) {
      toast.error('Upload at least 1 product image');
      return;
    }

    try {
      const { data } = await api.post('/marketplace', { ...payload, images });
      setDone(data.listing);
      setAllowance(data.allowance);
      setImages([]);
      reset({ ...defaultValues, sellerName: user?.name || '' });
      loadMine();
      await refreshUser();
      toast.success('Submitted for admin approval');
    } catch (error) {
      const response = error.response?.data;
      if (error.response?.status === 402 && response?.allowance) {
        setAllowance(response.allowance);
        setPlans(response.allowance.plans || plans);
        setShowPassPlans(true);
      }
      toast.error(response?.message || 'Could not submit product');
    }
  };

  const buyPasses = async (planId) => {
    if (buyingPlan) return;
    setBuyingPlan(planId);
    try {
      await loadRazorpayCheckout();
      const { data } = await api.post('/billing/marketplace/create-order', { planId });
      const checkout = new window.Razorpay({
        key: data.keyId,
        amount: data.order.amount,
        currency: data.order.currency,
        name: 'CampusNest Marketplace',
        description: data.plan.label,
        order_id: data.order.id,
        prefill: {
          name: data.user.name,
          email: data.user.email
        },
        theme: { color: '#1e3566' },
        handler: async (response) => {
          const verify = await api.post('/billing/marketplace/verify', response);
          toast.success(verify.data.message || 'Sell Passes added');
          await refreshUser();
          loadMine();
          setShowPassPlans(false);
        },
        modal: {
          ondismiss: () => setBuyingPlan('')
        }
      });
      checkout.on('payment.failed', (response) => {
        toast.error(response.error?.description || 'Payment failed');
      });
      checkout.open();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Could not start payment');
    } finally {
      setBuyingPlan('');
    }
  };

  return (
    <main className="bg-slate-50 py-10">
      <Seo
        title="Sell Study Material on TCET Marketplace"
        description="TCET students can sell old study material on CampusNest Marketplace after login and admin approval."
      />
      <Container className="grid gap-8 xl:grid-cols-[1fr_0.68fr]">
        <section>
          <p className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-brand ring-1 ring-slate-200">
            <UploadCloud className="h-4 w-4" /> Student seller
          </p>
          <h1 className="mt-4 text-4xl font-black leading-tight text-slate-950">Sell your study material</h1>
          <p className="mt-3 max-w-2xl text-base leading-8 text-slate-600">
            Upload at least 1 image, add product details and contact details, then wait for admin approval before it goes live.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <Metric label="Free left" value={freeRemaining} />
            <Metric label="Your Sell Passes" value={sellPasses} />
            <Metric label="Submitted" value={allowance?.activeListingCount ?? myListings.length} />
          </div>

          {done && (
            <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <div className="flex gap-3">
                <CheckCircle2 className="mt-1 h-5 w-5 text-emerald-700" />
                <div>
                  <h2 className="font-extrabold text-emerald-950">Waiting for admin approval</h2>
                  <p className="mt-1 text-sm leading-6 text-emerald-800">After approval, buyers will see your product live on the marketplace.</p>
                </div>
              </div>
            </div>
          )}

          {!sellerVerified && (
            <section className="mt-6 rounded-lg border border-brand/15 bg-white p-5 shadow-sm">
              <div className="flex gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand">
                  <MailCheck className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="text-xl font-extrabold text-slate-950">Verify TCET email to sell</h2>
                  <p className="mt-1 text-sm leading-6 text-slate-500">Buyers can use any account, but sellers must verify a TCET email ending with @tcetmumbai.in.</p>
                  <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]">
                    <input
                      value={tcetEmail}
                      onChange={(event) => setTcetEmail(event.target.value)}
                      placeholder="your-roll-number@tcetmumbai.in"
                      className="input rounded-xl"
                    />
                    <Button type="button" onClick={requestTcetOtp} disabled={verifyingTcet} className="rounded-xl">
                      {tcetOtpSent ? 'Resend OTP' : 'Send OTP'}
                    </Button>
                  </div>
                  {tcetOtpSent && (
                    <div className="mt-3 grid gap-3 md:grid-cols-[1fr_auto]">
                      <input
                        value={tcetOtp}
                        onChange={(event) => setTcetOtp(event.target.value)}
                        placeholder="6 digit OTP"
                        className="input rounded-xl"
                      />
                      <Button type="button" onClick={verifyTcetOtp} disabled={verifyingTcet || !tcetOtp.trim()} className="rounded-xl">
                        Verify email
                      </Button>
                    </div>
                  )}
                  {tcetDevOtp && <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700">Dev OTP: {tcetDevOtp}</p>}
                </div>
              </div>
            </section>
          )}

          {sellerVerified && (
            <section className={`mt-6 rounded-lg border p-5 shadow-sm ${needsMoreSlots ? 'border-amber-200 bg-amber-50' : 'border-slate-200 bg-white'}`}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className={`text-xl font-extrabold ${needsMoreSlots ? 'text-amber-950' : 'text-slate-950'}`}>{needsMoreSlots ? 'No product slots left' : 'Sell Pass packs'}</h2>
                  <p className={`mt-1 text-sm leading-6 ${needsMoreSlots ? 'text-amber-800' : 'text-slate-500'}`}>
                    {needsMoreSlots ? 'Your 2 free listings are used. Buy a Sell Pass to add another product.' : 'Optional paid packs are available if you want to see prices before your free slots are used.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassPlans((value) => !value)}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-brand px-5 text-sm font-extrabold text-white transition hover:bg-brand-dark"
                >
                  <PackagePlus className="h-4 w-4" />
                  {showPassPlans ? 'Hide packs' : 'Buy more'}
                </button>
              </div>

              {showPassPlans && (
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {plans.map((plan) => (
                    <div key={plan.id} className="rounded-xl border border-slate-200 bg-white p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-extrabold text-slate-950">{plan.name}</p>
                          <p className="mt-1 text-xs font-bold text-slate-500">{passText(plan.passes)}</p>
                        </div>
                        <p className="flex items-center text-2xl font-black text-brand">
                          <IndianRupee className="h-5 w-5" />{plan.price}
                        </p>
                      </div>
                      <div className="mt-3 grid gap-2">
                        <button
                          type="button"
                          disabled={buyingPlan === plan.id}
                          onClick={() => buyPasses(plan.id)}
                          className="inline-flex min-h-10 w-full items-center justify-center gap-1 rounded-lg bg-emerald-600 px-3 text-xs font-black text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <Smartphone className="h-3.5 w-3.5" />
                          {buyingPlan === plan.id ? 'Opening...' : 'GPay / UPI'}
                        </button>
                        <button
                          type="button"
                          disabled={buyingPlan === plan.id}
                          onClick={() => buyPasses(plan.id)}
                          className="inline-flex min-h-10 w-full items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-xs font-black text-slate-700 transition hover:border-brand/20 hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <CreditCard className="h-3.5 w-3.5" />
                          Cards & more
                        </button>
                      </div>
                    </div>
                  ))}
                  {!plans.length && <p className="text-sm font-semibold text-amber-800">Loading Sell Pass packs...</p>}
                </div>
              )}
            </section>
          )}

          {sellerVerified && <form onSubmit={handleSubmit(submit)} className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="grid gap-4 md:grid-cols-2">
              <FormInput label="Seller name" error={errors.sellerName?.message} {...register('sellerName', { required: 'Seller name is required' })} />
              <FormInput label="Primary contact number" error={errors.primaryPhone?.message} {...register('primaryPhone', {
                required: 'Contact number is required',
                validate: (value) => String(value || '').replace(/\D/g, '').length >= 10 || 'Enter a valid number'
              })} />
              <FormInput label="Optional extra number" error={errors.extraPhone?.message} {...register('extraPhone', {
                validate: (value) => !value || String(value || '').replace(/\D/g, '').length >= 10 || 'Enter a valid optional number'
              })} />
              <FormInput label="Branch" placeholder="Computer, IT, AIDS, EXTC..." error={errors.branch?.message} {...register('branch', { required: 'Branch is required' })} />
              <FormSelect label="Category" {...register('category')}>
                <option value="books">Books</option>
                <option value="notes">Notes</option>
                <option value="project">Project</option>
                <option value="question-papers">Question Papers</option>
                <option value="lab-files">Lab Files</option>
                <option value="other">Other</option>
              </FormSelect>
              <FormSelect label="Condition" {...register('condition')}>
                <option value="new">New</option>
                <option value="like-new">Like new</option>
                <option value="good">Good</option>
                <option value="used">Used</option>
              </FormSelect>
              <FormInput label="Selling price" type="number" min="0" error={errors.price?.message} {...register('price', { required: 'Price is required', min: { value: 0, message: 'Price cannot be negative' } })} />
              <div className="md:col-span-2">
                <FormInput label="Product title" error={errors.title?.message} {...register('title', { required: 'Product title is required', minLength: { value: 4, message: 'Use at least 4 characters' } })} />
              </div>
              <div className="md:col-span-2"><FormTextarea label="Product details" error={errors.description?.message} {...register('description', { required: 'Product details are required', minLength: { value: 20, message: 'Write at least 20 characters' } })} /></div>
              <div className="md:col-span-2"><FormTextarea label="Student details (optional)" placeholder="Pickup preference, branch context, or anything buyers should know." {...register('studentDetails')} /></div>
              <div className="md:col-span-2"><ImageUploader images={images} onChange={setImages} owner /></div>
            </div>
            <Button disabled={isSubmitting} className="mt-5 w-full rounded-lg">
              <PackagePlus className="h-4 w-4" />{isSubmitting ? 'Submitting...' : 'Submit for approval'}
            </Button>
          </form>}
        </section>

        <aside className="grid gap-6 self-start">
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-extrabold text-slate-950">Your products</h2>
            <div className="mt-4 grid gap-3">
              {myListings.length ? myListings.map((item) => (
                <div key={item.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="flex gap-3">
                    <img src={item.images?.[0]} alt="" className="h-16 w-16 rounded-lg object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-extrabold text-slate-950">{item.title}</p>
                      <p className="mt-1 text-xs font-bold text-slate-500">{item.priceText} - {item.categoryLabel}</p>
                      <StatusPill status={item.status} />
                    </div>
                  </div>
                  {item.status === 'pending' && (
                    <p className="mt-3 flex items-center gap-2 text-xs font-bold text-amber-700"><Clock className="h-4 w-4" />Wait for admin approval</p>
                  )}
                  {item.status === 'approved' && (
                    <Button as={Link} to={`/marketplace/${item.slug}`} variant="secondary" className="mt-3 w-full rounded-lg px-3 py-2 text-xs">View live product</Button>
                  )}
                </div>
              )) : (
                <p className="rounded-lg bg-slate-50 p-4 text-sm font-semibold text-slate-500">No products submitted yet.</p>
              )}
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex gap-3">
              <ShieldCheck className="mt-1 h-5 w-5 text-emerald-600" />
              <div>
                <h2 className="font-extrabold text-slate-950">Admin reviewed</h2>
                <p className="mt-1 text-sm leading-6 text-slate-500">Every submitted product stays hidden until admin approval.</p>
              </div>
            </div>
          </section>
        </aside>
      </Container>
    </main>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-bold uppercase text-slate-400">{label}</p>
      <p className="mt-1 text-3xl font-black text-slate-950">{value}</p>
    </div>
  );
}

function StatusPill({ status }) {
  const styles = {
    pending: 'bg-amber-50 text-amber-700 ring-amber-100',
    approved: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    rejected: 'bg-rose-50 text-rose-700 ring-rose-100'
  };
  return (
    <span className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[11px] font-extrabold capitalize ring-1 ${styles[status] || styles.pending}`}>
      {status}
    </span>
  );
}
