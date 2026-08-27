'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  BrainCircuit, 
  Sparkles, 
  Download, 
  Printer, 
  FileText, 
  ArrowLeft, 
  Layers, 
  CheckCircle,
  RefreshCw
} from 'lucide-react';

export default function ExamGeneratorPage() {
  const [courseCode, setCourseCode] = useState('CS401');
  const [topic, setTopic] = useState('Distributed Systems & Consensus Protocols');
  const [examType, setExamType] = useState('Mid-Semester Examination');
  const [totalMarks, setTotalMarks] = useState(50);
  const [loading, setLoading] = useState(false);
  const [paper, setPaper] = useState<any>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/ai/exam-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseCode, topic, examType, totalMarks })
      });
      const data = await res.json();
      if (data.success) {
        setPaper(data.data);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-slate-900/40 p-6 rounded-2xl border border-purple-500/20 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 text-purple-400 mb-1">
            <Link href="/dashboard/faculty" className="flex items-center gap-1 hover:underline text-xs">
              <ArrowLeft className="w-3 h-3" /> Back to Faculty Desk
            </Link>
            <span className="text-slate-500">•</span>
            <span className="text-xs font-semibold uppercase tracking-wider">AI Pedagogy Suite</span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-purple-400" />
            AI Exam Question Paper Generator
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Synthesize balanced university exam papers aligned with Bloom&apos;s Taxonomy (L1 - L6) and NBA outcome guidelines.
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Generator Controls */}
        <div className="lg:col-span-4 bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" /> Exam Parameters
          </h3>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Course Code</label>
              <input
                type="text"
                required
                value={courseCode}
                onChange={e => setCourseCode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Curriculum Topic / Syllabus Units</label>
              <textarea
                required
                rows={3}
                value={topic}
                onChange={e => setTopic(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500 resize-none"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Exam Type</label>
              <select
                value={examType}
                onChange={e => setExamType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
              >
                <option value="Mid-Semester Examination">Mid-Semester Examination (2 Hours)</option>
                <option value="End-Semester Major Examination">End-Semester Major Examination (3 Hours)</option>
                <option value="Continuous Assessment Quiz / Test">Continuous Assessment Quiz / Test</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Total Marks</label>
              <input
                type="number"
                value={totalMarks}
                onChange={e => setTotalMarks(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs rounded-xl transition shadow-lg shadow-purple-600/20 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              Generate Question Paper
            </button>
          </form>
        </div>

        {/* Paper Preview */}
        <div className="lg:col-span-8 bg-slate-900/60 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-400" /> Printable Paper Draft
            </h3>
            {paper && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" /> Print
                </button>
              </div>
            )}
          </div>

          {paper ? (
            <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-6 text-slate-200">
              <div className="text-center border-b border-slate-800 pb-4 space-y-1">
                <h2 className="text-base font-bold text-white uppercase tracking-wider">
                  CampusHub Institute of Technology
                </h2>
                <p className="text-xs font-semibold text-purple-400">{paper.paperTitle}</p>
                <div className="flex justify-between text-xs text-slate-400 pt-2 font-mono">
                  <span>Duration: {paper.durationMinutes} Minutes</span>
                  <span>Max Marks: {paper.totalMarks}</span>
                </div>
              </div>

              {paper.sections.map((sec: any, idx: number) => (
                <div key={idx} className="space-y-3">
                  <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                    {sec.sectionName}
                  </h4>
                  <div className="space-y-3 pl-2">
                    {sec.questions.map((q: any) => (
                      <div key={q.qNo} className="flex justify-between items-start text-xs gap-4">
                        <div className="space-y-1">
                          <span className="font-semibold text-white">Q{q.qNo}. {q.text}</span>
                          <span className="text-[10px] text-purple-400 block">[{q.bloomsLevel}]</span>
                        </div>
                        <span className="font-mono font-bold text-slate-400">[{q.marks}M]</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-16 text-center text-slate-500 text-xs flex flex-col items-center justify-center">
              <BrainCircuit className="w-12 h-12 text-purple-500/30 mb-3" />
              <p className="text-sm font-medium text-slate-300">Question Paper Engine Ready</p>
              <p className="text-slate-500 max-w-sm mt-1">
                Configure syllabus topics and taxonomy distribution on the left to generate the formatted exam sheet.
              </p>
            </div>
          )}

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
            <span>Aligned with AICTE & NBA Outcome-Based Education (OBE) Standard</span>
            <span>Version 3.2</span>
          </div>
        </div>
      </div>
    </div>
  );
}
