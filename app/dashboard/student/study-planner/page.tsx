'use client';

import { useState, useEffect } from 'react';
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Sparkles,
  Flame,
  BookOpen,
  Calendar,
  Zap,
  Target,
  Volume2,
  FileQuestion,
  HelpCircle,
  X,
  Layers,
  Check,
  RotateCw,
  Award
} from 'lucide-react';
import { useToast } from '@/lib/toastContext';
import { cn } from '@/lib/utils';

interface StudyTask {
  id: string;
  title: string;
  subject: string;
  duration: number;
  completed: boolean;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

interface Flashcard {
  id: string;
  subject: string;
  question: string;
  answer: string;
  box: 1 | 2 | 3; // 1 = Review, 2 = Good, 3 = Mastered
}

const INITIAL_FLASHCARDS: Flashcard[] = [
  { id: 'fc-1', subject: 'Design & Analysis of Algorithms', question: 'What is the time complexity of building a Heap from an array of N elements?', answer: 'O(N) amortized time using the bottom-up Floyd\'s heap construction algorithm.', box: 1 },
  { id: 'fc-2', subject: 'Design & Analysis of Algorithms', question: 'What condition makes the Greedy Choice Property applicable?', answer: 'A global optimum can be arrived at by selecting a local optimum without revisiting past decisions.', box: 2 },
  { id: 'fc-3', subject: 'Database Management Systems', question: 'What is the primary difference between 3NF and BCNF?', answer: 'In BCNF, for every non-trivial functional dependency X -> Y, X MUST be a superkey. 3NF allows Y to be a prime attribute.', box: 1 },
  { id: 'fc-4', subject: 'Database Management Systems', question: 'What is Write-Ahead Logging (WAL)?', answer: 'A technique where changes are written to disk log before the actual database pages are written, ensuring Durability and Atomicity.', box: 3 },
  { id: 'fc-5', subject: 'Operating Systems', question: 'What are the four Coffman conditions for Deadlock?', answer: '1. Mutual Exclusion\n2. Hold and Wait\n3. No Preemption\n4. Circular Wait', box: 2 },
  { id: 'fc-6', subject: 'Operating Systems', question: 'What is Thrashing in Virtual Memory?', answer: 'A state where the CPU spends more time swapping pages in and out of swap space than executing user instructions.', box: 1 },
];

const INITIAL_TASKS: StudyTask[] = [
  { id: '1', title: 'Revise Dynamic Programming algorithms (Knapsack & LCS)', subject: 'Design & Analysis of Algorithms', duration: 45, completed: false, priority: 'HIGH' },
  { id: '2', title: 'Practice SQL Indexing and B-Tree indexing queries', subject: 'Database Management Systems', duration: 30, completed: true, priority: 'MEDIUM' },
  { id: '3', title: 'Complete Computer Networks subnetting worksheet', subject: 'Computer Networks', duration: 25, completed: false, priority: 'HIGH' },
  { id: '4', title: 'Read Operating Systems Chapter 7 (Virtual Memory)', subject: 'Operating Systems', duration: 40, completed: false, priority: 'LOW' },
];

const PREDICTED_QUESTIONS: Record<string, string[]> = {
  'Design & Analysis of Algorithms': [
    'Explain the Divide & Conquer master theorem with 3 recurrence relation examples.',
    'Differentiate between Greedy Approach vs Dynamic Programming with 0/1 Knapsack.',
    'Analyze amortized complexity in Fibonacci heaps and Disjoint-set data structures.'
  ],
  'Database Management Systems': [
    'Illustrate 3NF vs BCNF normal forms with functional dependency anomalies.',
    'Explain ACID transaction guarantees, Write-Ahead Logging (WAL) and 2-Phase Locking.',
    'Compare B+ Tree vs Hash Indexing performance across range scan workloads.'
  ],
  'Operating Systems': [
    'Explain Banker\'s Algorithm for Deadlock Avoidance with safe state matrix.',
    'Compare Virtual Memory Page Replacement: LRU vs FIFO vs Optimal algorithm.',
    'Analyze IPC synchronization using semaphores, mutex locks and monitors.'
  ]
};

export default function StudyPlannerPage() {
  const { addToast } = useToast();

  // Timer states
  const [mode, setMode] = useState<'FOCUS' | 'SHORT_BREAK' | 'LONG_BREAK'>('FOCUS');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(3);
  const [streakDays, setStreakDays] = useState(5);
  const [ambientSound, setAmbientSound] = useState<string | null>(null);

  // AI Exam Predictor Modal
  const [aiPredictModal, setAiPredictModal] = useState(false);
  const [selectedSubjectAi, setSelectedSubjectAi] = useState('Design & Analysis of Algorithms');

  // AI Flashcards Modal & Leitner System
  const [flashcardsModal, setFlashcardsModal] = useState(false);
  const [flashcards, setFlashcards] = useState<Flashcard[]>(INITIAL_FLASHCARDS);
  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedFlashSubject, setSelectedFlashSubject] = useState('ALL');

