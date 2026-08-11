'use client';

import { useState, useEffect } from 'react';
import { Briefcase, Calendar, Building2, Loader2, CheckCircle2, Search, DollarSign, Clock } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { placementCompanies as defaultCompanies } from '@/lib/mockData';

export default function StudentPlacementPage() {
  const [filter, setFilter] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [applied, setApplied] = useState<string[]>([]);
  const [placementCompanies, setPlacementCompanies] = useState<any[]>(defaultCompanies);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch('/api/placements');
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) setPlacementCompanies(data);
        }
      } catch (error) {
        console.error('Failed to fetch placements:', error);
      }
    };
    fetchCompanies();
  }, []);

  const filtered = placementCompanies.filter((c: any) => {
    if (filter !== 'ALL' && c.status !== filter) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleApply = (id: string) => {
    setApplied(prev => [...prev, id]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Career Placement Portal</h1>
          <p className="text-xs text-slate-500 mt-1">Campus recruitment drives, eligibility tracking, and direct applications</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1.5 flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <input placeholder="Filter companies..." value={search} onChange={e => setSearch(e.target.value)} className="bg-transparent text-xs text-slate-900 placeholder:text-slate-400 outline-none flex-1" />
        </div>
        <div className="flex gap-1 bg-white border border-slate-200 rounded-lg p-1">
          {['ALL', 'OPEN', 'UPCOMING', 'CLOSED'].map(s => (
            <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${filter === s ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}>{s}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((company) => {
          const isApplied = applied.includes(company.id);
          const isEligible = company.eligibility.minCgpa <= 8.2 && company.eligibility.departments.includes('CSE');
          return (
            <div key={company.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-card hover:border-slate-300 transition-all flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">{company.name}</h3>
                    <p className="text-xs text-blue-600 font-medium">{company.role}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                    company.status === 'OPEN' ? 'badge-success' :
                    company.status === 'UPCOMING' ? 'badge-warning' : 'badge-neutral'
                  }`}>
                    {company.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 my-3 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                    <span>Package: <strong className="text-slate-900">{company.package}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Deadline: <strong className="text-slate-900">{formatDate(company.deadline)}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] text-slate-400">Target Branches:</span>
                  {company.eligibility.departments.map((d: string) => (
                    <span key={d} className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">{d}</span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">Min CGPA: <strong>{company.eligibility.minCgpa}</strong></span>
                {company.status === 'OPEN' && !isApplied && isEligible && (
                  <button onClick={() => handleApply(company.id)} className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs">
                    Apply Now
                  </button>
                )}
                {isApplied && (
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                    ✓ Applied
                  </span>
                )}
                {company.status !== 'OPEN' && (
                  <span className="text-xs text-slate-400 font-medium">Drive {company.status.toLowerCase()}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
