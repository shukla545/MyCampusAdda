import { Link } from 'react-router-dom';
import Container from '../components/common/Container.jsx';
import Seo from '../components/common/Seo.jsx';

const updatedAt = 'May 9, 2026';

const pages = {
  pricing: {
    title: 'Pricing',
    description: 'CampusNest pricing details for marketplace Sell Passes and Campus AI chat credit packs.',
    intro: 'CampusNest is free to browse. TCET students can list 2 marketplace products free, then buy optional Sell Passes for more products.',
    sections: [
      {
        heading: 'Marketplace Sell Passes',
        body: [
          'First 2 study material product listings are free for every logged-in student account.',
          'Single Product Pass: Rs. 12 for 1 more product listing.',
          'Triple Product Pass: Rs. 35 for 3 more product listings.',
          'Five Product Pass: Rs. 50 for 5 more product listings.'
        ]
      },
      {
        heading: 'Campus AI credit packs',
        body: [
          'Starter: Rs. 19 for 10 AI messages.',
          'Value: Rs. 49 for 35 AI messages.',
          'Power: Rs. 99 for 100 AI messages.'
        ]
      },
      {
        heading: 'What you get',
        body: [
          'Credits are used to ask Campus AI for marketplace guidance, PG, hostel, mess and tiffin shortlisting help near Thakur College.',
          'Marketplace products can still be browsed without buying anything. Seller contact details require login.'
        ]
      },
      {
        heading: 'Taxes and payment provider charges',
        body: [
          'Prices are shown in Indian Rupees. Razorpay may show the final payable amount and available payment methods during checkout.',
          'If taxes or payment rules change, the amount shown on the checkout screen will be treated as the final amount before payment.'
        ]
      }
    ]
  },
  terms: {
    title: 'Terms of Use',
    description: 'CampusNest terms of use for students, visitors and listing owners.',
    intro: 'By using CampusNest, you agree to use the platform responsibly and to verify listing information before making a decision.',
    sections: [
      {
        heading: 'Platform scope',
        body: [
          'CampusNest helps students discover TCET study material marketplace products plus PG, hostel, mess and tiffin options near Thakur College, Kandivali.',
          'We review submissions before publishing, but product condition, availability, rent, food menu, facilities and owner promises must be confirmed directly with the listed contact.'
        ]
      },
      {
        heading: 'Marketplace safety',
        body: [
          'Buyers should inspect the product in person and pay only after receiving the product.',
          'Do not make advance payments to sellers. Report suspicious products or sellers from the Contact page.'
        ]
      },
      {
        heading: 'User accounts and Campus AI',
        body: [
          'You must use accurate account information and keep your login details safe.',
          'Campus AI provides shortlisting assistance based on available listing data. It does not guarantee availability, pricing, admission, tenancy or service quality.'
        ]
      },
      {
        heading: 'Business submissions',
        body: [
          'Owners and representatives must submit accurate business, location, pricing and contact information.',
          'CampusNest may reject, edit, unpublish or remove listings that are inaccurate, unsafe, duplicate or not relevant to students.'
        ]
      },
      {
        heading: 'Payments',
        body: [
          'Paid Campus AI credits and marketplace Sell Passes are processed through Razorpay. A successful payment adds the selected pack to the logged-in user account.',
          'Do not share payment credentials, OTPs or card details with anyone claiming to represent CampusNest.'
        ]
      }
    ]
  },
  refund: {
    title: 'Cancellation and Refund Policy',
    description: 'CampusNest cancellation and refund policy for Campus AI credit and marketplace Sell Pass purchases.',
    intro: 'Campus AI credits and marketplace Sell Passes are digital account balances delivered after successful payment.',
    sections: [
      {
        heading: 'Digital delivery',
        body: [
          'Once a payment is successful, AI credits or Sell Passes are normally added instantly to the logged-in account.',
          'If a payment succeeds but the pack is not visible, contact us from the Contact page with your registered email and payment reference.'
        ]
      },
      {
        heading: 'Refund eligibility',
        body: [
          'Refunds may be reviewed for duplicate charges, failed credit delivery, or accidental payment where credits have not been consumed.',
          'Credits already consumed for Campus AI messages or Sell Passes already used for product submissions are generally not refundable.'
        ]
      },
      {
        heading: 'Refund timeline',
        body: [
          'Approved refunds are initiated through Razorpay to the original payment method.',
          'Bank and payment provider timelines may vary, but most refunds reflect within 5 to 7 working days after initiation.'
        ]
      }
    ]
  },
  delivery: {
    title: 'Shipping and Delivery Policy',
    description: 'CampusNest delivery policy for digital Campus AI credit packs and marketplace Sell Passes.',
    intro: 'CampusNest does not ship physical products. Paid packs are digital balances added to the logged-in account.',
    sections: [
      {
        heading: 'No physical shipping',
        body: [
          'There is no courier, parcel or physical delivery from CampusNest for Campus AI credit or Sell Pass purchases.',
          'Marketplace products are exchanged directly between buyer and seller. CampusNest does not collect product payment or arrange delivery.'
        ]
      },
      {
        heading: 'Digital delivery',
        body: [
          'Credits and Sell Passes are delivered to the logged-in CampusNest account after payment verification.',
          'If automatic delivery is delayed, our team can verify the payment and update the account manually after receiving the registered email and payment reference.'
        ]
      }
    ]
  },
  cookies: {
    title: 'Cookie Policy',
    description: 'CampusNest cookie policy and local storage usage.',
    intro: 'CampusNest uses only the storage needed to keep the website working, secure and easy to use.',
    sections: [
      {
        heading: 'Essential cookies and storage',
        body: [
          'We use secure cookies for student login sessions and local storage for admin login state.',
          'These are needed for authentication, account access and protected website features.'
        ]
      },
      {
        heading: 'Third-party checkout',
        body: [
          'When you open Razorpay Checkout, Razorpay may use its own cookies or security checks to process the payment.',
          'Those cookies are controlled by Razorpay and are used only when the checkout flow is loaded.'
        ]
      },
      {
        heading: 'Choices',
        body: [
          'You can clear browser cookies or site data from your browser settings. Clearing essential cookies may log you out.',
          'CampusNest does not currently use advertising cookies or third-party ad tracking.'
        ]
      }
    ]
  }
};

export default function LegalPage({ page }) {
  const content = pages[page] || pages.terms;
  return (
    <Container className="py-14 md:py-16">
      <Seo title={content.title} description={content.description} />
      <div className="max-w-4xl">
        <p className="text-sm font-bold uppercase tracking-wide text-brand">CampusNest policy</p>
        <h1 className="mt-3 text-3xl font-extrabold text-slate-950 md:text-4xl">{content.title}</h1>
        <p className="mt-3 text-sm font-semibold text-slate-500">Last updated: {updatedAt}</p>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-700">{content.intro}</p>
        <div className="mt-10 grid gap-6">
          {content.sections.map((section) => (
            <section key={section.heading} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-extrabold text-slate-950">{section.heading}</h2>
              <div className="mt-4 grid gap-3 text-sm leading-7 text-slate-600">
                {section.body.map((item) => <p key={item}>{item}</p>)}
              </div>
            </section>
          ))}
        </div>
        <div className="mt-10 rounded-2xl bg-brand-soft p-5 text-sm leading-7 text-brand">
          Need support with a payment, listing or account? Use the <Link to="/contact" className="font-extrabold underline">Contact page</Link> and include your registered email.
        </div>
      </div>
    </Container>
  );
}
