import { forwardRef } from 'react';

const FormInput = forwardRef(function FormInput({ label, error, ...props }, ref) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      <input ref={ref} className="input" {...props} />
      {error && <span className="mt-1 block text-xs font-semibold text-rose-600">{error}</span>}
    </label>
  );
});

export default FormInput;
