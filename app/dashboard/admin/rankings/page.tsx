'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Trophy, 
  ArrowLeft, 
  TrendingUp, 
  Award, 
  CheckCircle2, 
  BookOpen, 
  GraduationCap, 
  Globe,
  Sparkles
} from 'lucide-react';

export default function UniversityRankingsPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/admin/rankings')
      .then(res => res.json())
      .then(json => {
        if (json.success) setData(json.data);
      });
  }, []);

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-amber-900/40 via-yellow-900/30 to-slate-900/40 p-6 rounded-2xl border border-amber-500/20 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 text-amber-400 mb-1">
            <Link href="/dashboard/admin" className="flex items-center gap-1 hover:underline text-xs">
              <ArrowLeft className="w-3 h-3" /> Back to Admin Console
            </Link>
            <span className="text-slate-500">•</span>
            <span className="text-xs font-semibold uppercase tracking-wider">Institutional Benchmarking</span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-400" />
            University Ranking & NIRF / QS Benchmark Performance
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Institutional performance radar across Teaching (TLR), Research Output (RPC), Graduation Outcomes (GO), and Inclusivity (OI).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-900/80 border border-amber-500/30 px-4 py-2 rounded-2xl text-right">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">NIRF Overall Rank</div>
            <div className="text-2xl font-bold text-amber-400 flex items-center gap-1 justify-end">
              #{data?.overallRank || 24} <span className="text-xs text-emerald-400 font-semibold">(▲ 7 spots)</span>
            </div>
          </div>
        </div>
      </div>

      {data && (
        <>
          {/* Top Rank Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-1">
              <div className="text-xs text-slate-400">Engineering Category Rank</div>
              <div className="text-2xl font-bold text-white flex items-center gap-1.5">
                <Award className="w-5 h-5 text-amber-400" /> #{data.engineeringRank} in India
              </div>
              <div className="text-[11px] text-emerald-400">Top 1% Tier-1 Institutions</div>
            </div>

            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-1">
              <div className="text-xs text-slate-400">NAAC Grade Certification</div>
              <div className="text-2xl font-bold text-emerald-400">{data.naacAccreditation}</div>
              <div className="text-[11px] text-slate-400">Cycle 3 Accreditation valid till 2029</div>
            </div>

            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-1">
              <div className="text-xs text-slate-400">QS Asia University Band</div>
              <div className="text-2xl font-bold text-cyan-400 flex items-center gap-1.5">
                <Globe className="w-5 h-5 text-cyan-400" /> {data.qsAsiaRankEstimate}
              </div>
              <div className="text-[11px] text-slate-400">Internationalization Score Rising</div>
            </div>
          </div>

          {/* NIRF Parameters Grid */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white">NIRF 5-Pillar Score Breakdown</h2>
                <p className="text-xs text-slate-400">Total Composite Score: <strong className="text-amber-400">{data.totalScore} / 100</strong></p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.parameters?.map((p: any) => {
                const pct = Math.round((p.score / p.maxScore) * 100);
                return (
                  <div key={p.code} className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                        {p.code} (Weight: {p.weight}%)
                      </span>
                      <span className="text-sm font-bold text-white">
                        {p.score} / {p.maxScore} Pts
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-200">{p.title}</h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{p.details}</p>
                    </div>

                    <div className="space-y-1 pt-1">
                      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-amber-400 h-full rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
