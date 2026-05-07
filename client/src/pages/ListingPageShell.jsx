import { useEffect, useState } from 'react';
import Container from '../components/common/Container.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import SearchInput from '../components/common/SearchInput.jsx';
import SkeletonCard from '../components/common/SkeletonCard.jsx';
import ListingCard from '../components/listings/ListingCard.jsx';
import ListingSort from '../components/listings/ListingSort.jsx';
import Seo from '../components/common/Seo.jsx';
import api from '../api/axios.js';
import { cleanParams } from '../utils/filters.js';

export default function ListingPageShell({ type, title, searchPlaceholder }) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('featured');

  useEffect(() => {
    setLoading(true);
    const delay = setTimeout(() => {
      api.get('/listings', { params: cleanParams({ college: 'thakur-college', type, search, sort }) })
        .then(({ data }) => setListings(data))
        .catch(() => setListings([]))
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(delay);
  }, [type, search, sort]);

  return (
    <main className="bg-slate-50 py-10">
      <Seo
        title={title}
        description={`${title}. Compare budget, food preference, distance, facilities and direct contact options on CampusNest.`}
      />
      <Container>
        <div className="mb-8">
          <p className="font-bold text-brand">Thakur College, Kandivali</p>
          <h1 className="mt-2 text-4xl font-extrabold text-slate-950">{title}</h1>
        </div>
        <div>
          <div className="mb-5 grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_220px]">
            <SearchInput value={search} onChange={setSearch} placeholder={searchPlaceholder} />
            <ListingSort value={sort} onChange={setSort} />
          </div>
          {loading ? <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}</div> : listings.length ? <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{listings.map((listing) => <ListingCard key={listing._id} listing={listing} />)}</div> : <EmptyState />}
        </div>
      </Container>
    </main>
  );
}
