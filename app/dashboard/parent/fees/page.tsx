'use client';

import { useState } from 'react';
import {
  CreditCard,
  Download,
  CheckCircle2,
  AlertCircle,
  Clock,
  QrCode,
  ShieldCheck,
  Building2,
  Calendar,
  Sparkles,
  ArrowRight,
  Receipt,
  FileText
} from 'lucide-react';
import { useToast } from '@/lib/toastContext';
import { formatCurrency } from '@/lib/utils';
import FeeReceiptModal from '@/components/shared/FeeReceiptModal';
import { cn } from '@/lib/utils';

interface FeeBreakdownItem {
  id: string;
  type: string;
  amount: number;
  dueDate: string;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
  paidDate?: string;
  transactionId?: string;
}

const INITIAL_FEES: FeeBreakdownItem[] = [
  {
    id: 'fee-1',
    type: 'Semester 5 Tuition & Academic Fee',
    amount: 65000,
    dueDate: '2026-08-30',
    status: 'PENDING'
  },
  {
    id: 'fee-2',
    type: 'Computing Center & Advanced AI Lab Fee',
    amount: 12000,
    dueDate: '2026-08-30',
    status: 'PENDING'
  },
  {
    id: 'fee-3',
    type: 'Hostel Accommodation & Mess Dues (Semester 5)',
    amount: 35000,
    dueDate: '2026-08-30',
    status: 'PENDING'
  },
  {
    id: 'fee-4',
    type: 'Semester 4 Tuition & Examination Fee',
    amount: 65000,
    dueDate: '2026-01-15',
    status: 'PAID',
    paidDate: '12 Jan 2026',
    transactionId: 'TXN-CH-98124719'
  }
];

