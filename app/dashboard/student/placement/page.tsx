'use client';

import { useState, useEffect } from 'react';
import {
  Briefcase,
  Calendar,
  Building2,
  CheckCircle2,
  Search,
  DollarSign,
  Clock,
  Sparkles,
  Award,
  AlertCircle,
  FileCheck,
  TrendingUp,
  UserCheck,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { placementCompanies as defaultCompanies } from '@/lib/mockData';
import { useToast } from '@/lib/toastContext';

export default function StudentPlacementPage() {
  const { toast } = useToast();
  const [filter, setFilter] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [appliedIds, setAppliedIds] = useState<string[]>(['1']);
  const [activeTab, setActiveTab] = useState<'DRIVES' | 'APPLICATIONS'>('DRIVES');
  const [companies, setCompanies] = useState<any[]>(defaultCompanies);

  const studentProfile = {
    name: 'Anuraj Singh',
    cgpa: 8.2,
    department: 'Computer Science & Engineering',
    backlogs: 0,
    resumeReady: true,
  };

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch('/api/placements');
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) setCompanies(data);
        }
      } catch (error) {
        console.error('Failed to fetch placements:', error);
      }
    };
    fetchCompanies();
  }, []);

  const filteredCompanies = companies.filter((c: any) => {
    if (filter !== 'ALL' && c.status !== filter) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.role.toLowerCase().includes(search.toLowerCase()))
      return false;
    return true;
  });

  const handleApply = (company: any) => {
    if (studentProfile.cgpa < (company.minCgpa || 6.0)) {
      toast.error(`Minimum CGPA requirement is ${company.minCgpa}. Your CGPA is ${studentProfile.cgpa}.`, 'Eligibility Criteria');
      return;
    }

    setAppliedIds((prev) => [...prev, company.id]);
    toast.success(`Application submitted for ${company.role} at ${company.name}! Verified resume attached.`, 'Applied Successfully');
  };

  // Mock match score based on company name
  const getAiMatchScore = (name: string) => {
    if (name.includes('Google') || name.includes('Microsoft')) return 94;
    if (name.includes('Amazon') || name.includes('Adobe')) return 89;
    if (name.includes('TCS') || name.includes('Infosys')) return 98;
    return 86;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Career & Placement Portal</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
              2026-27 Drives
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Campus recruitment drives, AI resume match scoring, eligibility verification, and application tracking
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('DRIVES')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'DRIVES' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Recruitment Drives ({companies.length})
          </button>
          <button
            onClick={() => setActiveTab('APPLICATIONS')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'APPLICATIONS' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>My Applications</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-100 text-blue-800 font-bold">
              {appliedIds.length}
            </span>
          </button>
        </div>
      </div>

      {/* Student Profile Quick Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-5 text-white shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white font-bold">
            AS
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">{studentProfile.name} • {studentProfile.department}</h3>
            <div className="flex items-center gap-3 text-xs text-blue-200 mt-1">
              <span>Cumulative CGPA: <strong className="text-emerald-300 font-bold">{studentProfile.cgpa}</strong></span>
              <span>•</span>
              <span>Active Backlogs: <strong className="text-white">{studentProfile.backlogs}</strong></span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" /> All Tier-1 Drives Eligible
          </div>
        </div>
      </div>

      {activeTab === 'DRIVES' ? (
        <>
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3.5 py-2 w-full sm:max-w-md shadow-2xs focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-600/10 transition-all">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                placeholder="Search company name, role (e.g. SDE, Data Analyst)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent text-xs text-slate-900 placeholder:text-slate-400 outline-none flex-1"
              />
            </div>

            <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl p-1">
              {['ALL', 'OPEN', 'UPCOMING', 'CLOSED'].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    filter === s ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Company Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCompanies.map((company) => {
              const isApplied = appliedIds.includes(company.id);
              const isEligible = studentProfile.cgpa >= (company.minCgpa || 6.0);
              const matchScore = getAiMatchScore(company.name);

              return (
                <div
                  key={company.id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    {/* Top Row: Company & Status */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 font-black text-sm">
                          {company.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 leading-tight">{company.name}</h3>
                          <span className="text-xs text-slate-500 font-medium">{company.role}</span>
                        </div>
                      </div>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase ${
                          company.status === 'OPEN'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : company.status === 'UPCOMING'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-slate-100 text-slate-500 border-slate-200'
                        }`}
                      >
                        {company.status}
                      </span>
                    </div>

                    {/* Compensation & Cutoff */}
                    <div className="grid grid-cols-2 gap-2 bg-slate-50 rounded-xl p-3 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase">CTC Package</span>
                        <strong className="text-slate-900 font-bold">{company.package}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase">Min CGPA</span>
                        <strong className={isEligible ? 'text-emerald-700 font-bold' : 'text-rose-600 font-bold'}>
                          {company.minCgpa || 6.0} CGPA
                        </strong>
                      </div>
                    </div>

                    {/* AI Resume Match Score */}
                    <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-blue-50/50 border border-blue-100">
                      <div className="flex items-center gap-1.5 text-blue-900 font-medium">
                        <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                        <span>AI Resume Match</span>
                      </div>
                      <span className="font-bold text-blue-700">{matchScore}% Match</span>
                    </div>
                  </div>

                  {/* Footer & Apply */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Due: {formatDate(company.deadline)}
                    </span>

                    {isApplied ? (
                      <span className="px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Applied
                      </span>
                    ) : (
                      <button
                        onClick={() => handleApply(company)}
                        disabled={company.status !== 'OPEN' || !isEligible}
                        className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          company.status === 'OPEN' && isEligible
                            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                        }`}
                      >
                        {!isEligible ? 'Below Cutoff' : 'Apply Now'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* My Applications Tab */
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs divide-y divide-slate-100">
            {companies
              .filter((c) => appliedIds.includes(c.id))
              .map((c) => (
                <div key={c.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm">
                      {c.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{c.name}</h4>
                      <p className="text-[11px] text-slate-500">{c.role} • {c.package}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      Resume Shortlisted
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
