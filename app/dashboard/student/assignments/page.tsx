'use client';

import { useState, useEffect } from 'react';
import { Clock, CheckCircle2, Upload, Star, Search, FileText, Loader2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { assignments } from '@/lib/mockData';

export default function StudentAssignmentsPage() {
  const [filter, setFilter] = useState<string>('ALL');
  const [search, setSearch] = useState('');

  const filtered = assignments.filter((a: any) => {
    if (filter !== 'ALL' && a.status !== filter) return false;
    if (search && !a.title.toLowerCase().includes(search.toLowerCase()) && !a.subject.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const tabs = [
    { label: 'All Tasks', value: 'ALL', count: assignments.length },
    { label: 'Pending', value: 'PENDING', count: assignments.filter((a: any) => a.status === 'PENDING').length },
    { label: 'Submitted', value: 'SUBMITTED', count: assignments.filter((a: any) => a.status === 'SUBMITTED').length },
    { label: 'Graded', value: 'GRADED', count: assignments.filter((a: any) => a.status === 'GRADED').length },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Course Assignments</h1>
          <p className="text-xs text-slate-500 mt-1">Manage coursework submissions, view deadlines, and check faculty grading</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1.5 flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <input
            placeholder="Filter assignments by name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent text-xs text-slate-900 placeholder:text-slate-400 outline-none flex-1"
          />
        </div>
        <div className="flex gap-1 bg-white border border-slate-200 rounded-lg p-1">
          {tabs.map(tab => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                filter === tab.value ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
              <span className={`text-[10px] px-1.5 rounded-full ${filter === tab.value ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>{tab.count}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((asgn: any) => {
          const isOverdue = new Date(asgn.dueDate) < new Date() && asgn.status === 'PENDING';
          return (
            <div key={asgn.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-card hover:border-slate-300 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-semibold px-2 py-0.2 rounded bg-blue-50 text-blue-700 border border-blue-100">{asgn.subject}</span>
                    <span className="text-[10px] text-slate-400">By {asgn.facultyName}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900">{asgn.title}</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{asgn.description}</p>
                  
                  <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-500" /> Total Marks: {asgn.totalMarks}</span>
                    <span className={`flex items-center gap-1 font-medium ${isOverdue ? 'text-red-600' : 'text-slate-600'}`}>
                      <Clock className="w-3.5 h-3.5" /> Due Date: {formatDate(asgn.dueDate)}
                    </span>
                  </div>

                  {asgn.status === 'GRADED' && (
                    <div className="mt-3 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs">
                      <div className="font-semibold text-emerald-800 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Grade Awarded: {asgn.marksObtained} / {asgn.totalMarks}
                      </div>
                      {asgn.feedback && <p className="text-emerald-700 mt-0.5">{asgn.feedback}</p>}
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-semibold border ${
                    asgn.status === 'GRADED' ? 'badge-success' :
                    asgn.status === 'SUBMITTED' ? 'badge-info' : 'badge-warning'
                  }`}>
                    {asgn.status}
                  </span>
                  {asgn.status === 'PENDING' && (
                    <button className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs">
                      <Upload className="w-3.5 h-3.5" /> Submit Work
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
