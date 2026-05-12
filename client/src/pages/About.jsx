import { BadgeCheck, Bot, BookOpen, Code2, ExternalLink, HeartHandshake, MapPin, ShieldCheck, ShoppingBag, Utensils } from 'lucide-react';
import Container from '../components/common/Container.jsx';
import Seo from '../components/common/Seo.jsx';

const developerProfile = '/nikhil-profile.jpeg';

const values = [
  { title: 'Student-first exchange', text: 'TCET students can list books, notes, lab files and projects after TCET email verification.', icon: BadgeCheck },
  { title: 'Local campus focus', text: 'The MVP starts around Thakur College, Kandivali so listings stay relevant instead of generic.', icon: MapPin },
  { title: 'AI-assisted campus help', text: 'Campus AI answers marketplace rules and still helps students compare PG plus Mess options faster.', icon: Bot }
];

export default function About() {
  return (
    <main className="bg-white">
      <Seo
        title="About CampusNest"
        description="About CampusNest, a TCET-focused study material marketplace with PG, mess and AI support near Thakur College, Kandivali."
      />
      <section className="bg-brand py-14 text-white">
        <Container>
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-brand-gold ring-1 ring-white/10">
            <HeartHandshake className="h-4 w-4" /> About us
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight sm:text-5xl">
            Helping TCET students exchange study material and solve campus needs faster.
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-white/75">
            CampusNest gives students a safer place to buy and sell old study material, while keeping PG, mess and Campus AI support close at hand.
          </p>
        </Container>
      </section>

      <section className="py-14">
        <Container className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="rounded-3xl border border-slate-200 bg-brand-soft p-6">
            <h2 className="text-2xl font-extrabold text-brand">What CampusNest solves</h2>
            <p className="mt-4 leading-8 text-slate-700">
              Students often exchange books, notes and projects through scattered chats where trust is unclear. CampusNest adds admin review, TCET seller verification, login-protected contact details and clear safety reminders, while still supporting PG and mess discovery.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <ShoppingBag className="h-6 w-6 text-brand" />
                <p className="mt-3 font-extrabold text-slate-950">Study material marketplace</p>
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <ShieldCheck className="h-6 w-6 text-brand" />
                <p className="mt-3 font-extrabold text-slate-950">TCET verified sellers</p>
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <BookOpen className="h-6 w-6 text-brand" />
                <p className="mt-3 font-extrabold text-slate-950">PG and hostel support</p>
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <Utensils className="h-6 w-6 text-brand" />
                <p className="mt-3 font-extrabold text-slate-950">Mess and tiffin support</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="grid gap-5 p-5 sm:grid-cols-[150px_1fr] sm:items-center">
                <img src={developerProfile} alt="Nikhil, AI Full Stack Developer" className="h-40 w-full rounded-xl object-cover object-top sm:h-44" />
                <div>
                  <p className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1 text-xs font-extrabold text-brand">
                    <Code2 className="h-3.5 w-3.5" /> Built by
                  </p>
                  <h2 className="mt-3 text-2xl font-black text-slate-950">Nikhil</h2>
                  <p className="mt-1 font-bold text-slate-600">AI Full Stack Developer</p>
                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    CampusNest is built as a student-first platform for practical campus needs around TCET.
                  </p>
                  <a
                    href="https://nikhil-ai-portfolio.vercel.app"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-extrabold text-white transition hover:bg-brand-dark"
                  >
                    View portfolio <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>

            {values.map(({ title, text, icon: Icon }) => (
              <div key={title} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand text-white">
                  <Icon className="h-6 w-6" />
                </span>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-950">{title}</h2>
                  <p className="mt-1 leading-7 text-slate-600">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}
