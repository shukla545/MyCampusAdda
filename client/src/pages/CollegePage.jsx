import { useEffect, useState } from 'react';
import { Building2, CheckCircle2, Utensils } from 'lucide-react';
import Container from '../components/common/Container.jsx';
import Button from '../components/common/Button.jsx';
import StatCard from '../components/common/StatCard.jsx';
import CategoryCards from '../components/home/CategoryCards.jsx';
import FeaturedListings from '../components/home/FeaturedListings.jsx';
import BusinessCTA from '../components/home/BusinessCTA.jsx';
import Seo from '../components/common/Seo.jsx';
import PageLoader from '../components/common/PageLoader.jsx';
import api from '../api/axios.js';

export default function CollegePage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.get('/colleges/thakur-college')
      .then(({ data }) => setData(data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);
  const featured = [...(data?.featuredPG || []), ...(data?.featuredMess || [])];
  if (loading) return <PageLoader label="Loading Thakur College listings..." />;

  return (
    <>
      <Seo
        title="Thakur College PG, Hostel and Mess Listings"
        description="Browse PG, hostel, mess and tiffin listings around Thakur College, Kandivali with CampusNest."
      />
      <section className="bg-slate-50 py-16">
        <Container className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
          <div>
            <p className="font-bold text-brand">Kandivali East, Mumbai</p>
            <h1 className="mt-3 text-5xl font-extrabold text-slate-950">Thakur College listings</h1>
            <p className="mt-4 max-w-2xl text-lg text-slate-600">Browse admin-reviewed PG/Hostel and Mess/Tiffin services around Thakur College.</p>
            <Button className="mt-7" as="a" href="#categories">Explore categories</Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <StatCard label="PG listings" value={data?.stats?.totalPG || 0} icon={Building2} />
            <StatCard label="Mess listings" value={data?.stats?.totalMess || 0} icon={Utensils} />
            <StatCard label="Verified" value={data?.stats?.verified || 0} icon={CheckCircle2} />
          </div>
        </Container>
      </section>
      <section id="categories" className="py-16"><Container><CategoryCards /></Container></section>
      <FeaturedListings listings={featured} />
      <BusinessCTA />
    </>
  );
}
