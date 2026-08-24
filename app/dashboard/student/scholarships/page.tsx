'use client';

import { useState, useEffect } from 'react';
import { Award, DollarSign, Calendar, CheckCircle2, Clock, ShieldCheck, Search, Filter, Sparkles, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/lib/toastContext';

export default function StudentScholarshipsPage() {
  const { addToast } = useToast();
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [applyModal, setApplyModal] = useState<any>(null);
  const [income, setIncome] = useState('350000');
  const [submitting, setSubmitting] = useState(false);

  // Student details
  const myCgpa = 8.42;

  useEffect(() => {
    async function fetchSch() {
      try {
        const res = await fetch('/api/scholarships');
        if (res.ok) {
          const json = await res.json();
          setScholarships(json.data || json);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchSch();
  }, []);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/scholarships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'APPLY',
          scholarshipId: applyModal.id,
          studentName: 'Alex Kumar',
          rollNumber: '23CSE042',
          cgpa: myCgpa,
          annualIncome: Number(income)
        })
      });
      if (res.ok) {
        addToast({
          title: 'Application Submitted! 🎓',
          message: `Your scholarship application for ${applyModal.title} has been logged.`,
          type: 'success'
        });
        setApplyModal(null);
      }
    } catch {
      addToast({ title: 'Error', message: 'Failed to submit application', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-xs">
              <Award className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Scholarships & Financial Grants</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">Explore merit awards, financial aid, women-in-tech grants, and corporate sponsorships</p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-1.5 text-xs text-emerald-800 font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>My Verified CGPA: {myCgpa}</span>
        </div>
      </div>

      {/* Grid of Scholarships */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scholarships.map((sch) => {
          const isEligible = myCgpa >= sch.minCgpa;
          return (
            <div key={sch.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-card flex flex-col justify-between space-y-4 hover:border-emerald-300 transition-all">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase">
                    {sch.category}
                  </span>
                  <span className="text-lg font-bold text-slate-900">₹{sch.amount.toLocaleString('en-IN')}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">{sch.title}</h3>
                <p className="text-xs text-slate-500">{sch.provider}</p>
                <p className="text-xs text-slate-600 leading-relaxed">{sch.description}</p>

                <div className="space-y-1.5 text-[11px] text-slate-500 border-t border-slate-100 pt-3">
                  <div className="flex items-center justify-between">
                    <span>Min CGPA Requirement:</span>
                    <span className="font-semibold text-slate-800">{sch.minCgpa} / 10.0</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Income Cap:</span>
                    <span className="font-semibold text-slate-800">≤ ₹{(sch.familyIncome / 100000).toFixed(1)} Lakhs</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Deadline:</span>
                    <span className="text-rose-600 font-semibold">{new Date(sch.deadline).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setApplyModal(sch)}
                  className={cn(
                    'w-full py-2.5 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer',
                    isEligible ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                  )}
                >
                  {isEligible ? 'Apply For Grant →' : 'CGPA Requirement Not Met'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Apply Modal */}
      {applyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full shadow-2xl relative space-y-4">
            <button onClick={() => setApplyModal(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer">
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                Grant Application
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">{applyModal.title}</h3>
              <p className="text-xs text-slate-500">Sanction Amount: ₹{applyModal.amount.toLocaleString('en-IN')}</p>
            </div>

            <form onSubmit={handleApply} className="space-y-3.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <p className="text-slate-500">Applicant: <strong className="text-slate-900">Alex Kumar (23CSE042)</strong></p>
                <p className="text-slate-500">Verified CGPA: <strong className="text-emerald-700">{myCgpa}</strong></p>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Annual Family Income (INR)</label>
                <input
                  type="number"
                  required
                  value={income}
                  onChange={e => setIncome(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-slate-900 outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                {submitting ? 'Submitting...' : 'Confirm & Submit Application'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
