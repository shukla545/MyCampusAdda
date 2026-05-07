import { Loader2 } from 'lucide-react';

export default function PageLoader({ label = 'Loading CampusNest...' }) {
  return (
    <div className="grid min-h-[45vh] place-items-center bg-white px-4 py-16 text-center">
      <div>
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-soft text-brand">
          <Loader2 className="h-7 w-7 animate-spin" />
        </div>
        <p className="mt-4 text-sm font-extrabold text-slate-950">{label}</p>
        <p className="mt-1 text-xs font-semibold text-slate-500">Fetching fresh campus listings.</p>
      </div>
    </div>
  );
}
