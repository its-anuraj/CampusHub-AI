'use client';

import { useState, useEffect } from 'react';
import {
  MessageSquare,
  Star,
  CheckCircle2,
  Lock,
  Sparkles,
  Award,
  BookOpen,
  Send,
  HelpCircle,
  Clock,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/lib/toastContext';

export default function StudentFeedbackPage() {
  const { addToast } = useToast();
  const [surveys, setSurveys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSurvey, setActiveSurvey] = useState<any>(null);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [comments, setComments] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadSurveys() {
      try {
        const res = await fetch('/api/course-feedback');
        if (res.ok) {
          const json = await res.json();
          setSurveys(json.data?.surveys || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadSurveys();
  }, []);

  const handleOpenSurvey = (survey: any) => {
    setActiveSurvey(survey);
    const initial: Record<string, number> = {};
    survey.criteria.forEach((c: any) => {
      initial[c.id] = c.rating || 5;
    });
    setRatings(initial);
    setComments('');
  };

  const handleRatingChange = (criteriaId: string, value: number) => {
    setRatings(prev => ({ ...prev, [criteriaId]: value }));
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSurvey) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/course-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          surveyId: activeSurvey.id,
          ratings,
          comments
        })
      });

      if (res.ok) {
        setSurveys(prev => prev.map(s => s.id === activeSurvey.id ? { ...s, status: 'COMPLETED' } : s));
        addToast({
          title: 'Feedback Submitted (100% Anonymous)',
          message: `Evaluation for ${activeSurvey.courseTitle} recorded in Dean's Quality Assurance registry.`,
          type: 'success'
        });
        setActiveSurvey(null);
      }
    } catch {
      addToast({
        title: 'Error Submitting',
        message: 'Could not submit evaluation.',
        type: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5 text-yellow-300" /> 100% End-to-End Encrypted & Anonymous
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">360° Course & Faculty Evaluation Desk</h1>
          <p className="text-white/90 text-sm sm:text-base">
            Provide candid academic feedback on course pedagogy, laboratory infrastructure, and faculty guidance. Directly influences curriculum enhancement and institutional accreditation.
          </p>
        </div>
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Survey Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {surveys.map((survey) => {
          const isDone = survey.status === 'COMPLETED';
          return (
            <div
              key={survey.id}
              className="bg-card border border-border rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-emerald-500/50 transition"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-muted text-foreground">
                    {survey.courseCode}
                  </span>
                  <span className={cn(
                    "px-2.5 py-0.5 rounded-full text-xs font-semibold",
                    isDone ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" :
                    "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                  )}>
                    {isDone ? 'Completed' : 'Pending Evaluation'}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-foreground">{survey.courseTitle}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Instructor: <strong className="text-foreground">{survey.facultyName}</strong></p>
                </div>

                <div className="text-xs text-muted-foreground flex items-center gap-1.5 pt-2 border-t border-border/60">
                  <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>Due by 10th September 2026</span>
                </div>
              </div>

              <div className="pt-2">
                {isDone ? (
                  <button
                    disabled
                    className="w-full py-2 px-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Feedback Submitted
                  </button>
                ) : (
                  <button
                    onClick={() => handleOpenSurvey(survey)}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5 transition"
                  >
                    <Star className="w-3.5 h-3.5" /> Fill Feedback Survey
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Survey Evaluation Modal */}
      {activeSurvey && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-start pb-3 border-b border-border">
              <div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">ANONYMOUS EVALUATION</span>
                <h3 className="font-bold text-lg text-foreground">{activeSurvey.courseTitle} ({activeSurvey.courseCode})</h3>
                <p className="text-xs text-muted-foreground">Instructor: {activeSurvey.facultyName}</p>
              </div>
              <button onClick={() => setActiveSurvey(null)} className="p-1 rounded-lg text-muted-foreground hover:bg-muted">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitFeedback} className="space-y-4">
              <div className="space-y-3">
                {activeSurvey.criteria.map((crit: any) => {
                  const currentVal = ratings[crit.id] || 5;
                  return (
                    <div key={crit.id} className="p-3.5 rounded-xl bg-muted/40 border border-border/60 space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-semibold text-foreground">{crit.label}</label>
                        <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                          {currentVal} / 5 Stars
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => handleRatingChange(crit.id, star)}
                            className="p-1 hover:scale-110 transition-transform"
                          >
                            <Star
                              className={cn(
                                "w-6 h-6",
                                star <= currentVal
                                  ? "text-amber-500 fill-amber-500"
                                  : "text-muted-foreground/40"
                              )}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">
                  Constructive Suggestions & Comments (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Share constructive feedback regarding lecture pacing, assignments, or recommendations..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-background border border-border rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveSurvey(null)}
                  className="px-4 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md shadow-emerald-500/20 disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  {submitting ? 'Encrypting & Submitting...' : 'Submit Anonymous Evaluation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
