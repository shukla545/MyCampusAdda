import { sortOptions } from '../../utils/filters.js';

export default function ListingSort({ value, onChange }) {
  return (
    <select className="input h-14" value={value} onChange={(e) => onChange(e.target.value)}>
      {sortOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
    </select>
  );
}
