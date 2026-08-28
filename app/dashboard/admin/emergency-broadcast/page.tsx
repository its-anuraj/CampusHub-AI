'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Siren, 
  Radio, 
  ShieldAlert, 
  ArrowLeft, 
  Send, 
  AlertTriangle, 
  Volume2, 
  Smartphone, 
  Tv, 
  CheckCircle2
} from 'lucide-react';

export default function EmergencyBroadcastPage() {
  const [data, setData] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    alertType: 'Severe Weather / Campus Evacuation Alert',
    severity: 'CRITICAL_ALERT',
    messageText: ''
  });

  useEffect(() => {
    fetch('/api/admin/emergency-broadcast')
      .then(res => res.json())
      .then(json => {
        if (json.success) setData(json.data);
      });
  }, []);

  const handleTriggerBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.messageText) return;

    const res = await fetch('/api/admin/emergency-broadcast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const json = await res.json();
    if (json.success) {
      setData({ ...data, broadcasts: [json.data, ...data.broadcasts] });
      setShowModal(false);
      setFormData({
        alertType: 'Severe Weather / Campus Evacuation Alert',
        severity: 'CRITICAL_ALERT',
        messageText: ''
      });
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-red-950/60 via-rose-900/40 to-slate-900/40 p-6 rounded-2xl border border-red-500/30 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 text-red-400 mb-1">
            <Link href="/dashboard/admin" className="flex items-center gap-1 hover:underline text-xs">
              <ArrowLeft className="w-3 h-3" /> Back to Admin Console
            </Link>
            <span className="text-slate-500">•</span>
            <span className="text-xs font-semibold uppercase tracking-wider">Campus Disaster & Safety Command</span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Siren className="w-6 h-6 text-red-500 animate-pulse" />
            Disaster & Emergency Broadcast Siren Dispatcher
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Instant multi-channel emergency alert dispatch to 12,000+ students, faculty, PA acoustic sirens, and building digital signage.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-500/25 transition-all self-start md:self-auto"
        >
          <Radio className="w-4 h-4 animate-spin" /> Fire Emergency Broadcast
        </button>
      </div>

      {data && (
        <>
          {/* Readiness Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-1">
              <div className="text-xs text-slate-400">Campus Siren System Status</div>
              <div className="text-xl font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Armed & Operational
              </div>
              <div className="text-[11px] text-slate-400">18 Acoustic Horns Across Campus</div>
            </div>

            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-1">
              <div className="text-xs text-slate-400">SMS / Push Target Reach</div>
              <div className="text-2xl font-bold text-white">{data.totalAudienceCovered?.toLocaleString()} Users</div>
              <div className="text-[11px] text-blue-400">Sub-second Webhook Relay</div>
            </div>

            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-1">
              <div className="text-xs text-slate-400">Emergency Override Desk</div>
              <div className="text-2xl font-bold text-rose-400">24x7 Security Control</div>
              <div className="text-[11px] text-slate-400">Direct link to local police & fire dept</div>
            </div>
          </div>

          {/* Broadcast Logs */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-white">Broadcast Dispatch Audit Log</h2>
            <div className="grid grid-cols-1 gap-4">
              {data.broadcasts?.map((b: any) => (
                <div key={b.broadcastId} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all space-y-3">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
                          {b.severity}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">{b.broadcastId}</span>
                      </div>
                      <h3 className="text-base font-bold text-white">{b.alertType}</h3>
                    </div>

                    <span className="text-xs text-slate-400">Dispatched: {b.dispatchedAt}</span>
                  </div>

                  <p className="text-xs text-slate-200 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                    "{b.messageText}"
                  </p>

                  <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-slate-300">
                        <Smartphone className="w-3.5 h-3.5 text-blue-400" /> {b.deliveryStats?.pushed} Pushes
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-slate-300">
                        <Volume2 className="w-3.5 h-3.5 text-amber-400" /> PA Sirens Fired
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-slate-300">
                        <Tv className="w-3.5 h-3.5 text-emerald-400" /> {b.deliveryStats?.screensTriggered} Display Overrides
                      </span>
                    </div>

                    <span className="text-slate-500">By: {b.dispatchedBy}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-red-500/40 rounded-2xl p-6 max-w-md w-full space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2 text-red-400">
              <AlertTriangle className="w-5 h-5" /> Dispatch Emergency Siren Alert
            </h2>
            <form onSubmit={handleTriggerBroadcast} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Emergency Category</label>
                <select
                  value={formData.alertType}
                  onChange={e => setFormData({ ...formData, alertType: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                >
                  <option value="Severe Weather / Campus Evacuation Alert">Severe Weather / Campus Evacuation</option>
                  <option value="Fire Emergency in Lab / Complex">Fire Emergency in Lab / Complex</option>
                  <option value="Unscheduled Power / Grid Blackout Precaution">Unscheduled Power / Grid Blackout</option>
                  <option value="Medical Health Precautionary Broadcast">Medical Health Precautionary Broadcast</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Alert Message (Sent to all phones & PA horns)</label>
                <textarea
                  rows={3}
                  placeholder="Enter high-priority broadcast instructions..."
                  value={formData.messageText}
                  onChange={e => setFormData({ ...formData, messageText: e.target.value })}
                  required
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
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl font-semibold flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> Transmit Siren Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
