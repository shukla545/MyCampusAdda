import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';

export default function CollegeCard() {
  return (
    <Link to="/college/thakur-college" className="block rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
      <MapPin className="h-6 w-6 text-indigo-600" />
      <h3 className="mt-4 text-xl font-extrabold text-slate-950">Currently available for Thakur College, Kandivali</h3>
      <p className="mt-2 text-sm text-slate-500">Browse verified PGs, hostels, mess and tiffin services around Thakur Village.</p>
    </Link>
  );
}
