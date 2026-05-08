import ListingCard from '../listings/ListingCard.jsx';
import SectionTitle from '../common/SectionTitle.jsx';
import EmptyState from '../common/EmptyState.jsx';
import SkeletonCard from '../common/SkeletonCard.jsx';

export default function FeaturedListings({ listings = [], loading = false }) {
  return (
    <section className="bg-slate-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle title="PG and Mess support" subtitle="Secondary campus help for students who also need stays and food services." />
        <div className="mt-10">
          {loading ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => <SkeletonCard key={index} />)}
            </div>
          ) : listings.length ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{listings.map((item) => <ListingCard key={item._id} listing={item} />)}</div>
          ) : (
            <EmptyState title="Featured listings will appear here" />
          )}
        </div>
      </div>
    </section>
  );
}
