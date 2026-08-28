'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Key, 
  Lock, 
  Unlock, 
  ArrowLeft, 
  ShieldCheck, 
  CheckCircle2, 
  Battery, 
  Activity, 
  UserCheck,
  Sparkles
} from 'lucide-react';

export default function RFIDAccessControlPage() {
  const [data, setData] = useState<any>(null);
  const [unlockedDoors, setUnlockedDoors] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/admin/rfid')
      .then(res => res.json())
      .then(json => {
        if (json.success) setData(json.data);
      });
  }, []);

  const handleRemoteUnlock = async (doorId: string) => {
    const res = await fetch('/api/admin/rfid', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ doorId, action: 'REMOTE_UNLOCK_MOMENTARY' })
    });
    const json = await res.json();
    if (json.success) {
      setUnlockedDoors([...unlockedDoors, doorId]);
      setTimeout(() => {
        setUnlockedDoors(prev => prev.filter(d => d !== doorId));
      }, 5000);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900/60 p-6 rounded-2xl border border-indigo-500/20 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 mb-1">
            <Link href="/dashboard/admin" className="flex items-center gap-1 hover:underline text-xs">
              <ArrowLeft className="w-3 h-3" /> Back to Admin Console
            </Link>
            <span className="text-slate-500">•</span>
            <span className="text-xs font-semibold uppercase tracking-wider">Campus Cyber-Physical Security</span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Key className="w-6 h-6 text-indigo-400" />
            Campus Key & Smart RFID Lock Access Control Center
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage high-security laboratory turnstiles, biometric door strikes, server room dual-custody access, and emergency lockdown relays.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-900/80 border border-indigo-500/30 px-4 py-2 rounded-2xl text-right">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Active Keycards</div>
            <div className="text-lg font-bold text-indigo-400">{data?.activeKeycardsIssued?.toLocaleString() || '11,450'} Issued</div>
          </div>
        </div>
      </div>

      {data && (
        <>
          {/* Top Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-1">
              <div className="text-xs text-slate-400">Total Online Smart Locks</div>
              <div className="text-2xl font-bold text-white">{data.totalLocksOnline} Access Points</div>
              <div className="text-[11px] text-emerald-400">100% Zigbee/BLE Mesh Health</div>
            </div>

            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-1">
              <div className="text-xs text-slate-400">Security Tamper Incidents</div>
              <div className="text-2xl font-bold text-emerald-400">{data.tamperAlertsToday} Violations</div>
              <div className="text-[11px] text-slate-400">Zero unauthorized door forced open</div>
            </div>

            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-1">
              <div className="text-xs text-slate-400">Master Emergency Override</div>
              <div className="text-2xl font-bold text-indigo-300">Armed (Auto-Failsafe)</div>
              <div className="text-[11px] text-slate-400">Automatic fire alarm release integration</div>
            </div>
          </div>

          {/* Access Points Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {data.accessPoints?.map((door: any) => {
              const isMomentaryUnlocked = unlockedDoors.includes(door.doorId);
              return (
                <div key={door.doorId} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md">
                        {door.doorId}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        isMomentaryUnlocked
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}>
                        {isMomentaryUnlocked ? 'UNLOCKED (5s)' : 'SECURE LOCKED'}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-white">{door.name}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">{door.building}</p>
                    </div>

                    <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Security Protocol:</span>
                        <span className="text-white font-medium truncate max-w-[140px]">{door.lockType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Authorized Badge Pool:</span>
                        <span className="font-bold text-white">{door.authorizedUsersCount} Profiles</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Today's Badge Swipes:</span>
                        <span className="font-bold text-indigo-300">{door.todayTapsCount} Badges</span>
                      </div>
                      <div className="flex justify-between items-center pt-1 border-t border-slate-800">
                        <span className="text-slate-400">Lock Battery:</span>
                        <span className="text-emerald-400 font-semibold flex items-center gap-1">
                          <Battery className="w-3.5 h-3.5" /> {door.lockBatteryPct}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemoteUnlock(door.doorId)}
                    disabled={isMomentaryUnlocked}
                    className={`w-full py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                      isMomentaryUnlocked
                        ? 'bg-amber-600 text-white'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md'
                    }`}
                  >
                    {isMomentaryUnlocked ? (
                      <>
                        <Unlock className="w-3.5 h-3.5" /> Strike Released...
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" /> Pulse Remote Unlock
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
