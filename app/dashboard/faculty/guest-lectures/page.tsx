'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Presentation, 
  MapPin, 
  Clock, 
  Users, 
  ArrowLeft, 
  Plus, 
  CheckCircle2, 
  Building2, 
  IndianRupee,
  Sparkles
} from 'lucide-react';

export default function GuestLecturesPage() {
  const [lectures, setLectures] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    speakerName: '',
    designation: '',
    topic: '',
    targetDepartment: 'CSE & AI/DS',
    eventDate: '2026-10-05, 11:00 AM'
  });

  useEffect(() => {
    fetch('/api/faculty/guest-lectures')
      .then(res => res.json())
      .then(json => {
        if (json.success) setLectures(json.data.lectures);
      });
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.speakerName || !formData.topic) return;

    const res = await fetch('/api/faculty/guest-lectures', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const json = await res.json();
    if (json.success) {
      setLectures([json.data, ...lectures]);
      setShowModal(false);
      setFormData({
        speakerName: '',
        designation: '',
        topic: '',
        targetDepartment: 'CSE & AI/DS',
        eventDate: '2026-10-05, 11:00 AM'
      });
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-900/40 via-cyan-900/30 to-slate-900/40 p-6 rounded-2xl border border-blue-500/20 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 text-blue-400 mb-1">
            <Link href="/dashboard/faculty" className="flex items-center gap-1 hover:underline text-xs">
              <ArrowLeft className="w-3 h-3" /> Back to Faculty Portal
            </Link>
            <span className="text-slate-500">•</span>
            <span className="text-xs font-semibold uppercase tracking-wider">Industry-Academia Interface</span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Presentation className="w-6 h-6 text-cyan-400" />
            Guest Lecture & Industry Speaker Invitation Portal
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Initiate industry expert seminars, request auditorium slots, and process honorarium clearance through Dean Academic Affairs.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-500/20 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Invite Speaker
        </button>
      </div>

      {/* Lectures Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {lectures.map((lec) => (
          <div key={lec.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  {lec.targetDepartment}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                  lec.status === 'DEAN_APPROVED'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }`}>
                  {lec.status === 'DEAN_APPROVED' ? 'Approved by Dean' : 'Under Review'}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white">{lec.topic}</h3>
                <div className="text-xs text-cyan-300 font-medium mt-0.5">{lec.speakerName}</div>
                <div className="text-xs text-slate-400">{lec.designation}</div>
              </div>

              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 space-y-1.5 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-blue-400" /> {lec.eventDate}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" /> {lec.venue}
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Users className="w-3.5 h-3.5 text-slate-500" /> Expected Attendees: ~{lec.expectedAttendees}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Host: <strong className="text-slate-300">{lec.hostFaculty}</strong></span>
              <span className="font-semibold text-emerald-400">₹{lec.honorariumInr} Honorarium</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4">
            <h2 className="text-base font-bold text-white">Invite Industry Speaker</h2>
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Speaker Name</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Anand Raghavan"
                  value={formData.speakerName}
                  onChange={e => setFormData({ ...formData, speakerName: e.target.value })}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Designation & Company</label>
                <input
                  type="text"
                  placeholder="e.g. Staff Engineer, Google AI"
                  value={formData.designation}
                  onChange={e => setFormData({ ...formData, designation: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Lecture Topic</label>
                <input
                  type="text"
                  placeholder="e.g. Scaling Distributed Foundation Models"
                  value={formData.topic}
                  onChange={e => setFormData({ ...formData, topic: e.target.value })}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Target Department</label>
                <input
                  type="text"
                  value={formData.targetDepartment}
                  onChange={e => setFormData({ ...formData, targetDepartment: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-1.5 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-semibold"
                >
                  Submit for Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
