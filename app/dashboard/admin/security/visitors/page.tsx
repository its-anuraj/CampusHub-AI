'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Car, 
  UserCheck, 
  ArrowLeft, 
  Plus, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Sparkles,
  QrCode
} from 'lucide-react';

export default function VisitorPassesPage() {
  const [data, setData] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [org, setOrg] = useState('');
  const [purpose, setPurpose] = useState('');
  const [host, setHost] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchPasses = async () => {
    const res = await fetch('/api/security/visitors');
    const json = await res.json();
    if (json.success) setData(json.data);
  };

  useEffect(() => {
    fetchPasses();
  }, []);

  const handleIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !host) return;
    setLoading(true);

    try {
      const res = await fetch('/api/security/visitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorName: name,
          organization: org,
          purpose,
          hostFaculty: host,
          vehicleNumber: vehicle
        })
      });
      const json = await res.json();
      if (json.success) {
        setShowModal(false);
        setName('');
        setOrg('');
        setPurpose('');
        setHost('');
        setVehicle('');
        fetchPasses();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-slate-900/40 p-6 rounded-2xl border border-blue-500/20 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 text-blue-400 mb-1">
            <Link href="/dashboard/admin" className="flex items-center gap-1 hover:underline text-xs">
              <ArrowLeft className="w-3 h-3" /> Back to Admin Desk
            </Link>
            <span className="text-slate-500">•</span>
            <span className="text-xs font-semibold uppercase tracking-wider">Campus Gate Security</span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-blue-400" />
            Visitor Pass Management & ANPR Vehicle Terminal
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Issue digital QR visitor entry badges, track host authorizations, and manage automated vehicle plate recognition (ANPR).
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl transition shadow-lg shadow-blue-600/20 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Issue Gate Pass
        </button>
      </div>

      {data && (
        <>
          {/* Top Counters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">Visitors Currently on Campus</span>
              <div className="text-2xl font-bold text-white">{data.activeVisitorsOnCampus} Guests</div>
              <span className="text-[11px] text-emerald-400">All authenticated at Gate #1 & #2</span>
            </div>

            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">Available Parking Bays</span>
              <div className="text-2xl font-bold text-blue-400">
                {data.availableParkingBays} / {data.totalParkingBays} Slots
              </div>
              <span className="text-[11px] text-slate-400">Smart bay occupancy sensors active</span>
            </div>

            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">ANPR Recognition Health</span>
              <div className="text-2xl font-bold text-emerald-400">99.8% Accuracy</div>
              <span className="text-[11px] text-slate-400">Gate #1 & #2 high-speed OCR</span>
            </div>
          </div>

          {/* Passes List */}
          <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-blue-400" /> Active Visitor Gate Passes & Authorized Vehicles
            </h3>

            <div className="divide-y divide-slate-800">
              {data.passes.map((pass: any) => (
                <div key={pass.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-bold text-blue-400 px-2 py-0.5 bg-slate-800 rounded">
                        {pass.id}
                      </span>
                      <h4 className="text-sm font-bold text-white">{pass.visitorName}</h4>
                      <span className="text-xs text-slate-400">({pass.organization})</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      <span>Purpose: <b className="text-slate-300">{pass.purpose}</b></span>
                      <span>•</span>
                      <span>Host: <b className="text-slate-300">{pass.hostFaculty}</b></span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Car className="w-3.5 h-3.5 text-blue-400" />
                        <b className="font-mono text-slate-200">{pass.vehicleNumber}</b> ({pass.parkingSlot})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-start md:self-auto">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        pass.status === 'ACTIVE_ON_CAMPUS'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {pass.status === 'ACTIVE_ON_CAMPUS' ? 'On Campus' : 'Checked Out'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-md space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-400" /> Issue Visitor Entry Gate Pass
            </h3>

            <form onSubmit={handleIssue} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Visitor Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Dr. Rajesh Khanna"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Organization / Institution</label>
                <input
                  type="text"
                  value={org}
                  onChange={e => setOrg(e.target.value)}
                  placeholder="e.g. AIIMS Delhi / ISRO"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Host Faculty / Office</label>
                <input
                  type="text"
                  required
                  value={host}
                  onChange={e => setHost(e.target.value)}
                  placeholder="e.g. Prof. Raman (Dean Academic)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Purpose of Visit</label>
                <input
                  type="text"
                  value={purpose}
                  onChange={e => setPurpose(e.target.value)}
                  placeholder="e.g. Academic Guest Lecture & Lab Visit"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Vehicle License Plate (Optional)</label>
                <input
                  type="text"
                  value={vehicle}
                  onChange={e => setVehicle(e.target.value)}
                  placeholder="e.g. DL 01 AB 1234"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Generate & Authenticate Pass
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
