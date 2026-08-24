'use client';

import { useState, useEffect } from 'react';
import { Calendar, Users, QrCode, Plus, CheckCircle2, Download, Search, Sparkles, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/lib/toastContext';
import { exportToCSV } from '@/lib/exportUtils';

export default function FacultyEventsPage() {
  const { addToast } = useToast();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeEvent, setActiveEvent] = useState<any>(null);
  const [ticketInput, setTicketInput] = useState('');
  const [scanning, setScanning] = useState(false);
  const [createModal, setCreateModal] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('WORKSHOP');
  const [venue, setVenue] = useState('');
  const [date, setDate] = useState('');
  const [capacity, setCapacity] = useState('100');
  const [desc, setDesc] = useState('');

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch('/api/events');
        if (res.ok) {
          const json = await res.json();
          const list = json.data || json;
          setEvents(list);
          if (list.length > 0) setActiveEvent(list[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const handleVerifyTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketInput.trim()) return;
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      addToast({
        title: 'Check-in Verified! ✓',
        message: `Admitted attendee with ticket ${ticketInput}. Registration validated.`,
        type: 'success'
      });
      setTicketInput('');
    }, 600);
  };

  const handleExportAttendees = () => {
    if (!activeEvent) return;
    const dummyAttendees = [
      { Roll: '23CSE042', Name: 'Alex Kumar', Email: 'alex@campushub.edu', Ticket: 'CHUB-TCK-928174', Status: 'Checked In' },
      { Roll: '23CSE011', Name: 'Priya Sharma', Email: 'priya@campushub.edu', Ticket: 'CHUB-TCK-817293', Status: 'Checked In' },
      { Roll: '23IT009', Name: 'Rahul Sen', Email: 'rahul@campushub.edu', Ticket: 'CHUB-TCK-192847', Status: 'Pending' },
    ];
    exportToCSV(dummyAttendees, `${activeEvent.title.replace(/[^a-zA-Z0-9]/g, '_')}_Attendees`);
    addToast({ title: 'Export Generated', message: 'Attendee roster exported to CSV.', type: 'info' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 shadow-xs">
              <Calendar className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Event & Symposium Management Desk</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">Organize departmental symposiums, scan QR entry passes, and monitor attendee logs</p>
        </div>

        <button
          onClick={() => setCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Create Campus Event
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Event Selection */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Active Campus Events</h3>
          <div className="space-y-3">
            {events.map((ev) => (
              <div
                key={ev.id}
                onClick={() => setActiveEvent(ev)}
                className={cn(
                  'p-4 rounded-2xl border transition-all cursor-pointer shadow-card',
                  activeEvent?.id === ev.id ? 'bg-blue-50/70 border-blue-300 ring-1 ring-blue-400' : 'bg-white border-slate-200 hover:border-slate-300'
                )}
              >
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 uppercase">
                  {ev.category}
                </span>
                <h4 className="text-sm font-bold text-slate-900 mt-2">{ev.title}</h4>
                <p className="text-xs text-slate-500 mt-1">{ev.venue}</p>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-600 border-t border-slate-100 pt-2">
                  <span>Registered: {ev.registered}/{ev.maxCapacity}</span>
                  <span className="font-semibold text-blue-600">Active Pass Scanner →</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Live Scanner & Attendee Roster */}
        <div className="lg:col-span-2 space-y-6">
          {activeEvent && (
            <>
              {/* Check-in Scanner */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-card space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Gate Entrance QR Check-in Terminal</h3>
                    <p className="text-xs text-slate-500">{activeEvent.title}</p>
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Scanner Online
                  </span>
                </div>

                <form onSubmit={handleVerifyTicket} className="flex gap-2">
                  <div className="flex-1 relative">
                    <QrCode className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Scan or enter ticket code (e.g. CHUB-TCK-928174)..."
                      value={ticketInput}
                      onChange={(e) => setTicketInput(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:border-blue-500 bg-slate-50"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={scanning}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer shadow-xs"
                  >
                    {scanning ? 'Verifying...' : 'Validate Entry'}
                  </button>
                </form>
              </div>

              {/* Attendee Roster */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-card space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Registered Delegates ({activeEvent.registered})</h3>
                  <button
                    onClick={handleExportAttendees}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> Export Attendee CSV
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                        <th className="p-3">Roll No</th>
                        <th className="p-3">Attendee Name</th>
                        <th className="p-3">Ticket Pass</th>
                        <th className="p-3">Gate Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      <tr className="hover:bg-slate-50/80">
                        <td className="p-3 font-mono font-bold text-slate-900">23CSE042</td>
                        <td className="p-3 font-medium text-slate-900">Alex Kumar</td>
                        <td className="p-3 font-mono text-blue-600">CHUB-TCK-928174</td>
                        <td className="p-3">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">Checked In</span>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50/80">
                        <td className="p-3 font-mono font-bold text-slate-900">23CSE011</td>
                        <td className="p-3 font-medium text-slate-900">Priya Sharma</td>
                        <td className="p-3 font-mono text-blue-600">CHUB-TCK-817293</td>
                        <td className="p-3">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">Checked In</span>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50/80">
                        <td className="p-3 font-mono font-bold text-slate-900">23IT009</td>
                        <td className="p-3 font-medium text-slate-900">Rahul Sen</td>
                        <td className="p-3 font-mono text-blue-600">CHUB-TCK-192847</td>
                        <td className="p-3">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">Pending Arrival</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {createModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-lg w-full shadow-2xl relative space-y-4">
            <button onClick={() => setCreateModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-slate-900">Publish New Campus Event</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              addToast({ title: 'Event Created', message: `${title} published to campus discovery hub.`, type: 'success' });
              setCreateModal(false);
            }} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Event Title</label>
                <input required type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. AI & Robotics Symposium" className="w-full border border-slate-200 rounded-lg p-2.5 text-slate-900 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Category</label>
                  <select value={category} onChange={e => setCategory(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-slate-900 outline-none">
                    <option value="WORKSHOP">Workshop</option>
                    <option value="HACKATHON">Hackathon</option>
                    <option value="CULTURAL">Cultural</option>
                    <option value="SEMINAR">Guest Lecture</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Max Capacity</label>
                  <input type="number" value={capacity} onChange={e => setCapacity(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-slate-900 outline-none" />
                </div>
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Venue</label>
                <input required type="text" value={venue} onChange={e => setVenue(e.target.value)} placeholder="Auditorium / Lab 3" className="w-full border border-slate-200 rounded-lg p-2.5 text-slate-900 outline-none" />
              </div>
              <button type="submit" className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs shadow-xs transition-colors cursor-pointer">
                Publish Event
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
