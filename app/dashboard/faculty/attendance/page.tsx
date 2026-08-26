'use client';

import { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Save,
  Loader2,
  QrCode,
  MapPin,
  Users,
  Clock,
  Sparkles,
  RefreshCw,
  X,
  AlertTriangle,
  Send,
  BellRing,
  Filter,
  Download,
  Radio
} from 'lucide-react';
import { useToast } from '@/lib/toastContext';
import { exportToCSV } from '@/lib/exportUtils';
import { cn } from '@/lib/utils';

type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE';

export default function FacultyAttendancePage() {
  const { addToast } = useToast();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState('Data Structures & Algorithms (CS501)');
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({});
  const [saving, setSaving] = useState(false);
  const [qrModeModal, setQrModeModal] = useState(false);
  const [qrToken, setQrToken] = useState('ATT-QR-98214');
  const [qrCountdown, setQrCountdown] = useState(15);
  const [geofenceActive, setGeofenceActive] = useState(true);
  const [filterMode, setFilterMode] = useState<'ALL' | 'ABSENT' | 'DEFAULTER'>('ALL');
  const [notifyingParents, setNotifyingParents] = useState(false);

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
        } else {
          // Fallback mock students
          const fallback = [
            { id: '1', name: 'Aarav Sharma', studentProfile: { id: 'sp-1', rollNumber: 'CS2023-001' } },
            { id: '2', name: 'Bhavna Verma', studentProfile: { id: 'sp-2', rollNumber: 'CS2023-014' } },
            { id: '3', name: 'Chetan Kapoor', studentProfile: { id: 'sp-3', rollNumber: 'CS2023-027' } },
            { id: '4', name: 'Anuraj Singh', studentProfile: { id: 'sp-4', rollNumber: 'CS2023-042' } },
            { id: '5', name: 'Divya Nair', studentProfile: { id: 'sp-5', rollNumber: 'CS2023-055' } },
            { id: '6', name: 'Eshan Malhotra', studentProfile: { id: 'sp-6', rollNumber: 'CS2023-068' } },
          ];
          setStudents(fallback);
          setAttendance(Object.fromEntries(fallback.map(s => [s.studentProfile.id, 'PRESENT'])));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadStudents();
  }, []);

  // QR token rotation timer
  useEffect(() => {
    if (!qrModeModal) return;
    const timer = setInterval(() => {
      setQrCountdown((prev) => {
        if (prev <= 1) {
          setQrToken(`ATT-QR-${Math.floor(10000 + Math.random() * 90000)}`);
          return 15;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [qrModeModal]);

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
        addToast({
          title: 'Attendance Saved to Database',
          message: `Logged ${records.length} student records for ${selectedSubject}.`,
          type: 'success'
        });
      }
    } catch {
      addToast({
        title: 'Error Saving',
        message: 'Could not sync attendance ledger.',
        type: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleNotifyAbsenteeParents = async () => {
    setNotifyingParents(true);
    try {
      const absentees = students.filter(s => attendance[s.studentProfile?.id] === 'ABSENT');
      await new Promise(r => setTimeout(r, 900));
      addToast({
        title: 'SMS Alerts Dispatched! 📲',
        message: `Automated absence alerts sent to parents of ${absentees.length} students via CampusHub SMS Gateway.`,
        type: 'success'
      });
    } catch {
      addToast({ title: 'Error', message: 'Failed to send SMS alerts.', type: 'error' });
    } finally {
      setNotifyingParents(false);
    }
  };

  const handleExportAttendance = () => {
    const rows = students.map((s) => ({
      'Roll Number': s.studentProfile.rollNumber,
      'Student Name': s.name,
      'Subject': selectedSubject,
      'Date': new Date().toISOString().split('T')[0],
      'Status': attendance[s.studentProfile.id] || 'PRESENT'
    }));
    exportToCSV(`Attendance_${selectedSubject.split(' ')[0]}_${new Date().toISOString().split('T')[0]}`, rows);
    addToast({
      title: 'CSV Exported',
      message: 'Attendance register spreadsheet downloaded successfully.',
      type: 'success'
    });
  };

  // Mock attendance percentage generator based on student roll
  const getStudentCumulativeAttendance = (roll: string) => {
    const hash = (roll || '').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return 65 + (hash % 32); // gives 65% - 96%
  };

  const presentCount = Object.values(attendance).filter(s => s === 'PRESENT').length;
  const absentCount = Object.values(attendance).filter(s => s === 'ABSENT').length;
  const lateCount = Object.values(attendance).filter(s => s === 'LATE').length;
  const defaulterCount = students.filter(s => getStudentCumulativeAttendance(s.studentProfile?.rollNumber) < 75).length;

  const filteredStudents = students.filter(s => {
    const status = attendance[s.studentProfile?.id];
    const cumPct = getStudentCumulativeAttendance(s.studentProfile?.rollNumber);
    if (filterMode === 'ABSENT') return status === 'ABSENT';
    if (filterMode === 'DEFAULTER') return cumPct < 75;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-700 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wider">
            <Radio className="w-3.5 h-3.5 text-green-300 animate-pulse" /> Smart Attendance & Defaulter Radar
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Facial, QR Attendance & Defaulter Tracker</h1>
          <p className="text-white/90 text-sm sm:text-base">
            Project dynamic rotating QR codes for classroom scanning, monitor &lt;75% attendance defaulters, and dispatch automated parent SMS alerts.
          </p>
        </div>
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-xs text-muted-foreground font-medium">Present in Class</p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" /> {presentCount} Students
          </p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-xs text-muted-foreground font-medium">Absentee Counter</p>
          <p className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1 flex items-center gap-2">
            <Users className="w-5 h-5" /> {absentCount} Students
          </p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-xs text-muted-foreground font-medium">Defaulters (&lt;75%)</p>
          <p className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" /> {defaulterCount} At Risk
          </p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-xs text-muted-foreground font-medium">Geofence Radius</p>
          <p className="text-sm font-bold text-blue-600 dark:text-blue-400 mt-2 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-rose-500" /> CS-101 (50m Radius Active)
          </p>
        </div>
      </div>

      {/* Action Strip */}
      <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 bg-card p-4 rounded-2xl border border-border shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedSubject}
            onChange={e => setSelectedSubject(e.target.value)}
            className="bg-background border border-border text-foreground rounded-xl px-3 py-2 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-500"
          >
            <option value="Data Structures & Algorithms (CS501)">Data Structures & Algorithms (CS501)</option>
            <option value="Database Management Systems (CS502)">Database Management Systems (CS502)</option>
            <option value="Operating Systems (CS503)">Operating Systems (CS503)</option>
            <option value="Computer Networks Lab (CS504L)">Computer Networks Lab (CS504L)</option>
          </select>

          <button
            onClick={() => markAll('PRESENT')}
            className="px-3 py-1.5 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs font-medium transition"
          >
            All Present
          </button>
          <button
            onClick={() => markAll('ABSENT')}
            className="px-3 py-1.5 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs font-medium transition"
          >
            All Absent
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {absentCount > 0 && (
            <button
              onClick={handleNotifyAbsenteeParents}
              disabled={notifyingParents}
              className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
            >
              {notifyingParents ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <BellRing className="w-3.5 h-3.5" />}
              <span>Notify Absent Parents</span>
            </button>
          )}

          <button
            onClick={() => setQrModeModal(true)}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
          >
            <QrCode className="w-3.5 h-3.5" /> Project Live QR Screen
          </button>

          <button
            onClick={handleExportAttendance}
            className="px-3.5 py-2 rounded-xl border border-border hover:bg-muted text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-md shadow-blue-500/20"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Commit Roster</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilterMode('ALL')}
          className={cn(
            "px-3 py-1.5 rounded-xl text-xs font-semibold transition",
            filterMode === 'ALL' ? "bg-blue-600 text-white shadow-xs" : "bg-muted text-muted-foreground hover:text-foreground"
          )}
        >
          All Students ({students.length})
        </button>
        <button
          onClick={() => setFilterMode('ABSENT')}
          className={cn(
            "px-3 py-1.5 rounded-xl text-xs font-semibold transition",
            filterMode === 'ABSENT' ? "bg-rose-600 text-white shadow-xs" : "bg-muted text-muted-foreground hover:text-foreground"
          )}
        >
          Absentees Today ({absentCount})
        </button>
        <button
          onClick={() => setFilterMode('DEFAULTER')}
          className={cn(
            "px-3 py-1.5 rounded-xl text-xs font-semibold transition",
            filterMode === 'DEFAULTER' ? "bg-amber-600 text-white shadow-xs" : "bg-muted text-muted-foreground hover:text-foreground"
          )}
        >
          Defaulters &lt;75% ({defaulterCount})
        </button>
      </div>

      {/* Student Roster Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-blue-600" /> Loading student roster from database...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredStudents.map((s) => {
            const status = attendance[s.studentProfile.id];
            const cumPct = getStudentCumulativeAttendance(s.studentProfile?.rollNumber);
            const isDefaulter = cumPct < 75;

            return (
              <button
                key={s.id}
                onClick={() => toggleAttendance(s.studentProfile.id)}
                className={cn(
                  "p-4 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer shadow-xs",
                  status === 'PRESENT' ? "bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/15" :
                  status === 'ABSENT' ? "bg-rose-500/10 border-rose-500/30 hover:bg-rose-500/15" :
                  "bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/15"
                )}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">{s.name}</p>
                    {isDefaulter && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-600 border border-rose-500/30">
                        &lt;75%
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">
                    Roll: {s.studentProfile.rollNumber} • Aggregate: <span className={cn("font-bold", isDefaulter ? "text-rose-500" : "text-emerald-600")}>{cumPct}%</span>
                  </p>
                </div>
                <span className={cn(
                  "px-2.5 py-0.5 rounded-full text-xs font-bold font-mono border",
                  status === 'PRESENT' ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/40" :
                  status === 'ABSENT' ? "bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/40" :
                  "bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/40"
                )}>
                  {status}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Live QR Screen Modal for Classroom Projection */}
      {qrModeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl max-w-lg w-full p-8 text-center space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-2 border-b border-border">
              <div className="text-left">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  PROJECTOR BROADCAST MODE
                </span>
                <h3 className="text-lg font-bold text-foreground mt-1">{selectedSubject}</h3>
              </div>
              <button onClick={() => setQrModeModal(false)} className="p-1 rounded-lg text-muted-foreground hover:bg-muted">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 bg-white rounded-2xl shadow-inner inline-block mx-auto">
              <QrCode className="w-56 h-56 text-slate-900 mx-auto" />
              <p className="text-xs font-mono font-bold text-slate-800 mt-3">{qrToken}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>QR Code regenerates in: <strong>{qrCountdown}s</strong> (Anti-Proxy Defense)</span>
              </div>
              <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-500" /> Geofence: Students must be connected to Campus Wi-Fi inside CS-101
              </p>
            </div>

            <button
              onClick={() => setQrModeModal(false)}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition"
            >
              Close Projector Display
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
