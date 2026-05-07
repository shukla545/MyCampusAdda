import { Link } from 'react-router-dom';
import Container from '../components/common/Container.jsx';
import Button from '../components/common/Button.jsx';

export default function NotFound() {
  return <Container className="grid min-h-[60vh] place-items-center py-16 text-center"><div><h1 className="text-5xl font-extrabold text-slate-950">Page not found</h1><p className="mt-3 text-slate-500">This page is not part of the MVP yet.</p><Button as={Link} to="/" className="mt-6">Go home</Button></div></Container>;
}
