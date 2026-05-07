import clsx from 'clsx';

const variants = {
  primary: 'bg-brand text-white shadow-brand hover:bg-brand-dark',
  secondary: 'bg-white text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50',
  subtle: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
  danger: 'bg-rose-600 text-white hover:bg-rose-700'
};

export default function Button({ as: Component = 'button', variant = 'primary', className, children, ...props }) {
  return (
    <Component
      className={clsx('inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60', variants[variant], className)}
      {...props}
    >
      {children}
    </Component>
  );
}
