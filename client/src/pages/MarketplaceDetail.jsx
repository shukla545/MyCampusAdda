import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { BookOpen, LockKeyhole, MessageCircle, ShieldAlert, ShieldCheck, UserRound } from 'lucide-react';
import Button from '../components/common/Button.jsx';
import Container from '../components/common/Container.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import Seo from '../components/common/Seo.jsx';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import { buildWhatsAppUrl } from '../utils/whatsapp.js';

const fallbackImage = 'https://res.cloudinary.com/dugeiu4id/image/upload/v1778184435/ChatGPT_Image_May_8_2026_01_35_21_AM_ozmdeg.png';

export default function MarketplaceDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const [contact, setContact] = useState(null);
  const [loadingContact, setLoadingContact] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get(`/marketplace/${slug}`)
      .then(({ data }) => {
        setListing(data.listing);
        setSelectedImage(data.listing?.images?.[0] || fallbackImage);
      })
      .catch(() => setListing(null))
      .finally(() => setLoading(false));
  }, [slug]);

  const unlockContact = async () => {
    if (!user) return;
    setLoadingContact(true);
    try {
      const { data } = await api.get(`/marketplace/${slug}/contact`);
      setContact(data.contact);
      toast.success('Seller contact unlocked');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not unlock contact');
    } finally {
      setLoadingContact(false);
    }
  };

  if (loading) {
    return <Container className="grid min-h-[60vh] place-items-center py-16"><LoadingSpinner /></Container>;
  }

  if (!listing) {
    return (
      <Container className="grid min-h-[60vh] place-items-center py-16 text-center">
        <div>
          <BookOpen className="mx-auto h-10 w-10 text-slate-400" />
          <h1 className="mt-4 text-2xl font-extrabold text-slate-950">Product not found</h1>
          <Button as={Link} to="/marketplace" className="mt-5">Back to marketplace</Button>
        </div>
      </Container>
    );
  }

  const whatsappUrl = buildWhatsAppUrl(contact?.primaryPhone, `Hi, I saw your "${listing.title}" on CampusNest Marketplace. Is it still available?`);

  return (
    <main className="bg-white py-10">
      <Seo
        title={`${listing.title} - TCET Marketplace`}
        description={listing.description}
        image={listing.images?.[0]}
      />
      <Container>
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
              <img src={selectedImage || fallbackImage} alt={listing.title} className="h-[360px] w-full object-cover sm:h-[520px]" />
            </div>
            {listing.images?.length > 1 && (
              <div className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-6">
                {listing.images.map((image) => (
                  <button
                    key={image}
                    type="button"
                    onClick={() => setSelectedImage(image)}
                    className={`overflow-hidden rounded-lg border ${selectedImage === image ? 'border-brand ring-2 ring-brand/20' : 'border-slate-200'}`}
                  >
                    <img src={image} alt="" className="h-20 w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-extrabold text-brand">{listing.categoryLabel}</span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold capitalize text-slate-600">{listing.condition?.replace('-', ' ')}</span>
            </div>
            <h1 className="mt-4 text-3xl font-black leading-tight text-slate-950 sm:text-4xl">{listing.title}</h1>
            <p className="mt-4 text-3xl font-black text-brand">{listing.priceText || `Rs. ${listing.price}`}</p>
            <p className="mt-6 whitespace-pre-line text-base leading-8 text-slate-600">{listing.description}</p>

            <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
              <div className="flex gap-3">
                <ShieldAlert className="mt-1 h-5 w-5 shrink-0 text-amber-700" />
                <div>
                  <h2 className="font-extrabold text-amber-950">Safety disclaimer</h2>
                  <p className="mt-1 text-sm leading-6 text-amber-800">Pay only after you receive and inspect the product. Do not pay in advance.</p>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand">
                  <UserRound className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-950">Seller contact</h2>
                  <p className="mt-1 text-sm leading-6 text-slate-500">Seller number and student details are visible only after login.</p>
                </div>
              </div>

              {!user ? (
                <Button as={Link} to={`/login?next=${encodeURIComponent(`/marketplace/${slug}`)}`} className="mt-5 w-full rounded-lg">
                  <LockKeyhole className="h-4 w-4" />Login to view contact
                </Button>
              ) : contact ? (
                <div className="mt-5 grid gap-3">
                  <ContactLine label="Seller" value={contact.sellerName} />
                  <ContactLine label="Branch" value={contact.branch} />
                  <ContactLine label="Number" value={`+${contact.primaryPhone}`} />
                  {contact.extraPhone && <ContactLine label="Optional number" value={`+${contact.extraPhone}`} />}
                  {contact.studentDetails && <ContactLine label="Student detail" value={contact.studentDetails} />}
                  <div className="grid gap-2 sm:grid-cols-2">
                    {whatsappUrl && (
                      <Button as="a" href={whatsappUrl} target="_blank" rel="noreferrer" className="rounded-lg">
                        <MessageCircle className="h-4 w-4" />WhatsApp seller
                      </Button>
                    )}
                    <Button as={Link} to="/contact" variant="secondary" className="rounded-lg">
                      <ShieldCheck className="h-4 w-4" />Contact admin
                    </Button>
                  </div>
                </div>
              ) : (
                <Button type="button" onClick={unlockContact} disabled={loadingContact} className="mt-5 w-full rounded-lg">
                  <LockKeyhole className="h-4 w-4" />{loadingContact ? 'Unlocking...' : 'Unlock seller contact'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}

function ContactLine({ label, value }) {
  return (
    <div className="rounded-lg bg-slate-50 px-4 py-3">
      <p className="text-xs font-bold uppercase text-slate-400">{label}</p>
      <p className="mt-1 break-words text-sm font-extrabold text-slate-900">{value || 'Not added'}</p>
    </div>
  );
}
