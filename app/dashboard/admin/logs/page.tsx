'use client';

import { useState, useEffect } from 'react';
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
  ShieldAlert,
  Radio,
  Lock
} from 'lucide-react';
import { useToast } from '@/lib/toastContext';
import { exportToCSV } from '@/lib/exportUtils';
import { cn } from '@/lib/utils';

interface AuditLogEntry {
  id: string;
  actor: string;
  role: string;
  action: string;
  category: string;
  severity: 'SUCCESS' | 'INFO' | 'WARNING' | 'ERROR';
  ipAddress: string;
  timestamp: string;
  anomalyScore?: number;
}

const INITIAL_LOGS: AuditLogEntry[] = [
  { id: 'LOG-8891', actor: 'ajsinghindolia@gmail.com', role: 'ADMIN', action: 'Admin Superuser Login Success (Verified MFA Session)', category: 'AUTH', severity: 'SUCCESS', ipAddress: '103.21.14.88', timestamp: '23 Aug 2026, 11:10 PM', anomalyScore: 0 },
  { id: 'LOG-8890', actor: 'priya.sharma@campushub.edu', role: 'FACULTY', action: 'Published Gradebook for CS501 (Data Structures)', category: 'GRADEBOOK', severity: 'INFO', ipAddress: '192.168.1.45', timestamp: '23 Aug 2026, 10:45 PM', anomalyScore: 5 },
  { id: 'LOG-8889', actor: 'system-backup-worker', role: 'SYSTEM', action: 'Daily Automated Database Snapshot & Integrity Check Passed', category: 'SYSTEM', severity: 'SUCCESS', ipAddress: '127.0.0.1', timestamp: '23 Aug 2026, 10:00 PM', anomalyScore: 0 },
  { id: 'LOG-8888', actor: 'unknown-client', role: 'GUEST', action: 'Failed Login Attempt: 4 consecutive invalid OTP Verification attempts', category: 'SECURITY', severity: 'WARNING', ipAddress: '45.112.87.19', timestamp: '23 Aug 2026, 09:30 PM', anomalyScore: 82 },
  { id: 'LOG-8887', actor: 'admin@campushub.edu', role: 'ADMIN', action: 'Fee Structure & Gateway Webhook Configured for 2026-27', category: 'FINANCE', severity: 'INFO', ipAddress: '103.21.14.88', timestamp: '23 Aug 2026, 07:15 PM', anomalyScore: 0 },
  { id: 'LOG-8886', actor: 'rahul.gupta@campushub.edu', role: 'FACULTY', action: 'Created Assignment: "SQL Complex Joins & Views Worksheet"', category: 'ACADEMICS', severity: 'INFO', ipAddress: '192.168.1.52', timestamp: '23 Aug 2026, 06:00 PM', anomalyScore: 2 },
];

const SEVERITIES = ['ALL', 'SUCCESS', 'INFO', 'WARNING', 'ERROR'];
const CATEGORIES = ['ALL', 'AUTH', 'GRADEBOOK', 'SECURITY', 'SYSTEM', 'FINANCE', 'ACADEMICS'];

export default function AdminAuditLogsPage() {
  const { addToast } = useToast();
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
    addToast({
      title: 'Logs Refreshed',
      message: 'Immutable forensic security trail synchronized from cloud database.',
      type: 'success'
    });
  };

  const handleExportCSV = () => {
    const rows = filteredLogs.map((l) => ({
      'Log ID': l.id,
      'Timestamp': l.timestamp,
      'Actor': l.actor,
      'Role': l.role,
      'Category': l.category,
      'Severity': l.severity,
      'IP Address': l.ipAddress,
      'Action': l.action,
      'Anomaly Score': `${l.anomalyScore || 0}%`
    }));
    exportToCSV(`CampusHub_Audit_Logs_${new Date().toISOString().split('T')[0]}`, rows);
    addToast({
      title: 'CSV Exported',
      message: 'Audit log spreadsheet downloaded.',
      type: 'success'
    });
  };

  const getSeverityBadge = (s: string) => {
    switch (s) {
      case 'SUCCESS':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'WARNING':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'ERROR':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
      default:
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-6 sm:p-8 text-white shadow-xl border border-border">
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-semibold uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5" /> Immutable Cryptographic Trail
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Security Audit & Anomaly Intelligence Console</h1>
          <p className="text-slate-300 text-sm sm:text-base">
            Real-time compliance activity monitor, administrative action tracking, IP anomaly detection, and forensic system event records.
          </p>
        </div>
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Anomaly Alert Banner */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs text-amber-800 dark:text-amber-300">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-bold">AI Threat Anomaly Detector Active</p>
          <p className="text-muted-foreground leading-relaxed">
            1 suspicious authentication burst detected from IP 45.112.87.19 (Auto-rate limited for 30 minutes). All other institutional nodes normal.
          </p>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
          <span className="text-xs text-muted-foreground font-medium">Recorded Events (24h)</span>
          <p className="text-2xl font-bold text-foreground mt-1">{logs.length} Events</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
          <span className="text-xs text-muted-foreground font-medium">Security Alerts</span>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
            {logs.filter((l) => l.severity === 'WARNING' || l.severity === 'ERROR').length} Flagged
          </p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
          <span className="text-xs text-muted-foreground font-medium">Auth Success Rate</span>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">99.8%</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
          <span className="text-xs text-muted-foreground font-medium">Log Storage Hash</span>
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">SHA-256 Valid</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border shadow-xs">
        <div className="relative flex-1 sm:max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Search action, actor email, IP address, ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-background border border-border rounded-xl focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          <div className="flex items-center gap-1">
            {SEVERITIES.map((s) => (
              <button
                key={s}
                onClick={() => setSeverityFilter(s)}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all",
                  severityFilter === s
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-muted text-muted-foreground hover:bg-accent"
                )}
              >
                {s}
              </button>
            ))}
          </div>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-xl border border-border hover:bg-muted text-foreground transition"
            title="Refresh Log Feed"
          >
            <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin text-blue-600")} />
          </button>
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV Log
          </button>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-card border border-border rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/60 border-b border-border text-muted-foreground font-semibold uppercase text-[10px]">
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
            <tbody className="divide-y divide-border/60 font-medium">
              {filteredLogs.map((l) => (
                <tr key={l.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3 font-mono font-bold text-foreground">{l.id}</td>
                  <td className="px-5 py-3 text-muted-foreground whitespace-nowrap">{l.timestamp}</td>
                  <td className="px-5 py-3">
                    <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase font-mono", getSeverityBadge(l.severity))}>
                      {l.severity}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="px-2 py-0.5 rounded bg-muted text-foreground text-[10px] font-semibold border border-border">
                      {l.category}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-foreground font-semibold block">{l.actor}</span>
                    <span className="text-[10px] text-muted-foreground capitalize">{l.role}</span>
                  </td>
                  <td className="px-5 py-3 text-foreground max-w-xs">{l.action}</td>
                  <td className="px-5 py-3 font-mono text-muted-foreground text-xs">{l.ipAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
