'use client';

import { useState, useEffect } from 'react';
import { Building, Users, Shield, Wrench, Search, CheckCircle2, Phone, AlertCircle, Sparkles, Filter, Loader2, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/lib/toastContext';

export default function AdminHostelPage() {
  const { addToast } = useToast();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterBlock, setFilterBlock] = useState('ALL');

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

  const rooms = data?.rooms || [];
  const maintenance = data?.maintenanceRequests || [];

  const filteredRooms = rooms.filter((r: any) => {
    const matchesSearch = !search || r.roomNumber.includes(search) || r.block.toLowerCase().includes(search.toLowerCase());
    const matchesBlock = filterBlock === 'ALL' || r.block.includes(filterBlock);
    return matchesSearch && matchesBlock;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shadow-xs">
              <Building className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Hostel & Housing Administration</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">Campus housing occupancy, warden assignments, maintenance SLA, and room inventory</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Capacity', val: '1,200 Beds', sub: 'Across 4 residential blocks', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Current Occupancy', val: '1,080 (90%)', sub: '120 vacant beds available', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Monthly Housing Revenue', val: '₹81.0 Lakhs', sub: '98.4% collection rate', color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Open Maintenance Tickets', val: maintenance.length.toString(), sub: 'SLA target: < 24 hrs', color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-card">
            <p className="text-xs font-semibold text-slate-500">{stat.label}</p>
            <p className={cn('text-2xl font-bold mt-1 tracking-tight', stat.color)}>{stat.val}</p>
            <p className="text-[11px] text-slate-400 mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Wardens & Residential Blocks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Building className="w-4 h-4 text-blue-600" /> Residential Block Breakdown
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { name: 'Block A (Everest - Boys)', total: 350, occ: 330, warden: 'Prof. S. R. Verma', phone: '+91 98765 43210' },
              { name: 'Block B (Nilgiri - Boys)', total: 350, occ: 310, warden: 'Dr. K. Narayanan', phone: '+91 98765 43211' },
              { name: 'Block C (Sarojini - Girls)', total: 300, occ: 275, warden: 'Dr. Ananya Ray', phone: '+91 98765 43212' },
              { name: 'Block D (PG & Research)', total: 200, occ: 165, warden: 'Prof. Amit Mishra', phone: '+91 98765 43213' },
            ].map((block, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">{block.name}</span>
                  <span className="text-[11px] font-bold text-blue-600">{Math.round((block.occ / block.total) * 100)}% Occupied</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: `${(block.occ / block.total) * 100}%` }} />
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Warden: {block.warden}</span>
                  <span className="font-mono text-slate-700">{block.phone}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Maintenance Resolution */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-card space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Wrench className="w-4 h-4 text-amber-600" /> Pending Work Orders
          </h3>
          <div className="space-y-3">
            {maintenance.map((m: any) => (
              <div key={m.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{m.studentName} ({m.roomNumber})</span>
                  <span className="text-[10px] bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded">{m.priority}</span>
                </div>
                <p className="text-slate-600 mt-1">{m.issue}</p>
                <button
                  onClick={() => addToast({ title: 'Dispatched', message: `Technician assigned to ${m.roomNumber}`, type: 'success' })}
                  className="mt-2 text-[11px] font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                >
                  Assign Technician →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Room Inventory Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h3 className="text-sm font-bold text-slate-900">Room Inventory & Status</h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search rooms..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent text-xs text-slate-900 outline-none w-32 sm:w-48"
              />
            </div>
            <select
              value={filterBlock}
              onChange={(e) => setFilterBlock(e.target.value)}
              className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs bg-slate-50 text-slate-700 outline-none"
            >
              <option value="ALL">All Blocks</option>
              <option value="Block A">Block A</option>
              <option value="Block C">Block C</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="p-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <th className="p-3.5">Block</th>
                  <th className="p-3.5">Room</th>
                  <th className="p-3.5">Tier</th>
                  <th className="p-3.5">Capacity</th>
                  <th className="p-3.5">Occupied</th>
                  <th className="p-3.5">Monthly Rent</th>
                  <th className="p-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredRooms.map((r: any) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-medium text-slate-900">{r.block}</td>
                    <td className="p-3.5 font-mono font-bold text-blue-600">Room {r.roomNumber}</td>
                    <td className="p-3.5 text-slate-600">{r.roomType.replace('_', ' ')}</td>
                    <td className="p-3.5 text-slate-700">{r.capacity} Beds</td>
                    <td className="p-3.5 text-slate-700">{r.occupied} Beds</td>
                    <td className="p-3.5 font-semibold text-slate-900">₹{r.monthlyRent}</td>
                    <td className="p-3.5">
                      <span className={cn(
                        'text-[10px] font-bold px-2 py-0.5 rounded-full',
                        r.status === 'AVAILABLE' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700'
                      )}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
