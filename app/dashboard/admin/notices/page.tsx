'use client';

import { useState, useEffect } from 'react';
import { Plus, Pin, Trash2, Send, X, Loader2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { Notice } from '@/types';

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', category: 'GENERAL', priority: 'MEDIUM', department: 'ALL', isPinned: false });

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/notices');
      const data = await res.json();
      if (Array.isArray(data)) {
        setNotices(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleCreate = async () => {
    if (!form.title || !form.content) return;
    try {
      const res = await fetch('/api/notices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, createdBy: 'System Admin' }),
      });
      if (res.ok) {
        setForm({ title: '', content: '', category: 'GENERAL', priority: 'MEDIUM', department: 'ALL', isPinned: false });
        setShowForm(false);
        fetchNotices();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteNotice = async (id: string) => {
    try {
      const res = await fetch(`/api/notices?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchNotices();
    } catch (e) {
      console.error(e);
    }
  };

  const togglePin = async (id: string, currentPinStatus: boolean) => {
    try {
      const res = await fetch('/api/notices', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isPinned: !currentPinStatus }),
      });
      if (res.ok) fetchNotices();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Campus Notice Management</h1>
          <p className="text-xs text-slate-500 mt-1">Broadcast official announcements to database with instant persistence</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer">
          <Plus className="w-3.5 h-3.5" /> Compose Notice
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">New Official Circular</h3>
            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
          </div>
          <input placeholder="Notice Title" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-600" />
          <textarea placeholder="Notice content..." value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
            rows={3} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-600 resize-none" />
          <div className="flex items-center gap-4 text-xs">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" checked={form.isPinned} onChange={e => setForm(p => ({ ...p, isPinned: e.target.checked }))} className="accent-blue-600" />
              <span>Pin Notice to Top</span>
            </label>
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <button onClick={() => setShowForm(false)} className="px-3.5 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium hover:bg-slate-200 transition-colors cursor-pointer">Cancel</button>
            <button onClick={handleCreate} className="px-3.5 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors flex items-center gap-1 cursor-pointer shadow-xs"><Send className="w-3.5 h-3.5" /> Save to Database</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-blue-600" /> Syncing database records...
        </div>
      ) : (
        <div className="space-y-3">
          {notices.map((notice) => (
            <div key={notice.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-card flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {notice.isPinned && <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">Pinned</span>}
                  <span className="text-[10px] font-medium px-2 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">{notice.category}</span>
                  <span className="text-[10px] text-slate-400">{formatDate(notice.createdAt)}</span>
                </div>
                <h3 className="text-sm font-semibold text-slate-900">{notice.title}</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed line-clamp-2">{notice.content}</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => togglePin(notice.id, notice.isPinned)} className={`p-1.5 rounded transition-colors cursor-pointer ${notice.isPinned ? 'bg-amber-50 text-amber-700' : 'text-slate-400 hover:bg-slate-100 hover:text-amber-600'}`} title="Toggle pin">
                  <Pin className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => deleteNotice(notice.id)} className="p-1.5 rounded text-slate-400 hover:bg-slate-100 hover:text-red-600 transition-colors cursor-pointer">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
