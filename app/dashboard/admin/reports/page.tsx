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
} from 'lucide-react';
import { useToast } from '@/lib/toastContext';
import { exportToCSV, exportToJSON } from '@/lib/exportUtils';

interface ReportCard {
  id: string;
  title: string;
  category: 'ACADEMICS' | 'PLACEMENTS' | 'FEES' | 'ATTENDANCE';
  description: string;
  recordsCount: number;
  lastUpdated: string;
  data: Record<string, any>[];
}

const REPORTS_DATA: ReportCard[] = [
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
  const { toast } = useToast();
  const [reports, setReports] = useState<ReportCard[]>(REPORTS_DATA);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const filteredReports = reports.filter(
    (r) => activeCategory === 'ALL' || r.category === activeCategory
  );

  const handleDownloadCSV = (report: ReportCard) => {
    exportToCSV(report.id, report.data);
    toast.success(`Exported ${report.title} to CSV format.`, 'CSV Generated');
  };

  const handleDownloadJSON = (report: ReportCard) => {
    exportToJSON(report.id, report.data);
    toast.success(`Exported ${report.title} to structured JSON.`, 'JSON Generated');
  };

  const handlePrintReport = (report: ReportCard) => {
    toast.info(`Preparing official printable layout for ${report.title}...`);
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Institutional Analytics & Export Hub</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 uppercase">
              BI & Reporting
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Generate audited campus performance summaries, fee statements, placement analytics, and export in CSV, JSON, or PDF
          </p>
        </div>
      </div>

      {/* Categories Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['ALL', 'ATTENDANCE', 'PLACEMENTS', 'FEES', 'ACADEMICS'].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === cat
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat === 'ALL' ? 'All Generated Reports' : cat}
          </button>
        ))}
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-6 shadow-xs transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 uppercase">
                  {report.category}
                </span>
                <span className="text-[11px] text-slate-400">Updated: {report.lastUpdated}</span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 leading-snug">{report.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{report.description}</p>

              {/* Data Sample Preview Box */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs font-mono text-slate-700 overflow-x-auto">
                <p className="text-[10px] text-slate-400 uppercase font-sans font-bold mb-1">
                  Sample Data ({report.recordsCount} Records Available)
                </p>
                <pre className="text-[11px] text-slate-800">
                  {JSON.stringify(report.data[0], null, 2)}
                </pre>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => handlePrintReport(report)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Printer className="w-3.5 h-3.5" /> Print Layout
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadJSON(report)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <FileCode className="w-3.5 h-3.5" /> JSON
                </button>
                <button
                  onClick={() => handleDownloadCSV(report)}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
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
