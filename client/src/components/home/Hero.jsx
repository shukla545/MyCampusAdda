import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Bot, Building2, CheckCircle2, LockKeyhole, MapPin, ShieldCheck, ShoppingBag, UploadCloud, Utensils } from 'lucide-react';
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
          <p className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-4 py-2 text-xs font-bold text-brand ring-1 ring-brand/10 sm:text-sm">
            <ShoppingBag className="h-4 w-4" /> CampusNest for TCET students
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl font-black leading-[1.06] text-slate-950 sm:text-5xl lg:text-6xl">
            TCET Study Material Marketplace
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
            Sell old books, notes, lab files and projects after login. Buyers can browse freely, then login only when they need seller contact.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button as={Link} to="/marketplace"><BookOpen className="h-4 w-4" />Browse marketplace</Button>
            <Button as={Link} to="/marketplace/sell" variant="secondary"><UploadCloud className="h-4 w-4" />Sell material</Button>
            <Button type="button" onClick={openCampusAI} variant="secondary"><Bot className="h-4 w-4" />Ask Campus AI</Button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button as={Link} to="/college/thakur-college/pg" variant="subtle" className="rounded-xl px-4 py-2"><Building2 className="h-4 w-4" />PGs</Button>
            <Button as={Link} to="/college/thakur-college/mess" variant="subtle" className="rounded-xl px-4 py-2"><Utensils className="h-4 w-4" />Mess</Button>
            <Button as={Link} to="/business/register" variant="subtle" className="rounded-xl px-4 py-2">List PG/Mess <ArrowRight className="h-4 w-4" /></Button>
          </div>
          <div className="mt-6 grid max-w-2xl gap-3 sm:grid-cols-3">
            {[
              ['Admin approval', ShieldCheck],
              ['Login-gated contact', LockKeyhole],
              ['Pay after handover', CheckCircle2]
            ].map(([item, Icon]) => (
              <div key={item} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm">
                <Icon className="h-4 w-4 text-brand" />{item}
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="relative">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-soft">
            <img src={heroImage} alt="Students near campus" loading="eager" decoding="async" fetchPriority="high" className="h-[280px] w-full rounded-2xl object-cover object-[58%_center] sm:h-[390px]" />
          </div>
          <div className="absolute -bottom-6 left-4 right-4 rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-200 sm:left-6 sm:right-auto sm:min-w-[320px]">
            <p className="inline-flex items-center gap-2 text-sm font-bold text-brand"><MapPin className="h-4 w-4" />TCET-first exchange</p>
            <p className="mt-1 text-2xl font-extrabold text-slate-950">Study material + campus help</p>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
