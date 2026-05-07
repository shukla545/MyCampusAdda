import { Link } from 'react-router-dom';
import { ArrowRight, Bot, Building2, Sparkles, Utensils } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../common/Button.jsx';
import Container from '../common/Container.jsx';

export default function Hero() {
  const openCampusAI = () => {
    window.dispatchEvent(new CustomEvent('campus-ai:open'));
  };

  return (
    <section className="relative overflow-hidden bg-white">
      <Container className="grid min-h-[620px] items-center gap-10 py-16 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
          <p className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-sm font-bold text-indigo-700 ring-1 ring-indigo-100">
            <Sparkles className="h-4 w-4" /> Campus AI for Thakur College
          </p>
          <h1 className="mt-6 max-w-3xl text-5xl font-extrabold leading-tight text-slate-950 sm:text-6xl">Find PGs and Mess near Thakur College</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">Ask one prompt and get student-friendly PG and Mess recommendations by budget, food preference, distance and facilities.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button type="button" onClick={openCampusAI}><Bot className="h-4 w-4" />Ask Campus AI</Button>
            <Button as={Link} to="/college/thakur-college/pg" variant="secondary"><Building2 className="h-4 w-4" />Explore PGs</Button>
            <Button as={Link} to="/college/thakur-college/mess" variant="secondary"><Utensils className="h-4 w-4" />Explore Mess</Button>
            <Button as={Link} to="/business/register" variant="subtle">List Your PG/Mess <ArrowRight className="h-4 w-4" /></Button>
          </div>
          <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
            {['Best PG + Mess fit', 'Budget-aware answers', 'Direct contact paths'].map((item) => (
              <div key={item} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm">
                {item}
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="relative">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-3 shadow-soft">
            <img src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80" alt="Students near campus" className="h-[430px] w-full rounded-2xl object-cover" />
          </div>
          <div className="absolute -bottom-6 left-6 rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-200">
            <p className="text-sm font-bold text-slate-500">Campus AI shortlist</p>
            <p className="mt-1 text-2xl font-extrabold text-slate-950">PG + Mess in one ask</p>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
