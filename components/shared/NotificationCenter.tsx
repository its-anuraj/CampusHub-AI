'use client';

import { useState, useEffect } from 'react';
import {
  Bell,
  CheckCheck,
  Trash2,
  Volume2,
  VolumeX,
  ExternalLink,
  BookOpen,
  CreditCard,
  Briefcase,
  AlertTriangle,
  Sparkles,
  X,
  Clock,
  UserCheck,
  Building2,
  Award,
  ShieldCheck,
  FileCheck,
  ArrowUpRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: 'APPROVALS' | 'ESCALATIONS' | 'COMPLIANCE' | 'SECURITY' | 'ACADEMIC' | 'FEES' | 'PLACEMENT';
  department?: string;
  time: string;
  read: boolean;
  link?: string;
  actionText?: string;
  priority?: 'HIGH' | 'MEDIUM' | 'URGENT';
}

// Director & Executive Management Dedicated Notifications
const DIRECTOR_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'dir-1',
    title: 'Faculty Account Creation Approval: Dr. Rajiv Sen',
    department: 'CSE Department Admin',
    message: 'New Faculty appointment application submitted for Associate Professor (AI & DS). Verification completed by Registrar; awaiting Director authorization.',
    category: 'APPROVALS',
    priority: 'URGENT',
    time: '12m ago',
    read: false,
    link: '/dashboard/admin/users',
    actionText: 'Review & Approve Account'
  },
  {
    id: 'dir-2',
    title: 'Staff Role Elevation: Assistant TPO Officer',
    department: 'Training & Placement Cell',
    message: 'TPO Admin requested creation of new Placement Officer profile with corporate recruiter clearance. Director authorization token required.',
    category: 'APPROVALS',
    priority: 'HIGH',
    time: '35m ago',
    read: false,
    link: '/dashboard/admin/users',
    actionText: 'Authorize Staff Account'
  },
  {
    id: 'dir-3',
    title: 'CAPEX Budget Escalation: ₹18.5L (GPU Workstations)',
    department: 'Finance & Accounts Desk',
    message: 'Proposal for 4x NVIDIA AI Compute Nodes for Advanced Research Fab exceeds HOD spending limit (₹5L). Submitted for Director financial sanction.',
    category: 'ESCALATIONS',
    priority: 'URGENT',
    time: '1h ago',
    read: false,
    link: '/dashboard/admin/budget',
    actionText: 'Inspect & Sanction Budget'
  },
  {
    id: 'dir-4',
    title: 'Corporate MoU Authorization: Microsoft Hiring Hub',
    department: 'Placement & Industry Relations',
    message: 'Head of TPO finalized the 2026-2029 Campus Placement Partnership Agreement. Executive signature from Director Office requested.',
    category: 'ESCALATIONS',
    priority: 'HIGH',
    time: '3h ago',
    read: false,
    link: '/dashboard/admin/placements',
    actionText: 'Review Partnership Agreement'
  },
  {
    id: 'dir-5',
    title: 'NAAC SSR Institutional Dossier Consolidated',
    department: 'IQAC Accreditation Cell',
    message: 'Consolidated criterion metrics compiled across all 8 departments for 2025-26 cycle. Executive validation required before NAAC portal upload.',
    category: 'COMPLIANCE',
    priority: 'MEDIUM',
    time: '5h ago',
    read: true,
    link: '/dashboard/admin/rankings',
    actionText: 'Open SSR Dossier'
  },
  {
    id: 'dir-6',
    title: 'Hostel Substation Maintenance Emergency Sanction',
    department: 'Hostel & Facilities Desk',
    message: 'Emergency tender quote (₹3.8L) for 250kVA transformer replacement escalated by Chief Warden before semester examinations.',
    category: 'ESCALATIONS',
    priority: 'HIGH',
    time: '1d ago',
    read: true,
    link: '/dashboard/admin/complaints',
    actionText: 'Review Emergency Tender'
  }
];

// General / Student / Faculty default notifications
const GENERAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n-1',
    title: 'Mid-Semester Exam Timetable Released',
    message: 'Academic controller has published the revised seating matrix and exam dates for B.Tech Semester 5.',
    category: 'ACADEMIC',
    time: '15m ago',
    read: false,
    link: '/dashboard/student/timetable'
  },
  {
    id: 'n-2',
    title: 'Google SDE Campus Drive Application Open',
    message: 'Eligible 3rd/4th year CSE & IT students can now submit their resume for the ₹32 LPA package opening.',
    category: 'PLACEMENT',
    time: '1h ago',
    read: false,
    link: '/dashboard/student/placement'
  },
  {
    id: 'n-3',
    title: 'Upcoming Fee Installment Due in 4 Days',
    message: 'Semester tuition fee installment of ₹45,000 is due on 30th August 2026. Avoid late registration fine.',
    category: 'FEES',
    time: '3h ago',
    read: false,
    link: '/dashboard/student/fees'
  }
];

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  user?: any;
}

