'use client';

import { useState, useEffect } from 'react';
import { Shield, QrCode, Clock, CheckCircle2, AlertCircle, Calendar, MapPin, Sparkles, UserCheck, ArrowUpRight, Lock, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/lib/toastContext';

export default function StudentGatePassPage() {
  const { addToast } = useToast();
  const [passes, setPasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeQrModal, setActiveQrModal] = useState<any>(null);

  // Form State
  const [type, setType] = useState('DAY_OUTPASS');
  const [reason, setReason] = useState('');
  const [destination, setDestination] = useState('');
  const [outTime, setOutTime] = useState('');
  const [inTime, setInTime] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadPasses() {
      try {
        const res = await fetch('/api/gatepass');
        if (res.ok) {
          const json = await res.json();
          setPasses(json.data?.passes || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadPasses();
  }, []);

  const handleCreatePass = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/gatepass', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          reason,
          destination,
          outTime: new Date(outTime).toISOString(),
          inTime: new Date(inTime).toISOString()
        })
      });

      if (res.ok) {
        const data = await res.json();
        setPasses(prev => [data.data, ...prev]);
        setModalOpen(false);
        setActiveQrModal(data.data);
        addToast({
          title: 'Outpass Approved!',
          message: 'Your Digital QR Gatepass has been validated and synced with Campus Security.',
          type: 'success'
        });
        setReason('');
        setDestination('');
      }
    } catch {
      addToast({
        title: 'Submission Failed',
        message: 'Could not generate pass. Please try again.',
        type: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5 text-amber-200" /> Digital Security & Curfew Sync
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Smart Campus Outpass & Gate Pass Desk</h1>
          <p className="text-white/90 text-sm sm:text-base">
            Request instant day passes, night stays, and emergency doctor leave. Instant automated warden verification with dynamic QR codes recognized at Main Security Gate 1 & 3.
          </p>
        </div>
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">My Digital Gate Passes</h2>
          <p className="text-xs text-muted-foreground">Standard hostel curfew is 09:30 PM. Late entries are logged automatically.</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-md shadow-orange-500/20 transition"
        >
          <QrCode className="w-4 h-4" /> Request New Outpass
        </button>
      </div>

      {/* Outpass Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {passes.map((p) => {
          const isApproved = p.status === 'APPROVED';
          const isPending = p.status === 'PENDING_APPROVAL';
          return (
            <div
              key={p.id}
              className="p-5 rounded-2xl bg-card border border-border flex flex-col justify-between space-y-4 shadow-xs hover:shadow-md transition"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-orange-600 dark:text-orange-400">{p.id}</span>
                  <span className={cn(
                    "px-2.5 py-0.5 rounded-full text-xs font-semibold",
                    isApproved ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" :
                    isPending ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20" :
                    "bg-muted text-muted-foreground"
                  )}>
                    {p.status}
                  </span>
                </div>

                <div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-muted text-foreground">
                    {p.type.replace('_', ' ')}
                  </span>
                  <h3 className="font-semibold text-sm text-foreground mt-2">{p.reason}</h3>
                </div>

                <div className="space-y-1.5 text-xs text-muted-foreground pt-2 border-t border-border/60">
                  <div className="flex items-center justify-between">
                    <span>Expected Departure:</span>
                    <span className="text-foreground font-medium">{new Date(p.outTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Expected Return:</span>
                    <span className="text-foreground font-medium">{new Date(p.expectedInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Approval Authority:</span>
                    <span className="text-foreground">{p.approver}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-border/60">
                {isApproved ? (
                  <button
                    onClick={() => setActiveQrModal(p)}
                    className="w-full py-2 px-3 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                  >
                    <QrCode className="w-3.5 h-3.5" /> Show Security QR Code
                  </button>
                ) : (
                  <div className="text-center py-1 text-xs text-muted-foreground italic">
                    Awaiting Warden Signature
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* New Outpass Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-3 border-b border-border">
              <h3 className="font-bold text-lg">Apply for Campus Outpass</h3>
              <button onClick={() => setModalOpen(false)} className="p-1 rounded-lg text-muted-foreground hover:bg-accent">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePass} className="space-y-3.5">
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Pass Category</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-background border border-border rounded-xl focus:ring-2 focus:ring-orange-500"
                >
                  <option value="DAY_OUTPASS">Day Outpass (Returns by Curfew)</option>
                  <option value="NIGHT_STAY">Night Stay / Weekend Leave</option>
                  <option value="EMERGENCY_MEDICAL">Emergency Clinic / Hospital Visit</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Destination & City</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. City Central Market / Home Address"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-background border border-border rounded-xl focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Purpose / Reason</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Reason for campus exit..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-background border border-border rounded-xl focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Exit Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={outTime}
                    onChange={(e) => setOutTime(e.target.value)}
                    className="w-full px-2 py-1.5 text-xs bg-background border border-border rounded-xl focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Expected Return</label>
                  <input
                    type="datetime-local"
                    required
                    value={inTime}
                    onChange={(e) => setInTime(e.target.value)}
                    className="w-full px-2 py-1.5 text-xs bg-background border border-border rounded-xl focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-border hover:bg-accent"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-xs font-semibold rounded-xl bg-orange-600 hover:bg-orange-700 text-white shadow-md shadow-orange-500/20 disabled:opacity-50"
                >
                  {submitting ? 'Generating...' : 'Submit & Generate QR'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Scanner Display Modal */}
      {activeQrModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-sm w-full p-6 shadow-2xl text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="space-y-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                VERIFIED SECURITY PASS
              </span>
              <h3 className="font-bold text-lg text-foreground mt-2">{activeQrModal.id}</h3>
              <p className="text-xs text-muted-foreground">{activeQrModal.reason}</p>
            </div>

            <div className="p-4 rounded-xl bg-white text-slate-900 shadow-xs inline-block">
              <QrCode className="w-40 h-40 mx-auto" />
              <p className="text-xs font-mono font-bold mt-2">{activeQrModal.qrPassCode}</p>
            </div>

            <div className="text-xs text-muted-foreground space-y-1">
              <p>Student: <strong className="text-foreground">Alex Kumar (23CSE042)</strong></p>
              <p>Parent Consent: <strong className="text-emerald-600 font-semibold">{activeQrModal.parentConsent}</strong></p>
              <p>Valid at: <strong className="text-foreground">Gate 1, Gate 2 & Gate 3</strong></p>
            </div>

            <button
              onClick={() => setActiveQrModal(null)}
              className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold transition"
            >
              Close Pass
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
