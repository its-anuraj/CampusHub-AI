'use client';

import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { UserCheck, Award, DollarSign, Calendar, Bus, MessageSquare, Bell, Loader2, Download, TrendingUp, Sparkles, CheckCircle2, BookOpen } from 'lucide-react';
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
  const [studentData, setStudentData] = useState<any>(null);
  const [attendanceChart, setAttendanceChart] = useState<any[]>([]);
  const [recentMarks, setRecentMarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPtmModal, setShowPtmModal] = useState(false);

  const handleDownloadReport = () => {
    addToast({
      title: 'Progress Report Generated 📄',
      message: 'Official Term Progress Card downloaded for student records.',
      type: 'success'
    });
    window.print();
  };

  useEffect(() => {
    const u = localStorage.getItem('campushub_user');
    if (u) setUser(JSON.parse(u));
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const [attendanceRes, feesRes] = await Promise.all([
          fetch('/api/attendance'),
          fetch('/api/fees'),
        ]);
        const attendanceData = attendanceRes.ok ? await attendanceRes.json() : {};
        const feesData = feesRes.ok ? await feesRes.json() : { fees: [] };

        const pendingFees = (feesData.fees || [])
          .filter((f: any) => f.status === 'PENDING' || f.status === 'OVERDUE')
          .reduce((sum: number, f: any) => sum + f.amount, 0);

        setStudentData({
          attendancePercentage: attendanceData.percentage ?? 0,
          cgpa: attendanceData.cgpa ?? 0,
          pendingFees,
        });
        setAttendanceChart(attendanceData.chart || []);
        setRecentMarks([]);
      } catch {
        setStudentData({ attendancePercentage: 0, cgpa: 0, pendingFees: 0 });
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /></div>;

  const childName = studentData?.childName || user?.name || 'Student';

  return (
    <div className="space-y-6">
      <PtmSchedulerModal
        isOpen={showPtmModal}
        onClose={() => setShowPtmModal(false)}
      />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Parent Monitoring Dashboard</h1>
          <p className="text-xs text-slate-500 mt-1">Monitoring academic progress and campus activities</p>
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

      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg">
            {childName.charAt(0)}
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900">{childName}</h2>
            <p className="text-xs text-slate-500">Linked student account</p>
          </div>
        </div>
        <div className="flex items-center gap-6 border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0 w-full sm:w-auto justify-between sm:justify-end">
          <div className="text-right">
            <p className="text-xs text-slate-400 font-medium">Cumulative GPA</p>
            <p className="text-xl font-bold text-slate-900">{studentData?.cgpa > 0 ? studentData.cgpa.toFixed(2) : '—'}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400 font-medium">Attendance Rate</p>
            <p className="text-xl font-bold text-blue-600">{studentData?.attendancePercentage > 0 ? `${studentData.attendancePercentage.toFixed(1)}%` : '—'}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Attendance Rate', value: studentData?.attendancePercentage > 0 ? `${studentData.attendancePercentage.toFixed(1)}%` : '—', icon: UserCheck, sub: studentData?.attendancePercentage >= 75 ? 'Above required 75%' : 'No data yet', color: 'text-emerald-600', href: '/dashboard/parent/attendance' },
          { label: 'GPA Rank', value: studentData?.cgpa > 0 ? studentData.cgpa.toFixed(2) : '—', icon: Award, sub: studentData?.cgpa > 0 ? 'Academic performance' : 'No records yet', color: 'text-blue-600', href: '/dashboard/parent/marks' },
          { label: 'Pending Dues', value: studentData?.pendingFees > 0 ? formatCurrency(studentData.pendingFees) : '₹0', icon: DollarSign, sub: studentData?.pendingFees > 0 ? 'Outstanding fees' : 'All fees paid', color: studentData?.pendingFees > 0 ? 'text-amber-600' : 'text-emerald-600', href: '/dashboard/parent/fees' },
          { label: 'Upcoming Exams', value: '—', icon: Calendar, sub: 'Check with institution', color: 'text-slate-600', href: '/dashboard/parent/marks' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Link href={stat.href} key={stat.label}>
              <div className="bg-white border border-slate-200 rounded-2xl p-5 card-hover shadow-card">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-slate-500">{stat.label}</span>
                  <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-100 text-slate-600"><Icon className="w-4 h-4" /></div>
                </div>
                <div className="text-2xl font-bold text-slate-900 tracking-tight">{stat.value}</div>
                <p className={`text-[11px] font-medium mt-1.5 ${stat.color}`}>{stat.sub}</p>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-card space-y-4">
          <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-3">Attendance Progress</h3>
          {attendanceChart.length > 0 ? (
            <div className="h-44">
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
                  <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '11px' }} />
                  <Area type="monotone" dataKey="percentage" stroke="#2563EB" strokeWidth={2} fill="url(#parentGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-44 text-center">
              <div>
                <UserCheck className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                <p className="text-xs text-slate-400">No attendance data yet</p>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-semibold text-slate-900">Recent Exam Results</h3>
            <Link href="/dashboard/parent/marks" className="text-xs font-semibold text-blue-600 hover:text-blue-700">View All →</Link>
          </div>
          {recentMarks.length > 0 ? (
            <div className="space-y-2.5">
              {recentMarks.map((mark: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/40">
                  <div>
                    <p className="text-xs font-semibold text-slate-900">{mark.subject}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{mark.exam}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-900">{mark.marks} / {mark.maxMarks}</p>
                    <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">{mark.grade}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Award className="w-8 h-8 text-slate-200 mb-2" />
              <p className="text-xs text-slate-400">No exam results yet</p>
              <p className="text-xs text-slate-400 mt-0.5">Results will appear after exams are graded</p>
            </div>
          )}
        </div>
      </div>

      {/* Subject Competency & Class Average Benchmark */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-blue-600" /> Subject-wise Competency vs Class Average
              </h3>
              <p className="text-[11px] text-slate-500">Benchmark comparison against semester batch percentile</p>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Top 15% in Batch
            </span>
          </div>

          <div className="space-y-3.5 pt-1">
            {SUBJECT_COMPETENCIES.map((comp) => (
              <div key={comp.subject} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-800">{comp.subject}</span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-blue-600 font-bold">{comp.score}%</span>
                    <span className="text-slate-400 text-[10px]">(Avg: {comp.classAvg}%)</span>
                    <span className="px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 text-[10px] border border-blue-100">{comp.grade}</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${comp.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Academic Advisor Remarks */}
        <div className="lg:col-span-4 bg-gradient-to-br from-blue-50/60 to-indigo-50/60 border border-blue-100 rounded-2xl p-6 shadow-card space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-xs font-bold text-blue-700 flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Faculty Mentor Remarks
            </span>
            <h4 className="text-sm font-bold text-slate-900">Dr. Rajesh Swaminathan</h4>
            <p className="text-xs text-slate-600 leading-relaxed italic">
              &ldquo;{childName} demonstrates exceptional problem-solving in Data Structures and Algorithms. Recommended to participate in upcoming hackathons to further strengthen practical distributed systems knowledge.&rdquo;
            </p>
          </div>

          <div className="pt-3 border-t border-blue-200/60 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Term Conduct:</span>
            <span className="font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Exemplary (A+)
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-card">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Parent Portal Shortcuts</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Pay Semester Fees', href: '/dashboard/parent/fees', icon: DollarSign },
            { label: 'Live Bus Tracking', href: '/dashboard/parent/transport', icon: Bus },
            { label: 'Faculty Inquiry', href: '/dashboard/parent/messages', icon: MessageSquare },
            { label: 'View Notices', href: '/dashboard/parent/notices', icon: Bell },
          ].map(item => {
            const Icon = item.icon;
            return (
              <Link key={item.label} href={item.href} className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-blue-50/40 hover:border-blue-200 transition-all text-xs font-semibold text-slate-800 flex items-center justify-center gap-2">
                <Icon className="w-4 h-4 text-blue-600" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
