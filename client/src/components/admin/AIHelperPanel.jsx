import { Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../common/Button.jsx';
import api from '../../api/axios.js';

export default function AIHelperPanel({ values, onDescription, onFaqs }) {
  const call = async (endpoint) => {
    const toastId = toast.loading('Asking AI helper...');
    try {
      const { data } = await api.post(`/ai/${endpoint}`, values);
      toast.success('AI helper finished', { id: toastId });
      return data.text || data.message;
    } catch (error) {
      toast.error(error.response?.data?.message || 'AI request failed', { id: toastId });
      return '';
    }
  };
  return (
    <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-5">
      <div className="flex items-center gap-2 text-indigo-700">
        <Sparkles className="h-5 w-5" /><h3 className="font-extrabold">Admin AI helper</h3>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button type="button" onClick={async () => onDescription(await call('generate-description'))}>Generate Description</Button>
        <Button type="button" variant="secondary" onClick={async () => onFaqs(await call('generate-faqs'))}>Generate FAQs</Button>
        <Button type="button" variant="subtle" onClick={async () => toast(await call('suggest-improvements'), { duration: 8000 })}>Suggest Improvements</Button>
      </div>
    </div>
  );
}
