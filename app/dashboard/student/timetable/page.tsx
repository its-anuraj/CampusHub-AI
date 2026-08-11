'use client';

import { useState } from 'react';
import { User, MapPin } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const PERIODS = [
  { label: '9:00 - 10:00', start: '9:00' },
  { label: '10:15 - 11:15', start: '10:15' },
  { label: '11:30 - 12:30', start: '11:30' },
  { label: '12:30 - 1:15 (Lunch)', start: 'lunch', isBreak: true },
  { label: '1:15 - 2:15', start: '1:15' },
  { label: '2:15 - 3:15', start: '2:15' },
  { label: '3:30 - 4:30', start: '3:30' },
];

const TIMETABLE: Record<string, Record<string, { subject: string; faculty: string; room: string; type: string } | null>> = {
  Monday: {
    '9:00': { subject: 'Data Structures', faculty: 'Dr. Priya Sharma', room: 'CS-101', type: 'LECTURE' },
    '10:15': { subject: 'DBMS', faculty: 'Prof. Rahul Gupta', room: 'CS-102', type: 'LECTURE' },
    '11:30': { subject: 'Operating Systems', faculty: 'Dr. Anita Patel', room: 'CS-103', type: 'LECTURE' },
    '1:15': { subject: 'Networks Lab', faculty: 'Dr. Priya Sharma', room: 'CS-Lab1', type: 'LAB' },
    '2:15': { subject: 'Networks Lab', faculty: 'Dr. Priya Sharma', room: 'CS-Lab1', type: 'LAB' },
    '3:30': { subject: 'Software Eng', faculty: 'Prof. Vikram Mehta', room: 'CS-104', type: 'LECTURE' },
  },
  Tuesday: {
    '9:00': { subject: 'Software Eng', faculty: 'Prof. Vikram Mehta', room: 'CS-104', type: 'LECTURE' },
    '10:15': { subject: 'DSA Lab', faculty: 'Dr. Priya Sharma', room: 'CS-Lab2', type: 'LAB' },
    '11:30': { subject: 'DSA Lab', faculty: 'Dr. Priya Sharma', room: 'CS-Lab2', type: 'LAB' },
    '1:15': { subject: 'Operating Systems', faculty: 'Dr. Anita Patel', room: 'CS-103', type: 'LECTURE' },
    '2:15': { subject: 'DBMS Tutorial', faculty: 'Prof. Rahul Gupta', room: 'CS-102', type: 'TUTORIAL' },
    '3:30': null,
  },
  Wednesday: {
    '9:00': { subject: 'Computer Networks', faculty: 'Dr. Priya Sharma', room: 'CS-101', type: 'LECTURE' },
    '10:15': { subject: 'Operating Systems', faculty: 'Dr. Anita Patel', room: 'CS-103', type: 'LECTURE' },
    '11:30': { subject: 'DBMS', faculty: 'Prof. Rahul Gupta', room: 'CS-102', type: 'LECTURE' },
    '1:15': { subject: 'Self Study', faculty: '-', room: 'Library', type: 'FREE' },
    '2:15': { subject: 'Data Structures', faculty: 'Dr. Priya Sharma', room: 'CS-101', type: 'LECTURE' },
    '3:30': null,
  },
  Thursday: {
    '9:00': { subject: 'DBMS', faculty: 'Prof. Rahul Gupta', room: 'CS-102', type: 'LECTURE' },
    '10:15': { subject: 'Software Eng', faculty: 'Prof. Vikram Mehta', room: 'CS-104', type: 'LECTURE' },
    '11:30': { subject: 'Networks Lab', faculty: 'Dr. Priya Sharma', room: 'CS-Lab1', type: 'LAB' },
    '1:15': { subject: 'Networks Lab', faculty: 'Dr. Priya Sharma', room: 'CS-Lab1', type: 'LAB' },
    '2:15': { subject: 'OS Lab', faculty: 'Dr. Anita Patel', room: 'CS-Lab3', type: 'LAB' },
    '3:30': { subject: 'OS Lab', faculty: 'Dr. Anita Patel', room: 'CS-Lab3', type: 'LAB' },
  },
  Friday: {
    '9:00': { subject: 'Data Structures', faculty: 'Dr. Priya Sharma', room: 'CS-101', type: 'LECTURE' },
    '10:15': { subject: 'Computer Networks', faculty: 'Dr. Priya Sharma', room: 'CS-101', type: 'LECTURE' },
    '11:30': { subject: 'Software Eng', faculty: 'Prof. Vikram Mehta', room: 'CS-104', type: 'LECTURE' },
    '1:15': { subject: 'DBMS Lab', faculty: 'Prof. Rahul Gupta', room: 'CS-Lab2', type: 'LAB' },
    '2:15': { subject: 'DBMS Lab', faculty: 'Prof. Rahul Gupta', room: 'CS-Lab2', type: 'LAB' },
    '3:30': null,
  },
  Saturday: {
    '9:00': { subject: 'Remedial Class', faculty: 'Various', room: 'CS-101', type: 'EXTRA' },
    '10:15': { subject: 'Project Work', faculty: 'Guide', room: 'CS-Lab1', type: 'LAB' },
    '11:30': null, '1:15': null, '2:15': null, '3:30': null,
  },
};

const today = DAYS[Math.min(new Date().getDay() - 1, 5)];

export default function StudentTimetablePage() {
  const [selectedDay, setSelectedDay] = useState(today || 'Monday');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Academic Timetable</h1>
          <p className="text-xs text-slate-500 mt-1">Computer Science Engineering • Semester 5 • Section A</p>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap bg-white border border-slate-200 rounded-xl p-1.5 shadow-xs">
        {DAYS.map(day => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedDay === day ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {day} {day === today && '●'}
          </button>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-card">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">{selectedDay} Schedule</h3>
          <span className="text-xs text-slate-500 font-medium">Semester 5</span>
        </div>

        <div className="divide-y divide-slate-100">
          {PERIODS.map(p => {
            if (p.isBreak) {
              return (
                <div key={p.start} className="p-3 bg-slate-50/60 text-center text-xs text-slate-500 font-medium">
                  🍱 12:30 PM - 1:15 PM Lunch Break
                </div>
              );
            }
            const cls = TIMETABLE[selectedDay]?.[p.start];
            return (
              <div key={p.start} className="p-4 flex items-center gap-4 hover:bg-slate-50/50 transition-colors text-xs">
                <div className="w-28 flex-shrink-0 font-semibold text-slate-900">{p.label}</div>
                {cls ? (
                  <div className="flex-1 flex items-center justify-between p-3 rounded-xl border border-slate-200/80 bg-slate-50/40">
                    <div>
                      <p className="font-semibold text-slate-900">{cls.subject}</p>
                      <div className="flex items-center gap-3 text-slate-500 text-[11px] mt-0.5">
                        <span className="flex items-center gap-1"><User className="w-3 h-3 text-slate-400" />{cls.faculty}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" />Hall {cls.room}</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white border border-slate-200 text-slate-700">{cls.type}</span>
                  </div>
                ) : (
                  <span className="text-slate-400 text-xs italic">No lecture scheduled</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
