import { Link } from 'react-router-dom';
import { ArrowLeft, Home, SearchX } from 'lucide-react';
import Container from '../components/common/Container.jsx';
import Button from '../components/common/Button.jsx';
import Seo from '../components/common/Seo.jsx';

export default function NotFound() {
  return (
    <main className="bg-white">
      <Seo title="404 - Page not found" description="This CampusNest page could not be found." />
      <Container className="grid min-h-[70vh] place-items-center py-16 text-center">
        <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 shadow-soft sm:p-10">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-brand-soft text-brand">
            <SearchX className="h-8 w-8" />
          </div>
          <p className="mt-6 text-sm font-black uppercase tracking-wide text-brand">404 error</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950 sm:text-5xl">Page not found</h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-slate-600 sm:text-base">
            The page may have moved, or the listing link may be incorrect. You can return home or explore the current Thakur College listings.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Button as={Link} to="/"><Home className="h-4 w-4" />Go home</Button>
            <Button as={Link} to="/college/thakur-college" variant="secondary"><ArrowLeft className="h-4 w-4" />Explore listings</Button>
          </div>
        </div>
      </Container>
    </main>
  );
}
