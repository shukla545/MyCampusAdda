const starters = [
  'Boys PG under Rs. 9000',
  'Best PG + mess combo',
  'Veg mess near Thakur College'
];

export default function ChatSuggestions({ onSelect, disabled }) {
  return (
    <div className="flex flex-wrap gap-2">
      {starters.map((starter) => (
        <button
          key={starter}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(starter)}
          className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 shadow-sm transition hover:border-brand/20 hover:bg-brand-soft hover:text-brand disabled:cursor-not-allowed disabled:opacity-60"
        >
          {starter}
        </button>
      ))}
    </div>
  );
}
