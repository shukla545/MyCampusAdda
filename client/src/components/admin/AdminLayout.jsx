import { Navigate, Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from './AdminSidebar.jsx';
import AdminTopbar from './AdminTopbar.jsx';

export default function AdminLayout({ title = 'Dashboard' }) {
  const { pathname } = useLocation();
  const token = localStorage.getItem('campusnest_admin_token') || localStorage.getItem('mca_admin_token');
  if (!token) return <Navigate to="/admin/login" replace />;
  const pageTitle = pathname.includes('/add-listing')
    ? 'Add listing'
    : pathname.includes('/edit-listing')
      ? 'Edit listing'
      : pathname.includes('/listings')
        ? 'Listings'
        : pathname.includes('/marketplace')
          ? 'Marketplace'
          : pathname.includes('/submissions')
            ? 'Submissions'
            : pathname.includes('/messages')
              ? 'Messages'
              : title;
  return (
    <div className="admin-shell bg-slate-50">
      <AdminSidebar />
      <main className="lg:pl-72">
        <AdminTopbar title={pageTitle} />
        <div className="p-4 pb-24 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
