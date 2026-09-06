'use client';

import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  UserCheck,
  Award,
  DollarSign,
  Calendar,
  Loader2,
  Download,
  Sparkles,
  CheckCircle2,
  BookOpen,
  ShieldCheck,
  Clock,
  Bell,
  GraduationCap
} from 'lucide-react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { useToast } from '@/lib/toastContext';

import PtmSchedulerModal from '@/components/shared/PtmSchedulerModal';

const SUBJECT_COMPETENCIES = [
  { subject: 'Data Structures & Algorithms', score: 92, classAvg: 74, grade: 'A+' },
  { subject: 'Database Management Systems', score: 88, classAvg: 70, grade: 'A' },
  { subject: 'Computer Networks', score: 85, classAvg: 68, grade: 'A' },
  { subject: 'Operating Systems', score: 79, classAvg: 65, grade: 'B+' },
  { subject: 'Software Engineering', score: 94, classAvg: 76, grade: 'A+' },
];

export default function ParentDashboardPage() {
  const { addToast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [wardData, setWardData] = useState<any>(null);
  const [notices, setNotices] = useState<any[]>([]);
  const [attendanceChart, setAttendanceChart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPtmModal, setShowPtmModal] = useState(false);

  const handleDownloadReport = () => {
    addToast({
      title: 'Progress Report Generated 📄',
      message: 'Official Term Progress Card downloaded for student records.',
      type: 'success',
    });
    window.print();
  };

  useEffect(() => {
    const u = localStorage.getItem('campushub_user');
    if (u) {
      const parsed = JSON.parse(u);
      setUser(parsed);
      fetchWardData(parsed.email);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchWardData = async (email: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/parent/ward?parentEmail=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (res.ok && data.ward) {
        setWardData(data.ward);
        setNotices(data.notices || []);
        setAttendanceChart([
          { month: 'Aug', percentage: 92 },
          { month: 'Sep', percentage: 88 },
          { month: 'Oct', percentage: 94 },
          { month: 'Nov', percentage: data.ward.attendancePercentage || 90 },
        ]);
      }
    } catch (err) {
      console.error('Error fetching parent ward data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );
  }

  const childName = wardData?.name || 'Verified Ward';

  return (
    <div className="space-y-6">
      <PtmSchedulerModal
        isOpen={showPtmModal}
        onClose={() => setShowPtmModal(false)}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Parent Monitoring Dashboard</h1>
          <p className="text-xs text-slate-500 mt-1">
            Monitoring verified academic progress, attendance, and campus updates for your linked ward
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadReport}
            className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
          >
            <Download className="w-4 h-4 text-blue-600" /> Download Term Progress Card
          </button>
          <button
            onClick={() => setShowPtmModal(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
          >
            <Calendar className="w-4 h-4" /> Book Faculty Consultation (PTM)
          </button>
        </div>
      </div>

      {/* Ward Profile Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg">
            {childName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-slate-900">{childName}</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> VERIFIED WARD
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Roll No: <span className="font-mono font-bold text-blue-600">{wardData?.rollNumber || 'N/A'}</span> • {wardData?.department || 'CSE'} • Year {wardData?.year || 1} (Sem {wardData?.semester || 1}) • <span className="font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">Section {wardData?.section || 'A'}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-6 border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0 w-full sm:w-auto justify-between sm:justify-end">
          <div className="text-right">
            <p className="text-xs text-slate-400 font-medium">Cumulative CGPA</p>
            <p className="text-xl font-bold text-slate-900">{wardData?.cgpa ? Number(wardData.cgpa).toFixed(2) : '8.20'}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400 font-medium">Attendance Rate</p>
            <p className="text-xl font-bold text-blue-600">{wardData?.attendancePercentage ? `${wardData.attendancePercentage}%` : '89%'}</p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Attendance Rate',
            value: `${wardData?.attendancePercentage || 89}%`,
            icon: UserCheck,
            sub: (wardData?.attendancePercentage || 89) >= 75 ? 'Above required 75%' : 'Below required 75%',
            color: (wardData?.attendancePercentage || 89) >= 75 ? 'text-emerald-600' : 'text-rose-600',
            href: '/dashboard/parent/attendance',
          },
          {
            label: 'Academic CGPA',
            value: wardData?.cgpa ? Number(wardData.cgpa).toFixed(2) : '8.20',
            icon: Award,
            sub: 'Regular standing',
            color: 'text-blue-600',
            href: '/dashboard/parent/marks',
          },
          {
            label: 'Pending Dues',
            value: formatCurrency(wardData?.pendingFees || 0),
            icon: DollarSign,
            sub: (wardData?.pendingFees || 0) > 0 ? 'Outstanding fees' : 'All fees cleared',
            color: (wardData?.pendingFees || 0) > 0 ? 'text-amber-600' : 'text-emerald-600',
            href: '/dashboard/parent/fees',
          },
          {
            label: 'Section Coordinator',
            value: wardData?.classAdvisor || 'Faculty Mentor',
            icon: ShieldCheck,
            sub: `${wardData?.department || 'CSE'} Sec ${wardData?.section || 'A'}`,
            color: 'text-indigo-600',
            href: '#',
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Link href={stat.href} key={stat.label}>
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-blue-300 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-slate-500">{stat.label}</span>
                  <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-100 text-slate-600">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-xl font-bold text-slate-900 tracking-tight truncate">{stat.value}</div>
                <p className={`text-[11px] font-medium mt-1.5 ${stat.color}`}>{stat.sub}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Grid: Attendance Chart & Enrolled Courses */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-semibold text-slate-900">Attendance Trend (Current Term)</h3>
            <span className="text-xs text-blue-600 font-bold">{wardData?.attendancePercentage || 89}% Total</span>
          </div>

          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceChart} margin={{ top: 5, right: 10, bottom: 5, left: -25 }}>
                <defs>
                  <linearGradient id="parentGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} domain={[60, 100]} />
                <Tooltip contentStyle={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '11px' }} />
                <Area type="monotone" dataKey="percentage" stroke="#2563EB" strokeWidth={2} fill="url(#parentGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Enrolled Courses & Grades */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-semibold text-slate-900">Enrolled Courses & Faculty Mentors</h3>
            <span className="text-xs text-slate-400">{wardData?.courses?.length || 5} Subjects</span>
          </div>

          <div className="space-y-2.5">
            {(wardData?.courses && wardData.courses.length > 0 ? wardData.courses : SUBJECT_COMPETENCIES).map((c: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                    {c.code?.slice(0, 2) || 'CS'}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-900">{c.title || c.subject}</p>
                    <p className="text-[11px] text-slate-400">{c.facultyName || 'Dr. Sharma (Faculty)'}</p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200">
                  Grade {c.grade || 'A'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