export default function NotificationCenter({ isOpen, onClose, user }: NotificationCenterProps) {
  const isDirectorOrAdmin = user?.role === 'ADMIN' || !user?.role;
  
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    isDirectorOrAdmin ? DIRECTOR_NOTIFICATIONS : GENERAL_NOTIFICATIONS
  );
  const [filter, setFilter] = useState<string>('ALL');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Sync notifications when user changes
  useEffect(() => {
    setNotifications(isDirectorOrAdmin ? DIRECTOR_NOTIFICATIONS : GENERAL_NOTIFICATIONS);
  }, [isDirectorOrAdmin]);

  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markItemAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const filtered = notifications.filter(n => {
    if (filter === 'ALL') return true;
    if (filter === 'UNREAD') return !n.read;
    return n.category === filter;
  });

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'APPROVALS': return <UserCheck className="w-4 h-4 text-blue-600" />;
      case 'ESCALATIONS': return <Building2 className="w-4 h-4 text-emerald-600" />;
      case 'COMPLIANCE': return <Award className="w-4 h-4 text-purple-600" />;
      case 'SECURITY': return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      case 'ACADEMIC': return <BookOpen className="w-4 h-4 text-blue-500" />;
      case 'FEES': return <CreditCard className="w-4 h-4 text-emerald-500" />;
      case 'PLACEMENT': return <Briefcase className="w-4 h-4 text-purple-500" />;
      default: return <Sparkles className="w-4 h-4 text-amber-500" />;
    }
  };

  const filterTabs = isDirectorOrAdmin
    ? [
        { id: 'ALL', label: 'All Items' },
        { id: 'UNREAD', label: `Unread (${unreadCount})` },
        { id: 'APPROVALS', label: 'Account Approvals' },
        { id: 'ESCALATIONS', label: 'Dept Escalations' },
        { id: 'COMPLIANCE', label: 'Accreditation' }
      ]
    : [
        { id: 'ALL', label: 'All' },
        { id: 'UNREAD', label: `Unread (${unreadCount})` },
        { id: 'ACADEMIC', label: 'Academic' },
        { id: 'PLACEMENT', label: 'Placement' },
        { id: 'FEES', label: 'Fees' }
      ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md sm:max-w-lg bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 space-y-3 bg-slate-50/80 dark:bg-slate-800/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {isDirectorOrAdmin ? 'Director Executive Feed & Approvals' : 'Notification Center'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isDirectorOrAdmin
                      ? `${unreadCount} pending approvals & department escalations`
                      : `${unreadCount} unread announcements`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  title={soundEnabled ? "Mute notification sounds" : "Enable notification sounds"}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-rose-500" />}
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Actions & Filters */}
            <div className="flex items-center justify-between gap-2 pt-1 text-xs">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
                {filterTabs.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setFilter(t.id)}
                    className={cn(
                      "px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition cursor-pointer text-xs",
                      filter === t.id
                        ? "bg-blue-600 text-white shadow-xs"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800"
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0}
                  className="p-1.5 rounded text-slate-500 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 cursor-pointer"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-4 h-4" />
                </button>
                <button
                  onClick={clearAll}
                  disabled={notifications.length === 0}
                  className="p-1.5 rounded text-slate-500 hover:text-rose-600 disabled:opacity-30 cursor-pointer"
                  title="Clear all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.length === 0 ? (
              <div className="p-12 text-center space-y-2">
                <Bell className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {isDirectorOrAdmin ? 'No Pending Approvals' : 'You are all caught up!'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isDirectorOrAdmin
                    ? 'All department escalations and account requests have been addressed.'
                    : 'No notifications in this category right now.'}
                </p>
              </div>
            ) : (
              filtered.map((item) => (
                <div
                  key={item.id}
                  onClick={() => markItemAsRead(item.id)}
                  className={cn(
                    "p-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer space-y-2 relative group",
                    !item.read && "bg-blue-50/40 dark:bg-blue-950/20"
                  )}
                >
                  {!item.read && (
                    <span className="absolute left-1.5 top-5 w-1.5 h-1.5 rounded-full bg-blue-600" />
                  )}

                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0">
                        {getCategoryIcon(item.category)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className={cn("text-xs font-bold leading-tight", !item.read ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400")}>
                            {item.title}
                          </h4>
                          {item.priority === 'URGENT' && (
                            <span className="px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 font-bold text-[9px] uppercase tracking-wider">
                              Action Required
                            </span>
                          )}
                        </div>
                        {item.department && (
                          <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400">
                            From: {item.department}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" /> {item.time}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-8">
                    {item.message}
                  </p>

                  {item.link && (
                    <div className="pl-8 pt-1 flex items-center justify-between">
                      <Link
                        href={item.link}
                        onClick={onClose}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold shadow-xs transition cursor-pointer"
                      >
                        {item.actionText || 'View Details'} <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
