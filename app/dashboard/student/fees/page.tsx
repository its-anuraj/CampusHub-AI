'use client';

import { useState, useEffect } from 'react';
import { CreditCard, CheckCircle2, Clock, Download, Loader2 } from 'lucide-react';
import { formatDate, formatCurrency } from '@/lib/utils';
import { feeRecords } from '@/lib/mockData';

export default function StudentFeesPage() {
  const [payingId, setPayingId] = useState<string | null>(null);
  const [paidIds, setPaidIds] = useState<string[]>([]);

  const total = feeRecords.reduce((a: number, b: any) => a + b.amount, 0);
  const paid = feeRecords.filter((f: any) => f.status === 'PAID').reduce((a: number, b: any) => a + b.amount, 0);
  const pending = feeRecords.filter((f: any) => f.status !== 'PAID').reduce((a: number, b: any) => a + b.amount, 0);

  const handlePay = async (id: string) => {
    setPayingId(id);
    await new Promise(r => setTimeout(r, 1200));
    setPaidIds(prev => [...prev, id]);
    setPayingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Fee Statement & Online Payments</h1>
          <p className="text-xs text-slate-500 mt-1">Academic Year 2026-27 • Semester 5 Billing Ledger</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-card">
          <p className="text-xs font-medium text-slate-500">Total Billed Amount</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(total)}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-card">
          <p className="text-xs font-medium text-slate-500">Total Paid</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{formatCurrency(paid)}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-card">
          <p className="text-xs font-medium text-slate-500">Outstanding Balance</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{formatCurrency(pending)}</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-card space-y-2">
        <div className="flex justify-between text-xs font-medium">
          <span className="text-slate-700">Settlement Status</span>
          <span className="text-slate-500">{Math.round((paid / total) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2">
          <div className="h-2 rounded-full bg-blue-600 transition-all duration-500" style={{ width: `${(paid / total) * 100}%` }} />
        </div>
      </div>

      <div className="space-y-3">
        {feeRecords.map((fee: any) => {
          const isPaid = fee.status === 'PAID' || paidIds.includes(fee.id);
          const isCurrentlyPaying = payingId === fee.id;
          return (
            <div key={fee.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">{fee.type}</h3>
                <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-400" /> Due: {formatDate(fee.dueDate)}</span>
                  {fee.receipt && <span className="font-mono text-[11px] text-slate-400">Ref: {fee.receipt}</span>}
                </div>
              </div>

              <div className="flex items-center gap-4 flex-shrink-0">
                <span className="text-base font-bold text-slate-900">{formatCurrency(fee.amount)}</span>
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-semibold border ${
                  isPaid ? 'badge-success' : 'badge-warning'
                }`}>{isPaid ? 'PAID' : fee.status}</span>

                {!isPaid && (
                  <button
                    onClick={() => handlePay(fee.id)}
                    disabled={isCurrentlyPaying}
                    className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <CreditCard className="w-3.5 h-3.5" /> Pay Now
                  </button>
                )}
                {isPaid && (
                  <button className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors" title="Download Receipt">
                    <Download className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
