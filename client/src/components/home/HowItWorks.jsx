import { LockKeyhole, Search, ShieldCheck } from 'lucide-react';

const steps = [
  { title: 'Browse products', text: 'See approved study material, images, price and product details without login.', icon: Search },
  { title: 'Login for contact', text: 'Seller number, branch and student details unlock only for logged-in users.', icon: LockKeyhole },
  { title: 'Pay on handover', text: 'Meet, check the product, then pay. Do not send advance payment.', icon: ShieldCheck }
];

export default function HowItWorks() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {steps.map(({ title, text, icon: Icon }, index) => (
        <div key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand"><Icon /></div>
          <p className="mt-5 text-sm font-bold text-slate-400">Step {index + 1}</p>
          <h3 className="mt-1 text-xl font-extrabold text-slate-950">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
        </div>
      ))}
    </div>
  );
}
