'use client';

import { useState, useEffect } from 'react';
import { Home, Users, Utensils, Wrench, Shield, CheckCircle2, Clock, Phone, AlertCircle, Sparkles, Building, BedDouble, Plus, Calendar, FileCheck, Moon, DoorOpen, Key, X, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/lib/toastContext';

export default function StudentHostelPage() {
  const { addToast } = useToast();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'MY_ROOM' | 'ROOM_CATALOG' | 'MESS_MENU' | 'MAINTENANCE' | 'AGREEMENT'>('MY_ROOM');
  const [selectedBlock, setSelectedBlock] = useState('Block A (Boys - Everest)');
  const [issueCategory, setIssueCategory] = useState('PLUMBING');
  const [issueDesc, setIssueDesc] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [gatePassModal, setGatePassModal] = useState(false);
  const [nightOutReason, setNightOutReason] = useState('');
  const [returnDate, setReturnDate] = useState('');

  // Roommate Agreement State
  const [lightsOutTime, setLightsOutTime] = useState('11:30 PM');
  const [quietHoursAgreed, setQuietHoursAgreed] = useState(true);
  const [guestPolicyAgreed, setGuestPolicyAgreed] = useState(true);
  const [choreRotationAgreed, setChoreRotationAgreed] = useState(true);

  useEffect(() => {
    async function fetchHostel() {
      try {
        const res = await fetch('/api/hostel');
        if (res.ok) {
          const json = await res.json();
          setData(json.data || json);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchHostel();
  }, []);

  const handleMaintenanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueDesc.trim()) {
      addToast({ title: 'Description Required', message: 'Please describe the maintenance issue.', type: 'warning' });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/hostel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'MAINTENANCE_REQUEST',
          category: issueCategory,
          issue: issueDesc,
          roomNumber: data?.currentAllocation?.roomNumber || '101',
          block: 'Block A',
          studentName: 'Alex Kumar'
        })
      });
      if (res.ok) {
        addToast({ title: 'Ticket Created', message: 'Hostel maintenance ticket logged successfully.', type: 'success' });
        setIssueDesc('');
        // Refresh data
        const ref = await fetch('/api/hostel');
        if (ref.ok) {
          const json = await ref.json();
          setData(json.data || json);
        }
      }
    } catch {
      addToast({ title: 'Error', message: 'Failed to submit ticket', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const alloc = data?.currentAllocation;
  const rooms = data?.rooms || [];
  const mess = data?.messMenu;
  const maintenance = data?.maintenanceRequests || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-xs">
              <Home className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Hostel & Accommodation Desk</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">Manage your room allocation, mess menu, roommate details, and maintenance requests</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setGatePassModal(true)}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
          >
            <DoorOpen className="w-3.5 h-3.5" /> Apply Late / Night-Out Pass
          </button>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Allocated: Room {alloc?.roomNumber || '101'}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-medium">
        {[
          { id: 'MY_ROOM', label: 'My Room & Roommate', icon: BedDouble },
          { id: 'AGREEMENT', label: 'Roommate Agreement', icon: FileCheck },
          { id: 'ROOM_CATALOG', label: 'Hostel Floor Explorer', icon: Building },
          { id: 'MESS_MENU', label: 'Daily Mess Menu', icon: Utensils },
          { id: 'MAINTENANCE', label: 'Maintenance & Repairs', icon: Wrench },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                'flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap',
                active ? 'bg-blue-600 text-white font-semibold shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: My Room */}
      {activeTab === 'MY_ROOM' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-card relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                    {alloc?.block}
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 mt-2">Room {alloc?.roomNumber} - {alloc?.roomType}</h2>
                  <p className="text-xs text-slate-500">{alloc?.bedNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">Rent Tier</p>
                  <p className="text-lg font-bold text-slate-900">{alloc?.monthlyFee}</p>
                  <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Status: {alloc?.feeStatus}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                      RS
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Roommate</p>
                      <p className="text-sm font-bold text-slate-900">{alloc?.roommate}</p>
                      <p className="text-[11px] text-slate-500">CSE Department • Roll: 23CSE044</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Chief Warden</p>
                      <p className="text-sm font-bold text-slate-900">{alloc?.wardenName}</p>
                      <p className="text-[11px] text-blue-600 font-mono font-medium flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {alloc?.wardenPhone}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-xl bg-blue-50/70 border border-blue-100 text-xs text-blue-900 flex items-start gap-3">
                <Clock className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">{alloc?.gatePassTiming}</span>. Late entry after 10:00 PM requires biometric security logging and warden authorization.
                </div>
              </div>
            </div>
          </div>

          {/* Quick Info & Guidelines */}
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-card">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-indigo-600" /> Hostel Rules & Facilities
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> High-speed 500 Mbps Wi-Fi included
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> 24/7 RO Purified Drinking Water
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Biometric In/Out Turnstile Gates
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Laundry Facility (3 loads / week)
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Gymnasium & Table Tennis room in Block B
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Floor Explorer */}
      {activeTab === 'ROOM_CATALOG' && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            {['Block A (Boys - Everest)', 'Block C (Girls - Sarojini)'].map((blk) => (
              <button
                key={blk}
                onClick={() => setSelectedBlock(blk)}
                className={cn(
                  'px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer',
                  selectedBlock === blk ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                )}
              >
                {blk}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {rooms
              .filter((r: any) => r.block === selectedBlock)
              .map((room: any) => (
                <div key={room.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 font-mono">Room {room.roomNumber}</span>
                    <span className={cn(
                      'text-[10px] font-bold px-2 py-0.5 rounded-full',
                      room.status === 'AVAILABLE' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                    )}>
                      {room.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{room.roomType.replace('_', ' ')} • Floor {room.floor}</p>
                  <div className="mt-3 flex items-center justify-between text-xs border-t border-slate-100 pt-2">
                    <span className="text-slate-500">Occupancy: {room.occupied}/{room.capacity}</span>
                    <span className="font-bold text-slate-900">₹{room.monthlyRent}/mo</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Tab 3: Daily Mess Menu */}
      {activeTab === 'MESS_MENU' && mess && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-card space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Daily Dining Hall Schedule ({mess.day})</h3>
              <p className="text-xs text-slate-500">Hygienic, nutrition-controlled dining services catered daily</p>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              FSSAI Certified 4.8★
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 text-amber-700 font-semibold text-xs mb-1">
                <Utensils className="w-4 h-4" /> Breakfast
              </div>
              <p className="text-xs text-slate-800 leading-relaxed">{mess.breakfast}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 text-emerald-700 font-semibold text-xs mb-1">
                <Utensils className="w-4 h-4" /> Lunch
              </div>
              <p className="text-xs text-slate-800 leading-relaxed">{mess.lunch}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 text-orange-700 font-semibold text-xs mb-1">
                <Utensils className="w-4 h-4" /> Evening Snacks & Tea
              </div>
              <p className="text-xs text-slate-800 leading-relaxed">{mess.snacks}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 text-indigo-700 font-semibold text-xs mb-1">
                <Utensils className="w-4 h-4" /> Dinner Special
              </div>
              <p className="text-xs text-slate-800 leading-relaxed">{mess.dinner}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Maintenance */}
      {activeTab === 'MAINTENANCE' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-5 shadow-card">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-blue-600" /> Log Maintenance Ticket
            </h3>
            <form onSubmit={handleMaintenanceSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Category</label>
                <select
                  value={issueCategory}
                  onChange={(e) => setIssueCategory(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2 bg-white text-slate-900 outline-none"
                >
                  <option value="PLUMBING">Plumbing / Washroom</option>
                  <option value="ELECTRICAL">Electrical / Fan / Light</option>
                  <option value="FURNITURE">Furniture / Bed / Table</option>
                  <option value="INTERNET">Wi-Fi & LAN Network</option>
                  <option value="CLEANING">Room Deep Cleaning</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Problem Description</label>
                <textarea
                  rows={3}
                  value={issueDesc}
                  onChange={(e) => setIssueDesc(e.target.value)}
                  placeholder="Describe the issue in detail..."
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-slate-900 outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                {submitting ? 'Logging Ticket...' : 'Submit Maintenance Ticket'}
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Active & Historical Maintenance Requests</h3>
            <div className="space-y-3">
              {maintenance.map((m: any) => (
                <div key={m.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{m.category}</span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">Room {m.roomNumber}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{m.issue}</p>
                  </div>
                  <span className={cn(
                    'text-[10px] font-bold px-2.5 py-1 rounded-full',
                    m.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                  )}>
                    {m.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Roommate Agreement & Quiet Hours Covenant */}
      {activeTab === 'AGREEMENT' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full">
                OFFICIAL ROOMMATE COVENANT
              </span>
              <h2 className="text-lg font-bold text-slate-900 mt-1">Room {alloc?.roomNumber || '101'} Living Agreement</h2>
              <p className="text-xs text-slate-500">Mutual living standards signed between you and <strong>{alloc?.roommate || 'Roommate'}</strong></p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5 w-fit">
              <CheckCircle2 className="w-3.5 h-3.5" /> Both Parties Signed
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Moon className="w-4 h-4 text-indigo-600" /> Quiet & Sleep Hours
                </span>
                <span className="font-mono font-bold text-indigo-600">{lightsOutTime}</span>
              </div>
              <p className="text-slate-600">Main lights off by {lightsOutTime}. Use individual desk lamps and headphones for late night study.</p>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-blue-600" /> Guest & Study Group Policy
                </span>
                <span className="font-bold text-emerald-600">Pre-approval Required</span>
              </div>
              <p className="text-slate-600">Non-resident study visitors allowed until 8:00 PM with mutual 2-hour advance verbal notice.</p>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" /> Room Cleanliness & Chores
                </span>
                <span className="font-bold text-indigo-600">Alternating Weeks</span>
              </div>
              <p className="text-slate-600">Weekly trash disposal and floor sweeping rotated every Sunday evening before inspection.</p>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Key className="w-4 h-4 text-slate-700" /> Property & Personal Belongings
                </span>
                <span className="font-bold text-emerald-600">Strict Respect</span>
              </div>
              <p className="text-slate-600">Borrowing textbooks, gadgets, or stationery strictly requires explicit permission beforehand.</p>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => addToast({ title: 'Agreement Updated', message: 'Signed covenant synced to Chief Warden portal.', type: 'success' })}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs"
            >
              Update Agreement Terms
            </button>
          </div>
        </div>
      )}

      {/* Night Out Gate Pass Modal */}
      {gatePassModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                  DIGITAL SECURITY GATE PASS
                </span>
                <h3 className="font-bold text-base text-slate-900 mt-1">Apply Night-Out / Leave Pass</h3>
              </div>
              <button onClick={() => setGatePassModal(false)} className="p-1 rounded-xl text-slate-400 hover:bg-slate-50">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setGatePassModal(false);
                setNightOutReason('');
                setReturnDate('');
                addToast({
                  title: 'Gate Pass Dispatched 🛂',
                  message: 'Warden & Parent SMS approval request dispatched. QR token generated.',
                  type: 'success'
                });
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Reason for Leave / Night-Out</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Home visit / Hackathon overnight participation"
                  value={nightOutReason}
                  onChange={(e) => setNightOutReason(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Expected Return Date & Time</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tomorrow 08:00 AM"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                />
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800 space-y-0.5">
                <p className="font-bold">Automated Parent Verification:</p>
                <p>An automated confirmation SMS will be triggered to your registered guardian phone upon approval.</p>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setGatePassModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Submit Gate Pass Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
