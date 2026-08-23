'use client';

import { useState } from 'react';
import {
  GraduationCap,
  Save,
  Download,
  Filter,
  Search,
  CheckCircle2,
  TrendingUp,
  Award,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { useToast } from '@/lib/toastContext';

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
];

const COURSES = [
  { code: 'CS501', title: 'Data Structures & Algorithms (B.Tech 5th Sem)' },
  { code: 'CS504', title: 'Computer Networks (B.Tech 5th Sem)' },
  { code: 'CS501L', title: 'DSA Lab Practicals' },
];

export default function FacultyMarksPage() {
  const { toast } = useToast();
  const [selectedCourse, setSelectedCourse] = useState('CS501');
  const [students, setStudents] = useState<StudentGradeRow[]>(INITIAL_ROWS);
  const [search, setSearch] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const calculateGrade = (total: number): string => {
    if (total >= 90) return 'O';
    if (total >= 80) return 'A+';
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
          const total = updated.internal + updated.midterm + updated.endSem;
          const grade = calculateGrade(total);
          return { ...updated, total, grade };
        }
        return s;
      })
    );
  };

  const handleSaveGradebook = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsSaving(false);
    toast.success(`Gradebook for course ${selectedCourse} saved to University Database.`, 'Grades Published');
  };

  const filteredStudents = students.filter(
    (s) =>
      !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(search.toLowerCase())
  );

  const avgScore = Math.round(
    students.reduce((acc, s) => acc + s.total, 0) / Math.max(1, students.length)
  );
  const topScore = Math.max(...students.map((s) => s.total));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Faculty Gradebook & Marks Entry</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 uppercase">
              Semester 5 Evaluator
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Enter internal assessments, mid-term examinations, and final marks with automatic grade assignment
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toast.info('Exporting class evaluation sheet to CSV...', 'Export')}
            className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Export Excel
          </button>
          <button
            onClick={handleSaveGradebook}
            disabled={isSaving}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
          >
            <Save className="w-3.5 h-3.5" /> {isSaving ? 'Saving...' : 'Publish Grades'}
          </button>
        </div>
      </div>

      {/* Class Statistics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] text-slate-500 font-medium">Students Enrolled</span>
          <p className="text-xl font-bold text-slate-900 mt-1">{students.length} Students</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] text-slate-500 font-medium">Class Average</span>
          <p className="text-xl font-bold text-blue-600 mt-1">{avgScore} / 100</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] text-slate-500 font-medium">Highest Score</span>
          <p className="text-xl font-bold text-emerald-600 mt-1">{topScore} / 100</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] text-slate-500 font-medium">Passing Percentage</span>
          <p className="text-xl font-bold text-slate-900 mt-1">100%</p>
        </div>
      </div>

      {/* Course Selector & Search Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs font-semibold text-slate-700 whitespace-nowrap">Course:</label>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="px-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-white outline-none font-medium text-slate-800"
          >
            {COURSES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} - {c.title}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3.5 py-1.5 w-full sm:max-w-xs shadow-2xs">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            placeholder="Search student or roll no..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-xs text-slate-900 placeholder:text-slate-400 outline-none flex-1"
          />
        </div>
      </div>

      {/* Gradebook Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
              <tr>
                <th className="px-5 py-3.5">Roll No</th>
                <th className="px-5 py-3.5">Student Name</th>
                <th className="px-4 py-3.5 text-center">Internal (20)</th>
                <th className="px-4 py-3.5 text-center">Midterm (30)</th>
                <th className="px-4 py-3.5 text-center">End-Sem (50)</th>
                <th className="px-4 py-3.5 text-center">Total (100)</th>
                <th className="px-4 py-3.5 text-center">Final Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredStudents.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3 font-mono text-slate-700">{s.rollNumber}</td>
                  <td className="px-5 py-3 text-slate-900 font-bold">{s.name}</td>
                  <td className="px-4 py-3 text-center">
                    <input
                      type="number"
                      max={20}
                      min={0}
                      value={s.internal}
                      onChange={(e) => handleScoreChange(s.id, 'internal', e.target.value)}
                      className="w-14 text-center px-2 py-1 border border-slate-200 rounded-lg bg-slate-50/50 focus:bg-white focus:border-blue-600 outline-none text-xs font-semibold"
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <input
                      type="number"
                      max={30}
                      min={0}
                      value={s.midterm}
                      onChange={(e) => handleScoreChange(s.id, 'midterm', e.target.value)}
                      className="w-14 text-center px-2 py-1 border border-slate-200 rounded-lg bg-slate-50/50 focus:bg-white focus:border-blue-600 outline-none text-xs font-semibold"
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <input
                      type="number"
                      max={50}
                      min={0}
                      value={s.endSem}
                      onChange={(e) => handleScoreChange(s.id, 'endSem', e.target.value)}
                      className="w-14 text-center px-2 py-1 border border-slate-200 rounded-lg bg-slate-50/50 focus:bg-white focus:border-blue-600 outline-none text-xs font-semibold"
                    />
                  </td>
                  <td className="px-4 py-3 text-center font-bold text-slate-900">{s.total}</td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border uppercase ${
                        s.grade === 'O'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                          : s.grade === 'A+' || s.grade === 'A'
                          ? 'bg-blue-100 text-blue-800 border-blue-200'
                          : 'bg-amber-100 text-amber-800 border-amber-200'
                      }`}
                    >
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
