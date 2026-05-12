import { Fragment, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { Mail, Send, X } from 'lucide-react';
import Button from '../../components/common/Button.jsx';
import api from '../../api/axios.js';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [replyingId, setReplyingId] = useState('');
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
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

  const startReply = (item) => {
    setReplyingId(item._id);
    setReplyText(`Dear ${item.name || 'student'},\n\nThank you for contacting CampusNest.\n\n`);
  };

  const sendReply = async (id) => {
    if (!replyText.trim()) {
      toast.error('Write a reply first');
      return;
    }
    setSendingReply(true);
    try {
      const { data } = await api.post(`/contact/admin/messages/${id}/reply`, { reply: replyText });
      toast.success(data.message || 'Reply sent');
      setReplyingId('');
      setReplyText('');
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not send reply');
    } finally {
      setSendingReply(false);
    }
  };

  const statusClass = (status) => {
    if (status === 'new') return 'bg-amber-50 text-amber-700';
    if (status === 'replied') return 'bg-emerald-50 text-emerald-700';
    return 'bg-slate-100 text-slate-600';
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
              <Fragment key={item._id}>
                <tr className="text-slate-700">
                  <td className="px-4 py-4"><p className="font-bold text-slate-950">{item.name || 'User'}</p><p className="text-xs text-slate-500">{item.email || (item.phone ? `+${item.phone}` : '-')}</p></td>
                  <td>{item.subject || '-'}</td>
                  <td className="max-w-md whitespace-pre-wrap py-4">{item.message}</td>
                  <td><span className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass(item.status)}`}>{item.status}</span></td>
                  <td>{item.createdAt ? format(new Date(item.createdAt), 'dd MMM yyyy, h:mm a') : '-'}</td>
                  <td>
                    <div className="flex flex-wrap gap-2">
                      {item.status === 'new' && <Button type="button" variant="secondary" className="px-3 py-2" onClick={() => markRead(item._id)}>Mark read</Button>}
                      <Button type="button" className="px-3 py-2" onClick={() => startReply(item)}><Mail className="h-4 w-4" />Reply</Button>
                    </div>
                  </td>
                </tr>
                {replyingId === item._id && (
                  <tr className="bg-slate-50">
                    <td colSpan="6" className="px-4 py-4">
                      <div className="rounded-xl border border-slate-200 bg-white p-4">
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <p className="font-extrabold text-slate-950">Reply to {item.email}</p>
                          <button type="button" onClick={() => setReplyingId('')} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Close reply">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <textarea
                          value={replyText}
                          onChange={(event) => setReplyText(event.target.value)}
                          className="input min-h-36 resize-y"
                          placeholder="Write your reply..."
                        />
                        <div className="mt-3 flex justify-end">
                          <Button type="button" disabled={sendingReply} onClick={() => sendReply(item._id)}>
                            <Send className="h-4 w-4" />{sendingReply ? 'Sending...' : 'Send email reply'}
                          </Button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
            {!messages.length && <tr><td colSpan="6" className="px-4 py-8 text-center font-semibold text-slate-500">No contact messages yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
