'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Video, 
  Plus, 
  Flame, 
  Calendar, 
  ExternalLink, 
  Sparkles, 
  Check, 
  Search, 
  BookOpen, 
  Clock 
} from 'lucide-react';

export default function StudyGroupsPage() {
  const [groups, setGroups] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [joined, setJoined] = useState<{ [id: string]: boolean }>({});
  const [showModal, setShowModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newSubject, setNewSubject] = useState('');

  useEffect(() => {
    fetch('/api/study-groups')
      .then(res => res.json())
      .then(data => {
        if (data.success) setGroups(data.data);
      });
  }, []);

  const handleJoin = (id: string) => {
    setJoined(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName || !newSubject) return;

    const res = await fetch('/api/study-groups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: newGroupName,
        subject: newSubject,
        maxMembers: 5,
        meetingSchedule: 'Daily • 7:00 PM',
        tags: ['Peer Revision', 'Active Recall']
      })
    });
    const data = await res.json();
    if (data.success) {
      setGroups(prev => [data.data, ...prev]);
      setShowModal(false);
      setNewGroupName('');
      setNewSubject('');
    }
  };

  const filteredGroups = groups.filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-violet-900/40 via-purple-900/30 to-slate-900/40 p-6 rounded-2xl border border-violet-500/20 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 text-violet-400 mb-1 text-xs font-semibold uppercase tracking-wider">
            <Users className="w-4 h-4" /> Peer Learning Ecosystem
          </div>
          <h1 className="text-2xl font-bold text-white">Peer-to-Peer Study Pods & Virtual Rooms</h1>
          <p className="text-slate-400 text-sm mt-1">
            Form collaborative study pods, maintain daily revision streaks, and join 1-click encrypted peer study rooms.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm rounded-xl transition shadow-lg shadow-violet-600/20 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Create Study Pod
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <Search className="w-4 h-4 text-slate-400 ml-2" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search pods by subject, topic or course code..."
          className="w-full bg-transparent text-sm text-slate-200 placeholder-slate-500 focus:outline-none"
        />
      </div>

      {/* Pods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGroups.map(grp => (
          <div
            key={grp.id}
            className="bg-slate-900/60 rounded-2xl border border-slate-800 p-5 flex flex-col justify-between space-y-4 hover:border-violet-500/30 transition shadow-lg shadow-slate-950/40"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs px-2.5 py-1 bg-violet-950/60 text-violet-300 font-medium rounded-md border border-violet-500/30">
                  {grp.subject}
                </span>
                <div className="flex items-center gap-1 text-xs text-amber-400 font-semibold">
                  <Flame className="w-4 h-4 fill-amber-400" />
                  <span>{grp.streakDays}d streak</span>
                </div>
              </div>

              <h3 className="text-base font-bold text-white leading-snug mb-2">{grp.name}</h3>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {grp.tags.map((tag: string, i: number) => (
                  <span key={i} className="text-[11px] px-2 py-0.5 bg-slate-800/80 text-slate-300 rounded">
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="space-y-1.5 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>{grp.meetingSchedule}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-slate-500" />
                  <span>{grp.membersCount} / {grp.maxMembers} Members • Led by {grp.leadStudent}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
              <button
                onClick={() => handleJoin(grp.id)}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  joined[grp.id]
                    ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
              >
                {joined[grp.id] ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Joined Pod
                  </>
                ) : (
                  'Join Pod'
                )}
              </button>

              <a
                href={grp.activeRoomLink}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl transition flex items-center justify-center cursor-pointer"
                title="Launch Video Room"
              >
                <Video className="w-4 h-4" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Creation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-md space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-violet-400" /> Create New Study Pod
            </h3>
            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Pod Name</label>
                <input
                  type="text"
                  required
                  value={newGroupName}
                  onChange={e => setNewGroupName(e.target.value)}
                  placeholder="e.g. Operating Systems Kernel Study Group"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Course / Subject</label>
                <input
                  type="text"
                  required
                  value={newSubject}
                  onChange={e => setNewSubject(e.target.value)}
                  placeholder="e.g. CS301 - Operating Systems"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
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
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Create Pod
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
