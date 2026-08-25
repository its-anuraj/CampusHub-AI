'use client';

import { useState, useEffect } from 'react';
import {
  DollarSign,
  Building2,
  TrendingUp,
  PieChart,
  CheckCircle2,
  Clock,
  Plus,
  Download,
  Search,
  Filter,
  CreditCard,
  FileSpreadsheet,
  X
} from 'lucide-react';
import { useToast } from '@/lib/toastContext';
import { exportToCSV } from '@/lib/exportUtils';
import { cn } from '@/lib/utils';

export default function AdminBudgetPage() {
  const { addToast } = useToast();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Form State
  const [dept, setDept] = useState('CSE');
  const [item, setItem] = useState('');
  const [amount, setAmount] = useState('150000');
  const [submitting, setSubmitting] = useState(false);

  const fetchBudget = async () => {
    try {
      const res = await fetch('/api/budget');
      if (res.ok) {
        const json = await res.json();
        setData(json.data || json);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudget();
  }, []);

  const handleApprove = async (reqId: string, itemName: string) => {
    try {
      const res = await fetch('/api/budget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'APPROVE', reqId })
      });
      if (res.ok) {
        addToast({
          title: 'Requisition Sanctioned',
          message: `Approved budget allocation for ${itemName}.`,
          type: 'success'
        });
        fetchBudget();
      }
    } catch {
      addToast({ title: 'Error', message: 'Could not approve requisition.', type: 'error' });
    }
  };

  const handleCreateReq = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/budget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CREATE',
          dept,
          item,
          amount,
          requestedBy: 'Head of Department'
        })
      });
      if (res.ok) {
        addToast({
          title: 'Requisition Submitted',
          message: 'Purchase proposal routed to Finance Committee.',
          type: 'success'
        });
        setModalOpen(false);
        setItem('');
        fetchBudget();
      }
    } catch {
      addToast({ title: 'Error', message: 'Failed to submit requisition.', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleExportCSV = () => {
    const rows = (data?.budgets || []).map((b: any) => ({
      'Department': b.dept,
      'Code': b.code,
      'Allocated (INR)': b.allocated,
      'Spent (INR)': b.spent,
      'Committed (INR)': b.committed,
      'Available Balance': b.available,
      'Utilization %': `${b.utilization}%`
    }));
    exportToCSV('Departmental_Budget_Report_2026_27', rows);
    addToast({ title: 'CSV Downloaded', message: 'Annual budget ledger exported.', type: 'success' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-700 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wider">
            <DollarSign className="w-3.5 h-3.5 text-yellow-300" /> Institutional Financial Controller
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Departmental Budget & Capital Expenditure</h1>
          <p className="text-white/90 text-sm sm:text-base">
            Annual FY 2026-27 departmental allocations, real-time expenditure utilization %, purchase requisitions, and CFO approval ledger.
          </p>
        </div>
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-xs text-muted-foreground font-medium">Annual Sanctioned</p>
          <p className="text-2xl font-bold text-foreground mt-1 font-mono">
            {data?.metrics?.totalAllocated || '₹3.05 Cr'}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-xs text-muted-foreground font-medium">Disbursed Expenditure</p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 font-mono">
            {data?.metrics?.totalSpent || '₹2.29 Cr'}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-xs text-muted-foreground font-medium">Overall Utilization</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1 font-mono">
            {data?.metrics?.overallUtilization || '75%'}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-medium">Fiscal Period</p>
            <p className="text-sm font-bold text-foreground mt-1">{data?.metrics?.fiscalYear || 'FY 2026-27'}</p>
          </div>
          <button
            onClick={handleExportCSV}
            className="p-2 rounded-lg border border-border hover:bg-muted text-foreground"
            title="Export CSV"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Department Budget Cards */}
      <div className="space-y-3">
        <h3 className="font-bold text-base text-foreground">Department Allocation Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.budgets?.map((b: any) => (
            <div key={b.code} className="p-5 rounded-2xl bg-card border border-border shadow-xs space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-muted text-foreground">{b.code}</span>
                  <h4 className="font-bold text-sm text-foreground mt-1.5">{b.dept}</h4>
                </div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">{b.utilization}%</span>
              </div>

              <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: `${b.utilization}%` }} />
              </div>

              <div className="grid grid-cols-3 gap-2 text-[11px] pt-1">
                <div>
                  <span className="text-muted-foreground block">Allocated</span>
                  <strong className="text-foreground font-mono">₹{(b.allocated / 100000).toFixed(1)}L</strong>
                </div>
                <div>
                  <span className="text-muted-foreground block">Spent</span>
                  <strong className="text-emerald-600 font-mono">₹{(b.spent / 100000).toFixed(1)}L</strong>
                </div>
                <div>
                  <span className="text-muted-foreground block">Balance</span>
                  <strong className="text-blue-600 font-mono">₹{(b.available / 100000).toFixed(1)}L</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Requisitions Approval Strip */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-border pb-3">
          <div>
            <h3 className="font-bold text-base text-foreground">Purchase Requisitions & CapEx Queue</h3>
            <p className="text-xs text-muted-foreground">Department lab hardware and software licenses pending sanction</p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition"
          >
            <Plus className="w-3.5 h-3.5" /> New Requisition
          </button>
        </div>

        <div className="divide-y divide-border/60">
          {data?.requisitions?.map((req: any) => {
            const isApproved = req.status === 'APPROVED';
            return (
              <div key={req.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-foreground">{req.id}</span>
                    <span className="px-2 py-0.5 rounded font-bold bg-muted text-[10px]">{req.dept}</span>
                    <span className={cn(
                      "px-2 py-0.5 rounded-full font-semibold text-[10px]",
                      isApproved ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                    )}>
                      {req.status}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-foreground">{req.item}</p>
                  <p className="text-muted-foreground">Requested by {req.requestedBy} • {req.date}</p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <span className="text-base font-bold font-mono text-foreground">
                    ₹{req.amount.toLocaleString('en-IN')}
                  </span>
                  {!isApproved && (
                    <button
                      onClick={() => handleApprove(req.id, req.item)}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs transition"
                    >
                      Sanction Fund
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* New Requisition Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-2 border-b border-border">
              <h3 className="font-bold text-lg text-foreground">Submit CapEx Requisition</h3>
              <button onClick={() => setModalOpen(false)} className="p-1 rounded text-muted-foreground hover:bg-muted">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateReq} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Department</label>
                <select
                  value={dept}
                  onChange={(e) => setDept(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-background border border-border rounded-xl font-medium"
                >
                  <option value="CSE">Computer Science & Engineering (CSE)</option>
                  <option value="ECE">Electronics & Communication (ECE)</option>
                  <option value="MECH">Mechanical Engineering (MECH)</option>
                  <option value="CIVIL">Civil & Infrastructure (CIVIL)</option>
                  <option value="MBA">Management Studies (MBA)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Item Description / Purpose</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. GPU Compute Cluster Upgrade"
                  value={item}
                  onChange={(e) => setItem(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-background border border-border rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Estimated Budget (INR)</label>
                <input
                  type="number"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-background border border-border rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Requisition'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
