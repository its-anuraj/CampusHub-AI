'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, BookOpen, Code2, FileText, Lightbulb } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const QUICK_PROMPTS = [
  { icon: BookOpen, label: 'Explain a topic', prompt: 'Explain Binary Search Trees in simple terms with examples' },
  { icon: Code2, label: 'Coding help', prompt: 'Help me solve the two-sum problem in Python' },
  { icon: FileText, label: 'Summarize notes', prompt: 'Summarize the key concepts of Operating Systems for my exam' },
  { icon: Lightbulb, label: 'Study plan', prompt: 'Create a 7-day study plan for my upcoming mid-semester exams' },
];

export default function StudentAIChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', role: 'assistant', content: 'Hello! I am your AI Campus Tutor. Ask me any questions regarding course material, exam preparation, coding algorithms, or career advice.', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const msg = text || input;
    if (!msg.trim()) return;
    setInput('');

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: msg, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    await new Promise(r => setTimeout(r, 800));

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: `Here is a structured explanation regarding **"${msg}"**:\n\n1. **Core Architecture**: Key concepts revolve around optimized data structures and algorithmic complexity.\n2. **Best Practices**: Ensure proper error handling, clear code modularity, and memory management.\n3. **Exam Focus**: Pay attention to time complexity calculations (Big-O notation) and edge-case testing.`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, aiMsg]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] max-w-4xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-blue-50 border border-blue-100 text-blue-600">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 leading-none">AI Campus Assistant</h1>
            <p className="text-[11px] text-slate-500 leading-tight mt-0.5">Powered by Gemini AI • Contextual Tutor</p>
          </div>
        </div>
        <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Online</span>
      </div>

      {/* Prompts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {QUICK_PROMPTS.map((p) => {
          const Icon = p.icon;
          return (
            <button key={p.label} onClick={() => sendMessage(p.prompt)}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 transition-all text-left text-xs text-slate-700 font-medium cursor-pointer shadow-xs">
              <Icon className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
              <span className="truncate">{p.label}</span>
            </button>
          );
        })}
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto space-y-3 bg-white border border-slate-200 rounded-2xl p-5 shadow-card">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${
              msg.role === 'assistant' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
            }`}>
              {msg.role === 'assistant' ? 'AI' : 'You'}
            </div>
            <div className={`max-w-[80%] rounded-2xl p-3.5 text-xs leading-relaxed ${
              msg.role === 'assistant'
                ? 'bg-slate-50 border border-slate-200/80 text-slate-800'
                : 'bg-blue-600 text-white font-medium'
            }`}>
              <div className="whitespace-pre-wrap">{msg.content}</div>
              <p className={`text-[9px] mt-1.5 ${msg.role === 'assistant' ? 'text-slate-400' : 'text-blue-100'}`}>
                {msg.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-2 text-xs text-slate-400 items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping" /> Generating response...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Ask AI tutor anything..."
          className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 shadow-xs"
        />
        <button
          onClick={() => sendMessage()}
          disabled={!input.trim() || loading}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold disabled:opacity-50 transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
        >
          <Send className="w-3.5 h-3.5" /> Send
        </button>
      </div>
    </div>
  );
}
