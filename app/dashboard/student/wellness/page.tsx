'use client';

import { useState, useEffect } from 'react';
import { Heart, ShieldCheck, Phone, Calendar, Sparkles, CheckCircle2, AlertTriangle, Smile, Frown, Meh, Zap, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/lib/toastContext';

export default function StudentWellnessPage() {
  const { addToast } = useToast();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMood, setSelectedMood] = useState('CALM');
  const [selectedCounselor, setSelectedCounselor] = useState<any>(null);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [bookingConfirmed, setBookingConfirmed] = useState<any>(null);

  useEffect(() => {
    async function fetchWellness() {
      try {
        const res = await fetch('/api/wellness');
        if (res.ok) {
          const json = await res.json();
          setData(json.data || json);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchWellness();
  }, []);

  const handleMoodSelect = async (mood: string) => {
    setSelectedMood(mood);
    try {
      await fetch('/api/wellness', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'LOG_MOOD', mood })
      });
      addToast({
        title: 'Check-in Recorded',
        message: `Your mood has been logged as ${mood.toLowerCase()}. Take care of yourself!`,
        type: 'success'
      });
    } catch {
      // fallback
    }
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) {
      addToast({ title: 'Select Slot', message: 'Please choose an available appointment slot.', type: 'warning' });
      return;
    }
    try {
      const res = await fetch('/api/wellness', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'BOOK_COUNSELING',
          counselor: selectedCounselor.name,
          slot: selectedSlot,
          isAnonymous
        })
      });
      if (res.ok) {
        const json = await res.json();
        setBookingConfirmed(json.data || json);
        setSelectedCounselor(null);
        setSelectedSlot('');
        addToast({
          title: 'Session Confirmed 🌿',
          message: 'Your 100% confidential wellness appointment is scheduled.',
          type: 'success'
        });
      }
    } catch {
      addToast({ title: 'Error', message: 'Failed to book session', type: 'error' });
    }
  };

  const counselors = data?.counselors || [];
  const helplines = data?.helplines || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 shadow-xs">
              <Heart className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Student Health & Wellness Sanctuary</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">Confidential psychological counseling, campus medical clinic, mood check-in, and 24/7 SOS hotlines</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5" /> 100% Confidential & Anonymous
          </span>
        </div>
      </div>

      {/* Mood Check-in Strip */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-card space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">How are you feeling today?</h3>
            <p className="text-xs text-slate-500">Track your daily wellness score and academic stress balance</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {[
            { id: 'CALM', label: 'Calm & Balanced', icon: Smile, color: 'text-emerald-600', bg: 'hover:bg-emerald-50' },
            { id: 'FOCUSED', label: 'Focused & Productive', icon: Zap, color: 'text-blue-600', bg: 'hover:bg-blue-50' },
            { id: 'STRESSED', label: 'Academic Stress', icon: Meh, color: 'text-amber-600', bg: 'hover:bg-amber-50' },
            { id: 'OVERWHELMED', label: 'Need Support', icon: Frown, color: 'text-rose-600', bg: 'hover:bg-rose-50' },
          ].map(m => {
            const Icon = m.icon;
            const isSelected = selectedMood === m.id;
            return (
              <button
                key={m.id}
                onClick={() => handleMoodSelect(m.id)}
                className={cn(
                  'p-3.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-1.5 shadow-xs',
                  isSelected ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-500/20' : 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
                )}
              >
                <Icon className={cn('w-6 h-6', m.color)} />
                <span className="text-xs font-semibold text-slate-800">{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 24/7 Emergency Helplines SOS Box */}
      <div className="bg-rose-50/80 border border-rose-200 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
            <AlertTriangle className="w-5 h-5" /> 24/7 Rapid Emergency Helplines & SOS Dispatch
          </div>
          <span className="text-xs font-mono font-bold text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-full">Toll-Free</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {helplines.map((h: any, idx: number) => (
            <div key={idx} className="bg-white border border-rose-200/60 rounded-2xl p-4 shadow-xs space-y-1">
              <p className="text-xs font-bold text-slate-900">{h.name}</p>
              <p className="text-sm font-mono font-bold text-rose-600 flex items-center gap-1.5">
                <Phone className="w-4 h-4" /> {h.phone}
              </p>
              <p className="text-[11px] text-slate-500">{h.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Counselors List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Book 1-on-1 Confidential Guidance Session</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {counselors.map((c: any) => (
            <div key={c.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-card flex flex-col justify-between space-y-4 hover:border-rose-300 transition-all">
              <div className="space-y-3">
                <div className="flex items-start gap-4">
                  <img
                    src={c.avatar}
                    alt={c.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-100 shadow-xs"
                  />
                  <div>
                    <h4 className="text-base font-bold text-slate-900">{c.name}</h4>
                    <p className="text-xs text-rose-600 font-semibold">{c.role}</p>
                    <p className="text-[11px] text-slate-500">Experience: {c.experience}</p>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <p className="text-xs font-semibold text-slate-700">Specialization Focus:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {c.specialties.map((spec: string, i: number) => (
                      <span key={i} className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setSelectedCounselor(c)}
                  className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" /> Book Private Session
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      {selectedCounselor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full shadow-2xl relative space-y-4">
            <button onClick={() => setSelectedCounselor(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer">
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
                100% Confidential
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">Book with {selectedCounselor.name}</h3>
              <p className="text-xs text-slate-500">Room 204 • Campus Wellness Suite</p>
            </div>

            <form onSubmit={handleConfirmBooking} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1.5">Select Appointment Time</label>
                <div className="space-y-2">
                  {selectedCounselor.availableSlots.map((slot: string) => (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={cn(
                        'w-full p-2.5 rounded-xl border text-left font-medium text-xs flex items-center justify-between cursor-pointer transition-all',
                        selectedSlot === slot ? 'bg-rose-50 border-rose-400 text-rose-800 font-semibold' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      )}
                    >
                      <span>{slot}</span>
                      {selectedSlot === slot && <CheckCircle2 className="w-4 h-4 text-rose-600" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <input
                  type="checkbox"
                  id="anon"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500"
                />
                <label htmlFor="anon" className="text-xs text-slate-700 font-medium cursor-pointer">
                  Book anonymously (Mask student identity in records)
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Confirm Appointment
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
