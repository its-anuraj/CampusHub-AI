'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CheckCircle2, XCircle, AlertCircle, Filter, Calendar, Loader2 } from 'lucide-react';
import { studentDashboardData } from '@/lib/mockData';

const subjectAttendance = [
  { subject: 'Data Structures', present: 38, absent: 4, total: 42, percentage: 90.5 },
  { subject: 'DBMS', present: 34, absent: 6, total: 40, percentage: 85.0 },
  { subject: 'Operating Systems', present: 28, absent: 10, total: 38, percentage: 73.7 },
  { subject: 'Computer Networks', present: 36, absent: 2, total: 38, percentage: 94.7 },
  { subject: 'Software Eng.', present: 30, absent: 8, total: 38, percentage: 78.9 },
];

const dailyAttendance = [
  { date: 'Mon Aug 05', DSA: 'P', DBMS: 'P', OS: 'A', Networks: 'P', SE: 'P' },
  { date: 'Tue Aug 06', DSA: 'P', DBMS: 'A', OS: 'P', Networks: 'P', SE: 'P' },
  { date: 'Wed Aug 07', DSA: 'P', DBMS: 'P', OS: 'P', Networks: 'P', SE: 'A' },
  { date: 'Thu Aug 08', DSA: 'A', DBMS: 'P', OS: 'P', Networks: 'P', SE: 'P' },
];

export default function StudentAttendancePage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'daily'>('overview');
  const overall = studentDashboardData.attendancePercentage;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Attendance Tracker</h1>
          <p className="text-xs text-slate-500 mt-1">Course attendance analytics and automated minimum risk alerts</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-white border border-slate-200 rounded-lg p-1 flex">
            {(['overview', 'daily'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all capitalize cursor-pointer ${
                  activeTab === tab ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >{tab === 'overview' ? 'Subject Breakdown' : 'Daily Logs'}</button>
            ))}
          </div>
        </div>
      </div>

      {overall < 80 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900">
            <span className="font-semibold">AI Threshold Warning:</span> Overall attendance is currently at <span className="font-bold">{overall}%</span>. Maintain attendance in upcoming lectures to preserve eligibility for term examinations.
          </div>
        </div>
      )}

      {activeTab === 'overview' && (
        <>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-card space-y-4">
            <h3 className="text-sm font-semibold text-slate-900">Subject-wise Percentage</h3>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectAttendance} margin={{ top: 10, right: 10, bottom: 5, left: -25 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="subject" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} domain={[0, 100]} />
                  <Tooltip contentStyle={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '11px' }} />
                  <Bar dataKey="percentage" radius={[4, 4, 0, 0]} maxBarSize={48}>
                    {subjectAttendance.map((entry, i) => (
                      <Cell key={i} fill={entry.percentage >= 85 ? '#16A34A' : entry.percentage >= 75 ? '#D97706' : '#DC2626'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-card">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-sm font-semibold text-slate-900">Detailed Subject Ledger</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200/80 bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider">
                    <th className="px-6 py-3">Subject Name</th>
                    <th className="px-6 py-3">Attended</th>
                    <th className="px-6 py-3">Missed</th>
                    <th className="px-6 py-3">Total Held</th>
                    <th className="px-6 py-3">Attendance %</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {subjectAttendance.map((sub) => (
                    <tr key={sub.subject} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-3.5 font-medium text-slate-900">{sub.subject}</td>
                      <td className="px-6 py-3.5 font-semibold text-emerald-600">{sub.present}</td>
                      <td className="px-6 py-3.5 font-semibold text-red-600">{sub.absent}</td>
                      <td className="px-6 py-3.5 text-slate-500">{sub.total}</td>
                      <td className="px-6 py-3.5 font-bold text-slate-900">{sub.percentage}%</td>
                      <td className="px-6 py-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                          sub.percentage >= 85 ? 'badge-success' : sub.percentage >= 75 ? 'badge-warning' : 'badge-danger'
                        }`}>
                          {sub.percentage >= 85 ? 'Optimal' : sub.percentage >= 75 ? 'Borderline' : 'At Risk'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'daily' && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-card">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-sm font-semibold text-slate-900">Recent Attendance Audit</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="px-6 py-3">Lecture Date</th>
                  <th className="px-6 py-3">Data Structures</th>
                  <th className="px-6 py-3">DBMS</th>
                  <th className="px-6 py-3">OS</th>
                  <th className="px-6 py-3">Networks</th>
                  <th className="px-6 py-3">Software Eng</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dailyAttendance.map((day) => (
                  <tr key={day.date} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-3.5 font-medium text-slate-900">{day.date}</td>
                    {[day.DSA, day.DBMS, day.OS, day.Networks, day.SE].map((status, i) => (
                      <td key={i} className="px-6 py-3.5 font-semibold">
                        {status === 'P' ? (
                          <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Present</span>
                        ) : (
                          <span className="text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">Absent</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
