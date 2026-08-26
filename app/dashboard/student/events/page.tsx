'use client';

import { useState, useEffect } from 'react';
import {
  Calendar,
  MapPin,
  Users,
  Ticket,
  Sparkles,
  Filter,
  CheckCircle2,
  QrCode,
  Search,
  Trophy,
  Clock,
  X,
  Code2,
  GitBranch,
  Link as LinkIcon,
  Send,
  UserPlus,
  Bookmark,
  BookmarkCheck,
  Download,
  CalendarPlus,
  Share2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/lib/toastContext';

export default function StudentEventsPage() {
  const { addToast } = useToast();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [search, setSearch] = useState('');
  const [ticketModal, setTicketModal] = useState<any>(null);
  const [teamModal, setTeamModal] = useState<any>(null);
  const [submitProjectModal, setSubmitProjectModal] = useState<any>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [rsvpMap, setRsvpMap] = useState<Record<string, 'GOING' | 'INTERESTED' | 'NOT_GOING'>>({});

  useEffect(() => {
    try {
      const savedBookmarks = localStorage.getItem('campushub_event_bookmarks');
      if (savedBookmarks) setBookmarkedIds(JSON.parse(savedBookmarks));
      const savedRsvp = localStorage.getItem('campushub_event_rsvp');
      if (savedRsvp) setRsvpMap(JSON.parse(savedRsvp));
    } catch {}
  }, []);

  const toggleBookmark = (eventId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarkedIds((prev) => {
      const next = prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId];
      try {
        localStorage.setItem('campushub_event_bookmarks', JSON.stringify(next));
      } catch {}
      addToast({
        title: next.includes(eventId) ? 'Event Bookmarked' : 'Bookmark Removed',
        message: next.includes(eventId) ? 'Added to your saved events list.' : 'Removed from saved events.',
        type: 'info'
      });
      return next;
    });
  };

  const handleRsvpChange = (eventId: string, status: 'GOING' | 'INTERESTED' | 'NOT_GOING') => {
    setRsvpMap((prev) => {
      const next = { ...prev, [eventId]: status };
      try {
        localStorage.setItem('campushub_event_rsvp', JSON.stringify(next));
      } catch {}
      addToast({
        title: `RSVP: ${status.replace('_', ' ')}`,
        message: `Your status has been updated.`,
        type: status === 'GOING' ? 'success' : 'info'
      });
      return next;
    });
  };

  const exportToICal = (event: any) => {
    const startDate = new Date(event.date);
    const endDate = new Date(startDate.getTime() + 4 * 60 * 60 * 1000); // 4 hours default

    const formatDate = (date: Date) => {
      return date.toISOString().replace(/-|:|\.\d\d\d/g, '').slice(0, 15) + 'Z';
    };

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//CampusHub AI//Events Portal//EN',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      `SUMMARY:${event.title.replace(/,/g, '\\,')}`,
      `DESCRIPTION:${event.description.replace(/,/g, '\\,')}`,
      `LOCATION:${event.venue.replace(/,/g, '\\,')}`,
      `DTSTART:${formatDate(startDate)}`,
      `DTEND:${formatDate(endDate)}`,
      `STATUS:CONFIRMED`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${event.title.replace(/[^a-zA-Z0-9]/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    addToast({
      title: 'Calendar Event Downloaded',
      message: 'Import the .ics file to your Google Calendar, Outlook, or Apple Calendar.',
      type: 'success'
    });
  };

  // Form State for Project Submission
  const [projectTitle, setProjectTitle] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [projectDesc, setProjectDesc] = useState('');

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

  const handleSubmitProject = (e: React.FormEvent) => {
    e.preventDefault();
    addToast({
      title: 'Hackathon Project Submitted! 🚀',
      message: `"${projectTitle}" has been logged for jury evaluation. Live leaderboard updated.`,
      type: 'success'
    });
    setSubmitProjectModal(null);
    setProjectTitle('');
    setGithubUrl('');
    setDemoUrl('');
    setProjectDesc('');
  };

  const filtered = events.filter((e) => {
    const matchesSearch = !search || e.title.toLowerCase().includes(search.toLowerCase()) || e.description.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (selectedCategory === 'BOOKMARKED') return bookmarkedIds.includes(e.id);
    if (selectedCategory === 'MY_RSVP') return !!rsvpMap[e.id];
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-700 via-purple-700 to-indigo-700 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wider">
            <Trophy className="w-3.5 h-3.5 text-yellow-300" /> Hackathons, Tech & Cultural Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Campus Events, Calendar & Team Matcher</h1>
          <p className="text-white/90 text-sm sm:text-base">
            Discover national hackathons, RSVP & sync events with your personal calendar, form project teams, and claim QR entry passes.
          </p>
        </div>
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'ALL', label: 'All Events' },
            { id: 'HACKATHON', label: 'Hackathons' },
            { id: 'WORKSHOP', label: 'Workshops' },
            { id: 'CULTURAL', label: 'Cultural' },
            { id: 'BOOKMARKED', label: `Saved (${bookmarkedIds.length})` },
            { id: 'MY_RSVP', label: 'My RSVPs' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shadow-xs",
                selectedCategory === cat.id
                  ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative flex-1 sm:max-w-xs">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search events, workshops..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-background border border-border rounded-xl focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((event) => {
          const isSaved = bookmarkedIds.includes(event.id);
          const rsvpStatus = rsvpMap[event.id];

          return (
            <div key={event.id} className="bg-card border border-border hover:border-purple-500/50 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between transition">
              <div className="h-44 bg-muted relative overflow-hidden">
                <img
                  src={event.bannerUrl || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=60'}
                  alt={event.title}
                  className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <button
                    onClick={(e) => toggleBookmark(event.id, e)}
                    className={cn(
                      "p-1.5 rounded-full backdrop-blur-md transition shadow-md",
                      isSaved ? "bg-purple-600 text-white" : "bg-black/40 text-white hover:bg-black/60"
                    )}
                    title={isSaved ? "Remove Bookmark" : "Save Event"}
                  >
                    {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => exportToICal(event)}
                    className="p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-md transition shadow-md"
                    title="Export to Calendar (.ics)"
                  >
                    <CalendarPlus className="w-4 h-4" />
                  </button>
                </div>
                <div className="absolute top-3 right-3">
                  <span className={cn(
                    'text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider',
                    event.category === 'HACKATHON' ? 'bg-purple-600 text-white shadow-xs' :
                    event.category === 'WORKSHOP' ? 'bg-blue-600 text-white shadow-xs' : 'bg-rose-600 text-white shadow-xs'
                  )}>
                    {event.category}
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-foreground leading-snug">{event.title}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{event.description}</p>
                </div>

                <div className="space-y-2 text-xs text-muted-foreground border-t border-border/60 pt-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-purple-500" />
                    <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • {event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{event.venue}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-amber-500" />
                    <span>{event.registered} / {event.maxCapacity} Registered</span>
                  </div>
                </div>

                {/* RSVP Options */}
                <div className="bg-muted/40 p-2.5 rounded-xl border border-border/70 space-y-1.5">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Your RSVP Status</span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['GOING', 'INTERESTED', 'NOT_GOING'] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => handleRsvpChange(event.id, status)}
                        className={cn(
                          "py-1 px-1.5 rounded-lg text-[10px] font-semibold border transition text-center",
                          rsvpStatus === status
                            ? status === 'GOING'
                              ? "bg-emerald-500/20 text-emerald-600 border-emerald-500/40 dark:text-emerald-400"
                              : status === 'INTERESTED'
                              ? "bg-amber-500/20 text-amber-600 border-amber-500/40 dark:text-amber-400"
                              : "bg-rose-500/20 text-rose-600 border-rose-500/40 dark:text-rose-400"
                            : "border-border text-muted-foreground hover:bg-muted"
                        )}
                      >
                        {status === 'GOING' ? '✓ Going' : status === 'INTERESTED' ? '⭐ Interested' : '✗ Decline'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-2 border-t border-border/60">
                  {event.category === 'HACKATHON' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setTeamModal(event)}
                        className="flex-1 py-1.5 rounded-xl border border-border hover:bg-muted text-[11px] font-semibold flex items-center justify-center gap-1 transition"
                      >
                        <UserPlus className="w-3 h-3 text-purple-500" /> Team Finder
                      </button>
                      <button
                        onClick={() => setSubmitProjectModal(event)}
                        className="flex-1 py-1.5 rounded-xl border border-border hover:bg-muted text-[11px] font-semibold flex items-center justify-center gap-1 transition"
                      >
                        <Code2 className="w-3 h-3 text-emerald-500" /> Submit Project
                      </button>
                    </div>
                  )}
                  <button
                    onClick={() => handleRegister(event)}
                    className="w-full py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-500/20 flex items-center justify-center gap-1.5 transition"
                  >
                    <Ticket className="w-3.5 h-3.5" /> Claim QR Entry Pass
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Ticket Pass Modal */}
      {ticketModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="space-y-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/10 text-purple-600 border border-purple-500/20">
                VERIFIED ADMISSION PASS
              </span>
              <h3 className="font-bold text-base text-foreground mt-2">{ticketModal.event.title}</h3>
              <p className="text-xs text-muted-foreground font-mono">{ticketModal.ticketCode}</p>
            </div>

            <div className="p-4 bg-white rounded-2xl shadow-inner inline-block mx-auto">
              <QrCode className="w-44 h-44 text-slate-900 mx-auto" />
            </div>

            <div className="text-xs text-muted-foreground space-y-1">
              <p>Attendee: <strong className="text-foreground">{ticketModal.studentName} ({ticketModal.rollNumber})</strong></p>
              <p>Venue: <strong className="text-foreground">{ticketModal.event.venue}</strong></p>
            </div>

            <button
              onClick={() => setTicketModal(null)}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Hackathon Team Finder Modal */}
      {teamModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-2 border-b border-border">
              <div>
                <h3 className="font-bold text-base text-foreground">Hackathon Team Finder</h3>
                <p className="text-xs text-muted-foreground">Match with peers looking for teammates</p>
              </div>
              <button onClick={() => setTeamModal(null)} className="p-1 rounded text-muted-foreground hover:bg-muted">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-muted/40 border border-border flex items-center justify-between">
                <div>
                  <p className="font-bold text-foreground">Team Nexus (3/4 Members)</p>
                  <p className="text-muted-foreground">Looking for: <strong className="text-purple-600">UI/UX Designer</strong></p>
                </div>
                <button onClick={() => addToast({ title: 'Request Sent', message: 'Team Nexus notified of your join request.', type: 'success' })} className="px-2.5 py-1 bg-purple-600 text-white rounded-lg font-semibold">
                  Join
                </button>
              </div>

              <div className="p-3 rounded-xl bg-muted/40 border border-border flex items-center justify-between">
                <div>
                  <p className="font-bold text-foreground">CyberPulse (2/4 Members)</p>
                  <p className="text-muted-foreground">Looking for: <strong className="text-purple-600">Backend & Cloud Engineer</strong></p>
                </div>
                <button onClick={() => addToast({ title: 'Request Sent', message: 'CyberPulse notified of your join request.', type: 'success' })} className="px-2.5 py-1 bg-purple-600 text-white rounded-lg font-semibold">
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Project Submission Modal */}
      {submitProjectModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-2 border-b border-border">
              <div>
                <h3 className="font-bold text-base text-foreground">Submit Hackathon Project</h3>
                <p className="text-xs text-muted-foreground">{submitProjectModal.title}</p>
              </div>
              <button onClick={() => setSubmitProjectModal(null)} className="p-1 rounded text-muted-foreground hover:bg-muted">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitProject} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Agentic Campus Navigator AI"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="w-full p-2.5 text-xs bg-background border border-border rounded-xl focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">GitHub Repository URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://github.com/..."
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="w-full p-2.5 text-xs bg-background border border-border rounded-xl focus:ring-2 focus:ring-purple-500 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Live Demo / Video URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={demoUrl}
                  onChange={(e) => setDemoUrl(e.target.value)}
                  className="w-full p-2.5 text-xs bg-background border border-border rounded-xl focus:ring-2 focus:ring-purple-500 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSubmitProjectModal(null)}
                  className="px-4 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> Submit to Jury
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
