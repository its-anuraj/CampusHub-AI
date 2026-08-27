'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Bike, 
  MapPin, 
  BatteryCharging, 
  Zap, 
  Leaf, 
  ArrowLeft, 
  CheckCircle, 
  QrCode, 
  RefreshCw,
  Navigation
} from 'lucide-react';

export default function CampusBikesPage() {
  const [stations, setStations] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [selectedStation, setSelectedStation] = useState<any>(null);
  const [activeSession, setActiveSession] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/transport/bikes')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStations(data.data.stations);
          setMetrics(data.data);
          if (data.data.stations.length > 0) {
            setSelectedStation(data.data.stations[0]);
          }
        }
      });
  }, []);

  const handleUnlockBike = async () => {
    if (!selectedStation) return;
    setLoading(true);
    try {
      const res = await fetch('/api/transport/bikes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stationId: selectedStation.id })
      });
      const data = await res.json();
      if (data.success) {
        setActiveSession(data.data);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-emerald-900/40 via-lime-900/30 to-slate-900/40 p-6 rounded-2xl border border-emerald-500/20 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 mb-1">
            <Link href="/dashboard/student/transport" className="flex items-center gap-1 hover:underline text-xs">
              <ArrowLeft className="w-3 h-3" /> Back to Transport
            </Link>
            <span className="text-slate-500">•</span>
            <span className="text-xs font-semibold uppercase tracking-wider">Green Mobility</span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Bike className="w-6 h-6 text-emerald-400" />
            Campus E-Cycle & Green Bike Sharing
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Eco-friendly campus transit network with zero-emission electric pedelecs and IoT automated docking hubs.
          </p>
        </div>

        {metrics && (
          <div className="flex items-center gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-emerald-400" />
              <div>
                <span className="text-xs text-slate-400 block">Carbon Saved</span>
                <span className="text-sm font-bold text-emerald-400">{metrics.co2SavedKg} kg CO₂</span>
              </div>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div>
              <span className="text-xs text-slate-400 block">Trips Today</span>
              <span className="text-sm font-bold text-white">{metrics.studentTripsToday} Rides</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Docking Stations List */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-400" /> Campus Docking Stations
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {stations.map(st => (
              <div
                key={st.id}
                onClick={() => setSelectedStation(st)}
                className={`p-5 rounded-2xl border transition cursor-pointer ${
                  selectedStation?.id === st.id
                    ? 'bg-emerald-950/40 border-emerald-500/50 shadow-lg shadow-emerald-950/50 ring-1 ring-emerald-500'
                    : 'bg-slate-900/60 border-slate-800 hover:border-emerald-500/30'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-emerald-400 px-2 py-0.5 bg-slate-800 rounded">
                    {st.id}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-slate-300">
                    <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{st.batteryAvg}% Avg</span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-white mb-2 leading-snug">{st.name}</h3>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                  <span className="font-semibold text-emerald-400">{st.availableBikes} Bikes Ready</span>
                  <span className="text-slate-500">{st.totalDocks - st.availableBikes} Empty Docks</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Unlock Console */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" /> Instant Bike Unlock Console
            </h3>

            {activeSession ? (
              <div className="space-y-4 text-center">
                <div className="p-4 bg-slate-950 rounded-xl border border-emerald-500/30 flex flex-col items-center">
                  <QrCode className="w-24 h-24 text-emerald-400 mb-2" />
                  <span className="text-xs font-mono text-emerald-300 font-bold">{activeSession.bikeNumber}</span>
                  <span className="text-[11px] text-slate-400 mt-1">Dock Unlocked! Mount and begin pedaling</span>
                </div>

                <div className="text-left text-xs space-y-1.5 bg-slate-950/40 p-3 rounded-lg border border-slate-800/80">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Bike ID:</span>
                    <span className="text-white font-semibold">{activeSession.bikeNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Battery Level:</span>
                    <span className="text-emerald-400 font-semibold">{activeSession.batteryPercent}% Charged</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Rate Plan:</span>
                    <span className="text-slate-200">{activeSession.costEstimate}</span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveSession(null)}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  End Session / Return Bike
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs space-y-1">
                  <span className="text-slate-400 block">Current Pick-up Station:</span>
                  <span className="text-white font-semibold text-sm">
                    {selectedStation ? selectedStation.name : 'Select a station'}
                  </span>
                </div>

                <div className="p-3 bg-emerald-950/30 rounded-xl border border-emerald-500/20 text-xs space-y-1 text-emerald-300">
                  <span className="font-semibold block">Campus Student Pass Benefit</span>
                  <p className="text-[11px] text-emerald-400/80">
                    Your student ID includes unlimited 30-minute e-bike trips between academic departments and hostels.
                  </p>
                </div>

                <button
                  onClick={handleUnlockBike}
                  disabled={!selectedStation || selectedStation.availableBikes === 0 || loading}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl transition shadow-lg shadow-emerald-600/20 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
                  Unlock E-Cycle at Dock
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
