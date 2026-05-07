import { Bot, MessageCircle, Search } from 'lucide-react';

const steps = [
  { title: 'Ask Campus AI', text: 'Share budget, food preference and facilities in one prompt.', icon: Bot },
  { title: 'Compare the shortlist', text: 'Open matched PG and Mess listings with student-friendly details.', icon: Search },
  { title: 'Contact directly', text: 'Use WhatsApp or listing actions without a student login.', icon: MessageCircle }
];

export default function HowItWorks() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {steps.map(({ title, text, icon: Icon }, index) => (
        <div key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600"><Icon /></div>
          <p className="mt-5 text-sm font-bold text-slate-400">Step {index + 1}</p>
          <h3 className="mt-1 text-xl font-extrabold text-slate-950">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
        </div>
      ))}
    </div>
  );
}
