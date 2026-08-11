'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, Save, Loader2 } from 'lucide-react';

type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE';

export default function FacultyAttendancePage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState('Data Structures');
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadStudents() {
      try {
        setLoading(true);
        const res = await fetch('/api/users');
        const data = await res.json();
        if (Array.isArray(data)) {
          const studentList = data.filter((u: any) => u.role === 'STUDENT' && u.studentProfile);
          setStudents(studentList);
          setAttendance(
            Object.fromEntries(studentList.map((s: any) => [s.studentProfile.id, 'PRESENT']))
          );
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadStudents();
  }, []);

  const markAll = (status: AttendanceStatus) => {
    setAttendance(Object.fromEntries(students.map(s => [s.studentProfile.id, status])));
  };

  const toggleAttendance = (studentProfileId: string) => {
    setAttendance(prev => ({
      ...prev,
      [studentProfileId]: prev[studentProfileId] === 'PRESENT' ? 'ABSENT' : prev[studentProfileId] === 'ABSENT' ? 'LATE' : 'PRESENT'
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const records = Object.entries(attendance).map(([studentId, status]) => ({
        studentId,
        status,
      }));
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ records, subject: selectedSubject, markedBy: 'Dr. Priya Sharma' }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const presentCount = Object.values(attendance).filter(s => s === 'PRESENT').length;
  const absentCount = Object.values(attendance).filter(s => s === 'ABSENT').length;
  const lateCount = Object.values(attendance).filter(s => s === 'LATE').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Mark Class Attendance</h1>
          <p className="text-xs text-slate-500 mt-1">Real-time attendance entry for enrolled database students</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : saved ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" /> : <Save className="w-3.5 h-3.5" />}
          {saved ? 'Saved to Database!' : 'Commit Attendance'}
        </button>
      </div>

      <div className="flex flex-wrap gap-2.5">
        <select value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)}
          className="bg-white border border-slate-200 text-slate-900 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-blue-600">
          <option value="Data Structures">Data Structures & Algorithms</option>
          <option value="DBMS">Database Management Systems</option>
          <option value="Operating Systems">Operating Systems</option>
          <option value="Computer Networks">Computer Networks</option>
        </select>
        <button onClick={() => markAll('PRESENT')} className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium hover:bg-slate-200 transition-colors cursor-pointer">Mark All Present</button>
        <button onClick={() => markAll('ABSENT')} className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium hover:bg-slate-200 transition-colors cursor-pointer">Mark All Absent</button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center shadow-card">
          <p className="text-xs text-slate-500 font-medium">Present</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{presentCount}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center shadow-card">
          <p className="text-xs text-slate-500 font-medium">Absent</p>
          <p className="text-2xl font-bold text-red-600 mt-1">{absentCount}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center shadow-card">
          <p className="text-xs text-slate-500 font-medium">Late</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{lateCount}</p>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-blue-600" /> Loading student roster from database...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {students.map((s) => {
            const status = attendance[s.studentProfile.id];
            return (
              <button
                key={s.id}
                onClick={() => toggleAttendance(s.studentProfile.id)}
                className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  status === 'PRESENT' ? 'bg-emerald-50/40 border-emerald-200 hover:bg-emerald-50/70' :
                  status === 'ABSENT' ? 'bg-red-50/40 border-red-200 hover:bg-red-50/70' :
                  'bg-amber-50/40 border-amber-200 hover:bg-amber-50/70'
                }`}
              >
                <div>
                  <p className="text-xs font-semibold text-slate-900">{s.name}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Roll: {s.studentProfile.rollNumber}</p>
                </div>
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                  status === 'PRESENT' ? 'badge-success' : status === 'ABSENT' ? 'badge-danger' : 'badge-warning'
                }`}>
                  {status}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
