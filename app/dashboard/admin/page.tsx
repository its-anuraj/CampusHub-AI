'use client';

import { useState, useEffect } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import {
  Users, DollarSign, AlertTriangle, UserCheck, Briefcase, Activity,
  ArrowUpRight, GraduationCap, Building2, Bell, Settings, Plus, Download, Loader2,
  BookOpen, BookMarked, Calendar, ShieldCheck, Sparkles, BedDouble, HardDrive, Award
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

  const deptRole = user?.adminProfile?.departmentRole || 'DIRECTOR';

  // Dynamic Dashboard Configurations based on Department Role
  const getDashboardConfig = () => {
    switch (deptRole) {
      case 'PLACEMENT_CELL':
        return {
          title: 'Training & Placement Cell (TPO) Desk',
          subtitle: 'Corporate drives, student resumes, placement eligibility, and company recruitment statistics',
          badge: 'Placement Desk',
          stats: [
            { label: 'Students Placed', value: '312', icon: Briefcase, sub: '78.4% placement rate', href: '/dashboard/admin/placements' },
            { label: 'Active Placement Drives', value: '14', icon: Building2, sub: 'TCS, Infosys, Amazon, etc.', href: '/dashboard/admin/placements' },
            { label: 'Average Package (CTC)', value: '₹6.8 LPA', icon: DollarSign, sub: 'Highest: ₹28.5 LPA', href: '/dashboard/admin/placements' },
            { label: 'AI Resumes Verified', value: '420', icon: GraduationCap, sub: '92% completed', href: '/dashboard/student/resume-builder' },
            { label: 'Eligible Final Year Students', value: '450', icon: Users, sub: 'Across 8 departments', href: '/dashboard/admin/users' },
            { label: 'Placement Inquiries', value: '5', icon: AlertTriangle, sub: '1 urgent recruiter request', href: '/dashboard/admin/complaints' },
          ],
          shortcuts: [
            { label: 'Campus Placement Drives', href: '/dashboard/admin/placements', icon: Briefcase },
            { label: 'AI Resume Builder Desk', href: '/dashboard/student/resume-builder', icon: Sparkles },
            { label: 'Eligibility Courses', href: '/dashboard/admin/courses', icon: BookOpen },
            { label: 'Student Directory', href: '/dashboard/admin/users', icon: Users },
            { label: 'Publish Placement Notice', href: '/dashboard/admin/notices', icon: Bell },
          ],
        };
      case 'FEES_ACCOUNTS':
        return {
          title: 'Finance & Accounts / Fees Desk',
          subtitle: 'Tuition collections, student fee ledgers, department budgets, and institutional disbursements',
          badge: 'Finance Desk',
          stats: [
            { label: 'Fee Collection (Aug)', value: '₹85.0L', icon: DollarSign, sub: '82% of target collected', href: '/dashboard/admin/fees' },
            { label: 'Outstanding Dues', value: '₹14.2L', icon: AlertTriangle, sub: '18 students pending', href: '/dashboard/admin/fees' },
            { label: 'Department Budgets', value: '₹1.45 Cr', icon: Building2, sub: 'Allocated across 8 depts', href: '/dashboard/admin/budget' },
            { label: 'Active Scholarships', value: '₹18.5L', icon: Award, sub: '42 recipients', href: '/dashboard/admin/scholarships' },
            { label: 'Paid Receipts Generated', value: '1,340', icon: ShieldCheck, sub: 'Verified digital receipts', href: '/dashboard/admin/fees' },
            { label: 'Fee Inquiries & Tickets', value: '4', icon: AlertTriangle, sub: 'Pending investigation', href: '/dashboard/admin/complaints' },
          ],
          shortcuts: [
            { label: 'Fee Operations & Ledger', href: '/dashboard/admin/fees', icon: DollarSign },
            { label: 'Department Budgets', href: '/dashboard/admin/budget', icon: Building2 },
            { label: 'Scholarships Desk', href: '/dashboard/admin/scholarships', icon: Award },
            { label: 'Student Directory', href: '/dashboard/admin/users', icon: Users },
            { label: 'Publish Financial Notice', href: '/dashboard/admin/notices', icon: Bell },
          ],
        };
      case 'LIBRARY':
        return {
          title: 'Library & Digital Catalog Desk',
          subtitle: 'Book circulation, digital repository, RFID inventory, and academic journal subscriptions',
          badge: 'Library Desk',
          stats: [
            { label: 'Total Catalog Books', value: '12,450', icon: BookMarked, sub: 'Physical + digital copies', href: '/dashboard/student/library' },
            { label: 'Active Issued Books', value: '840', icon: BookOpen, sub: 'Circulation rate 88%', href: '/dashboard/student/library' },
            { label: 'Overdue Returns', value: '28', icon: AlertTriangle, sub: 'Automatic fine reminders sent', href: '/dashboard/student/library' },
            { label: 'Digital Papers & Journals', value: '1,220', icon: GraduationCap, sub: 'IEEE, Springer subscriptions', href: '/dashboard/student/library' },
            { label: 'Asset & Hardware Items', value: '185', icon: HardDrive, sub: 'RFID scanners, terminals', href: '/dashboard/admin/inventory' },
            { label: 'Library Helpdesk', value: '3', icon: AlertTriangle, sub: 'Book requests', href: '/dashboard/admin/complaints' },
          ],
          shortcuts: [
            { label: 'Book Catalog & Issues', href: '/dashboard/student/library', icon: BookMarked },
            { label: 'Hardware Inventory', href: '/dashboard/admin/inventory', icon: HardDrive },
            { label: 'Academic Courses', href: '/dashboard/admin/courses', icon: BookOpen },
            { label: 'Helpdesk Inquiries', href: '/dashboard/admin/complaints', icon: AlertTriangle },
            { label: 'Library Notices', href: '/dashboard/admin/notices', icon: Bell },
          ],
        };
      case 'EVENT_MANAGER':
        return {
          title: 'Campus Events & Cultural Affairs Desk',
          subtitle: 'Hackathons, symposiums, auditorium schedules, and student event participation',
          badge: 'Events Desk',
          stats: [
            { label: 'Upcoming Events', value: '6', icon: Calendar, sub: 'HackNova, AI Workshop, Cultural', href: '/dashboard/student/events' },
            { label: 'Student Registrations', value: '434', icon: Users, sub: 'Across 6 live events', href: '/dashboard/student/events' },
            { label: 'Auditorium Booking', value: '92%', icon: Building2, sub: 'Auditorium 1 & Seminar Hall', href: '/dashboard/student/events' },
            { label: 'Live Hackathons', value: '2', icon: Sparkles, sub: 'National 36-hr AI Hackathon', href: '/dashboard/student/events' },
            { label: 'Clubs Collaborating', value: '14', icon: Users, sub: 'GDG, ACM, Robotics', href: '/dashboard/student/clubs' },
            { label: 'Event Helpdesk Tickets', value: '2', icon: AlertTriangle, sub: 'Pass queries', href: '/dashboard/admin/complaints' },
          ],
          shortcuts: [
            { label: 'Campus Events & Hackathons', href: '/dashboard/student/events', icon: Calendar },
            { label: 'Faculty Symposiums', href: '/dashboard/faculty/events', icon: Calendar },
            { label: 'Clubs Collaboration', href: '/dashboard/student/clubs', icon: Users },
            { label: 'Event Helpdesk', href: '/dashboard/admin/complaints', icon: AlertTriangle },
            { label: 'Broadcast Event Notice', href: '/dashboard/admin/notices', icon: Bell },
          ],
        };
      case 'CLUB_MANAGER':
        return {
          title: 'Student Clubs & Societies Desk',
          subtitle: 'Student societies, technical chapters, community forums, and club funding',
          badge: 'Clubs Desk',
          stats: [
            { label: 'Active Clubs & Societies', value: '18', icon: Users, sub: 'Robotics, GDG, Literary, Arts', href: '/dashboard/student/clubs' },
            { label: 'Total Club Members', value: '860', icon: GraduationCap, sub: 'Student registrations', href: '/dashboard/student/clubs' },
            { label: 'Weekly Club Meetups', value: '12', icon: Calendar, sub: 'Coding camps & design jams', href: '/dashboard/student/events' },
            { label: 'Forum Discussions', value: '142', icon: Activity, sub: 'Active community posts', href: '/dashboard/student/discussion' },
            { label: 'Club Funding Disbursed', value: '₹3.2L', icon: DollarSign, sub: 'Approved club budgets', href: '/dashboard/student/clubs' },
            { label: 'Club Grievances', value: '1', icon: AlertTriangle, sub: 'Venue allotment query', href: '/dashboard/admin/complaints' },
          ],
          shortcuts: [
            { label: 'Clubs & Societies Hub', href: '/dashboard/student/clubs', icon: Users },
            { label: 'Campus Discussion Forum', href: '/dashboard/student/discussion', icon: Activity },
            { label: 'Club Events & Meetups', href: '/dashboard/student/events', icon: Calendar },
            { label: 'Grievance Desk', href: '/dashboard/admin/complaints', icon: AlertTriangle },
            { label: 'Broadcast Club Notice', href: '/dashboard/admin/notices', icon: Bell },
          ],
        };
      case 'ACADEMIC_ADMIN':
        return {
          title: 'Academic Affairs & Governance Desk',
          subtitle: 'Master course curricula, departments, semester progression, and faculty workload',
          badge: 'Academic Desk',
          stats: [
            { label: 'Master Courses', value: '48', icon: BookOpen, sub: 'Across 8 departments', href: '/dashboard/admin/courses' },
            { label: 'Semester Progression', value: 'Ready', icon: Sparkles, sub: 'Automated credit audit', href: '/dashboard/admin/promotion' },
            { label: 'Academic Departments', value: '8', icon: Building2, sub: 'CSE, AIML, IT, ECE, MECH...', href: '/dashboard/admin/departments' },
            { label: 'Faculty Leaves Pending', value: '3', icon: Calendar, sub: 'Awaiting leave review', href: '/dashboard/admin/leaves' },
            { label: 'Total Enrolled Students', value: data.totalStudents.toLocaleString(), icon: GraduationCap, sub: '+120 new this term', href: '/dashboard/admin/users' },
            { label: 'Academic Tickets', value: '6', icon: AlertTriangle, sub: 'Course registration queries', href: '/dashboard/admin/complaints' },
          ],
          shortcuts: [
            { label: 'Master Courses', href: '/dashboard/admin/courses', icon: BookOpen },
            { label: 'Semester Progression', href: '/dashboard/admin/promotion', icon: Sparkles },
            { label: 'Manage Departments', href: '/dashboard/admin/departments', icon: Building2 },
            { label: 'Faculty Leaves', href: '/dashboard/admin/leaves', icon: Calendar },
            { label: 'Academic Notices', href: '/dashboard/admin/notices', icon: Bell },
          ],
        };
      case 'HOSTEL_ADMIN':
        return {
          title: 'Hostel & Housing Administration Desk',
          subtitle: 'Room allocations, hostel occupancy, digital gate passes, and housing maintenance',
          badge: 'Hostel Desk',
          stats: [
            { label: 'Hostel Occupancy', value: '88.5%', icon: BedDouble, sub: 'Block A, B, C & D', href: '/dashboard/admin/hostel' },
            { label: 'Total Available Rooms', value: '340', icon: Building2, sub: 'Single, Double & Triple AC', href: '/dashboard/admin/hostel' },
            { label: 'Pending Maintenance', value: '8', icon: AlertTriangle, sub: 'Plumbing & electrical', href: '/dashboard/admin/complaints' },
            { label: 'Active Gate Outpasses', value: '42', icon: ShieldCheck, sub: 'Digital QR outpasses', href: '/dashboard/student/gatepass' },
            { label: 'Hostel Residents', value: '620', icon: Users, sub: 'Verified student boarders', href: '/dashboard/admin/hostel' },
            { label: 'Hostel Inquiries', value: '3', icon: AlertTriangle, sub: 'Room swap requests', href: '/dashboard/admin/complaints' },
          ],
          shortcuts: [
            { label: 'Hostel Housing & Rooms', href: '/dashboard/admin/hostel', icon: BedDouble },
            { label: 'Digital Gatepass Desk', href: '/dashboard/student/gatepass', icon: ShieldCheck },
            { label: 'Housing Maintenance', href: '/dashboard/admin/complaints', icon: AlertTriangle },
            { label: 'Hardware Inventory', href: '/dashboard/admin/inventory', icon: HardDrive },
            { label: 'Hostel Notices', href: '/dashboard/admin/notices', icon: Bell },
          ],
        };
      default: // DIRECTOR / MASTER SUPER ADMIN
        return {
          title: 'College Director Master Control Center',
          subtitle: 'Institutional oversight, department governance, admission/staff verification desk, and campus-wide operations',
          badge: '👑 College Director',
          stats: [
            { label: 'Total Enrolled Students', value: data.totalStudents.toLocaleString(), icon: GraduationCap, sub: '+120 new this term', href: '/dashboard/admin/users' },
            { label: 'Active Faculty Members', value: data.totalFaculty.toString(), icon: Users, sub: '8 departments', href: '/dashboard/admin/users' },
            { label: 'Fee Collection (Aug)', value: '₹85.0L', icon: DollarSign, sub: '82% of target collected', href: '/dashboard/admin/fees' },
            { label: 'Today Attendance Rate', value: `${data.attendanceToday}%`, icon: UserCheck, sub: 'Campus wide', href: '/dashboard/admin/analytics' },
            { label: 'Pending Helpdesk Tickets', value: data.activeComplaints.toString(), icon: AlertTriangle, sub: '3 high priority', href: '/dashboard/admin/complaints' },
            { label: 'Students Placed', value: data.placedStudents.toString(), icon: Briefcase, sub: '78% placement rate', href: '/dashboard/admin/placements' },
          ],
          shortcuts: [
            { label: 'Admission & Staff Verification', href: '/dashboard/admin/verification', icon: ShieldCheck },
            { label: 'User Directory', href: '/dashboard/admin/users', icon: Users },
            { label: 'Publish Campus Notice', href: '/dashboard/admin/notices', icon: Bell },
            { label: 'Manage Departments', href: '/dashboard/admin/departments', icon: Building2 },
            { label: 'Placement Drives', href: '/dashboard/admin/placements', icon: Briefcase },
            { label: 'Semester Progression', href: '/dashboard/admin/promotion', icon: Sparkles },
          ],
        };
    }
  };

  const config = getDashboardConfig();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">{config.title}</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 uppercase tracking-wider">
              {config.badge}
            </span>
          </div>
          <p className="text-xs text-slate-500">{config.subtitle}</p>
        </div>
        <div className="flex gap-2">
          <button className="px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer">
            <Download className="w-3.5 h-3.5 text-slate-500" /> Export Department Report
          </button>
          {deptRole === 'DIRECTOR' && (
            <Link href="/dashboard/admin/verification" className="px-3.5 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer">
              <ShieldCheck className="w-3.5 h-3.5" /> Staff Approvals Desk
            </Link>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {config.stats.map((stat) => {
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

      {/* Director Institutional Governance & Attendance Command Sheets */}
      {deptRole === 'DIRECTOR' && (
        <div className="space-y-6">
          {/* Section 1: Department-Wise Teacher Attendance Sheet */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-card space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
                    <UserCheck className="w-4 h-4" />
                  </span>
                  <h3 className="text-base font-bold text-slate-900">Department-Wise Faculty Attendance Sheet</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">
                    Director Real-Time Telemetry
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Live daily faculty presence, leave status, and late arrivals across all 8 institutional departments</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                  94.2% Faculty Present Today (141 / 150)
                </span>
              </div>
            </div>

            {/* Department Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { dept: 'CSE', total: 24, present: 23, leave: 1, absent: 0, pct: '95.8%' },
                { dept: 'CSE-AIML', total: 16, present: 15, leave: 1, absent: 0, pct: '93.7%' },
                { dept: 'IT', total: 18, present: 17, leave: 0, absent: 1, pct: '94.4%' },
                { dept: 'ECE', total: 18, present: 16, leave: 2, absent: 0, pct: '88.8%' },
                { dept: 'MECH', total: 14, present: 13, leave: 1, absent: 0, pct: '92.8%' },
                { dept: 'CIVIL', total: 12, present: 11, leave: 0, absent: 1, pct: '91.6%' },
              ].map((d) => (
                <div key={d.dept} className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-indigo-300 transition-all">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-slate-900">{d.dept}</span>
                    <span className="text-[10px] font-bold text-indigo-600">{d.pct}</span>
                  </div>
                  <div className="text-[11px] text-slate-600 space-y-0.5">
                    <div className="flex justify-between"><span>Present:</span> <strong className="text-emerald-700">{d.present}</strong></div>
                    <div className="flex justify-between"><span>Leave/OD:</span> <strong className="text-amber-700">{d.leave}</strong></div>
                    <div className="flex justify-between"><span>Absent:</span> <strong className="text-rose-700">{d.absent}</strong></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Live Faculty Attendance Roster Table */}
            <div className="overflow-x-auto border border-slate-200/80 rounded-xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Faculty Name & Designation</th>
                    <th className="p-3">Department</th>
                    <th className="p-3">Today Check-In</th>
                    <th className="p-3">Assigned Classes</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Director Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {[
                    { name: 'Dr. Priya Sharma', role: 'Associate Professor & HOD', dept: 'CSE', checkIn: '08:52 AM', classes: '3 Labs / Lectures', status: 'PRESENT' },
                    { name: 'Prof. Rajesh Verma', role: 'Assistant Professor', dept: 'IT', checkIn: '09:05 AM', classes: '2 Lectures', status: 'PRESENT' },
                    { name: 'Dr. Anita Roy', role: 'Professor & Dean R&D', dept: 'CSE-AIML', checkIn: '08:45 AM', classes: '2 Labs', status: 'PRESENT' },
                    { name: 'Dr. Vikas Gupta', role: 'Associate Professor', dept: 'ECE', checkIn: '-', classes: 'Duty Leave (Conference)', status: 'ON_LEAVE' },
                    { name: 'Prof. Sanjay Kumar', role: 'Assistant Professor', dept: 'MECH', checkIn: '09:25 AM (Late)', classes: '1 Lab', status: 'LATE' },
                    { name: 'Prof. Neha Mishra', role: 'Assistant Professor', dept: 'CIVIL', checkIn: '-', classes: 'Uninformed', status: 'ABSENT' },
                  ].map((fac, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-3">
                        <span className="font-bold text-slate-900 block">{fac.name}</span>
                        <span className="text-[10px] text-slate-500">{fac.role}</span>
                      </td>
                      <td className="p-3 font-semibold text-slate-700">{fac.dept}</td>
                      <td className="p-3 font-mono text-[11px] text-slate-600">{fac.checkIn}</td>
                      <td className="p-3 text-slate-600">{fac.classes}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          fac.status === 'PRESENT' ? 'bg-emerald-100 text-emerald-800' :
                          fac.status === 'ON_LEAVE' ? 'bg-amber-100 text-amber-800' :
                          fac.status === 'LATE' ? 'bg-orange-100 text-orange-800' :
                          'bg-rose-100 text-rose-800'
                        }`}>
                          {fac.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition cursor-pointer">
                          View Log
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: Student Attendance Telemetry Matrix (Section, Year, Semester Wise) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-card space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
                    <GraduationCap className="w-4 h-4" />
                  </span>
                  <h3 className="text-base font-bold text-slate-900">Student Attendance Telemetry Matrix</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                    Section & Semester Filters
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Granular student attendance analysis across Academic Years, Semesters, Sections & Defaulters</p>
              </div>
            </div>

            {/* Interactive Section Matrix Table */}
            <div className="overflow-x-auto border border-slate-200/80 rounded-xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Department & Year</th>
                    <th className="p-3">Semester & Section</th>
                    <th className="p-3">Class Mentor</th>
                    <th className="p-3">Total Strength</th>
                    <th className="p-3">Present Today</th>
                    <th className="p-3">Section Avg %</th>
                    <th className="p-3">Defaulters (&lt;75%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {[
                    { dept: 'B.Tech CSE', year: '3rd Year', sem: 'Sem 5', sec: 'Section A', mentor: 'Dr. Priya Sharma', strength: 60, present: 56, avg: '93.3%', defaulters: 2 },
                    { dept: 'B.Tech CSE', year: '3rd Year', sem: 'Sem 5', sec: 'Section B', mentor: 'Prof. Rajesh Verma', strength: 60, present: 54, avg: '90.0%', defaulters: 4 },
                    { dept: 'B.Tech CSE-AIML', year: '2nd Year', sem: 'Sem 3', sec: 'Section A', mentor: 'Dr. Anita Roy', strength: 58, present: 55, avg: '94.8%', defaulters: 1 },
                    { dept: 'B.Tech IT', year: '4th Year', sem: 'Sem 7', sec: 'Section A', mentor: 'Dr. Suresh Babu', strength: 55, present: 48, avg: '87.2%', defaulters: 6 },
                    { dept: 'B.Tech ECE', year: '1st Year', sem: 'Sem 1', sec: 'Section A', mentor: 'Dr. Vikas Gupta', strength: 52, present: 50, avg: '96.1%', defaulters: 0 },
                    { dept: 'B.Tech MECH', year: '2nd Year', sem: 'Sem 3', sec: 'Section A', mentor: 'Prof. Sanjay Kumar', strength: 45, present: 39, avg: '86.6%', defaulters: 5 },
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-3">
                        <span className="font-bold text-slate-900 block">{row.dept}</span>
                        <span className="text-[10px] text-slate-500">{row.year}</span>
                      </td>
                      <td className="p-3 font-semibold text-slate-800">{row.sem} • {row.sec}</td>
                      <td className="p-3 text-slate-600">{row.mentor}</td>
                      <td className="p-3 font-bold text-slate-900">{row.strength}</td>
                      <td className="p-3 font-bold text-emerald-700">{row.present}</td>
                      <td className="p-3 font-bold text-indigo-700">{row.avg}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          row.defaulters === 0 ? 'bg-emerald-100 text-emerald-800' :
                          row.defaulters <= 2 ? 'bg-amber-100 text-amber-800' :
                          'bg-rose-100 text-rose-800'
                        }`}>
                          {row.defaulters} Students
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Department Admin Staff Governance & Appointments */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-card space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600 border border-amber-100">
                    <ShieldCheck className="w-4 h-4" />
                  </span>
                  <h3 className="text-base font-bold text-slate-900">Department Admin Staff Governance & Oversight</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                    Director Desk Authority
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Appoint, approve, suspend, or reassign leadership for all institutional administrative departments</p>
              </div>
              <Link
                href="/dashboard/admin/verification"
                className="px-3.5 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Appoint / Approve Admin Staff
              </Link>
            </div>

            <div className="overflow-x-auto border border-slate-200/80 rounded-xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Admin Lead Name</th>
                    <th className="p-3">Department Role / Desk</th>
                    <th className="p-3">Official Email</th>
                    <th className="p-3">Employee ID</th>
                    <th className="p-3">Account Status</th>
                    <th className="p-3 text-right">Director Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {[
                    { name: 'Suresh Sharma', role: 'Training & Placement (TPO)', email: 'suresh.tpo@kcc.campushub.edu.in', empId: 'EMP-TPO-01', status: 'ACTIVE' },
                    { name: 'Meena Gupta', role: 'Finance & Accounts Officer', email: 'meena.fees@kcc.campushub.edu.in', empId: 'EMP-ACC-02', status: 'ACTIVE' },
                    { name: 'Rakesh Kumar', role: 'Academic Registrar', email: 'rakesh.acad@kcc.campushub.edu.in', empId: 'EMP-REG-03', status: 'ACTIVE' },
                    { name: 'Dr. Maya Sen', role: 'Student Wellness & Psychology Head', email: 'maya.wellness@kcc.campushub.edu.in', empId: 'EMP-WEL-04', status: 'ACTIVE' },
                    { name: 'Anil Joshi', role: 'Hostel Warden & Housing Incharge', email: 'anil.hostel@kcc.campushub.edu.in', empId: 'EMP-HST-05', status: 'ACTIVE' },
                    { name: 'Kavita Verma', role: 'Chief Librarian & Digital Catalog', email: 'kavita.lib@kcc.campushub.edu.in', empId: 'EMP-LIB-06', status: 'ACTIVE' },
                  ].map((staff, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-3 font-bold text-slate-900">{staff.name}</td>
                      <td className="p-3 font-semibold text-slate-700">{staff.role}</td>
                      <td className="p-3 font-mono text-[11px] text-slate-600">{staff.email}</td>
                      <td className="p-3 font-mono text-[11px] text-slate-800">{staff.empId}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {staff.status}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-1.5">
                        <button className="px-2 py-1 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-800 text-[11px] font-bold border border-amber-200 transition cursor-pointer">
                          Reassign
                        </button>
                        <button className="px-2 py-1 rounded-md bg-red-50 hover:bg-red-100 text-red-700 text-[11px] font-bold border border-red-200 transition cursor-pointer">
                          Suspend
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
