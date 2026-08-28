'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, 
  IndianRupee, 
  ArrowLeft, 
  Plus, 
  FileText, 
  Clock, 
  Building2, 
  CheckCircle2, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export default function ProcurementPage() {
  const [data, setData] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    department: 'Advanced Computing Center',
    estimatedBudgetInrLakhs: 25.0,
    biddingDeadline: '2026-10-15'
  });

  useEffect(() => {
    fetch('/api/admin/procurement')
      .then(res => res.json())
      .then(json => {
        if (json.success) setData(json.data);
      });
  }, []);

  const handleCreateTender = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    const res = await fetch('/api/admin/procurement', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const json = await res.json();
    if (json.success) {
      setData({
        ...data,
        tenders: [json.data, ...data.tenders],
        totalBudgetLakhs: data.totalBudgetLakhs + json.data.estimatedBudgetInrLakhs
      });
      setShowModal(false);
      setFormData({
        title: '',
        department: 'Advanced Computing Center',
        estimatedBudgetInrLakhs: 25.0,
        biddingDeadline: '2026-10-15'
      });
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-slate-900/40 p-6 rounded-2xl border border-blue-500/20 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 text-blue-400 mb-1">
            <Link href="/dashboard/admin" className="flex items-center gap-1 hover:underline text-xs">
              <ArrowLeft className="w-3 h-3" /> Back to Admin Console
            </Link>
            <span className="text-slate-500">•</span>
            <span className="text-xs font-semibold uppercase tracking-wider">CPPP E-Tendering & Finance</span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-blue-400" />
            Automated Procurement & E-Tendering Vendor Management
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage institutional capital requisitions, multi-vendor L1 comparative statements, and automated purchase orders.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Float New E-Tender
        </button>
      </div>

      {data && (
        <>
          {/* Top Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-1">
              <div className="text-xs text-slate-400">Total Tender Outlay Value</div>
              <div className="text-2xl font-bold text-white flex items-center">
                <IndianRupee className="w-5 h-5 text-blue-400" /> {data.totalBudgetLakhs} Lakhs
              </div>
              <div className="text-[11px] text-blue-400 font-medium">Fully GST & GeM Compliant</div>
            </div>

            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-1">
              <div className="text-xs text-slate-400">Active Open Tenders</div>
              <div className="text-2xl font-bold text-emerald-400">{data.activeTendersCount} Live</div>
              <div className="text-[11px] text-slate-400">2 Stage Technical & Commercial Bidding</div>
            </div>

            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-1">
              <div className="text-xs text-slate-400">Empanelled GeM Vendors</div>
              <div className="text-2xl font-bold text-amber-400">{data.registeredVendorsCount} Vendors</div>
              <div className="text-[11px] text-slate-400">Verified MSME / Enterprise status</div>
            </div>
          </div>

          {/* Tenders List */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-white">Active Procurement Tenders</h2>
            <div className="grid grid-cols-1 gap-4">
              {data.tenders?.map((t: any) => (
                <div key={t.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all space-y-3">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-md">
                          {t.id}
                        </span>
                        <span className="text-xs text-slate-400">{t.department}</span>
                      </div>
                      <h3 className="text-base font-bold text-white">{t.title}</h3>
                      <div className="text-xs text-slate-300">
                        Lowest Bidder: <strong className="text-emerald-400">{t.lowestBidder}</strong>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs text-slate-400">Estimated Budget</div>
                      <div className="text-lg font-bold text-white">₹{t.estimatedBudgetInrLakhs} Lakhs</div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-500" /> Deadline: {t.biddingDeadline}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/20 text-blue-300">
                      {t.currentStage?.replace(/_/g, ' ')}
                    </span>
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
            <h2 className="text-base font-bold text-white">Float E-Tender Requisition</h2>
            <form onSubmit={handleCreateTender} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Tender Title / Equipment Package</label>
                <input
                  type="text"
                  placeholder="e.g. Turnkey Smart Classroom 4K Interactive Panels"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Requisitioning Department</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={e => setFormData({ ...formData, department: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Estimated Budget (Lakhs)</label>
                  <input
                    type="number"
                    value={formData.estimatedBudgetInrLakhs}
                    onChange={e => setFormData({ ...formData, estimatedBudgetInrLakhs: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Bidding Deadline</label>
                  <input
                    type="date"
                    value={formData.biddingDeadline}
                    onChange={e => setFormData({ ...formData, biddingDeadline: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
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
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold"
                >
                  Publish to GeM Portal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
