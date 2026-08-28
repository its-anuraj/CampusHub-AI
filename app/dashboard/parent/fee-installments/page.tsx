'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  CreditCard, 
  IndianRupee, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  Zap, 
  ShieldCheck, 
  FileText, 
  RefreshCw,
  Sparkles
} from 'lucide-react';

export default function FeeInstallmentsPage() {
  const [data, setData] = useState<any>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetch('/api/parent/fee-installments')
      .then(res => res.json())
      .then(json => {
        if (json.success) setData(json.data);
      });
  }, []);

  const handlePayNow = async () => {
    setProcessing(true);
    try {
      const res = await fetch('/api/parent/fee-installments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'PAY_NOW' })
      });
      const json = await res.json();
      if (json.success) setData(json.data);
    } finally {
      setProcessing(false);
    }
  };

  const handleToggleAutoDebit = async () => {
    const res = await fetch('/api/parent/fee-installments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'TOGGLE_AUTO_DEBIT' })
    });
    const json = await res.json();
    if (json.success) setData(json.data);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-emerald-900/40 via-teal-900/30 to-slate-900/40 p-6 rounded-2xl border border-emerald-500/20 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 mb-1">
            <Link href="/dashboard/parent/fees" className="flex items-center gap-1 hover:underline text-xs">
              <ArrowLeft className="w-3 h-3" /> Back to Fees Portal
            </Link>
            <span className="text-slate-500">•</span>
            <span className="text-xs font-semibold uppercase tracking-wider">Flexible Tuition EMI & Mandates</span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-emerald-400" />
            Fee Payment Installment Plan & UPI Auto-Debit
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Zero-interest 3-part semester split installment scheduler with automated RBI e-mandate UPI recurring deductions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-900/80 border border-emerald-500/30 px-4 py-2 rounded-2xl text-right">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Remaining Balance</div>
            <div className="text-xl font-bold text-emerald-400 flex items-center gap-1 justify-end">
              <IndianRupee className="w-4 h-4" /> {data?.outstandingInr?.toLocaleString() || '60,000'}
            </div>
          </div>
        </div>
      </div>

      {data && (
        <>
          {/* Top Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-1">
              <div className="text-xs text-slate-400">Total Annual Outlay</div>
              <div className="text-2xl font-bold text-white">₹{data.totalAnnualFeeInr?.toLocaleString()}</div>
              <div className="text-[11px] text-slate-400">{data.planType}</div>
            </div>

            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-1">
              <div className="text-xs text-slate-400">Paid to Date (Audited)</div>
              <div className="text-2xl font-bold text-emerald-400">₹{data.paidSoFarInr?.toLocaleString()}</div>
              <div className="text-[11px] text-emerald-400">2 of 3 Installments Cleared</div>
            </div>

            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-1">
              <div className="text-xs text-slate-400">UPI e-Mandate Auto-Debit</div>
              <div className="text-sm font-bold text-white flex items-center justify-between">
                <span>{data.upiAutoDebitEnabled ? 'Active (Auto)' : 'Disabled'}</span>
                <button
                  onClick={handleToggleAutoDebit}
                  className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-slate-800 text-teal-300 hover:bg-slate-700"
                >
                  {data.upiAutoDebitEnabled ? 'Turn Off' : 'Enable'}
                </button>
              </div>
              <div className="text-[10px] text-slate-400 font-mono truncate">{data.linkedUpiId}</div>
            </div>
          </div>

          {/* Installment Steps */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-white">Installment Milestone Timeline</h2>
            <div className="grid grid-cols-1 gap-4">
              {data.installments?.map((inst: any) => (
                <div key={inst.installmentNumber} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Installment #{inst.installmentNumber}
                      </span>
                      <h3 className="text-sm font-bold text-white">{inst.title}</h3>
                    </div>

                    <div className="text-xs text-slate-400 flex flex-wrap items-center gap-3">
                      <span>Amount: <strong className="text-white">₹{inst.amountInr.toLocaleString()}</strong></span>
                      <span>•</span>
                      <span>Due Date: {inst.dueDate}</span>
                      {inst.paidDate && (
                        <>
                          <span>•</span>
                          <span className="text-emerald-400">Paid on {inst.paidDate} ({inst.transactionRef})</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
                    {inst.status === 'PAID' ? (
                      <span className="px-3.5 py-1.5 bg-emerald-500/20 text-emerald-300 rounded-xl text-xs font-semibold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" /> Paid & Cleared
                      </span>
                    ) : (
                      <button
                        onClick={handlePayNow}
                        disabled={processing}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5"
                      >
                        {processing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />} Pay ₹{inst.amountInr.toLocaleString()} via UPI
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
