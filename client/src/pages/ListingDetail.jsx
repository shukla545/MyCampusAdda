import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Container from '../components/common/Container.jsx';
import Badge from '../components/common/Badge.jsx';
import Breadcrumbs from '../components/common/Breadcrumbs.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import PageLoader from '../components/common/PageLoader.jsx';
import Seo from '../components/common/Seo.jsx';
import FacilityPills from '../components/listings/FacilityPills.jsx';
import ListingGallery from '../components/listings/ListingGallery.jsx';
import ContactBox from '../components/listings/ContactBox.jsx';
import FAQSection from '../components/listings/FAQSection.jsx';
import SimilarListings from '../components/listings/SimilarListings.jsx';
import api from '../api/axios.js';
import { formatPrice } from '../utils/formatPrice.js';

export default function ListingDetail() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.get(`/listings/${slug}`).then(({ data }) => setData(data)).catch(() => setData(null)).finally(() => setLoading(false));
  }, [slug]);
  if (loading) return <PageLoader label="Loading listing details..." />;
  if (!data) return <Container className="py-16"><EmptyState title="Listing not found" /></Container>;
  const { listing, similarListings } = data;
  const facilities = listing.type === 'mess' && listing.messDetails?.offlineOnly
    ? ['Offline only', ...(listing.facilities || [])]
    : listing.facilities || [];
  return (
    <main className="bg-slate-50 py-8">
      <Seo
        title={`${listing.title} near Thakur College`}
        description={`${listing.title} in ${listing.area || 'Kandivali'} on CampusNest. View price, facilities, distance and contact options.`}
        image={listing.images?.[0]}
      />
      <Container className="space-y-8">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Thakur College', to: '/college/thakur-college' }, { label: listing.type === 'pg' ? 'PG' : 'Mess', to: `/college/thakur-college/${listing.type}` }, { label: listing.title }]} />
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-8">
            <ListingGallery images={listing.images} />
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap gap-2">{listing.isVerified && <Badge type="verified">Verified</Badge>}{listing.isFeatured && <Badge type="featured">Featured</Badge>}</div>
              <h1 className="mt-4 text-4xl font-extrabold text-slate-950">{listing.title}</h1>
              <p className="mt-3 text-2xl font-extrabold text-brand">{listing.priceText || formatPrice(listing.price)}</p>
              <p className="mt-2 text-slate-500">{listing.area} - {listing.distanceText}</p>
              <p className="mt-1 text-slate-600">{listing.address}</p>
              <div className="mt-5"><FacilityPills facilities={facilities} /></div>
              <p className="mt-6 leading-8 text-slate-700">{listing.description}</p>
            </section>
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-extrabold text-slate-950">{listing.type === 'pg' ? 'PG details' : 'Mess details'}</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {listing.type === 'pg' ? Object.entries({ Gender: listing.pgDetails?.gender, 'Sharing type': listing.pgDetails?.sharingType, 'Food included': listing.pgDetails?.foodIncluded ? 'Yes' : 'No', Deposit: formatPrice(listing.pgDetails?.deposit), 'Available beds': listing.pgDetails?.availableBeds }).map(([k, v]) => <Info key={k} label={k} value={v} />) : Object.entries({ 'Food type': listing.messDetails?.foodType, Meals: listing.messDetails?.meals?.join(', '), 'Monthly price': formatPrice(listing.messDetails?.monthlyPrice), 'Trial available': listing.messDetails?.trialAvailable ? 'Yes' : 'No', Delivery: listing.messDetails?.offlineOnly ? 'Offline only' : 'Contact owner' }).map(([k, v]) => <Info key={k} label={k} value={v} />)}
              </div>
              {listing.pgDetails?.rules?.length > 0 && <div className="mt-5"><h3 className="font-bold">Rules</h3><FacilityPills facilities={listing.pgDetails.rules} /></div>}
              {listing.messDetails?.weeklyMenu?.length > 0 && <div className="mt-5 grid gap-2">{listing.messDetails.weeklyMenu.map((day) => <Info key={day.day} label={day.day} value={day.items.join(', ')} />)}</div>}
            </section>
            <FAQSection faqs={listing.faqs} />
            <SimilarListings listings={similarListings} />
          </div>
          <ContactBox listing={listing} />
        </div>
      </Container>
    </main>
  );
}

function Info({ label, value }) {
  return <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-bold uppercase text-slate-400">{label}</p><p className="mt-1 font-bold text-slate-900">{value || '-'}</p></div>;
}
