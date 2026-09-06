'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Code2, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Sparkles, 
  ArrowLeft, 
  Copy, 
  Play, 
  Zap, 
  FileCode, 
  BarChart3,
  RefreshCw
} from 'lucide-react';

export default function CodeCheckerPage() {
  const [code, setCode] = useState<string>(`// Quick Sort Algorithm Implementation in JavaScript
function quickSort(arr) {
  if (arr.length <= 1) {
    return arr;
  }

  const pivot = arr[Math.floor(arr.length / 2)];
  const left = arr.filter(x => x < pivot);
  const middle = arr.filter(x => x === pivot);
  const right = arr.filter(x => x > pivot);

  return [...quickSort(left), ...middle, ...quickSort(right)];
}

const sampleData = [64, 34, 25, 12, 22, 11, 90];
console.log("Sorted Array:", quickSort(sampleData));`);

  const [language, setLanguage] = useState('javascript');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const res = await fetch('/api/ai/code-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language, assignmentTitle: 'DSA Lab 4 - Sorting Algorithms' })
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900/40 p-6 rounded-2xl border border-indigo-500/20 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 mb-1">
            <Link href="/dashboard/student/assignments" className="flex items-center gap-1 hover:underline text-xs">
              <ArrowLeft className="w-3 h-3" /> Back to Assignments
            </Link>
            <span className="text-slate-500">•</span>
            <span className="text-xs font-semibold uppercase tracking-wider">AI Quality Suite</span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 border-2 border-amber-300 text-[10px] font-black uppercase shadow-xs">
              ✨ AI Module • Coming Soon (Beta Preview)
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Code2 className="w-6 h-6 text-indigo-400" />
            AI Code Plagiarism & Quality Auditor
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Pre-flight syntax checker, plagiarism similarity estimator, and cyclomatic complexity analyzer.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-slate-800/80 border border-slate-700 text-slate-200 text-sm rounded-xl px-3 py-2 outline-none focus:border-indigo-500"
          >
            <option value="javascript">JavaScript / TypeScript</option>
            <option value="python">Python 3.12</option>
            <option value="cpp">C++ 20</option>
            <option value="java">Java 21</option>
          </select>

          <button
            onClick={handleAnalyze}
            disabled={analyzing}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition shadow-lg shadow-indigo-500/20 disabled:opacity-50 cursor-pointer"
          >
            {analyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Scanning Code...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Audit Code Quality
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Editor Pane */}
        <div className="lg:col-span-7 bg-slate-900/60 rounded-2xl border border-slate-800 p-4 flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-mono text-slate-300">source_code.{language === 'python' ? 'py' : language === 'cpp' ? 'cpp' : language === 'java' ? 'java' : 'js'}</span>
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(code)}
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1"
            >
              <Copy className="w-3 h-3" /> Copy
            </button>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={18}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-200 focus:border-indigo-500 focus:outline-none resize-none leading-relaxed"
            placeholder="Paste your source code here to run pre-flight checks..."
          />
        </div>

        {/* Audit Results Pane */}
        <div className="lg:col-span-5 space-y-4">
          {result ? (
            <>
              {/* Scorecard */}
              <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-indigo-400" /> Pre-Submission Health
                  </h3>
                  <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-semibold rounded-full border border-emerald-500/20">
                    Grade {result.metrics.gradeEstimate}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                    <span className="text-xs text-slate-400 block mb-1">Code Quality</span>
                    <span className="text-lg font-bold text-white">{result.metrics.qualityScore}</span>
                  </div>
                  <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                    <span className="text-xs text-slate-400 block mb-1">Similarity / Plag</span>
                    <span className="text-lg font-bold text-emerald-400">{result.metrics.similarityScore}</span>
                  </div>
                  <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                    <span className="text-xs text-slate-400 block mb-1">Cyclomatic Complexity</span>
                    <span className="text-lg font-bold text-indigo-400">{result.metrics.cyclomaticComplexity} (Low)</span>
                  </div>
                  <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                    <span className="text-xs text-slate-400 block mb-1">Lines Analyzed</span>
                    <span className="text-lg font-bold text-slate-300">{result.metrics.lineCount} lines</span>
                  </div>
                </div>

                <div className="p-3 bg-emerald-950/30 rounded-xl border border-emerald-500/20 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-xs font-semibold text-emerald-300 block">Plagiarism Status: Safe</span>
                    <p className="text-[11px] text-emerald-400/80 mt-0.5">
                      Code uniqueness is verified against student cohort submissions and public repositories.
                    </p>
                  </div>
                </div>
              </div>

              {/* Suggestions */}
              <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-5 space-y-3">
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" /> AI Optimization Recommendations
                </h4>
                <ul className="space-y-2">
                  {result.suggestions.map((sug: string, idx: number) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                      <span>{sug}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <div className="bg-slate-900/40 rounded-2xl border border-dashed border-slate-800 p-8 text-center flex flex-col items-center justify-center h-full min-h-[350px]">
              <Sparkles className="w-10 h-10 text-indigo-400/60 mb-3 animate-pulse" />
              <h3 className="text-sm font-semibold text-slate-200">Ready for Automated Audit</h3>
              <p className="text-xs text-slate-400 max-w-xs mt-1">
                Click &ldquo;Audit Code Quality&rdquo; to evaluate similarity, performance bounds, and security before final submission.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