export default function ParentFeesPage() {
  const { addToast } = useToast();
  const [fees, setFees] = useState<FeeBreakdownItem[]>(INITIAL_FEES);
  const [selectedPlan, setSelectedPlan] = useState<'FULL' | 'EMI_3' | 'EMI_6'>('FULL');
  const [receiptItem, setReceiptItem] = useState<any>(null);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [upiModalOpen, setUpiModalOpen] = useState(false);
  const [payingFee, setPayingFee] = useState<FeeBreakdownItem | null>(null);

  const pendingTotal = fees
    .filter((f) => f.status === 'PENDING' || f.status === 'OVERDUE')
    .reduce((acc, f) => acc + f.amount, 0);

  const paidTotal = fees
    .filter((f) => f.status === 'PAID')
    .reduce((acc, f) => acc + f.amount, 0);

  const handlePayNow = (fee: FeeBreakdownItem) => {
    setPayingFee(fee);
    setUpiModalOpen(true);
  };

  const handleConfirmPayment = () => {
    if (!payingFee) return;

    const txnId = `TXN-CH-${Math.floor(10000000 + Math.random() * 90000000)}`;
    const updatedFee: FeeBreakdownItem = {
      ...payingFee,
      status: 'PAID',
      paidDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      transactionId: txnId
    };

    setFees((prev) => prev.map((f) => (f.id === payingFee.id ? updatedFee : f)));
    setUpiModalOpen(false);
    addToast({
      title: 'Payment Successful!',
      message: `Received ₹${payingFee.amount.toLocaleString('en-IN')} via UPI Instant Gateway. Transaction ID: ${txnId}`,
      type: 'success'
    });

    // Open receipt
    setReceiptItem(updatedFee);
    setReceiptModalOpen(true);
  };

  const handleViewReceipt = (fee: FeeBreakdownItem) => {
    setReceiptItem(fee);
    setReceiptModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-700 via-blue-700 to-cyan-700 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-green-300" /> Authorized Parent Accounts Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Student Fee Management & Flexible EMI</h1>
          <p className="text-white/90 text-sm sm:text-base">
            Review child&apos;s tuition fee schedule, choose 0% interest semester installment plans, and generate verified institutional tax receipts.
          </p>
        </div>
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-card border border-border">
          <p className="text-xs text-muted-foreground font-medium">Pending Dues (Semester 5)</p>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1 font-mono">
            ₹{pendingTotal.toLocaleString('en-IN')}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Due Date: 30th August 2026</p>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border">
          <p className="text-xs text-muted-foreground font-medium">Total Paid to Date</p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 font-mono">
            ₹{paidTotal.toLocaleString('en-IN')}
          </p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Previous Semesters Cleared
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border flex flex-col justify-between">
          <p className="text-xs text-muted-foreground font-medium">Child Student Details</p>
          <div className="mt-1">
            <p className="text-sm font-bold text-foreground">Anuraj Singh (CS2023-042)</p>
            <p className="text-xs text-muted-foreground">B.Tech Computer Science (5th Sem)</p>
          </div>
        </div>
      </div>

      {/* 0% EMI Installment Planner Options */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-foreground flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-blue-500" /> Flexible Fee Payment Modes
            </h3>
            <p className="text-xs text-muted-foreground">Select preferred payment structure (0% processing surcharge)</p>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            Zero Interest EMI
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setSelectedPlan('FULL')}
            className={cn(
              "p-4 rounded-xl border text-left transition-all",
              selectedPlan === 'FULL'
                ? "border-blue-500 bg-blue-500/10 text-foreground"
                : "border-border hover:bg-muted text-muted-foreground"
            )}
          >
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">One-Time Lump Sum</span>
            <p className="text-lg font-bold text-foreground mt-1 font-mono">₹{pendingTotal.toLocaleString('en-IN')}</p>
            <p className="text-xs text-muted-foreground mt-1">Single payment with 2% early discount applied</p>
          </button>

          <button
            onClick={() => setSelectedPlan('EMI_3')}
            className={cn(
              "p-4 rounded-xl border text-left transition-all",
              selectedPlan === 'EMI_3'
                ? "border-blue-500 bg-blue-500/10 text-foreground"
                : "border-border hover:bg-muted text-muted-foreground"
            )}
          >
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">3 Monthly Installments</span>
            <p className="text-lg font-bold text-foreground mt-1 font-mono">₹{Math.round(pendingTotal / 3).toLocaleString('en-IN')} / mo</p>
            <p className="text-xs text-muted-foreground mt-1">Pay on 30th Aug, 30th Sep, 30th Oct</p>
          </button>

          <button
            onClick={() => setSelectedPlan('EMI_6')}
            className={cn(
              "p-4 rounded-xl border text-left transition-all",
              selectedPlan === 'EMI_6'
                ? "border-blue-500 bg-blue-500/10 text-foreground"
                : "border-border hover:bg-muted text-muted-foreground"
            )}
          >
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">6 Monthly Installments</span>
            <p className="text-lg font-bold text-foreground mt-1 font-mono">₹{Math.round(pendingTotal / 6).toLocaleString('en-IN')} / mo</p>
            <p className="text-xs text-muted-foreground mt-1">Zero interest split across full semester</p>
          </button>
        </div>
      </div>

      {/* Fee Items Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-border">
          <h3 className="font-bold text-base text-foreground">Fee Invoices & Receipts Ledger</h3>
        </div>
        <div className="divide-y divide-border/60">
          {fees.map((fee) => {
            const isPaid = fee.status === 'PAID';
            return (
              <div
                key={fee.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/30 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-foreground">{fee.type}</h4>
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-xs font-semibold",
                      isPaid ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" :
                      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                    )}>
                      {fee.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {isPaid ? `Paid on ${fee.paidDate} • Reference: ${fee.transactionId}` : `Payment Due: ${fee.dueDate}`}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <span className="text-lg font-bold font-mono text-foreground">
                    ₹{fee.amount.toLocaleString('en-IN')}
                  </span>
                  {isPaid ? (
                    <button
                      onClick={() => handleViewReceipt(fee)}
                      className="px-3.5 py-2 rounded-xl border border-border hover:bg-accent text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                      <Receipt className="w-3.5 h-3.5 text-blue-500" /> View Receipt
                    </button>
                  ) : (
                    <button
                      onClick={() => handlePayNow(fee)}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition"
                    >
                      <QrCode className="w-3.5 h-3.5" /> Pay via UPI
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* UPI Payment Simulation Modal */}
      {upiModalOpen && payingFee && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="space-y-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                BHIM / UPI ZERO-FEE GATEWAY
              </span>
              <h3 className="font-bold text-lg text-foreground mt-2">{payingFee.type}</h3>
              <p className="text-2xl font-bold font-mono text-blue-600 dark:text-blue-400">
                ₹{payingFee.amount.toLocaleString('en-IN')}
              </p>
            </div>

            <div className="p-4 bg-white rounded-2xl shadow-inner inline-block mx-auto">
              <QrCode className="w-44 h-44 text-slate-900 mx-auto" />
              <p className="text-xs font-mono font-bold text-slate-800 mt-2">campushub.fees@hdfcbank</p>
            </div>

            <p className="text-xs text-muted-foreground">
              Scan with Google Pay, PhonePe, Paytm, or BHIM UPI app on your phone.
            </p>

            <div className="flex gap-2">
              <button
                onClick={handleConfirmPayment}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition"
              >
                Simulate Successful Payment
              </button>
              <button
                onClick={() => setUpiModalOpen(false)}
                className="py-2.5 px-4 rounded-xl border border-border hover:bg-muted text-xs font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official Fee Receipt Modal */}
      <FeeReceiptModal
        isOpen={receiptModalOpen}
        onClose={() => setReceiptModalOpen(false)}
        feeItem={receiptItem}
        studentName="Anuraj Singh"
        rollNumber="CS2023-042"
      />
    </div>
  );
}
