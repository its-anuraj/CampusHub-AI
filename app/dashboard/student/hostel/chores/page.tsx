'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Home, 
  CheckCircle2, 
  Circle, 
  ArrowLeft, 
  Plus, 
  Flame, 
  Users, 
  ShieldAlert,
  Award
} from 'lucide-react';

export default function RoommateChoreWheelPage() {
  const [chores, setChores] = useState<any[]>([]);
  const [roomData, setRoomData] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [assignedTo, setAssignedTo] = useState('Aditya Singh (You)');

  useEffect(() => {
    fetch('/api/hostel/chores')
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setChores(json.data.chores);
          setRoomData(json.data);
        }
      });
  }, []);

  const handleToggle = async (choreId: string) => {
    const res = await fetch('/api/hostel/chores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ choreId, action: 'TOGGLE' })
    });
    const json = await res.json();
    if (json.success) {
      setChores(json.data);
    }
  };

  const handleAddChore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask) return;

    const res = await fetch('/api/hostel/chores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'ADD',
        task: newTask,
        assignedTo,
        dueDate: 'Sunday 6:00 PM'
      })
    });
    const json = await res.json();
    if (json.success) {
      setChores([...chores, json.data]);
      setShowAddModal(false);
      setNewTask('');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-rose-900/40 via-orange-900/30 to-slate-900/40 p-6 rounded-2xl border border-rose-500/20 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 text-rose-400 mb-1">
            <Link href="/dashboard/student/hostel" className="flex items-center gap-1 hover:underline text-xs">
              <ArrowLeft className="w-3 h-3" /> Back to Hostel
            </Link>
            <span className="text-slate-500">•</span>
            <span className="text-xs font-semibold uppercase tracking-wider">Hostel Living Harmony</span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Home className="w-6 h-6 text-rose-400" />
            Roommate Chore Wheel & Karma Points Arena
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Keep your dorm spotless with automated weekly rotating chore assignments, streak accountability, and collective room rewards.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-900/80 border border-rose-500/30 px-3.5 py-2 rounded-2xl text-right">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Room {roomData?.roomNumber || 'B-304'} Karma</div>
            <div className="text-base font-bold text-rose-400 flex items-center gap-1 justify-end">
              <Flame className="w-4 h-4 text-orange-400 fill-orange-400" /> {roomData?.roomKarmaPool || 420} pts
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-500/20 transition-all"
          >
            <Plus className="w-4 h-4" /> Add Room Chore
          </button>
        </div>
      </div>

      {/* Roommate Roster Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {roomData?.roommates?.map((mate: string, idx: number) => (
          <div key={idx} className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 flex items-center justify-center font-bold text-xs">
                {mate[0]}
              </div>
              <div>
                <div className="text-xs font-bold text-white">{mate}</div>
                <div className="text-[10px] text-slate-400">Streak: {idx === 0 ? '12 days 🔥' : '4 days'}</div>
              </div>
            </div>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
        ))}
      </div>

      {/* Chore List */}
      <div className="grid grid-cols-1 gap-3">
        {chores.map((chore) => (
          <div
            key={chore.id}
            onClick={() => handleToggle(chore.id)}
            className={`cursor-pointer p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
              chore.isCompleted
                ? 'bg-slate-950/40 border-emerald-500/20 opacity-75'
                : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-3.5">
              {chore.isCompleted ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-slate-500 shrink-0" />
              )}
              <div>
                <h3 className={`text-sm font-semibold ${chore.isCompleted ? 'line-through text-slate-400' : 'text-white'}`}>
                  {chore.task}
                </h3>
                <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                  <span className="text-rose-400 font-medium">{chore.assignedTo}</span>
                  <span>•</span>
                  <span>Due: {chore.dueDate}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs font-semibold text-amber-400 flex items-center gap-1">
                +{chore.karmaPoints} pts
              </span>
              <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 text-slate-300">
                {chore.isCompleted ? 'Done ✓' : 'Mark Done'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4">
            <h2 className="text-base font-bold text-white">Add Dorm Chore</h2>
            <form onSubmit={handleAddChore} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Chore Description</label>
                <input
                  type="text"
                  placeholder="e.g. Balcony plants watering & window glass wiping"
                  value={newTask}
                  onChange={e => setNewTask(e.target.value)}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Assigned Roommate</label>
                <select
                  value={assignedTo}
                  onChange={e => setAssignedTo(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                >
                  <option value="Aditya Singh (You)">Aditya Singh (You)</option>
                  <option value="Rahul Kumar">Rahul Kumar</option>
                  <option value="Sameer Sen">Sameer Sen</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-semibold"
                >
                  Save Chore
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
