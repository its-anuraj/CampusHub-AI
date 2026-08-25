'use client';

import { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Printer,
  BarChart3,
  Calendar,
  Users,
  CreditCard,
  Briefcase,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  FileCode,
  Award,
  ShieldCheck,
  Building2,
  TrendingUp,
  FileText
} from 'lucide-react';
import { useToast } from '@/lib/toastContext';
import { exportToCSV, exportToJSON } from '@/lib/exportUtils';
import { cn } from '@/lib/utils';

interface ReportCard {
  id: string;
  title: string;
  category: 'ACCREDITATION' | 'ACADEMICS' | 'PLACEMENTS' | 'FEES' | 'ATTENDANCE';
  description: string;
  recordsCount: number;
  lastUpdated: string;
  data: Record<string, any>[];
}

const REPORTS_DATA: ReportCard[] = [
  {
    id: 'rep-nirf',
    title: 'NIRF & NAAC Institutional Criteria Dossier 2026-27',
    category: 'ACCREDITATION',
    description: 'TLR (Teaching & Learning), RPC (Research & Professional Practice), GO (Graduation Outcomes), and OI (Outreach).',
    recordsCount: 5,
    lastUpdated: 'Audited Today',
    data: [
      { Metric: 'Teaching, Learning & Resources (TLR)', Score: '84.6 / 100', Benchmark: 'Top 10 Percentile', Status: 'COMPLIANT' },
      { Metric: 'Research and Professional Practice (RPC)', Score: '78.2 / 100', Benchmark: 'Exceeds NBA Tier-1', Status: 'COMPLIANT' },
      { Metric: 'Graduation Outcomes (GO)', Score: '92.4 / 100', Benchmark: '98% Placement & Higher Ed', Status: 'EXEMPLARY' },
      { Metric: 'Outreach and Inclusivity (OI)', Score: '81.0 / 100', Benchmark: '40% Female Enrolment & Scholarships', Status: 'COMPLIANT' },
      { Metric: 'Student-to-Faculty Ratio (SFR)', Score: '14.2 : 1', Benchmark: 'UGC Mandate <= 15:1', Status: 'OPTIMAL' },
    ],
  },
  {
    id: 'rep-att',
    title: 'Department Attendance & Shortage Defaulters Report',
    category: 'ATTENDANCE',
    description: 'List of students with attendance below 75% across all 13 departments for Semester 5.',
    recordsCount: 48,
    lastUpdated: 'Today at 06:00 PM',
    data: [
      { RollNo: 'CS2023-019', Name: 'Karan Mehra', Dept: 'CSE', Attendance: '68.5%', Status: 'Shortage Warning', ParentNotified: 'Yes' },
      { RollNo: 'EC2023-044', Name: 'Rohan Sharma', Dept: 'ECE', Attendance: '71.2%', Status: 'Shortage Warning', ParentNotified: 'Yes' },
      { RollNo: 'ME2023-012', Name: 'Siddharth Rao', Dept: 'MECH', Attendance: '64.0%', Status: 'Critical Alert', ParentNotified: 'Yes' },
    ],
  },
  {
    id: 'rep-plc',
    title: 'Placement Drive Statistics & Offer Summary 2026-27',
    category: 'PLACEMENTS',
    description: 'Comprehensive company recruitment metrics, package distributions, and student selections.',
    recordsCount: 142,
    lastUpdated: 'Yesterday',
    data: [
      { Company: 'Google India', Role: 'Software Engineer', Selected: 12, Package: '₹32 LPA', DriveDate: '15 Aug 2026' },
      { Company: 'Microsoft', Role: 'SWE SDE-1', Selected: 18, Package: '₹28 LPA', DriveDate: '18 Aug 2026' },
      { Company: 'Amazon AWS', Role: 'Cloud Support Associate', Selected: 24, Package: '₹22 LPA', DriveDate: '20 Aug 2026' },
      { Company: 'TCS Digital', Role: 'Systems Engineer', Selected: 88, Package: '₹9 LPA', DriveDate: '22 Aug 2026' },
    ],
  },
  {
    id: 'rep-fee',
    title: 'Semester 5 Fee Collection & Dues Register',
    category: 'FEES',
    description: 'Accounts reconciliation statement of paid tuition, lab fees, and outstanding ledger balance.',
    recordsCount: 890,
    lastUpdated: '22 Aug 2026',
    data: [
      { Dept: 'CSE', TotalBilled: '₹75,00,000', Collected: '₹68,50,000', Outstanding: '₹6,50,000', CollectionRate: '91.3%' },
      { Dept: 'AI & DS', TotalBilled: '₹42,00,000', Collected: '₹39,00,000', Outstanding: '₹3,00,000', CollectionRate: '92.8%' },
      { Dept: 'ECE', TotalBilled: '₹58,00,000', Collected: '₹52,00,000', Outstanding: '₹6,00,000', CollectionRate: '89.6%' },
    ],
  },
  {
    id: 'rep-res',
    title: 'Academic Results & Cumulative CGPA Distribution',
    category: 'ACADEMICS',
    description: 'Batch-wise SGPA analysis, top performers, passing percentage, and backlog statistics.',
    recordsCount: 1250,
    lastUpdated: '20 Aug 2026',
    data: [
      { Batch: '2023-2027 (5th Sem)', AverageCGPA: '8.14', TopScore: '9.82', PassPercentage: '96.2%', TotalHonors: 142 },
      { Batch: '2022-2026 (7th Sem)', AverageCGPA: '8.25', TopScore: '9.91', PassPercentage: '98.5%', TotalHonors: 180 },
    ],
  },
];

