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
  Filter,
  Layers,
  X
} from 'lucide-react';
import { useToast } from '@/lib/toastContext';
import { cn } from '@/lib/utils';
import Link from 'next/link';

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
  const { addToast } = useToast();
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [selectedSlot, setSelectedSlot] = useState<ClassSlot | null>(null);
  const [filterType, setFilterType] = useState<string>('ALL');

  useEffect(() => {
    const todayIndex = new Date().getDay();
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

    addToast({
      title: 'Timetable Exported',
      message: 'iCalendar (.ics) downloaded. Sync it directly with Google Calendar or Apple Calendar.',
      type: 'success'
    });
  };

  const getSlotTypeBadge = (type: string) => {
    switch (type) {
      case 'LAB':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
      case 'TUTORIAL':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'FREE':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'EXTRA':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
      default:
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wider">
            <Radio className="w-3.5 h-3.5 text-green-300 animate-pulse" /> 5th Semester • Section A
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Interactive Class Timetable & Schedule</h1>
          <p className="text-white/90 text-sm sm:text-base">
            Weekly class schedule, lecture hall locations, instructor contacts, and instant Google/Apple Calendar (.ics) export.
          </p>
        </div>
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Control Strip */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
        {/* Day Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 flex-1">
          {DAYS.map((day) => {
            const isSelected = selectedDay === day;
            const slots = Object.values(TIMETABLE[day] || {}).filter(Boolean);
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={cn(
                  "flex-1 min-w-[100px] p-3 rounded-2xl border text-left transition-all",
                  isSelected
                    ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20"
                    : "bg-card hover:bg-muted border-border text-foreground"
                )}
              >
                <span className={cn("text-[10px] uppercase font-bold block", isSelected ? "text-blue-200" : "text-muted-foreground")}>
                  {day.substring(0, 3)}
                </span>
                <p className="text-xs font-bold truncate mt-0.5">{day}</p>
                <span className={cn("text-[10px] mt-1 block", isSelected ? "text-blue-100" : "text-muted-foreground")}>
                  {slots.length} Sessions
                </span>
              </button>
            );
          })}
        </div>

        <button
          onClick={handleExportICS}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition self-end sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" /> Sync to Calendar (.ics)
        </button>
      </div>

      {/* Schedule Timeline for Selected Day */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-500" />
            <span>{selectedDay}&apos;s Academic Schedule</span>
          </h2>
          <span className="text-xs text-muted-foreground font-medium">Department of Computer Science</span>
        </div>

        <div className="space-y-3">
          {PERIODS.map((period) => {
            if (period.isBreak) {
              return (
                <div
                  key="lunch-break"
                  className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-semibold"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>12:30 PM - 1:15 PM • Campus Lunch & Refreshment Break</span>
                </div>
              );
            }

            const slot = TIMETABLE[selectedDay]?.[period.start];

            if (!slot) {
              return (
                <div
                  key={period.start}
                  className="p-4 rounded-xl border border-dashed border-border bg-muted/30 flex items-center justify-between text-muted-foreground text-xs"
                >
                  <span className="font-mono text-xs text-muted-foreground">{period.label}</span>
                  <span className="italic text-xs">Free Study Period / No Scheduled Lecture</span>
                </div>
              );
            }

            return (
              <div
                key={period.start}
                onClick={() => setSelectedSlot(slot)}
                className="p-4 rounded-xl border border-border hover:border-blue-500 bg-card hover:bg-muted/30 hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 cursor-pointer group"
              >
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-28 shrink-0">
                    <span className="text-xs font-bold text-foreground block font-mono">{period.start}</span>
                    <span className="text-[11px] text-muted-foreground">{period.label}</span>
                  </div>

                  <div className="border-l border-border pl-4 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-foreground group-hover:text-blue-600 transition-colors">
                        {slot.subject}
                      </h3>
                      <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded border uppercase", getSlotTypeBadge(slot.type))}>
                        {slot.type}
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                        {slot.code}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5" /> {slot.faculty}
                      </span>
                      <span className="flex items-center gap-1 text-foreground font-medium">
                        <MapPin className="w-3.5 h-3.5 text-blue-500" /> {slot.room} ({slot.building})
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in zoom-in-95 duration-200"
          onClick={() => setSelectedSlot(null)}
        >
          <div
            className="w-full max-w-md bg-card rounded-2xl shadow-2xl border border-border p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-border pb-3">
              <div>
                <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded border uppercase", getSlotTypeBadge(selectedSlot.type))}>
                  {selectedSlot.type}
                </span>
                <h3 className="text-base font-bold text-foreground mt-1.5">{selectedSlot.subject}</h3>
                <p className="text-xs text-muted-foreground font-mono mt-0.5">{selectedSlot.code}</p>
              </div>
              <button onClick={() => setSelectedSlot(null)} className="p-1 rounded-lg text-muted-foreground hover:bg-muted">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-muted-foreground" /> Instructor
                </span>
                <strong className="text-foreground">{selectedSlot.faculty}</strong>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-500" /> Location
                </span>
                <strong className="text-foreground">
                  {selectedSlot.room} • {selectedSlot.building}
                </strong>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Link
                href="/dashboard/student/campus-map"
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition"
              >
                Find on Campus Map
              </Link>
              <button
                onClick={() => setSelectedSlot(null)}
                className="px-3.5 py-2 rounded-xl border border-border hover:bg-muted text-foreground text-xs font-medium"
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
