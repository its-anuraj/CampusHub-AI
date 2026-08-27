'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Video, 
  Calendar, 
  Clock, 
  ArrowLeft, 
  Plus, 
  UserCheck, 
  CheckCircle2, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

export default function ParentPtmPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [faculty, setFaculty] = useState('Dr. S. K. Raman (HOD CSE)');
  const [date, setDate] = useState('2026-09-04');
  const [time, setTime] = useState('04:00 PM - 04:20 PM');
  const [agenda, setAgenda] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchBookings = async () => {
    const res = await fetch('/api/parent/ptm');
    const json = await res.json();
    if (json.success) setBookings(json.data);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/parent/ptm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          facultyName: faculty,
          date,
          timeSlot: time,
          agendaNotes: agenda
        })
      });
      const json = await res.json();
      if (json.success) {
        setShowModal(false);
        setAgenda('');
        fetchBookings();
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
            <Link href="/dashboard/parent" className="flex items-center gap-1 hover:underline text-xs">
              <ArrowLeft className="w-3 h-3" /> Back to Parent Desk
            </Link>
            <span className="text-slate-500">•</span>
            <span className="text-xs font-semibold uppercase tracking-wider">Faculty Consultation</span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Video className="w-6 h-6 text-blue-400" />
            Parent-Teacher Meeting (PTM) Video Slot Booking
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Schedule 1-on-1 virtual or in-person progress consultations with class counselors, HODs, and faculty advisors.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl transition shadow-lg shadow-blue-600/20 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Book PTM Meeting
        </button>
      </div>

      {/* Bookings List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bookings.map(b => (
          <div
            key={b.id}
            className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-lg shadow-slate-950/40 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-blue-400 px-2 py-0.5 bg-slate-800 rounded">
                  {b.id}
                </span>
                <span className="text-xs font-semibold text-emerald-400 px-2.5 py-0.5 bg-emerald-950/60 rounded-full border border-emerald-500/30">
                  {b.status}
                </span>
              </div>

              <h3 className="text-base font-bold text-white mb-0.5">{b.facultyName}</h3>
              <p className="text-xs text-slate-400 mb-3">{b.designation}</p>

              <div className="space-y-1.5 text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800 mb-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Date:</span>
                  <span className="font-semibold text-white">{b.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Time Window:</span>
                  <span className="text-blue-400 font-mono">{b.timeSlot}</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/80">
                <span className="text-slate-500 font-medium">Meeting Agenda: </span>
                {b.agendaNotes}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500">Google Meet Encrypted</span>
              <a
                href={b.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                <Video className="w-3.5 h-3.5" /> Join Video Call
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-md space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-400" /> Schedule Parent-Teacher Meeting
            </h3>

            <form onSubmit={handleBook} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Select Faculty / Counselor</label>
                <select
                  value={faculty}
                  onChange={e => setFaculty(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="Dr. S. K. Raman (HOD CSE)">Dr. S. K. Raman (HOD CSE & Batch Advisor)</option>
                  <option value="Prof. Ananya Roy (Training & Placement)">Prof. Ananya Roy (Placement Cell Officer)</option>
                  <option value="Dr. Meenakshi Sundaram (Hostel Warden)">Dr. Meenakshi Sundaram (Hostel Residential Warden)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Preferred Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Time Window</label>
                  <select
                    value={time}
                    onChange={e => setTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="03:30 PM - 03:50 PM">03:30 PM - 03:50 PM</option>
                    <option value="04:00 PM - 04:20 PM">04:00 PM - 04:20 PM</option>
                    <option value="04:30 PM - 04:50 PM">04:30 PM - 04:50 PM</option>
                    <option value="05:00 PM - 05:20 PM">05:00 PM - 05:20 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Agenda / Specific Questions</label>
                <textarea
                  required
                  rows={3}
                  value={agenda}
                  onChange={e => setAgenda(e.target.value)}
                  placeholder="e.g. Discussing project guidance and semester attendance review..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500 resize-none"
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
                  Confirm Slot Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
