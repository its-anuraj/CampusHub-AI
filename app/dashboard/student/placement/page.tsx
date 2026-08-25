'use client';

import { useState, useEffect } from 'react';
import {
  Briefcase,
  Calendar,
  Building2,
  CheckCircle2,
  Search,
  DollarSign,
  Clock,
  Sparkles,
  Award,
  AlertCircle,
  FileCheck,
  TrendingUp,
  UserCheck,
  Code2,
  Play,
  Check,
  Send,
  HelpCircle
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { placementCompanies as defaultCompanies } from '@/lib/mockData';
import { useToast } from '@/lib/toastContext';
import { cn } from '@/lib/utils';

const MOCK_QUESTIONS = [
  {
    id: 'q1',
    company: 'Google / Amazon',
    category: 'DSA & Algorithms',
    title: 'Design an LRU Cache with O(1) Get and Put Operations',
    description: 'Implement a Least Recently Used (LRU) cache using a Doubly Linked List and Hash Map. Explain capacity eviction logic.',
    difficulty: 'Medium',
    expectedKeywords: ['DoublyLinkedList', 'HashMap', 'eviction', 'O(1)', 'pointers']
  },
  {
    id: 'q2',
    company: 'Microsoft / Adobe',
    category: 'System Design',
    title: 'Architect a Scalable URL Shortener Service (TinyURL)',
    description: 'Estimate QPS capacity, database schema (Relational vs NoSQL), Base62 hashing, and Redis caching layer.',
    difficulty: 'Hard',
    expectedKeywords: ['Base62', 'Redis', 'Hashing', 'Load Balancer', 'Throughput']
  },
  {
    id: 'q3',
    company: 'Goldman Sachs / Morgan Stanley',
    category: 'Behavioral STAR',
    title: 'Describe a complex engineering bug you encountered and resolved under pressure',
    description: 'Use Situation, Task, Action, and Result format to explain your technical problem-solving approach.',
    difficulty: 'Easy',
    expectedKeywords: ['Situation', 'Action', 'Result', 'Root Cause', 'Testing']
  }
];

export default function StudentPlacementPage() {
  const { addToast } = useToast();
  const [filter, setFilter] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [appliedIds, setAppliedIds] = useState<string[]>(['1']);
  const [activeTab, setActiveTab] = useState<'DRIVES' | 'APPLICATIONS' | 'INTERVIEWS'>('DRIVES');
  const [companies, setCompanies] = useState<any[]>(defaultCompanies);

  // Mock Interview State
  const [selectedQuestion, setSelectedQuestion] = useState(MOCK_QUESTIONS[0]);
  const [userAnswer, setUserAnswer] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [evalResult, setEvalResult] = useState<any>(null);

  const studentProfile = {
    name: 'Anuraj Singh',
    cgpa: 8.2,
    department: 'Computer Science & Engineering',
    backlogs: 0,
    resumeReady: true,
  };

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch('/api/placements');
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) setCompanies(data);
        }
      } catch (error) {
        console.error('Failed to fetch placements:', error);
      }
    };
    fetchCompanies();
  }, []);

  const filteredCompanies = companies.filter((c: any) => {
    if (filter !== 'ALL' && c.status !== filter) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.role.toLowerCase().includes(search.toLowerCase()))
      return false;
    return true;
  });

  const handleApply = (company: any) => {
    if (studentProfile.cgpa < (company.minCgpa || 6.0)) {
      addToast({
        title: 'Eligibility Criteria',
        message: `Minimum CGPA requirement is ${company.minCgpa}. Your CGPA is ${studentProfile.cgpa}.`,
        type: 'error'
      });
      return;
    }

    setAppliedIds((prev) => [...prev, company.id]);
    addToast({
      title: 'Application Submitted!',
      message: `Verified profile & ATS resume submitted for ${company.role} at ${company.name}.`,
      type: 'success'
    });
  };

  const handleEvaluateAnswer = () => {
    if (!userAnswer.trim()) {
      addToast({ title: 'Empty Response', message: 'Please write your solution or explanation before submitting.', type: 'warning' });
      return;
    }
    setEvaluating(true);
    setTimeout(() => {
      setEvaluating(false);
      setEvalResult({
        score: 92,
        feedback: 'Excellent structure! Clear algorithmic complexity breakdown, proper edge case handling, and optimal data structure choices.',
        matchedKeywords: selectedQuestion.expectedKeywords
      });
      addToast({
        title: 'Interview Assessment Ready',
        message: 'AI Evaluation Score: 92/100 (Strong Hire recommendation).',
        type: 'success'
      });
    }, 1200);
  };

  const getAiMatchScore = (name: string) => {
    if (name.includes('Google') || name.includes('Microsoft')) return 94;
    if (name.includes('Amazon') || name.includes('Adobe')) return 89;
    if (name.includes('TCS') || name.includes('Infosys')) return 98;
    return 86;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wider">
            <Briefcase className="w-3.5 h-3.5 text-yellow-300" /> Career Services & Placements
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Campus Recruitment & Mock Technical Arena</h1>
          <p className="text-white/90 text-sm sm:text-base">
            Explore 2026-27 campus hiring drives, verified eligibility checks, ATS resume score matching, and AI mock technical interview simulations.
          </p>
        </div>
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Profile Bar */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center text-base font-bold">
            AS
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">{studentProfile.name} • {studentProfile.department}</h3>
            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
              <span>CGPA: <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{studentProfile.cgpa}</strong></span>
              <span>•</span>
              <span>Backlogs: <strong className="text-foreground font-semibold">{studentProfile.backlogs}</strong></span>
            </div>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1.5 p-1 bg-muted rounded-xl">
          <button
            onClick={() => setActiveTab('DRIVES')}
            className={cn(
              "px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all",
              activeTab === 'DRIVES' ? "bg-card text-blue-600 dark:text-blue-400 shadow-xs" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Drives ({companies.length})
          </button>
          <button
            onClick={() => setActiveTab('APPLICATIONS')}
            className={cn(
              "px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1",
              activeTab === 'APPLICATIONS' ? "bg-card text-blue-600 dark:text-blue-400 shadow-xs" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <span>Applications ({appliedIds.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('INTERVIEWS')}
            className={cn(
              "px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5",
              activeTab === 'INTERVIEWS' ? "bg-card text-blue-600 dark:text-blue-400 shadow-xs" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Code2 className="w-3.5 h-3.5 text-purple-500" />
            <span>Mock Arena</span>
          </button>
        </div>
      </div>

      {activeTab === 'DRIVES' ? (
        <>
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border shadow-xs">
            <div className="relative flex-1 sm:max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                placeholder="Search company name, role (e.g. SDE, Data Analyst)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-background border border-border rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-1">
              {['ALL', 'OPEN', 'UPCOMING', 'CLOSED'].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-xs font-semibold transition-all",
                    filter === s ? "bg-blue-600 text-white shadow-xs" : "bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Company Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCompanies.map((company) => {
              const isApplied = appliedIds.includes(company.id);
              const isEligible = studentProfile.cgpa >= (company.minCgpa || 6.0);
              const matchScore = getAiMatchScore(company.name);

              return (
                <div
                  key={company.id}
                  className="bg-card border border-border hover:border-blue-500/50 rounded-2xl p-5 shadow-xs transition flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm">
                          {company.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-foreground leading-tight">{company.name}</h3>
                          <span className="text-xs text-muted-foreground font-medium">{company.role}</span>
                        </div>
                      </div>
                      <span
                        className={cn(
                          "text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase",
                          company.status === 'OPEN'
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                            : company.status === 'UPCOMING'
                            ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                            : "bg-muted text-muted-foreground border-border"
                        )}
                      >
                        {company.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 bg-muted/40 rounded-xl p-3 text-xs">
                      <div>
                        <span className="text-[10px] text-muted-foreground block uppercase">CTC Package</span>
                        <strong className="text-foreground font-mono">{company.package}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground block uppercase">Min CGPA</span>
                        <strong className={isEligible ? "text-emerald-600 dark:text-emerald-400 font-bold font-mono" : "text-rose-600 font-bold font-mono"}>
                          {company.minCgpa || 6.0} CGPA
                        </strong>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
                      <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-medium">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>ATS Resume Match</span>
                      </div>
                      <span className="font-bold text-blue-600 dark:text-blue-400">{matchScore}% Match</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border/60 flex items-center justify-between">
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Due: {formatDate(company.deadline)}
                    </span>

                    {isApplied ? (
                      <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Applied
                      </span>
                    ) : (
                      <button
                        onClick={() => handleApply(company)}
                        disabled={company.status !== 'OPEN' || !isEligible}
                        className={cn(
                          "px-4 py-1.5 rounded-xl text-xs font-bold transition shadow-xs",
                          company.status === 'OPEN' && isEligible
                            ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20"
                            : "bg-muted text-muted-foreground cursor-not-allowed border border-border"
                        )}
                      >
                        {!isEligible ? 'Below Cutoff' : 'Apply Now'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : activeTab === 'APPLICATIONS' ? (
        /* My Applications Tab */
        <div className="bg-card border border-border rounded-2xl p-5 shadow-xs divide-y divide-border/60">
          {companies
            .filter((c) => appliedIds.includes(c.id))
            .map((c) => (
              <div key={c.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-sm">
                    {c.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">{c.name}</h4>
                    <p className="text-xs text-muted-foreground">{c.role} • {c.package}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                    Resume Shortlisted • Round 1 Technical
                  </span>
                </div>
              </div>
            ))}
        </div>
      ) : (
        /* Mock Technical Interview Arena */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-3">
            <h3 className="font-bold text-base text-foreground">Interview Questions Bank</h3>
            <div className="space-y-2">
              {MOCK_QUESTIONS.map((q) => (
                <button
                  key={q.id}
                  onClick={() => {
                    setSelectedQuestion(q);
                    setEvalResult(null);
                  }}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border transition",
                    selectedQuestion.id === q.id
                      ? "border-blue-500 bg-blue-500/10 text-foreground"
                      : "border-border hover:bg-muted text-muted-foreground"
                  )}
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-blue-600 dark:text-blue-400">{q.company}</span>
                    <span className="px-2 py-0.5 rounded bg-muted text-[10px] font-semibold">{q.difficulty}</span>
                  </div>
                  <p className="text-sm font-bold text-foreground mt-1.5 line-clamp-2">{q.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{q.category}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-start justify-between gap-3 border-b border-border pb-3">
                <div>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{selectedQuestion.category}</span>
                  <h3 className="font-bold text-lg text-foreground mt-0.5">{selectedQuestion.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{selectedQuestion.description}</p>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
                  Write Your Technical Solution / Architectural Approach
                </label>
                <textarea
                  rows={8}
                  placeholder="Provide pseudocode, algorithmic complexity (Time & Space), or STAR behavioral explanation..."
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="w-full p-3.5 text-xs sm:text-sm font-mono bg-background border border-border rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-xs text-muted-foreground">AI evaluator analyzes keywords, complexity & design</span>
                <button
                  onClick={handleEvaluateAnswer}
                  disabled={evaluating}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-blue-500/20 disabled:opacity-50 transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  {evaluating ? 'Analyzing Solution...' : 'Submit & AI Review'}
                </button>
              </div>

              {evalResult && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> AI Technical Evaluation
                    </span>
                    <strong className="text-sm font-mono text-emerald-600 dark:text-emerald-400">
                      Score: {evalResult.score}/100
                    </strong>
                  </div>
                  <p className="text-xs text-foreground leading-relaxed">{evalResult.feedback}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
