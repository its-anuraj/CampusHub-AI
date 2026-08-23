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
} from 'lucide-react';
import { useToast } from '@/lib/toastContext';

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
  const { toast } = useToast();
  const [selectedSem, setSelectedSem] = useState(5);

  const currentData = SEMESTERS_DATA[selectedSem] || SEMESTERS_DATA[5];
  const cgpa = 8.27;

  const handleDownloadTranscript = () => {
    toast.success('Provisional Semester Transcript PDF generated!', 'Transcript Downloaded');
  };

  const handlePrint = () => {
    toast.info('Opening official university marksheet print view...');
    window.print();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Academic Results & CGPA Analytics</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
              First Class with Distinction
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Official semester performance transcripts, credit audit, and progressive SGPA trajectory
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
            title="Print Marksheet"
          >
            <Printer className="w-4 h-4" />
          </button>
          <button
            onClick={handleDownloadTranscript}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Download Transcript (.pdf)
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <span className="text-[11px] text-slate-500 font-medium">Cumulative CGPA</span>
          <p className="text-2xl font-black text-blue-600 mt-1">{cgpa} / 10.0</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <span className="text-[11px] text-slate-500 font-medium">Semester SGPA</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">{currentData.sgpa}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <span className="text-[11px] text-slate-500 font-medium">Credits Earned</span>
          <p className="text-2xl font-black text-slate-900 mt-1">104 / 160</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <span className="text-[11px] text-slate-500 font-medium">Active Backlogs</span>
          <p className="text-2xl font-black text-slate-900 mt-1">0 (Clean Record)</p>
        </div>
      </div>

      {/* Progressive SGPA Trajectory Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" /> SGPA Growth Progression
            </h3>
            <p className="text-[11px] text-slate-500">Continuous upward trend across all 5 semesters</p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
            +0.80 GPA Improvement
          </span>
        </div>

        {/* Visual Bar Tracker */}
        <div className="grid grid-cols-5 gap-3 pt-2">
          {SEMESTER_TREND.map((item) => (
            <div key={item.sem} className="flex flex-col items-center gap-2">
              <div className="w-full bg-slate-100 rounded-xl h-24 flex items-end p-1.5 justify-center">
                <div
                  className="w-full bg-gradient-to-t from-blue-600 to-indigo-500 rounded-lg transition-all duration-700"
                  style={{ height: `${(item.sgpa / 10) * 100}%` }}
                />
              </div>
              <span className="text-[11px] font-bold text-slate-800 font-mono">{item.sgpa}</span>
              <span className="text-[10px] text-slate-400 font-medium">{item.sem}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Semester Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700">Detailed Marksheet:</span>
          {[5, 4, 3, 2, 1].map((s) => (
            <button
              key={s}
              onClick={() => setSelectedSem(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedSem === s
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Semester {s}
            </button>
          ))}
        </div>
      </div>

      {/* Subject Marks Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
              <tr>
                <th className="px-5 py-3.5">Course Code</th>
                <th className="px-5 py-3.5">Subject Title</th>
                <th className="px-4 py-3.5 text-center">Credits</th>
                <th className="px-4 py-3.5 text-center">Internal (30)</th>
                <th className="px-4 py-3.5 text-center">End-Sem (70)</th>
                <th className="px-4 py-3.5 text-center">Total (100)</th>
                <th className="px-4 py-3.5 text-center">Grade</th>
                <th className="px-4 py-3.5 text-center">Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {currentData.subjects.map((sub) => (
                <tr key={sub.code} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3.5 font-mono font-bold text-blue-700">{sub.code}</td>
                  <td className="px-5 py-3.5 text-slate-900 font-bold">{sub.title}</td>
                  <td className="px-4 py-3.5 text-center text-slate-600">{sub.credits}</td>
                  <td className="px-4 py-3.5 text-center text-slate-600">{sub.internal}</td>
                  <td className="px-4 py-3.5 text-center text-slate-600">{sub.external}</td>
                  <td className="px-4 py-3.5 text-center font-bold text-slate-900">{sub.total}</td>
                  <td className="px-4 py-3.5 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border uppercase ${
                        sub.grade === 'O'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                          : sub.grade === 'A+'
                          ? 'bg-blue-100 text-blue-800 border-blue-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {sub.grade}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-center font-bold text-slate-800">{sub.gradePoints}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
