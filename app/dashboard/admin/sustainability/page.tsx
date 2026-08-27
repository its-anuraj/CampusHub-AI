'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Leaf, 
  Sun, 
  Droplets, 
  Zap, 
  ArrowLeft, 
  TrendingUp, 
  Building2, 
  TreePine,
  Sparkles
} from 'lucide-react';

export default function SustainabilityDashboardPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/admin/sustainability')
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
            <span className="text-xs font-semibold uppercase tracking-wider">Green Campus IoT</span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Leaf className="w-6 h-6 text-emerald-400" />
            Campus Sustainability & Real-Time Carbon Telemetry
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Live rooftop solar array power output, campus water recycling indices, and building-wise net zero energy auditing.
          </p>
        </div>
      </div>

      {data && (
        <>
          {/* Metrics Top Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Solar Power Generated</span>
                <Sun className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-bold text-white">{data.solarGenerationTodayKwh} kWh</div>
              <span className="text-[11px] text-emerald-400 font-medium">750 kW Rooftop Array</span>
            </div>

            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">CO₂ Avoided Today</span>
                <Leaf className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-emerald-400">{data.carbonOffsetKgToday} kg</div>
              <span className="text-[11px] text-slate-400">Equivalent to {data.treesPlantedEquivalent} trees</span>
            </div>

            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">STP Recycled Water</span>
                <Droplets className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-bold text-cyan-400">{data.waterRecycledLitersToday} L</div>
              <span className="text-[11px] text-slate-400">Gardens & Flush systems</span>
            </div>

            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Grid Import</span>
                <Zap className="w-4 h-4 text-rose-400" />
              </div>
              <div className="text-2xl font-bold text-slate-200">{data.gridImportKwh} kWh</div>
              <span className="text-[11px] text-emerald-400 font-medium">74% Clean Self-Sufficiency</span>
            </div>
          </div>

          {/* Building Energy Audit Table */}
          <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-400" /> Building-Wise Net Zero Energy Status
            </h3>

            <div className="divide-y divide-slate-800">
              {data.buildingEfficiency.map((b: any) => (
                <div key={b.buildingName} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-white">{b.buildingName}</h4>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                      <span>Solar: <b className="text-emerald-400">{b.solarGeneratedKwh} kWh</b></span>
                      <span>•</span>
                      <span>Demand: <b className="text-slate-200">{b.powerConsumedKwh} kWh</b></span>
                    </div>
                  </div>

                  <span
                    className={`text-xs font-mono font-bold px-3 py-1 rounded-full self-start sm:self-auto ${
                      b.netZeroStatus.includes('POSITIVE')
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {b.netZeroStatus}
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
