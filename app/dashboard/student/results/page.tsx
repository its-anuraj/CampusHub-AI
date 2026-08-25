'use client';

import { useState } from 'react';
import {
  GraduationCap,
  Award,
  Download,
  Printer,
  TrendingUp,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  BarChart2,
  ShieldCheck,
  Building2,
  FileCheck
} from 'lucide-react';
import { useToast } from '@/lib/toastContext';
import { cn } from '@/lib/utils';

interface SubjectResult {
  code: string;
  title: string;
  credits: number;
  internal: number;
  external: number;
  total: number;
  grade: string;
  gradePoints: number;
}

const SEMESTERS_DATA: Record<number, { sgpa: number; subjects: SubjectResult[] }> = {
  5: {
    sgpa: 8.65,
    subjects: [
      { code: 'CS501', title: 'Data Structures & Algorithms', credits: 4, internal: 28, external: 68, total: 96, grade: 'O', gradePoints: 10 },
      { code: 'CS502', title: 'Database Management Systems', credits: 4, internal: 26, external: 62, total: 88, grade: 'A+', gradePoints: 9 },
      { code: 'CS503', title: 'Operating Systems', credits: 4, internal: 27, external: 58, total: 85, grade: 'A+', gradePoints: 9 },
      { code: 'CS504', title: 'Computer Networks', credits: 3, internal: 24, external: 54, total: 78, grade: 'A', gradePoints: 8 },
      { code: 'CS501L', title: 'Algorithms Laboratory', credits: 2, internal: 29, external: 65, total: 94, grade: 'O', gradePoints: 10 },
      { code: 'CS502L', title: 'Database Management Lab', credits: 2, internal: 28, external: 64, total: 92, grade: 'O', gradePoints: 10 },
    ],
  },
  4: {
    sgpa: 8.40,
    subjects: [
      { code: 'CS401', title: 'Discrete Mathematics', credits: 4, internal: 25, external: 58, total: 83, grade: 'A+', gradePoints: 9 },
      { code: 'CS402', title: 'Computer Organization & Architecture', credits: 4, internal: 26, external: 55, total: 81, grade: 'A+', gradePoints: 9 },
      { code: 'CS403', title: 'Theory of Computation', credits: 4, internal: 23, external: 52, total: 75, grade: 'A', gradePoints: 8 },
      { code: 'CS404', title: 'Object Oriented Programming in Java', credits: 3, internal: 28, external: 62, total: 90, grade: 'O', gradePoints: 10 },
    ],
  },
};

const SEMESTER_TREND = [
  { sem: 'Sem 1', sgpa: 7.85 },
  { sem: 'Sem 2', sgpa: 8.10 },
  { sem: 'Sem 3', sgpa: 8.35 },
  { sem: 'Sem 4', sgpa: 8.40 },
  { sem: 'Sem 5', sgpa: 8.65 },
];

