import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, LockKeyhole, ShieldCheck, ShoppingBag, UploadCloud } from 'lucide-react';
import Container from '../components/common/Container.jsx';
import Button from '../components/common/Button.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import FormSelect from '../components/forms/FormSelect.jsx';
import SearchInput from '../components/common/SearchInput.jsx';
import Seo from '../components/common/Seo.jsx';
import api from '../api/axios.js';
import { cleanParams } from '../utils/filters.js';

const categories = [
  { value: '', label: 'All material' },
  { value: 'books', label: 'Books' },
  { value: 'notes', label: 'Notes' },
  { value: 'project', label: 'Projects' },
  { value: 'question-papers', label: 'Question Papers' },
  { value: 'lab-files', label: 'Lab Files' },
  { value: 'other', label: 'Other' }
];

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'popular', label: 'Popular' },
  { value: 'price-asc', label: 'Price low to high' },
  { value: 'price-desc', label: 'Price high to low' }
];

const fallbackImage = 'https://res.cloudinary.com/dugeiu4id/image/upload/v1778184435/ChatGPT_Image_May_8_2026_01_35_21_AM_ozmdeg.png';

export default function MarketplacePage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    setLoading(true);
    api.get('/marketplace', { params: cleanParams({ search, category, sort }) })
      .then(({ data }) => setListings(data.listings || []))
      .catch(() => setListings([]))
      .finally(() => setLoading(false));
  }, [category, search, sort]);

  return (
    <main className="bg-white">
      <Seo
        title="TCET Study Material Marketplace"
        description="Buy and sell old books, notes, projects and lab files from TCET students on CampusNest Marketplace."
      />
      <section className="border-b border-slate-200 bg-slate-50">
        <Container className="grid gap-8 py-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-brand ring-1 ring-slate-200">
              <ShoppingBag className="h-4 w-4" /> TCET Marketplace
            </p>
            <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight text-slate-950 sm:text-5xl">
              TCET Study Material Marketplace
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
              Buy old books, notes, projects, question papers and lab files from verified student accounts. Seller contact unlocks only after login.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button as={Link} to="/marketplace/sell"><UploadCloud className="h-4 w-4" />Sell study material</Button>
              <Button as={Link} to="/login?next=/marketplace" variant="secondary"><LockKeyhole className="h-4 w-4" />Login for contacts</Button>
            </div>
          </div>
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft">
            <img src={fallbackImage} alt="Students exchanging study material" className="h-80 w-full object-cover object-[55%_center]" />
          </div>
        </Container>
      </section>

      <section className="py-10">
        <Container>
          <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-[1fr_220px_220px]">
            <SearchInput value={search} onChange={setSearch} placeholder="Search books, notes, projects" />
            <FormSelect label="" value={category} onChange={(event) => setCategory(event.target.value)}>
              {categories.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </FormSelect>
            <FormSelect label="" value={sort} onChange={(event) => setSort(event.target.value)}>
              {sortOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </FormSelect>
          </div>

          <div className="mt-8">
            {loading ? (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => <ProductSkeleton key={index} />)}
              </div>
            ) : listings.length ? (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {listings.map((listing) => <MarketplaceProductCard key={listing.id} listing={listing} />)}
              </div>
            ) : (
              <EmptyState
                title="No approved products yet"
                message="Try a different search, or become the first TCET student to list study material."
                action={{ label: 'Sell study material', onClick: () => { window.location.href = '/marketplace/sell'; } }}
              />
            )}
          </div>
        </Container>
      </section>
    </main>
  );
}

function MarketplaceProductCard({ listing }) {
  const image = listing.images?.[0] || fallbackImage;
  return (
    <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-brand/20 hover:shadow-soft">
      <Link to={`/marketplace/${listing.slug}`} className="block">
        <img src={image} alt={listing.title} className="h-52 w-full object-cover" loading="lazy" />
      </Link>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-extrabold text-brand">{listing.categoryLabel}</span>
          <span className="text-lg font-black text-slate-950">{listing.priceText || `Rs. ${listing.price}`}</span>
        </div>
        <h2 className="mt-3 line-clamp-2 text-lg font-extrabold text-slate-950">{listing.title}</h2>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">{listing.description}</p>
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs font-bold leading-5 text-amber-800 ring-1 ring-amber-100">
          <ShieldCheck className="h-4 w-4 shrink-0" />Pay only after product handover.
        </div>
        <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
          <Button as={Link} to={`/marketplace/${listing.slug}`} className="rounded-lg px-4 py-2">View details</Button>
          <Button as={Link} to={`/login?next=${encodeURIComponent(`/marketplace/${listing.slug}`)}`} variant="secondary" className="rounded-lg px-3 py-2" title="Login to unlock contact">
            <LockKeyhole className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </article>
  );
}

function ProductSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="h-52 animate-pulse bg-slate-200" />
      <div className="grid gap-3 p-4">
        <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
        <div className="h-5 w-3/4 animate-pulse rounded bg-slate-200" />
        <div className="h-16 animate-pulse rounded bg-slate-100" />
        <div className="h-10 animate-pulse rounded bg-slate-200" />
      </div>
    </div>
  );
}
