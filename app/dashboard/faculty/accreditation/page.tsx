'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Target, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowLeft, 
  Award, 
  BarChart3, 
  Layers, 
  BookOpen,
  Sparkles
} from 'lucide-react';

export default function AccreditationPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/faculty/accreditation')
      .then(res => res.json())
      .then(json => {
        if (json.success) setData(json.data);
      });
  }, []);

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-teal-900/40 via-emerald-900/30 to-slate-900/40 p-6 rounded-2xl border border-teal-500/20 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 text-teal-400 mb-1">
            <Link href="/dashboard/faculty" className="flex items-center gap-1 hover:underline text-xs">
              <ArrowLeft className="w-3 h-3" /> Back to Faculty Desk
            </Link>
            <span className="text-slate-500">•</span>
            <span className="text-xs font-semibold uppercase tracking-wider">Quality Assurance</span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Target className="w-6 h-6 text-teal-400" />
            NBA & NAAC Accreditation & Course Outcome Radar
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Track Program Outcomes (PO1 - PO12) attainment, Course Outcome (CO) mapping, and continuous quality improvement.
          </p>
        </div>
      </div>

      {data && (
        <>
          {/* Summary Banner */}
          <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-white">{data.program}</span>
            <span className="text-xs text-teal-400 font-mono font-medium">{data.academicYear}</span>
          </div>

          {/* Program Outcomes Table */}
          <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-teal-400" /> Program Outcome (PO) Attainment Matrix
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.programOutcomes.map((po: any) => (
                <div
                  key={po.code}
                  className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-teal-400 px-2 py-0.5 bg-slate-800 rounded">
                        {po.code}
                      </span>
                      <h4 className="text-xs font-bold text-white">{po.title}</h4>
                    </div>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        po.status === 'EXCEEDED'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : po.status === 'ATTAINED'
                          ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {po.status}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Target: {po.targetPercent}%</span>
                      <span className="text-white font-mono font-semibold">Attained: {po.attainedPercent}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          po.attainedPercent >= po.targetPercent ? 'bg-teal-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${po.attainedPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Course Outcome Progress */}
          <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-teal-400" /> Active Course Attainment Indices (Scale 1.0 - 3.0)
            </h3>

            <div className="divide-y divide-slate-800">
              {data.courseOutcomesProgress.map((co: any) => (
                <div key={co.courseCode} className="py-3.5 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">
                      {co.courseCode} - {co.courseName}
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      {co.coCount} Formatted Course Outcomes • Syllabus Completion: {co.syllabusCoveredPercent}%
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-mono font-bold text-teal-400">
                      {co.attainmentScore} / {co.maxScore}
                    </span>
                    <span className="text-[10px] text-slate-500 block">NBA Attainment Level 3</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
