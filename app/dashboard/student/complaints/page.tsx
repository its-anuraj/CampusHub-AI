'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Building,
  Wifi,
  Droplets,
  Zap,
  HelpCircle,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { useToast } from '@/lib/toastContext';

interface ComplaintTicket {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED';
  createdAt: string;
  assignedTo: string;
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
    assignedTo: 'Campus Maintenance',
    createdAt: '20 Aug 2026, 02:15 PM',
    slaHours: 48,
  },
];

const CATEGORIES = [
  { id: 'INTERNET', label: 'Wi-Fi & Internet', icon: Wifi },
  { id: 'HOSTEL', label: 'Hostel & Room Maintenance', icon: Building },
  { id: 'WATER', label: 'Water & Sanitation', icon: Droplets },
  { id: 'ELECTRICITY', label: 'Electricity & Lighting', icon: Zap },
  { id: 'ACADEMICS', label: 'Academics & Labs', icon: FileText },
  { id: 'OTHER', label: 'Other Grievance', icon: HelpCircle },
];

export default function StudentComplaintsPage() {
  const { toast } = useToast();
  const [tickets, setTickets] = useState<ComplaintTicket[]>(INITIAL_TICKETS);
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('INTERNET');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('MEDIUM');

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.warning('Please fill in both title and description.');
      return;
    }

    const newTicket: ComplaintTicket = {
      id: `CMP-2026-${Math.floor(100 + Math.random() * 900)}`,
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      status: 'PENDING',
      assignedTo: 'Campus Central Helpdesk',
      createdAt: 'Just now',
      slaHours: priority === 'URGENT' ? 12 : priority === 'HIGH' ? 24 : 48,
    };

    setTickets([newTicket, ...tickets]);
    setTitle('');
    setDescription('');
    setShowModal(false);
    toast.success(`Ticket ${newTicket.id} submitted! Assigned to Helpdesk.`, 'Ticket Created');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'RESOLVED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'HIGH':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Student Grievance & Helpdesk</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 uppercase">
              SLA Tracked
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Submit campus maintenance issues, track resolution timelines, and receive verified admin updates
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" /> Raise Grievance Ticket
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] text-slate-500 font-medium">Total Raised</span>
          <p className="text-xl font-bold text-slate-900 mt-1">{tickets.length} Tickets</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] text-slate-500 font-medium">In Progress</span>
          <p className="text-xl font-bold text-blue-600 mt-1">
            {tickets.filter((t) => t.status === 'IN_PROGRESS').length} Active
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] text-slate-500 font-medium">Resolved</span>
          <p className="text-xl font-bold text-emerald-600 mt-1">
            {tickets.filter((t) => t.status === 'RESOLVED').length} Closed
          </p>
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-900">Your Grievance History</h2>

        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-slate-300 transition-all space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {ticket.id}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${getStatusBadge(ticket.status)}`}>
                  {ticket.status.replace('_', ' ')}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${getPriorityBadge(ticket.priority)}`}>
                  {ticket.priority} Priority
                </span>
              </div>
              <span className="text-[11px] text-slate-400">Created: {ticket.createdAt}</span>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900">{ticket.title}</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{ticket.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-slate-500">
              <div className="flex items-center gap-3">
                <span>
                  Category: <strong>{ticket.category}</strong>
                </span>
                <span>•</span>
                <span>
                  Assigned: <strong>{ticket.assignedTo}</strong>
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-blue-700 font-semibold">
                <Clock className="w-3.5 h-3.5" /> SLA Target: Within {ticket.slaHours} hours
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Grievance Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in"
          onClick={() => setShowModal(false)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Raise Student Grievance Ticket</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Issue Summary / Title</label>
                <input
                  type="text"
                  placeholder="e.g. Broken bench in Lecture Hall 102"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:border-blue-600 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white outline-none"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white outline-none"
                  >
                    <option value="LOW">Low (48h)</option>
                    <option value="MEDIUM">Medium (24h)</option>
                    <option value="HIGH">High (12h)</option>
                    <option value="URGENT">Urgent (Immediate)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Detailed Description & Location</label>
                <textarea
                  rows={4}
                  placeholder="Please specify room number, block, nature of breakdown, and any relevant details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:border-blue-600 outline-none resize-none"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
