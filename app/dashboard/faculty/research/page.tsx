'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Award, DollarSign, Plus, Download, ExternalLink, Sparkles, Search, CheckCircle2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/lib/toastContext';

export default function FacultyResearchPage() {
  const { addToast } = useToast();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [journal, setJournal] = useState('IEEE Transactions on Cloud Computing');
  const [doi, setDoi] = useState('');
  const [year, setYear] = useState('2026');
  const [abstract, setAbstract] = useState('');

  useEffect(() => {
    async function fetchResearch() {
      try {
        const res = await fetch('/api/research');
        if (res.ok) {
          const json = await res.json();
          setData(json.data || json);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchResearch();
  }, []);

  const handleAddPublication = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          journal,
          doi,
          year,
          abstract,
          facultyName: 'Dr. Ramesh Kumar',
          department: 'Computer Science & Engineering'
        })
      });

      if (res.ok) {
        addToast({ title: 'Paper Logged', message: 'Publication registered in Scopus / Web of Science ledger.', type: 'success' });
        setModalOpen(false);
        setTitle('');
        setDoi('');
        setAbstract('');
        // Refresh
        const ref = await fetch('/api/research');
        if (ref.ok) {
          const json = await ref.json();
          setData(json.data || json);
        }
      }
    } catch {
      addToast({ title: 'Error', message: 'Failed to record paper', type: 'error' });
    }
  };

  const metrics = data?.metrics;
  const papers = data?.publications || [];
  const grants = data?.grants || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shadow-xs">
              <BookOpen className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Faculty Research & Publications Ledger</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">Manage Scopus/IEEE publications, track citation metrics (h-index, i10-index), and sponsored research grants</p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Log New Publication
        </button>
      </div>

      {/* Metrics Cards */}
      {metrics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: 'Published Papers', val: metrics.totalPapers, color: 'text-blue-600' },
            { label: 'Total Citations', val: metrics.totalCitations, color: 'text-emerald-600' },
            { label: 'h-index Score', val: metrics.hIndex, color: 'text-purple-600' },
            { label: 'i10-index Score', val: metrics.i10Index, color: 'text-amber-600' },
            { label: 'Sponsored Funding', val: metrics.totalGrantFunding, color: 'text-indigo-600' },
          ].map((m, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-card">
              <p className="text-xs font-semibold text-slate-500">{m.label}</p>
              <p className={cn('text-2xl font-bold mt-1 tracking-tight', m.color)}>{m.val}</p>
            </div>
          ))}
        </div>
      )}

      {/* Sponsored Grants */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-card space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-emerald-600" /> Active Government & Industry Funded Research Grants
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {grants.map((g: any) => (
            <div key={g.id} className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {g.status}
                </span>
                <span className="font-bold text-slate-900 text-sm">₹{(g.grantAmount / 100000).toFixed(1)} Lakhs</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 leading-snug">{g.title}</h4>
              <p className="text-xs text-slate-500 font-medium">Sponsor: {g.agency}</p>
              <div className="flex items-center justify-between text-[11px] text-slate-600 border-t border-slate-200/60 pt-2">
                <span>Duration: {g.duration}</span>
                <span className="font-semibold text-blue-600">{g.leadPi}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Publications List */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-card space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Peer-Reviewed Journal & Conference Proceedings</h3>

        <div className="space-y-4">
          {papers.map((p: any) => (
            <div key={p.id} className="p-4 rounded-2xl border border-slate-200/80 bg-white hover:border-blue-300 transition-all space-y-2">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                    {p.year}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mt-1 leading-snug">{p.title}</h4>
                  <p className="text-xs text-slate-500 font-semibold">{p.journal}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    {p.citations} Citations
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{p.abstract}</p>

              {p.doi && (
                <p className="text-[11px] font-mono text-slate-400">
                  DOI: <span className="text-blue-600 underline cursor-pointer">{p.doi}</span>
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full shadow-2xl relative space-y-4">
            <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-slate-900">Record New Research Paper</h3>

            <form onSubmit={handleAddPublication} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Paper Title</label>
                <input required type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Full title of the paper..." className="w-full border border-slate-200 rounded-lg p-2.5 text-slate-900 outline-none" />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Journal / Conference Name</label>
                <input required type="text" value={journal} onChange={e => setJournal(e.target.value)} placeholder="e.g. IEEE Transactions, Nature Communications" className="w-full border border-slate-200 rounded-lg p-2.5 text-slate-900 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Publication Year</label>
                  <input type="number" value={year} onChange={e => setYear(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-slate-900 outline-none" />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Digital Object Identifier (DOI)</label>
                  <input type="text" value={doi} onChange={e => setDoi(e.target.value)} placeholder="10.1109/..." className="w-full border border-slate-200 rounded-lg p-2.5 text-slate-900 outline-none" />
                </div>
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Abstract Summary</label>
                <textarea rows={3} value={abstract} onChange={e => setAbstract(e.target.value)} placeholder="Brief key summary of novelty and results..." className="w-full border border-slate-200 rounded-lg p-2.5 text-slate-900 outline-none" />
              </div>
              <button type="submit" className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs shadow-xs transition-colors cursor-pointer">
                Submit to Institutional Repository
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
