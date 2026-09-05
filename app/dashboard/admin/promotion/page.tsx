'use client';

import { useState, useEffect } from 'react';
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Users,
  Shuffle,
  Award,
  Layers,
  ArrowRight,
  Loader2,
  Filter,
  Check,
  X,
  History,
  ShieldAlert,
} from 'lucide-react';
import { useToast } from '@/lib/toastContext';
import { DEPARTMENTS } from '@/lib/departments';

interface StudentCandidate {
  id: string;
  name: string;
  email: string;
  rollNumber: string;
  department: string;
  currentYear: number;
  currentSemester: number;
  currentSection: string;
  cgpa: number;
  backlogs: number;
  academicStatus: string;
  classAdvisor?: string;
  isEligible: boolean;
  recommendedAction: 'PROMOTE' | 'YEAR_BACK';
  targetYear: number;
  targetSemester: number;
  userOverrideAction?: 'PROMOTE' | 'YEAR_BACK';
  userTargetSection?: string;
}

export default function AdminPromotionPage() {
  const { toast } = useToast();

  const [selectedDept, setSelectedDept] = useState('CSE');
  const [selectedYear, setSelectedYear] = useState(1);
  const [selectedSem, setSelectedSem] = useState(1);
  const [strategy, setStrategy] = useState<'MERIT_CGPA' | 'BALANCED_RANDOM' | 'RETAIN_CURRENT'>('MERIT_CGPA');

  const [loading, setLoading] = useState(false);
  const [promoting, setPromoting] = useState(false);
  const [candidates, setCandidates] = useState<StudentCandidate[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    eligibleForPromotion: 0,
    yearBackCount: 0,
    averageCgpa: 0,
  });

  const fetchCohort = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/promotion?department=${selectedDept}&year=${selectedYear}&semester=${selectedSem}`);
      const data = await res.json();
      if (res.ok) {
        setCandidates(data.students || []);
        setStats(data.stats || { total: 0, eligibleForPromotion: 0, yearBackCount: 0, averageCgpa: 0 });
      } else {
        toast.warning(data.error || 'No verified student records found');
        setCandidates([]);
        setStats({ total: 0, eligibleForPromotion: 0, yearBackCount: 0, averageCgpa: 0 });
      }
    } catch (err: any) {
      toast.error('Failed to load candidate cohort');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCohort();
  }, [selectedDept, selectedYear, selectedSem]);

  const handleToggleAction = (id: string) => {
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const currentAction = c.userOverrideAction || c.recommendedAction;
          const nextAction = currentAction === 'PROMOTE' ? 'YEAR_BACK' : 'PROMOTE';
          return { ...c, userOverrideAction: nextAction };
        }
        return c;
      })
    );
  };

  const handleSectionChange = (id: string, newSec: string) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, userTargetSection: newSec } : c))
    );
  };

  const handleExecutePromotion = async () => {
    if (candidates.length === 0) {
      toast.warning('No student candidates to process');
      return;
    }

    setPromoting(true);
    try {
      const customOverrides = candidates.map((c) => ({
        studentId: c.id,
        action: c.userOverrideAction || c.recommendedAction,
        targetSection: c.userTargetSection,
      }));

      const res = await fetch('/api/admin/promotion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          department: selectedDept,
          currentYear: selectedYear,
          currentSemester: selectedSem,
          sectionStrategy: strategy,
          customOverrides,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Promotion batch failed');

      toast.success(data.message, 'Semester Progression Complete');
      // Refresh cohort
      fetchCohort();
    } catch (err: any) {
      toast.error(err.message || 'Error processing batch promotion');
    } finally {
      setPromoting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Semester Progression & Section Shuffling
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 uppercase">
              Academic Engine
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Automated student term advancement, merit/random section re-allocation, year-back detention, and transcript archiving
          </p>
        </div>

        <button
          onClick={handleExecutePromotion}
          disabled={promoting || candidates.length === 0}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md transition-all"
        >
          {promoting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          Execute Batch Promotion
        </button>
      </div>

      {/* Cohort Selector & Strategy Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Filter Bar */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-indigo-600" /> Select Academic Cohort
          </h2>

          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">Department / Branch</label>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 outline-none focus:bg-white focus:border-indigo-600 font-medium"
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d.code} value={d.code}>
                    {d.name} ({d.code})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Current Year</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 outline-none focus:bg-white focus:border-indigo-600"
                >
                  <option value={1}>1st Year</option>
                  <option value={2}>2nd Year</option>
                  <option value={3}>3rd Year</option>
                  <option value={4}>4th Year</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Current Semester</label>
                <select
                  value={selectedSem}
                  onChange={(e) => setSelectedSem(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 outline-none focus:bg-white focus:border-indigo-600"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <option key={s} value={s}>
                      Semester {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <label className="text-[11px] font-semibold text-slate-700 block mb-2">Section Allocation Strategy</label>
              <div className="space-y-2">
                {[
                  {
                    id: 'MERIT_CGPA',
                    title: 'Merit / CGPA Ranking (Recommended)',
                    desc: 'Top scores to Section A, evenly distributed down',
                    icon: Award,
                  },
                  {
                    id: 'BALANCED_RANDOM',
                    title: 'Balanced Random Shuffling',
                    desc: 'Equal strength & mixed CGPA across Sec A, B, C',
                    icon: Shuffle,
                  },
                  {
                    id: 'RETAIN_CURRENT',
                    title: 'Retain Current Sections',
                    desc: 'Keep students in their existing assigned sections',
                    icon: Layers,
                  },
                ].map((s) => {
                  const Icon = s.icon;
                  const isSelected = strategy === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setStrategy(s.id as any)}
                      className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600/30'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                        <span className="text-xs font-bold text-slate-900">{s.title}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1 pl-6">{s.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Stats & Target Summary */}
        <div className="lg:col-span-8 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
              <span className="text-[10px] text-slate-500 font-semibold uppercase">Total Cohort</span>
              <p className="text-xl font-bold text-slate-900 mt-1 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-slate-400" /> {stats.total}
              </p>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
              <span className="text-[10px] text-emerald-600 font-semibold uppercase">Pass & Eligible</span>
              <p className="text-xl font-bold text-emerald-600 mt-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> {stats.eligibleForPromotion}
              </p>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
              <span className="text-[10px] text-rose-600 font-semibold uppercase">Year-Back / Detain</span>
              <p className="text-xl font-bold text-rose-600 mt-1 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> {stats.yearBackCount}
              </p>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
              <span className="text-[10px] text-indigo-600 font-semibold uppercase">Average CGPA</span>
              <p className="text-xl font-bold text-indigo-600 mt-1 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4" /> {stats.averageCgpa}
              </p>
            </div>
          </div>

          {/* Promotion Target Banner */}
          <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 text-[10px] font-bold uppercase tracking-wider">
                Target Semester Transition
              </span>
              <h3 className="text-base font-bold">
                {selectedDept} Year {selectedYear} (Sem {selectedSem}) ➔{' '}
                <span className="text-emerald-400">
                  Year {selectedSem % 2 === 0 ? selectedYear + 1 : selectedYear} (Sem {selectedSem + 1})
                </span>
              </h3>
              <p className="text-xs text-slate-300">
                All promoted students will be issued updated digital class schedules and mapped to new faculty subject teachers.
              </p>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <div className="text-right">
                <span className="text-[10px] text-slate-400">Audit Status</span>
                <p className="text-xs font-mono font-bold text-emerald-400">Pre-Checked</p>
              </div>
            </div>
          </div>

          {/* Candidates Evaluation Table */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Students Roster & Eligibility Review
                </h3>
                <p className="text-[11px] text-slate-500">
                  Review calculated eligibility, toggle manual overrides, and assign target sections
                </p>
              </div>
              <span className="text-xs text-slate-400 font-mono">{candidates.length} Verified Records</span>
            </div>

            {loading ? (
              <div className="p-12 flex flex-col items-center justify-center space-y-2">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                <p className="text-xs text-slate-500">Evaluating student credits & backlogs...</p>
              </div>
            ) : candidates.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs">
                No students currently in {selectedDept} Year {selectedYear} Sem {selectedSem}.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                    <tr>
                      <th className="px-4 py-3">Student Details</th>
                      <th className="px-4 py-3">Current Sec</th>
                      <th className="px-4 py-3">CGPA / Backlogs</th>
                      <th className="px-4 py-3">Action Decision</th>
                      <th className="px-4 py-3">Target Section</th>
                      <th className="px-4 py-3 text-right">Action Toggle</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {candidates.map((cand) => {
                      const effectiveAction = cand.userOverrideAction || cand.recommendedAction;
                      const isPromoting = effectiveAction === 'PROMOTE';

                      return (
                        <tr key={cand.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-4 py-3.5">
                            <div>
                              <p className="font-bold text-slate-900">{cand.name}</p>
                              <p className="text-[11px] text-slate-400 font-mono">{cand.rollNumber}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="px-2 py-0.5 rounded bg-slate-100 font-mono font-bold text-slate-700">
                              Sec {cand.currentSection}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-indigo-600">{cand.cgpa.toFixed(1)} CGPA</span>
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                  cand.backlogs === 0
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                                }`}
                              >
                                {cand.backlogs} Backlog{cand.backlogs !== 1 ? 's' : ''}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1 w-fit ${
                                isPromoting
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                  : 'bg-rose-50 text-rose-800 border-rose-200'
                              }`}
                            >
                              {isPromoting ? <Check className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
                              {isPromoting ? 'PROMOTE TO NEXT SEM' : 'RETAIN: YEAR-BACK'}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            {isPromoting ? (
                              <select
                                value={cand.userTargetSection || cand.currentSection || 'A'}
                                onChange={(e) => handleSectionChange(cand.id, e.target.value)}
                                className="px-2 py-1 text-xs border border-slate-200 rounded-lg bg-white outline-none font-bold text-slate-800"
                              >
                                <option value="A">Sec A (Top)</option>
                                <option value="B">Sec B</option>
                                <option value="C">Sec C</option>
                              </select>
                            ) : (
                              <span className="text-[11px] text-slate-400 font-italic">Retained</span>
                            )}
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <button
                              onClick={() => handleToggleAction(cand.id)}
                              className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-[11px] font-semibold text-slate-700 cursor-pointer"
                            >
                              {isPromoting ? 'Force Year-Back' : 'Override Pass'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
