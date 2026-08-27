'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  CalendarDays, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowLeft, 
  Sparkles, 
  RefreshCw, 
  Layers, 
  Zap,
  Building2
} from 'lucide-react';

export default function TimetableOptimizerPage() {
  const [data, setData] = useState<any>(null);
  const [resolving, setResolving] = useState(false);
  const [resolvedMessage, setResolvedMessage] = useState<string | null>(null);

  const fetchTimetable = async () => {
    const res = await fetch('/api/admin/timetable');
    const json = await res.json();
    if (json.success) setData(json.data);
  };

  useEffect(() => {
    fetchTimetable();
  }, []);

  const handleAutoResolve = async () => {
    setResolving(true);
    try {
      const res = await fetch('/api/admin/timetable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'AUTO_RESOLVE' })
      });
      const json = await res.json();
      if (json.success) {
        setResolvedMessage(json.message);
        fetchTimetable();
      }
    } finally {
      setResolving(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900/40 p-6 rounded-2xl border border-indigo-500/20 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 mb-1">
            <Link href="/dashboard/admin" className="flex items-center gap-1 hover:underline text-xs">
              <ArrowLeft className="w-3 h-3" /> Back to Admin
            </Link>
            <span className="text-slate-500">•</span>
            <span className="text-xs font-semibold uppercase tracking-wider">Academic Operations</span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-indigo-400" />
            AI Timetable Conflict Resolver & Classroom Optimizer
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Detect professor double-booking collisions, classroom capacity deficits, and run automated integer linear programming (ILP) solvers.
          </p>
        </div>

        <button
          onClick={handleAutoResolve}
          disabled={resolving || (data && data.activeConflicts.length === 0)}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl transition shadow-lg shadow-indigo-600/20 disabled:opacity-50 cursor-pointer self-start md:self-auto"
        >
          {resolving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          Run AI Collision Solver
        </button>
      </div>

      {data && (
        <>
          {/* Top Counters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">Total Lectures Scheduled</span>
              <div className="text-2xl font-bold text-white">{data.totalWeeklyLectures} Classes/Wk</div>
              <span className="text-[11px] text-slate-400">Across 8 Engineering Departments</span>
            </div>

            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">Classroom Space Utilization</span>
              <div className="text-2xl font-bold text-emerald-400">{data.roomUtilizationPercent}%</div>
              <span className="text-[11px] text-slate-400">Optimized across 42 lecture halls</span>
            </div>

            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">Active Collision Flags</span>
              <div className={`text-2xl font-bold ${data.activeConflicts.length > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {data.activeConflicts.length} Detected
              </div>
              <span className="text-[11px] text-slate-400">
                {data.activeConflicts.length > 0 ? 'Requires solver optimization' : 'Zero timetable clashes'}
              </span>
            </div>
          </div>

          {resolvedMessage && (
            <div className="p-4 bg-emerald-950/40 rounded-xl border border-emerald-500/30 flex items-center gap-3 text-xs text-emerald-300">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{resolvedMessage}</span>
            </div>
          )}

          {/* Conflict List */}
          <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-indigo-400" /> Constraint Satisfaction & Collision Inspector
            </h3>

            {data.activeConflicts.length > 0 ? (
              <div className="space-y-4">
                {data.activeConflicts.map((conf: any) => (
                  <div
                    key={conf.id}
                    className="p-5 bg-slate-950/60 rounded-xl border border-rose-500/30 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-rose-400 px-2 py-0.5 bg-slate-850 rounded">
                          {conf.id}
                        </span>
                        <span className="text-xs font-bold text-rose-400">{conf.severity}</span>
                      </div>
                      <span className="text-xs text-slate-400 font-mono">Overlap Collision</span>
                    </div>

                    <p className="text-xs text-slate-200">{conf.description}</p>

                    <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800 text-xs text-indigo-300">
                      <span className="font-semibold text-indigo-400 block mb-0.5">AI Proposed Resolution:</span>
                      <p>{conf.resolutionSuggestion}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-slate-400 text-xs flex flex-col items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-3" />
                <h4 className="text-sm font-bold text-white">Timetable Schedule is 100% Conflict-Free</h4>
                <p className="text-slate-500 max-w-sm mt-1">
                  All room allocations, professor availability constraints, and lab session buffers satisfy the timetable matrix.
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
