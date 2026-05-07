import { Navigate, useLocation } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import Container from '../common/Container.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export default function RequireUser({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Container className="grid min-h-[60vh] place-items-center py-16">
        <div className="text-center">
          <ShieldCheck className="mx-auto h-10 w-10 text-brand" />
          <p className="mt-3 font-semibold text-slate-600">Checking your session...</p>
        </div>
      </Container>
    );
  }

  if (!user) {
    return <Navigate to={`/login?next=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return children;
}
