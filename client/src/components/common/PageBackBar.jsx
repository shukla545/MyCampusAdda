import { useLocation } from 'react-router-dom';
import Container from './Container.jsx';
import BackButton from './BackButton.jsx';

export default function PageBackBar() {
  const { pathname } = useLocation();
  if (pathname === '/' || pathname.startsWith('/admin')) return null;

  return (
    <div className="border-b border-slate-100 bg-white">
      <Container className="py-3">
        <BackButton />
      </Container>
    </div>
  );
}
