'use client';

import { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, XCircle, Clock, Users, Search, Filter, Loader2, ShieldCheck, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/lib/toastContext';
import { DEPARTMENTS } from '@/lib/departments';

export default function AdminLeavesPage() {
  const { addToast } = useToast();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');

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

  const handleAction = async (leaveId: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      const res = await fetch('/api/leaves', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'UPDATE_STATUS',
          leaveId,
          status,
          reviewedBy: 'Dean of Faculty Affairs'
        })
      });
      if (res.ok) {
        addToast({
          title: `Leave ${status}`,
          message: `Faculty leave record has been updated to ${status.toLowerCase()}.`,
          type: status === 'APPROVED' ? 'success' : 'warning'
        });
        // Update local state
        setData((prev: any) => ({
          ...prev,
          leaves: prev.leaves.map((l: any) => l.id === leaveId ? { ...l, status, reviewedBy: 'Dean of Faculty Affairs' } : l)
        }));
      }
    } catch {
      addToast({ title: 'Error', message: 'Failed to update leave status', type: 'error' });
    }
  };

  const leaves = data?.leaves || [];
  const filtered = leaves.filter((l: any) => {
    const matchSearch = !search || l.facultyName.toLowerCase().includes(search.toLowerCase()) || l.employeeId.toLowerCase().includes(search.toLowerCase());
    const matchDept = selectedDept === 'ALL' || l.department.toLowerCase().includes(selectedDept.toLowerCase());
    return matchSearch && matchDept;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 shadow-xs">
              <Calendar className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Faculty Leave & Absence Approval Desk</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">Review faculty on-duty and casual leave applications, audit substitute coverage, and track institutional quotas</p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Faculty on Leave Today', val: '8 Members', sub: 'Across 5 departments', color: 'text-blue-600' },
          { label: 'Pending Approvals', val: leaves.filter((l: any) => l.status === 'PENDING').length.toString(), sub: 'Requires Dean sanction', color: 'text-amber-600' },
          { label: 'Lecture Substitution Rate', val: '100%', sub: 'All classes covered', color: 'text-emerald-600' },
          { label: 'Monthly Leave Utilization', val: '4.2%', sub: 'Within compliance threshold', color: 'text-indigo-600' },
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-card">
            <p className="text-xs font-semibold text-slate-500">{kpi.label}</p>
            <p className={cn('text-2xl font-bold mt-1 tracking-tight', kpi.color)}>{kpi.val}</p>
            <p className="text-[11px] text-slate-400 mt-1">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Filter and Search */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h3 className="text-sm font-bold text-slate-900">Leave Applications Register</h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search faculty or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent text-xs text-slate-900 outline-none w-36 sm:w-48"
              />
            </div>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs bg-slate-50 text-slate-700 outline-none"
            >
              <option value="ALL">All Departments</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Information Tech">Information Technology</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="p-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <th className="p-3.5">Faculty Member</th>
                  <th className="p-3.5">Type & Duration</th>
                  <th className="p-3.5">Reason & Purpose</th>
                  <th className="p-3.5">Substitute Assigned</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filtered.map((lv: any) => (
                  <tr key={lv.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5">
                      <p className="font-bold text-slate-900">{lv.facultyName}</p>
                      <p className="text-[11px] font-mono text-slate-500">{lv.employeeId} • {lv.department}</p>
                    </td>
                    <td className="p-3.5">
                      <span className="font-semibold text-blue-600">{lv.leaveType.replace('_', ' ')}</span>
                      <p className="text-[11px] text-slate-500">{lv.daysCount} Days ({new Date(lv.startDate).toLocaleDateString()})</p>
                    </td>
                    <td className="p-3.5 max-w-xs text-slate-700">{lv.reason}</td>
                    <td className="p-3.5 font-medium text-slate-800">{lv.substitute || 'None'}</td>
                    <td className="p-3.5">
                      <span className={cn(
                        'text-[10px] font-bold px-2.5 py-0.5 rounded-full',
                        lv.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700' :
                        lv.status === 'REJECTED' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'
                      )}>
                        {lv.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      {lv.status === 'PENDING' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleAction(lv.id, 'APPROVED')}
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors cursor-pointer"
                            title="Approve"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleAction(lv.id, 'REJECTED')}
                            className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
                            title="Reject"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400">Processed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
