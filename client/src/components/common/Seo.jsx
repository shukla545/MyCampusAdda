import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const siteUrl = 'https://campusnest.online';
const defaultDescription = 'CampusNest helps TCET students buy and sell used study material, notes, books and projects, while also finding nearby PG, hostel and mess support.';
const defaultImage = 'https://res.cloudinary.com/dugeiu4id/image/upload/f_auto,q_auto,w_1200,c_fill,ar_16:9/v1778184435/ChatGPT_Image_May_8_2026_01_35_21_AM_ozmdeg.png';

const upsertMeta = (selector, attributes) => {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
};

const upsertCanonical = (href) => {
  let element = document.head.querySelector('link[rel="canonical"]');
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', 'canonical');
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
};

const upsertJsonLd = (data) => {
  let element = document.head.querySelector('script[data-campusnest-schema="true"]');
  if (!element) {
    element = document.createElement('script');
    element.type = 'application/ld+json';
    element.setAttribute('data-campusnest-schema', 'true');
    document.head.appendChild(element);
  }
  element.textContent = JSON.stringify(data);
};

const buildSchema = ({ pageTitle, description, url, image }) => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: 'CampusNest',
      url: siteUrl,
      logo: `${siteUrl}/campusnest-logo.png`,
      sameAs: ['https://nikhil-ai-portfolio.vercel.app']
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      name: 'CampusNest',
      url: siteUrl,
      description,
      publisher: { '@id': `${siteUrl}/#organization` },
      potentialAction: {
        '@type': 'SearchAction',
        target: `${siteUrl}/marketplace?search={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    },
    {
      '@type': 'WebPage',
      '@id': `${url}#webpage`,
      url,
      name: pageTitle,
      description,
      image,
      isPartOf: { '@id': `${siteUrl}/#website` },
      about: { '@id': `${siteUrl}/#organization` }
    }
  ]
});

export default function Seo({ title = 'CampusNest', description = defaultDescription, image = defaultImage }) {
  const { pathname } = useLocation();

  useEffect(() => {
    const pageTitle = title.includes('CampusNest') ? title : `${title} | CampusNest`;
    const url = `${siteUrl}${pathname}`;
    const finalImage = image || defaultImage;

    document.title = pageTitle;
    upsertCanonical(url);
    upsertMeta('meta[name="description"]', { name: 'description', content: description });
    upsertMeta('meta[name="robots"]', { name: 'robots', content: 'index,follow' });
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: pageTitle });
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description });
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' });
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: url });
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: finalImage });
    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: pageTitle });
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description });
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: finalImage });
    upsertJsonLd(buildSchema({ pageTitle, description, url, image: finalImage }));
  }, [description, image, pathname, title]);

  return null;
}
