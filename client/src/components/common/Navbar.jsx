import { Link, NavLink } from 'react-router-dom';
import { Bot, ChevronDown, CreditCard, LogOut, Menu, PackagePlus, ShieldCheck, ShoppingBag, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import Container from './Container.jsx';
import Button from './Button.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const nav = [
  { to: '/', label: 'Home' },
  { to: '/marketplace', label: 'Marketplace' },
  { to: '/marketplace/sell', label: 'Sell material' },
  { to: '/college/thakur-college/pg', label: 'PGs' },
  { to: '/college/thakur-college/mess', label: 'Mess' },
  { to: '/business/register', label: 'List PG/Mess' }
];

const getInitial = (name = 'User') => name.trim().charAt(0).toUpperCase() || 'U';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef(null);
  const { user, logout } = useAuth();
  const linkClass = ({ isActive }) => `rounded-full px-3 py-2 text-sm font-semibold transition ${isActive ? 'bg-white text-brand' : 'text-white/80 hover:bg-white/10 hover:text-white'}`;
  const mobileLinkClass = ({ isActive }) => `rounded-xl px-3 py-3 text-sm font-bold transition ${isActive ? 'bg-white text-brand' : 'text-white/80 hover:bg-white/10 hover:text-white'}`;

  useEffect(() => {
    const onClick = (event) => {
      if (!accountRef.current?.contains(event.target)) setAccountOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const logoutUser = async () => {
    try {
      await logout();
      toast.success('Logged out');
      setOpen(false);
      setAccountOpen(false);
    } catch {
      toast.error('Could not logout');
    }
  };

  const openCreditPacks = () => {
    window.dispatchEvent(new CustomEvent('campus-ai:buy-credits'));
    setOpen(false);
    setAccountOpen(false);
  };

  const accountSummary = user && (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
      <div className="flex items-start gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand text-base font-black text-white">
          {getInitial(user.name)}
        </span>
        <div className="min-w-0">
          <p className="truncate font-extrabold text-slate-950">{user.name || 'User'}</p>
          <p className="truncate text-xs font-semibold text-slate-500">{user.email}</p>
          <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
            <ShieldCheck className="h-3.5 w-3.5" />{user.role === 'admin' ? 'Admin access' : 'Verified'}
          </span>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="flex items-center gap-1 text-xs font-bold text-slate-500"><Bot className="h-3.5 w-3.5" />Free</p>
          <p className="mt-1 text-xl font-black text-slate-950">{user.remainingFreeMessages || 0}</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="flex items-center gap-1 text-xs font-bold text-slate-500"><CreditCard className="h-3.5 w-3.5" />Credits</p>
          <p className="mt-1 text-xl font-black text-slate-950">{user.chatCredits || 0}</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="flex items-center gap-1 text-xs font-bold text-slate-500"><ShoppingBag className="h-3.5 w-3.5" />Passes</p>
          <p className="mt-1 text-xl font-black text-slate-950">{user.marketplaceSellPasses || 0}</p>
        </div>
      </div>
      {user.role === 'admin' && (
        <p className="mt-3 rounded-xl bg-brand-soft px-3 py-2 text-xs font-bold leading-5 text-brand">
          Admin login gets 1 free AI answer each time you login again.
        </p>
      )}
      <button type="button" onClick={openCreditPacks} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 text-sm font-extrabold text-white transition hover:bg-brand-dark">
        <CreditCard className="h-4 w-4" />Buy credits
      </button>
      <Link to="/marketplace/sell" onClick={() => { setAccountOpen(false); setOpen(false); }} className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-extrabold text-white transition hover:bg-emerald-700">
        <PackagePlus className="h-4 w-4" />Sell material
      </Link>
      <button type="button" onClick={logoutUser} className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-3 text-sm font-extrabold text-slate-700 transition hover:bg-slate-200">
        <LogOut className="h-4 w-4" />Logout
      </button>
    </div>
  );

  return (
    <header className="glass-nav sticky top-0 z-50 border-b border-white/10 shadow-sm">
      <Container className="flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center overflow-hidden rounded-2xl bg-white p-1">
            <img src="/campusnest-logo.png" alt="" className="h-full w-full object-contain" />
          </span>
          <span className="text-lg font-extrabold text-white">CampusNest</span>
        </Link>
        <nav className="hidden items-center gap-3 lg:gap-5 md:flex">
          {nav.map((item) => <NavLink key={item.to} to={item.to} className={linkClass}>{item.label}</NavLink>)}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <div ref={accountRef} className="relative">
              <button
                type="button"
                onClick={() => setAccountOpen((value) => !value)}
                className="flex items-center gap-2 rounded-2xl bg-white/10 px-2 py-2 text-sm font-bold text-white transition hover:bg-white/15"
                aria-label="Open account menu"
              >
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-white font-black text-brand">{getInitial(user.name)}</span>
                <span className="max-w-24 truncate">{user.name?.split(' ')[0] || 'User'}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              {accountOpen && <div className="absolute right-0 top-14 w-80">{accountSummary}</div>}
            </div>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>Login</NavLink>
              <Button as={Link} to="/signup" className="px-4 py-2">Signup</Button>
            </>
          )}
        </div>
        <button className="rounded-xl p-2 text-white md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X /> : <Menu />}
        </button>
      </Container>
      {open && (
        <div className="border-t border-white/10 bg-brand md:hidden">
          <Container className="grid gap-2 py-4">
            {nav.map((item) => <NavLink key={item.to} to={item.to} onClick={() => setOpen(false)} className={mobileLinkClass}>{item.label}</NavLink>)}
            <div className="mt-2 border-t border-white/10 pt-3">
              {user ? (
                <div className="grid gap-3">
                  {accountSummary}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Button as={Link} to="/login" variant="secondary" onClick={() => setOpen(false)} className="py-2">Login</Button>
                  <Button as={Link} to="/signup" onClick={() => setOpen(false)} className="bg-white py-2 !text-brand hover:bg-brand-gold">Signup</Button>
                </div>
              )}
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
