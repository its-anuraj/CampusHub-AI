'use client';

import { useState } from 'react';
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
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: 'ACADEMIC' | 'FEES' | 'PLACEMENT' | 'ALERT' | 'COMMUNITY';
  time: string;
  read: boolean;
  link?: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
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
  },
  {
    id: 'n-4',
    title: 'Campus Weather Advisory: Heavy Showers',
    message: 'Evening laboratory practical sessions from 4:30 PM will transition to hybrid mode if needed.',
    category: 'ALERT',
    time: '5h ago',
    read: true
  },
  {
    id: 'n-5',
    title: 'HackNova 2026 Hackathon Registration',
    message: 'Over 180 students have registered for the 36-Hour National AI Hackathon. Claim your pass today.',
    category: 'COMMUNITY',
    time: '1d ago',
    read: true,
    link: '/dashboard/student/events'
  }
];

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState<string>('ALL');
  const [soundEnabled, setSoundEnabled] = useState(true);

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
      case 'ACADEMIC': return <BookOpen className="w-3.5 h-3.5 text-blue-500" />;
      case 'FEES': return <CreditCard className="w-3.5 h-3.5 text-emerald-500" />;
      case 'PLACEMENT': return <Briefcase className="w-3.5 h-3.5 text-purple-500" />;
      case 'ALERT': return <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />;
      default: return <Sparkles className="w-3.5 h-3.5 text-amber-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-card border-l border-border shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-border space-y-3 bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-foreground">Notification Center</h3>
                  <p className="text-xs text-muted-foreground">{unreadCount} unread announcements</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  title={soundEnabled ? "Mute notification sounds" : "Enable notification sounds"}
                  className="p-2 rounded-lg text-muted-foreground hover:bg-muted transition"
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-rose-500" />}
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-muted-foreground hover:bg-muted transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Actions & Filters */}
            <div className="flex items-center justify-between gap-2 pt-1 text-xs">
              <div className="flex items-center gap-1 overflow-x-auto">
                {['ALL', 'UNREAD', 'ACADEMIC', 'PLACEMENT', 'FEES'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={cn(
                      "px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition",
                      filter === f
                        ? "bg-blue-600 text-white shadow-xs"
                        : "text-muted-foreground hover:bg-muted"
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0}
                  className="p-1.5 rounded text-muted-foreground hover:text-foreground disabled:opacity-30"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-4 h-4" />
                </button>
                <button
                  onClick={clearAll}
                  disabled={notifications.length === 0}
                  className="p-1.5 rounded text-muted-foreground hover:text-rose-600 disabled:opacity-30"
                  title="Clear all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto divide-y divide-border/60">
            {filtered.length === 0 ? (
              <div className="p-12 text-center space-y-2">
                <Bell className="w-8 h-8 text-muted-foreground/40 mx-auto" />
                <p className="text-sm font-semibold text-foreground">You are all caught up!</p>
                <p className="text-xs text-muted-foreground">No notifications in this category right now.</p>
              </div>
            ) : (
              filtered.map((item) => (
                <div
                  key={item.id}
                  onClick={() => markItemAsRead(item.id)}
                  className={cn(
                    "p-4 transition-colors hover:bg-muted/40 cursor-pointer space-y-1.5 relative group",
                    !item.read && "bg-blue-500/5"
                  )}
                >
                  {!item.read && (
                    <span className="absolute left-1.5 top-5 w-1.5 h-1.5 rounded-full bg-blue-600" />
                  )}

                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded bg-muted">
                        {getCategoryIcon(item.category)}
                      </div>
                      <h4 className={cn("text-xs font-bold", !item.read ? "text-foreground" : "text-muted-foreground")}>
                        {item.title}
                      </h4>
                    </div>
                    <span className="text-[10px] text-muted-foreground shrink-0 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" /> {item.time}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed pl-6">
                    {item.message}
                  </p>

                  {item.link && (
                    <div className="pl-6 pt-1">
                      <Link
                        href={item.link}
                        onClick={onClose}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        View Details <ExternalLink className="w-3 h-3" />
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
