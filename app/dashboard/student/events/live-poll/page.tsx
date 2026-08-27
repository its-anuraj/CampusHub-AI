'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BarChart2, 
  ThumbsUp, 
  MessageSquare, 
  Send, 
  CheckCircle, 
  ArrowLeft, 
  Flame, 
  Users, 
  Sparkles,
  Trophy
} from 'lucide-react';

export default function LivePollPage() {
  const [poll, setPoll] = useState<any>(null);
  const [votedOption, setVotedOption] = useState<string | null>(null);
  const [newQuestion, setNewQuestion] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchPoll = async () => {
    const res = await fetch('/api/events/live-poll');
    const json = await res.json();
    if (json.success) setPoll(json.data);
  };

  useEffect(() => {
    fetchPoll();
  }, []);

  const handleVote = async (optionId: string) => {
    if (votedOption) return;
    setVotedOption(optionId);

    const res = await fetch('/api/events/live-poll', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'VOTE', optionId })
    });
    const json = await res.json();
    if (json.success) setPoll(json.data);
  };

  const handleUpvote = async (questionId: string) => {
    const res = await fetch('/api/events/live-poll', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'UPVOTE', questionId })
    });
    const json = await res.json();
    if (json.success) setPoll(json.data);
  };

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;
    setLoading(true);

    try {
      const res = await fetch('/api/events/live-poll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'ASK_QUESTION', questionText: newQuestion })
      });
      const json = await res.json();
      if (json.success) {
        setPoll(json.data);
        setNewQuestion('');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-rose-900/40 via-pink-900/30 to-slate-900/40 p-6 rounded-2xl border border-rose-500/20 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 text-rose-400 mb-1">
            <Link href="/dashboard/student/events" className="flex items-center gap-1 hover:underline text-xs">
              <ArrowLeft className="w-3 h-3" /> Back to Events
            </Link>
            <span className="text-slate-500">•</span>
            <span className="text-xs font-semibold uppercase tracking-wider">Live Interaction Arena</span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <BarChart2 className="w-6 h-6 text-rose-400" />
            Hackathon Live Audience Voting & Q&A Wall
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Cast real-time votes for finalists, submit live presentation inquiries, and upvote burning tech questions.
          </p>
        </div>

        {poll && (
          <div className="flex items-center gap-2 bg-slate-950/60 px-4 py-2.5 rounded-xl border border-slate-800 text-xs">
            <Users className="w-4 h-4 text-rose-400" />
            <span className="text-slate-300 font-semibold">{poll.totalVotes} Live Votes Cast</span>
          </div>
        )}
      </div>

      {poll && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Live Voting Arena */}
          <div className="lg:col-span-7 bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 uppercase tracking-wider mb-1">
                <Trophy className="w-4 h-4" /> Grand Finale Audience Choice Award
              </div>
              <h2 className="text-base font-bold text-white leading-snug">{poll.question}</h2>
            </div>

            <div className="space-y-3">
              {poll.options.map((opt: any) => (
                <div
                  key={opt.id}
                  onClick={() => handleVote(opt.id)}
                  className={`p-4 rounded-xl border transition relative overflow-hidden ${
                    votedOption === opt.id
                      ? 'border-rose-500/60 bg-rose-950/40 ring-1 ring-rose-500'
                      : 'border-slate-800 bg-slate-950/50 hover:border-slate-700 cursor-pointer'
                  }`}
                >
                  <div
                    className="absolute left-0 top-0 bottom-0 bg-rose-600/15 transition-all duration-500"
                    style={{ width: `${opt.percentage}%` }}
                  />

                  <div className="relative z-10 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white">{opt.title}</h4>
                      <span className="text-[11px] text-slate-400">{opt.votes} votes</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-rose-400 font-mono">{opt.percentage}%</span>
                      {votedOption === opt.id && <CheckCircle className="w-4 h-4 text-rose-400" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {votedOption && (
              <p className="text-xs text-center text-emerald-400 font-medium">
                ✓ Your vote has been verified and registered on the live auditorium scoreboard!
              </p>
            )}
          </div>

          {/* Live Q&A Wall */}
          <div className="lg:col-span-5 bg-slate-900/60 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-rose-400" /> Live Jury & Audience Q&A Stream
            </h3>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {poll.questionsQueue.map((q: any) => (
                <div key={q.id} className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1.5">
                  <p className="text-xs text-slate-200">{q.text}</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
                    <span>Asked by {q.author}</span>
                    <button
                      onClick={() => handleUpvote(q.id)}
                      className="flex items-center gap-1 text-rose-400 hover:text-rose-300 font-medium cursor-pointer"
                    >
                      <ThumbsUp className="w-3 h-3" /> {q.upvotes}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleAsk} className="pt-2 border-t border-slate-800 space-y-2">
              <input
                type="text"
                value={newQuestion}
                onChange={e => setNewQuestion(e.target.value)}
                placeholder="Ask presenting team a technical question..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
              />
              <button
                type="submit"
                disabled={loading || !newQuestion.trim()}
                className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs rounded-xl transition shadow-lg shadow-rose-600/20 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" /> Post Question to Stream
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
