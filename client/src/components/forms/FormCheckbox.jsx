import { forwardRef } from 'react';

const FormCheckbox = forwardRef(function FormCheckbox({ label, ...props }, ref) {
  return (
    <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700">
      <input ref={ref} type="checkbox" className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand" {...props} />
      {label}
    </label>
  );
});

export default FormCheckbox;
