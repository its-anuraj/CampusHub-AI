'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Award, DollarSign, Plus, Download, ExternalLink, Sparkles, Search, CheckCircle2, FileText, Send, X, TrendingUp, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/lib/toastContext';
import { exportToCSV } from '@/lib/exportUtils';

export default function FacultyResearchPage() {
  const { addToast } = useToast();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paperModal, setPaperModal] = useState(false);
  const [grantModal, setGrantModal] = useState(false);

  // Form State for Paper
  const [title, setTitle] = useState('');
  const [journal, setJournal] = useState('IEEE Transactions on Cloud Computing');
  const [doi, setDoi] = useState('');
  const [year, setYear] = useState('2026');
  const [abstract, setAbstract] = useState('');

  // Form State for Grant
  const [grantTitle, setGrantTitle] = useState('');
  const [agency, setAgency] = useState('DST - SERB (Science and Engineering Research Board)');
  const [grantAmount, setGrantAmount] = useState('3500000');
  const [duration, setDuration] = useState('2026 - 2029 (3 Years)');
  const [submitting, setSubmitting] = useState(false);

  const fetchResearch = async () => {
    try {
      const res = await fetch('/api/research');
      if (res.ok) {
        const json = await res.json();
        setData(json.data || json);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResearch();
  }, []);

  const handleAddPublication = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          journal,
          doi,
          year,
          abstract,
          facultyName: 'Dr. Ramesh Kumar',
          department: 'Computer Science & Engineering'
        })
      });

      if (res.ok) {
        addToast({ title: 'Paper Logged', message: 'Publication registered in Scopus / Web of Science ledger.', type: 'success' });
        setPaperModal(false);
        setTitle('');
        setDoi('');
        setAbstract('');
        fetchResearch();
      }
    } catch {
      addToast({ title: 'Error', message: 'Could not log paper.', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleApplyGrant = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'APPLY_GRANT',
          title: grantTitle,
          agency,
          grantAmount,
          duration,
          facultyName: 'Dr. Ramesh Kumar (Principal Investigator)'
        })
      });

      if (res.ok) {
        addToast({ title: 'Proposal Submitted', message: 'Grant proposal dispatched to Dean (R&D) & Funding Agency desk.', type: 'success' });
        setGrantModal(false);
        setGrantTitle('');
        fetchResearch();
      }
    } catch {
      addToast({ title: 'Error', message: 'Could not submit grant application.', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleExportDossier = () => {
    const rows = (data?.publications || []).map((p: any) => ({
      'Paper Title': p.title,
      'Journal / Conference': p.journal,
      'Publication Year': p.year,
      'DOI Reference': p.doi || 'N/A',
      'Citation Count': p.citations,
      'Lead Faculty': p.facultyName,
      'Department': p.department
    }));
    exportToCSV('Faculty_Research_Dossier_2026', rows);
    addToast({ title: 'Dossier Downloaded', message: 'Exported Scopus & Web of Science citations to CSV.', type: 'success' });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-700 via-purple-700 to-indigo-700 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" /> Research & Sponsored Projects Hub
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Faculty Research, Grants & Citations</h1>
          <p className="text-white/90 text-sm sm:text-base">
            Track funded extramural grants (DST, SERB, MeitY, ISRO), log peer-reviewed IEEE/Springer publications, and download audited research dossiers.
          </p>
        </div>
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-xs text-muted-foreground font-medium">Scopus Publications</p>
          <p className="text-2xl font-bold text-foreground mt-1 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-500" /> {data?.metrics?.totalPapers || 24}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-xs text-muted-foreground font-medium">Total Citations</p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" /> {data?.metrics?.totalCitations || 1420}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-xs text-muted-foreground font-medium">h-Index Score</p>
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1 flex items-center gap-2">
            <Award className="w-5 h-5" /> {data?.metrics?.hIndex || 18}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-xs text-muted-foreground font-medium">i10-Index</p>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-2">
            <Layers className="w-5 h-5" /> {data?.metrics?.i10Index || 21}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border col-span-2 lg:col-span-1">
          <p className="text-xs text-muted-foreground font-medium">Sanctioned Grants</p>
          <p className="text-2xl font-bold text-violet-600 dark:text-violet-400 mt-1 flex items-center gap-2">
            <DollarSign className="w-5 h-5" /> {data?.metrics?.totalGrantFunding || '₹73.0 L'}
          </p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">Extramural Grants & Research Works</h2>
          <p className="text-xs text-muted-foreground">NIRF Criteria 3 & NBA Research Parameter Tracking</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportDossier}
            className="px-3.5 py-2 rounded-xl border border-border hover:bg-muted text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV Dossier
          </button>
          <button
            onClick={() => setPaperModal(true)}
            className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
          >
            <Plus className="w-3.5 h-3.5" /> Log Publication
          </button>
          <button
            onClick={() => setGrantModal(true)}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
          >
            <Send className="w-3.5 h-3.5" /> Apply for Grant
          </button>
        </div>
      </div>

      {/* Grants Section */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-emerald-500" /> Funded Research Projects & Extramural Grants
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data?.grants?.map((grant: any) => (
            <div key={grant.id} className="p-5 rounded-2xl bg-card border border-border space-y-3 shadow-xs">
              <div className="flex items-start justify-between gap-3">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-muted text-foreground">
                  {grant.agency}
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  {grant.status}
                </span>
              </div>
              <h4 className="font-bold text-sm text-foreground">{grant.title}</h4>
              <div className="flex items-center justify-between text-xs pt-2 border-t border-border/60">
                <span className="text-muted-foreground">Sanctioned Budget:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono text-sm">
                  ₹{(grant.grantAmount / 100000).toFixed(1)} Lakhs
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Duration: {grant.duration}</span>
                <span>{grant.leadPi}</span>
              </div>
              {grant.progress && (
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[11px] text-muted-foreground font-medium">
                    <span>Milestone Completion</span>
                    <span>{grant.progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                    <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${grant.progress}%` }} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Publications Section */}
      <div className="space-y-4 pt-2">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-purple-500" /> Scopus & IEEE Indexed Publications
        </h3>
        <div className="space-y-3">
          {data?.publications?.map((paper: any) => (
            <div
              key={paper.id}
              className="p-5 rounded-2xl bg-card border border-border hover:border-purple-500/40 space-y-2 shadow-xs transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h4 className="font-bold text-sm text-foreground">{paper.title}</h4>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground self-start sm:self-auto shrink-0">
                  Year: {paper.year}
                </span>
              </div>
              <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold">{paper.journal}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{paper.abstract}</p>
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/60 text-xs text-muted-foreground">
                <span>DOI: <strong className="text-foreground font-mono">{paper.doi || 'Under Processing'}</strong></span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">{paper.citations || 0} Citations</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Log Paper Modal */}
      {paperModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-3 border-b border-border">
              <h3 className="font-bold text-lg">Log Peer-Reviewed Paper</h3>
              <button onClick={() => setPaperModal(false)} className="p-1 rounded text-muted-foreground hover:bg-muted">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddPublication} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Paper Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Agentic Systems for Edge AI"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-background border border-border rounded-xl focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Journal / Conference</label>
                <input
                  type="text"
                  required
                  value={journal}
                  onChange={(e) => setJournal(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-background border border-border rounded-xl focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">DOI Number</label>
                  <input
                    type="text"
                    placeholder="10.1109/..."
                    value={doi}
                    onChange={(e) => setDoi(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-background border border-border rounded-xl focus:ring-2 focus:ring-purple-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Publication Year</label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-background border border-border rounded-xl focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Abstract Summary</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Key research methodology, formulation, and findings..."
                  value={abstract}
                  onChange={(e) => setAbstract(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-background border border-border rounded-xl focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPaperModal(false)}
                  className="px-4 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-md disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Register Publication'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grant Proposal Modal */}
      {grantModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-3 border-b border-border">
              <h3 className="font-bold text-lg">Apply for Extramural Grant</h3>
              <button onClick={() => setGrantModal(false)} className="p-1 rounded text-muted-foreground hover:bg-muted">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleApplyGrant} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Project / Proposal Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Next-Generation Autonomous Edge Sensors"
                  value={grantTitle}
                  onChange={(e) => setGrantTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-background border border-border rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Funding Agency</label>
                <select
                  value={agency}
                  onChange={(e) => setAgency(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-background border border-border rounded-xl focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="DST - SERB (Science and Engineering Research Board)">DST - SERB</option>
                  <option value="MeitY (Ministry of Electronics and Information Technology)">MeitY</option>
                  <option value="AICTE RPS (Research Promotion Scheme)">AICTE RPS</option>
                  <option value="ISRO RESPOND Program">ISRO RESPOND Program</option>
                  <option value="Corporate Industry CSR Grant">Corporate Industry CSR Grant</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Budget (INR)</label>
                  <input
                    type="number"
                    required
                    value={grantAmount}
                    onChange={(e) => setGrantAmount(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-background border border-border rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Proposed Duration</label>
                  <input
                    type="text"
                    required
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-background border border-border rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setGrantModal(false)}
                  className="px-4 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Grant Proposal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
