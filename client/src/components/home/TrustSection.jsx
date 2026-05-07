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
        <div key={title} className="rounded-2xl bg-slate-50 p-6">
          <Icon className="h-7 w-7 text-emerald-500" />
          <p className="mt-4 font-bold text-slate-900">{title}</p>
        </div>
      ))}
    </div>
  );
}
