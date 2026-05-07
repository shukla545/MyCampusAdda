import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/common/Navbar.jsx';
import Footer from './components/common/Footer.jsx';
import PageBackBar from './components/common/PageBackBar.jsx';
import AdminLayout from './components/admin/AdminLayout.jsx';
import CampusChatBot from './components/chatbot/CampusChatBot.jsx';
import RequireUser from './components/auth/RequireUser.jsx';
import Home from './pages/Home.jsx';
import CollegePage from './pages/CollegePage.jsx';
import PGPage from './pages/PGPage.jsx';
import MessPage from './pages/MessPage.jsx';
import ListingDetail from './pages/ListingDetail.jsx';
import BusinessRegister from './pages/BusinessRegister.jsx';
import Contact from './pages/Contact.jsx';
import AuthPage from './pages/AuthPage.jsx';
import About from './pages/About.jsx';
import PrivacyPolicy from './pages/PrivacyPolicy.jsx';
import NotFound from './pages/NotFound.jsx';
import AdminLogin from './pages/admin/AdminLogin.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminListings from './pages/admin/AdminListings.jsx';
import AdminAddListing from './pages/admin/AdminAddListing.jsx';
import AdminEditListing from './pages/admin/AdminEditListing.jsx';
import AdminSubmissions from './pages/admin/AdminSubmissions.jsx';
import AdminMessages from './pages/admin/AdminMessages.jsx';

export default function App() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');
  return (
    <>
      {!isAdmin && <Navbar />}
      {!isAdmin && <PageBackBar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/college/thakur-college" element={<CollegePage />} />
        <Route path="/college/thakur-college/pg" element={<PGPage />} />
        <Route path="/college/thakur-college/mess" element={<MessPage />} />
        <Route path="/listing/:slug" element={<ListingDetail />} />
        <Route path="/business/register" element={<RequireUser><BusinessRegister /></RequireUser>} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/signup" element={<AuthPage />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout title="Dashboard" />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="listings" element={<AdminListings />} />
          <Route path="add-listing" element={<AdminAddListing />} />
          <Route path="edit-listing/:id" element={<AdminEditListing />} />
          <Route path="submissions" element={<AdminSubmissions />} />
          <Route path="messages" element={<AdminMessages />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isAdmin && <CampusChatBot />}
      {!isAdmin && <Footer />}
    </>
  );
}
