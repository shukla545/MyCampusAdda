import Container from '../components/common/Container.jsx';
import Seo from '../components/common/Seo.jsx';

export default function PrivacyPolicy() {
  const sections = [
    {
      heading: 'Information we collect',
      body: 'CampusNest may collect account details such as name and email, listing submission details such as owner name, business name, phone, area, price, facilities and photos, and contact form messages submitted by users.'
    },
    {
      heading: 'How we use information',
      body: 'We use this information to verify accounts, review listings, display approved PG/Mess information, respond to support messages, prevent misuse and improve student shortlisting features.'
    },
    {
      heading: 'Payments',
      body: 'Payments are processed by Razorpay. CampusNest does not store card numbers, UPI PINs, netbanking passwords or sensitive payment credentials. We store payment references and status only to add Campus AI credits and support refund checks.'
    },
    {
      heading: 'Sharing and contact links',
      body: 'Approved listing contact details may be visible to visitors so they can contact the PG, hostel, mess or tiffin provider. WhatsApp and mail links open external services controlled by their respective providers.'
    },
    {
      heading: 'Data safety',
      body: 'Admins should avoid storing unnecessary sensitive personal information. If you want a correction or removal request, contact us from the Contact page using the email linked to your account or listing.'
    }
  ];

  return (
    <Container className="py-14 md:py-16">
      <Seo title="Privacy Policy" description="CampusNest privacy policy for student visitors, payments and PG/Mess business submissions." />
      <div className="max-w-4xl">
        <p className="text-sm font-bold uppercase tracking-wide text-brand">CampusNest policy</p>
        <h1 className="mt-3 text-3xl font-extrabold text-slate-950 md:text-4xl">Privacy Policy</h1>
        <p className="mt-3 text-sm font-semibold text-slate-500">Last updated: May 8, 2026</p>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-700">
          This policy explains how CampusNest handles student accounts, listing submissions, contact messages and payment-related records.
        </p>
        <div className="mt-10 grid gap-6">
          {sections.map((section) => (
            <section key={section.heading} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-extrabold text-slate-950">{section.heading}</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">{section.body}</p>
            </section>
          ))}
        </div>
      </div>
    </Container>
  );
}
