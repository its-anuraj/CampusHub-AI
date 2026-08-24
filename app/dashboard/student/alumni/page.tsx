'use client';

import { useState, useEffect } from 'react';
import { Users, Briefcase, MapPin, Linkedin, Video, Calendar, Search, Sparkles, CheckCircle2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/lib/toastContext';

export default function StudentAlumniPage() {
  const { addToast } = useToast();
  const [alumni, setAlumni] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [bookingModal, setBookingModal] = useState<any>(null);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [topic, setTopic] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchAlumni() {
      try {
        const res = await fetch(`/api/alumni?search=${encodeURIComponent(search)}`);
        if (res.ok) {
          const json = await res.json();
          setAlumni(json.data || json);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchAlumni();
  }, [search]);

  const handleBookSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) {
      addToast({ title: 'Select Slot', message: 'Please select an available session time slot.', type: 'warning' });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/alumni', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mentorName: bookingModal.name,
          studentName: 'Alex Kumar',
          slot: selectedSlot,
          topic
        })
      });
      if (res.ok) {
        addToast({
          title: 'Mentorship Confirmed! 🚀',
          message: `Your 1:1 session with ${bookingModal.name} is confirmed. Google Meet invite sent.`,
          type: 'success'
        });
        setBookingModal(null);
        setTopic('');
        setSelectedSlot('');
      }
    } catch {
      addToast({ title: 'Error', message: 'Failed to book slot', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shadow-xs">
              <Users className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Campus Alumni & Mentorship Network</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">Connect with graduates working at Google, Microsoft, Apple, and book 1-on-1 career guidance sessions</p>
        </div>

        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs w-full sm:w-72 shadow-xs">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search alumni by company, role, batch..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-xs text-slate-900 outline-none flex-1"
          />
        </div>
      </div>

      {/* Alumni Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {alumni.map((alum) => (
          <div key={alum.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-card flex flex-col justify-between space-y-4 hover:border-blue-300 transition-all">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <img
                  src={alum.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                  alt={alum.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-100 shadow-xs"
                />
                <div className="overflow-hidden flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 truncate">{alum.name}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">Verified</span>
                  </div>
                  <p className="text-xs font-semibold text-blue-600 truncate">{alum.designation}</p>
                  <p className="text-[11px] text-slate-500">{alum.company} • {alum.batch}</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{alum.bio}</p>

              <div className="space-y-1.5 text-[11px] text-slate-500 border-t border-slate-100 pt-3">
                <div className="flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                  <span>{alum.department}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{alum.location}</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setBookingModal(alum)}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Video className="w-3.5 h-3.5" /> Book 1:1 Mentorship Session
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {bookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full shadow-2xl relative space-y-4">
            <button onClick={() => setBookingModal(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer">
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                1-on-1 Consultation
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">Book Session with {bookingModal.name}</h3>
              <p className="text-xs text-slate-500">{bookingModal.designation} at {bookingModal.company}</p>
            </div>

            <form onSubmit={handleBookSession} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1.5">Select Mentor Availability Slot</label>
                <div className="grid grid-cols-1 gap-2">
                  {(bookingModal.availableSlots || ['Sat 10:00 AM', 'Sat 02:00 PM', 'Sun 11:30 AM']).map((slot: string) => (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={cn(
                        'p-2.5 rounded-xl border text-left font-medium transition-all cursor-pointer text-xs flex items-center justify-between',
                        selectedSlot === slot ? 'bg-blue-50 border-blue-500 text-blue-700 font-semibold' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      )}
                    >
                      <span>{slot}</span>
                      {selectedSlot === slot && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Discussion Focus / Questions</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. System Design interview strategies, resume feedback, transitioning to AI research..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-slate-900 outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                {submitting ? 'Confirming...' : 'Confirm Mentorship Booking'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
