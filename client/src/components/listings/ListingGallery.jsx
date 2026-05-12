import { useState } from 'react';
import { PLACEHOLDER_IMAGE } from '../../utils/constants.js';

export default function ListingGallery({ images = [] }) {
  const allImages = images.length ? images : [PLACEHOLDER_IMAGE];
  const [active, setActive] = useState(allImages[0]);
  return (
    <div className="grid gap-3">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
        <img src={active} alt="CampusNest listing photo" decoding="async" width="960" height="640" className="h-[320px] w-full object-cover sm:h-[420px]" />
      </div>
      <div className="grid grid-cols-4 gap-3">
        {allImages.slice(0, 8).map((image, index) => (
          <button key={image} onClick={() => setActive(image)} className="overflow-hidden rounded-2xl border border-slate-200">
            <img src={image} alt={`Listing thumbnail ${index + 1}`} loading="lazy" decoding="async" width="160" height="80" className="h-20 w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
