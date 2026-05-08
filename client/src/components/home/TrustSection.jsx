import { BadgeCheck, LockKeyhole, ShieldCheck } from 'lucide-react';

const items = [
  { title: 'Admin approved products', icon: BadgeCheck },
  { title: 'Login protected seller contact', icon: LockKeyhole },
  { title: 'Payment only after handover', icon: ShieldCheck }
];

export default function TrustSection() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map(({ title, icon: Icon }) => (
        <div key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <Icon className="h-7 w-7 text-brand" />
          <p className="mt-4 font-bold text-slate-900">{title}</p>
        </div>
      ))}
    </div>
  );
}
