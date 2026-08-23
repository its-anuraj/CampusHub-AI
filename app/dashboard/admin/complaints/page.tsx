'use client';

import { useState } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Filter,
  Search,
  User,
  ArrowUpRight,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { useToast } from '@/lib/toastContext';

interface ComplaintTicket {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED';
  submittedBy: string;
  assignedTo: string;
  createdAt: string;
  slaHours: number;
}

const INITIAL_TICKETS: ComplaintTicket[] = [
  {
    id: 'CMP-2026-001',
    title: 'Hostel Block B 3rd Floor Wi-Fi router disconnection',
    description: 'Wi-Fi connectivity has been dropping frequently since yesterday evening in rooms 301-315.',
    category: 'INTERNET',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    submittedBy: 'Anuraj Singh (CS2023-042)',
    assignedTo: 'Network Ops Team',
    createdAt: '22 Aug 2026, 10:30 AM',
    slaHours: 24,
  },
  {
    id: 'CMP-2026-002',
    title: 'Water dispenser cooling issue in Mechanical Block',
    description: 'The RO water dispenser on 1st floor is not cooling properly.',
    category: 'WATER',
    priority: 'MEDIUM',
    status: 'RESOLVED',
    submittedBy: 'Sneha Patel (ME2023-019)',
    assignedTo: 'Campus Maintenance',
    createdAt: '20 Aug 2026, 02:15 PM',
    slaHours: 48,
  },
  {
    id: 'CMP-2026-003',
    title: 'Lab 2 projector flickering during lectures',
    description: 'The HDMI connector on the central podium is loose, causing screen blankouts.',
    category: 'INFRASTRUCTURE',
    priority: 'HIGH',
    status: 'PENDING',
    submittedBy: 'Dr. Priya Sharma (CSE Dept)',
    assignedTo: 'AV Support Team',
    createdAt: '23 Aug 2026, 08:00 AM',
    slaHours: 12,
  },
];

export default function AdminComplaintsPage() {
  const { toast } = useToast();
  const [tickets, setTickets] = useState<ComplaintTicket[]>(INITIAL_TICKETS);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const filteredTickets = tickets.filter((t) => {
    const matchStatus = statusFilter === 'ALL' || t.status === statusFilter;
    const matchSearch =
      !search ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.submittedBy.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const handleUpdateStatus = (id: string, newStatus: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED') => {
    setTickets(tickets.map((t) => (t.id === id ? { ...t, status: newStatus } : t)));
    toast.success(`Ticket ${id} status changed to ${newStatus.replace('_', ' ')}`, 'Status Updated');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Campus Grievance Management Console</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 uppercase">
              Admin Ops
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Review student and faculty complaints, assign department technician teams, and monitor SLA compliance
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] text-slate-500 font-medium">Total Tickets</span>
          <p className="text-xl font-bold text-slate-900 mt-1">{tickets.length}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] text-slate-500 font-medium">Pending Review</span>
          <p className="text-xl font-bold text-amber-600 mt-1">
            {tickets.filter((t) => t.status === 'PENDING').length}
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] text-slate-500 font-medium">In Progress</span>
          <p className="text-xl font-bold text-blue-600 mt-1">
            {tickets.filter((t) => t.status === 'IN_PROGRESS').length}
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] text-slate-500 font-medium">Resolution Rate</span>
          <p className="text-xl font-bold text-emerald-600 mt-1">94.2%</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3.5 py-2 w-full sm:max-w-md shadow-2xs focus-within:border-blue-600 outline-none">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            placeholder="Search tickets by ID, title, student name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-xs text-slate-900 placeholder:text-slate-400 outline-none flex-1"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {['ALL', 'PENDING', 'IN_PROGRESS', 'RESOLVED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Tickets Table / List */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="divide-y divide-slate-100">
          {filteredTickets.map((ticket) => (
            <div key={ticket.id} className="p-5 hover:bg-slate-50/50 transition-colors space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {ticket.id}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase ${
                      ticket.status === 'RESOLVED'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                        : ticket.status === 'IN_PROGRESS'
                        ? 'bg-blue-100 text-blue-800 border-blue-200'
                        : 'bg-amber-100 text-amber-800 border-amber-200'
                    }`}
                  >
                    {ticket.status.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {ticket.category}
                  </span>
                </div>

                {/* Status action buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUpdateStatus(ticket.id, 'IN_PROGRESS')}
                    className="px-2.5 py-1 rounded-lg border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold cursor-pointer transition-colors"
                  >
                    Set In Progress
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(ticket.id, 'RESOLVED')}
                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer shadow-xs transition-colors flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Resolve
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">{ticket.title}</h3>
                <p className="text-xs text-slate-600 mt-1">{ticket.description}</p>
              </div>

              <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100/80">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-400" /> {ticket.submittedBy}
                  </span>
                  <span>•</span>
                  <span>Assigned: {ticket.assignedTo}</span>
                </div>
                <span>Logged: {ticket.createdAt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
