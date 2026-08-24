'use client';

import { useState } from 'react';
import { Award, DollarSign, Users, CheckCircle2, XCircle, Search, Download, ShieldCheck, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/lib/toastContext';
import { exportToCSV } from '@/lib/exportUtils';

const MOCK_APPLICATIONS = [
  {
    id: 'app-1',
    studentName: 'Alex Kumar',
    rollNumber: '23CSE042',
    department: 'Computer Science',
    scholarship: 'Chancellor’s Academic Merit Scholarship',
    amount: 75000,
    cgpa: 8.42,
    income: '₹3.5 Lakhs',
    status: 'SUBMITTED',
    appliedAt: '2026-08-24'
  },
  {
    id: 'app-2',
    studentName: 'Sneha Reddy',
    rollNumber: '23ECE088',
    department: 'Electronics & Comm',
    scholarship: 'Women in STEM Innovation Fellowship',
    amount: 60000,
    cgpa: 8.91,
    income: '₹4.2 Lakhs',
    status: 'APPROVED',
    appliedAt: '2026-08-20'
  },
  {
    id: 'app-3',
    studentName: 'Mohammed Faizan',
    rollNumber: '23ME014',
    department: 'Mechanical Engg',
    scholarship: 'Alumni Foundation Need-Based Tuition Grant',
    amount: 50000,
    cgpa: 7.65,
    income: '₹2.4 Lakhs',
    status: 'SUBMITTED',
    appliedAt: '2026-08-22'
  }
];

export default function AdminScholarshipsPage() {
  const { addToast } = useToast();
  const [apps, setApps] = useState(MOCK_APPLICATIONS);
  const [search, setSearch] = useState('');

  const handleStatusUpdate = (id: string, status: 'APPROVED' | 'REJECTED') => {
    setApps(apps.map(a => a.id === id ? { ...a, status } : a));
    addToast({
      title: `Grant ${status}`,
      message: `Application marked as ${status.toLowerCase()}. Direct DBT bank dispatch queued.`,
      type: status === 'APPROVED' ? 'success' : 'warning'
    });
  };

  const handleExport = () => {
    exportToCSV(apps, 'Scholarship_Disbursement_Register_2026');
    addToast({ title: 'Export Generated', message: 'Disbursement roster saved to CSV.', type: 'info' });
  };

  const filtered = apps.filter(a =>
    !search || a.studentName.toLowerCase().includes(search.toLowerCase()) || a.rollNumber.toLowerCase().includes(search.toLowerCase()) || a.scholarship.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-xs">
              <Award className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Scholarship & Financial Aid Administration</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">Review student financial grant applications, verify merit & income criteria, and sanction fund disbursements</p>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-xs transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4" /> Export Disbursement Ledger
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Aid Sanctioned', val: '₹42.50 Lakhs', sub: 'Across all grant funds', color: 'text-emerald-600' },
          { label: 'Beneficiary Students', val: '148 Students', sub: '12% of student body', color: 'text-blue-600' },
          { label: 'Pending Review', val: apps.filter(a => a.status === 'SUBMITTED').length.toString(), sub: 'Requires Dean sanction', color: 'text-amber-600' },
          { label: 'DBT Transfer Success', val: '100%', sub: 'Zero payment bounce rate', color: 'text-indigo-600' },
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-card">
            <p className="text-xs font-semibold text-slate-500">{kpi.label}</p>
            <p className={cn('text-2xl font-bold mt-1 tracking-tight', kpi.color)}>{kpi.val}</p>
            <p className="text-[11px] text-slate-400 mt-1">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Table of Applications */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h3 className="text-sm font-bold text-slate-900">Submitted Scholarship Applications</h3>
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search candidate, roll, grant..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-xs text-slate-900 outline-none flex-1"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <th className="p-3.5">Applicant</th>
                <th className="p-3.5">Grant Program</th>
                <th className="p-3.5">Amount</th>
                <th className="p-3.5">Verified CGPA</th>
                <th className="p-3.5">Family Income</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filtered.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5">
                    <p className="font-bold text-slate-900">{app.studentName}</p>
                    <p className="text-[11px] font-mono text-slate-500">{app.rollNumber} • {app.department}</p>
                  </td>
                  <td className="p-3.5 text-slate-800 font-medium">{app.scholarship}</td>
                  <td className="p-3.5 font-bold text-slate-900">₹{app.amount.toLocaleString('en-IN')}</td>
                  <td className="p-3.5 font-bold text-emerald-700">{app.cgpa} / 10.0</td>
                  <td className="p-3.5 text-slate-600">{app.income}</td>
                  <td className="p-3.5">
                    <span className={cn(
                      'text-[10px] font-bold px-2.5 py-0.5 rounded-full',
                      app.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700' :
                      app.status === 'REJECTED' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'
                    )}>
                      {app.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    {app.status === 'SUBMITTED' ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleStatusUpdate(app.id, 'APPROVED')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-semibold hover:bg-emerald-100 transition-colors cursor-pointer text-[11px]"
                        >
                          Sanction Aid
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(app.id, 'REJECTED')}
                          className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 font-semibold hover:bg-rose-100 transition-colors cursor-pointer text-[11px]"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400">Sanctioned</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
