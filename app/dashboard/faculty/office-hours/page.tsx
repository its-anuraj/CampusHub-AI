'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  CalendarClock, 
  UserCheck, 
  ArrowLeft, 
  Plus, 
  Clock, 
  MapPin, 
  Video, 
  CheckCircle,
  Sparkles
} from 'lucide-react';

export default function FacultyOfficeHoursPage() {
  const [slots, setSlots] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [day, setDay] = useState('Tuesday');
  const [time, setTime] = useState('03:00 PM - 04:30 PM');
  const [location, setLocation] = useState('Faculty Cabin #304');
  const [maxApps, setMaxApps] = useState(3);
  const [loading, setLoading] = useState(false);

  const fetchSlots = async () => {
    const res = await fetch('/api/faculty/office-hours');
    const json = await res.json();
    if (json.success) setSlots(json.data);
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const handleCreateSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/faculty/office-hours', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dayOfWeek: day,
          timeRange: time,
          location,
          maxAppointments: maxApps
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        fetchSlots();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-emerald-900/40 via-teal-900/30 to-slate-900/40 p-6 rounded-2xl border border-emerald-500/20 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 mb-1">
            <Link href="/dashboard/faculty" className="flex items-center gap-1 hover:underline text-xs">
              <ArrowLeft className="w-3 h-3" /> Back to Faculty Desk
            </Link>
            <span className="text-slate-500">•</span>
            <span className="text-xs font-semibold uppercase tracking-wider">Student Advising</span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <CalendarClock className="w-6 h-6 text-emerald-400" />
            1-on-1 Office Hours & Mentorship Scheduler
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Publish consultation availability slots, review student agenda requests, and manage 1-on-1 academic counseling.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl transition shadow-lg shadow-emerald-600/20 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Office Slot
        </button>
      </div>

      {/* Slots List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {slots.map(slot => (
          <div
            key={slot.id}
            className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-lg shadow-slate-950/40 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-400 px-2.5 py-1 bg-emerald-950/60 rounded-lg border border-emerald-500/30">
                  {slot.dayOfWeek}
                </span>
                <span className="text-xs text-slate-400">
                  {slot.bookedCount} / {slot.maxAppointments} Booked
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-300 mb-4">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>{slot.timeRange}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <MapPin className="w-4 h-4 text-slate-500" />
                  <span>{slot.location}</span>
                </div>
              </div>

              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Scheduled Student Consultations:
              </h4>

              {slot.appointments.length > 0 ? (
                <div className="space-y-2">
                  {slot.appointments.map((app: any, idx: number) => (
                    <div key={idx} className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs space-y-1">
                      <span className="font-semibold text-white block">{app.studentName}</span>
                      <p className="text-[11px] text-slate-400">{app.agenda}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">No appointments booked yet for this slot.</p>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Auto-synced with Calendar</span>
              <span className="text-emerald-400 font-semibold">Active</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-md space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-400" /> Add Office Hours Availability
            </h3>

            <form onSubmit={handleCreateSlot} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Day of Week</label>
                <select
                  value={day}
                  onChange={e => setDay(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Time Slot Window</label>
                <input
                  type="text"
                  required
                  value={time}
                  onChange={e => setTime(e.target.value)}
                  placeholder="e.g. 03:00 PM - 04:30 PM"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Location / Video Link</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="e.g. Faculty Cabin #304 or Zoom Link"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
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
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Publish Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
