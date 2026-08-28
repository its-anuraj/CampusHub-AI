'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Tv, 
  Video, 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  Send, 
  Users, 
  Sparkles,
  Ticket
} from 'lucide-react';

export default function CampusLivestreamsPage() {
  const [data, setData] = useState<any>(null);
  const [cheerMessage, setCheerMessage] = useState('');
  const [sentCheer, setSentCheer] = useState(false);

  useEffect(() => {
    fetch('/api/parent/livestreams')
      .then(res => res.json())
      .then(json => {
        if (json.success) setData(json.data);
      });
  }, []);

  const handleSendCheer = async (e: React.FormEvent, streamId: string) => {
    e.preventDefault();
    if (!cheerMessage) return;

    const res = await fetch('/api/parent/livestreams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ streamId, familyMessage: cheerMessage })
    });
    const json = await res.json();
    if (json.success) {
      setSentCheer(true);
      setCheerMessage('');
      setTimeout(() => setSentCheer(false), 4000);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-purple-900/40 via-pink-900/30 to-slate-900/40 p-6 rounded-2xl border border-purple-500/20 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 text-purple-400 mb-1">
            <Link href="/dashboard/parent" className="flex items-center gap-1 hover:underline text-xs">
              <ArrowLeft className="w-3 h-3" /> Back to Parent Portal
            </Link>
            <span className="text-slate-500">•</span>
            <span className="text-xs font-semibold uppercase tracking-wider">High-Definition Broadcasts</span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Tv className="w-6 h-6 text-purple-400" />
            Campus Event Livestreams & Virtual Convocation Seats
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Watch your ward's graduation convocation, inter-collegiate sports finals, and award ceremonies live with dedicated family virtual seats.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-900/80 border border-purple-500/30 px-4 py-2 rounded-2xl text-right">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Video Quality</div>
            <div className="text-sm font-bold text-emerald-400 flex items-center gap-1 justify-end">
              <CheckCircle2 className="w-3.5 h-3.5" /> 4K Ultra HD Ready
            </div>
          </div>
        </div>
      </div>

      {data && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.livestreams?.map((st: any) => (
            <div key={st.streamId} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    {st.category}
                  </span>
                  <span className="font-mono text-xs text-slate-400">{st.eventDate}</span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white leading-snug">{st.title}</h3>
                  <div className="text-xs text-slate-300 mt-1">Chief Guest: <strong className="text-white">{st.chiefGuest}</strong></div>
                  <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" /> {st.venue}
                  </div>
                </div>

                <div className="bg-slate-950/60 border border-purple-500/30 rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-purple-300 uppercase font-semibold">Reserved Family Virtual Pass</div>
                    <div className="text-sm font-mono font-bold text-white">{st.reservedFamilyVirtualPass}</div>
                  </div>
                  <Ticket className="w-5 h-5 text-purple-400" />
                </div>
              </div>

              {/* Family Cheer Form */}
              <div className="space-y-2 pt-3 border-t border-slate-800">
                <form onSubmit={e => handleSendCheer(e, st.streamId)} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Send a congratulatory cheer to auditorium screen..."
                    value={cheerMessage}
                    onChange={e => setCheerMessage(e.target.value)}
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold shrink-0 flex items-center gap-1"
                  >
                    <Send className="w-3.5 h-3.5" /> Cheer
                  </button>
                </form>
                {sentCheer && (
                  <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Cheer queued for live event screen ticker!
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
