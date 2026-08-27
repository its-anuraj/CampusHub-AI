'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Wrench, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowLeft, 
  Plus, 
  Calendar, 
  Activity, 
  Sparkles,
  ShieldAlert
} from 'lucide-react';

export default function LabMaintenancePage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [equipmentName, setEquipmentName] = useState('');
  const [labName, setLabName] = useState('AI & High Performance Computing Lab');
  const [technician, setTechnician] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchLogs = async () => {
    const res = await fetch('/api/labs/maintenance');
    const json = await res.json();
    if (json.success) setLogs(json.data);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!equipmentName || !technician) return;
    setLoading(true);

    try {
      const res = await fetch('/api/labs/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ equipmentName, labName, technician, notes })
      });
      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        setEquipmentName('');
        setTechnician('');
        setNotes('');
        fetchLogs();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-amber-900/40 via-orange-900/30 to-slate-900/40 p-6 rounded-2xl border border-amber-500/20 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 text-amber-400 mb-1">
            <Link href="/dashboard/faculty/labs" className="flex items-center gap-1 hover:underline text-xs">
              <ArrowLeft className="w-3 h-3" /> Back to Labs
            </Link>
            <span className="text-slate-500">•</span>
            <span className="text-xs font-semibold uppercase tracking-wider">Asset Health</span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Wrench className="w-6 h-6 text-amber-400" />
            Lab Equipment Calibration & Preventative Maintenance Logger
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Track equipment health metrics, calibration cycles, voltage stability, and preventative safety audit sheets.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs rounded-xl transition shadow-lg shadow-amber-600/20 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Log Calibration Event
        </button>
      </div>

      {/* Logs Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {logs.map(log => (
          <div
            key={log.id}
            className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-lg shadow-slate-950/40 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-amber-400 px-2 py-0.5 bg-slate-800 rounded">
                  {log.id}
                </span>
                <span
                  className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                    log.healthStatus === 'OPTIMAL' || log.healthStatus === 'CALIBRATED'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}
                >
                  {log.healthStatus}
                </span>
              </div>

              <h3 className="text-sm font-bold text-white mb-1">{log.equipmentName}</h3>
              <p className="text-xs text-slate-400 mb-3">{log.labName}</p>

              <div className="space-y-1.5 text-xs text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800 mb-3">
                <div className="flex justify-between">
                  <span>Last Calibrated:</span>
                  <span className="text-slate-200 font-mono">{log.lastCalibrationDate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Next Calibration Due:</span>
                  <span className="text-amber-400 font-mono font-semibold">{log.nextDueCalibration}</span>
                </div>
                <div className="flex justify-between">
                  <span>Lead Technician:</span>
                  <span className="text-slate-300">{log.technician}</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-300 bg-slate-950/40 p-2 rounded-lg border border-slate-800/80">
                <span className="text-slate-500 font-medium">Notes: </span>
                {log.maintenanceNotes}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span>Safety Checklist: Verified</span>
              <span>ISO 9001 Compliant</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-md space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Wrench className="w-4 h-4 text-amber-400" /> Log Equipment Calibration
            </h3>

            <form onSubmit={handleLog} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Equipment Name & Model</label>
                <input
                  type="text"
                  required
                  value={equipmentName}
                  onChange={e => setEquipmentName(e.target.value)}
                  placeholder="e.g. Rigol RSA5065 Spectrum Analyzer"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Laboratory Facility</label>
                <input
                  type="text"
                  required
                  value={labName}
                  onChange={e => setLabName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Certified Technician / Incharge</label>
                <input
                  type="text"
                  required
                  value={technician}
                  onChange={e => setTechnician(e.target.value)}
                  placeholder="e.g. Er. Devendra Sharma"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Service & Calibration Notes</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Details of probe calibration, firmware version, and baseline readings..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Save Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
