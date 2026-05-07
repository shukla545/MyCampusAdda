import { Link } from 'react-router-dom';
import Button from '../common/Button.jsx';

export default function BusinessCTA() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-5xl rounded-2xl bg-slate-950 px-6 py-12 text-center shadow-soft">
        <h2 className="text-3xl font-extrabold text-white">Own a PG or Mess near Thakur College?</h2>
        <p className="mx-auto mt-3 max-w-2xl text-slate-300">List your business. Our team reviews every submission before it goes live.</p>
        <Button as={Link} to="/business/register" className="mt-7 bg-white text-slate-950 hover:bg-slate-100">List your business</Button>
      </div>
    </section>
  );
}
