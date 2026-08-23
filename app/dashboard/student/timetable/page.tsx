'use client';

import { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Download,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Radio,
  ExternalLink,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { useToast } from '@/lib/toastContext';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

interface ClassSlot {
  subject: string;
  code: string;
  faculty: string;
  room: string;
  type: 'LECTURE' | 'LAB' | 'TUTORIAL' | 'FREE' | 'EXTRA';
  building: string;
}

const PERIODS = [
  { label: '9:00 - 10:00 AM', start: '9:00', end: '10:00' },
  { label: '10:15 - 11:15 AM', start: '10:15', end: '11:15' },
  { label: '11:30 - 12:30 PM', start: '11:30', end: '12:30' },
  { label: '12:30 - 1:15 PM (Lunch Break)', start: 'lunch', end: 'lunch', isBreak: true },
  { label: '1:15 - 2:15 PM', start: '1:15', end: '2:15' },
  { label: '2:15 - 3:15 PM', start: '2:15', end: '3:15' },
  { label: '3:30 - 4:30 PM', start: '3:30', end: '4:30' },
];

const TIMETABLE: Record<string, Record<string, ClassSlot | null>> = {
  Monday: {
    '9:00': { subject: 'Data Structures & Algorithms', code: 'CS501', faculty: 'Dr. Priya Sharma', room: 'CS-101', building: 'Tech Block A', type: 'LECTURE' },
    '10:15': { subject: 'Database Management Systems', code: 'CS502', faculty: 'Prof. Rahul Gupta', room: 'CS-102', building: 'Tech Block A', type: 'LECTURE' },
    '11:30': { subject: 'Operating Systems', code: 'CS503', faculty: 'Dr. Anita Patel', room: 'CS-103', building: 'Tech Block A', type: 'LECTURE' },
    '1:15': { subject: 'Computer Networks Lab', code: 'CS504L', faculty: 'Dr. Priya Sharma', room: 'CS-Lab 1', building: 'Computing Center', type: 'LAB' },
    '2:15': { subject: 'Computer Networks Lab', code: 'CS504L', faculty: 'Dr. Priya Sharma', room: 'CS-Lab 1', building: 'Computing Center', type: 'LAB' },
    '3:30': { subject: 'Software Engineering', code: 'CS505', faculty: 'Prof. Vikram Mehta', room: 'CS-104', building: 'Tech Block A', type: 'LECTURE' },
  },
  Tuesday: {
    '9:00': { subject: 'Software Engineering', code: 'CS505', faculty: 'Prof. Vikram Mehta', room: 'CS-104', building: 'Tech Block A', type: 'LECTURE' },
    '10:15': { subject: 'DSA Advanced Lab', code: 'CS501L', faculty: 'Dr. Priya Sharma', room: 'CS-Lab 2', building: 'Computing Center', type: 'LAB' },
    '11:30': { subject: 'DSA Advanced Lab', code: 'CS501L', faculty: 'Dr. Priya Sharma', room: 'CS-Lab 2', building: 'Computing Center', type: 'LAB' },
    '1:15': { subject: 'Operating Systems', code: 'CS503', faculty: 'Dr. Anita Patel', room: 'CS-103', building: 'Tech Block A', type: 'LECTURE' },
    '2:15': { subject: 'DBMS Tutorial & Problem Solving', code: 'CS502T', faculty: 'Prof. Rahul Gupta', room: 'CS-102', building: 'Tech Block A', type: 'TUTORIAL' },
    '3:30': null,
  },
  Wednesday: {
    '9:00': { subject: 'Computer Networks', code: 'CS504', faculty: 'Dr. Priya Sharma', room: 'CS-101', building: 'Tech Block A', type: 'LECTURE' },
    '10:15': { subject: 'Operating Systems', code: 'CS503', faculty: 'Dr. Anita Patel', room: 'CS-103', building: 'Tech Block A', type: 'LECTURE' },
    '11:30': { subject: 'Database Management Systems', code: 'CS502', faculty: 'Prof. Rahul Gupta', room: 'CS-102', building: 'Tech Block A', type: 'LECTURE' },
    '1:15': { subject: 'Library & Self Directed Research', code: 'SDR01', faculty: 'Prof. Librarian', room: 'Central Library', building: 'Knowledge Hub', type: 'FREE' },
    '2:15': { subject: 'Data Structures & Algorithms', code: 'CS501', faculty: 'Dr. Priya Sharma', room: 'CS-101', building: 'Tech Block A', type: 'LECTURE' },
    '3:30': null,
  },
  Thursday: {
    '9:00': { subject: 'Database Management Systems', code: 'CS502', faculty: 'Prof. Rahul Gupta', room: 'CS-102', building: 'Tech Block A', type: 'LECTURE' },
    '10:15': { subject: 'Software Engineering', code: 'CS505', faculty: 'Prof. Vikram Mehta', room: 'CS-104', building: 'Tech Block A', type: 'LECTURE' },
    '11:30': { subject: 'Computer Networks Lab', code: 'CS504L', faculty: 'Dr. Priya Sharma', room: 'CS-Lab 1', building: 'Computing Center', type: 'LAB' },
    '1:15': { subject: 'Computer Networks Lab', code: 'CS504L', faculty: 'Dr. Priya Sharma', room: 'CS-Lab 1', building: 'Computing Center', type: 'LAB' },
    '2:15': { subject: 'Operating Systems System Call Lab', code: 'CS503L', faculty: 'Dr. Anita Patel', room: 'CS-Lab 3', building: 'Computing Center', type: 'LAB' },
    '3:30': { subject: 'Operating Systems System Call Lab', code: 'CS503L', faculty: 'Dr. Anita Patel', room: 'CS-Lab 3', building: 'Computing Center', type: 'LAB' },
  },
  Friday: {
    '9:00': { subject: 'Data Structures & Algorithms', code: 'CS501', faculty: 'Dr. Priya Sharma', room: 'CS-101', building: 'Tech Block A', type: 'LECTURE' },
    '10:15': { subject: 'Computer Networks', code: 'CS504', faculty: 'Dr. Priya Sharma', room: 'CS-101', building: 'Tech Block A', type: 'LECTURE' },
    '11:30': { subject: 'Software Engineering', code: 'CS505', faculty: 'Prof. Vikram Mehta', room: 'CS-104', building: 'Tech Block A', type: 'LECTURE' },
    '1:15': { subject: 'DBMS SQL & Indexing Lab', code: 'CS502L', faculty: 'Prof. Rahul Gupta', room: 'CS-Lab 2', building: 'Computing Center', type: 'LAB' },
    '2:15': { subject: 'DBMS SQL & Indexing Lab', code: 'CS502L', faculty: 'Prof. Rahul Gupta', room: 'CS-Lab 2', building: 'Computing Center', type: 'LAB' },
    '3:30': null,
  },
  Saturday: {
    '9:00': { subject: 'Academic Remedial & Doubt Clearing', code: 'REM01', faculty: 'Faculty Mentors', room: 'CS-101', building: 'Tech Block A', type: 'EXTRA' },
    '10:15': { subject: 'Capstone Major Project Work', code: 'PRJ501', faculty: 'Project Advisory Board', room: 'CS-Lab 1', building: 'Computing Center', type: 'LAB' },
    '11:30': { subject: 'Capstone Major Project Work', code: 'PRJ501', faculty: 'Project Advisory Board', room: 'CS-Lab 1', building: 'Computing Center', type: 'LAB' },
    '1:15': null,
    '2:15': null,
    '3:30': null,
  },
};

export default function StudentTimetablePage() {
  const { toast } = useToast();
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [selectedSlot, setSelectedSlot] = useState<ClassSlot | null>(null);

  // Set default day to today if weekday
  useEffect(() => {
    const todayIndex = new Date().getDay(); // 0 is Sunday
    if (todayIndex >= 1 && todayIndex <= 6) {
      setSelectedDay(DAYS[todayIndex - 1]);
    }
  }, []);

  const handleExportICS = () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//CampusHub AI//Smart Timetable//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:CampusHub Semester Timetable
BEGIN:VEVENT
SUMMARY:Data Structures & Algorithms (CS501)
LOCATION:CS-101, Tech Block A
DESCRIPTION:Lecture by Dr. Priya Sharma
RRULE:FREQ=WEEKLY;BYDAY=MO,WE,FR
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'campushub-timetable.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success('Timetable exported! You can import this .ics into Google Calendar or Apple Calendar.', 'Export Success');
  };

  const getSlotTypeBadge = (type: string) => {
    switch (type) {
      case 'LAB':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'TUTORIAL':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'FREE':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'EXTRA':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Interactive Weekly Timetable</h1>
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 border border-blue-200 text-blue-700">
              <Radio className="w-3 h-3 text-blue-600 animate-pulse" /> 5th Semester • Section A
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Weekly class schedule, lecture hall locations, instructor contacts, and instant Google/Apple Calendar export
          </p>
        </div>

        <button
          onClick={handleExportICS}
          className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
        >
          <Download className="w-3.5 h-3.5" /> Sync to Calendar (.ics)
        </button>
      </div>

      {/* Day Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {DAYS.map((day) => {
          const isSelected = selectedDay === day;
          const slots = Object.values(TIMETABLE[day] || {}).filter(Boolean);
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`flex-1 min-w-[120px] p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/10'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <span className={`text-[10px] uppercase font-bold block ${isSelected ? 'text-blue-200' : 'text-slate-400'}`}>
                {day.substring(0, 3)}
              </span>
              <p className="text-xs font-bold truncate mt-0.5">{day}</p>
              <span className={`text-[10px] mt-1 block ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                {slots.length} Sessions
              </span>
            </button>
          );
        })}
      </div>

      {/* Schedule Timeline for Selected Day */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
        <h2 className="text-sm font-bold text-slate-900 mb-2 flex items-center justify-between">
          <span>{selectedDay}&apos;s Academic Schedule</span>
          <span className="text-xs text-slate-400 font-normal">Department of Computer Science</span>
        </h2>

        <div className="space-y-3">
          {PERIODS.map((period) => {
            if (period.isBreak) {
              return (
                <div
                  key="lunch-break"
                  className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/60 flex items-center justify-center gap-2 text-amber-900 text-xs font-semibold"
                >
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>12:30 PM - 1:15 PM • Campus Lunch & Refreshment Break</span>
                </div>
              );
            }

            const slot = TIMETABLE[selectedDay]?.[period.start];

            if (!slot) {
              return (
                <div
                  key={period.start}
                  className="p-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/40 flex items-center justify-between text-slate-400 text-xs"
                >
                  <span className="font-mono text-[11px] text-slate-500">{period.label}</span>
                  <span className="italic text-[11px]">Free Study Period / No Scheduled Lecture</span>
                </div>
              );
            }

            return (
              <div
                key={period.start}
                onClick={() => setSelectedSlot(slot)}
                className="p-4 rounded-xl border border-slate-200 hover:border-blue-400 bg-white hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 cursor-pointer group"
              >
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-28 flex-shrink-0">
                    <span className="text-xs font-bold text-slate-900 block font-mono">{period.start}</span>
                    <span className="text-[10px] text-slate-400">{period.label}</span>
                  </div>

                  <div className="border-l border-slate-200 pl-4 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {slot.subject}
                      </h3>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase ${getSlotTypeBadge(slot.type)}`}>
                        {slot.type}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                        {slot.code}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3 text-slate-400" /> {slot.faculty}
                      </span>
                      <span className="flex items-center gap-1 text-slate-600 font-medium">
                        <MapPin className="w-3 h-3 text-blue-600" /> {slot.room} ({slot.building})
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <span className="text-[11px] font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                    Details <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Classroom Details Modal */}
      {selectedSlot && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in"
          onClick={() => setSelectedSlot(null)}
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase ${getSlotTypeBadge(selectedSlot.type)}`}>
                  {selectedSlot.type}
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-1.5">{selectedSlot.subject}</h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">{selectedSlot.code}</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" /> Instructor
                </span>
                <strong className="text-slate-800">{selectedSlot.faculty}</strong>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" /> Location
                </span>
                <strong className="text-slate-800">
                  {selectedSlot.room} • {selectedSlot.building}
                </strong>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => {
                  toast.success(`Opening indoor navigation map for ${selectedSlot.room}...`);
                  setSelectedSlot(null);
                }}
                className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold cursor-pointer"
              >
                Find on Campus Map
              </button>
              <button
                onClick={() => setSelectedSlot(null)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-medium cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
