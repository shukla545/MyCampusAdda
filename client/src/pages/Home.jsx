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
import Seo from '../components/common/Seo.jsx';
import api from '../api/axios.js';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  useEffect(() => {
    api.get('/listings', { params: { college: 'thakur-college', featured: true } })
      .then(({ data }) => setFeatured(data.slice(0, 6)))
      .catch(() => setFeatured([]))
      .finally(() => setLoadingFeatured(false));
  }, []);
  return (
    <>
      <Seo
        title="CampusNest - TCET Study Material Marketplace"
        description="Buy and sell TCET study material, old books, notes and projects with admin-approved listings, login-protected seller contact and Campus AI."
      />
      <Hero />
      <section className="py-16"><Container><CollegeCard /></Container></section>
      <section className="pb-16"><Container><SectionTitle title="What are you looking for?" subtitle="Marketplace is the primary TCET student exchange. PG and Mess stay available as support categories." /><div className="mt-10"><CategoryCards /></div></Container></section>
      <CampusAIShowcase />
      <FeaturedListings listings={featured} loading={loadingFeatured} />
      <section className="py-16"><Container><SectionTitle title="How it works" /><div className="mt-10"><HowItWorks /></div></Container></section>
      <section className="pb-16"><Container><TrustSection /></Container></section>
      <BusinessCTA />
    </>
  );
}
