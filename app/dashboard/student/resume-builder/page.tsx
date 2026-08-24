'use client';

import { useState } from 'react';
import { FileText, Sparkles, Download, CheckCircle2, AlertTriangle, Printer, Plus, Trash2, Code2, Briefcase, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/lib/toastContext';

export default function StudentResumeBuilderPage() {
  const { addToast } = useToast();
  const [template, setTemplate] = useState<'MODERN' | 'MINIMAL' | 'LATEX'>('MODERN');

  // Resume Form State
  const [fullName, setFullName] = useState('Alex Kumar');
  const [email, setEmail] = useState('alex.kumar@campushub.edu');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [github, setGithub] = useState('github.com/alexkumar');
  const [linkedin, setLinkedin] = useState('linkedin.com/in/alexkumar');
  const [summary, setSummary] = useState('Pre-final year Computer Science student passionate about distributed systems, Next.js full-stack development, and agentic AI architectures with strong algorithmic problem-solving skills.');
  const [skills, setSkills] = useState('React, Next.js, TypeScript, Node.js, Python, PostgreSQL, Prisma, Tailwind CSS, Docker, Git, AWS');

  const [projects, setProjects] = useState([
    { title: 'CampusHub AI – Smart University Operating System', tech: 'Next.js 16, React 19, Prisma, SQLite, Tailwind CSS', bullets: 'Engineered complete campus portal with role-based dashboards, AI assistance, automated fee invoicing, and rate-limited APIs.' },
    { title: 'Distributed Real-time Auction Engine', tech: 'Node.js, Redis, WebSockets, Docker', bullets: 'Built low-latency bidding microservices handling 5,000+ concurrent WebSocket connections with sub-15ms execution.' },
  ]);

  const [atsAnalysis, setAtsAnalysis] = useState<any>({
    atsScore: 88,
    grade: 'Strong ATS Match',
    matchedKeywordsCount: 8,
    recommendations: ['Quantify project impact with benchmark figures.'],
    aiSuggestions: [
      'Use action verbs like "Architected" and "Implemented".',
      'Ensure GitHub and LinkedIn handles are active.'
    ]
  });
  const [analyzing, setAnalyzing] = useState(false);

  const handleAnalyzeResume = async () => {
    setAnalyzing(true);
    try {
      const skillsArray = skills.split(',').map(s => s.trim());
      const res = await fetch('/api/ai/resume-analyzer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skills: skillsArray,
          projects,
          experience: [{ title: 'Software Engineering Intern' }],
          targetRole: 'Full Stack Engineer'
        })
      });
      if (res.ok) {
        const json = await res.json();
        setAtsAnalysis(json.data || json);
        addToast({ title: 'ATS Analysis Complete', message: `Your resume scored ${json.data?.atsScore || 88}/100.`, type: 'success' });
      }
    } catch {
      addToast({ title: 'Error', message: 'Failed to analyze resume', type: 'error' });
    } finally {
      setAnalyzing(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shadow-xs">
              <FileText className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">AI Resume Builder & ATS Match Engine</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">Craft industry-tailored placement resumes with live ATS keyword auditing and instant PDF rendering</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAnalyzeResume}
            disabled={analyzing}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 text-xs font-semibold hover:bg-purple-100 transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-purple-600" />
            {analyzing ? 'Evaluating ATS...' : 'Run AI ATS Audit'}
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" /> Print / Export PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Inputs & ATS Score Card */}
        <div className="lg:col-span-5 space-y-6">
          {/* ATS Score Card */}
          {atsAnalysis && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-card space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-600" /> Campus ATS Readiness
                </span>
                <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                  {atsAnalysis.grade}
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-900">{atsAnalysis.atsScore}</span>
                <span className="text-xs text-slate-400">/ 100 Score</span>
              </div>

              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-500 to-blue-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${atsAnalysis.atsScore}%` }}
                />
              </div>

              <div className="space-y-1.5 text-[11px] text-slate-600 pt-2 border-t border-slate-100">
                {atsAnalysis.aiSuggestions?.map((sug: string, i: number) => (
                  <p key={i} className="flex items-start gap-1.5">
                    <span className="text-purple-600 font-bold">•</span> {sug}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Builder Form */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-card space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900">Personal & Academic Details</h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Full Name</label>
                <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 text-slate-900 outline-none" />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 text-slate-900 outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Phone</label>
                <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 text-slate-900 outline-none" />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">GitHub URL</label>
                <input type="text" value={github} onChange={e => setGithub(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 text-slate-900 outline-none" />
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Professional Summary</label>
              <textarea rows={3} value={summary} onChange={e => setSummary(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 text-slate-900 outline-none" />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Technical Skills (Comma separated)</label>
              <input type="text" value={skills} onChange={e => setSkills(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 text-slate-900 outline-none" />
            </div>
          </div>
        </div>

        {/* Right Column: Live Resume Preview Document */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Standard 1-Page Layout Preview</span>
            <div className="flex items-center gap-1.5">
              {(['MODERN', 'MINIMAL', 'LATEX'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTemplate(t)}
                  className={cn(
                    'px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer',
                    template === t ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Printable Resume Canvas */}
          <div className="bg-white border border-slate-300 rounded-2xl p-8 shadow-xl min-h-[600px] text-slate-900 space-y-5 font-sans">
            {/* Header */}
            <div className="text-center border-b border-slate-200 pb-4 space-y-1">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">{fullName}</h2>
              <p className="text-xs text-slate-600 space-x-2">
                <span>{email}</span> • <span>{phone}</span> • <span>{github}</span>
              </p>
            </div>

            {/* Summary */}
            <div className="space-y-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-700 border-b border-slate-100 pb-1">
                Executive Summary
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed">{summary}</p>
            </div>

            {/* Education */}
            <div className="space-y-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-700 border-b border-slate-100 pb-1">
                Education
              </h3>
              <div className="flex items-center justify-between text-xs font-semibold">
                <span>B.Tech in Computer Science & Engineering (CampusHub Institute)</span>
                <span>2023 – 2027</span>
              </div>
              <p className="text-xs text-slate-600">Current CGPA: 8.42 / 10.0 • Specialization: Artificial Intelligence</p>
            </div>

            {/* Technical Skills */}
            <div className="space-y-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-700 border-b border-slate-100 pb-1">
                Technical Proficiencies
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed font-mono">{skills}</p>
            </div>

            {/* Projects */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-700 border-b border-slate-100 pb-1">
                Featured Projects
              </h3>
              {projects.map((proj, idx) => (
                <div key={idx} className="space-y-0.5 text-xs">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span>{proj.title}</span>
                    <span className="text-[11px] font-mono text-slate-500 font-normal">Production Ready</span>
                  </div>
                  <p className="text-[11px] font-mono text-blue-600 font-semibold">{proj.tech}</p>
                  <p className="text-xs text-slate-700 leading-relaxed">• {proj.bullets}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
