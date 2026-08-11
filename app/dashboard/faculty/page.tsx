'use client';

import { useState, useEffect } from 'react';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { Users, Calendar, ClipboardList, CheckCircle2, Upload, Bell, Award, BarChart3, ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { formatTime } from '@/lib/utils';
import { facultyDashboardData, todaysClasses } from '@/lib/mockData';

const attendanceData = [
  { week: 'W1', CSE: 92, DBMS: 88, OS: 78, Networks: 95 },
  { week: 'W2', CSE: 85, DBMS: 90, OS: 82, Networks: 88 },
  { week: 'W3', CSE: 88, DBMS: 86, OS: 75, Networks: 92 },
  { week: 'W4', CSE: 90, DBMS: 84, OS: 80, Networks: 90 },
];

export default function FacultyDashboardPage() {
  const [user, setUser] = useState<any>(null);
  const data = facultyDashboardData;

  useEffect(() => {
    const u = localStorage.getItem('campushub_user');
    if (u) setUser(JSON.parse(u));
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Faculty Workspace, {user?.name || 'Professor'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">Department of Computer Science Engineering • Active Semester</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/faculty/attendance">
            <button className="px-3.5 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer">
              <CheckCircle2 className="w-3.5 h-3.5" /> Mark Class Attendance
            </button>
          </Link>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Assigned Students', value: data.totalStudents.toString(), icon: Users, sub: 'Across 3 course sections' },
          { label: 'Today Lectures', value: data.classesToday.toString(), icon: Calendar, sub: '2 completed, 2 remaining' },
          { label: 'Pending Grading', value: data.pendingGrading.toString(), icon: ClipboardList, sub: 'Assignments submitted' },
          { label: 'Avg Attendance', value: `${data.averageAttendance}%`, icon: CheckCircle2, sub: 'Above 75% target' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white border border-slate-200 rounded-2xl p-5 card-hover shadow-card">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-500">{stat.label}</span>
                <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-100 text-slate-600">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900 tracking-tight">{stat.value}</div>
              <p className="text-[11px] font-medium text-slate-500 mt-1.5">{stat.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Schedule & Quick Workflows */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Today&apos;s Assigned Classes</h3>
              <p className="text-xs text-slate-500 mt-0.5">Live timetable status</p>
            </div>
            <Link href="/dashboard/faculty/classes" className="text-xs font-semibold text-blue-600 hover:text-blue-700">Class List →</Link>
          </div>

          <div className="space-y-2.5">
            {todaysClasses.map((cls: any) => (
              <div key={cls.id} className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="text-left w-20 flex-shrink-0">
                    <p className="text-xs font-semibold text-slate-900">{formatTime(cls.startTime)}</p>
                    <p className="text-[10px] text-slate-400">{formatTime(cls.endTime)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-900">{cls.subject}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Hall {cls.room} • {cls.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {cls.status === 'UPCOMING' && (
                    <Link href="/dashboard/faculty/attendance">
                      <button className="px-2.5 py-1 rounded-md bg-blue-600 text-white text-[11px] font-semibold hover:bg-blue-700 transition-colors cursor-pointer">
                        Mark P/A
                      </button>
                    </Link>
                  )}
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${
                    cls.status === 'ONGOING' ? 'badge-info' :
                    cls.status === 'COMPLETED' ? 'badge-neutral' : 'badge-warning'
                  }`}>
                    {cls.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-card space-y-4">
          <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-3">Faculty Tools</h3>
          <div className="space-y-2">
            {[
              { label: 'Mark Attendance', href: '/dashboard/faculty/attendance', icon: CheckCircle2 },
              { label: 'Upload Course Materials', href: '/dashboard/faculty/notes', icon: Upload },
              { label: 'Post Class Announcement', href: '/dashboard/faculty/notices', icon: Bell },
              { label: 'Grade Submissions', href: '/dashboard/faculty/assignments', icon: Award },
              { label: 'Course Analytics', href: '/dashboard/faculty/analytics', icon: BarChart3 },
            ].map(item => {
              const Icon = item.icon;
              return (
                <Link key={item.label} href={item.href} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-blue-50/40 hover:border-blue-200 transition-all text-xs font-medium text-slate-800">
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-slate-500" />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Attendance Chart */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Subject Attendance Comparison</h3>
            <p className="text-xs text-slate-500 mt-0.5">Weekly student presence tracking</p>
          </div>
          <span className="text-xs font-medium text-slate-500">4-Week Range</span>
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={attendanceData} margin={{ top: 5, right: 10, bottom: 5, left: -25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} domain={[60, 100]} />
              <Tooltip contentStyle={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '11px' }} />
              <Line type="monotone" dataKey="CSE" stroke="#2563EB" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="DBMS" stroke="#16A34A" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="OS" stroke="#D97706" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
