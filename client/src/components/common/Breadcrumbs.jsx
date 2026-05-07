import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function Breadcrumbs({ items }) {
  return (
    <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
      {items.map((item, index) => (
        <span key={item.label} className="flex items-center gap-2">
          {item.to ? <Link className="font-semibold text-slate-700 hover:text-brand" to={item.to}>{item.label}</Link> : <span>{item.label}</span>}
          {index < items.length - 1 && <ChevronRight className="h-4 w-4" />}
        </span>
      ))}
    </nav>
  );
}
