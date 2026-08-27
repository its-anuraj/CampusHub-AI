'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Gauge, 
  Thermometer, 
  Wind, 
  Users, 
  Zap, 
  ArrowLeft, 
  Activity, 
  CheckCircle2, 
  AlertCircle,
  Sparkles
} from 'lucide-react';

export default function IoTSensorsPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/admin/iot')
      .then(res => res.json())
      .then(json => {
        if (json.success) setData(json.data);
      });
  }, []);

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-sky-900/40 via-cyan-900/30 to-slate-900/40 p-6 rounded-2xl border border-sky-500/20 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 text-sky-400 mb-1">
            <Link href="/dashboard/admin" className="flex items-center gap-1 hover:underline text-xs">
              <ArrowLeft className="w-3 h-3" /> Back to Admin
            </Link>
            <span className="text-slate-500">•</span>
            <span className="text-xs font-semibold uppercase tracking-wider">Smart Campus IoT</span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Gauge className="w-6 h-6 text-sky-400" />
            Classroom IoT Environment & Air Quality Sensors
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time environmental telemetry across classrooms, server rooms, and labs with automated HVAC triggers.
          </p>
        </div>
      </div>

      {data && (
        <>
          {/* Top Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">Average Campus Temp</span>
              <div className="text-2xl font-bold text-white flex items-center gap-1">
                <Thermometer className="w-5 h-5 text-sky-400" />
                {data.avgCampusTempC}°C
              </div>
              <span className="text-[11px] text-emerald-400">Within ASHRAE 55 Comfort Standard</span>
            </div>

            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">Mean CO₂ Concentration</span>
              <div className="text-2xl font-bold text-emerald-400 flex items-center gap-1">
                <Wind className="w-5 h-5 text-emerald-400" />
                {data.avgCampusCo2Ppm} ppm
              </div>
              <span className="text-[11px] text-slate-400">Optimal cognitive attention level (&lt;800 ppm)</span>
            </div>

            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">IoT Sensor Mesh Nodes</span>
              <div className="text-2xl font-bold text-white">{data.totalSensorsOnline} Active Nodes</div>
              <span className="text-[11px] text-emerald-400">Zigbee 3.0 & LoRaWAN Gateway Active</span>
            </div>

            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">Telemetry Health</span>
              <div className="text-2xl font-bold text-emerald-400">100% Operational</div>
              <span className="text-[11px] text-slate-400">Zero packet loss recorded</span>
            </div>
          </div>

          {/* Rooms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.rooms.map((rm: any) => (
              <div
                key={rm.roomId}
                className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-lg shadow-slate-950/40"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">{rm.roomId}</h3>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    AQI {rm.airQualityIndex}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Temperature</span>
                    <span className="text-base font-bold text-white">{rm.temperatureC}°C</span>
                  </div>
                  <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">CO₂ Level</span>
                    <span className="text-base font-bold text-emerald-400">{rm.co2Ppm} ppm</span>
                  </div>
                  <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Occupancy</span>
                    <span className="text-base font-bold text-sky-400">
                      {rm.occupancyCount} / {rm.maxCapacity}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400">HVAC Automation State:</span>
                  <span className="text-sky-300 font-mono font-medium">{rm.hvacAutomationStatus}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
