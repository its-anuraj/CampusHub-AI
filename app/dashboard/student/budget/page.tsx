'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Wallet, 
  TrendingDown, 
  Plus, 
  PieChart, 
  ArrowLeft, 
  CreditCard, 
  DollarSign, 
  AlertTriangle,
  Receipt,
  Sparkles
} from 'lucide-react';

export default function StudentBudgetPage() {
  const [data, setData] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food & Dining');
  const [paymentMethod, setPaymentMethod] = useState('UPI');

  const fetchBudget = async () => {
    const res = await fetch('/api/student-budget');
    const json = await res.json();
    if (json.success) setData(json.data);
  };

  useEffect(() => {
    fetchBudget();
  }, []);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount) return;

    const res = await fetch('/api/student-budget', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, amount: Number(amount), category, paymentMethod })
    });
    const json = await res.json();
    if (json.success) {
      setShowModal(false);
      setTitle('');
      setAmount('');
      fetchBudget();
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-amber-900/40 via-orange-900/30 to-slate-900/40 p-6 rounded-2xl border border-amber-500/20 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 text-amber-400 mb-1">
            <Link href="/dashboard/student" className="flex items-center gap-1 hover:underline text-xs">
              <ArrowLeft className="w-3 h-3" /> Back to Dashboard
            </Link>
            <span className="text-slate-500">•</span>
            <span className="text-xs font-semibold uppercase tracking-wider">Financial Literacy</span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Wallet className="w-6 h-6 text-amber-400" />
            Campus Personal Budget & Expense Manager
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Track daily living costs, dining charges, course material expenses, and budget savings limits.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs rounded-xl transition shadow-lg shadow-amber-600/20 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Expense Log
        </button>
      </div>

      {data && (
        <>
          {/* Top Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">Monthly Budget Cap</span>
              <div className="text-2xl font-bold text-white">₹{data.monthlyLimit.toLocaleString()}</div>
              <span className="text-[11px] text-slate-500">Configured target limit</span>
            </div>

            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">Total Spent This Month</span>
              <div className="text-2xl font-bold text-amber-400">₹{data.totalSpent.toLocaleString()}</div>
              <span className="text-[11px] text-amber-500/80">
                {((data.totalSpent / data.monthlyLimit) * 100).toFixed(0)}% of limit consumed
              </span>
            </div>

            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">Remaining Allowance</span>
              <div className="text-2xl font-bold text-emerald-400">₹{data.balanceRemaining.toLocaleString()}</div>
              <span className="text-[11px] text-emerald-500/80">Safe spending zone</span>
            </div>
          </div>

          {/* Transactions & Category Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* History Table */}
            <div className="lg:col-span-8 bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-4">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Receipt className="w-4 h-4 text-amber-400" /> Recent Campus Transactions
              </h3>

              <div className="divide-y divide-slate-800">
                {data.expenses.map((exp: any) => (
                  <div key={exp.id} className="py-3 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-semibold text-white">{exp.title}</h4>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                        <span className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-300">{exp.category}</span>
                        <span>• {exp.date}</span>
                        <span>• via {exp.paymentMethod}</span>
                      </div>
                    </div>
                    <span className="text-sm font-mono font-bold text-rose-400">-₹{exp.amount}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="lg:col-span-4 bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-4">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <PieChart className="w-4 h-4 text-amber-400" /> Category Breakdown
              </h3>

              <div className="space-y-3">
                {Object.entries(data.categoriesBreakdown).map(([cat, amt]: any) => (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300">{cat}</span>
                      <span className="font-mono text-white font-semibold">₹{amt}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{ width: `${(amt / data.totalSpent) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-md space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-amber-400" /> Record Campus Expense
            </h3>

            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Expense Description</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Lab Manual Xerox & Stationery"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Amount (₹)</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="250"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="Food & Dining">Food & Dining</option>
                  <option value="Books & Supplies">Books & Supplies</option>
                  <option value="Events & Clubs">Events & Clubs</option>
                  <option value="Transit">Transit</option>
                  <option value="Hostel & Personal">Hostel & Personal</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Record Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
