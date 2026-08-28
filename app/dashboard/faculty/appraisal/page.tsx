'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Award, 
  ArrowLeft, 
  CheckCircle2, 
  FileCheck, 
  BookOpen, 
  Building2, 
  TrendingUp, 
  Plus, 
  Sparkles
} from 'lucide-react';

export default function FacultyAppraisalPage() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    fetch('/api/faculty/appraisal')
      .then(res => res.json())
      .then(json => {
        if (json.success) setProfile(json.data);
      });
  }, []);

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-amber-900/40 via-orange-900/30 to-slate-900/40 p-6 rounded-2xl border border-amber-500/20 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 text-amber-400 mb-1">
            <Link href="/dashboard/faculty" className="flex items-center gap-1 hover:underline text-xs">
              <ArrowLeft className="w-3 h-3" /> Back to Faculty Portal
            </Link>
            <span className="text-slate-500">•</span>
            <span className="text-xs font-semibold uppercase tracking-wider">UGC / CAS Academic Performance Indicator</span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-400" />
            Faculty Appraisal (PBAS / CAS) Portfolio & API Score
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Calculate your Performance Based Appraisal Scheme (PBAS) score across Teaching, Governance, and Scopus/SCI Research publications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-900/80 border border-amber-500/30 px-4 py-2 rounded-2xl text-right">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Claimed API Score</div>
            <div className="text-lg font-bold text-amber-400">{profile?.totalApiScoreClaimed || 285} / 300 Pts</div>
          </div>
        </div>
      </div>

      {profile && (
        <>
          {/* Eligibility Banner */}
          <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <div>
                <div className="text-xs font-bold text-white">Eligible for Career Advancement Scheme (CAS)</div>
                <div className="text-[11px] text-emerald-300/80">
                  Required: {profile.minimumApiRequiredForPromotion} Pts • Claimed: {profile.totalApiScoreClaimed} Pts • Target: {profile.targetPromotion}
                </div>
              </div>
            </div>
            <span className="text-xs font-semibold px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30">
              IQAC Ready ✓
            </span>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {profile.categories?.map((cat: any, idx: number) => (
              <div key={idx} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                      {cat.categoryNumber}
                    </span>
                    <span className="text-xs font-bold text-white">
                      {cat.claimedScore} / {cat.maxTargetScore} Pts
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white leading-snug">{cat.title}</h3>

                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    {cat.criteria?.map((cr: any, cIdx: number) => (
                      <div key={cIdx} className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between text-xs">
                        <span className="text-slate-300 pr-2">{cr.name}</span>
                        <span className="font-bold text-amber-400 shrink-0">+{cr.score}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-amber-400 h-full rounded-full"
                      style={{ width: `${Math.min(100, (cat.claimedScore / cat.maxTargetScore) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
