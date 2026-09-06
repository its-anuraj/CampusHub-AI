'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Terminal, 
  Sparkles, 
  Mic, 
  ArrowLeft, 
  Play, 
  CheckCircle2, 
  Clock, 
  Award, 
  BrainCircuit,
  Volume2,
  RefreshCw
} from 'lucide-react';

export default function MockInterviewPage() {
  const [tracks, setTracks] = useState<any[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<any>(null);
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const [answer, setAnswer] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<any>(null);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    fetch('/api/ai/mock-interview')
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data.tracks.length > 0) {
          setTracks(json.data.tracks);
          setSelectedTrack(json.data.tracks[0]);
        }
      });
  }, []);

  const currentQuestion = selectedTrack?.questions?.[activeQuestionIdx];

  const handleSpeakQuestion = () => {
    if (!currentQuestion) return;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentQuestion.question);
      utterance.rate = 1.0;
      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim() || !selectedTrack) return;
    setIsEvaluating(true);

    try {
      const res = await fetch('/api/ai/mock-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trackId: selectedTrack.id,
          questionId: currentQuestion?.id,
          studentAnswer: answer
        })
      });
      const json = await res.json();
      if (json.success) {
        setEvaluationResult(json.data.evaluation);
      }
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-cyan-900/40 via-blue-900/30 to-slate-900/40 p-6 rounded-2xl border border-cyan-500/20 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 mb-1">
            <Link href="/dashboard/student/placement" className="flex items-center gap-1 hover:underline text-xs">
              <ArrowLeft className="w-3 h-3" /> Back to Placement Cell
            </Link>
            <span className="text-slate-500">•</span>
            <span className="text-xs font-semibold uppercase tracking-wider">AI Bar-Raiser</span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 border-2 border-amber-300 text-[10px] font-black uppercase shadow-xs">
              ✨ AI Module • Coming Soon (Beta Preview)
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-cyan-400" />
            Mock Technical Interview AI Simulator
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Practice real-world coding and system design interviews with AI voice evaluation, rubric feedback, and instant grading.
          </p>
        </div>

        {/* Track Selector Chips */}
        <div className="flex flex-wrap gap-2">
          {tracks.map(t => (
            <button
              key={t.id}
              onClick={() => {
                setSelectedTrack(t);
                setActiveQuestionIdx(0);
                setEvaluationResult(null);
                setAnswer('');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                selectedTrack?.id === t.id
                  ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {t.title}
            </button>
          ))}
        </div>
      </div>

      {currentQuestion && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Question & Terminal Workspace */}
          <div className="lg:col-span-7 space-y-4">
            {/* Question Card */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="px-2 py-0.5 rounded-full font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    Question {activeQuestionIdx + 1} of {selectedTrack.questions.length}
                  </span>
                  <span>• {selectedTrack.difficulty}</span>
                </div>
                <button
                  onClick={handleSpeakQuestion}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    speaking ? 'bg-cyan-500 text-white animate-pulse' : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  {speaking ? 'Speaking...' : 'Listen Question'}
                </button>
              </div>

              <h2 className="text-lg font-semibold text-white leading-relaxed">
                {currentQuestion.question}
              </h2>

              {currentQuestion.hints && (
                <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-3 text-xs text-slate-400">
                  <span className="text-amber-400 font-semibold">💡 Interviewer Hint: </span>
                  {currentQuestion.hints.join(' ')}
                </div>
              )}
            </div>

            {/* Answer Editor */}
            <form onSubmit={handleSubmitAnswer} className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-medium text-white">
                  <Terminal className="w-4 h-4 text-cyan-400" /> Technical Response / Code Breakdown
                </span>
                <span>Markdown & Pseudo-code supported</span>
              </div>
              <textarea
                rows={9}
                placeholder="Structure your thoughts: 1. Core Invariants, 2. Data Structure Selection, 3. Algorithmic Steps, 4. Time & Space Complexity..."
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                className="w-full font-mono bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-sm text-cyan-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
              />
              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-500">
                  {answer.length} characters written
                </div>
                <button
                  type="submit"
                  disabled={isEvaluating || !answer.trim()}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {isEvaluating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Evaluating with AI...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" /> Submit to Interviewer
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* AI Feedback Panel */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-5">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                Interviewer Scorecard & Rubrics
              </h3>

              {evaluationResult ? (
                <div className="space-y-4 animate-in fade-in">
                  <div className="bg-gradient-to-br from-cyan-950/40 to-slate-900 border border-cyan-500/30 rounded-2xl p-5 text-center space-y-1">
                    <div className="text-3xl font-extrabold text-cyan-400">
                      {evaluationResult.score}/100
                    </div>
                    <div className="text-xs font-medium text-slate-300">Technical Evaluation Score</div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Key Strengths
                    </span>
                    <ul className="space-y-1 text-xs text-slate-300">
                      {evaluationResult.strengths?.map((s: string, idx: number) => (
                        <li key={idx} className="bg-emerald-950/20 border border-emerald-500/20 rounded-lg p-2">
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-amber-400">Areas for Deepening:</span>
                    <ul className="space-y-1 text-xs text-slate-300">
                      {evaluationResult.improvementAreas?.map((area: string, idx: number) => (
                        <li key={idx} className="bg-amber-950/20 border border-amber-500/20 rounded-lg p-2">
                          {area}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-300 leading-relaxed">
                    <span className="font-semibold text-cyan-400">Note: </span>
                    {evaluationResult.aiFeedbackNote}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500 text-xs space-y-2">
                  <BrainCircuit className="w-8 h-8 mx-auto text-slate-600 animate-pulse" />
                  <p>Submit your response on the left to receive automated rubric evaluation and AI Bar-Raiser grading.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
