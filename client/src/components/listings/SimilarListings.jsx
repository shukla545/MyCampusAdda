import ListingCard from './ListingCard.jsx';

export default function SimilarListings({ listings = [] }) {
  if (!listings.length) return null;
  return (
    <section>
      <h2 className="mb-5 text-2xl font-extrabold text-slate-950">Similar listings</h2>
      <div className="grid gap-5 md:grid-cols-3">
        {listings.map((listing) => <ListingCard key={listing._id} listing={listing} />)}
      </div>
    </section>
  );
}
