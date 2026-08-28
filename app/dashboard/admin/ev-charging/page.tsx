'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Zap, 
  BatteryCharging, 
  ArrowLeft, 
  Leaf, 
  Activity, 
  CheckCircle2, 
  RefreshCw, 
  Power,
  Sparkles
} from 'lucide-react';

export default function EVChargingGridPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/admin/ev-charging')
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
              <ArrowLeft className="w-3 h-3" /> Back to Admin Console
            </Link>
            <span className="text-slate-500">•</span>
            <span className="text-xs font-semibold uppercase tracking-wider">Clean Campus Mobility Grid</span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <BatteryCharging className="w-6 h-6 text-emerald-400" />
            Campus Fleet Management & EV Charging Station Grid
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time OCPP 2.0.1 charger telemetry, campus e-shuttle depot battery health, and solar microgrid load balancing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-900/80 border border-emerald-500/30 px-4 py-2 rounded-2xl text-right">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Today's CO2 Avoided</div>
            <div className="text-lg font-bold text-emerald-400">{data?.co2SavedKgToday || 856} kg CO2e</div>
          </div>
        </div>
      </div>

      {data && (
        <>
          {/* Metrics Top */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-1">
              <div className="text-xs text-slate-400">Total Live Grid Power Draw</div>
              <div className="text-2xl font-bold text-white flex items-center gap-1">
                <Zap className="w-5 h-5 text-amber-400" /> {data.totalLiveDrawKw.toFixed(1)} kW
              </div>
              <div className="text-[11px] text-emerald-400">{data.solarOffsetPercentage}% Solar Powered</div>
            </div>

            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-1">
              <div className="text-xs text-slate-400">Total Energy Delivered Today</div>
              <div className="text-2xl font-bold text-teal-400">{data.totalKwhDelivered.toFixed(1)} kWh</div>
              <div className="text-[11px] text-slate-400">Across 26 active charging bays</div>
            </div>

            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-1">
              <div className="text-xs text-slate-400">Active EV Charging Hubs</div>
              <div className="text-2xl font-bold text-white">{data.stations?.length} Locations</div>
              <div className="text-[11px] text-emerald-400">100% OCPP Connectivity</div>
            </div>

            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-1">
              <div className="text-xs text-slate-400">E-Shuttle Fleet State</div>
              <div className="text-2xl font-bold text-blue-400">8 / 8 Active</div>
              <div className="text-[11px] text-slate-400">Scheduled campus shuttle route</div>
            </div>
          </div>

          {/* Stations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {data.stations?.map((st: any) => (
              <div key={st.stationId} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                      {st.stationId}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300">
                      {st.status?.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white">{st.location}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{st.chargerType}</p>
                  </div>

                  <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Active Ports In Use:</span>
                      <span className="font-bold text-white">{st.activePorts} / {st.totalPorts} Ports</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Current Power Draw:</span>
                      <span className="font-bold text-amber-400">{st.currentPowerDrawKw} kW</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Today's Dispensed Energy:</span>
                      <span className="font-bold text-teal-300">{st.todayEnergyDeliveredKwh} kWh</span>
                    </div>
                  </div>
                </div>

                <button className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" /> View Live OCPP Packet Trace
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
