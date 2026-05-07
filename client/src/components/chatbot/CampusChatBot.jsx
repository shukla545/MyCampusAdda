import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { CreditCard, GraduationCap, IndianRupee, LockKeyhole, Maximize2, Mic, MicOff, Minimize2, Send, Smartphone, UserPlus, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Link, useLocation } from 'react-router-dom';
import api from '../../api/axios.js';
import ChatMessage from './ChatMessage.jsx';
import ChatSuggestions from './ChatSuggestions.jsx';
import Button from '../common/Button.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const welcome = {
  role: 'bot',
  text: 'Hi, I am Campus AI. Ask me about PGs, Mess, budget, food options or facilities near Thakur College.'
};

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

const razorpayCheckoutConfig = {
  display: {
    blocks: {
      upi_first: {
        name: 'UPI and GPay',
        instruments: [{ method: 'upi' }]
      }
    },
    sequence: ['block.upi_first', 'upi', 'card', 'netbanking', 'wallet', 'paylater'],
    preferences: {
      show_default_blocks: true
    }
  }
};

export default function CampusChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([welcome]);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [plans, setPlans] = useState([]);
  const [showPaywall, setShowPaywall] = useState(false);
  const [buyingPlan, setBuyingPlan] = useState('');
  const { pathname } = useLocation();
  const { user, applyChatUsage, refreshUser } = useAuth();
  const bottomRef = useRef(null);
  const recognitionRef = useRef(null);
  const voiceBaseTextRef = useRef('');

  const currentListingSlug = useMemo(() => (pathname.startsWith('/listing/') ? pathname.split('/').filter(Boolean)[1] : undefined), [pathname]);
  const needsCredits = Boolean(user && (user.remainingFreeMessages || 0) <= 0 && (user.chatCredits || 0) <= 0);
  const shouldShowPaywall = Boolean(user && (showPaywall || needsCredits));

  useEffect(() => {
    api.get('/billing/plans').then(({ data }) => setPlans(data.plans || [])).catch(() => setPlans([]));
  }, []);

  useEffect(() => {
    setMessages([welcome]);
    setInput('');
    setShowPaywall(false);
  }, [user?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, open, isFullscreen]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  const closeChat = () => {
    stopListening();
    setOpen(false);
    setIsFullscreen(false);
  };

  const ask = useCallback(async (text) => {
    const message = text.trim();
    if (!message || loading) return;

    if (!user) {
      setOpen(true);
      setInput(message);
      toast.error('Please login to use Campus AI');
      return;
    }

    stopListening();
    setMessages((current) => [...current, { role: 'user', text: message }]);
    setInput('');
    setLoading(true);

    try {
      const { data } = await api.post('/chatbot/ask', {
        message,
        currentPage: pathname,
        currentListingSlug
      });
      setMessages((current) => [
        ...current,
        {
          role: 'bot',
          text: data.answer,
          relatedListings: data.relatedListings || [],
          suggestedActions: data.suggestedActions || []
        }
      ]);
      applyChatUsage(data.chatUsage);
      setShowPaywall(false);
    } catch (error) {
      const data = error.response?.data;
      if (error.response?.status === 402 && data?.code === 'CHAT_CREDITS_REQUIRED') {
        setPlans(data.plans || plans);
        setShowPaywall(true);
        setMessages((current) => [
          ...current,
          {
            role: 'bot',
            text: data.message || 'You used your free AI answer. Please buy chat credits to continue.'
          }
        ]);
      } else {
        toast.error(data?.message || 'Campus AI is unavailable right now');
      }
    } finally {
      setLoading(false);
    }
  }, [applyChatUsage, currentListingSlug, loading, pathname, plans, stopListening, user]);

  const buyCredits = async (planId) => {
    if (!user || buyingPlan) return;

    setBuyingPlan(planId);
    try {
      await loadRazorpayCheckout();
      const { data } = await api.post('/billing/create-order', { planId });

      const checkout = new window.Razorpay({
        key: data.keyId,
        amount: data.order.amount,
        currency: data.order.currency,
        name: 'CampusNest',
        description: data.plan.label,
        order_id: data.order.id,
        prefill: {
          name: data.user.name,
          email: data.user.email
        },
        theme: { color: '#1e3566' },
        config: razorpayCheckoutConfig,
        handler: async (response) => {
          const verify = await api.post('/billing/verify', response);
          toast.success(verify.data.message || 'AI messages added');
          await refreshUser();
          setShowPaywall(false);
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
      toast.error(error.response?.data?.message || error.message || 'Could not start Razorpay payment');
    } finally {
      setBuyingPlan('');
    }
  };

  useEffect(() => {
    const openCampusAI = () => setOpen(true);
    const openCreditPacks = () => {
      setOpen(true);
      setShowPaywall(true);
    };
    const askCampusAI = (event) => {
      const prompt = String(event.detail?.prompt || '').trim();
      setOpen(true);
      if (prompt) ask(prompt);
    };

    window.addEventListener('campus-ai:open', openCampusAI);
    window.addEventListener('campus-ai:buy-credits', openCreditPacks);
    window.addEventListener('campus-ai:ask', askCampusAI);

    return () => {
      window.removeEventListener('campus-ai:open', openCampusAI);
      window.removeEventListener('campus-ai:buy-credits', openCreditPacks);
      window.removeEventListener('campus-ai:ask', askCampusAI);
    };
  }, [ask]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape' && isFullscreen) setIsFullscreen(false);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isFullscreen]);

  useEffect(() => () => {
    recognitionRef.current?.abort?.();
  }, []);

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error('Voice typing is not supported in this browser');
      return;
    }

    if (listening) {
      stopListening();
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = true;
    recognition.continuous = false;
    voiceBaseTextRef.current = input.trim();

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = (event) => {
      setListening(false);
      if (!['aborted', 'no-speech'].includes(event.error)) {
        toast.error('Could not hear clearly. Please try again.');
      }
    };
    recognition.onresult = (event) => {
      let transcript = '';
      for (let index = 0; index < event.results.length; index += 1) {
        transcript += event.results[index][0].transcript;
      }
      const nextInput = `${voiceBaseTextRef.current} ${transcript}`.trim().replace(/\s+/g, ' ');
      setInput(nextInput);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const submit = (event) => {
    event.preventDefault();
    ask(input);
  };

  return (
    <div className="fixed bottom-5 right-5 z-[70]">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className={clsx(
              'fixed flex flex-col overflow-hidden border border-slate-200 bg-white shadow-2xl',
              isFullscreen
                ? 'inset-0 z-[80] rounded-none sm:inset-6 sm:rounded-3xl'
                : 'inset-x-3 bottom-20 max-h-[calc(100vh-7rem)] rounded-3xl sm:inset-x-auto sm:right-5 sm:w-[420px]'
            )}
          >
            <div className={clsx('flex items-center justify-between gap-3 border-b border-slate-100 bg-white px-5 py-4', isFullscreen && 'sm:px-8')}>
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-brand text-white"><GraduationCap className="h-5 w-5" /></span>
                <div className="min-w-0">
                  <h2 className="font-extrabold text-slate-950">Campus AI</h2>
                  <p className="truncate text-xs font-medium text-slate-500">
                    {user
                      ? (user.remainingFreeMessages || 0) > 0
                        ? '1 free AI answer left'
                        : `${user.chatCredits || 0} paid messages left`
                      : 'Ask about PGs, Mess, budget or facilities'}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                {user && (
                  <button
                    type="button"
                    onClick={() => setShowPaywall((value) => !value)}
                    className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-brand-soft px-3 text-xs font-extrabold text-brand transition hover:bg-brand-soft/80"
                    aria-label="Buy more AI messages"
                    title="Buy more AI messages"
                  >
                    <CreditCard className="h-4 w-4" />
                    <span className="hidden sm:inline">Buy more</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsFullscreen((value) => !value)}
                  className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"
                  aria-label={isFullscreen ? 'Exit full screen' : 'Open full screen'}
                  title={isFullscreen ? 'Exit full screen' : 'Full screen'}
                >
                  {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
                </button>
                <button type="button" onClick={closeChat} className="rounded-xl p-2 text-slate-500 hover:bg-slate-100" aria-label="Close Campus AI" title="Close">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className={clsx('overflow-y-auto bg-slate-50/70 px-4 py-4', isFullscreen ? 'min-h-0 flex-1 sm:px-8' : 'min-h-[380px]')}>
              {user ? (
                <div className={clsx('grid gap-3', isFullscreen && 'mx-auto w-full max-w-4xl')}>
                  {messages.map((message, index) => <ChatMessage key={`${message.role}-${index}`} message={message} />)}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-500">Campus AI is typing...</div>
                    </div>
                  )}
                  {shouldShowPaywall && (
                    <div className="rounded-2xl border border-brand/10 bg-white p-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand text-white">
                          <Smartphone className="h-5 w-5" />
                        </span>
                        <div>
                          <h3 className="font-extrabold text-slate-950">Buy Campus AI messages</h3>
                          <p className="mt-1 text-sm leading-6 text-slate-500">GPay and UPI are shown first in Razorpay, with cards, netbanking, wallet and pay later still available.</p>
                        </div>
                      </div>
                      <div className="mt-4 grid gap-3 sm:grid-cols-3">
                        {plans.map((plan) => (
                          <div
                            key={plan.id}
                            className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-left"
                          >
                            <p className="text-sm font-extrabold text-slate-950">{plan.name}</p>
                            <p className="mt-1 flex items-center text-2xl font-black text-brand"><IndianRupee className="h-5 w-5" />{plan.price}</p>
                            <p className="mt-1 text-xs font-bold text-slate-500">{plan.label}</p>
                            <div className="mt-3 grid gap-2">
                              <button
                                type="button"
                                disabled={buyingPlan === plan.id}
                                onClick={() => buyCredits(plan.id)}
                                className="inline-flex min-h-10 w-full items-center justify-center gap-1 rounded-lg bg-emerald-600 px-3 text-xs font-black text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                <Smartphone className="h-3.5 w-3.5" />
                                {buyingPlan === plan.id ? 'Opening...' : 'GPay / UPI'}
                              </button>
                              <button
                                type="button"
                                disabled={buyingPlan === plan.id}
                                onClick={() => buyCredits(plan.id)}
                                className="inline-flex min-h-10 w-full items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-xs font-black text-slate-700 transition hover:border-brand/20 hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                <CreditCard className="h-3.5 w-3.5" />
                                Cards & more
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      {!plans.length && <p className="mt-3 text-sm font-semibold text-slate-500">Loading credit packs...</p>}
                    </div>
                  )}
                  <div ref={bottomRef} />
                </div>
              ) : (
                <div className={clsx('grid h-full min-h-[340px] place-items-center', isFullscreen && 'mx-auto max-w-xl')}>
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
                    <LockKeyhole className="mx-auto h-10 w-10 text-brand" />
                    <h3 className="mt-4 text-xl font-extrabold text-slate-950">Login to use Campus AI</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">Verified accounts can ask AI recommendations and access protected listing tools.</p>
                    <div className="mt-5 grid gap-2 sm:grid-cols-2">
                      <Button as={Link} to="/login"><LockKeyhole className="h-4 w-4" />Login</Button>
                      <Button as={Link} to="/signup" variant="secondary"><UserPlus className="h-4 w-4" />Signup</Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-slate-100 bg-white p-4 sm:px-5">
              <div className={clsx(isFullscreen && 'mx-auto w-full max-w-4xl')}>
                <ChatSuggestions onSelect={ask} disabled={loading || needsCredits} />
                <form onSubmit={submit} className="mt-3 flex gap-2">
                  <input
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    placeholder={listening ? 'Listening...' : 'Ask about PG, Mess or budget...'}
                    disabled={!user || needsCredits}
                    className="input h-12 flex-1 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={startListening}
                    disabled={loading || !user || needsCredits}
                    className={clsx(
                      'grid h-12 w-12 shrink-0 place-items-center rounded-xl transition disabled:cursor-not-allowed disabled:opacity-60',
                      listening ? 'bg-rose-50 text-rose-600 ring-1 ring-rose-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    )}
                    aria-label={listening ? 'Stop voice typing' : 'Start voice typing'}
                    title={listening ? 'Stop voice typing' : 'Voice typing'}
                  >
                    {listening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                  </button>
                  <button type="submit" disabled={loading || !user || needsCredits || !input.trim()} className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60" aria-label="Send message">
                    <Send className="h-5 w-5" />
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isFullscreen && (
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="group relative grid h-16 w-16 place-items-center rounded-2xl bg-brand text-white shadow-2xl shadow-brand/30 transition hover:-translate-y-1 hover:bg-brand-dark"
          aria-label="Open Campus AI Help Bot"
        >
          <span className="absolute -right-1 -top-1 grid h-6 w-6 place-items-center rounded-full bg-brand-gold text-[10px] font-black text-slate-950 ring-2 ring-white">AI</span>
          {open ? <X className="h-7 w-7" /> : <GraduationCap className="h-8 w-8 transition group-hover:-rotate-6" />}
        </button>
      )}
    </div>
  );
}
