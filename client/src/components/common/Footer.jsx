import { Link } from 'react-router-dom';
import { ArrowRight, Building2, Mail, MapPin, Utensils } from 'lucide-react';
import Container from './Container.jsx';

export default function Footer() {
  const adminPath = localStorage.getItem('mca_admin_token') ? '/admin/dashboard' : '/admin/login';
  return (
    <footer className="bg-brand text-white">
      <Container className="grid gap-10 py-12 md:grid-cols-[1.1fr_0.9fr_0.9fr]">
        <div>
          <Link to="/" className="inline-flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-xl font-black text-brand">M</span>
            <span className="text-xl font-extrabold">MyCampusAdda</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-6 text-white/75">
            Student-first PG, hostel, mess and tiffin discovery near Thakur College, Kandivali.
          </p>
          <div className="mt-5 flex flex-wrap gap-3 text-xs font-bold text-white/80">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-2"><MapPin className="h-3.5 w-3.5" />Kandivali East</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-2">Campus AI ready</span>
          </div>
        </div>
        <div>
          <h2 className="text-sm font-extrabold uppercase tracking-wide text-brand-gold">Explore</h2>
          <div className="mt-4 grid gap-3 text-sm font-semibold text-white/80">
            <Link className="inline-flex items-center gap-2 hover:text-white" to="/college/thakur-college/pg"><Building2 className="h-4 w-4" />PG/Hostel listings</Link>
            <Link className="inline-flex items-center gap-2 hover:text-white" to="/college/thakur-college/mess"><Utensils className="h-4 w-4" />Mess/Tiffin listings</Link>
            <Link className="inline-flex items-center gap-2 hover:text-white" to="/business/register">List your business <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
        <div>
          <h2 className="text-sm font-extrabold uppercase tracking-wide text-brand-gold">Company</h2>
          <div className="mt-4 grid gap-3 text-sm font-semibold text-white/80">
            <Link className="hover:text-white" to="/about">About us</Link>
            <Link className="inline-flex items-center gap-2 hover:text-white" to="/contact"><Mail className="h-4 w-4" />Contact</Link>
            <Link className="hover:text-white" to="/privacy">Privacy policy</Link>
            <Link className="hover:text-white" to={adminPath}>Admin</Link>
          </div>
        </div>
      </Container>
      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-2 py-4 pr-24 text-xs font-semibold text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <span>Launch MVP for Thakur College, Kandivali.</span>
          <span>Built for faster student decisions.</span>
        </Container>
      </div>
    </footer>
  );
}
