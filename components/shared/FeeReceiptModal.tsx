'use client';

import { CheckCircle2, Download, Printer, X, Building2, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useToast } from '@/lib/toastContext';

interface FeeReceiptProps {
  isOpen: boolean;
  onClose: () => void;
  feeItem: {
    id: string;
    type: string;
    amount: number;
    paidDate?: string;
    transactionId?: string;
    paymentMethod?: string;
  } | null;
  studentName?: string;
  rollNumber?: string;
}

export default function FeeReceiptModal({
  isOpen,
  onClose,
  feeItem,
  studentName = 'Anuraj Singh',
  rollNumber = 'CS2023-042',
}: FeeReceiptProps) {
  const { toast } = useToast();

  if (!isOpen || !feeItem) return null;

  const txnId = feeItem.transactionId || `TXN-CH-${Math.floor(10000000 + Math.random() * 90000000)}`;
  const dateStr = feeItem.paidDate || new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  const handlePrint = () => {
    toast.info('Preparing fee receipt print layout...');
    window.print();
  };

  const handleDownload = () => {
    toast.success(`Official Receipt ${txnId}.pdf downloaded successfully!`, 'Receipt Saved');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8 overflow-hidden space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Official Payment Receipt</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Receipt Body */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 space-y-5 font-sans">
          {/* Header */}
          <div className="text-center pb-4 border-b border-slate-200">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-black text-sm flex items-center justify-center mx-auto mb-2 shadow-xs">
              CH
            </div>
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">CampusHub University</h2>
            <p className="text-[10px] text-slate-500">Accounts & Finance Directorate • New Delhi, India</p>
          </div>

          {/* Student & Txn Info */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Student Name</span>
              <strong className="text-slate-800">{studentName}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Roll Number</span>
              <strong className="text-slate-800 font-mono">{rollNumber}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Transaction ID</span>
              <strong className="text-slate-800 font-mono text-[11px]">{txnId}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Payment Date</span>
              <strong className="text-slate-800">{dateStr}</strong>
            </div>
          </div>

          {/* Line Items */}
          <div className="border-t border-b border-slate-200 py-3 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-600 font-medium">
              <span>{feeItem.type}</span>
              <span className="font-bold text-slate-900">{formatCurrency(feeItem.amount)}</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Convenience & Portal Charges</span>
              <span className="text-emerald-700 font-semibold">FREE (₹0.00)</span>
            </div>
          </div>

          {/* Total Amount Paid */}
          <div className="flex items-center justify-between pt-1">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Status</span>
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> PAID & SETTLED
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Amount</span>
              <span className="text-lg font-black text-slate-900">{formatCurrency(feeItem.amount)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Printer className="w-3.5 h-3.5" /> Print
          </button>
          <button
            onClick={handleDownload}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Download PDF Receipt
          </button>
        </div>
      </div>
    </div>
  );
}
