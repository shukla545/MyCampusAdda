import { Bot, MessageCircle, Sparkles } from 'lucide-react';
import Container from '../common/Container.jsx';

const prompts = [
  'How can I sell old study material?',
  'Best boys PG under Rs. 9000'
];

const openCampusAI = (prompt) => {
  window.dispatchEvent(new CustomEvent('campus-ai:ask', { detail: { prompt } }));
};

export default function CampusAIShowcase() {
  return (
    <section className="bg-white py-8">
      <Container>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
            <div className="flex gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand text-white">
                <Bot className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-extrabold text-brand">Campus AI</p>
                <h2 className="mt-1 text-2xl font-black text-slate-950">Quick help for marketplace, PG and Mess.</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                  Ask about selling material, finding PGs, mess options, budget or campus support without reading long sections.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 md:justify-end">
              {prompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => openCampusAI(prompt)}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-brand/20 hover:bg-brand-soft hover:text-brand"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  {prompt}
                </button>
              ))}
              <button
                type="button"
                onClick={() => openCampusAI('What can CampusNest help me with?')}
                className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-xs font-extrabold text-white transition hover:bg-brand-dark"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Ask AI
              </button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
