import { BadgeCheck, Bot, Building2, HeartHandshake, MapPin, Utensils } from 'lucide-react';
import Container from '../components/common/Container.jsx';
import Seo from '../components/common/Seo.jsx';

const values = [
  { title: 'Student-first discovery', text: 'Shortlists focus on practical decisions like budget, distance, food preference and direct contact.', icon: BadgeCheck },
  { title: 'Local campus focus', text: 'The MVP starts around Thakur College, Kandivali so listings stay relevant instead of generic.', icon: MapPin },
  { title: 'AI-assisted search', text: 'Campus AI helps students ask in normal language and compare PG plus Mess options faster.', icon: Bot }
];

export default function About() {
  return (
    <main className="bg-white">
      <Seo
        title="About MyCampusAdda"
        description="About MyCampusAdda, a student-focused platform for finding PGs, hostels, mess and tiffin services near Thakur College, Kandivali."
      />
      <section className="bg-brand py-14 text-white">
        <Container>
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-brand-gold ring-1 ring-white/10">
            <HeartHandshake className="h-4 w-4" /> About us
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight sm:text-5xl">
            Helping students find campus stays and meals without guesswork.
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-white/75">
            MyCampusAdda connects students near Thakur College with admin-reviewed PG, hostel, mess and tiffin options, backed by a Campus AI assistant for faster shortlisting.
          </p>
        </Container>
      </section>

      <section className="py-14">
        <Container className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="rounded-3xl border border-slate-200 bg-brand-soft p-6">
            <h2 className="text-2xl font-extrabold text-brand">What MyCampusAdda solves</h2>
            <p className="mt-4 leading-8 text-slate-700">
              Students often compare PGs, hostels and mess plans across scattered WhatsApp forwards, calls and random listings. MyCampusAdda brings that search into one clean place with filters, direct contact paths and AI recommendations.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <Building2 className="h-6 w-6 text-brand" />
                <p className="mt-3 font-extrabold text-slate-950">PG and hostel options</p>
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <Utensils className="h-6 w-6 text-brand" />
                <p className="mt-3 font-extrabold text-slate-950">Mess and tiffin options</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
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
