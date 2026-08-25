'use client';

import { useState } from 'react';
import {
  GraduationCap,
  Save,
  Download,
  Upload,
  Filter,
  Search,
  CheckCircle2,
  TrendingUp,
  Award,
  AlertCircle,
  Sparkles,
  BarChart3,
  Sliders,
  FileSpreadsheet,
} from 'lucide-react';
import { useToast } from '@/lib/toastContext';
import { exportToCSV } from '@/lib/exportUtils';
import { cn } from '@/lib/utils';

interface StudentGradeRow {
  id: string;
  rollNumber: string;
  name: string;
  internal: number; // Max 20
  midterm: number; // Max 30
  endSem: number; // Max 50
  total: number; // Max 100
  grade: string;
}

const INITIAL_ROWS: StudentGradeRow[] = [
  { id: '1', rollNumber: 'CS2023-001', name: 'Aarav Sharma', internal: 18, midterm: 26, endSem: 44, total: 88, grade: 'A+' },
  { id: '2', rollNumber: 'CS2023-014', name: 'Bhavna Verma', internal: 19, midterm: 28, endSem: 47, total: 94, grade: 'O' },
  { id: '3', rollNumber: 'CS2023-027', name: 'Chetan Kapoor', internal: 14, midterm: 20, endSem: 36, total: 70, grade: 'A' },
  { id: '4', rollNumber: 'CS2023-042', name: 'Anuraj Singh', internal: 19, midterm: 29, endSem: 48, total: 96, grade: 'O' },
  { id: '5', rollNumber: 'CS2023-055', name: 'Divya Nair', internal: 16, midterm: 22, endSem: 38, total: 76, grade: 'A' },
  { id: '6', rollNumber: 'CS2023-068', name: 'Eshan Malhotra', internal: 12, midterm: 18, endSem: 32, total: 62, grade: 'B+' },
  { id: '7', rollNumber: 'CS2023-079', name: 'Farhan Zaidi', internal: 17, midterm: 25, endSem: 41, total: 83, grade: 'A+' },
  { id: '8', rollNumber: 'CS2023-091', name: 'Gauri Kulkarni', internal: 15, midterm: 21, endSem: 39, total: 75, grade: 'A' }
];

const COURSES = [
  { code: 'CS501', title: 'Data Structures & Algorithms (B.Tech 5th Sem)' },
  { code: 'CS504', title: 'Computer Networks (B.Tech 5th Sem)' },
  { code: 'CS501L', title: 'DSA Lab Practicals' },
];

