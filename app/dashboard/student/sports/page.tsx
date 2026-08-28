'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Trophy, 
  Dumbbell, 
  MapPin, 
  Clock, 
  Users, 
  ArrowLeft, 
  CheckCircle2, 
  Calendar, 
  QrCode,
  Zap
} from 'lucide-react';

export default function SportsReservationPage() {
  const [facilities, setFacilities] = useState<any[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<any>(null);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [activeReservation, setActiveReservation] = useState<any>(null);

  useEffect(() => {
    fetch('/api/sports')
      .then(res => res.json())
      .then(json => {
        if (json.success) setFacilities(json.data.facilities);
      });
  }, []);

  const handleBookSlot = async (fac: any, slot: string) => {
    const res = await fetch('/api/sports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        facilityId: fac.id,
        timeSlot: slot,
        playerCount: 2
      })
    });
    const json = await res.json();
    if (json.success) {
      setActiveReservation({ ...json.data, facilityName: fac.name });
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-emerald-900/40 via-lime-900/30 to-slate-900/40 p-6 rounded-2xl border border-emerald-500/20 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 mb-1">
            <Link href="/dashboard/student" className="flex items-center gap-1 hover:underline text-xs">
              <ArrowLeft className="w-3 h-3" /> Back to Dashboard
            </Link>
            <span className="text-slate-500">•</span>
            <span className="text-xs font-semibold uppercase tracking-wider">Campus Athletics & Fitness</span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Trophy className="w-6 h-6 text-lime-400" />
            Campus Gym, Fitness Center & Sports Court Hub
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time court occupancy telemetry, floodlit turf reservation, gym capacity monitors, and instant QR entry passes.
          </p>
        </div>
      </div>

      {/* Active Pass Banner */}
      {activeReservation && (
        <div className="bg-lime-950/40 border border-lime-500/30 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-lime-400 text-xs font-bold uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" /> Entry Pass Confirmed
            </div>
            <div className="text-base font-bold text-white">{activeReservation.facilityName}</div>
            <div className="text-xs text-slate-300">Time Slot: {activeReservation.timeSlot} • Booking ID: {activeReservation.bookingId}</div>
          </div>

          <div className="bg-slate-950/80 border border-lime-500/30 px-4 py-2 rounded-xl flex items-center gap-3">
            <QrCode className="w-8 h-8 text-lime-400" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Turnstile QR</div>
              <div className="text-xs font-mono text-white">{activeReservation.passQrCode}</div>
            </div>
          </div>
        </div>
      )}

      {/* Facilities Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {facilities.map((fac) => {
          const occupancyPct = Math.round((fac.currentOccupancy / fac.maxCapacity) * 100);
          return (
            <div key={fac.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-lime-500/10 text-lime-400 border border-lime-500/20">
                    {fac.category}
                  </span>
                  <div className="text-xs text-slate-400 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> {fac.currentOccupancy}/{fac.maxCapacity} Active
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">{fac.name}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" /> {fac.location}
                  </div>
                </div>

                {/* Live Occupancy Gauge */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Live Arena Crowding</span>
                    <span className="font-semibold text-white">{occupancyPct}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        occupancyPct > 80 ? 'bg-rose-500' : occupancyPct > 50 ? 'bg-amber-500' : 'bg-lime-400'
                      }`}
                      style={{ width: `${occupancyPct}%` }}
                    />
                  </div>
                </div>

                {/* Equipment Included */}
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Free Gear Access:</span>
                  <div className="flex flex-wrap gap-1">
                    {fac.equipmentProvided?.map((eq: string, eqIdx: number) => (
                      <span key={eqIdx} className="text-[10px] bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700">
                        {eq}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Slot Selector */}
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <span className="text-[11px] font-semibold text-slate-300 block">Select Slot for Today:</span>
                <div className="grid grid-cols-1 gap-1.5">
                  {fac.availableSlots?.map((slot: string, sIdx: number) => (
                    <button
                      key={sIdx}
                      onClick={() => handleBookSlot(fac, slot)}
                      className="w-full py-1.5 px-3 bg-slate-800/80 hover:bg-lime-600 hover:text-white border border-slate-700 rounded-xl text-xs font-medium text-slate-300 transition-all flex items-center justify-between"
                    >
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-lime-400" /> {slot}
                      </span>
                      <span className="text-[10px] text-lime-400 font-semibold">Reserve →</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
