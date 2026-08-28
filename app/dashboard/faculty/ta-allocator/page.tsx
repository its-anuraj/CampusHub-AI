'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  UserCheck, 
  Clock, 
  CheckCircle2, 
  Circle, 
  ArrowLeft, 
  Plus, 
  GraduationCap, 
  Star, 
  Layers
} from 'lucide-react';

export default function TAWorkloadAllocatorPage() {
  const [tas, setTas] = useState<any[]>([]);
  const [showDutyModal, setShowDutyModal] = useState(false);
  const [selectedTaId, setSelectedTaId] = useState('');
  const [dutyTitle, setDutyTitle] = useState('');

  useEffect(() => {
    fetch('/api/faculty/ta')
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setTas(json.data.teachingAssistants);
          if (json.data.teachingAssistants.length > 0) {
            setSelectedTaId(json.data.teachingAssistants[0].id);
          }
        }
      });
  }, []);

  const handleAssignDuty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dutyTitle || !selectedTaId) return;

    const res = await fetch('/api/faculty/ta', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        taId: selectedTaId,
        dutyTitle
      })
    });
    const json = await res.json();
    if (json.success) {
      setTas(json.data);
      setShowDutyModal(false);
      setDutyTitle('');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-slate-900/40 p-6 rounded-2xl border border-blue-500/20 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 text-blue-400 mb-1">
            <Link href="/dashboard/faculty" className="flex items-center gap-1 hover:underline text-xs">
              <ArrowLeft className="w-3 h-3" /> Back to Faculty Portal
            </Link>
            <span className="text-slate-500">•</span>
            <span className="text-xs font-semibold uppercase tracking-wider">Academic Workload Coordination</span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-blue-400" />
            Teaching Assistant (TA) Duty & Grading Workload Allocator
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Distribute lab supervision, assignment correction quotas, and tutorial hours among postgraduate scholars and teaching fellows.
          </p>
        </div>

        <button
          onClick={() => setShowDutyModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Assign TA Duty
        </button>
      </div>

      {/* TA Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {tas.map((ta) => (
          <div key={ta.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">{ta.name}</h3>
                <p className="text-xs text-blue-400 font-medium">{ta.assignedCourse}</p>
              </div>
              <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-lg text-amber-400 text-xs font-bold">
                <Star className="w-3 h-3 fill-amber-400" /> {ta.performanceRating}
              </div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-400" /> Allocated Stipend Hours:
              </span>
              <span className="font-bold text-white">{ta.loggedHoursThisMonth} / {ta.weeklyStipendHours * 4} hrs</span>
            </div>

            {/* Duties List */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Active Responsibilities:</span>
              <div className="space-y-1.5">
                {ta.activeDuties?.map((duty: any, dIdx: number) => (
                  <div key={dIdx} className="bg-slate-800/40 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      {duty.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-500" />
                      )}
                      <span className={duty.completed ? 'line-through text-slate-400' : 'text-slate-200 font-medium'}>
                        {duty.task}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">{duty.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showDutyModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4">
            <h2 className="text-base font-bold text-white">Assign Task to TA</h2>
            <form onSubmit={handleAssignDuty} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Select Teaching Assistant</label>
                <select
                  value={selectedTaId}
                  onChange={e => setSelectedTaId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                >
                  {tas.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.assignedCourse})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Duty Description / Invigilation / Grading Batch</label>
                <input
                  type="text"
                  placeholder="e.g. Grade Assignment #2 for Section B (50 students)"
                  value={dutyTitle}
                  onChange={e => setDutyTitle(e.target.value)}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDutyModal(false)}
                  className="px-3 py-1.5 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold"
                >
                  Confirm Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
