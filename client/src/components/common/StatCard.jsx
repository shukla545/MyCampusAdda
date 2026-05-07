export default function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-500">{label}</p>
        {Icon && <Icon className="h-5 w-5 text-indigo-600" />}
      </div>
      <p className="mt-3 text-3xl font-extrabold text-slate-950">{value}</p>
    </div>
  );
}
