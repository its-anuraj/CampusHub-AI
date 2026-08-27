'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  HeartHandshake, 
  Award, 
  Building2, 
  ArrowLeft, 
  Users, 
  CheckCircle2, 
  Sparkles,
  TrendingUp
} from 'lucide-react';

export default function EndowmentPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/admin/endowment')
      .then(res => res.json())
      .then(json => {
        if (json.success) setData(json.data);
      });
  }, []);

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-emerald-900/40 via-teal-900/30 to-slate-900/40 p-6 rounded-2xl border border-emerald-500/20 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 mb-1">
            <Link href="/dashboard/admin" className="flex items-center gap-1 hover:underline text-xs">
              <ArrowLeft className="w-3 h-3" /> Back to Admin
            </Link>
            <span className="text-slate-500">•</span>
            <span className="text-xs font-semibold uppercase tracking-wider">Institutional Advancement</span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <HeartHandshake className="w-6 h-6 text-emerald-400" />
            Alumni Endowment Fund & Research Grant Manager
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Institutional corpus fund allocation, alumni donor stewardship, and student merit fellowship disbursements.
          </p>
        </div>
      </div>

      {data && (
        <>
          {/* Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">Total Corpus Fund</span>
              <div className="text-2xl font-bold text-white">
                ₹{(data.totalCorpusRaisedInr / 10000000).toFixed(2)} Cr
              </div>
              <span className="text-[11px] text-emerald-400">Anchored in university endowment trust</span>
            </div>

            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">Annual Scholarships Disbursed</span>
              <div className="text-2xl font-bold text-emerald-400">
                ₹{(data.annualScholarshipsDisbursedInr / 10000000).toFixed(2)} Cr
              </div>
              <span className="text-[11px] text-slate-400">Direct benefit transfer (DBT)</span>
            </div>

            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">Student Scholars Funded</span>
              <div className="text-2xl font-bold text-white">{data.activeStudentBeneficiaries} Scholars</div>
              <span className="text-[11px] text-emerald-400">100% Tuition & Research covered</span>
            </div>

            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">Alumni Donors Network</span>
              <div className="text-2xl font-bold text-teal-400">{data.donorsCount} Donors</div>
              <span className="text-[11px] text-slate-400">Global Chapter Support</span>
            </div>
          </div>

          {/* Featured Grants Table */}
          <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" /> Departmental Endowment Grants & Fellowships
            </h3>

            <div className="divide-y divide-slate-800">
              {data.featuredGrants.map((gr: any) => (
                <div key={gr.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-bold text-emerald-400 px-2 py-0.5 bg-slate-800 rounded">
                        {gr.id}
                      </span>
                      <h4 className="text-sm font-bold text-white">{gr.name}</h4>
                    </div>

                    <p className="text-xs text-slate-400">
                      Department: <b className="text-slate-300">{gr.department}</b> • Supporting{' '}
                      <b className="text-emerald-400">{gr.studentsSupported} undergraduate scholars</b>
                    </p>
                  </div>

                  <div className="text-left md:text-right">
                    <span className="text-sm font-mono font-bold text-white">
                      ₹{(gr.corpusInr / 10000000).toFixed(2)} Crores
                    </span>
                    <span className="text-[11px] text-emerald-400 block">Endowed in perpetuity</span>
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
