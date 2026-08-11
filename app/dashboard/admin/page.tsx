'use client';

import { useState, useEffect } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import {
  Users, DollarSign, AlertTriangle, UserCheck, Briefcase, Activity,
  ArrowUpRight, GraduationCap, Building2, Bell, Settings, Plus, Download, Loader2
} from 'lucide-react';
import Link from 'next/link';
import { adminDashboardData } from '@/lib/mockData';

export default function AdminDashboardPage() {
  const [user, setUser] = useState<any>(null);
  const data = adminDashboardData;

  useEffect(() => {
    const u = localStorage.getItem('campushub_user');
    if (u) setUser(JSON.parse(u));
  }, []);

  const stats = [
    { label: 'Total Enrolled Students', value: data.totalStudents.toLocaleString(), icon: GraduationCap, sub: '+120 new this term', href: '/dashboard/admin/users' },
    { label: 'Active Faculty Members', value: data.totalFaculty.toString(), icon: Users, sub: '8 departments', href: '/dashboard/admin/users' },
    { label: 'Fee Collection (Aug)', value: '₹85.0L', icon: DollarSign, sub: '82% of target collected', href: '/dashboard/admin/fees' },
    { label: 'Today Attendance Rate', value: `${data.attendanceToday}%`, icon: UserCheck, sub: 'Campus wide', href: '/dashboard/admin/analytics' },
    { label: 'Pending Helpdesk Tickets', value: data.activeComplaints.toString(), icon: AlertTriangle, sub: '3 high priority', href: '/dashboard/admin/complaints' },
    { label: 'Students Placed', value: data.placedStudents.toString(), icon: Briefcase, sub: '78% placement rate', href: '/dashboard/admin/placements' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Admin Control Center</h1>
          <p className="text-xs text-slate-500 mt-1">Institutional metrics, user management, and automated campus logs</p>
        </div>
        <div className="flex gap-2">
          <button className="px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer">
            <Download className="w-3.5 h-3.5 text-slate-500" /> Export System Report
          </button>
          <button className="px-3.5 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer">
            <Plus className="w-3.5 h-3.5" /> Provision User
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => {
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
                <p className="text-[11px] font-medium text-slate-500 mt-1.5">{stat.sub}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Enrollment Trend */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Student Enrollment Trend</h3>
              <p className="text-xs text-slate-500 mt-0.5">Yearly expansion metrics (2022–2026)</p>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">+12% YoY</span>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.enrollmentData} margin={{ top: 10, right: 10, bottom: 5, left: -20 }}>
                <defs>
                  <linearGradient id="enrollGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '11px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }} />
                <Area type="monotone" dataKey="students" stroke="#2563EB" strokeWidth={2} fill="url(#enrollGrad)" dot={{ fill: '#2563EB', r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Breakdown */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-card space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-semibold text-slate-900">Department Share</h3>
            <p className="text-xs text-slate-500 mt-0.5">Enrolled student distribution</p>
          </div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.departmentData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="students" strokeWidth={0}>
                  {data.departmentData.map((entry: any, i: number) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 pt-2">
            {data.departmentData.slice(0, 4).map((dept: any, i: number) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: dept.color }} />
                  <span className="text-slate-600 font-medium">{dept.name}</span>
                </div>
                <span className="font-semibold text-slate-900">{dept.students}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Log & Admin Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600" /> Recent System Activity
            </h3>
            <Link href="/dashboard/admin/logs" className="text-xs font-semibold text-blue-600 hover:text-blue-700">Audit Logs →</Link>
          </div>
          <div className="space-y-2.5">
            {data.recentActivity.map((act: any) => (
              <div key={act.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50/40 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <span className={`w-2 h-2 rounded-full ${
                    act.type === 'SUCCESS' ? 'bg-emerald-600' :
                    act.type === 'WARNING' ? 'bg-amber-600' : 'bg-blue-600'
                  }`} />
                  <span className="text-slate-900 font-medium">{act.action}</span>
                </div>
                <span className="text-slate-400 text-[11px]">{act.user}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-card">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Admin Actions</h3>
          <div className="space-y-2">
            {[
              { label: 'User Directory', href: '/dashboard/admin/users', icon: Users },
              { label: 'Publish Campus Notice', href: '/dashboard/admin/notices', icon: Bell },
              { label: 'Manage Departments', href: '/dashboard/admin/departments', icon: Building2 },
              { label: 'Placement Drives', href: '/dashboard/admin/placements', icon: Briefcase },
              { label: 'System Configuration', href: '/dashboard/admin/settings', icon: Settings },
            ].map(item => {
              const Icon = item.icon;
              return (
                <Link key={item.label} href={item.href} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-blue-50/40 hover:border-blue-200 transition-all text-xs font-medium text-slate-800">
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-slate-500" />
                    <span>{item.label}</span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
