'use client';

import { useState } from 'react';
import {
  Shield,
  Search,
  Filter,
  Download,
  AlertTriangle,
  CheckCircle2,
  Info,
  Clock,
  RefreshCw,
  Server,
  Key,
  Database,
  UserCheck,
} from 'lucide-react';
import { useToast } from '@/lib/toastContext';

interface AuditLogEntry {
  id: string;
  actor: string;
  role: string;
  action: string;
  category: string;
  severity: 'SUCCESS' | 'INFO' | 'WARNING' | 'ERROR';
  ipAddress: string;
  timestamp: string;
}

const INITIAL_LOGS: AuditLogEntry[] = [
  { id: 'LOG-8891', actor: 'ajsinghindolia@gmail.com', role: 'ADMIN', action: 'Admin Superuser Login Success (Verified MFA Session)', category: 'AUTH', severity: 'SUCCESS', ipAddress: '103.21.14.88', timestamp: '23 Aug 2026, 11:10 PM' },
  { id: 'LOG-8890', actor: 'priya.sharma@campushub.edu', role: 'FACULTY', action: 'Published Gradebook for CS501 (Data Structures)', category: 'GRADEBOOK', severity: 'INFO', ipAddress: '192.168.1.45', timestamp: '23 Aug 2026, 10:45 PM' },
  { id: 'LOG-8889', actor: 'system-backup-worker', role: 'SYSTEM', action: 'Daily Automated Database Snapshot & Integrity Check Passed', category: 'SYSTEM', severity: 'SUCCESS', ipAddress: '127.0.0.1', timestamp: '23 Aug 2026, 10:00 PM' },
  { id: 'LOG-8888', actor: 'unknown-client', role: 'GUEST', action: 'Failed Login Attempt: Invalid OTP Verification Code', category: 'SECURITY', severity: 'WARNING', ipAddress: '45.112.87.19', timestamp: '23 Aug 2026, 09:30 PM' },
  { id: 'LOG-8887', actor: 'admin@campushub.edu', role: 'ADMIN', action: 'Fee Structure & Gateway Webhook Configured for 2026-27', category: 'FINANCE', severity: 'INFO', ipAddress: '103.21.14.88', timestamp: '23 Aug 2026, 07:15 PM' },
  { id: 'LOG-8886', actor: 'rahul.gupta@campushub.edu', role: 'FACULTY', action: 'Created Assignment: "SQL Complex Joins & Views Worksheet"', category: 'ACADEMICS', severity: 'INFO', ipAddress: '192.168.1.52', timestamp: '23 Aug 2026, 06:00 PM' },
];

const SEVERITIES = ['ALL', 'SUCCESS', 'INFO', 'WARNING', 'ERROR'];
const CATEGORIES = ['ALL', 'AUTH', 'GRADEBOOK', 'SECURITY', 'SYSTEM', 'FINANCE', 'ACADEMICS'];

export default function AdminAuditLogsPage() {
  const { toast } = useToast();
  const [logs, setLogs] = useState<AuditLogEntry[]>(INITIAL_LOGS);
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredLogs = logs.filter((l) => {
    const matchSev = severityFilter === 'ALL' || l.severity === severityFilter;
    const matchCat = categoryFilter === 'ALL' || l.category === categoryFilter;
    const matchSearch =
      !search ||
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.actor.toLowerCase().includes(search.toLowerCase()) ||
      l.id.toLowerCase().includes(search.toLowerCase()) ||
      l.ipAddress.includes(search);
    return matchSev && matchCat && matchSearch;
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((r) => setTimeout(r, 600));
    setIsRefreshing(false);
    toast.success('Security audit logs synchronized from cloud cluster.', 'Logs Refreshed');
  };

  const handleExportCSV = () => {
    const headers = ['Log ID', 'Timestamp', 'Actor', 'Role', 'Category', 'Severity', 'IP Address', 'Action'];
    const rows = filteredLogs.map((l) => [l.id, l.timestamp, l.actor, l.role, l.category, l.severity, l.ipAddress, `"${l.action}"`]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `campushub-audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    toast.success('Audit log export generated successfully.', 'CSV Exported');
  };

  const getSeverityBadge = (s: string) => {
    switch (s) {
      case 'SUCCESS':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'WARNING':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'ERROR':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Security & System Audit Log Console</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 uppercase">
              Immutable Trail
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time compliance activity monitor, administrative action tracking, authentication events, and forensic logs
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
            title="Refresh Log Feed"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
          >
            <Download className="w-4 h-4" /> Export CSV Log
          </button>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] text-slate-500 font-medium">Recorded Events (24h)</span>
          <p className="text-xl font-bold text-slate-900 mt-1">{logs.length} Events</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] text-slate-500 font-medium">Security Warnings</span>
          <p className="text-xl font-bold text-amber-600 mt-1">
            {logs.filter((l) => l.severity === 'WARNING').length} Flagged
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] text-slate-500 font-medium">Auth Success Rate</span>
          <p className="text-xl font-bold text-emerald-600 mt-1">99.8%</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] text-slate-500 font-medium">Log Storage Status</span>
          <p className="text-xl font-bold text-slate-900 mt-1">Encrypted</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3.5 py-2 w-full sm:max-w-md shadow-2xs focus-within:border-blue-600 outline-none">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            placeholder="Search action, actor email, IP address, ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-xs text-slate-900 placeholder:text-slate-400 outline-none flex-1"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {SEVERITIES.map((s) => (
            <button
              key={s}
              onClick={() => setSeverityFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                severityFilter === s
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
              <tr>
                <th className="px-5 py-3.5">Log ID</th>
                <th className="px-5 py-3.5">Timestamp</th>
                <th className="px-5 py-3.5">Severity</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Actor / User</th>
                <th className="px-5 py-3.5">Action Performed</th>
                <th className="px-5 py-3.5">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredLogs.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3 font-mono font-bold text-slate-700">{l.id}</td>
                  <td className="px-5 py-3 text-slate-500 whitespace-nowrap">{l.timestamp}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase ${getSeverityBadge(l.severity)}`}>
                      {l.severity}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold border border-slate-200">
                      {l.category}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-slate-900 font-semibold block">{l.actor}</span>
                    <span className="text-[10px] text-slate-400 capitalize">{l.role}</span>
                  </td>
                  <td className="px-5 py-3 text-slate-800 max-w-xs">{l.action}</td>
                  <td className="px-5 py-3 font-mono text-slate-500 text-[11px]">{l.ipAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
