import { forwardRef } from 'react';

const FormTextarea = forwardRef(function FormTextarea({ label, error, ...props }, ref) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      <textarea ref={ref} className="input min-h-32" {...props} />
      {error && <span className="mt-1 block text-xs font-semibold text-rose-600">{error}</span>}
    </label>
  );
});

export default FormTextarea;
