import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const defaultDescription = 'Find student-friendly PGs, hostels, mess and tiffin services near Thakur College, Kandivali with CampusNest.';
const defaultImage = 'https://res.cloudinary.com/dugeiu4id/image/upload/v1778184435/ChatGPT_Image_May_8_2026_01_35_21_AM_ozmdeg.png';

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

export default function Seo({ title = 'CampusNest', description = defaultDescription, image = defaultImage }) {
  const { pathname } = useLocation();

  useEffect(() => {
    const pageTitle = title.includes('CampusNest') ? title : `${title} | CampusNest`;
    const url = `${window.location.origin}${pathname}`;
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
  }, [description, image, pathname, title]);

  return null;
}
