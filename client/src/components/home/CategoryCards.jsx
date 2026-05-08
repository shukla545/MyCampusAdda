import { Link } from 'react-router-dom';
import { BookOpen, Building2, Utensils } from 'lucide-react';

const categories = [
  { title: 'Study Material', text: 'Buy and sell TCET books, notes, lab files and projects with admin approval.', to: '/marketplace', icon: BookOpen, primary: true },
  { title: 'PG/Hostel', text: 'Compare stays by budget, gender, sharing and food included.', to: '/college/thakur-college/pg', icon: Building2 },
  { title: 'Mess/Tiffin', text: 'Find monthly meal plans, trial meals, veg and non-veg options.', to: '/college/thakur-college/mess', icon: Utensils }
];

export default function CategoryCards() {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {categories.map(({ title, text, to, icon: Icon, primary }) => (
        <Link key={title} to={to} className={`rounded-lg border p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-soft ${primary ? 'border-brand/20 bg-brand text-white' : 'border-slate-200 bg-white hover:border-brand/20'}`}>
          <span className={`grid h-12 w-12 place-items-center rounded-lg ${primary ? 'bg-white/15 text-white' : 'bg-brand-soft text-brand'}`}>
            <Icon className="h-7 w-7" />
          </span>
          <h3 className={`mt-5 text-2xl font-extrabold ${primary ? 'text-white' : 'text-slate-950'}`}>{title}</h3>
          <p className={`mt-2 ${primary ? 'text-white/80' : 'text-slate-500'}`}>{text}</p>
        </Link>
      ))}
    </div>
  );
}