  // Task states
  const [tasks, setTasks] = useState<StudyTask[]>(INITIAL_TASKS);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskSubject, setNewTaskSubject] = useState('Design & Analysis of Algorithms');
  const [newTaskDuration, setNewTaskDuration] = useState(30);

  const handleLeitnerAnswer = (known: boolean) => {
    const card = activeFlashcards[currentCardIdx];
    if (!card) return;

    setFlashcards((prev) =>
      prev.map((c) => {
        if (c.id === card.id) {
          const newBox = known ? (Math.min(3, c.box + 1) as 1 | 2 | 3) : 1;
          return { ...c, box: newBox };
        }
        return c;
      })
    );

    setIsFlipped(false);
    if (currentCardIdx < activeFlashcards.length - 1) {
      setCurrentCardIdx((prev) => prev + 1);
    } else {
      addToast({
        title: 'Flashcard Sprint Finished! 🧠',
        message: 'Spaced repetition schedule updated for optimal memory retention.',
        type: 'success'
      });
      setCurrentCardIdx(0);
    }
  };

  const activeFlashcards = flashcards.filter(
    (c) => selectedFlashSubject === 'ALL' || c.subject === selectedFlashSubject
  );

  const durations = {
    FOCUS: 25 * 60,
    SHORT_BREAK: 5 * 60,
    LONG_BREAK: 15 * 60,
  };

  const handleModeChange = (newMode: 'FOCUS' | 'SHORT_BREAK' | 'LONG_BREAK') => {
    setMode(newMode);
    setIsRunning(false);
    setTimeLeft(durations[newMode]);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      if (mode === 'FOCUS') {
        setCompletedSessions((prev) => prev + 1);
        addToast({
          title: 'Focus Session Completed! 🍅',
          message: 'Great job! Time for a 5-minute restorative brain break.',
          type: 'success'
        });
        handleModeChange('SHORT_BREAK');
      } else {
        addToast({
          title: 'Break Concluded',
          message: 'Ready to dive back into your next focused study sprint?',
          type: 'info'
        });
        handleModeChange('FOCUS');
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, mode]);

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(durations[mode]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: StudyTask = {
      id: Date.now().toString(),
      title: newTaskTitle.trim(),
      subject: newTaskSubject,
      duration: Number(newTaskDuration) || 25,
      completed: false,
      priority: 'MEDIUM',
    };

    setTasks([newTask, ...tasks]);
    setNewTaskTitle('');
    addToast({
      title: 'Task Scheduled',
      message: `"${newTask.title}" added to your daily focus queue.`,
      type: 'success'
    });
  };

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((t) => {
        if (t.id === id) {
          const nextState = !t.completed;
          if (nextState) addToast({ title: 'Task Completed!', message: `Checked off: ${t.title}`, type: 'success' });
          return { ...t, completed: nextState };
        }
        return t;
      })
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
    addToast({ title: 'Task Removed', message: 'Item deleted from queue.', type: 'info' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-700 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-yellow-300" /> AI Deep Work & Focus Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">AI Study Planner & Pomodoro Arena</h1>
          <p className="text-white/90 text-sm sm:text-base">
            Smart interval focus sessions, ambient study soundscapes, syllabus goal milestones, and AI exam question prediction.
          </p>
        </div>
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Quick Action Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border shadow-xs">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" /> {streakDays} Day Study Streak
          </div>
          <span className="text-xs text-muted-foreground">{completedSessions} Pomodoros Logged Today</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFlashcardsModal(true)}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-500/20 flex items-center gap-1.5 transition"
          >
            <Layers className="w-3.5 h-3.5 text-yellow-300" /> AI Flashcard Arena ({activeFlashcards.length})
          </button>
          <button
            onClick={() => setAiPredictModal(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 flex items-center gap-1.5 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" /> AI High-Yield Exam Predictor
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Pomodoro Focus Engine */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-xs flex flex-col items-center text-center space-y-6">
            {/* Mode Selectors */}
            <div className="flex items-center gap-1.5 p-1 bg-muted rounded-xl">
              <button
                onClick={() => handleModeChange('FOCUS')}
                className={cn(
                  "px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all",
                  mode === 'FOCUS' ? "bg-card text-blue-600 dark:text-blue-400 shadow-xs" : "text-muted-foreground"
                )}
              >
                Focus (25m)
              </button>
              <button
                onClick={() => handleModeChange('SHORT_BREAK')}
                className={cn(
                  "px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all",
                  mode === 'SHORT_BREAK' ? "bg-card text-emerald-600 dark:text-emerald-400 shadow-xs" : "text-muted-foreground"
                )}
              >
                Short Break (5m)
              </button>
              <button
                onClick={() => handleModeChange('LONG_BREAK')}
                className={cn(
                  "px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all",
                  mode === 'LONG_BREAK' ? "bg-card text-purple-600 dark:text-purple-400 shadow-xs" : "text-muted-foreground"
                )}
              >
                Long Break (15m)
              </button>
            </div>

            {/* Timer Clock */}
            <div className="relative flex items-center justify-center">
              <div className="w-56 h-56 rounded-full border-8 border-muted flex items-center justify-center bg-card shadow-inner">
                <span className="text-5xl font-black font-mono tracking-tight text-foreground">
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>

            {/* Timer Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTimer}
                className={cn(
                  "px-6 py-3 rounded-2xl font-bold text-sm text-white shadow-md flex items-center gap-2 transition",
                  isRunning
                    ? "bg-amber-600 hover:bg-amber-700 shadow-amber-500/20"
                    : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/20"
                )}
              >
                {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                <span>{isRunning ? 'Pause Session' : 'Start Focus Sprint'}</span>
              </button>
              <button
                onClick={resetTimer}
                className="p-3 rounded-2xl border border-border hover:bg-muted text-foreground transition"
                title="Reset Timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Ambient Soundscape Toggles */}
            <div className="pt-4 border-t border-border/60 w-full space-y-2">
              <span className="text-xs font-semibold text-muted-foreground block">Ambient Focus Audio</span>
              <div className="flex justify-center gap-2">
                {[
                  { id: 'rain', label: '🌧️ Rain' },
                  { id: 'cafe', label: '☕ Lo-Fi Cafe' },
                  { id: 'white', label: '🌊 White Noise' }
                ].map(snd => (
                  <button
                    key={snd.id}
                    onClick={() => {
                      const next = ambientSound === snd.id ? null : snd.id;
                      setAmbientSound(next);
                      addToast({
                        title: next ? `Audio Activated: ${snd.label}` : 'Audio Muted',
                        message: next ? 'Synthesized binaural ambient noise active.' : 'Ambient sound turned off.',
                        type: 'info'
                      });
                    }}
                    className={cn(
                      "px-3 py-1.5 rounded-xl text-xs font-semibold border transition",
                      ambientSound === snd.id
                        ? "bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400"
                        : "border-border text-muted-foreground hover:bg-muted"
                    )}
                  >
                    {snd.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Task Queue */}
        <div className="lg:col-span-7 space-y-4">
          {/* Add Task Form */}
          <form onSubmit={handleAddTask} className="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <Plus className="w-4 h-4 text-blue-500" /> Add Syllabus Target
            </h3>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="e.g. Solve 3 Dijkstra Shortest Path graph problems..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-background border border-border rounded-xl focus:ring-2 focus:ring-blue-500"
              />
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={newTaskSubject}
                  onChange={(e) => setNewTaskSubject(e.target.value)}
                  className="px-3 py-2 text-xs bg-background border border-border rounded-xl font-medium"
                >
                  <option value="Design & Analysis of Algorithms">Design & Analysis of Algorithms</option>
                  <option value="Database Management Systems">Database Management Systems</option>
                  <option value="Operating Systems">Operating Systems</option>
                  <option value="Computer Networks">Computer Networks</option>
                </select>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min={5}
                    max={180}
                    value={newTaskDuration}
                    onChange={(e) => setNewTaskDuration(Number(e.target.value))}
                    className="w-24 px-3 py-2 text-xs bg-background border border-border rounded-xl font-mono text-center"
                  />
                  <button
                    type="submit"
                    className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition"
                  >
                    Add Task
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* Tasks List */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-foreground flex items-center justify-between">
              <span>Today&apos;s Study Queue</span>
              <span className="text-xs text-muted-foreground">{tasks.filter(t => t.completed).length} / {tasks.length} Completed</span>
            </h3>

            <div className="divide-y divide-border/60">
              {tasks.map((task) => (
                <div key={task.id} className="py-3 flex items-center justify-between gap-3 hover:bg-muted/20 transition">
                  <div className="flex items-center gap-3 min-w-0">
                    <button onClick={() => toggleTask(task.id)} className="text-muted-foreground hover:text-blue-600 shrink-0">
                      {task.completed ? <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500/20" /> : <Circle className="w-5 h-5" />}
                    </button>
                    <div className="min-w-0">
                      <p className={cn("text-xs font-semibold truncate", task.completed ? "line-through text-muted-foreground" : "text-foreground")}>
                        {task.title}
                      </p>
                      <p className="text-[10px] text-muted-foreground">{task.subject} • {task.duration} mins</p>
                    </div>
                  </div>

                  <button onClick={() => deleteTask(task.id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-600 transition">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Exam Predictor Modal */}
      {aiPredictModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start pb-3 border-b border-border">
              <div>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> AI HIGH-YIELD EXAM PREDICTOR
                </span>
                <h3 className="font-bold text-lg text-foreground mt-1">Mid-Semester Question Predictor</h3>
              </div>
              <button onClick={() => setAiPredictModal(false)} className="p-1 rounded text-muted-foreground hover:bg-muted">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-semibold text-muted-foreground block">Select Course Module</label>
              <select
                value={selectedSubjectAi}
                onChange={(e) => setSelectedSubjectAi(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-background border border-border rounded-xl font-medium focus:ring-2 focus:ring-indigo-500"
              >
                {Object.keys(PREDICTED_QUESTIONS).map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold text-foreground">Top Predicted 10-Mark Questions (88% Historical Match)</h4>
                {PREDICTED_QUESTIONS[selectedSubjectAi]?.map((q, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-muted/40 border border-border text-xs text-foreground flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-600 font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <p className="leading-relaxed">{q}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setAiPredictModal(false)}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
              >
                Close & Study Questions
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Flashcard Arena Modal */}
      {flashcardsModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start pb-3 border-b border-border">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 inline-flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5" /> LEITNER SPACED REPETITION ARENA
                </span>
                <h3 className="text-lg font-bold text-foreground mt-1">Smart AI Flashcard Deck</h3>
              </div>
              <button onClick={() => setFlashcardsModal(false)} className="p-1.5 rounded-xl text-muted-foreground hover:bg-muted">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Subject Selector & Leitner Stats */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <select
                value={selectedFlashSubject}
                onChange={(e) => {
                  setSelectedFlashSubject(e.target.value);
                  setCurrentCardIdx(0);
                  setIsFlipped(false);
                }}
                className="px-3 py-1.5 rounded-xl bg-background border border-border font-semibold focus:ring-2 focus:ring-purple-500"
              >
                <option value="ALL">All Subjects ({flashcards.length} Cards)</option>
                <option value="Design & Analysis of Algorithms">Algorithms</option>
                <option value="Database Management Systems">DBMS</option>
                <option value="Operating Systems">Operating Systems</option>
              </select>

              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 font-bold border border-rose-500/20 text-[10px]">
                  Box 1 (Review): {flashcards.filter(c => c.box === 1).length}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 font-bold border border-amber-500/20 text-[10px]">
                  Box 2 (Learning): {flashcards.filter(c => c.box === 2).length}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 font-bold border border-emerald-500/20 text-[10px]">
                  Box 3 (Mastered): {flashcards.filter(c => c.box === 3).length}
                </span>
              </div>
            </div>

            {/* Flashcard Body */}
            {activeFlashcards.length > 0 ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>Card {currentCardIdx + 1} of {activeFlashcards.length}</span>
                  <span className="font-semibold text-purple-600 dark:text-purple-400">
                    {activeFlashcards[currentCardIdx].subject}
                  </span>
                </div>

                <div
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="cursor-pointer min-h-[200px] p-6 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/20 border-2 border-purple-500/30 hover:border-purple-500/60 transition-all flex flex-col justify-between text-center relative shadow-inner"
                >
                  <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                    <span>{isFlipped ? '💡 Answer (Click to Flip)' : '❓ Question (Click to Reveal)'}</span>
                    <RotateCw className="w-3.5 h-3.5 text-purple-500" />
                  </div>

                  <div className="py-6 flex items-center justify-center">
                    <p className="text-base sm:text-lg font-bold text-foreground leading-relaxed whitespace-pre-line">
                      {isFlipped
                        ? activeFlashcards[currentCardIdx].answer
                        : activeFlashcards[currentCardIdx].question}
                    </p>
                  </div>

                  <p className="text-[10px] text-muted-foreground italic">
                    Tap anywhere on the card to flip
                  </p>
                </div>

                {/* Leitner Actions */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => handleLeitnerAnswer(false)}
                    className="flex-1 py-2.5 rounded-xl border border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Need Review (Box 1)
                  </button>
                  <button
                    onClick={() => handleLeitnerAnswer(true)}
                    className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-purple-500/20"
                  >
                    <Check className="w-3.5 h-3.5" /> I Knew This (+Level Up)
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-muted-foreground">
                No flashcards found for selected category.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
