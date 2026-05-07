export default function FacilityPills({ facilities = [], limit }) {
  const visible = limit ? facilities.slice(0, limit) : facilities;
  return (
    <div className="flex flex-wrap gap-2">
      {visible.map((facility) => (
        <span key={facility} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{facility}</span>
      ))}
      {limit && facilities.length > limit && <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">+{facilities.length - limit}</span>}
    </div>
  );
}