export default function AdminReportsPage() {
  const { addToast } = useToast();
  const [reports, setReports] = useState<ReportCard[]>(REPORTS_DATA);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const filteredReports = reports.filter(
    (r) => activeCategory === 'ALL' || r.category === activeCategory
  );

  const handleDownloadCSV = (report: ReportCard) => {
    exportToCSV(report.id, report.data);
    addToast({
      title: 'CSV Generated',
      message: `Exported ${report.title} to CSV spreadsheet format.`,
      type: 'success'
    });
  };

  const handleDownloadJSON = (report: ReportCard) => {
    exportToJSON(report.id, report.data);
    addToast({
      title: 'JSON Generated',
      message: `Exported ${report.title} to structured JSON format.`,
      type: 'success'
    });
  };

  const handlePrintReport = (report: ReportCard) => {
    addToast({
      title: 'Print Preview Ready',
      message: `Generating printable document for ${report.title}...`,
      type: 'info'
    });
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-teal-700 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5 text-yellow-300" /> NIRF & NBA BI Intelligence Hub
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Institutional Analytics & Accreditation Reporting</h1>
          <p className="text-white/90 text-sm sm:text-base">
            Audited campus governance reports, NIRF 2026 rankings dossier, NAAC criterion scorecards, fee reconciliations, and instant multi-format data export.
          </p>
        </div>
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Quick KPI summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-xs text-muted-foreground font-medium">NIRF Institutional Score</p>
          <p className="text-2xl font-bold text-foreground mt-1 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" /> 84.1 / 100
          </p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-xs text-muted-foreground font-medium">Student-Faculty Ratio</p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-2">
            <Users className="w-5 h-5" /> 14.2 : 1
          </p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-xs text-muted-foreground font-medium">Placement Median CTC</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" /> ₹14.8 LPA
          </p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-xs text-muted-foreground font-medium">NAAC Grade</p>
          <p className="text-2xl font-bold text-teal-600 dark:text-teal-400 mt-1 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" /> A++ (3.82 CGPA)
          </p>
        </div>
      </div>

      {/* Categories Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['ALL', 'ACCREDITATION', 'ATTENDANCE', 'PLACEMENTS', 'FEES', 'ACADEMICS'].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shadow-xs",
              activeCategory === cat
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                : "bg-card border border-border text-muted-foreground hover:bg-muted"
            )}
          >
            {cat === 'ALL' ? 'All Generated Reports' : cat}
          </button>
        ))}
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className="bg-card border border-border hover:border-blue-500/50 rounded-2xl p-6 shadow-xs transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 uppercase">
                  {report.category}
                </span>
                <span className="text-xs text-muted-foreground">Updated: {report.lastUpdated}</span>
              </div>

              <h3 className="text-base font-bold text-foreground leading-snug">{report.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{report.description}</p>

              {/* Data Sample Preview Box */}
              <div className="bg-muted/50 border border-border rounded-xl p-3 text-xs font-mono text-foreground overflow-x-auto">
                <p className="text-[10px] text-muted-foreground uppercase font-sans font-bold mb-1">
                  Preview Sample ({report.recordsCount} Records)
                </p>
                <pre className="text-xs">
                  {JSON.stringify(report.data[0], null, 2)}
                </pre>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
              <button
                onClick={() => handlePrintReport(report)}
                className="px-3 py-1.5 rounded-xl border border-border hover:bg-accent text-foreground text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <Printer className="w-3.5 h-3.5" /> Print Layout
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadJSON(report)}
                  className="px-3 py-1.5 rounded-xl border border-border hover:bg-accent text-foreground text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <FileCode className="w-3.5 h-3.5" /> JSON
                </button>
                <button
                  onClick={() => handleDownloadCSV(report)}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" /> Export CSV
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
