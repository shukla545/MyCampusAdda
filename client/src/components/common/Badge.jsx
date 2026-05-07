import clsx from 'clsx';
import { CheckCircle2, Star } from 'lucide-react';

export default function Badge({ type = 'default', children }) {
  const styles = {
    verified: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    featured: 'bg-amber-50 text-amber-700 ring-amber-200',
    default: 'bg-slate-100 text-slate-700 ring-slate-200'
  };
  const Icon = type === 'verified' ? CheckCircle2 : type === 'featured' ? Star : null;
  return (
    <span className={clsx('inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ring-1', styles[type])}>
      {Icon && <Icon className="h-3.5 w-3.5" />}
      {children}
    </span>
  );
}
