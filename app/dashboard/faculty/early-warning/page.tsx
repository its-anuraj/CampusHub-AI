'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  AlertOctagon, 
  ArrowLeft, 
  UserX, 
  HeartHandshake, 
  TrendingDown, 
  ShieldAlert, 
  CheckCircle2, 
  PhoneCall, 
  Mail,
  Sparkles
} from 'lucide-react';

export default function EarlyWarningPage() {
  const [data, setData] = useState<any>(null);
  const [filter, setFilter] = useState<'ALL' | 'HIGH_RISK' | 'MODERATE_RISK'>('ALL');

  useEffect(() => {
    fetch('/api/faculty/early-warning')
      .then(res => res.json())
      .then(json => {
        if (json.success) setData(json.data);
      });
  }, []);

  const handleUpdateStatus = async (studentId: string, newStatus: string) => {
    const res = await fetch('/api/faculty/early-warning', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, interventionStatus: newStatus })
    });
    const json = await res.json();
    if (json.success) {
      setData({ ...data, students: json.data });
    }
  };

  const filteredStudents = data?.students?.filter((s: any) => {
    if (filter === 'ALL') return true;
    return s.riskLevel === filter;
  }) || [];

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-red-900/40 via-amber-900/30 to-slate-900/40 p-6 rounded-2xl border border-red-500/20 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 text-red-400 mb-1">
            <Link href="/dashboard/faculty" className="flex items-center gap-1 hover:underline text-xs">
              <ArrowLeft className="w-3 h-3" /> Back to Faculty Portal
            </Link>
            <span className="text-slate-500">•</span>
            <span className="text-xs font-semibold uppercase tracking-wider">Student Retention Radar</span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <AlertOctagon className="w-6 h-6 text-red-400" />
            Student At-Risk Early Warning System & Retention Radar
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            AI-driven predictive multi-factor risk scoring combining attendance drops, missing lab submissions, and LMS inactivity.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800 self-start md:self-auto">
          {(['ALL', 'HIGH_RISK', 'MODERATE_RISK'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === f ? 'bg-red-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
              }`}
            >
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {data && (
        <>
          {/* Top Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-1">
              <div className="text-xs text-slate-400">Total Flagged Students</div>
              <div className="text-2xl font-bold text-white">{data.totalAtRisk}</div>
              <div className="text-[11px] text-amber-400">{data.highRiskCount} Requiring Immediate Counselor Outreach</div>
            </div>

            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-1">
              <div className="text-xs text-slate-400">Institutional Retention Index</div>
              <div className="text-2xl font-bold text-emerald-400">{data.retentionHealthPct}%</div>
              <div className="text-[11px] text-slate-400">Calculated over current semester cohort</div>
            </div>

            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-1">
              <div className="text-xs text-slate-400">Automated Alert Triggers</div>
              <div className="text-2xl font-bold text-blue-400">Active (Real-time)</div>
              <div className="text-[11px] text-slate-400">SMS to Parents + Faculty Mentor ping</div>
            </div>
          </div>

          {/* Student Cards */}
          <div className="grid grid-cols-1 gap-4">
            {filteredStudents.map((s: any) => (
              <div key={s.studentId} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all space-y-4">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        s.riskLevel === 'HIGH_RISK'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {s.riskLevel.replace('_', ' ')} (Score: {s.riskScore}/100)
                      </span>
                      <span className="text-xs text-slate-400 font-mono">{s.studentId}</span>
                    </div>
                    <h3 className="text-base font-bold text-white">{s.name}</h3>
                    <div className="text-xs text-slate-400">{s.semester} • Assigned Mentor: <strong className="text-slate-300">{s.counselorAssigned}</strong></div>
                  </div>

                  <div className="flex items-center gap-2 self-start md:self-auto">
                    <span className="text-xs text-slate-400 mr-1">Intervention:</span>
                    <select
                      value={s.interventionStatus}
                      onChange={e => handleUpdateStatus(s.studentId, e.target.value)}
                      className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
                    >
                      <option value="MONITORING">Monitoring</option>
                      <option value="COUNSELING_SCHEDULED">Counseling Scheduled</option>
                      <option value="PARENT_CONTACTED">Parent Contacted</option>
                      <option value="RESOLVED">Resolved ✓</option>
                    </select>
                  </div>
                </div>

                {/* Risk Indicators Pills */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Attendance</div>
                    <div className={`text-base font-bold ${s.attendancePct < 75 ? 'text-rose-400' : 'text-slate-200'}`}>
                      {s.attendancePct}%
                    </div>
                  </div>
                  <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Pending Labs / HW</div>
                    <div className="text-base font-bold text-amber-400">{s.assignmentPendingCount} Submissions</div>
                  </div>
                  <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">LMS Inactivity</div>
                    <div className="text-base font-bold text-slate-200">{s.lmsInactivityDays} Days Offline</div>
                  </div>
                </div>

                {/* AI Root Cause Triggers */}
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">AI Root Cause Signals:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {s.reasons?.map((r: string, rIdx: number) => (
                      <span key={rIdx} className="text-xs bg-red-950/30 text-red-300 border border-red-500/20 px-2.5 py-1 rounded-lg">
                        • {r}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
