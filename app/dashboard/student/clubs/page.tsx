'use client';

import { useState, useEffect } from 'react';
import { Users, Award, Calendar, Search, Sparkles, Filter, CheckCircle2, UserPlus, Heart, ExternalLink, ShieldCheck, Zap, X, DollarSign, FileText, Send, Clock, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/lib/toastContext';

export default function StudentClubsPage() {
  const { addToast } = useToast();
  const [clubs, setClubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedClub, setSelectedClub] = useState<any>(null);
  const [joinModal, setJoinModal] = useState<any>(null);
  const [budgetModal, setBudgetModal] = useState(false);
  const [roleApplied, setRoleApplied] = useState('Active Member');
  const [motivation, setMotivation] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [joinedClubs, setJoinedClubs] = useState<string[]>(['club-1']);

  // Budget proposal states
  const [eventTitle, setEventTitle] = useState('');
  const [budgetAmount, setBudgetAmount] = useState('15000');
  const [targetClubName, setTargetClubName] = useState('Google Developer Student Club (GDSC)');
  const [expectedParticipants, setExpectedParticipants] = useState('120');
  const [budgetProposals, setBudgetProposals] = useState([
    {
      id: 'GRANT-409',
      event: 'HackCampus 2026 24h Hackathon',
      club: 'Google Developer Student Club (GDSC)',
      amount: '₹25,000',
      status: 'APPROVED',
      stage: 'Funds Disbursed to Club Account'
    },
    {
      id: 'GRANT-412',
      event: 'Inter-College RoboWars Championship',
      club: 'Robotics & Automation Society (RAS)',
      amount: '₹18,000',
      status: 'PENDING_DEAN',
      stage: 'Faculty Lead Endorsed • Awaiting Dean SAC Review'
    }
  ]);

  useEffect(() => {
    async function fetchClubs() {
      try {
        const res = await fetch(`/api/clubs?category=${category}&search=${encodeURIComponent(search)}`);
        if (res.ok) {
          const json = await res.json();
          setClubs(json.data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchClubs();
  }, [category, search]);

  const handleJoinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinModal) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/clubs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'JOIN',
          clubId: joinModal.id,
          roleApplied,
          motivation,
          studentName: 'Alex Kumar',
          rollNumber: '23CSE042'
        })
      });

      if (res.ok) {
        setJoinedClubs(prev => [...prev, joinModal.id]);
        addToast({
          title: 'Application Submitted!',
          message: `Your membership application for ${joinModal.name} has been sent to the executive leads.`,
          type: 'success'
        });
        setJoinModal(null);
        setMotivation('');
      }
    } catch (err) {
      addToast({
        title: 'Error Submitting',
        message: 'Could not send application. Please try again.',
        type: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const categories = [
    { id: 'ALL', label: 'All Communities' },
    { id: 'TECHNICAL', label: 'Tech & Engineering' },
    { id: 'CULTURAL', label: 'Arts & Cultural' },
    { id: 'SPORTS', label: 'Athletics & Sports' },
    { id: 'LITERARY', label: 'Literary & MUN' }
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" /> Student Life & Leadership
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Campus Clubs & Societies Nexus</h1>
          <p className="text-white/90 text-sm sm:text-base">
            Explore 25+ student-led technical chapters, cultural societies, athletic clubs, and professional development hubs. Network, build projects, and lead initiatives.
          </p>
        </div>

        <button
          onClick={() => setBudgetModal(true)}
          className="relative z-10 px-4 py-2.5 rounded-2xl bg-white text-emerald-800 font-bold text-xs shadow-lg hover:bg-emerald-50 flex items-center gap-2 whitespace-nowrap self-start sm:self-auto cursor-pointer transition-all"
        >
          <DollarSign className="w-4 h-4 text-emerald-600" /> + Apply Event Budget Grant
        </button>
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Active Club Grant Proposals Tracker */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex justify-between items-center pb-2 border-b border-border">
          <div>
            <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-emerald-600" /> SAC Club Budget Proposals & Event Grants
            </h3>
            <p className="text-xs text-muted-foreground">Live university funding status for student chapter events</p>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-600">{budgetProposals.length} Submitted</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {budgetProposals.map((prop) => (
            <div key={prop.id} className="p-3.5 rounded-xl border border-border bg-muted/30 space-y-2 text-xs">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-mono text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {prop.id}
                  </span>
                  <h4 className="font-bold text-sm text-foreground mt-1">{prop.event}</h4>
                  <p className="text-[11px] text-muted-foreground">{prop.club}</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-emerald-600 font-mono text-sm block">{prop.amount}</span>
                  <span className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-0.5",
                    prop.status === 'APPROVED' ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"
                  )}>
                    {prop.status}
                  </span>
                </div>
              </div>

              <div className="pt-1.5 border-t border-border/60 text-[11px] text-muted-foreground flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-muted-foreground" /> {prop.stage}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={cn(
                "px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 shadow-xs",
                category === c.id
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
                  : "bg-card text-muted-foreground hover:bg-accent border border-border"
              )}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search clubs, technologies, leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Clubs Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-72 rounded-2xl bg-card/60 animate-pulse border border-border" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map((club) => {
            const isJoined = joinedClubs.includes(club.id);
            return (
              <div
                key={club.id}
                className="group relative flex flex-col bg-card border border-border hover:border-emerald-500/50 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300"
              >
                {/* Banner Thumbnail */}
                <div className="relative h-40 w-full overflow-hidden bg-muted">
                  <img
                    src={club.bannerUrl || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=60'}
                    alt={club.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-black/60 backdrop-blur-md text-white border border-white/20">
                      {club.category}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="font-bold text-lg leading-tight line-clamp-1">{club.name}</h3>
                    <p className="text-xs text-white/80 flex items-center gap-1 mt-0.5">
                      <Users className="w-3.5 h-3.5" /> {club.members} Active Members
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {club.description}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-border/60 text-xs">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="font-medium">President:</span>
                      <span className="text-foreground font-semibold">{club.president}</span>
                    </div>
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="font-medium">Faculty Mentor:</span>
                      <span className="text-foreground">{club.facultyLead}</span>
                    </div>
                    {club.meetingSchedule && (
                      <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                        <Calendar className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{club.meetingSchedule}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => setSelectedClub(club)}
                      className="flex-1 py-2 px-3 rounded-xl border border-border hover:bg-accent text-xs font-semibold transition"
                    >
                      View Details
                    </button>
                    {isJoined ? (
                      <button
                        disabled
                        className="py-2 px-4 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Member
                      </button>
                    ) : (
                      <button
                        onClick={() => setJoinModal(club)}
                        className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1 shadow-sm transition"
                      >
                        <UserPlus className="w-3.5 h-3.5" /> Join Club
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Details Modal */}
      {selectedClub && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="relative h-44 w-full bg-muted">
              <img
                src={selectedClub.bannerUrl}
                alt={selectedClub.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <button
                onClick={() => setSelectedClub(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-600 text-white">
                  {selectedClub.category}
                </span>
                <h2 className="text-xl font-bold mt-1">{selectedClub.name}</h2>
              </div>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">About the Society</h4>
                <p className="text-sm text-foreground leading-relaxed">{selectedClub.description}</p>
              </div>

              {selectedClub.achievements && selectedClub.achievements.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-amber-500" /> Key Accolades & Milestones
                  </h4>
                  <ul className="space-y-1.5">
                    {selectedClub.achievements.map((ach: string, i: number) => (
                      <li key={i} className="text-xs flex items-center gap-2 text-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {ach}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-muted/50 text-xs">
                <div>
                  <p className="text-muted-foreground">President</p>
                  <p className="font-semibold text-foreground">{selectedClub.president}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Faculty Mentor</p>
                  <p className="font-semibold text-foreground">{selectedClub.facultyLead}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground">Meeting Schedule & Venue</p>
                  <p className="font-semibold text-foreground">{selectedClub.meetingSchedule || 'Weekly sessions'}</p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setSelectedClub(null)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-border hover:bg-accent"
                >
                  Close
                </button>
                {!joinedClubs.includes(selectedClub.id) && (
                  <button
                    onClick={() => {
                      const c = selectedClub;
                      setSelectedClub(null);
                      setJoinModal(c);
                    }}
                    className="px-5 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20"
                  >
                    Apply for Membership
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Join Application Modal */}
      {joinModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-4 border-b border-border">
              <div>
                <h3 className="font-bold text-lg">Join {joinModal.name}</h3>
                <p className="text-xs text-muted-foreground">Submit your membership profile to the core team</p>
              </div>
              <button
                onClick={() => setJoinModal(null)}
                className="p-1 rounded-lg text-muted-foreground hover:bg-accent"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleJoinSubmit} className="space-y-4 pt-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Applying as Role</label>
                <select
                  value={roleApplied}
                  onChange={(e) => setRoleApplied(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-background border border-border rounded-xl focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Active Member">Active Member</option>
                  <option value="Tech Lead / Contributor">Tech Lead / Contributor</option>
                  <option value="Event Coordinator">Event Coordinator</option>
                  <option value="Design & Media Volunteer">Design & Media Volunteer</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">
                  Why do you want to join? (Experience / Goals)
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Share any past project experience, skills, or what you hope to learn..."
                  value={motivation}
                  onChange={(e) => setMotivation(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-background border border-border rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setJoinModal(null)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-border hover:bg-accent"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20 disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Budget Grant Proposal Modal */}
      {budgetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative space-y-4 animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setBudgetModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                SAC EVENT GRANT APPLICATION
              </span>
              <h3 className="text-lg font-bold text-foreground mt-1">Apply for Club Event Funding Grant</h3>
              <p className="text-xs text-muted-foreground">Request institutional budget allocation from Student Affairs Council</p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!eventTitle.trim()) return;
                const newGrant = {
                  id: `GRANT-${Math.floor(100 + Math.random() * 900)}`,
                  event: eventTitle,
                  club: targetClubName,
                  amount: `₹${Number(budgetAmount).toLocaleString('en-IN')}`,
                  status: 'PENDING_FACULTY',
                  stage: 'Submitted • Awaiting Faculty Advisor Sign-off'
                };
                setBudgetProposals([newGrant, ...budgetProposals]);
                setBudgetModal(false);
                setEventTitle('');
                addToast({
                  title: 'Grant Proposal Submitted! 💰',
                  message: `Budget request for "${eventTitle}" submitted to Faculty Lead.`,
                  type: 'success'
                });
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="font-semibold text-muted-foreground block mb-1">Applying Student Chapter</label>
                <select
                  value={targetClubName}
                  onChange={(e) => setTargetClubName(e.target.value)}
                  className="w-full p-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Google Developer Student Club (GDSC)">Google Developer Student Club (GDSC)</option>
                  <option value="Robotics & Automation Society (RAS)">Robotics & Automation Society (RAS)</option>
                  <option value="Association for Computing Machinery (ACM)">Association for Computing Machinery (ACM)</option>
                  <option value="Literary & Debating Society">Literary & Debating Society</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-muted-foreground block mb-1">Event Name & Theme</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Annual Campus AI Hackathon & Workshop Series"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="w-full p-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-muted-foreground block mb-1">Required Budget (₹)</label>
                  <input
                    type="number"
                    required
                    value={budgetAmount}
                    onChange={(e) => setBudgetAmount(e.target.value)}
                    className="w-full p-2.5 bg-background border border-border rounded-xl font-mono focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-muted-foreground block mb-1">Expected Attendees</label>
                  <input
                    type="number"
                    required
                    value={expectedParticipants}
                    onChange={(e) => setExpectedParticipants(e.target.value)}
                    className="w-full p-2.5 bg-background border border-border rounded-xl font-mono focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setBudgetModal(false)}
                  className="px-4 py-2 border border-border rounded-xl font-semibold hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> Submit Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
