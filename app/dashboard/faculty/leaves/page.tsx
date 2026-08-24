'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle2, AlertCircle, FileText, Send, UserCheck, Shield, Sparkles, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/lib/toastContext';

export default function FacultyLeavesPage() {
  const { addToast } = useToast();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [leaveType, setLeaveType] = useState('CASUAL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [substitute, setSubstitute] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchLeaves() {
      try {
        const res = await fetch('/api/leaves');
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
    fetchLeaves();
  }, []);

  const handleApplyLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !reason.trim()) {
      addToast({ title: 'Missing Details', message: 'Please provide start date, end date, and reason.', type: 'warning' });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/leaves', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'APPLY',
          leaveType,
          startDate,
          endDate,
          daysCount: 2,
          reason,
          substitute: substitute || 'Prof. Anita Desai',
          facultyName: 'Dr. Ramesh Kumar',
          employeeId: 'FAC-CSE-019',
          department: 'Computer Science & Engineering'
        })
      });

      if (res.ok) {
        addToast({
          title: 'Application Submitted!',
          message: 'Leave request has been forwarded to HOD for approval.',
          type: 'success'
        });
        setReason('');
        setSubstitute('');
        // Refresh
        const ref = await fetch('/api/leaves');
        if (ref.ok) {
          const json = await ref.json();
          setData(json.data || json);
        }
      }
    } catch {
      addToast({ title: 'Error', message: 'Failed to submit leave application.', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const balances = data?.balances;
  const leaves = data?.leaves || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-xs">
              <Calendar className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Faculty Leave & Duty Management</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">Apply for casual, duty, and medical leaves, manage lecture substitutes, and track quotas</p>
        </div>
      </div>

      {/* Quota Balances */}
      {balances && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Casual Leave (CL)', rem: balances.casualLeave.remaining, total: balances.casualLeave.total, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Medical Leave (ML)', rem: balances.medicalLeave.remaining, total: balances.medicalLeave.total, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'On-Duty Leave (OD)', rem: balances.dutyLeave.remaining, total: balances.dutyLeave.total, color: 'text-purple-600', bg: 'bg-purple-50' },
            { label: 'Earned Leave (EL)', rem: balances.earnedLeave.remaining, total: balances.earnedLeave.total, color: 'text-amber-600', bg: 'bg-amber-50' },
          ].map((bal, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-card">
              <p className="text-xs font-semibold text-slate-500">{bal.label}</p>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className={cn('text-2xl font-bold', bal.color)}>{bal.rem}</span>
                <span className="text-xs text-slate-400">/ {bal.total} days</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: `${(bal.rem / bal.total) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leave Application Form */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-6 shadow-card space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Send className="w-4 h-4 text-blue-600" /> Apply for Leave / OD
          </h3>

          <form onSubmit={handleApplyLeave} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Leave Type</label>
              <select
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2.5 bg-white text-slate-900 outline-none"
              >
                <option value="CASUAL">Casual Leave (CL)</option>
                <option value="DUTY_LEAVE">On-Duty Leave (Conference / Viva)</option>
                <option value="MEDICAL">Medical Leave (ML)</option>
                <option value="EARNED">Earned Leave (EL)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Start Date</label>
                <input
                  required
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-slate-900 outline-none"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">End Date</label>
                <input
                  required
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-slate-900 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Designated Substitute Faculty</label>
              <input
                type="text"
                placeholder="e.g. Prof. Anita Desai"
                value={substitute}
                onChange={(e) => setSubstitute(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2.5 text-slate-900 outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Reason for Absence</label>
              <textarea
                rows={3}
                required
                placeholder="Specify conference name, travel details, or medical reason..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2.5 text-slate-900 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              {submitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </form>
        </div>

        {/* History Table */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-card space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Leave History & Decision Status</h3>

          <div className="space-y-3">
            {leaves.map((lv: any) => (
              <div key={lv.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">{lv.leaveType.replace('_', ' ')}</span>
                    <span className="text-[10px] bg-slate-200/70 text-slate-700 font-semibold px-2 py-0.5 rounded">
                      {lv.daysCount} Day(s)
                    </span>
                  </div>
                  <span className={cn(
                    'text-[10px] font-bold px-2.5 py-0.5 rounded-full',
                    lv.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                  )}>
                    {lv.status}
                  </span>
                </div>

                <p className="text-xs text-slate-700">{lv.reason}</p>

                <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 border-t border-slate-200/60 pt-2">
                  <span>Period: {new Date(lv.startDate).toLocaleDateString()} - {new Date(lv.endDate).toLocaleDateString()}</span>
                  <span>Substitute: {lv.substitute}</span>
                  {lv.reviewedBy && <span className="text-blue-600 font-medium">Reviewed by: {lv.reviewedBy}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
