import { BadgeCheck, Bot, MessageCircle } from 'lucide-react';

const items = [
  { title: 'Admin reviewed listings', icon: BadgeCheck },
  { title: 'AI-guided recommendations', icon: Bot },
  { title: 'Direct WhatsApp contact', icon: MessageCircle }
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
