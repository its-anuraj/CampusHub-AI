'use client';

import { useState, useEffect } from 'react';
import { Cpu, Calendar, Clock, CheckCircle2, Shield, Search, Sparkles, Filter, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/lib/toastContext';

export default function FacultyLabsPage() {
  const { addToast } = useToast();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reserveModal, setReserveModal] = useState<any>(null);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchLabs() {
      try {
        const res = await fetch('/api/labs');
        if (res.ok) {
          const json = await res.json();
          setData(json.data || json);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchLabs();
  }, []);

  const handleConfirmReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) {
      addToast({ title: 'Select Slot', message: 'Please choose an equipment time window.', type: 'warning' });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/labs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          equipmentName: reserveModal.name,
          facultyName: 'Dr. Ramesh Kumar',
          slot: selectedSlot,
          project: projectTitle
        })
      });

      if (res.ok) {
        addToast({
          title: 'Equipment Reserved! ⚡',
          message: `${reserveModal.name} reserved for ${selectedSlot}. Passcodes sent.`,
          type: 'success'
        });
        setReserveModal(null);
        setSelectedSlot('');
        setProjectTitle('');
      }
    } catch {
      addToast({ title: 'Error', message: 'Failed to reserve equipment', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const equipment = data?.equipment || [];
  const reservations = data?.activeReservations || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shadow-xs">
              <Cpu className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Advanced Research Labs & Equipment Booking</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">Book supercomputing clusters, 3D resin printers, spectrum analyzers, and cleanroom slots</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> High-End Research Grid Online
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Equipment Grid */}
        <div className="lg:col-span-8 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Available Specialized Research Equipment</h3>

          <div className="space-y-4">
            {equipment.map((eq: any) => (
              <div key={eq.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-card flex flex-col justify-between space-y-4 hover:border-blue-300 transition-all">
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 uppercase">
                      {eq.department}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                      {eq.status}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 leading-snug">{eq.name}</h4>
                  <p className="text-xs text-slate-500 font-medium">{eq.labName}</p>
                  <p className="text-xs text-slate-700 leading-relaxed font-mono bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    {eq.specs}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                  <span className="text-xs text-slate-500 font-semibold">{eq.totalUnits} Units Configured</span>
                  <button
                    onClick={() => setReserveModal(eq)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs shadow-xs transition-colors cursor-pointer"
                  >
                    Reserve Hardware Slot →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Reservations Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-card space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" /> My Active Lab Bookings
            </h3>

            <div className="space-y-3">
              {reservations.map((r: any) => (
                <div key={r.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{r.equipment}</span>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">{r.status}</span>
                  </div>
                  <p className="text-slate-600">{r.project}</p>
                  <div className="flex items-center gap-1.5 text-[11px] text-blue-600 font-semibold border-t border-slate-200/60 pt-2">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{r.slot}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Reserve Modal */}
      {reserveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full shadow-2xl relative space-y-4">
            <button onClick={() => setReserveModal(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer">
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                Hardware Reservation
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">{reserveModal.name}</h3>
              <p className="text-xs text-slate-500">{reserveModal.labName}</p>
            </div>

            <form onSubmit={handleConfirmReservation} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1.5">Select Time Window</label>
                <div className="space-y-2">
                  {(reserveModal.availableSlots || ['Today 04:00 PM - 08:00 PM', 'Tomorrow 09:00 AM - 01:00 PM']).map((slot: string) => (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={cn(
                        'w-full p-2.5 rounded-xl border text-left font-medium text-xs flex items-center justify-between cursor-pointer transition-all',
                        selectedSlot === slot ? 'bg-blue-50 border-blue-400 text-blue-800 font-semibold' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      )}
                    >
                      <span>{slot}</span>
                      {selectedSlot === slot && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Project / Experiment Objective</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Model Training for Indic NLP"
                  value={projectTitle}
                  onChange={e => setProjectTitle(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-slate-900 outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                {submitting ? 'Allocating...' : 'Confirm Equipment Slot'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
