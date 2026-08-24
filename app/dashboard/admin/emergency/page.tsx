'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, Radio, Megaphone, Send, ShieldAlert, CheckCircle2, Bell, Sparkles, Phone, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/lib/toastContext';

export default function AdminEmergencyPage() {
  const { addToast } = useToast();
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('WARNING');
  const [channels, setChannels] = useState({ sms: true, email: true, push: true, siren: false });
  const [broadcasting, setBroadcasting] = useState(false);

  useEffect(() => {
    async function fetchAlerts() {
      try {
        const res = await fetch('/api/emergency-alerts');
        if (res.ok) {
          const json = await res.json();
          setAlerts(json.data || json);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchAlerts();
  }, []);

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      addToast({ title: 'Alert Incomplete', message: 'Please provide broadcast headline and instruction text.', type: 'warning' });
      return;
    }

    setBroadcasting(true);
    const activeChannels = Object.entries(channels).filter(([_, v]) => v).map(([k]) => k.toUpperCase()).join(', ');

    try {
      const res = await fetch('/api/emergency-alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          message,
          severity,
          channels: activeChannels,
          sentBy: 'Campus Emergency Operations Command'
        })
      });

      if (res.ok) {
        addToast({
          title: '🚨 Emergency Alert Broadcasted!',
          message: `Transmitted via ${activeChannels} to all active campus users.`,
          type: 'error'
        });
        setTitle('');
        setMessage('');
        // Refresh
        const ref = await fetch('/api/emergency-alerts');
        if (ref.ok) {
          const json = await ref.json();
          setAlerts(json.data || json);
        }
      }
    } catch {
      addToast({ title: 'Broadcast Failed', message: 'Network transmission error', type: 'error' });
    } finally {
      setBroadcasting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 shadow-xs">
              <ShieldAlert className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Campus Emergency Broadcast & Siren Transmitter</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">Multi-channel instant broadcast system for weather alerts, security drills, lockdowns, and campus safety notices</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 animate-pulse">
            <Radio className="w-3.5 h-3.5" /> Transmitter Active & Armed
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Transmitter Command Console */}
        <div className="lg:col-span-5 bg-white border-2 border-rose-200 rounded-3xl p-6 shadow-card space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-rose-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-rose-600" /> Transmit Emergency Broadcast
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-600 text-white px-2 py-0.5 rounded">
              High Priority
            </span>
          </div>

          <form onSubmit={handleBroadcast} className="space-y-3.5">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Alert Severity Level</label>
              <select
                value={severity}
                onChange={e => setSeverity(e.target.value)}
                className="w-full border border-slate-200 rounded-xl p-2.5 bg-slate-50 text-slate-900 font-semibold outline-none"
              >
                <option value="CRITICAL">CRITICAL – Immediate Threat / Lockdown</option>
                <option value="WARNING">WARNING – Severe Weather / Transit Delay</option>
                <option value="INFO">INFO – Evacuation Drill / Maintenance</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Headline / Banner Title</label>
              <input
                required
                type="text"
                placeholder="e.g. Severe Storm Alert: Campus Shift to Hybrid"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full border border-slate-200 rounded-xl p-2.5 text-slate-900 outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Detailed Safety Instructions</label>
              <textarea
                rows={4}
                required
                placeholder="Provide clear, concise instructions for students, faculty, and security guards..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="w-full border border-slate-200 rounded-xl p-2.5 text-slate-900 outline-none"
              />
            </div>

            <div className="space-y-2 pt-1">
              <label className="block font-medium text-slate-700">Dispatch Channels</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: 'sms', label: 'SMS Blast (Twilio)' },
                  { key: 'email', label: 'Email Broadcast' },
                  { key: 'push', label: 'Mobile Push Notification' },
                  { key: 'siren', label: 'Campus Audio Siren' },
                ].map(ch => (
                  <label key={ch.key} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={(channels as any)[ch.key]}
                      onChange={e => setChannels({ ...channels, [ch.key]: e.target.checked })}
                      className="rounded text-rose-600 focus:ring-rose-500"
                    />
                    <span className="text-[11px] text-slate-700 font-medium">{ch.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={broadcasting}
              className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Radio className="w-4 h-4 animate-pulse" />
              {broadcasting ? 'Transmitting Over Grid...' : 'Deploy Instant Broadcast'}
            </button>
          </form>
        </div>

        {/* Transmission Logs */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-card space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Broadcast History & Transmission Audits</h3>

          <div className="space-y-3.5">
            {alerts.map(al => (
              <div key={al.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className={cn(
                    'text-[10px] font-bold px-2.5 py-0.5 rounded-full',
                    al.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-800' :
                    al.severity === 'WARNING' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                  )}>
                    {al.severity}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">{al.channels}</span>
                </div>

                <h4 className="text-sm font-bold text-slate-900">{al.title}</h4>
                <p className="text-slate-600 leading-relaxed">{al.message}</p>

                <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-200/60 pt-2">
                  <span>Issued By: {al.sentBy}</span>
                  <span>{new Date(al.createdAt).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