export default function FacultyMarksPage() {
  const { addToast } = useToast();
  const [selectedCourse, setSelectedCourse] = useState('CS501');
  const [students, setStudents] = useState<StudentGradeRow[]>(INITIAL_ROWS);
  const [search, setSearch] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [curveBonus, setCurveBonus] = useState(0);

  const calculateGrade = (total: number): string => {
    if (total >= 90) return 'O';
    if (total >= 80) return 'A+' ;
    if (total >= 70) return 'A';
    if (total >= 60) return 'B+';
    if (total >= 50) return 'B';
    if (total >= 40) return 'C';
    return 'F';
  };

  const handleScoreChange = (
    id: string,
    field: 'internal' | 'midterm' | 'endSem',
    val: string
  ) => {
    const num = Math.max(0, Number(val) || 0);

    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const updated = { ...s, [field]: num };
          const internal = field === 'internal' ? Math.min(20, num) : s.internal;
          const midterm = field === 'midterm' ? Math.min(30, num) : s.midterm;
          const endSem = field === 'endSem' ? Math.min(50, num) : s.endSem;
          const total = Math.min(100, internal + midterm + endSem + curveBonus);
          return {
            ...updated,
            internal,
            midterm,
            endSem,
            total,
            grade: calculateGrade(total),
          };
        }
        return s;
      })
    );
  };

  const applyCurve = (bonus: number) => {
    setCurveBonus(bonus);
    setStudents(prev => prev.map(s => {
      const total = Math.min(100, Math.max(0, s.internal + s.midterm + s.endSem + bonus));
      return {
        ...s,
        total,
        grade: calculateGrade(total)
      };
    }));
    addToast({
      title: 'Grading Curve Adjusted',
      message: `Applied ${bonus >= 0 ? '+' : ''}${bonus} marks moderation across the cohort.`,
      type: 'info'
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/marks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseCode: selectedCourse,
          marks: students,
        }),
      });

      if (res.ok) {
        addToast({
          title: 'Grades Published Successfully',
          message: `Evaluation records for ${selectedCourse} updated in Academic Controller database.`,
          type: 'success'
        });
      }
    } catch {
      addToast({
        title: 'Save Failed',
        message: 'Could not sync marks with database.',
        type: 'error'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportCSV = () => {
    const exportData = students.map((s) => ({
      'Roll Number': s.rollNumber,
      'Student Name': s.name,
      'Internal (20)': s.internal,
      'Midterm (30)': s.midterm,
      'End Semester (50)': s.endSem,
      'Total (100)': s.total,
      'Letter Grade': s.grade,
    }));
    exportToCSV(`Gradebook_${selectedCourse}`, exportData);
    addToast({
      title: 'CSV Exported',
      message: `Downloaded grade sheet for ${selectedCourse}`,
      type: 'success'
    });
  };

  const handleSimulateCSVUpload = () => {
    addToast({
      title: 'Batch CSV Processed',
      message: `Successfully validated and parsed 8 student records from uploaded CSV.`,
      type: 'success'
    });
  };

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(search.toLowerCase())
  );

  const avgScore = (students.reduce((acc, s) => acc + s.total, 0) / (students.length || 1)).toFixed(1);
  const outstandingCount = students.filter((s) => s.grade === 'O' || s.grade === 'A+').length;
  const passRate = ((students.filter((s) => s.grade !== 'F').length / (students.length || 1)) * 100).toFixed(0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wider">
            <GraduationCap className="w-3.5 h-3.5 text-yellow-300" /> Faculty Gradebook Console
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Course Evaluation & Marks Entry</h1>
          <p className="text-white/90 text-sm sm:text-base">
            Input, moderate, curve, and publish continuous assessment scores, midterms, and lab grades. Instant statistics and batch CSV processing.
          </p>
        </div>
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Cohort Performance Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-xs text-muted-foreground font-medium">Class Average Total</p>
          <p className="text-2xl font-bold text-foreground mt-1 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" /> {avgScore} / 100
          </p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-xs text-muted-foreground font-medium">Distinction (O & A+)</p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-2">
            <Award className="w-5 h-5" /> {outstandingCount} Students
          </p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-xs text-muted-foreground font-medium">Pass Percentage</p>
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" /> {passRate}%
          </p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-xs text-muted-foreground font-medium">Active Grading Curve</p>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-2">
            <Sliders className="w-5 h-5" /> {curveBonus >= 0 ? `+${curveBonus}` : curveBonus} pts
          </p>
        </div>
      </div>

      {/* Control Strip */}
      <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 bg-card p-4 rounded-2xl border border-border shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="px-3 py-2 text-sm bg-background border border-border rounded-xl font-medium focus:ring-2 focus:ring-blue-500"
            >
              {COURSES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} - {c.title}
                </option>
              ))}
            </select>
          </div>

          {/* Curve Moderation Buttons */}
          <div className="flex items-center gap-1 bg-muted p-1 rounded-xl">
            <span className="text-xs font-semibold text-muted-foreground px-2">Curve:</span>
            <button
              onClick={() => applyCurve(0)}
              className={cn("px-2 py-1 text-xs font-semibold rounded-lg", curveBonus === 0 ? "bg-card text-foreground shadow-xs" : "text-muted-foreground")}
            >
              Raw (0)
            </button>
            <button
              onClick={() => applyCurve(2)}
              className={cn("px-2 py-1 text-xs font-semibold rounded-lg", curveBonus === 2 ? "bg-card text-emerald-600 shadow-xs" : "text-muted-foreground")}
            >
              +2 pts
            </button>
            <button
              onClick={() => applyCurve(5)}
              className={cn("px-2 py-1 text-xs font-semibold rounded-lg", curveBonus === 5 ? "bg-card text-emerald-600 shadow-xs" : "text-muted-foreground")}
            >
              +5 pts
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name or roll..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={handleSimulateCSVUpload}
            className="px-3 py-2 rounded-xl border border-border hover:bg-muted text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Upload className="w-3.5 h-3.5 text-muted-foreground" /> Import CSV
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3 py-2 rounded-xl border border-border hover:bg-muted text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Download className="w-3.5 h-3.5 text-muted-foreground" /> Export CSV
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-blue-500/20 disabled:opacity-50 transition"
          >
            <Save className="w-3.5 h-3.5" />
            {isSaving ? 'Publishing...' : 'Save & Publish'}
          </button>
        </div>
      </div>

      {/* Grade Table */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-muted/60 text-muted-foreground font-semibold border-b border-border">
              <tr>
                <th className="p-3.5 pl-4">Roll Number</th>
                <th className="p-3.5">Student Name</th>
                <th className="p-3.5 text-center">Internal (20)</th>
                <th className="p-3.5 text-center">Midterm (30)</th>
                <th className="p-3.5 text-center">End Sem (50)</th>
                <th className="p-3.5 text-center">Total (100)</th>
                <th className="p-3.5 text-center pr-4">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-3.5 pl-4 font-mono font-medium text-foreground">{s.rollNumber}</td>
                  <td className="p-3.5 font-medium text-foreground">{s.name}</td>
                  <td className="p-3.5 text-center">
                    <input
                      type="number"
                      min={0}
                      max={20}
                      value={s.internal}
                      onChange={(e) => handleScoreChange(s.id, 'internal', e.target.value)}
                      className="w-16 px-2 py-1 text-center bg-background border border-border rounded-lg font-mono focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
                    />
                  </td>
                  <td className="p-3.5 text-center">
                    <input
                      type="number"
                      min={0}
                      max={30}
                      value={s.midterm}
                      onChange={(e) => handleScoreChange(s.id, 'midterm', e.target.value)}
                      className="w-16 px-2 py-1 text-center bg-background border border-border rounded-lg font-mono focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
                    />
                  </td>
                  <td className="p-3.5 text-center">
                    <input
                      type="number"
                      min={0}
                      max={50}
                      value={s.endSem}
                      onChange={(e) => handleScoreChange(s.id, 'endSem', e.target.value)}
                      className="w-16 px-2 py-1 text-center bg-background border border-border rounded-lg font-mono focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
                    />
                  </td>
                  <td className="p-3.5 text-center font-bold text-foreground font-mono">
                    {s.total}
                  </td>
                  <td className="p-3.5 text-center pr-4">
                    <span className={cn(
                      "px-2.5 py-0.5 rounded-full text-xs font-bold font-mono",
                      s.grade === 'O' ? "bg-amber-500/10 text-amber-600 border border-amber-500/20" :
                      s.grade === 'A+' || s.grade === 'A' ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" :
                      s.grade === 'B+' || s.grade === 'B' ? "bg-blue-500/10 text-blue-600 border border-blue-500/20" :
                      s.grade === 'F' ? "bg-rose-500/10 text-rose-600 border border-rose-500/20" :
                      "bg-muted text-foreground"
                    )}>
                      {s.grade}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
