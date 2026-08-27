'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ClipboardCheck, 
  CheckCircle2, 
  ArrowLeft, 
  Sliders, 
  UserCheck, 
  Sparkles, 
  Plus,
  Send,
  Award
} from 'lucide-react';

export default function AssignmentRubricsPage() {
  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [studentName, setStudentName] = useState('Ananya Verma');
  const [rollNo, setRollNo] = useState('24CS104');
  const [assignmentTitle, setAssignmentTitle] = useState('Lab 5: Distributed Key-Value Store');
  const [correctness, setCorrectness] = useState(27);
  const [codeQuality, setCodeQuality] = useState(18);
  const [testCoverage, setTestCoverage] = useState(18);
  const [documentation, setDocumentation] = useState(14);
  const [viva, setViva] = useState(14);
  const [feedback, setFeedback] = useState('Strong concurrency design with mutex locking.');
  const [loading, setLoading] = useState(false);

  const fetchEvals = async () => {
    const res = await fetch('/api/assignments/rubrics');
    const json = await res.json();
    if (json.success) setEvaluations(json.data);
  };

  useEffect(() => {
    fetchEvals();
  }, []);

  const totalScore = correctness + codeQuality + testCoverage + documentation + viva;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/assignments/rubrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName,
          rollNo,
          assignmentTitle,
          rubrics: {
            correctness,
            codeQuality,
            testCoverage,
            documentation,
            vivaVivaVoce: viva
          },
          feedbackNote: feedback
        })
      });
      const data = await res.json();
      if (data.success) {
        fetchEvals();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-900/40 via-sky-900/30 to-slate-900/40 p-6 rounded-2xl border border-blue-500/20 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 text-blue-400 mb-1">
            <Link href="/dashboard/faculty/assignments" className="flex items-center gap-1 hover:underline text-xs">
              <ArrowLeft className="w-3 h-3" /> Back to Assignments
            </Link>
            <span className="text-slate-500">•</span>
            <span className="text-xs font-semibold uppercase tracking-wider">Evaluation Framework</span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ClipboardCheck className="w-6 h-6 text-blue-400" />
            Rubric-Based Assignment Evaluation Desk
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Standardized multi-criterion grading rubrics with direct performance scoring and automated student feedback.
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Rubric Form */}
        <div className="lg:col-span-6 bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-400" /> Student Evaluation Matrix
            </h3>
            <span className="text-base font-bold text-blue-400 font-mono">
              Total: {totalScore} / 100
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Student Name</label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={e => setStudentName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Roll Number</label>
                <input
                  type="text"
                  required
                  value={rollNo}
                  onChange={e => setRollNo(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Sliders */}
            <div className="space-y-3 pt-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">1. Algorithmic Correctness (Max 30)</span>
                  <span className="text-blue-400 font-mono font-bold">{correctness} / 30</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={correctness}
                  onChange={e => setCorrectness(Number(e.target.value))}
                  className="w-full accent-blue-500 bg-slate-800"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">2. Code Style & Modularity (Max 20)</span>
                  <span className="text-blue-400 font-mono font-bold">{codeQuality} / 20</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={codeQuality}
                  onChange={e => setCodeQuality(Number(e.target.value))}
                  className="w-full accent-blue-500 bg-slate-800"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">3. Unit Test Coverage & Edge Cases (Max 20)</span>
                  <span className="text-blue-400 font-mono font-bold">{testCoverage} / 20</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={testCoverage}
                  onChange={e => setTestCoverage(Number(e.target.value))}
                  className="w-full accent-blue-500 bg-slate-800"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">4. Architecture Documentation (Max 15)</span>
                  <span className="text-blue-400 font-mono font-bold">{documentation} / 15</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15"
                  value={documentation}
                  onChange={e => setDocumentation(Number(e.target.value))}
                  className="w-full accent-blue-500 bg-slate-800"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">5. Viva Voce & Understanding (Max 15)</span>
                  <span className="text-blue-400 font-mono font-bold">{viva} / 15</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15"
                  value={viva}
                  onChange={e => setViva(Number(e.target.value))}
                  className="w-full accent-blue-500 bg-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Personalized Student Feedback</label>
              <textarea
                rows={2}
                value={feedback}
                onChange={e => setFeedback(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl transition shadow-lg shadow-blue-600/20 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> Publish Rubric Grade & Send Feedback
            </button>
          </form>
        </div>

        {/* Evaluation History */}
        <div className="lg:col-span-6 bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-blue-400" /> Recent Graded Submissions
          </h3>

          <div className="space-y-3">
            {evaluations.map(ev => (
              <div key={ev.id} className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">{ev.studentName} ({ev.rollNo})</h4>
                    <p className="text-[11px] text-slate-400">{ev.assignmentTitle}</p>
                  </div>
                  <span className="text-base font-bold text-emerald-400 font-mono">
                    {ev.totalScore} / {ev.maxScore}
                  </span>
                </div>

                <p className="text-[11px] text-slate-300 bg-slate-900/80 p-2 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 font-medium">Feedback: </span>
                  {ev.feedbackNote}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
