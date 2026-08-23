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
} from 'lucide-react';
import { useToast } from '@/lib/toastContext';

interface StudyTask {
  id: string;
  title: string;
  subject: string;
  duration: number; // in mins
  completed: boolean;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

const INITIAL_TASKS: StudyTask[] = [
  { id: '1', title: 'Revise Dynamic Programming algorithms (Knapsack & LCS)', subject: 'Design & Analysis of Algorithms', duration: 45, completed: false, priority: 'HIGH' },
  { id: '2', title: 'Practice SQL Indexing and B-Tree indexing queries', subject: 'Database Management Systems', duration: 30, completed: true, priority: 'MEDIUM' },
  { id: '3', title: 'Complete Computer Networks subnetting worksheet', subject: 'Computer Networks', duration: 25, completed: false, priority: 'HIGH' },
  { id: '4', title: 'Read Operating Systems Chapter 7 (Virtual Memory)', subject: 'Operating Systems', duration: 40, completed: false, priority: 'LOW' },
];

export default function StudyPlannerPage() {
  const { toast } = useToast();

  // Timer states
  const [mode, setMode] = useState<'FOCUS' | 'SHORT_BREAK' | 'LONG_BREAK'>('FOCUS');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(3);
  const [streakDays, setStreakDays] = useState(5);

  // Task states
  const [tasks, setTasks] = useState<StudyTask[]>(INITIAL_TASKS);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskSubject, setNewTaskSubject] = useState('Computer Science');
  const [newTaskDuration, setNewTaskDuration] = useState(30);

  // Timer mode durations
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
        toast.success('Focus session completed! Great job. Time for a short break.', 'Pomodoro Master');
        handleModeChange('SHORT_BREAK');
      } else {
        toast.info('Break ended! Ready to focus on the next goal?', 'Break Completed');
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
    toast.success(`Task "${newTask.title}" added to your study schedule.`, 'Task Scheduled');
  };

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((t) => {
        if (t.id === id) {
          const nextState = !t.completed;
          if (nextState) toast.success(`Completed: ${t.title}`, 'Great Progress!');
          return { ...t, completed: nextState };
        }
        return t;
      })
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
    toast.info('Task removed from planner.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">AI Study Planner & Pomodoro</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 uppercase">Focus Pro</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Smart interval study sessions, personalized syllabus targets, and AI focus insights</p>
        </div>

        {/* Daily Streak Counter */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800">
            <Flame className="w-4 h-4 text-amber-600 fill-amber-500" />
            <span className="text-xs font-bold">{streakDays} Day Study Streak</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Pomodoro Focus Engine */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center">
            {/* Mode Selectors */}
            <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl mb-6">
              <button
                onClick={() => handleModeChange('FOCUS')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  mode === 'FOCUS' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Focus (25m)
              </button>
              <button
                onClick={() => handleModeChange('SHORT_BREAK')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  mode === 'SHORT_BREAK' ? 'bg-white text-emerald-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Short Break (5m)
              </button>
              <button
                onClick={() => handleModeChange('LONG_BREAK')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  mode === 'LONG_BREAK' ? 'bg-white text-violet-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Long Break (15m)
              </button>
            </div>

            {/* Timer Display */}
            <div className="relative my-4 flex items-center justify-center">
              <div className="w-56 h-56 rounded-full border-4 border-slate-100 flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-white shadow-inner">
                <span className="text-5xl font-black tracking-tight text-slate-900 font-mono">{formatTime(timeLeft)}</span>
                <span className="text-[11px] font-medium text-slate-400 mt-2 uppercase tracking-wider">
                  {mode === 'FOCUS' ? 'Deep Work Cycle' : 'Rest & Refresh'}
                </span>
              </div>
            </div>

            {/* Timer Controls */}
            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={toggleTimer}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer ${
                  isRunning
                    ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20'
                }`}
              >
                {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                <span>{isRunning ? 'Pause' : 'Start Focus'}</span>
              </button>
              <button
                onClick={resetTimer}
                className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                title="Reset Timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Completed sessions counter */}
            <div className="mt-6 pt-5 border-t border-slate-100 w-full flex items-center justify-around text-xs">
              <div>
                <p className="text-slate-400 text-[10px]">Today Completed</p>
                <p className="font-bold text-slate-800 text-sm mt-0.5">{completedSessions} Sessions</p>
              </div>
              <div className="h-6 w-px bg-slate-200" />
              <div>
                <p className="text-slate-400 text-[10px]">Total Focus Time</p>
                <p className="font-bold text-slate-800 text-sm mt-0.5">{completedSessions * 25} Minutes</p>
              </div>
            </div>
          </div>

          {/* AI Strategy Advice */}
          <div className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-2xl p-5 text-white shadow-md">
            <div className="flex items-center gap-2 text-blue-200 mb-2">
              <Sparkles className="w-4 h-4 text-blue-300" />
              <h3 className="text-xs font-bold uppercase tracking-wider">AI Study Coach Tip</h3>
            </div>
            <p className="text-xs text-blue-100 leading-relaxed">
              Based on your upcoming Mid-Term exam schedule in 4 days, your retention is 38% higher when studying <span className="text-amber-300 font-semibold">Design & Analysis of Algorithms</span> in 25-minute intervals followed by active problem solving.
            </p>
          </div>
        </div>

        {/* Right Column: Goal Checklist & Schedule */}
        <div className="lg:col-span-7 space-y-6">
          {/* Add Goal Form */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-600" /> Add Focus Target
            </h2>
            <form onSubmit={handleAddTask} className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="What topic will you conquer next? (e.g. Graph BFS & DFS)"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:border-blue-600 outline-none"
              />
              <select
                value={newTaskSubject}
                onChange={(e) => setNewTaskSubject(e.target.value)}
                className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white outline-none"
              >
                <option value="Design & Analysis of Algorithms">DAA</option>
                <option value="Database Management Systems">DBMS</option>
                <option value="Computer Networks">Networks</option>
                <option value="Operating Systems">OS</option>
                <option value="General Revision">General</option>
              </select>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors shadow-xs"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </form>
          </div>

          {/* Goal List */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900">Today&apos;s Target Checklist</h2>
              <span className="text-[11px] text-slate-500 font-medium">
                {tasks.filter((t) => t.completed).length} of {tasks.length} Done
              </span>
            </div>

            <div className="space-y-2.5">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-start justify-between p-3.5 rounded-xl border transition-all ${
                    task.completed ? 'bg-slate-50/60 border-slate-100 opacity-60' : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className="mt-0.5 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                    </button>
                    <div className="min-w-0">
                      <p className={`text-xs font-semibold ${task.completed ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                          {task.subject}
                        </span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {task.duration}m
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-1 text-slate-300 hover:text-rose-600 transition-colors cursor-pointer ml-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
