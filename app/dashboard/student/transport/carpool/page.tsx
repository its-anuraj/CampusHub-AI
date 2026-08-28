'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Car, 
  MapPin, 
  Clock, 
  Users, 
  ArrowLeft, 
  Plus, 
  ShieldCheck, 
  Zap, 
  IndianRupee,
  CheckCircle2
} from 'lucide-react';

export default function CarpoolPage() {
  const [carpools, setCarpools] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [bookedIds, setBookedIds] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    driverName: 'Aditya Singh',
    vehicleType: 'Car (Honda City)',
    origin: '',
    destination: 'Main Campus East Gate',
    departureTime: '08:45 AM',
    totalSeats: 3,
    farePerTripInr: 50,
    femaleOnly: false
  });

  useEffect(() => {
    fetch('/api/transport/carpool')
      .then(res => res.json())
      .then(json => {
        if (json.success) setCarpools(json.data.carpools);
      });
  }, []);

  const handleCreatePool = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/transport/carpool', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const json = await res.json();
    if (json.success) {
      setCarpools([json.data, ...carpools]);
      setShowModal(false);
    }
  };

  const handleBookSeat = (id: string) => {
    setBookedIds([...bookedIds, id]);
    setCarpools(carpools.map(c => c.id === id ? { ...c, availableSeats: Math.max(0, c.availableSeats - 1) } : c));
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-emerald-900/40 via-teal-900/30 to-slate-900/40 p-6 rounded-2xl border border-emerald-500/20 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 mb-1">
            <Link href="/dashboard/student/transport" className="flex items-center gap-1 hover:underline text-xs">
              <ArrowLeft className="w-3 h-3" /> Back to Transport
            </Link>
            <span className="text-slate-500">•</span>
            <span className="text-xs font-semibold uppercase tracking-wider">Green Commute</span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Car className="w-6 h-6 text-emerald-400" />
            Campus Ride-Sharing & Carpool Pooling Coordinator
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Share rides with verified students, split fuel costs, reduce campus parking congestion, and lower your carbon footprint.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Offer a Carpool
        </button>
      </div>

      {/* Carpool Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {carpools.map((pool) => {
          const isBooked = bookedIds.includes(pool.id);
          return (
            <div key={pool.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                    <Car className="w-3.5 h-3.5 text-emerald-400" /> {pool.vehicleType}
                  </span>
                  {pool.femaleOnly && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-pink-500/10 text-pink-400 border border-pink-500/20">
                      Women Only
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white">{pool.driverName}</h3>
                  <div className="flex items-center gap-1 text-slate-400 text-xs mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Verified Student ID
                  </div>
                </div>

                <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 space-y-2 text-xs">
                  <div className="flex items-start gap-2 text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-semibold">Pickup:</span>
                      {pool.origin}
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-semibold">Drop:</span>
                      {pool.destination}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-blue-400" /> {pool.departureTime}
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-white">
                    <IndianRupee className="w-3.5 h-3.5 text-emerald-400" /> {pool.farePerTripInr} / seat
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-slate-500" /> {pool.availableSeats} of {pool.totalSeats} seats open
                </span>
                <button
                  onClick={() => handleBookSeat(pool.id)}
                  disabled={isBooked || pool.availableSeats === 0}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isBooked
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : pool.availableSeats === 0
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                  }`}
                >
                  {isBooked ? 'Reserved ✓' : pool.availableSeats === 0 ? 'Full' : 'Reserve Seat'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4">
            <h2 className="text-base font-bold text-white">Publish New Carpool</h2>
            <form onSubmit={handleCreatePool} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Pickup Location</label>
                <input
                  type="text"
                  placeholder="e.g. Silk Board Junction"
                  value={formData.origin}
                  onChange={e => setFormData({ ...formData, origin: e.target.value })}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Destination Campus Gate</label>
                <input
                  type="text"
                  value={formData.destination}
                  onChange={e => setFormData({ ...formData, destination: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Departure Time</label>
                  <input
                    type="text"
                    value={formData.departureTime}
                    onChange={e => setFormData({ ...formData, departureTime: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Cost Per Seat (₹)</label>
                  <input
                    type="number"
                    value={formData.farePerTripInr}
                    onChange={e => setFormData({ ...formData, farePerTripInr: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="femaleOnly"
                  checked={formData.femaleOnly}
                  onChange={e => setFormData({ ...formData, femaleOnly: e.target.checked })}
                  className="rounded border-slate-700"
                />
                <label htmlFor="femaleOnly" className="text-slate-300">Women-only carpool</label>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-1.5 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold"
                >
                  Publish Ride
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
