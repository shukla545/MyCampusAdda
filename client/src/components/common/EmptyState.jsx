import { SearchX } from 'lucide-react';
import Button from './Button.jsx';

export default function EmptyState({ title = 'No listings found', message = 'Try changing your filters or search keyword.', action }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
      <SearchX className="mx-auto h-10 w-10 text-slate-400" />
      <h3 className="mt-4 text-lg font-bold text-slate-950">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">{message}</p>
      {action && <Button className="mt-5" onClick={action.onClick}>{action.label}</Button>}
    </div>
  );
}
