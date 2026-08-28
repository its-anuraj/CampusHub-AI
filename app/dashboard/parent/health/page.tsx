'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  HeartPulse, 
  ArrowLeft, 
  ShieldCheck, 
  CheckCircle2, 
  Activity, 
  Pill, 
  PhoneCall, 
  AlertCircle, 
  Calendar,
  Sparkles
} from 'lucide-react';

export default function StudentHealthRecordPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/parent/health')
      .then(res => res.json())
      .then(json => {
        if (json.success) setData(json.data);
      });
  }, []);

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-rose-900/40 via-pink-900/30 to-slate-900/40 p-6 rounded-2xl border border-rose-500/20 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 text-rose-400 mb-1">
            <Link href="/dashboard/parent" className="flex items-center gap-1 hover:underline text-xs">
              <ArrowLeft className="w-3 h-3" /> Back to Parent Portal
            </Link>
            <span className="text-slate-500">•</span>
            <span className="text-xs font-semibold uppercase tracking-wider">Campus Wellness & Medical Logs</span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <HeartPulse className="w-6 h-6 text-rose-400" />
            Student Healthcare, Medical History & Clinic Logs
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time transparency on campus dispensary checkups, doctor consultations, vitals, prescribed medicines, and institutional health insurance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-900/80 border border-rose-500/30 px-4 py-2 rounded-2xl text-right">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Campus Insurance Cover</div>
            <div className="text-lg font-bold text-rose-400">₹{data?.insuranceCoverageInr?.toLocaleString() || '2,00,000'} / yr</div>
          </div>
        </div>
      </div>

      {data && (
        <>
          {/* Medical Identity Card */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-1">
              <div className="text-xs text-slate-400">Student Blood Group</div>
              <div className="text-xl font-bold text-rose-400">{data.bloodGroup}</div>
              <div className="text-[10px] text-slate-400">Verified by Medical Center</div>
            </div>

            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-1">
              <div className="text-xs text-slate-400">Known Allergies</div>
              <div className="text-sm font-bold text-amber-400">{data.allergies?.join(', ')}</div>
              <div className="text-[10px] text-slate-400">Red-flagged in dispensary EHR</div>
            </div>

            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-1">
              <div className="text-xs text-slate-400">Emergency Parent Hotline</div>
              <div className="text-sm font-bold text-white">{data.emergencyContact}</div>
              <div className="text-[10px] text-emerald-400">Primary Contact Linked</div>
            </div>

            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-1">
              <div className="text-xs text-slate-400">Cashless Insurance Policy</div>
              <div className="text-xs font-mono font-bold text-cyan-400">{data.campusHealthInsurancePolicy}</div>
              <div className="text-[10px] text-slate-400">Star Health Institutional Tie-up</div>
            </div>
          </div>

          {/* Consultation Records */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-white">Dispensary Consultation History</h2>
            <div className="grid grid-cols-1 gap-4">
              {data.visits?.map((v: any) => (
                <div key={v.visitId} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all space-y-4">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-md">
                          {v.visitId}
                        </span>
                        <span className="text-xs text-slate-400">{v.date}</span>
                      </div>
                      <h3 className="text-base font-bold text-white">{v.diagnosis}</h3>
                      <div className="text-xs text-slate-300">Consultant: <strong className="text-slate-200">{v.doctorName}</strong></div>
                    </div>

                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-semibold self-start shrink-0">
                      {v.status?.replace(/_/g, ' ')}
                    </span>
                  </div>

                  {/* Vitals */}
                  <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase">Blood Pressure</div>
                      <div className="font-bold text-white">{v.vitals?.bp}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase">Pulse Rate</div>
                      <div className="font-bold text-rose-400">{v.vitals?.pulseBpm} bpm</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase">Blood Oxygen (SpO2)</div>
                      <div className="font-bold text-emerald-400">{v.vitals?.spo2Pct}%</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase">Body Temp</div>
                      <div className="font-bold text-amber-300">{v.vitals?.tempF}</div>
                    </div>
                  </div>

                  {/* Prescribed Medications */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Pill className="w-3.5 h-3.5 text-rose-400" /> Prescribed Medications:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {v.prescriptions?.map((p: any, pIdx: number) => (
                        <div key={pIdx} className="bg-slate-800/40 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-300">
                          <div className="font-bold text-white">{p.medicine}</div>
                          <div className="text-[11px] text-slate-400">{p.dosage} • {p.foodInstruction}</div>
                        </div>
                      ))}
                    </div>
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
