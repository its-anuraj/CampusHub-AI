'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  GraduationCap, 
  Star, 
  Coins, 
  Calendar, 
  ArrowLeft, 
  Video, 
  CheckCircle2, 
  Search, 
  Clock,
  Sparkles
} from 'lucide-react';

export default function TutoringMarketplacePage() {
  const [tutors, setTutors] = useState<any[]>([]);
  const [credits, setCredits] = useState(85);
  const [searchTerm, setSearchTerm] = useState('');
  const [bookingModalTutor, setBookingModalTutor] = useState<any>(null);
  const [topic, setTopic] = useState('');
  const [bookedSessions, setBookedSessions] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/tutoring')
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setTutors(json.data.tutors);
          setCredits(json.data.studentCreditsBalance);
        }
      });
  }, []);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingModalTutor || !topic) return;

    const res = await fetch('/api/tutoring', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tutorId: bookingModalTutor.id,
        topic
      })
    });
    const json = await res.json();
    if (json.success) {
      setBookedSessions([json.data, ...bookedSessions]);
      setCredits(prev => Math.max(0, prev - bookingModalTutor.hourlyRateCredits));
      setBookingModalTutor(null);
      setTopic('');
    }
  };

  const filteredTutors = tutors.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.skills.some((s: string) => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-violet-900/40 via-purple-900/30 to-slate-900/40 p-6 rounded-2xl border border-violet-500/20 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 text-violet-400 mb-1">
            <Link href="/dashboard/student" className="flex items-center gap-1 hover:underline text-xs">
              <ArrowLeft className="w-3 h-3" /> Back to Dashboard
            </Link>
            <span className="text-slate-500">•</span>
            <span className="text-xs font-semibold uppercase tracking-wider">Peer-to-Peer Learning</span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-violet-400" />
            Peer Tutoring & Skill Exchange Marketplace
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Connect with top senior scholars for 1-on-1 concept clearing, lab debugging, and exam preparation using your campus knowledge tokens.
          </p>
        </div>

        {/* Knowledge Tokens Pill */}
        <div className="bg-slate-900/80 border border-violet-500/30 px-4 py-2.5 rounded-2xl flex items-center gap-3">
          <div className="p-2 bg-violet-500/10 rounded-xl text-violet-400">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Knowledge Credits</div>
            <div className="text-lg font-bold text-white">{credits} Tokens</div>
          </div>
        </div>
      </div>

      {/* Booked Sessions Alert */}
      {bookedSessions.length > 0 && (
        <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-2xl p-4 space-y-2">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> Active Upcoming Tutoring Sessions
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {bookedSessions.map((s, idx) => (
              <div key={idx} className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-white">{s.topic}</div>
                  <div className="text-[11px] text-slate-400">{s.date} • {s.sessionType}</div>
                </div>
                <a
                  href={s.meetLink}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1"
                >
                  <Video className="w-3 h-3" /> Join Room
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
        <input
          type="text"
          placeholder="Search tutors by subject, programming language, or topic (e.g. Operating Systems, C++, Linear Algebra)..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full bg-slate-900/80 border border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
        />
      </div>

      {/* Tutors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTutors.map((tutor) => (
          <div key={tutor.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">{tutor.name}</h3>
                  <p className="text-xs text-slate-400">{tutor.major}</p>
                </div>
                <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-lg text-amber-400 text-xs font-bold">
                  <Star className="w-3 h-3 fill-amber-400" /> {tutor.rating}
                </div>
              </div>

              <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                {tutor.bio}
              </p>

              {/* Skills Chips */}
              <div className="flex flex-wrap gap-1.5">
                {tutor.skills.map((skill: string, sIdx: number) => (
                  <span key={sIdx} className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-violet-500/10 text-violet-300 border border-violet-500/20">
                    {skill}
                  </span>
                ))}
              </div>

              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" /> {tutor.availability}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs font-bold text-violet-400">
                <Coins className="w-3.5 h-3.5" /> {tutor.hourlyRateCredits} tokens / hr
              </div>
              <button
                onClick={() => setBookingModalTutor(tutor)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white shadow-md transition-all"
              >
                Book Session
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {bookingModalTutor && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-violet-400" /> Book Session with {bookingModalTutor.name}
            </h2>
            <form onSubmit={handleBook} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Topic / Lab Assignment You Need Help With</label>
                <input
                  type="text"
                  placeholder="e.g. Page Fault Handling in Virtual Memory"
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 space-y-1 text-slate-400">
                <div className="flex justify-between">
                  <span>Session Fee:</span>
                  <span className="text-white font-bold">{bookingModalTutor.hourlyRateCredits} Tokens</span>
                </div>
                <div className="flex justify-between">
                  <span>Your Balance:</span>
                  <span className="text-violet-400 font-bold">{credits} Tokens</span>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setBookingModalTutor(null)}
                  className="px-3 py-1.5 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={credits < bookingModalTutor.hourlyRateCredits}
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-semibold disabled:opacity-50"
                >
                  Confirm 1-on-1 Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
