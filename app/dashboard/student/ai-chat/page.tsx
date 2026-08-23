'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  Sparkles,
  BookOpen,
  Code2,
  FileText,
  Lightbulb,
  Copy,
  Trash2,
  Download,
  Check,
  Zap,
  Terminal,
} from 'lucide-react';
import { useToast } from '@/lib/toastContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  codeSnippet?: string;
  timestamp: string;
}

const QUICK_PROMPTS = [
  { icon: Code2, label: 'Dijkstra in C++', prompt: 'Explain and write Dijkstra’s Shortest Path Algorithm in clean modern C++ with step-by-step comments' },
  { icon: BookOpen, label: 'DBMS ACID Properties', prompt: 'Explain the 4 ACID properties in Database Systems with real-world banking transaction examples' },
  { icon: FileText, label: 'TCP 3-Way Handshake', prompt: 'How does the TCP 3-Way Handshake (SYN, SYN-ACK, ACK) prevent duplicate connections?' },
  { icon: Lightbulb, label: '7-Day Midterm Plan', prompt: 'Generate an optimized 7-day study schedule for 5th Semester CS exams' },
];

export default function StudentAIChatPage() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content:
        'Hello Anuraj! I am your AI Academic Tutor & Research Copilot. I can solve coding challenges, explain syllabus theorems, review your lab reports, or generate practice exam questions.',
      timestamp: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text?: string) => {
    const msg = text || input;
    if (!msg.trim()) return;
    setInput('');

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: msg,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    await new Promise((r) => setTimeout(r, 900));

    let aiResponse = `Here is a comprehensive breakdown for **"${msg}"**:\n\n### 1. Conceptual Foundation\nThe core theoretical principle addresses asymptotic efficiency, boundary constraints, and optimal subproblem structures.\n\n### 2. Implementation & Architecture\nWhen applying this pattern, ensure time complexity is bounded by $O(V \\log V + E)$ for dense graphs and spatial overhead is minimized.\n\n### 3. Key University Exam Insights\n- Common pitfall: Negative edge weights or cyclic graph traps.\n- Remember to specify base conditions clearly in your answer script.`;

    let code: string | undefined = undefined;
    if (msg.toLowerCase().includes('code') || msg.toLowerCase().includes('dijkstra') || msg.toLowerCase().includes('c++') || msg.toLowerCase().includes('python')) {
      code = `#include <iostream>
#include <vector>
#include <queue>
using namespace std;

typedef pair<int, int> pii; // {weight, vertex}

void dijkstra(int start, vector<vector<pii>>& adj, int V) {
    priority_queue<pii, vector<pii>, greater<pii>> pq;
    vector<int> dist(V, 1e9);
    
    dist[start] = 0;
    pq.push({0, start});
    
    while (!pq.empty()) {
        auto [d, u] = pq.top();
        pq.pop();
        if (d > dist[u]) continue;
        
        for (auto& edge : adj[u]) {
            int v = edge.first;
            int weight = edge.second;
            if (dist[u] + weight < dist[v]) {
                dist[v] = dist[u] + weight;
                pq.push({dist[v], v});
            }
        }
    }
}`;
    }

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: aiResponse,
      codeSnippet: code,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, aiMsg]);
    setLoading(false);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    toast.success('Code copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    setMessages([messages[0]]);
    toast.info('Chat history cleared.');
  };

  const exportChat = () => {
    const text = messages.map((m) => `[${m.role.toUpperCase()} - ${m.timestamp}]\n${m.content}\n\n`).join('---\n');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `campushub-ai-chat-${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    toast.success('Chat transcript exported.');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] max-w-4xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900">AI Campus Academic Assistant</h1>
            <p className="text-[11px] text-slate-500">Fine-tuned on University Syllabus, DSA, GATE & Lab Material</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportChat}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
            title="Export Chat Transcript"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={clearChat}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-rose-600 transition-colors cursor-pointer"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Prompts Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {QUICK_PROMPTS.map((p) => {
          const Icon = p.icon;
          return (
            <button
              key={p.label}
              onClick={() => sendMessage(p.prompt)}
              className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-blue-50/50 hover:border-blue-300 text-left transition-all cursor-pointer shadow-2xs group"
            >
              <div className="flex items-center gap-1.5 text-blue-600 mb-1">
                <Icon className="w-3.5 h-3.5" />
                <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 truncate">{p.label}</span>
              </div>
              <p className="text-[10px] text-slate-400 line-clamp-1">{p.prompt}</p>
            </button>
          );
        })}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-3 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-white shadow-xs'
              }`}
            >
              {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-blue-400" />}
            </div>

            <div
              className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed space-y-3 ${
                m.role === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-xs'
              }`}
            >
              <div className="whitespace-pre-line">{m.content}</div>

              {/* Code Snippet Box if available */}
              {m.codeSnippet && (
                <div className="rounded-xl bg-slate-950 text-slate-200 p-3.5 font-mono text-[11px] relative overflow-hidden border border-slate-800">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[10px] text-slate-400">
                    <span className="flex items-center gap-1.5 text-blue-400 font-semibold">
                      <Terminal className="w-3.5 h-3.5" /> C++ Solution
                    </span>
                    <button
                      onClick={() => copyToClipboard(m.codeSnippet!, m.id)}
                      className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                    >
                      {copiedId === m.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedId === m.id ? 'Copied' : 'Copy Code'}</span>
                    </button>
                  </div>
                  <pre className="overflow-x-auto">{m.codeSnippet}</pre>
                </div>
              )}

              <span
                className={`text-[9px] block text-right font-mono ${
                  m.role === 'user' ? 'text-blue-200' : 'text-slate-400'
                }`}
              >
                {m.timestamp}
              </span>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <Bot className="w-4 h-4 text-blue-400" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-3.5 shadow-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse delay-75" />
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse delay-150" />
              <span className="text-xs text-slate-500 font-medium ml-1">Synthesizing solution...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl p-2 shadow-sm focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-600/10 transition-all"
      >
        <input
          type="text"
          placeholder="Ask anything (e.g. Explain AVL tree rotations, prove Bayes theorem, debug code)..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-transparent px-3 text-xs text-slate-900 placeholder:text-slate-400 outline-none"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white disabled:text-slate-400 cursor-pointer shadow-xs transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
