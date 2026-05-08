import { NavLink } from 'react-router-dom';
import { Home, Inbox, ListChecks, LogOut, PlusCircle, ShoppingBag, UserRoundCheck } from 'lucide-react';

const links = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: Home },
  { to: '/admin/marketplace', label: 'Marketplace', icon: ShoppingBag },
  { to: '/admin/listings', label: 'Listings', icon: ListChecks },
  { to: '/admin/add-listing', label: 'Add listing', icon: PlusCircle },
  { to: '/admin/submissions', label: 'Submissions', icon: UserRoundCheck },
  { to: '/admin/messages', label: 'Messages', icon: Inbox }
];

const mobileLinks = links.filter((link) => link.to !== '/admin/add-listing');

export default function AdminSidebar() {
  const logout = () => {
    localStorage.removeItem('campusnest_admin_token');
    localStorage.removeItem('mca_admin_token');
    window.location.href = '/admin/login';
  };
  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-slate-200 bg-white p-5 lg:block">
        <div className="text-xl font-extrabold text-slate-950">CampusNest</div>
        <p className="mt-1 text-sm text-slate-500">Admin panel</p>
        <nav className="mt-8 grid gap-2">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}>
              <Icon className="h-5 w-5" />{label}
            </NavLink>
          ))}
        </nav>
        <button onClick={logout} className="absolute bottom-5 left-5 right-5 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50">
          <LogOut className="h-5 w-5" />Logout
        </button>
      </aside>

      <nav className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-6 rounded-xl border border-slate-200 bg-white p-2 shadow-soft lg:hidden">
        {mobileLinks.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `grid place-items-center gap-1 rounded-lg px-1 py-2 text-[11px] font-bold transition ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500'}`}>
            <Icon className="h-5 w-5" /><span className="truncate">{label.replace(' listing', '')}</span>
          </NavLink>
        ))}
        <button onClick={logout} className="grid place-items-center gap-1 rounded-lg px-1 py-2 text-[11px] font-bold text-slate-500">
          <LogOut className="h-5 w-5" /><span>Logout</span>
        </button>
      </nav>
    </>
  );
}
