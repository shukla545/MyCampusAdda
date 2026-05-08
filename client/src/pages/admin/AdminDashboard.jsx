import { useEffect, useState } from 'react';
import { BadgeCheck, Building2, CheckCircle2, Clock, ListChecks, ShoppingBag, Star, Utensils, UsersRound } from 'lucide-react';
import StatCard from '../../components/common/StatCard.jsx';
import api from '../../api/axios.js';

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  useEffect(() => {
    api.get('/admin/dashboard').then(({ data }) => setStats(data)).catch(() => setStats({}));
  }, []);
  const cards = [
    ['Total listings', stats.totalListings || 0, ListChecks],
    ['Total PGs', stats.totalPGs || 0, Building2],
    ['Total Mess', stats.totalMess || 0, Utensils],
    ['Marketplace', stats.totalMarketplaceProducts || 0, ShoppingBag],
    ['Pending products', stats.pendingMarketplaceProducts || 0, Clock],
    ['Pending', stats.pendingListings || 0, Clock],
    ['Approved', stats.approvedListings || 0, CheckCircle2],
    ['Featured', stats.featuredListings || 0, Star],
    ['Verified', stats.verifiedListings || 0, BadgeCheck],
    ['New submissions', stats.newSubmissions || 0, UsersRound]
  ];
  return (
    <div className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(([label, value, icon]) => <StatCard key={label} label={label} value={value} icon={icon} />)}</div>
      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Recent listings" items={stats.recentListings} field="title" />
        <Panel title="Recent marketplace products" items={stats.recentMarketplaceProducts} field="title" />
        <Panel title="Recent submissions" items={stats.recentSubmissions} field="businessName" />
      </div>
    </div>
  );
}

function Panel({ title, items = [], field }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="text-lg font-extrabold text-slate-950">{title}</h2><div className="mt-4 grid gap-3">{items.length ? items.map((item) => <div key={item._id} className="rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-700">{item[field]}</div>) : <p className="text-sm text-slate-500">Nothing yet.</p>}</div></div>;
}
