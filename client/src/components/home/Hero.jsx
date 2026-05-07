import { Link } from 'react-router-dom';
import { ArrowRight, Bot, Building2, CheckCircle2, MapPin, Sparkles, Utensils } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../common/Button.jsx';
import Container from '../common/Container.jsx';

const heroImage = 'https://res.cloudinary.com/dugeiu4id/image/upload/v1778184435/ChatGPT_Image_May_8_2026_01_35_21_AM_ozmdeg.png';

export default function Hero() {
  const openCampusAI = () => {
    window.dispatchEvent(new CustomEvent('campus-ai:open'));
  };

  return (
    <section className="relative overflow-hidden bg-white">
      <Container className="relative grid min-h-[560px] items-center gap-8 py-10 sm:py-14 lg:grid-cols-[0.96fr_1.04fr]">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft sm:p-6 lg:p-7">
            <p className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-4 py-2 text-xs font-bold text-brand ring-1 ring-brand/10 sm:text-sm">
              <Sparkles className="h-4 w-4" /> Campus AI for Thakur College
            </p>
            <h1 className="mt-5 max-w-2xl text-3xl font-black leading-[1.08] text-slate-950 sm:text-4xl lg:text-5xl">
              Find PGs & Mess near Thakur College
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
              Compare student-friendly stays and meal plans by budget, distance, food preference and facilities.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button type="button" onClick={openCampusAI}><Bot className="h-4 w-4" />Ask Campus AI</Button>
              <Button as={Link} to="/college/thakur-college/pg" variant="secondary"><Building2 className="h-4 w-4" />Explore PGs</Button>
              <Button as={Link} to="/college/thakur-college/mess" variant="secondary"><Utensils className="h-4 w-4" />Explore Mess</Button>
            </div>
            <Button as={Link} to="/business/register" variant="subtle" className="mt-3 w-full bg-brand-soft !text-brand hover:bg-brand-soft/80 sm:w-auto">
              List Your PG/Mess <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-5 grid max-w-2xl gap-3 sm:grid-cols-3">
            {['Verified listings', 'Budget-aware answers', 'Direct contact paths'].map((item) => (
              <div key={item} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm">
                <CheckCircle2 className="h-4 w-4 text-brand" />{item}
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="relative">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-soft">
            <img src={heroImage} alt="Students near campus" loading="eager" decoding="async" fetchPriority="high" className="h-[280px] w-full rounded-2xl object-cover object-[58%_center] sm:h-[390px]" />
          </div>
          <div className="absolute -bottom-6 left-4 right-4 rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-200 sm:left-6 sm:right-auto sm:min-w-[320px]">
            <p className="inline-flex items-center gap-2 text-sm font-bold text-brand"><MapPin className="h-4 w-4" />Student-ready shortlist</p>
            <p className="mt-1 text-2xl font-extrabold text-slate-950">PG + Mess in one search</p>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
