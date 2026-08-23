'use client';

import { useState } from 'react';
import {
  Calendar,
  Clock,
  Video,
  Building,
  User,
  X,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { useToast } from '@/lib/toastContext';

interface PtmModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FACULTY_LIST = [
  { id: 'f1', name: 'Dr. Priya Sharma', subject: 'Head of Dept & DAA Mentor', email: 'priya.sharma@campushub.edu' },
  { id: 'f2', name: 'Prof. Rahul Gupta', subject: 'Database Management Systems', email: 'rahul.gupta@campushub.edu' },
  { id: 'f3', name: 'Dr. Anita Patel', subject: 'Operating Systems Course Lead', email: 'anita.patel@campushub.edu' },
];

const TIME_SLOTS = [
  '10:30 AM - 11:00 AM (Morning)',
  '02:30 PM - 03:00 PM (Afternoon)',
  '04:30 PM - 05:00 PM (After Classes)',
  '06:00 PM - 06:30 PM (Virtual Evening)',
];

export default function PtmSchedulerModal({ isOpen, onClose }: PtmModalProps) {
  const { toast } = useToast();
  const [selectedFaculty, setSelectedFaculty] = useState('f1');
  const [selectedSlot, setSelectedSlot] = useState(TIME_SLOTS[0]);
  const [meetingDate, setMeetingDate] = useState('2026-08-28');
  const [mode, setMode] = useState<'VIDEO' | 'IN_PERSON'>('VIDEO');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsSubmitting(false);

    const faculty = FACULTY_LIST.find((f) => f.id === selectedFaculty);
    toast.success(
      `Appointment booked with ${faculty?.name} on ${meetingDate}! An email invite with calendar link has been sent.`,
      'Meeting Confirmed'
    );
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Schedule Parent-Teacher Consultation (PTM)</h3>
              <p className="text-[11px] text-slate-500">1-on-1 Academic Discussion & Mentorship Session</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">Select Faculty Mentor</label>
            <div className="space-y-2">
              {FACULTY_LIST.map((f) => (
                <div
                  key={f.id}
                  onClick={() => setSelectedFaculty(f.id)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    selectedFaculty === f.id
                      ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/10'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs">
                      {f.name.charAt(3)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{f.name}</h4>
                      <p className="text-[10px] text-slate-500">{f.subject}</p>
                    </div>
                  </div>
                  {selectedFaculty === f.id && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Preferred Date</label>
              <input
                type="date"
                value={meetingDate}
                onChange={(e) => setMeetingDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white outline-none"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Time Slot</label>
              <select
                value={selectedSlot}
                onChange={(e) => setSelectedSlot(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white outline-none text-[11px]"
              >
                {TIME_SLOTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Mode switch */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">Meeting Format</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMode('VIDEO')}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  mode === 'VIDEO'
                    ? 'border-blue-600 bg-blue-50/50 text-blue-900 font-bold'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <Video className="w-4 h-4 mx-auto mb-1 text-blue-600" />
                <span className="text-xs">Google Meet (Online)</span>
              </button>
              <button
                type="button"
                onClick={() => setMode('IN_PERSON')}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  mode === 'IN_PERSON'
                    ? 'border-blue-600 bg-blue-50/50 text-blue-900 font-bold'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <Building className="w-4 h-4 mx-auto mb-1 text-emerald-600" />
                <span className="text-xs">Campus Office Visit</span>
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Discussion Agenda / Questions</label>
            <textarea
              rows={2}
              placeholder="e.g. Inquire about mid-term exam performance and placement readiness..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:border-blue-600 outline-none resize-none"
            />
          </div>

          <div className="pt-2 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs transition-colors"
            >
              {isSubmitting ? 'Booking...' : 'Confirm Consultation Slot'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
