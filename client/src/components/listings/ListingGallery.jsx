import { useState } from 'react';
import { PLACEHOLDER_IMAGE } from '../../utils/constants.js';

export default function ListingGallery({ images = [] }) {
  const allImages = images.length ? images : [PLACEHOLDER_IMAGE];
  const [active, setActive] = useState(allImages[0]);
  return (
    <div className="grid gap-3">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
        <img src={active} alt="Listing" className="h-[420px] w-full object-cover" />
      </div>
      <div className="grid grid-cols-4 gap-3">
        {allImages.slice(0, 8).map((image) => (
          <button key={image} onClick={() => setActive(image)} className="overflow-hidden rounded-2xl border border-slate-200">
            <img src={image} alt="" className="h-20 w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
