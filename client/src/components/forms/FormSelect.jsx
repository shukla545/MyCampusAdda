import { forwardRef } from 'react';

const FormSelect = forwardRef(function FormSelect({ label, error, children, ...props }, ref) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      <select ref={ref} className="input" {...props}>{children}</select>
      {error && <span className="mt-1 block text-xs font-semibold text-rose-600">{error}</span>}
    </label>
  );
});

export default FormSelect;
