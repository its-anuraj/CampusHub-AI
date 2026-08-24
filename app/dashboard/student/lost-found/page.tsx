'use client';

import { useState, useEffect } from 'react';
import { Package, Search, Plus, MapPin, Calendar, CheckCircle2, Shield, AlertCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/lib/toastContext';

export default function StudentLostFoundPage() {
  const { addToast } = useToast();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('ALL');
  const [search, setSearch] = useState('');
  const [reportModal, setReportModal] = useState(false);
  const [claimModal, setClaimModal] = useState<any>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [type, setType] = useState('LOST');
  const [category, setCategory] = useState('ELECTRONICS');
  const [location, setLocation] = useState('');
  const [desc, setDesc] = useState('');
  const [contact, setContact] = useState('');

  useEffect(() => {
    async function fetchItems() {
      try {
        const res = await fetch(`/api/lost-found?type=${selectedType}`);
        if (res.ok) {
          const json = await res.json();
          setItems(json.data || json);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchItems();
  }, [selectedType]);

  const handleReportItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/lost-found', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'REPORT',
          title,
          type,
          category,
          location,
          description: desc,
          reportedBy: 'Alex Kumar',
          contactInfo: contact || 'alex@campushub.edu'
        })
      });

      if (res.ok) {
        addToast({ title: 'Item Logged', message: 'Report submitted to campus lost & found network.', type: 'success' });
        setReportModal(false);
        setTitle('');
        setLocation('');
        setDesc('');
        // Refresh
        const ref = await fetch(`/api/lost-found?type=${selectedType}`);
        if (ref.ok) {
          const json = await ref.json();
          setItems(json.data || json);
        }
      }
    } catch {
      addToast({ title: 'Error', message: 'Failed to report item', type: 'error' });
    }
  };

  const filtered = items.filter(i =>
    !search || i.title.toLowerCase().includes(search.toLowerCase()) || i.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 shadow-xs">
              <Package className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Campus Lost & Found Desk</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">Community recovery portal for missing campus items, electronics, ID cards, and books</p>
        </div>

        <button
          onClick={() => setReportModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Report Lost / Found Item
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {[
            { id: 'ALL', label: 'All Items' },
            { id: 'FOUND', label: 'Found Items' },
            { id: 'LOST', label: 'Lost Inquiries' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedType(t.id)}
              className={cn(
                'px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap',
                selectedType === t.id ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search items, locations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-xs text-slate-900 outline-none flex-1"
          />
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <div key={item.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-card flex flex-col justify-between hover:border-blue-300 transition-all">
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className={cn(
                  'text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider',
                  item.type === 'FOUND' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                )}>
                  {item.type}
                </span>
                <span className="text-[11px] font-mono text-slate-400">{item.category}</span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 leading-snug">{item.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>

              <div className="space-y-1.5 text-[11px] text-slate-500 border-t border-slate-100 pt-3">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{item.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{new Date(item.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-blue-500" />
                  <span>{item.contactInfo}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100">
              <button
                onClick={() => {
                  setClaimModal(item);
                  addToast({ title: 'Claim Verification', message: 'Proceed to security desk or submit proof of ownership.', type: 'info' });
                }}
                className="w-full py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 font-semibold rounded-xl text-xs transition-colors cursor-pointer shadow-xs"
              >
                Claim This Item →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Report Modal */}
      {reportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full shadow-2xl relative space-y-4">
            <button onClick={() => setReportModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-slate-900">Report Lost or Found Item</h3>

            <form onSubmit={handleReportItem} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Item Title</label>
                <input required type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Casio fx-991EX Calculator" className="w-full border border-slate-200 rounded-lg p-2.5 text-slate-900 outline-none" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Report Type</label>
                  <select value={type} onChange={e => setType(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-slate-900 outline-none">
                    <option value="LOST">I Lost An Item</option>
                    <option value="FOUND">I Found An Item</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Category</label>
                  <select value={category} onChange={e => setCategory(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-slate-900 outline-none">
                    <option value="ELECTRONICS">Electronics</option>
                    <option value="ID_CARDS">ID Cards</option>
                    <option value="BAGS">Bags & Bottles</option>
                    <option value="KEYS">Keys</option>
                    <option value="BOOKS">Books / Notes</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Location Found / Lost</label>
                <input required type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="Library 2nd Floor / Cafeteria" className="w-full border border-slate-200 rounded-lg p-2.5 text-slate-900 outline-none" />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Distinguishing Marks / Details</label>
                <textarea rows={3} required value={desc} onChange={e => setDesc(e.target.value)} placeholder="Color, stickers, scratch marks, serial numbers..." className="w-full border border-slate-200 rounded-lg p-2.5 text-slate-900 outline-none" />
              </div>

              <button type="submit" className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs shadow-xs transition-colors cursor-pointer">
                Submit Report to Registry
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
