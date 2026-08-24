'use client';

import { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Ticket, Sparkles, Filter, CheckCircle2, QrCode, Search, Trophy, Clock, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/lib/toastContext';

export default function StudentEventsPage() {
  const { addToast } = useToast();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [ticketModal, setTicketModal] = useState<any>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch(`/api/events?category=${selectedCategory}`);
        if (res.ok) {
          const json = await res.json();
          setEvents(json.data || json);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, [selectedCategory]);

  const handleRegister = async (event: any) => {
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'REGISTER',
          eventId: event.id,
          studentName: 'Alex Kumar',
          rollNumber: '23CSE042',
          email: 'alex@campushub.edu'
        })
      });

      if (res.ok) {
        const data = await res.json();
        const ticketCode = data.data?.ticketCode || 'CHUB-TCK-928174';
        setTicketModal({
          event,
          ticketCode,
          studentName: 'Alex Kumar',
          rollNumber: '23CSE042'
        });
        addToast({
          title: 'Registration Confirmed!',
          message: `Your entry pass for ${event.title} has been generated.`,
          type: 'success'
        });
      }
    } catch {
      addToast({ title: 'Error', message: 'Failed to complete registration.', type: 'error' });
    }
  };

  const filtered = events.filter((e) =>
    !search || e.title.toLowerCase().includes(search.toLowerCase()) || e.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-violet-50 text-violet-600 border border-violet-100 shadow-xs">
              <Calendar className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Campus Events & Hackathons Hub</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">Discover campus symposiums, national hackathons, cultural festivals, and technical workshops</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: 'ALL', label: 'All Events' },
            { id: 'HACKATHON', label: 'Hackathons' },
            { id: 'WORKSHOP', label: 'Workshops' },
            { id: 'CULTURAL', label: 'Cultural' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                'px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap',
                selectedCategory === cat.id ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search events, workshops..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-xs text-slate-900 outline-none flex-1"
          />
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((event) => (
          <div key={event.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-card flex flex-col hover:border-blue-300 transition-all">
            <div className="h-44 bg-slate-900 relative overflow-hidden">
              <img
                src={event.bannerUrl || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=60'}
                alt={event.title}
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute top-3 right-3">
                <span className={cn(
                  'text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider',
                  event.category === 'HACKATHON' ? 'bg-purple-600 text-white' :
                  event.category === 'WORKSHOP' ? 'bg-blue-600 text-white' : 'bg-rose-600 text-white'
                )}>
                  {event.category}
                </span>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900 leading-snug">{event.title}</h3>
                <p className="text-xs text-slate-600 line-clamp-2">{event.description}</p>
              </div>

              <div className="space-y-2 text-xs text-slate-500 border-t border-slate-100 pt-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • {event.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{event.venue}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-amber-600" />
                  <span>{event.registered} / {event.maxCapacity} Registered</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => handleRegister(event)}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                >
                  <Ticket className="w-3.5 h-3.5" /> RSVP / Get Digital Pass
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Ticket Pass Modal */}
      {ticketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative space-y-5 animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setTicketModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-1">
              <span className="text-[10px] font-bold tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100 uppercase">
                Official Campus Admission Pass
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-2">{ticketModal.event.title}</h3>
              <p className="text-xs text-slate-500">{ticketModal.event.venue}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col items-center justify-center space-y-3">
              <div className="w-36 h-36 bg-white p-2 rounded-xl border border-slate-200 shadow-xs flex items-center justify-center">
                <QrCode className="w-32 h-32 text-slate-900" />
              </div>
              <div className="text-center">
                <p className="font-mono font-bold text-xs text-blue-600">{ticketModal.ticketCode}</p>
                <p className="text-[11px] text-slate-500">{ticketModal.studentName} ({ticketModal.rollNumber})</p>
              </div>
            </div>

            <div className="text-center text-[11px] text-slate-400">
              Present this digital pass at the entrance scanner on the event day.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
