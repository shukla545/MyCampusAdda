import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Building2, Mail, MapPin, PackagePlus, ShieldCheck, ShoppingBag, Utensils } from 'lucide-react';
import Container from './Container.jsx';

export default function Footer() {
  const adminPath = (localStorage.getItem('campusnest_admin_token') || localStorage.getItem('mca_admin_token')) ? '/admin/dashboard' : '/admin/login';
  return (
    <footer className="bg-brand text-white">
      <Container className="grid gap-10 py-12 md:grid-cols-[1.1fr_0.9fr_0.9fr]">
        <div>
          <Link to="/" className="inline-flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center overflow-hidden rounded-2xl bg-white p-1">
              <img src="/campusnest-logo.png" alt="" className="h-full w-full object-contain" />
            </span>
            <span className="text-xl font-extrabold">CampusNest</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-6 text-white/75">
            TCET-first study material marketplace with PG, mess and Campus AI support near Thakur College, Kandivali.
          </p>
          <div className="mt-5 flex flex-wrap gap-3 text-xs font-bold text-white/80">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-2"><MapPin className="h-3.5 w-3.5" />Kandivali East</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-2"><ShieldCheck className="h-3.5 w-3.5" />TCET seller verified</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-2">Campus AI ready</span>
          </div>
        </div>
        <div>
          <h2 className="text-sm font-extrabold uppercase tracking-wide text-brand-gold">Explore</h2>
          <div className="mt-4 grid gap-3 text-sm font-semibold text-white/80">
            <Link className="inline-flex items-center gap-2 hover:text-white" to="/marketplace"><ShoppingBag className="h-4 w-4" />Study material marketplace</Link>
            <Link className="inline-flex items-center gap-2 hover:text-white" to="/marketplace/sell"><PackagePlus className="h-4 w-4" />Sell study material</Link>
            <Link className="inline-flex items-center gap-2 hover:text-white" to="/college/thakur-college/pg"><Building2 className="h-4 w-4" />PG/Hostel listings</Link>
            <Link className="inline-flex items-center gap-2 hover:text-white" to="/college/thakur-college/mess"><Utensils className="h-4 w-4" />Mess/Tiffin listings</Link>
            <Link className="inline-flex items-center gap-2 hover:text-white" to="/business/register"><BookOpen className="h-4 w-4" />List PG/Mess <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
        <div>
          <h2 className="text-sm font-extrabold uppercase tracking-wide text-brand-gold">Company</h2>
          <div className="mt-4 grid gap-3 text-sm font-semibold text-white/80">
            <Link className="hover:text-white" to="/about">About us</Link>
            <Link className="inline-flex items-center gap-2 hover:text-white" to="/contact"><Mail className="h-4 w-4" />Contact</Link>
            <Link className="inline-flex items-center gap-2 hover:text-white" to="/pricing"><ShieldCheck className="h-4 w-4" />Pricing</Link>
            <Link className="hover:text-white" to="/terms">Terms of use</Link>
            <Link className="hover:text-white" to="/privacy">Privacy policy</Link>
            <Link className="hover:text-white" to="/refund-policy">Refund policy</Link>
            <Link className="hover:text-white" to="/delivery-policy">Delivery policy</Link>
            <Link className="hover:text-white" to="/cookies">Cookie policy</Link>
            <Link className="hover:text-white" to={adminPath}>Admin</Link>
          </div>
        </div>
      </Container>
      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-2 py-4 pr-24 text-xs font-semibold text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <span>Launch MVP for TCET students near Thakur College, Kandivali.</span>
          <span>Built for safer student exchange and faster campus decisions.</span>
        </Container>
      </div>
    </footer>
  );
}
