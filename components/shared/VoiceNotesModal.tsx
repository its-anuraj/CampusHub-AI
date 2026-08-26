'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Mic,
  Square,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Download,
  Copy,
  FileText,
  X,
  Volume2
} from 'lucide-react';
import { useToast } from '@/lib/toastContext';
import { cn } from '@/lib/utils';

interface VoiceNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveNote?: (note: { title: string; transcript: string; summary: string }) => void;
}

export default function VoiceNotesModal({ isOpen, onClose, onSaveNote }: VoiceNotesModalProps) {
  const { addToast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [aiSummary, setAiSummary] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [noteTitle, setNoteTitle] = useState('Lecture Voice Note - ' + new Date().toLocaleDateString());

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording, isPaused]);

  if (!isOpen) return null;

  const startRecording = () => {
    setIsRecording(true);
    setIsPaused(false);
    setSeconds(0);
    setTranscript('');
    setAiSummary('');
    addToast({
      title: 'Voice Recording Started 🎙️',
      message: 'Speak clearly into your microphone.',
      type: 'info'
    });
  };

  const pauseRecording = () => {
    setIsPaused(!isPaused);
  };

  const stopRecording = () => {
    setIsRecording(false);
    setIsPaused(false);
    setIsTranscribing(true);

    // Simulate AI Whisper / Speech-to-Text transcription
    setTimeout(() => {
      setIsTranscribing(false);
      const sampleTranscript =
        "Today's lecture focused on amortized analysis for self-balancing Binary Search Trees, specifically Splay Trees and AVL Rotations. Remember that double rotations (Left-Right and Right-Left) restore height balance with O(log N) worst-case time complexity. The mid-semester exam will specifically test tree height proofs.";
      const sampleSummary =
        "• Key Topic: Amortized BST Analysis & AVL Rotations\n• Worst-case Complexity: O(log N)\n• Exam Alert: Tree height mathematical proofs to be included in Mid-Sem.";
      setTranscript(sampleTranscript);
      setAiSummary(sampleSummary);
      addToast({
        title: 'Voice Transcribed via AI ✨',
        message: 'Speech converted to text and key takeaways synthesized.',
        type: 'success'
      });
    }, 1200);
  };

  const handleSave = () => {
    if (!transcript) {
      addToast({ title: 'No Content', message: 'Record audio first before saving.', type: 'warning' });
      return;
    }

    if (onSaveNote) {
      onSaveNote({ title: noteTitle, transcript, summary: aiSummary });
    }

    addToast({
      title: 'Voice Note Saved! 📝',
      message: `"${noteTitle}" stored in your campus notebook.`,
      type: 'success'
    });
    onClose();
  };

  const formatDuration = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-start pb-2 border-b border-border">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 inline-flex items-center gap-1">
              <Mic className="w-3.5 h-3.5" /> AI VOICE MEMO & TRANSCRIPTION
            </span>
            <h3 className="text-lg font-bold text-foreground mt-1">Quick Voice Note Recorder</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-xl text-muted-foreground hover:bg-muted">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Note Title Input */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground block mb-1">Note Title</label>
          <input
            type="text"
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-background border border-border rounded-xl font-medium focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Waveform & Recording Canvas Simulator */}
        <div className="bg-muted/40 border border-border rounded-2xl p-6 flex flex-col items-center justify-center space-y-4 text-center">
          <div className="flex items-center justify-center gap-1.5 h-12">
            {[12, 28, 45, 18, 55, 34, 48, 22, 60, 38, 16, 42, 50, 20].map((h, i) => (
              <span
                key={i}
                className={cn(
                  "w-1.5 rounded-full transition-all duration-300",
                  isRecording && !isPaused ? "bg-indigo-600 animate-pulse" : "bg-muted-foreground/30"
                )}
                style={{ height: isRecording && !isPaused ? `${(h * (1 + (i % 3) * 0.2)) % 48 + 10}px` : '8px' }}
              />
            ))}
          </div>

          <div className="space-y-1">
            <span className="text-3xl font-black font-mono tracking-tight text-foreground">
              {formatDuration(seconds)}
            </span>
            <p className="text-xs text-muted-foreground">
              {isRecording ? (isPaused ? 'Recording Paused' : 'Listening...') : 'Ready to record audio note'}
            </p>
          </div>

          {/* Recording Controls */}
          <div className="flex items-center gap-3 pt-2">
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 flex items-center gap-2 transition"
              >
                <Mic className="w-4 h-4" /> Start Recording
              </button>
            ) : (
              <>
                <button
                  onClick={pauseRecording}
                  className="p-3 rounded-2xl bg-muted hover:bg-muted/80 text-foreground transition"
                  title={isPaused ? "Resume" : "Pause"}
                >
                  {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                </button>
                <button
                  onClick={stopRecording}
                  className="px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md flex items-center gap-2 transition"
                >
                  <Square className="w-4 h-4 fill-white" /> Stop & Transcribe
                </button>
              </>
            )}
          </div>
        </div>

        {/* Transcription Output */}
        {isTranscribing && (
          <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-center text-xs text-indigo-600 dark:text-indigo-400 font-semibold flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 animate-spin" /> Transcribing audio with AI Speech Engine...
          </div>
        )}

        {transcript && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <div className="p-3.5 rounded-xl bg-muted/40 border border-border space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Raw Audio Transcript</span>
              <p className="text-xs text-foreground leading-relaxed italic">&ldquo;{transcript}&rdquo;</p>
            </div>

            <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20 space-y-1">
              <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider block flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> AI Summary & Key Takeaways
              </span>
              <p className="text-xs text-foreground leading-relaxed whitespace-pre-line">{aiSummary}</p>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex justify-end gap-2 pt-2 border-t border-border">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-border hover:bg-muted text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!transcript}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition"
          >
            <CheckCircle2 className="w-3.5 h-3.5" /> Save to Course Notes
          </button>
        </div>
      </div>
    </div>
  );
}
