'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  PackageSearch, 
  ShieldCheck, 
  MapPin, 
  ArrowLeft, 
  FileCheck, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Plus,
  Search
} from 'lucide-react';

export default function ClaimTrackerPage() {
  const [claims, setClaims] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [proof, setProof] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchClaims = async () => {
    const res = await fetch('/api/lost-found/claims');
    const json = await res.json();
    if (json.success) setClaims(json.data);
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !proof) return;
    setLoading(true);

    try {
      const res = await fetch('/api/lost-found/claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemTitle: title, foundLocation: location, proofDescription: proof })
      });
      const json = await res.json();
      if (json.success) {
        setShowModal(false);
        setTitle('');
        setLocation('');
        setProof('');
        fetchClaims();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-teal-900/40 via-cyan-900/30 to-slate-900/40 p-6 rounded-2xl border border-teal-500/20 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 text-teal-400 mb-1">
            <Link href="/dashboard/student/lost-found" className="flex items-center gap-1 hover:underline text-xs">
              <ArrowLeft className="w-3 h-3" /> Back to Lost & Found
            </Link>
            <span className="text-slate-500">•</span>
            <span className="text-xs font-semibold uppercase tracking-wider">Item Recovery</span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <PackageSearch className="w-6 h-6 text-teal-400" />
            AI Item Matcher & Ownership Claim Verification
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Submit ownership proof, track security custodian custody status, and receive automated AI similarity matches.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs rounded-xl transition shadow-lg shadow-teal-600/20 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> File Ownership Claim
        </button>
      </div>

      {/* Claims List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {claims.map(claim => (
          <div
            key={claim.id}
            className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-lg shadow-slate-950/40"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-teal-400 px-2 py-0.5 bg-slate-800 rounded">
                {claim.id}
              </span>
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  claim.status === 'VERIFIED_READY_FOR_PICKUP'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }`}
              >
                {claim.status === 'VERIFIED_READY_FOR_PICKUP' ? 'Ready for Pickup' : 'Security Review In Progress'}
              </span>
            </div>

            <h3 className="text-base font-bold text-white">{claim.itemTitle}</h3>

            <div className="space-y-1.5 text-xs text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <div className="flex justify-between">
                <span>Location Found:</span>
                <span className="text-slate-200">{claim.foundLocation}</span>
              </div>
              <div className="flex justify-between">
                <span>Custodian Officer:</span>
                <span className="text-slate-200">{claim.securityCustodian}</span>
              </div>
              <div className="flex justify-between">
                <span>AI Verification Match:</span>
                <span className="text-teal-400 font-bold">{claim.matchConfidencePercent}% Confidence</span>
              </div>
            </div>

            <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800/60 text-xs text-slate-300">
              <span className="text-slate-500 font-semibold block mb-0.5">Submitted Ownership Evidence:</span>
              <p>{claim.proofProvided}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-md space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-teal-400" /> File Item Ownership Claim
            </h3>

            <form onSubmit={handleClaim} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Item Name & Model</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Dell USB-C 65W Laptop Charger"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Estimated Lost Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="e.g. Computer Science Lab 3 / Seminar Hall"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Ownership Identifying Proof</label>
                <textarea
                  required
                  rows={4}
                  value={proof}
                  onChange={e => setProof(e.target.value)}
                  placeholder="Describe unique marks, serial numbers, password patterns, or stickers..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500 resize-none"
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
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Submit Claim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
