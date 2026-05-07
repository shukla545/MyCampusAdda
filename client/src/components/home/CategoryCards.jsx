import { Link } from 'react-router-dom';
import { Building2, Utensils } from 'lucide-react';

const categories = [
  { title: 'PG/Hostel', text: 'Compare stays by budget, gender, sharing and food included.', to: '/college/thakur-college/pg', icon: Building2 },
  { title: 'Mess/Tiffin', text: 'Find monthly meal plans, trial meals, veg and non-veg options.', to: '/college/thakur-college/mess', icon: Utensils }
];

export default function CategoryCards() {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {categories.map(({ title, text, to, icon: Icon }) => (
        <Link key={title} to={to} className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
          <Icon className="h-8 w-8 text-indigo-600" />
          <h3 className="mt-5 text-2xl font-extrabold text-slate-950">{title}</h3>
          <p className="mt-2 text-slate-500">{text}</p>
        </Link>
      ))}
    </div>
  );
}
