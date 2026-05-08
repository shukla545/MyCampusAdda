import { Bot, BookOpen, CheckCircle2, MessageCircle, Sparkles, Utensils } from 'lucide-react';
import Container from '../common/Container.jsx';

const prompts = [
  'How can I sell old study material?',
  'Do I need login for seller contact?',
  'Best boys PG under Rs. 9000 with mess nearby',
  'Veg mess near Thakur College with trial meal'
];

const strengths = [
  { title: 'Answers marketplace rules', text: 'Free product limit, Sell Pass pricing, admin approval and contact lock are covered.', icon: MessageCircle },
  { title: 'Still recommends PG and Mess', text: 'Campus AI keeps the support categories searchable for stays and food.', icon: CheckCircle2 },
  { title: 'Uses approved data', text: 'Answers stay tied to approved listings and safety disclaimers.', icon: Sparkles }
];

const openCampusAI = (prompt) => {
  window.dispatchEvent(new CustomEvent('campus-ai:ask', { detail: { prompt } }));
};

export default function CampusAIShowcase() {
  return (
    <section className="bg-white py-16">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-4 py-2 text-sm font-bold text-brand ring-1 ring-brand/10">
              <Bot className="h-4 w-4" /> Campus AI Agent
            </p>
            <h2 className="mt-5 max-w-2xl text-3xl font-extrabold leading-tight text-slate-950 sm:text-4xl">
              One prompt for marketplace, PG and Mess help.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
              Students can ask in simple language about selling old material, login-gated contact, pricing packs, PGs, Mess or combined campus needs.
            </p>

            <div className="mt-7 grid gap-3">
              {strengths.map(({ title, text, icon: Icon }) => (
                <div key={title} className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-brand ring-1 ring-slate-200">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-950">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-500">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-brand p-4 shadow-brand">
            <div className="rounded-xl bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand text-white">
                    <Bot className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-extrabold text-slate-950">Campus AI</p>
                    <p className="text-xs font-semibold text-slate-500">PG, Mess, budget and facilities</p>
                  </div>
                </div>
                <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">Live on site</span>
              </div>

              <div className="mt-4 grid gap-3">
                <div className="ml-auto max-w-[82%] rounded-xl bg-brand px-4 py-3 text-sm font-semibold leading-6 text-white">
                  Best PG with veg mess under Rs. 12000 near college
                </div>
                <div className="max-w-[90%] rounded-xl bg-slate-100 px-4 py-3 text-sm leading-6 text-slate-700">
                  Campus AI explains marketplace approval, Sell Passes and safety rules, while still helping with PG and Mess shortlists.
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <BookOpen className="h-5 w-5 text-brand" />
                    <p className="mt-3 text-sm font-extrabold text-slate-950">Marketplace rules</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">2 free listings, Sell Passes, approval, contact lock.</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <Utensils className="h-5 w-5 text-emerald-600" />
                    <p className="mt-3 text-sm font-extrabold text-slate-950">Campus support</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">PG, Mess, budget, facilities and direct listing actions.</p>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {prompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => openCampusAI(prompt)}
                    className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-brand/20 hover:bg-brand-soft hover:text-brand"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
