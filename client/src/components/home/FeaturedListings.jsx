import ListingCard from '../listings/ListingCard.jsx';
import SectionTitle from '../common/SectionTitle.jsx';
import EmptyState from '../common/EmptyState.jsx';

export default function FeaturedListings({ listings = [] }) {
  return (
    <section className="bg-slate-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle title="Featured near campus" subtitle="Admin-reviewed stays and food services students can contact directly." />
        <div className="mt-10">
          {listings.length ? <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{listings.map((item) => <ListingCard key={item._id} listing={item} />)}</div> : <EmptyState title="Featured listings will appear here" />}
        </div>
      </div>
    </section>
  );
}
