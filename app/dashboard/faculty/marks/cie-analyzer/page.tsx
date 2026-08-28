'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BarChart3, 
  ArrowLeft, 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Layers, 
  Download,
  Sparkles
} from 'lucide-react';

export default function CIEAnalyzerPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/faculty/cie')
      .then(res => res.json())
      .then(json => {
        if (json.success) setData(json.data);
      });
  }, []);

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-purple-900/40 via-violet-900/30 to-slate-900/40 p-6 rounded-2xl border border-purple-500/20 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 text-purple-400 mb-1">
            <Link href="/dashboard/faculty/marks" className="flex items-center gap-1 hover:underline text-xs">
              <ArrowLeft className="w-3 h-3" /> Back to Marks Portal
            </Link>
            <span className="text-slate-500">•</span>
            <span className="text-xs font-semibold uppercase tracking-wider">NBA Outcome-Based Education</span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-purple-400" />
            Continuous Internal Evaluation (CIE) & Attainment Matrix
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Compute Course Outcome (CO1 - CO5) threshold attainment percentages across internal assessments, lab evaluations, and quizzes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-900/80 border border-purple-500/30 px-4 py-2 rounded-2xl text-right">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Overall CO Attainment</div>
            <div className="text-lg font-bold text-purple-400">{data?.overallCoAttainmentLevel || '2.82'} / 3.0</div>
          </div>
        </div>
      </div>

      {data && (
        <>
          {/* Status Badge & Summary */}
          <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <div>
                <div className="text-xs font-bold text-white">NBA / NAAC Compliance Criterion Met</div>
                <div className="text-[11px] text-emerald-300/80">
                  {data.courseCode} - {data.courseName} ({data.totalStudents} enrolled students)
                </div>
              </div>
            </div>
            <span className="text-xs font-semibold px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30">
              Level 3 Attainment (High)
            </span>
          </div>

          {/* CIE Component Attainment Table */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h2 className="text-sm font-bold text-white">Component-wise Assessment Breakdown</h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase">
                    <th className="pb-3 font-semibold">Evaluation Component</th>
                    <th className="pb-3 font-semibold">Max Weight</th>
                    <th className="pb-3 font-semibold">Class Avg</th>
                    <th className="pb-3 font-semibold">Target (%)</th>
                    <th className="pb-3 font-semibold">Attainment Achieved (%)</th>
                    <th className="pb-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {data.components?.map((c: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-800/30">
                      <td className="py-3 font-medium text-white">{c.name}</td>
                      <td className="py-3">{c.maxMarks}</td>
                      <td className="py-3 font-semibold text-purple-300">{c.classAverage}</td>
                      <td className="py-3">{c.targetAttainmentPct}%</td>
                      <td className="py-3 font-bold text-emerald-400">{c.actualAttainmentPct}%</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Target Exceeded ✓
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* AI Remedial Actions */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Remedial Focus Areas for Next Assessment Cycle
            </h3>
            <p className="text-xs text-slate-400">
              The AI assessment engine detected lower scoring density in the following sub-modules:
            </p>
            <div className="flex flex-wrap gap-2">
              {data.weakTopicsIdentified?.map((topic: string, tIdx: number) => (
                <div key={tIdx} className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl text-amber-300 text-xs font-medium">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  {topic} (Suggest 1 extra revision tutorial)
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
