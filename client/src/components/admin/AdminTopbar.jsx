import { Link } from 'react-router-dom';
import Button from '../common/Button.jsx';
import BackButton from '../common/BackButton.jsx';

export default function AdminTopbar({ title }) {
  return (
    <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur lg:px-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <BackButton fallback="/admin/dashboard" className="px-3 py-2" />
          <div>
            <p className="text-xs font-bold uppercase text-slate-400">Admin</p>
            <h1 className="text-2xl font-extrabold text-slate-950">{title}</h1>
          </div>
        </div>
        <Button as={Link} to="/" variant="secondary" className="hidden sm:inline-flex">View site</Button>
      </div>
    </div>
  );
}
