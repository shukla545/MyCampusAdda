import { Link } from 'react-router-dom';
import Container from './Container.jsx';

export default function Footer() {
  const adminPath = localStorage.getItem('mca_admin_token') ? '/admin/dashboard' : '/admin/login';
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <Container className="grid gap-8 py-10 md:grid-cols-3">
        <div>
          <div className="text-lg font-extrabold text-slate-950">MyCampusAdda</div>
          <p className="mt-2 text-sm text-slate-500">Find PGs and Mess near your college.</p>
        </div>
        <div className="grid gap-2 text-sm text-slate-600">
          <Link to="/college/thakur-college/pg">PG/Hostel listings</Link>
          <Link to="/college/thakur-college/mess">Mess/Tiffin listings</Link>
          <Link to="/business/register">List your business</Link>
        </div>
        <div className="grid gap-2 text-sm text-slate-600">
          <Link to="/contact">Contact</Link>
          <Link to="/privacy">Privacy policy</Link>
          <Link to={adminPath}>Admin</Link>
          <span>Launch MVP for Thakur College, Kandivali.</span>
        </div>
      </Container>
    </footer>
  );
}
