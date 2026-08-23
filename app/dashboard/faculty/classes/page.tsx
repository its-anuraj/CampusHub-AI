'use client';

import { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  UserCheck,
  Plus,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useToast } from '@/lib/toastContext';

interface ClassSlot {
  id: string;
  day: string;
  time: string;
  subject: string;
  courseCode: string;
  room: string;
  section: string;
  studentsCount: number;
}

interface SubstitutionRequest {
  id: string;
  classSlot: string;
  date: string;
  originalFaculty: string;
  substituteFaculty: string;
  reason: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
}

const MY_SCHEDULE: ClassSlot[] = [
  { id: '1', day: 'Monday', time: '09:00 - 10:00 AM', subject: 'Data Structures & Algorithms', courseCode: 'CS501', room: 'CS-101', section: '5th Sem - Sec A', studentsCount: 64 },
  { id: '2', day: 'Monday', time: '01:15 - 03:15 PM', subject: 'Computer Networks Lab', courseCode: 'CS504L', room: 'CS-Lab 1', section: '5th Sem - Sec B', studentsCount: 32 },
  { id: '3', day: 'Tuesday', time: '10:15 - 12:30 PM', subject: 'DSA Advanced Practical Lab', courseCode: 'CS501L', room: 'CS-Lab 2', section: '5th Sem - Sec A', studentsCount: 34 },
  { id: '4', day: 'Wednesday', time: '09:00 - 10:00 AM', subject: 'Computer Networks', courseCode: 'CS504', room: 'CS-101', section: '5th Sem - Sec A', studentsCount: 64 },
  { id: '5', day: 'Friday', time: '09:00 - 10:00 AM', subject: 'Data Structures & Algorithms', courseCode: 'CS501', room: 'CS-101', section: '5th Sem - Sec A', studentsCount: 64 },
];

const INITIAL_SUB_REQUESTS: SubstitutionRequest[] = [
  {
    id: 'SUB-101',
    classSlot: 'Computer Networks (CS504) - Wed 9:00 AM',
    date: '27 Aug 2026',
    originalFaculty: 'Dr. Priya Sharma',
    substituteFaculty: 'Prof. Rahul Gupta',
    reason: 'Attending IEEE AI & Cloud Systems Conference',
    status: 'ACCEPTED',
  },
  {
    id: 'SUB-102',
    classSlot: 'Operating Systems (CS503) - Thu 10:15 AM',
    date: '28 Aug 2026',
    originalFaculty: 'Dr. Anita Patel',
    substituteFaculty: 'Dr. Priya Sharma (You)',
    reason: 'Medical Leave',
    status: 'PENDING',
  },
];

export default function FacultyClassesPage() {
  const { toast } = useToast();
  const [schedule, setSchedule] = useState<ClassSlot[]>(MY_SCHEDULE);
  const [substitutions, setSubstitutions] = useState<SubstitutionRequest[]>(INITIAL_SUB_REQUESTS);
  const [showSubModal, setShowSubModal] = useState(false);

  // Substitution Form
  const [selectedSlotId, setSelectedSlotId] = useState('1');
  const [subDate, setSubDate] = useState('2026-08-28');
  const [subTeacher, setSubTeacher] = useState('Prof. Rahul Gupta');
  const [reason, setReason] = useState('');

  const handleCreateSubRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      toast.warning('Please enter reason for substitution.');
      return;
    }

    const slot = schedule.find((s) => s.id === selectedSlotId);
    const newReq: SubstitutionRequest = {
      id: `SUB-${Math.floor(100 + Math.random() * 900)}`,
      classSlot: `${slot?.subject} (${slot?.courseCode}) - ${slot?.day} ${slot?.time}`,
      date: subDate,
      originalFaculty: 'Dr. Priya Sharma (You)',
      substituteFaculty: subTeacher,
      reason,
      status: 'PENDING',
    };

    setSubstitutions([newReq, ...substitutions]);
    setReason('');
    setShowSubModal(false);
    toast.success(`Substitution request sent to ${subTeacher}!`, 'Request Dispatched');
  };

  const handleRespondSub = (id: string, accept: boolean) => {
    setSubstitutions(
      substitutions.map((s) =>
        s.id === id ? { ...s, status: accept ? 'ACCEPTED' : 'DECLINED' } : s
      )
    );
    if (accept) {
      toast.success('You have accepted to take this substitute lecture.', 'Lecture Accepted');
    } else {
      toast.info('Substitution request declined.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Class Schedule & Substitution Desk</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 uppercase">
              18 Hours / Week
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Weekly teaching schedule, lecture halls, and peer substitute faculty delegation management
          </p>
        </div>

        <button
          onClick={() => setShowSubModal(true)}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" /> Request Class Substitute
        </button>
      </div>

      {/* Weekly Schedule Grid */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-900">Your Assigned Lectures & Labs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {schedule.map((cls) => (
            <div
              key={cls.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-mono">
                    {cls.day}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" /> {cls.time}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 leading-snug">{cls.subject}</h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">{cls.courseCode} • {cls.section}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span className="flex items-center gap-1 font-semibold text-blue-600">
                  <MapPin className="w-3.5 h-3.5" /> Room {cls.room}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-slate-400" /> {cls.studentsCount} Students
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Substitution Delegation Desk */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Substitution Requests & Coverage</h2>
            <p className="text-[11px] text-slate-500">Peer faculty swap requests for conference or leave days</p>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {substitutions.map((sub) => (
            <div key={sub.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                    {sub.id}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${
                      sub.status === 'ACCEPTED'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                        : sub.status === 'DECLINED'
                        ? 'bg-rose-100 text-rose-800 border-rose-200'
                        : 'bg-amber-100 text-amber-800 border-amber-200'
                    }`}
                  >
                    {sub.status}
                  </span>
                  <span className="text-xs text-slate-400">Date: {sub.date}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900">{sub.classSlot}</h4>
                <p className="text-[11px] text-slate-600">
                  From: <strong>{sub.originalFaculty}</strong> ➔ Substitute: <strong>{sub.substituteFaculty}</strong>
                </p>
                <p className="text-[11px] text-slate-400 italic">Reason: &quot;{sub.reason}&quot;</p>
              </div>

              {sub.status === 'PENDING' && sub.substituteFaculty.includes('You') && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRespondSub(sub.id, true)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Accept
                  </button>
                  <button
                    onClick={() => handleRespondSub(sub.id, false)}
                    className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold cursor-pointer transition-colors"
                  >
                    Decline
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Substitute Request Modal */}
      {showSubModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in"
          onClick={() => setShowSubModal(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Request Substitute Faculty Coverage</h3>
              <button
                onClick={() => setShowSubModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubRequest} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Select Lecture Slot</label>
                <select
                  value={selectedSlotId}
                  onChange={(e) => setSelectedSlotId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white outline-none"
                >
                  {schedule.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.day} {s.time} - {s.subject} ({s.courseCode})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Date of Absence</label>
                  <input
                    type="date"
                    value={subDate}
                    onChange={(e) => setSubDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Assign Colleague</label>
                  <select
                    value={subTeacher}
                    onChange={(e) => setSubTeacher(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white outline-none"
                  >
                    <option value="Prof. Rahul Gupta">Prof. Rahul Gupta</option>
                    <option value="Dr. Anita Patel">Dr. Anita Patel</option>
                    <option value="Prof. Vikram Mehta">Prof. Vikram Mehta</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Reason / Lecture Syllabus Target</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Please continue with Unit 3 Binary Trees problem sets..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:border-blue-600 outline-none resize-none"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSubModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs"
                >
                  Dispatch Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