export default function StudentResultsPage() {
  const { addToast } = useToast();
  const [selectedSem, setSelectedSem] = useState(5);

  const currentData = SEMESTERS_DATA[selectedSem] || SEMESTERS_DATA[5];
  const cgpa = 8.27;

  const handleDownloadTranscript = () => {
    addToast({
      title: 'Provisional Transcript Downloaded',
      message: 'Official Digitally Signed Grade Card (PDF) saved to your device.',
      type: 'success'
    });
  };

  const handlePrint = () => {
    addToast({
      title: 'Print Preview Ready',
      message: 'Preparing official university marksheet layout with registrar stamp...',
      type: 'info'
    });
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-700 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5 text-yellow-300" /> First Class with Distinction
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Academic Results & CGPA Transcript</h1>
          <p className="text-white/90 text-sm sm:text-base">
            Official semester marksheet transcripts, credit audits, SGPA trajectory curves, and downloadable registrar verified PDF cards.
          </p>
        </div>
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-2xl p-5 shadow-xs">
          <span className="text-xs text-muted-foreground font-medium">Cumulative CGPA</span>
          <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1 font-mono">{cgpa} / 10.0</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 shadow-xs">
          <span className="text-xs text-muted-foreground font-medium">Semester SGPA</span>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 font-mono">{currentData.sgpa}</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 shadow-xs">
          <span className="text-xs text-muted-foreground font-medium">Credits Earned</span>
          <p className="text-2xl font-black text-foreground mt-1 font-mono">104 / 160</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 shadow-xs">
          <span className="text-xs text-muted-foreground font-medium">Active Backlogs</span>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 font-mono">0 (Clean)</p>
        </div>
      </div>

      {/* Progressive SGPA Trajectory Card */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" /> SGPA Growth Progression
            </h3>
            <p className="text-xs text-muted-foreground">Continuous upward trend across all 5 semesters</p>
          </div>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20">
            +0.80 GPA Improvement
          </span>
        </div>

        {/* Visual Bar Tracker */}
        <div className="grid grid-cols-5 gap-3 pt-2">
          {SEMESTER_TREND.map((item) => (
            <div key={item.sem} className="flex flex-col items-center gap-2">
              <div className="w-full bg-muted rounded-xl h-24 flex items-end p-1.5 justify-center">
                <div
                  className="w-full bg-gradient-to-t from-blue-600 to-indigo-500 rounded-lg transition-all duration-700"
                  style={{ height: `${(item.sgpa / 10) * 100}%` }}
                />
              </div>
              <span className="text-xs font-bold text-foreground font-mono">{item.sgpa}</span>
              <span className="text-[10px] text-muted-foreground font-medium">{item.sem}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Bar & Semester Selector */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-bold text-foreground whitespace-nowrap">Marksheet:</span>
          {[5, 4, 3, 2, 1].map((s) => (
            <button
              key={s}
              onClick={() => setSelectedSem(s)}
              className={cn(
                "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs",
                selectedSem === s
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "bg-card border border-border text-muted-foreground hover:bg-muted"
              )}
            >
              Semester {s}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="p-2 rounded-xl border border-border hover:bg-muted text-foreground transition"
            title="Print Official Marksheet"
          >
            <Printer className="w-4 h-4" />
          </button>
          <button
            onClick={handleDownloadTranscript}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-blue-500/20 transition"
          >
            <Download className="w-3.5 h-3.5" /> Download Transcript PDF
          </button>
        </div>
      </div>

      {/* Subject Marks Table */}
      <div className="bg-card border border-border rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-muted/60 border-b border-border text-muted-foreground font-semibold uppercase text-[11px]">
              <tr>
                <th className="px-5 py-3.5">Course Code</th>
                <th className="px-5 py-3.5">Subject Title</th>
                <th className="px-4 py-3.5 text-center">Credits</th>
                <th className="px-4 py-3.5 text-center">Internal (30)</th>
                <th className="px-4 py-3.5 text-center">End-Sem (70)</th>
                <th className="px-4 py-3.5 text-center">Total (100)</th>
                <th className="px-4 py-3.5 text-center">Grade</th>
                <th className="px-4 py-3.5 text-center pr-5">Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 font-medium">
              {currentData.subjects.map((sub) => (
                <tr key={sub.code} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5 font-mono font-bold text-blue-600 dark:text-blue-400">{sub.code}</td>
                  <td className="px-5 py-3.5 text-foreground font-bold">{sub.title}</td>
                  <td className="px-4 py-3.5 text-center text-muted-foreground">{sub.credits}</td>
                  <td className="px-4 py-3.5 text-center text-muted-foreground">{sub.internal}</td>
                  <td className="px-4 py-3.5 text-center text-muted-foreground">{sub.external}</td>
                  <td className="px-4 py-3.5 text-center font-bold text-foreground font-mono">{sub.total}</td>
                  <td className="px-4 py-3.5 text-center">
                    <span
                      className={cn(
                        "inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase font-mono",
                        sub.grade === 'O'
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                          : sub.grade === 'A+'
                          ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                          : "bg-muted text-foreground border-border"
                      )}
                    >
                      {sub.grade}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-center font-bold text-foreground font-mono pr-5">{sub.gradePoints}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
