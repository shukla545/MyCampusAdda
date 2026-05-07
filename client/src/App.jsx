import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/common/Navbar.jsx';
import Footer from './components/common/Footer.jsx';
import PageBackBar from './components/common/PageBackBar.jsx';
import PageLoader from './components/common/PageLoader.jsx';
import AdminLayout from './components/admin/AdminLayout.jsx';
import CampusChatBot from './components/chatbot/CampusChatBot.jsx';
import RequireUser from './components/auth/RequireUser.jsx';

const Home = lazy(() => import('./pages/Home.jsx'));
const CollegePage = lazy(() => import('./pages/CollegePage.jsx'));
const PGPage = lazy(() => import('./pages/PGPage.jsx'));
const MessPage = lazy(() => import('./pages/MessPage.jsx'));
const ListingDetail = lazy(() => import('./pages/ListingDetail.jsx'));
const BusinessRegister = lazy(() => import('./pages/BusinessRegister.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));
const AuthPage = lazy(() => import('./pages/AuthPage.jsx'));
const About = lazy(() => import('./pages/About.jsx'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin.jsx'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard.jsx'));
const AdminListings = lazy(() => import('./pages/admin/AdminListings.jsx'));
const AdminAddListing = lazy(() => import('./pages/admin/AdminAddListing.jsx'));
const AdminEditListing = lazy(() => import('./pages/admin/AdminEditListing.jsx'));
const AdminSubmissions = lazy(() => import('./pages/admin/AdminSubmissions.jsx'));
const AdminMessages = lazy(() => import('./pages/admin/AdminMessages.jsx'));

export default function App() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');
  return (
    <>
      {!isAdmin && <Navbar />}
      {!isAdmin && <PageBackBar />}
      <Suspense fallback={<PageLoader />}>
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
      </Suspense>
      {!isAdmin && <CampusChatBot />}
      {!isAdmin && <Footer />}
    </>
  );
}
