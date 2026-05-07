import { useEffect, useState } from 'react';
import Container from '../components/common/Container.jsx';
import SectionTitle from '../components/common/SectionTitle.jsx';
import Hero from '../components/home/Hero.jsx';
import CollegeCard from '../components/home/CollegeCard.jsx';
import CategoryCards from '../components/home/CategoryCards.jsx';
import CampusAIShowcase from '../components/home/CampusAIShowcase.jsx';
import FeaturedListings from '../components/home/FeaturedListings.jsx';
import HowItWorks from '../components/home/HowItWorks.jsx';
import BusinessCTA from '../components/home/BusinessCTA.jsx';
import TrustSection from '../components/home/TrustSection.jsx';
import api from '../api/axios.js';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  useEffect(() => {
    api.get('/listings', { params: { college: 'thakur-college', featured: true } }).then(({ data }) => setFeatured(data.slice(0, 6))).catch(() => setFeatured([]));
  }, []);
  return (
    <>
      <Hero />
      <section className="py-16"><Container><CollegeCard /></Container></section>
      <section className="pb-16"><Container><SectionTitle title="What are you looking for?" subtitle="Two focused categories for the first MyCampusAdda MVP." /><div className="mt-10"><CategoryCards /></div></Container></section>
      <CampusAIShowcase />
      <FeaturedListings listings={featured} />
      <section className="py-16"><Container><SectionTitle title="How it works" /><div className="mt-10"><HowItWorks /></div></Container></section>
      <section className="pb-16"><Container><TrustSection /></Container></section>
      <BusinessCTA />
    </>
  );
}
