'use client';

import { useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  Clock,
  Download,
  Loader2,
  FileText,
  ShieldCheck,
  QrCode,
  Smartphone,
  Building,
  AlertCircle,
} from 'lucide-react';
import { formatDate, formatCurrency } from '@/lib/utils';
import { feeRecords } from '@/lib/mockData';
import { useToast } from '@/lib/toastContext';
import FeeReceiptModal from '@/components/shared/FeeReceiptModal';

export default function StudentFeesPage() {
  const { toast } = useToast();
  const [records, setRecords] = useState<any[]>(feeRecords);
  const [selectedFee, setSelectedFee] = useState<any | null>(null);
  const [showPayModal, setShowPayModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [payMethod, setPayMethod] = useState<'UPI' | 'CARD' | 'NETBANKING'>('UPI');
  const [isProcessing, setIsProcessing] = useState(false);

  const total = records.reduce((a: number, b: any) => a + b.amount, 0);
  const paid = records.filter((f: any) => f.status === 'PAID').reduce((a: number, b: any) => a + b.amount, 0);
  const pending = records.filter((f: any) => f.status !== 'PAID').reduce((a: number, b: any) => a + b.amount, 0);

  const handleOpenPay = (fee: any) => {
    setSelectedFee(fee);
    setShowPayModal(true);
  };

  const handleOpenReceipt = (fee: any) => {
    setSelectedFee(fee);
    setShowReceiptModal(true);
  };

  const handleConfirmPayment = async () => {
    if (!selectedFee) return;

    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 1200));

    setRecords((prev) =>
      prev.map((f) =>
        f.id === selectedFee.id
          ? {
              ...f,
              status: 'PAID',
              paidDate: new Date().toISOString().split('T')[0],
              transactionId: `TXN-CH-${Math.floor(10000000 + Math.random() * 90000000)}`,
            }
          : f
      )
    );

    setIsProcessing(false);
    setShowPayModal(false);
    toast.success(`Payment of ${formatCurrency(selectedFee.amount)} successful!`, 'Fee Settled');
    setShowReceiptModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Fee Statement & Online Payments</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
              Secure Gateway
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Academic Year 2026-27 • Semester 5 Billing Ledger & Online Payment Receipts
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <p className="text-xs font-medium text-slate-500">Total Billed Amount</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(total)}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <p className="text-xs font-medium text-slate-500">Total Paid</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{formatCurrency(paid)}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <p className="text-xs font-medium text-slate-500">Outstanding Balance</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{formatCurrency(pending)}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-2">
        <div className="flex justify-between text-xs font-semibold">
          <span className="text-slate-700">Fee Settlement Progress</span>
          <span className="text-blue-600">{Math.round((paid / total) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-700"
            style={{ width: `${(paid / total) * 100}%` }}
          />
        </div>
      </div>

      {/* Fee Items List */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-900">Semester 5 Fee Invoices</h2>

        {records.map((fee: any) => {
          const isPaid = fee.status === 'PAID';

          return (
            <div
              key={fee.id}
              className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 shadow-xs transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isPaid ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{fee.type}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                    <span>Due: {formatDate(fee.dueDate)}</span>
                    {isPaid && fee.paidDate && (
                      <span className="text-emerald-700 font-medium">Paid: {formatDate(fee.paidDate)}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4">
                <div className="text-left sm:text-right">
                  <p className="text-sm font-bold text-slate-900">{formatCurrency(fee.amount)}</p>
                  <span
                    className={`inline-block text-[10px] font-bold px-2 py-0.2 rounded-full border uppercase ${
                      isPaid
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {isPaid ? 'PAID' : 'PENDING'}
                  </span>
                </div>

                {isPaid ? (
                  <button
                    onClick={() => handleOpenReceipt(fee)}
                    className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5" /> Receipt
                  </button>
                ) : (
                  <button
                    onClick={() => handleOpenPay(fee)}
                    className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                  >
                    Pay Online
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Payment Gateway Modal */}
      {showPayModal && selectedFee && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in"
          onClick={() => !isProcessing && setShowPayModal(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">CampusHub Secure Checkout</h3>
              </div>
              <button
                disabled={isProcessing}
                onClick={() => setShowPayModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] text-slate-500 uppercase font-semibold">Payable Invoice</p>
                <h4 className="text-xs font-bold text-slate-900 mt-0.5">{selectedFee.type}</h4>
              </div>
              <p className="text-lg font-black text-blue-600">{formatCurrency(selectedFee.amount)}</p>
            </div>

            {/* Payment Method Tabs */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-2">Select Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setPayMethod('UPI')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    payMethod === 'UPI'
                      ? 'border-blue-600 bg-blue-50/50 text-blue-700 font-bold'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <Smartphone className="w-4 h-4 mx-auto mb-1 text-blue-600" />
                  <span className="text-xs">UPI / QR</span>
                </button>
                <button
                  onClick={() => setPayMethod('CARD')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    payMethod === 'CARD'
                      ? 'border-blue-600 bg-blue-50/50 text-blue-700 font-bold'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <CreditCard className="w-4 h-4 mx-auto mb-1 text-indigo-600" />
                  <span className="text-xs">Debit / Card</span>
                </button>
                <button
                  onClick={() => setPayMethod('NETBANKING')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    payMethod === 'NETBANKING'
                      ? 'border-blue-600 bg-blue-50/50 text-blue-700 font-bold'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <Building className="w-4 h-4 mx-auto mb-1 text-emerald-600" />
                  <span className="text-xs">Net Banking</span>
                </button>
              </div>
            </div>

            {payMethod === 'UPI' && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-2">
                <div className="p-3 bg-white inline-block rounded-xl border border-slate-200 shadow-2xs">
                  <QrCode className="w-24 h-24 text-slate-900 mx-auto" />
                </div>
                <p className="text-[11px] text-slate-500 font-mono">UPI ID: campushub.fees@hdfcbank</p>
                <p className="text-[10px] text-slate-400">Scan with GPay, PhonePe, Paytm, or BHIM</p>
              </div>
            )}

            <div className="pt-2">
              <button
                disabled={isProcessing}
                onClick={handleConfirmPayment}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Verifying Bank Gateway...
                  </>
                ) : (
                  `Authorize & Pay ${formatCurrency(selectedFee.amount)}`
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official Receipt Modal */}
      <FeeReceiptModal
        isOpen={showReceiptModal}
        onClose={() => setShowReceiptModal(false)}
        feeItem={selectedFee}
      />
    </div>
  );
}
