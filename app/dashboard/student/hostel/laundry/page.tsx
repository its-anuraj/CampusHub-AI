'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Shirt, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  QrCode, 
  ArrowLeft, 
  Zap, 
  RefreshCw,
  Sparkles,
  Ticket
} from 'lucide-react';

export default function HostelLaundryPage() {
  const [washers, setWashers] = useState<any[]>([]);
  const [tokensRemaining, setTokensRemaining] = useState(2);
  const [booking, setBooking] = useState<any>(null);
  const [selectedWasher, setSelectedWasher] = useState<string>('');
  const [cycleType, setCycleType] = useState('Standard Wash + Spin (40 mins)');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/hostel/laundry')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setWashers(data.data.washers);
          setTokensRemaining(data.data.tokensRemaining);
        }
      });
  }, []);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWasher) return;
    setLoading(true);

    try {
      const res = await fetch('/api/hostel/laundry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ washerId: selectedWasher, cycleType })
      });
      const data = await res.json();
      if (data.success) {
        setBooking(data.data);
        setTokensRemaining(prev => Math.max(0, prev - 1));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-cyan-900/40 via-sky-900/30 to-slate-900/40 p-6 rounded-2xl border border-cyan-500/20 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 mb-1">
            <Link href="/dashboard/student/hostel" className="flex items-center gap-1 hover:underline text-xs">
              <ArrowLeft className="w-3 h-3" /> Back to Hostel
            </Link>
            <span className="text-slate-500">•</span>
            <span className="text-xs font-semibold uppercase tracking-wider">Hostel Utilities</span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Shirt className="w-6 h-6 text-cyan-400" />
            Smart Laundry & Washer Token System
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Live occupancy tracker across residential wings, cycle time estimators, and instant digital QR wash tokens.
          </p>
        </div>

        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/10 text-cyan-400 rounded-lg">
            <Ticket className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block">Weekly Allowance</span>
            <span className="text-base font-bold text-white">{tokensRemaining} Free Passes Left</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Machine Statuses */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" /> Real-time Washer Bay Status
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {washers.map((wm) => (
              <div
                key={wm.id}
                onClick={() => wm.status === 'AVAILABLE' && setSelectedWasher(wm.id)}
                className={`p-5 rounded-2xl border transition ${
                  wm.status === 'AVAILABLE'
                    ? selectedWasher === wm.id
                      ? 'bg-cyan-950/40 border-cyan-500/50 shadow-lg shadow-cyan-950/50 ring-1 ring-cyan-500'
                      : 'bg-slate-900/60 border-slate-800 hover:border-cyan-500/30 cursor-pointer'
                    : 'bg-slate-900/30 border-slate-800/40 opacity-75'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-slate-800 rounded-lg text-cyan-400 font-mono font-bold text-xs">
                      {wm.id}
                    </div>
                    <span className="text-xs text-slate-300 font-medium">{wm.loadCapacityKg}kg Load</span>
                  </div>
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      wm.status === 'AVAILABLE'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : wm.status === 'IN_USE'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}
                  >
                    {wm.status === 'AVAILABLE'
                      ? 'Available'
                      : wm.status === 'IN_USE'
                      ? `${wm.remainingMins}m left`
                      : 'Under Service'}
                  </span>
                </div>

                <p className="text-xs text-slate-400 mb-1">{wm.block}</p>
                <p className="text-[11px] text-slate-500 font-mono">{wm.model}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Booking & QR Token */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Ticket className="w-4 h-4 text-cyan-400" /> Book Washer Slot
            </h3>

            {booking ? (
              <div className="space-y-4 text-center">
                <div className="p-4 bg-slate-950 rounded-xl border border-cyan-500/30 flex flex-col items-center">
                  <QrCode className="w-24 h-24 text-cyan-400 mb-2" />
                  <span className="text-xs font-mono text-cyan-300 font-bold">{booking.tokenId}</span>
                  <span className="text-[11px] text-slate-400 mt-1">Scan at {booking.washerId} to begin cycle</span>
                </div>

                <div className="text-left text-xs space-y-1.5 bg-slate-950/40 p-3 rounded-lg border border-slate-800/80">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Machine:</span>
                    <span className="text-white font-semibold">{booking.washerId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Cycle:</span>
                    <span className="text-slate-200">{booking.cycleType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Status:</span>
                    <span className="text-emerald-400 font-semibold">{booking.status}</span>
                  </div>
                </div>

                <button
                  onClick={() => setBooking(null)}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Book Another Washer
                </button>
              </div>
            ) : (
              <form onSubmit={handleBook} className="space-y-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Selected Machine</label>
                  <input
                    type="text"
                    readOnly
                    value={selectedWasher ? `Machine ${selectedWasher}` : 'Click an available machine on the left'}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-300 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Wash Cycle Option</label>
                  <select
                    value={cycleType}
                    onChange={e => setCycleType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Quick Wash (25 mins)">Quick Wash (25 mins) • Light soil</option>
                    <option value="Standard Wash + Spin (40 mins)">Standard Wash + Spin (40 mins) • Regular</option>
                    <option value="Heavy Bedding + Sanitize (60 mins)">Heavy Bedding + Sanitize (60 mins) • Deep clean</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={!selectedWasher || loading}
                  className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs rounded-xl transition shadow-lg shadow-cyan-600/20 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  Generate Digital Laundry Token
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
