'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Printer, 
  FileText, 
  KeyRound, 
  Clock, 
  ArrowLeft, 
  UploadCloud, 
  CheckCircle2, 
  MapPin, 
  Layers, 
  IndianRupee,
  Sparkles
} from 'lucide-react';

export default function CampusPrintingPage() {
  const [queue, setQueue] = useState<any[]>([]);
  const [kiosks, setKiosks] = useState<any[]>([]);
  const [quota, setQuota] = useState(186);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [formData, setFormData] = useState({
    fileName: '',
    pages: 4,
    colorMode: 'Grayscale',
    duplex: 'Double-Sided',
    copies: 1,
    kioskLocation: 'Central Library 1st Floor (Kiosk #2)'
  });

  useEffect(() => {
    fetch('/api/printing')
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setQueue(json.data.queue);
          setKiosks(json.data.kiosks);
          setQuota(json.data.monthlyQuotaRemainingPages);
        }
      });
  }, []);

  const handleQueueJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fileName) return;

    const res = await fetch('/api/printing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const json = await res.json();
    if (json.success) {
      setQueue([json.data, ...queue]);
      setShowUploadModal(false);
      setFormData({
        fileName: '',
        pages: 4,
        colorMode: 'Grayscale',
        duplex: 'Double-Sided',
        copies: 1,
        kioskLocation: 'Central Library 1st Floor (Kiosk #2)'
      });
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-900/40 via-sky-900/30 to-slate-900/40 p-6 rounded-2xl border border-blue-500/20 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 text-blue-400 mb-1">
            <Link href="/dashboard/student" className="flex items-center gap-1 hover:underline text-xs">
              <ArrowLeft className="w-3 h-3" /> Back to Dashboard
            </Link>
            <span className="text-slate-500">•</span>
            <span className="text-xs font-semibold uppercase tracking-wider">Smart Campus Infrastructure</span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Printer className="w-6 h-6 text-blue-400" />
            Campus Printing Kiosk & Cloud Document Queue
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Upload assignment records and research notes from anywhere. Walk up to any campus kiosk and enter your PIN for instant pickup.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-900/80 border border-blue-500/30 px-3.5 py-2 rounded-2xl text-right">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Free Student Quota</div>
            <div className="text-base font-bold text-blue-400">{quota} Pages Left</div>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 transition-all"
          >
            <UploadCloud className="w-4 h-4" /> Send Document to Kiosk
          </button>
        </div>
      </div>

      {/* Kiosk Telemetry Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {kiosks.map(k => (
          <div key={k.id} className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-400" /> {k.name}
              </div>
              <div className="text-[11px] text-slate-400">Queue: ~{k.queueWaitMins} min wait</div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {k.status}
            </span>
          </div>
        ))}
      </div>

      {/* Queue List */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-400" /> Your Active Print Queue
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {queue.map(job => (
            <div key={job.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-bold text-white">{job.fileName}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    job.status === 'READY_AT_KIOSK' 
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}>
                    {job.status === 'READY_AT_KIOSK' ? 'Ready for Pickup' : 'Printed'}
                  </span>
                </div>
                <div className="text-xs text-slate-400 flex flex-wrap items-center gap-3">
                  <span>{job.pages} Pages • {job.copies} Copy</span>
                  <span>•</span>
                  <span>{job.colorMode}</span>
                  <span>•</span>
                  <span>{job.duplex}</span>
                  <span>•</span>
                  <span className="text-slate-300 font-medium">{job.kioskLocation}</span>
                </div>
              </div>

              {job.status === 'READY_AT_KIOSK' && (
                <div className="bg-blue-950/40 border border-blue-500/30 rounded-xl px-4 py-2.5 flex items-center gap-3 self-start md:self-auto">
                  <div>
                    <div className="text-[10px] text-blue-300 uppercase font-semibold">Kiosk Pickup PIN</div>
                    <div className="text-lg font-mono font-bold text-white tracking-widest">{job.pickupPin}</div>
                  </div>
                  <KeyRound className="w-5 h-5 text-blue-400" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-blue-400" /> Queue Document for Printing
            </h2>
            <form onSubmit={handleQueueJob} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Document File Name</label>
                <input
                  type="text"
                  placeholder="e.g. Distributed_Systems_Assignment_3.pdf"
                  value={formData.fileName}
                  onChange={e => setFormData({ ...formData, fileName: e.target.value })}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Total Pages</label>
                  <input
                    type="number"
                    value={formData.pages}
                    onChange={e => setFormData({ ...formData, pages: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Copies</label>
                  <input
                    type="number"
                    value={formData.copies}
                    onChange={e => setFormData({ ...formData, copies: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Color Mode</label>
                  <select
                    value={formData.colorMode}
                    onChange={e => setFormData({ ...formData, colorMode: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  >
                    <option value="Grayscale">Grayscale (₹1/pg)</option>
                    <option value="Full Color">Full Color (₹10/pg)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Sides</label>
                  <select
                    value={formData.duplex}
                    onChange={e => setFormData({ ...formData, duplex: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  >
                    <option value="Double-Sided">Double-Sided</option>
                    <option value="Single-Sided">Single-Sided</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Target Kiosk Location</label>
                <select
                  value={formData.kioskLocation}
                  onChange={e => setFormData({ ...formData, kioskLocation: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                >
                  <option value="Central Library 1st Floor (Kiosk #2)">Central Library 1st Floor (Kiosk #2)</option>
                  <option value="Computer Science Lab Kiosk #3">Computer Science Lab Kiosk #3</option>
                  <option value="Hostel Block 3 Kiosk">Hostel Block 3 Kiosk</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-3 py-1.5 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold"
                >
                  Queue Print Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
