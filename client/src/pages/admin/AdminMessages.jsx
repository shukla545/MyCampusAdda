import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import Button from '../../components/common/Button.jsx';
import api from '../../api/axios.js';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const load = () => api.get('/contact/admin/messages').then(({ data }) => setMessages(data)).catch(() => setMessages([]));

  useEffect(() => { load(); }, []);

  const markRead = async (id) => {
    try {
      await api.patch(`/contact/admin/messages/${id}/read`);
      toast.success('Message marked read');
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not update message');
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr><th className="px-4 py-3">User</th><th>Subject</th><th>Message</th><th>Status</th><th>Date</th><th>Action</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {messages.map((item) => (
              <tr key={item._id} className="text-slate-700">
                <td className="px-4 py-4"><p className="font-bold text-slate-950">{item.name || 'User'}</p><p className="text-xs text-slate-500">{item.email || (item.phone ? `+${item.phone}` : '-')}</p></td>
                <td>{item.subject || '-'}</td>
                <td className="max-w-md whitespace-pre-wrap py-4">{item.message}</td>
                <td><span className={`rounded-full px-3 py-1 text-xs font-bold ${item.status === 'new' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>{item.status}</span></td>
                <td>{item.createdAt ? format(new Date(item.createdAt), 'dd MMM yyyy, h:mm a') : '-'}</td>
                <td>{item.status === 'new' && <Button type="button" variant="secondary" className="px-3 py-2" onClick={() => markRead(item._id)}>Mark read</Button>}</td>
              </tr>
            ))}
            {!messages.length && <tr><td colSpan="6" className="px-4 py-8 text-center font-semibold text-slate-500">No contact messages yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
