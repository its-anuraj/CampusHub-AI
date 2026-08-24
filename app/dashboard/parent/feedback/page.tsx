'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, Send, CheckCircle2, Clock, ShieldCheck, AlertCircle, Sparkles, User, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/lib/toastContext';

export default function ParentFeedbackPage() {
  const { addToast } = useToast();
  const [feedbackList, setFeedbackList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('ACADEMICS');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchFb() {
      try {
        const res = await fetch('/api/parent-feedback');
        if (res.ok) {
          const json = await res.json();
          setFeedbackList(json.data || json);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchFb();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      addToast({ title: 'Incomplete Form', message: 'Please enter subject and description.', type: 'warning' });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/parent-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          subject,
          message,
          parentName: 'Mr. Rajesh Kumar (Parent of Alex Kumar - 23CSE042)',
          studentRoll: '23CSE042'
        })
      });

      if (res.ok) {
        addToast({
          title: 'Feedback Logged! 📬',
          message: 'Your ticket has been dispatched to the Office of the Dean with an SLA guarantee of 24-48 hours.',
          type: 'success'
        });
        setSubject('');
        setMessage('');
        // Refresh
        const ref = await fetch('/api/parent-feedback');
        if (ref.ok) {
          const json = await ref.json();
          setFeedbackList(json.data || json);
        }
      }
    } catch {
      addToast({ title: 'Error', message: 'Failed to submit feedback', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shadow-xs">
              <MessageSquare className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Parent Grievance & Feedback Portal</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">Direct communication bridge with Deans, HODs, hostel wardens, and institutional management</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5" /> 48-Hour Dean SLA Resolution
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Feedback Submission Form */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-card space-y-4 text-xs">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Send className="w-4 h-4 text-blue-600" /> Submit Query or Concern
          </h3>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Department / Concern Domain</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full border border-slate-200 rounded-xl p-2.5 bg-white text-slate-900 outline-none"
              >
                <option value="ACADEMICS">Academic Progress & Faculty Teaching</option>
                <option value="HOSTEL">Hostel Accommodations & Mess Food</option>
                <option value="TRANSPORT">Campus Bus & Transport Safety</option>
                <option value="FEES">Fee Invoicing & Payments</option>
                <option value="SAFETY">Campus Security & Medical Care</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Subject Title</label>
              <input
                required
                type="text"
                placeholder="Brief summary of your query or suggestion..."
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="w-full border border-slate-200 rounded-xl p-2.5 text-slate-900 outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Detailed Message</label>
              <textarea
                rows={4}
                required
                placeholder="Provide specific details so the Dean / Administrator can investigate directly..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="w-full border border-slate-200 rounded-xl p-2.5 text-slate-900 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              {submitting ? 'Submitting...' : 'Send to Institutional Desk'}
            </button>
          </form>
        </div>

        {/* Feedback History & Dean Responses */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-card space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Historical Tickets & Official Resolutions</h3>

          <div className="space-y-4">
            {feedbackList.map((fb) => (
              <div key={fb.id} className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/70 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 uppercase border border-blue-100">
                    {fb.category}
                  </span>
                  <span className={cn(
                    'text-[10px] font-bold px-2.5 py-0.5 rounded-full',
                    fb.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                  )}>
                    {fb.status}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900">{fb.subject}</h4>
                <p className="text-slate-600 leading-relaxed">{fb.message}</p>

                {fb.response && (
                  <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1 mt-2">
                    <p className="text-[11px] font-bold text-emerald-700 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Dean / Institutional Response:
                    </p>
                    <p className="text-slate-800 text-xs leading-relaxed">{fb.response}</p>
                  </div>
                )}

                <div className="text-[11px] text-slate-400 pt-1">
                  Submitted on: {new Date(fb.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
