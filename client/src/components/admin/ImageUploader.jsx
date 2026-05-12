import { ImagePlus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios.js';

export default function ImageUploader({ images = [], onChange, owner = false }) {
  const upload = async (files) => {
    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append('images', file));
    const toastId = toast.loading('Uploading images...');
    try {
      const { data } = await api.post(`/upload/${owner ? 'owner' : 'admin'}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      onChange([...(images || []), ...data.urls]);
      toast.success('Images uploaded', { id: toastId });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed', { id: toastId });
    }
  };
  return (
    <div>
      <label className="label">Images</label>
      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm font-bold text-slate-600 hover:bg-slate-100">
        <ImagePlus className="h-5 w-5" /> Upload images
        <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => upload(e.target.files)} />
      </label>
      <div className="mt-4 grid grid-cols-3 gap-3">
        {images.map((image, index) => (
          <div key={image} className="relative overflow-hidden rounded-xl border border-slate-200">
            <img src={image} alt={`Uploaded preview ${index + 1}`} width="160" height="96" className="h-24 w-full object-cover" />
            <button type="button" onClick={() => onChange(images.filter((item) => item !== image))} className="absolute right-2 top-2 rounded-full bg-white p-1 shadow"><X className="h-4 w-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
