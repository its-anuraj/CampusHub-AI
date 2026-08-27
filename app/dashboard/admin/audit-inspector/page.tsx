'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldAlert, 
  Search, 
  ArrowLeft, 
  Lock, 
  UserCheck, 
  Activity, 
  CheckCircle2, 
  Sparkles,
  AlertTriangle
} from 'lucide-react';

export default function AuditInspectorPage() {
  const [data, setData] = useState<any>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/admin/audit-logs')
      .then(res => res.json())
      .then(json => {
        if (json.success) setData(json.data);
      });
  }, []);

  const filteredLogs = data?.logs.filter((l: any) =>
    l.actorEmail.toLowerCase().includes(search.toLowerCase()) ||
    l.action.toLowerCase().includes(search.toLowerCase()) ||
    l.ipAddress.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-red-950/40 via-slate-900 to-slate-900/40 p-6 rounded-2xl border border-rose-500/20 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 text-rose-400 mb-1">
            <Link href="/dashboard/admin" className="flex items-center gap-1 hover:underline text-xs">
              <ArrowLeft className="w-3 h-3" /> Back to Admin
            </Link>
            <span className="text-slate-500">•</span>
            <span className="text-xs font-semibold uppercase tracking-wider">Cyber Forensic Audit</span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-rose-400" />
            Forensic Security Audit & RBAC Permission Inspector
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Tamper-evident audit trail, Web Application Firewall (WAF) intrusion blocks, and privileged actor action logs.
          </p>
        </div>
      </div>

      {data && (
        <>
          {/* Top Security Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">Security Posture Score</span>
              <div className="text-2xl font-bold text-emerald-400">{data.securityScore}</div>
              <span className="text-[11px] text-slate-500">Zero open privilege escalation vectors</span>
            </div>

            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">WAF Intrusions Intercepted (24h)</span>
              <div className="text-2xl font-bold text-rose-400">{data.wafBlocks24h} Threats Blocked</div>
              <span className="text-[11px] text-slate-500">Automated IP rate limiting active</span>
            </div>

            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">Active Privileged Root Sessions</span>
              <div className="text-2xl font-bold text-white">{data.privilegedSessionsActive} Admins</div>
              <span className="text-[11px] text-emerald-400">2FA Verified via Hardware Token</span>
            </div>
          </div>

          {/* Search Filter */}
          <div className="flex items-center gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <Search className="w-4 h-4 text-slate-400 ml-2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search audit logs by actor email, action code or IP address..."
              className="w-full bg-transparent text-sm text-slate-200 placeholder-slate-500 focus:outline-none"
            />
          </div>

          {/* Logs Table */}
          <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-rose-400" /> Immutable Audit Event Trail
            </h3>

            <div className="divide-y divide-slate-800">
              {filteredLogs?.map((log: any) => (
                <div key={log.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-bold text-slate-300 px-2 py-0.5 bg-slate-800 rounded">
                        {log.id}
                      </span>
                      <span className="text-xs font-mono text-slate-400">{log.timestamp}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          log.actorRole === 'ADMIN'
                            ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                            : log.actorRole === 'FACULTY'
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {log.actorRole}
                      </span>
                    </div>

                    <h4 className="text-xs font-mono font-bold text-white mb-0.5">{log.action}</h4>
                    <p className="text-xs text-slate-400">
                      Actor: <span className="text-slate-300">{log.actorEmail}</span> • IP: <span className="text-slate-300 font-mono">{log.ipAddress}</span>
                    </p>
                  </div>

                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full self-start md:self-auto ${
                      log.status === 'AUTHORIZED'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}
                  >
                    {log.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
