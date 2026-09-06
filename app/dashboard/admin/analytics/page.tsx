'use client';

import { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import {
  TrendingUp,
  Users,
  GraduationCap,
  Briefcase,
  DollarSign,
  Activity,
  Award,
  Building2,
  Calendar,
  Download,
  Filter,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Zap,
  BookOpen
} from 'lucide-react';
import { useToast } from '@/lib/toastContext';

// KCCITM Institutional Analytics Data
const ENROLLMENT_TREND = [
  { year: '2023-27 (Batch 1)', cse: 130, aiml: 80, ds: 60, it: 55, ece: 45, mech: 35, civil: 30, mba: 30, mca: 15 },
  { year: '2024-28 (Batch 2)', cse: 140, aiml: 85, ds: 60, it: 55, ece: 45, mech: 35, civil: 25, mba: 35, mca: 20 },
  { year: '2025-29 (Batch 3)', cse: 135, aiml: 75, ds: 60, it: 55, ece: 45, mech: 35, civil: 28, mba: 28, mca: 22 },
  { year: '2026-30 (Batch 4)', cse: 145, aiml: 80, ds: 60, it: 55, ece: 45, mech: 35, civil: 27, mba: 27, mca: 23 },
];

const REVENUE_VS_EXPENSE = [
  { month: 'Jan', revenue: 65, expense: 48 },
  { month: 'Feb', revenue: 72, expense: 52 },
  { month: 'Mar', revenue: 90, expense: 60 },
  { month: 'Apr', revenue: 80, expense: 56 },
  { month: 'May', revenue: 88, expense: 62 },
  { month: 'Jun', revenue: 105, expense: 68 },
  { month: 'Jul', revenue: 118, expense: 74 },
  { month: 'Aug', revenue: 135, expense: 80 },
];

const PLACEMENT_STATS = [
  { department: 'CSE', placed: 94, target: 100, avgCtc: 8.5 },
  { department: 'CSE-AIML', placed: 92, target: 100, avgCtc: 8.8 },
  { department: 'CSE-DS', placed: 90, target: 100, avgCtc: 8.2 },
  { department: 'IT', placed: 88, target: 100, avgCtc: 7.6 },
  { department: 'ECE', placed: 84, target: 100, avgCtc: 6.8 },
  { department: 'MECH', placed: 78, target: 100, avgCtc: 5.8 },
  { department: 'CIVIL', placed: 72, target: 100, avgCtc: 5.4 },
  { department: 'MBA', placed: 86, target: 100, avgCtc: 6.5 },
  { department: 'MCA', placed: 85, target: 100, avgCtc: 6.2 },
];

const RESOURCE_DISTRIBUTION = [
  { name: 'Academic & AI Computing Labs', value: 40, color: '#2563eb' },
  { name: 'Faculty & Research Infrastructure', value: 25, color: '#7c3aed' },
  { name: 'Hostel & Student Facilities', value: 20, color: '#10b981' },
  { name: 'Campus Maintenance & IT', value: 15, color: '#f59e0b' },
];

const AI_EXECUTIVE_INSIGHTS = [
  {
    id: 1,
    badge: 'Batch Fee Realization',
    title: 'Batch-wise Fixed Fee Settlement On Track',
    desc: 'Batch 2023-27 (₹50k/sem) and Batch 2024-28 (₹55k/sem) fee realization reached 92.8% on KCC.campushub.edu.in.',
    type: 'POSITIVE'
  },
  {
    id: 2,
    badge: 'TPO Recruitment',
    title: 'Placement Velocity: 88.4% with Top CTC ₹28.5 LPA',
    desc: 'Amazon AWS, TCS Digital, Infosys & Capgemini completed Phase-1 drives across CSE, AIML, DS & IT streams.',
    type: 'POSITIVE'
  },
  {
    id: 3,
    badge: 'Faculty Cadre & Ratio',
    title: '150 Full-Time Faculty across 10 Departments',
    desc: 'Healthy 1:13.3 Faculty-to-Student ratio maintained for 2,000 enrolled students under AKTU/AICTE norms.',
    type: 'NEUTRAL'
  }
];

export default function CampusAnalyticsPage() {
  const { toast } = useToast();
  const [selectedYear, setSelectedYear] = useState('2026');
  const [selectedDept, setSelectedDept] = useState('ALL');

  const handleExportReport = () => {
    toast.success('KCCITM Executive Institutional Analytics Summary (PDF) generated.', 'Report Exported');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Campus Analytics & Institutional Intelligence</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 uppercase">
              Director Suite • KCCITM
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            KCC Institute of Technology and Management, Greater Noida (KCC.campushub.edu.in) — Institutional Telemetry & Analytics
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white shadow-2xs outline-none cursor-pointer"
          >
            <option value="2026">Academic Year 2026-27</option>
            <option value="2025">Academic Year 2025-26</option>
            <option value="2024">Academic Year 2024-25</option>
          </select>

          <button
            onClick={handleExportReport}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Export Executive PDF
          </button>
        </div>
      </div>

      {/* Top Executive KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-medium">Total Student Strength</span>
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2 font-mono">2,000</p>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> 150 Faculty • 10 Depts
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-medium">Institutional Placement Rate</span>
            <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-purple-600 mt-2 font-mono">88.4%</p>
          <div className="flex items-center gap-1 text-[11px] text-slate-500 font-semibold mt-1">
            Highest: ₹28.5 LPA • Avg: ₹7.2 LPA
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-medium">Tuition & Fee Realization</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-600 mt-2 font-mono">₹11.2 Cr</p>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> Batch-wise fixed structure
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-medium">NIRF & NAAC Score Index</span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-600 mt-2 font-mono">3.65 / 4.0</p>
          <div className="flex items-center gap-1 text-[11px] text-blue-600 font-bold mt-1">
            A+ Grade Accreditation
          </div>
        </div>
      </div>

      {/* AI Executive Insights & Strategy Cards */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-white/10 text-yellow-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Director&apos;s AI Strategic Copilot Insights (KCCITM)</h3>
              <p className="text-xs text-blue-200">Predictive intelligence generated for Director Anuraj Singh</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-200 border border-blue-400/30">
            KCC.campushub.edu.in
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          {AI_EXECUTIVE_INSIGHTS.map((item) => (
            <div key={item.id} className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-white/15 text-blue-200">
                  {item.badge}
                </span>
                {item.type === 'POSITIVE' && <span className="text-emerald-400 text-xs font-bold">● High Performance</span>}
                {item.type === 'WARNING' && <span className="text-amber-400 text-xs font-bold">▲ Attention</span>}
                {item.type === 'NEUTRAL' && <span className="text-blue-300 text-xs font-bold">★ Active Metric</span>}
              </div>
              <h4 className="font-bold text-xs text-white leading-snug">{item.title}</h4>
              <p className="text-[11px] text-blue-100 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department-wise Enrollment & Intake Growth */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Student Intake Trends (2022 - 2026)</h3>
              <p className="text-xs text-slate-500">Multi-department enrollment trajectories</p>
            </div>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
              5-Year Growth +42%
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ENROLLMENT_TREND}>
                <defs>
                  <linearGradient id="cseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="itGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="year" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip />
                <Area type="monotone" dataKey="cse" name="CSE" stroke="#2563eb" fillOpacity={1} fill="url(#cseGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="it" name="IT" stroke="#7c3aed" fillOpacity={1} fill="url(#itGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="ece" name="ECE" stroke="#10b981" fillOpacity={0.2} fill="#10b981" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Institutional Revenue vs Expenditure Cashflow */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Institutional Cash Flow & CAPEX (₹ Lakhs)</h3>
              <p className="text-xs text-slate-500">Monthly revenue realizations vs department disbursements</p>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg">
              Operating Margin: +36%
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={REVENUE_VS_EXPENSE}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" name="Inflow Revenue (₹L)" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="expense" name="Operational Outflow (₹L)" stroke="#f43f5e" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Secondary Data Grid: Placements by Department & Resource Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Placement Rate by Branch */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Department Placement Statistics (%)</h3>
              <p className="text-xs text-slate-500">Comparison of recruitment conversion across streams</p>
            </div>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PLACEMENT_STATS} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} stroke="#94a3b8" fontSize={11} />
                <YAxis dataKey="department" type="category" stroke="#94a3b8" fontSize={11} width={50} />
                <Tooltip />
                <Bar dataKey="placed" name="Placement Conversion (%)" fill="#2563eb" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Resource & Budget Allocation Donut */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="pb-2 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900">Capital & Budget Allocation</h3>
            <p className="text-xs text-slate-500">Expenditure breakdown by category</p>
          </div>

          <div className="h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={RESOURCE_DISTRIBUTION}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={4}
                >
                  {RESOURCE_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-1">
            {RESOURCE_DISTRIBUTION.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <span className="font-bold font-mono text-slate-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
