'use client';

import { useState, useEffect } from 'react';
import { Search, Pin, Bookmark, Loader2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { Notice } from '@/types';

export default function StudentNoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Notice | null>(null);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/notices${filter !== 'ALL' ? `?category=${filter}` : ''}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setNotices(data);
        if (data.length > 0 && !selected) {
          setSelected(data[0]);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, [filter]);

  const filtered = notices.filter(n =>
    !search || n.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Campus Notice Board</h1>
          <p className="text-xs text-slate-500 mt-1">Real-time database circulars and official announcements</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1.5 flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <input placeholder="Search notice title..." value={search} onChange={e => setSearch(e.target.value)} className="bg-transparent text-xs text-slate-900 placeholder:text-slate-400 outline-none flex-1" />
        </div>
        <div className="flex gap-1 bg-white border border-slate-200 rounded-lg p-1">
          {['ALL', 'EXAM', 'PLACEMENT', 'EVENT', 'GENERAL'].map(cat => (
            <button key={cat} onClick={() => setFilter(cat)} className={`px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${filter === cat ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-blue-600" /> Fetching real records from database...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Notice List */}
          <div className="lg:col-span-5 space-y-2.5">
            {filtered.map(notice => (
              <div
                key={notice.id}
                onClick={() => setSelected(notice)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  selected?.id === notice.id
                    ? 'bg-blue-50/50 border-blue-600 ring-1 ring-blue-600/20'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="text-xs font-semibold text-slate-900 line-clamp-1">{notice.title}</h3>
                  {notice.isPinned && <Pin className="w-3 h-3 text-amber-600 flex-shrink-0" />}
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{notice.content}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">{notice.category}</span>
                  <span className="text-[10px] text-slate-400">{formatDate(notice.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Selected Notice Detail */}
          <div className="lg:col-span-7">
            {selected ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-card space-y-4 sticky top-20">
                <div className="border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100">{selected.category}</span>
                    {selected.isPinned && <span className="text-[10px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">Pinned Notice</span>}
                  </div>
                  <h2 className="text-base font-semibold text-slate-900">{selected.title}</h2>
                  <p className="text-xs text-slate-400 mt-1">Issued by <span className="text-slate-700 font-medium">{selected.createdBy}</span> • {formatDate(selected.createdAt)}</p>
                </div>

                <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap py-2">
                  {selected.content}
                </div>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-xs text-slate-400">
                Select a notice to preview details
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
