import { Search } from 'lucide-react';

export default function SearchInput({ value, onChange, placeholder }) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-slate-400" />
      <input className="input h-14 !pl-12" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}
