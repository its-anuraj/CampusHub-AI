'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  MapPin, 
  Clock, 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles, 
  Navigation,
  Building
} from 'lucide-react';

export default function ParentSafetyPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/parent/safety')
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
            <Link href="/dashboard/parent" className="flex items-center gap-1 hover:underline text-xs">
              <ArrowLeft className="w-3 h-3" /> Back to Parent Desk
            </Link>
            <span className="text-slate-500">•</span>
            <span className="text-xs font-semibold uppercase tracking-wider">Campus Geofence & Safety</span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            Student Campus Safety & Real-Time Check-In Timeline
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Instant geofence telemetry, hostel turnstile logs, library access timestamps, and automatic curfew compliance alerts.
          </p>
        </div>
      </div>

      {data && (
        <>
          {/* Status Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">Current Location Status</span>
              <div className="text-base font-bold text-emerald-400 flex items-center gap-1.5 mt-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                {data.currentLocationStatus}
              </div>
              <span className="text-[11px] text-slate-500">Verified via residential biometric reader</span>
            </div>

            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">Hostel Curfew Compliance</span>
              <div className="text-base font-bold text-white flex items-center gap-1.5 mt-1">
                <Clock className="w-4 h-4 text-emerald-400" />
                Curfew: {data.curfewTime} ({data.curfewComplianceStatus})
              </div>
              <span className="text-[11px] text-emerald-400 font-medium">Checked in safely at 08:15 PM</span>
            </div>

            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">Campus Perimeter Geofence</span>
              <div className="text-base font-bold text-teal-400 flex items-center gap-1.5 mt-1">
                <Navigation className="w-4 h-4 text-teal-400" />
                Inside Verified Perimeter
              </div>
              <span className="text-[11px] text-slate-500">180-Acre Smart Campus Zone</span>
            </div>
          </div>

          {/* Timeline Feed */}
          <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" /> Daily Campus Check-in Timeline for {data.studentName}
            </h3>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
              {data.timeline.map((item: any) => (
                <div key={item.id} className="relative space-y-1">
                  <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-slate-950" />

                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white">{item.location}</h4>
                    <span className="text-xs font-mono text-emerald-400">{item.timestamp}</span>
                  </div>

                  <p className="text-[11px] text-slate-400">
                    Authentication Node: <span className="text-slate-300">{item.verifiedBy}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
