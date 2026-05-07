import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

export default function BackButton({ fallback = '/', label = 'Go back', className }) {
  const navigate = useNavigate();

  const goBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate(fallback);
  };

  return (
    <button
      type="button"
      onClick={goBack}
      className={clsx('inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700', className)}
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </button>
  );
}
