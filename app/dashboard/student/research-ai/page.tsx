'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  Sparkles, 
  Copy, 
  Check, 
  ArrowLeft, 
  FileText, 
  Quote, 
  Search, 
  Award,
  ExternalLink
} from 'lucide-react';

export default function ResearchPaperSummarizerPage() {
  const [papers, setPapers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<'bibtex' | 'apa' | 'ieee'>('bibtex');
  const [inputTitle, setInputTitle] = useState('');
  const [inputAbstract, setInputAbstract] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'browse' | 'analyze'>('browse');

  useEffect(() => {
    fetch('/api/ai/research-summarizer')
      .then(res => res.json())
      .then(json => {
        if (json.success) setPapers(json.data.papers);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputTitle || !inputAbstract) return;
    setAnalyzing(true);

    try {
      const res = await fetch('/api/ai/research-summarizer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paperTitle: inputTitle, abstractText: inputAbstract })
      });
      const json = await res.json();
      if (json.success) {
        setPapers([json.data, ...papers]);
        setInputTitle('');
        setInputAbstract('');
        setActiveTab('browse');
      }
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900/40 p-6 rounded-2xl border border-indigo-500/20 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 mb-1">
            <Link href="/dashboard/student" className="flex items-center gap-1 hover:underline text-xs">
              <ArrowLeft className="w-3 h-3" /> Back to Dashboard
            </Link>
            <span className="text-slate-500">•</span>
            <span className="text-xs font-semibold uppercase tracking-wider">AI Scholar Hub</span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-400" />
            AI Research Paper Summarizer & Citation Generator
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Distill dense academic publications into actionable TL;DRs, extract key findings, and copy clean BibTeX, APA, & IEEE citations.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'browse' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            Indexed Papers ({papers.length})
          </button>
          <button
            onClick={() => setActiveTab('analyze')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'analyze' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Summarize New Paper
          </button>
        </div>
      </div>

      {activeTab === 'analyze' && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 backdrop-blur-md space-y-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" /> Analyze & Generate Citations
          </h2>
          <form onSubmit={handleAnalyze} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Paper Title</label>
              <input
                type="text"
                placeholder="e.g. Deep Residual Learning for Image Recognition"
                value={inputTitle}
                onChange={e => setInputTitle(e.target.value)}
                required
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Abstract Text</label>
              <textarea
                rows={4}
                placeholder="Paste the research abstract here to distill key methodologies and format citations..."
                value={inputAbstract}
                onChange={e => setInputAbstract(e.target.value)}
                required
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('browse')}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={analyzing}
                className="px-5 py-2 rounded-xl text-xs font-medium bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50"
              >
                {analyzing ? 'Analyzing with AI...' : 'Generate TL;DR & Citations'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Format Selector */}
      <div className="flex items-center justify-between">
        <div className="text-xs text-slate-400">
          Showing <span className="text-white font-medium">{papers.length}</span> papers
        </div>
        <div className="flex items-center gap-2 bg-slate-900/60 p-1 rounded-xl border border-slate-800">
          <span className="text-[11px] text-slate-400 px-2 flex items-center gap-1">
            <Quote className="w-3 h-3" /> Citation Style:
          </span>
          {(['bibtex', 'apa', 'ieee'] as const).map(fmt => (
            <button
              key={fmt}
              onClick={() => setSelectedFormat(fmt)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono uppercase transition-all ${
                selectedFormat === fmt ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {fmt}
            </button>
          ))}
        </div>
      </div>

      {/* Papers Grid */}
      <div className="grid grid-cols-1 gap-4">
        {papers.map((paper) => (
          <div key={paper.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all space-y-4">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {paper.year || 2025}
                  </span>
                  {paper.venue && (
                    <span className="text-xs text-slate-400">{paper.venue}</span>
                  )}
                </div>
                <h3 className="text-base font-bold text-white leading-snug">{paper.title}</h3>
                {paper.authors && (
                  <p className="text-xs text-slate-400">
                    {Array.isArray(paper.authors) ? paper.authors.join(', ') : paper.authors}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-xl text-emerald-400 text-xs font-semibold">
                  <Award className="w-3.5 h-3.5" />
                  Score: {paper.qualityScore || paper.relevanceScore || 95}%
                </div>
              </div>
            </div>

            {/* TLDR Box */}
            <div className="bg-indigo-950/30 border border-indigo-500/20 rounded-xl p-3.5 text-xs text-indigo-200/90 leading-relaxed">
              <span className="font-semibold text-indigo-400">TL;DR: </span>
              {paper.tldr}
            </div>

            {/* Key Contributions */}
            {paper.keyContributions && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Key Contributions:</span>
                <ul className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {paper.keyContributions.map((item: string, idx: number) => (
                    <li key={idx} className="bg-slate-800/40 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-300 flex items-start gap-2">
                      <span className="text-indigo-400 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Citation Output Box */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-3">
              <div className="font-mono text-[11px] text-slate-300 truncate select-all">
                {paper.citations?.[selectedFormat] || paper.citations?.bibtex}
              </div>
              <button
                onClick={() => handleCopy(paper.citations?.[selectedFormat] || paper.citations?.bibtex, paper.id)}
                className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-all"
              >
                {copiedId === paper.id ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-300" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" /> Copy {selectedFormat.toUpperCase()}
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
