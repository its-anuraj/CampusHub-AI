'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Briefcase, 
  Building2, 
  MapPin, 
  ArrowLeft, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  UserCheck,
  FileText
} from 'lucide-react';

export default function AlumniReferralsPage() {
  const [referrals, setReferrals] = useState<any[]>([]);
  const [selectedRef, setSelectedRef] = useState<any>(null);
  const [pitch, setPitch] = useState('');
  const [submitted, setSubmitted] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/alumni/referrals')
      .then(res => res.json())
      .then(data => {
        if (data.success) setReferrals(data.data);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRef || !pitch) return;
    setLoading(true);

    try {
      const res = await fetch('/api/alumni/referrals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referralId: selectedRef.id,
          studentPitch: pitch
        })
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(data.data);
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
            <Link href="/dashboard/student/alumni" className="flex items-center gap-1 hover:underline text-xs">
              <ArrowLeft className="w-3 h-3" /> Back to Alumni
            </Link>
            <span className="text-slate-500">•</span>
            <span className="text-xs font-semibold uppercase tracking-wider">Direct Referrals</span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-blue-400" />
            Alumni Job Referral Board
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Request verified employee referrals from campus alumni working at top global tech enterprises.
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Referral Listings */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-400" /> Active Campus Referral Openings
          </h2>

          <div className="space-y-4">
            {referrals.map(item => (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedRef(item);
                  setSubmitted(null);
                }}
                className={`p-5 rounded-2xl border transition cursor-pointer ${
                  selectedRef?.id === item.id
                    ? 'bg-blue-950/40 border-blue-500/50 shadow-lg shadow-blue-950/50 ring-1 ring-blue-500'
                    : 'bg-slate-900/60 border-slate-800 hover:border-blue-500/30'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-white px-2.5 py-1 bg-slate-800 rounded-lg">
                    {item.company}
                  </span>
                  <span className="text-xs text-emerald-400 font-semibold px-2 py-0.5 bg-emerald-950/60 rounded-full border border-emerald-500/20">
                    {item.referralSlotsRemaining} slots left
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-1">{item.role}</h3>

                <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" /> {item.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-blue-400" /> {item.alumniName} ({item.batch})
                  </span>
                </div>

                <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs text-slate-300">
                  <span className="text-slate-400 font-medium">Eligibility: </span>
                  {item.eligibility}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Application & Pitch Desk */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Send className="w-4 h-4 text-blue-400" /> Submit Referral Pitch
            </h3>

            {submitted ? (
              <div className="space-y-4 text-center p-4 bg-emerald-950/30 rounded-xl border border-emerald-500/30">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <div>
                  <h4 className="text-sm font-bold text-white">Pitch Dispatched!</h4>
                  <p className="text-xs text-emerald-300 mt-1">
                    Your resume and pitch were sent to {selectedRef?.alumniName}&apos;s verified alumni inbox.
                  </p>
                </div>
                <div className="text-left text-xs bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block">Tracking ID:</span>
                  <span className="text-white font-mono">{submitted.applicationId}</span>
                </div>
                <button
                  onClick={() => setSubmitted(null)}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-xl"
                >
                  Submit Another Pitch
                </button>
              </div>
            ) : selectedRef ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs">
                  <span className="text-slate-400 block">Target Role:</span>
                  <span className="text-white font-semibold text-sm">
                    {selectedRef.role} at {selectedRef.company}
                  </span>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">
                    Elevator Pitch / Why are you a good fit?
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={pitch}
                    onChange={e => setPitch(e.target.value)}
                    placeholder="Briefly summarize your top 2 projects, LeetCode/DSA problem count, and relevant tech stack alignment..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500 leading-relaxed resize-none"
                  />
                </div>

                <div className="flex items-center gap-2 p-2.5 bg-slate-950/40 rounded-xl border border-slate-800 text-xs text-slate-400">
                  <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Your verified CampusHub ATS Resume will be attached automatically.</span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl transition shadow-lg shadow-blue-600/20 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> Send Referral Request
                </button>
              </form>
            ) : (
              <div className="p-12 text-center text-slate-500 text-xs">
                Select an open referral from the list on the left to draft your pitch.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
