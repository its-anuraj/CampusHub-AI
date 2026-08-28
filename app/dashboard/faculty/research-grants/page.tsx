'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FolderGit2, 
  IndianRupee, 
  CheckCircle2, 
  Clock, 
  ArrowLeft, 
  Plus, 
  FileText, 
  TrendingUp, 
  Building2, 
  Sparkles,
  Award
} from 'lucide-react';

export default function ResearchGrantsPage() {
  const [data, setData] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    projectTitle: '',
    fundingAgency: 'DST (Department of Science & Technology)',
    principalInvestigator: 'Dr. Rajesh Kulkarni',
    totalSanctionedAmountLakhs: 35.0
  });

  useEffect(() => {
    fetch('/api/faculty/grants')
      .then(res => res.json())
      .then(json => {
        if (json.success) setData(json.data);
      });
  }, []);

  const handleCreateGrant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.projectTitle) return;

    const res = await fetch('/api/faculty/grants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const json = await res.json();
    if (json.success) {
      setData({
        ...data,
        grants: [json.data, ...data.grants],
        totalFundingLakhs: data.totalFundingLakhs + json.data.totalSanctionedAmountLakhs
      });
      setShowModal(false);
      setFormData({
        projectTitle: '',
        fundingAgency: 'DST (Department of Science & Technology)',
        principalInvestigator: 'Dr. Rajesh Kulkarni',
        totalSanctionedAmountLakhs: 35.0
      });
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-teal-900/40 via-emerald-900/30 to-slate-900/40 p-6 rounded-2xl border border-teal-500/20 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 text-teal-400 mb-1">
            <Link href="/dashboard/faculty" className="flex items-center gap-1 hover:underline text-xs">
              <ArrowLeft className="w-3 h-3" /> Back to Faculty Portal
            </Link>
            <span className="text-slate-500">•</span>
            <span className="text-xs font-semibold uppercase tracking-wider">Dean (R&D) Sponsored Projects</span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FolderGit2 className="w-6 h-6 text-teal-400" />
            Grant Proposal & Sponsored Research Project Tracker
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Track funded research projects, DST/SERB/AICTE budget utilization burn-down charts, and milestone deliverable audits.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-500/20 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Submit Proposal
        </button>
      </div>

      {data && (
        <>
          {/* Top Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-1">
              <div className="text-xs text-slate-400">Total Sanctioned Grants</div>
              <div className="text-2xl font-bold text-white flex items-center">
                <IndianRupee className="w-5 h-5 text-teal-400" /> {data.totalFundingLakhs} Lakhs
              </div>
              <div className="text-[11px] text-teal-400 font-medium">{data.activeProjectsCount} Sponsored Projects Active</div>
            </div>

            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-1">
              <div className="text-xs text-slate-400">Funds Utilized (Audited)</div>
              <div className="text-2xl font-bold text-white flex items-center">
                <IndianRupee className="w-5 h-5 text-emerald-400" /> {data.totalUtilizedLakhs} Lakhs
              </div>
              <div className="text-[11px] text-slate-400">Utilization Certificate (UC) up-to-date</div>
            </div>

            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-1">
              <div className="text-xs text-slate-400">Institutional Overhead Retained</div>
              <div className="text-2xl font-bold text-white flex items-center">
                <IndianRupee className="w-5 h-5 text-amber-400" /> {(data.totalFundingLakhs * 0.15).toFixed(1)} Lakhs
              </div>
              <div className="text-[11px] text-amber-400">15% Research Overhead Pool</div>
            </div>
          </div>

          {/* Grants Cards List */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-white">Active Sponsored Grants</h2>
            <div className="grid grid-cols-1 gap-4">
              {data.grants?.map((grant: any) => (
                <div key={grant.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all space-y-4">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/20">
                          {grant.fundingAgency}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">Sanction: {grant.sanctionOrderNo}</span>
                      </div>
                      <h3 className="text-base font-bold text-white">{grant.projectTitle}</h3>
                      <div className="text-xs text-slate-300">
                        PI: <span className="text-white font-medium">{grant.principalInvestigator}</span> | Co-PI: <span className="text-slate-400">{grant.coPI}</span>
                      </div>
                    </div>

                    <div className="bg-teal-950/30 border border-teal-500/20 px-4 py-2 rounded-xl text-right shrink-0">
                      <div className="text-[10px] text-teal-300 uppercase font-semibold">Total Outlay</div>
                      <div className="text-lg font-bold text-white">₹{grant.totalSanctionedAmountLakhs} Lakhs</div>
                    </div>
                  </div>

                  {/* Milestones */}
                  <div className="space-y-2 pt-2 border-t border-slate-800/80">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Project Milestones:</span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      {grant.milestones?.map((m: any, mIdx: number) => (
                        <div key={mIdx} className="bg-slate-800/40 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-300 flex items-center justify-between">
                          <span className="truncate pr-2">{m.name}</span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                            m.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                          }`}>
                            {m.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4">
            <h2 className="text-base font-bold text-white">Submit New Sponsored Project Proposal</h2>
            <form onSubmit={handleCreateGrant} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Project Title</label>
                <input
                  type="text"
                  placeholder="e.g. Next-Generation Post-Quantum Encryption Engine"
                  value={formData.projectTitle}
                  onChange={e => setFormData({ ...formData, projectTitle: e.target.value })}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Funding Agency</label>
                <select
                  value={formData.fundingAgency}
                  onChange={e => setFormData({ ...formData, fundingAgency: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                >
                  <option value="DST (Department of Science & Technology)">DST</option>
                  <option value="SERB (Science and Engineering Research Board)">SERB</option>
                  <option value="AICTE RPS (Research Promotion Scheme)">AICTE RPS</option>
                  <option value="DRDO Research Grant">DRDO</option>
                  <option value="Industry Sponsored (TCS / Infosys Foundation)">Industry Grant</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Requested Outlay (₹ in Lakhs)</label>
                <input
                  type="number"
                  value={formData.totalSanctionedAmountLakhs}
                  onChange={e => setFormData({ ...formData, totalSanctionedAmountLakhs: Number(e.target.value) })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-1.5 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-semibold"
                >
                  Submit to R&D Dean
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
