'use client';

import { useState, useEffect } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  BookOpen, ClipboardList, Bell, CheckCircle2, Calendar, Star, Sparkles, ArrowUpRight, Clock, Loader2, Trophy, Award, Flame, Zap, Check, Crown, Brain, ArrowRight, Bot
} from 'lucide-react';
import Link from 'next/link';
import { formatTime, cn } from '@/lib/utils';
import { useToast } from '@/lib/toastContext';

interface DashboardData {
  attendancePercentage: number;
  cgpa: number;
  backlogs: number;
  pendingAssignments: number;
  upcomingExams: number;
  unreadNotices: number;
  todaysClasses: any[];
  recentNotices: any[];
  attendanceChart: { month: string; percentage: number }[];
}

export default function StudentDashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = localStorage.getItem('campushub_user');
    if (u) setUser(JSON.parse(u));
  }, []);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const [noticesRes, assignmentsRes, attendanceRes] = await Promise.all([
          fetch('/api/notices?limit=3'),
          fetch('/api/assignments'),
          fetch('/api/attendance'),
        ]);

        const noticesData = noticesRes.ok ? await noticesRes.json() : { notices: [] };
        const assignmentsData = assignmentsRes.ok ? await assignmentsRes.json() : { assignments: [] };
        const attendanceData = attendanceRes.ok ? await attendanceRes.json() : { percentage: 0, chart: [] };

        const pending = (assignmentsData.assignments || []).filter((a: any) => a.status === 'PENDING').length;

        setData({
          attendancePercentage: attendanceData.percentage ?? 0,
          cgpa: attendanceData.cgpa ?? 0,
          backlogs: attendanceData.backlogs ?? 0,
          pendingAssignments: pending,
          upcomingExams: 0,
          unreadNotices: (noticesData.notices || []).length,
          todaysClasses: [],
          recentNotices: noticesData.notices || [],
          attendanceChart: attendanceData.chart || [],
        });
      } catch {
        setData({
          attendancePercentage: 0, cgpa: 0, backlogs: 0, pendingAssignments: 0,
          upcomingExams: 0, unreadNotices: 0, todaysClasses: [], recentNotices: [], attendanceChart: [],
        });
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {greeting}, {user?.name?.split(' ')[0] || 'Student'}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase flex items-center gap-1">
              <Check className="w-3 h-3" /> {user?.studentProfile?.verificationStatus || 'VERIFIED'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
            <span>{user?.studentProfile?.department || 'CSE'}</span> • 
            <span>Year {user?.studentProfile?.year || 3} (Sem {user?.studentProfile?.semester || 5})</span> • 
            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-mono font-bold">
              Section {user?.studentProfile?.section || 'A'}
            </span> •
            <span className="text-slate-400">Mentor: {user?.studentProfile?.classAdvisor || 'Dr. Priya Sharma'}</span>
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 flex items-center gap-2 text-xs font-medium text-slate-600 shadow-xs">
          <Calendar className="w-3.5 h-3.5 text-blue-600" />
          <span>{new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
        </div>
      </div>

      {/* AI Student Psychologist & Mind Companion Banner (Coming Soon) */}
      <div className="rounded-2xl border-2 border-amber-300 bg-gradient-to-r from-amber-500/10 via-sky-500/10 to-indigo-500/10 p-5 shadow-lg shadow-amber-500/5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md shadow-amber-500/30 ring-2 ring-amber-400/50 animate-pulse">
                <Sparkles className="w-3.5 h-3.5 fill-slate-950" /> ✨ COMING SOON
              </span>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-100 px-2.5 py-0.5 rounded-md">
                1:1 Talking Session • Bi-Weekly (5-10 Min)
              </span>
            </div>
            <h2 className="text-base md:text-lg font-bold text-slate-900 flex items-center gap-2">
              <Brain className="w-5 h-5 text-indigo-600" /> AI Student Psychologist & Mind Companion
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
              Confidential check-in session for loneliness, depression, or stress over low marks. Generates private guidance for your mentor so they can reach out personally without putting you under pressure.
            </p>
          </div>
          <Link
            href="/dashboard/student/psychologist"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all hover:scale-[1.02] shrink-0"
          >
            Explore AI Psychologist <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="bg-white border border-blue-100 rounded-xl p-4 shadow-card flex items-start gap-3.5">
        <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">AI Campus Insights</h2>
            <span className="bg-amber-100 text-amber-900 border-2 border-amber-500 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-xs">
              ✨ Coming Soon (Beta)
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            {data && data.attendancePercentage > 0
              ? <>Attendance is at <span className="font-semibold text-slate-900">{data.attendancePercentage.toFixed(1)}%</span>.{data.pendingAssignments > 0 && <> You have <span className="font-semibold text-blue-700">{data.pendingAssignments} pending assignment{data.pendingAssignments !== 1 ? 's' : ''}</span> to submit.</>}</>
              : 'No data yet. Add attendance and assignments to see AI insights here.'}
          </p>
        </div>
        <Link href="/dashboard/student/ai-chat" className="text-xs font-semibold text-blue-600 hover:text-blue-700 whitespace-nowrap flex items-center gap-1">
          Open AI <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Attendance Rate',
            value: data ? `${data.attendancePercentage.toFixed(1)}%` : '—',
            sub: data && data.attendancePercentage >= 75 ? 'Above 75% threshold' : data && data.attendancePercentage > 0 ? 'Below 75% — needs attention' : 'No data yet',
            subColor: data && data.attendancePercentage >= 75 ? 'text-emerald-600' : data && data.attendancePercentage > 0 ? 'text-red-600' : 'text-slate-400',
            href: '/dashboard/student/attendance', icon: CheckCircle2,
          },
          {
            label: 'Cumulative GPA',
            value: data && data.cgpa > 0 ? data.cgpa.toFixed(2) : '—',
            sub: data && data.cgpa > 0 ? 'Live from academic records' : 'No records yet',
            subColor: 'text-blue-600', href: '/dashboard/student/results', icon: Star,
          },
          {
            label: 'Pending Assignments',
            value: data ? data.pendingAssignments.toString() : '0',
            sub: data && data.pendingAssignments > 0 ? 'Check assignments page' : 'All caught up!',
            subColor: data && data.pendingAssignments > 0 ? 'text-amber-600' : 'text-emerald-600',
            href: '/dashboard/student/assignments', icon: ClipboardList,
          },
          {
            label: 'Upcoming Exams',
            value: '0',
            sub: 'Check timetable for schedule',
            subColor: 'text-slate-500', href: '/dashboard/student/timetable', icon: BookOpen,
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Link href={stat.href} key={stat.label}>
              <div className="bg-white border border-slate-200 rounded-2xl p-5 card-hover shadow-card">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-slate-500">{stat.label}</span>
                  <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-100 text-slate-600">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-slate-900 tracking-tight">{stat.value}</div>
                <p className={`text-[11px] font-medium mt-1.5 ${stat.subColor}`}>{stat.sub}</p>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Today&apos;s Lecture Schedule</h3>
              <p className="text-xs text-slate-500 mt-0.5">Synchronized from timetable</p>
            </div>
            <Link href="/dashboard/student/timetable" className="text-xs font-semibold text-blue-600 hover:text-blue-700">Full Timetable →</Link>
          </div>
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Clock className="w-8 h-8 text-slate-300 mb-2" />
            <p className="text-sm font-medium text-slate-500">No classes scheduled for today</p>
            <p className="text-xs text-slate-400 mt-0.5">Timetable will appear here once set up</p>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-900">Attendance History</h3>
              <span className="text-[11px] font-medium text-slate-500">Last 6 Months</span>
            </div>
            {data && data.attendanceChart.length > 0 ? (
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.attendanceChart} margin={{ top: 5, right: 5, bottom: 5, left: -25 }}>
                    <defs>
                      <linearGradient id="attendGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} domain={[60, 100]} />
                    <Tooltip contentStyle={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '11px' }} />
                    <Area type="monotone" dataKey="percentage" stroke="#2563EB" strokeWidth={2} fill="url(#attendGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-40 flex items-center justify-center">
                <div className="text-center">
                  <CheckCircle2 className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                  <p className="text-xs text-slate-400">No attendance data yet</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-card">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Quick Navigation</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Submit Work', href: '/dashboard/student/assignments' },
                { label: 'View Notices', href: '/dashboard/student/notices' },
                { label: 'Placements', href: '/dashboard/student/placement' },
                { label: 'Pay Fees', href: '/dashboard/student/fees' },
              ].map(item => (
                <Link key={item.label} href={item.href} className="p-2.5 rounded-lg border border-slate-200/80 bg-slate-50/50 hover:bg-blue-50/50 hover:border-blue-200 hover:text-blue-700 transition-all text-xs font-medium text-slate-700 text-center">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Gamification: Student Quests & Campus Achievement Badges */}
      <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-yellow-300">
              <Crown className="w-3.5 h-3.5" /> LEVEL 4 SCHOLAR
            </div>
            <h2 className="text-xl font-bold tracking-tight">Campus Quest & Achievement Badges</h2>
            <p className="text-xs text-white/70">Complete daily learning activities, maintain attendance, and earn semester XP points</p>
          </div>

          <div className="text-right sm:border-l sm:border-white/10 sm:pl-6">
            <span className="text-[10px] font-bold text-white/60 uppercase tracking-wider block">Total Academic XP</span>
            <div className="text-2xl font-bold font-mono text-yellow-400 flex items-center gap-1">
              <Flame className="w-5 h-5 text-orange-400 fill-orange-400" /> 1,450 XP
            </div>
            <span className="text-[10px] text-white/60">50 XP to Level 5</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold text-white/80">
            <span>Semester Level 4 Progress</span>
            <span className="font-mono text-yellow-300">92%</span>
          </div>
          <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden flex">
            <div className="bg-gradient-to-r from-yellow-400 to-amber-500 h-full rounded-full w-[92%]" />
          </div>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { name: 'Attendance Sentinel', desc: '>90% Monthly Rate', icon: '🛡️', unlocked: true },
            { name: 'Early Bird Solver', desc: '5 Tasks Early Turn-in', icon: '⚡', unlocked: true },
            { name: 'Bibliophile', desc: '5 Digital E-Books Read', icon: '📚', unlocked: true },
            { name: 'Grandmaster Contributor', desc: 'Answer 10 Forum Queries', icon: '👑', unlocked: false },
          ].map((badge) => (
            <div
              key={badge.name}
              className={cn(
                "p-3.5 rounded-2xl border transition-all text-center space-y-1.5",
                badge.unlocked
                  ? "bg-white/10 border-white/20 hover:bg-white/15"
                  : "bg-white/5 border-white/5 opacity-50 grayscale"
              )}
            >
              <span className="text-2xl block">{badge.icon}</span>
              <p className="text-xs font-bold text-white">{badge.name}</p>
              <p className="text-[10px] text-white/70">{badge.desc}</p>
              <span className={cn(
                "text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block mt-1",
                badge.unlocked ? "bg-yellow-400/20 text-yellow-300" : "bg-white/10 text-white/40"
              )}>
                {badge.unlocked ? 'Unlocked' : 'Locked'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-600" /> Recent Campus Notices
            </h3>
            <Link href="/dashboard/student/notices" className="text-xs font-semibold text-blue-600 hover:text-blue-700">View All →</Link>
          </div>
          <div className="space-y-3">
            {data && data.recentNotices.length > 0 ? data.recentNotices.map((notice: any) => (
              <div key={notice.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50/40 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-semibold text-slate-900">{notice.title}</h4>
                  {notice.isPinned && <span className="text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">Pinned</span>}
                </div>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{notice.content}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">{notice.category}</span>
                  <span className="text-[10px] text-slate-400">{new Date(notice.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                </div>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Bell className="w-7 h-7 text-slate-200 mb-2" />
                <p className="text-xs text-slate-400">No notices posted yet</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-amber-600" /> Pending Assignments
            </h3>
            <Link href="/dashboard/student/assignments" className="text-xs font-semibold text-blue-600 hover:text-blue-700">View All →</Link>
          </div>
          {data && data.pendingAssignments > 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <ClipboardList className="w-7 h-7 text-amber-400 mb-2" />
              <p className="text-sm font-semibold text-slate-700">{data.pendingAssignments} pending assignment{data.pendingAssignments !== 1 ? 's' : ''}</p>
              <Link href="/dashboard/student/assignments" className="text-xs text-blue-600 font-medium mt-1 hover:underline">View all assignments →</Link>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <CheckCircle2 className="w-7 h-7 text-emerald-300 mb-2" />
              <p className="text-xs text-slate-400">No pending assignments</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
