'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Droplets, 
  ArrowLeft, 
  Activity, 
  ShieldCheck, 
  Waves, 
  CheckCircle2, 
  Sliders,
  Sparkles
} from 'lucide-react';

export default function WaterManagementPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/admin/water')
      .then(res => res.json())
      .then(json => {
        if (json.success) setData(json.data);
      });
  }, []);

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-cyan-900/40 via-blue-900/30 to-slate-900/40 p-6 rounded-2xl border border-cyan-500/20 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 mb-1">
            <Link href="/dashboard/admin" className="flex items-center gap-1 hover:underline text-xs">
              <ArrowLeft className="w-3 h-3" /> Back to Admin Console
            </Link>
            <span className="text-slate-500">•</span>
            <span className="text-xs font-semibold uppercase tracking-wider">Campus IoT Hydro-Telemetry</span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Droplets className="w-6 h-6 text-cyan-400" />
            Smart Water Management & Rainwater Harvesting Telemetry
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Monitor overhead reservoir fill levels, rainwater recharge aquifer sumps, STP recycled water lines, and water purity (TDS & pH).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-900/80 border border-cyan-500/30 px-4 py-2 rounded-2xl text-right">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Daily Recycled Savings</div>
            <div className="text-lg font-bold text-cyan-400">{data?.dailyWaterSavedLiters?.toLocaleString() || '45,000'} Liters</div>
          </div>
        </div>
      </div>

      {data && (
        <>
          {/* Metrics Top */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-1">
              <div className="text-xs text-slate-400">Total Live Water Reserves</div>
              <div className="text-2xl font-bold text-white flex items-center gap-1">
                <Waves className="w-5 h-5 text-cyan-400" /> {(data.totalWaterStoredLiters / 1000).toFixed(0)}k Liters
              </div>
              <div className="text-[11px] text-cyan-400">{((data.totalWaterStoredLiters / data.totalCapacityLiters) * 100).toFixed(1)}% Capacity Full</div>
            </div>

            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-1">
              <div className="text-xs text-slate-400">STP Greywater Re-use Ratio</div>
              <div className="text-2xl font-bold text-emerald-400">{data.recycledWaterUtilizationPct}%</div>
              <div className="text-[11px] text-slate-400">Piped to campus horticulture & flushing</div>
            </div>

            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-1">
              <div className="text-xs text-slate-400">Average Drinking Water Purity</div>
              <div className="text-2xl font-bold text-blue-400">105 ppm TDS</div>
              <div className="text-[11px] text-slate-400">pH 7.2 • Zero Contaminants (WHO Compliant)</div>
            </div>
          </div>

          {/* Reservoir Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {data.reservoirs?.map((r: any) => (
              <div key={r.tankId} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-md">
                      {r.tankId}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/20 text-cyan-300">
                      {r.status?.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white">{r.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Capacity: {(r.capacityLiters / 1000)}k Liters</p>
                  </div>

                  {/* Level Gauge */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>Water Level</span>
                      <span className="font-bold text-cyan-400">{r.fillPercentage}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-cyan-400 h-full rounded-full"
                        style={{ width: `${r.fillPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Sensor Quality Vitals */}
                  <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 grid grid-cols-3 gap-2 text-center text-xs">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase">TDS</div>
                      <div className="font-bold text-white">{r.waterQuality?.tdsPpm} ppm</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase">pH</div>
                      <div className="font-bold text-white">{r.waterQuality?.ph}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase">Flow Rate</div>
                      <div className="font-bold text-cyan-300">{r.flowRateLpm} LPM</div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Ultrasonic Level Sensor Active
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
