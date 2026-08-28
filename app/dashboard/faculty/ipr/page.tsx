'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Lightbulb, 
  ArrowLeft, 
  Plus, 
  CheckCircle2, 
  FileCheck, 
  ShieldCheck, 
  Layers, 
  Building2,
  Sparkles
} from 'lucide-react';

export default function FacultyIPRPage() {
  const [data, setData] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    inventors: 'Dr. Vivek Swaminathan, Aditya Singh',
    jurisdiction: 'Indian Patent Office (IPO - Chennai)'
  });

  useEffect(() => {
    fetch('/api/faculty/ipr')
      .then(res => res.json())
      .then(json => {
        if (json.success) setData(json.data);
      });
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    const res = await fetch('/api/faculty/ipr', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: formData.title,
        inventors: formData.inventors.split(',').map(s => s.trim()),
        jurisdiction: formData.jurisdiction
      })
    });
    const json = await res.json();
    if (json.success) {
      setData({
        ...data,
        patents: [json.data, ...data.patents],
        totalPatentsFiled: data.totalPatentsFiled + 1
      });
      setShowModal(false);
      setFormData({
        title: '',
        inventors: 'Dr. Vivek Swaminathan, Aditya Singh',
        jurisdiction: 'Indian Patent Office (IPO - Chennai)'
      });
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-amber-900/40 via-yellow-900/30 to-slate-900/40 p-6 rounded-2xl border border-amber-500/20 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 text-amber-400 mb-1">
            <Link href="/dashboard/faculty" className="flex items-center gap-1 hover:underline text-xs">
              <ArrowLeft className="w-3 h-3" /> Back to Faculty Portal
            </Link>
            <span className="text-slate-500">•</span>
            <span className="text-xs font-semibold uppercase tracking-wider">Institutional IPR & Tech Transfer Cell</span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-yellow-400" />
            Patent & Intellectual Property (IPR) Filing Management Desk
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Track invention disclosures, patent application stages (Provisional, Complete, Examination, Grant), and commercialization licensing.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-500/20 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> File New Invention Disclosure
        </button>
      </div>

      {data && (
        <>
          {/* Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-1">
              <div className="text-xs text-slate-400">Total Patents Filed</div>
              <div className="text-2xl font-bold text-white">{data.totalPatentsFiled} Active</div>
              <div className="text-[11px] text-amber-400">100% University IPR Attorney Sponsored</div>
            </div>

            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-1">
              <div className="text-xs text-slate-400">Granted Commercial Patents</div>
              <div className="text-2xl font-bold text-emerald-400">{data.patentsGranted} Granted</div>
              <div className="text-[11px] text-slate-400">2 Technology Transfers to Incubator Startups</div>
            </div>

            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-1">
              <div className="text-xs text-slate-400">IPR Filing Subsidy Pool</div>
              <div className="text-2xl font-bold text-blue-400">₹{data.institutionalSupportGrantInr}</div>
              <div className="text-[11px] text-slate-400">Covers 100% of IPO Govt fees & drafting</div>
            </div>
          </div>

          {/* Patents List */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-white">Patents & Inventions Portfolio</h2>
            <div className="grid grid-cols-1 gap-4">
              {data.patents?.map((pat: any) => (
                <div key={pat.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all space-y-3">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          App No: {pat.applicationNumber}
                        </span>
                        <span className="text-xs text-slate-400">{pat.jurisdiction}</span>
                      </div>
                      <h3 className="text-base font-bold text-white">{pat.title}</h3>
                      <div className="text-xs text-slate-300">
                        Inventors: <strong className="text-white">{Array.isArray(pat.inventors) ? pat.inventors.join(', ') : pat.inventors}</strong>
                      </div>
                    </div>

                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-semibold self-start shrink-0">
                      {pat.currentStage?.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <span>Filing Date: {pat.filingDate}</span>
                    <span className="text-emerald-400 font-medium">Status: {pat.commercializationStatus?.replace(/_/g, ' ')}</span>
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
            <h2 className="text-base font-bold text-white">File New Invention Disclosure</h2>
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Invention Title</label>
                <input
                  type="text"
                  placeholder="e.g. Real-Time FPGA Neural Accelerator for ECG Anomaly Detection"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Inventors (Comma Separated)</label>
                <input
                  type="text"
                  value={formData.inventors}
                  onChange={e => setFormData({ ...formData, inventors: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Target Patent Jurisdiction</label>
                <select
                  value={formData.jurisdiction}
                  onChange={e => setFormData({ ...formData, jurisdiction: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                >
                  <option value="Indian Patent Office (IPO - Chennai)">Indian Patent Office (IPO - Chennai)</option>
                  <option value="Indian Patent Office (IPO - Mumbai)">Indian Patent Office (IPO - Mumbai)</option>
                  <option value="PCT International Filing (WIPO)">PCT International Filing (WIPO)</option>
                  <option value="US Patent & Trademark Office (USPTO)">US PTO</option>
                </select>
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
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-semibold"
                >
                  Submit to IPR Cell
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
