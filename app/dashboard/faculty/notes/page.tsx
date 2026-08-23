'use client';

import { useState } from 'react';
import {
  BookOpen,
  Plus,
  Download,
  Trash2,
  FileText,
  FileCode,
  FileSpreadsheet,
  Search,
  Eye,
  CheckCircle2,
  UploadCloud,
  Sparkles,
  Filter,
} from 'lucide-react';
import { useToast } from '@/lib/toastContext';

interface NoteResource {
  id: string;
  title: string;
  courseCode: string;
  courseName: string;
  type: 'SLIDES' | 'LAB_MANUAL' | 'EXAM_PAPER' | 'CODE_ZIP';
  fileSize: string;
  uploadDate: string;
  downloadsCount: number;
}

const INITIAL_NOTES: NoteResource[] = [
  {
    id: 'n-1',
    title: 'Unit 3: Balanced Binary Search Trees (AVL & Red-Black Trees)',
    courseCode: 'CS501',
    courseName: 'Data Structures & Algorithms',
    type: 'SLIDES',
    fileSize: '4.2 MB',
    uploadDate: '20 Aug 2026',
    downloadsCount: 142,
  },
  {
    id: 'n-2',
    title: 'Lab Manual 4: Socket Programming with TCP/UDP in C++',
    courseCode: 'CS504',
    courseName: 'Computer Networks',
    type: 'LAB_MANUAL',
    fileSize: '1.8 MB',
    uploadDate: '18 Aug 2026',
    downloadsCount: 98,
  },
  {
    id: 'n-3',
    title: 'Mid-Semester Exam 2025 Solved Question Paper with Answer Key',
    courseCode: 'CS501',
    courseName: 'Data Structures & Algorithms',
    type: 'EXAM_PAPER',
    fileSize: '2.5 MB',
    uploadDate: '12 Aug 2026',
    downloadsCount: 210,
  },
  {
    id: 'n-4',
    title: 'B-Tree Indexing and Query Optimization Scripts (PostgreSQL)',
    courseCode: 'CS502',
    courseName: 'Database Management Systems',
    type: 'CODE_ZIP',
    fileSize: '650 KB',
    uploadDate: '08 Aug 2026',
    downloadsCount: 76,
  },
];

export default function FacultyNotesPage() {
  const { toast } = useToast();
  const [notes, setNotes] = useState<NoteResource[]>(INITIAL_NOTES);
  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('ALL');
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Upload Form State
  const [title, setTitle] = useState('');
  const [courseCode, setCourseCode] = useState('CS501');
  const [type, setType] = useState<'SLIDES' | 'LAB_MANUAL' | 'EXAM_PAPER' | 'CODE_ZIP'>('SLIDES');

  const filteredNotes = notes.filter((n) => {
    const matchCourse = courseFilter === 'ALL' || n.courseCode === courseFilter;
    const matchSearch =
      !search ||
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.courseName.toLowerCase().includes(search.toLowerCase());
    return matchCourse && matchSearch;
  });

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.warning('Please enter resource title.');
      return;
    }

    const courseNames: Record<string, string> = {
      CS501: 'Data Structures & Algorithms',
      CS504: 'Computer Networks',
      CS502: 'Database Management Systems',
    };

    const newNote: NoteResource = {
      id: `n-${Date.now()}`,
      title: title.trim(),
      courseCode,
      courseName: courseNames[courseCode] || 'Computer Science',
      type,
      fileSize: `${(Math.random() * 4 + 1).toFixed(1)} MB`,
      uploadDate: 'Just now',
      downloadsCount: 0,
    };

    setNotes([newNote, ...notes]);
    setTitle('');
    setShowUploadModal(false);
    toast.success(`"${newNote.title}" uploaded and shared with student portals!`, 'Material Published');
  };

  const handleDelete = (id: string) => {
    setNotes(notes.filter((n) => n.id !== id));
    toast.info('Study material removed.');
  };

  const getIcon = (t: string) => {
    switch (t) {
      case 'LAB_MANUAL':
        return <FileCode className="w-5 h-5 text-purple-600" />;
      case 'EXAM_PAPER':
        return <FileSpreadsheet className="w-5 h-5 text-amber-600" />;
      case 'CODE_ZIP':
        return <FileCode className="w-5 h-5 text-emerald-600" />;
      default:
        return <FileText className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Course Materials & Lecture Repository</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 uppercase">
              Faculty Hub
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Upload lecture slides, laboratory manuals, past exam papers, and downloadable code samples for enrolled students
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" /> Upload New Material
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3.5 py-2 w-full sm:max-w-md shadow-2xs focus-within:border-blue-600 outline-none">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            placeholder="Search slides, lab sheets, notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-xs text-slate-900 placeholder:text-slate-400 outline-none flex-1"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {['ALL', 'CS501', 'CS504', 'CS502'].map((c) => (
            <button
              key={c}
              onClick={() => setCourseFilter(c)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                courseFilter === c
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {c === 'ALL' ? 'All Courses' : c}
            </button>
          ))}
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNotes.map((note) => (
          <div
            key={note.id}
            className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 shadow-xs transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0">
                  {getIcon(note.type)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-bold px-2 py-0.2 rounded bg-blue-50 text-blue-700 border border-blue-100 font-mono">
                      {note.courseCode}
                    </span>
                    <span className="text-[10px] text-slate-400">{note.fileSize}</span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">{note.title}</h3>
                  <p className="text-[11px] text-slate-500 mt-1">{note.courseName}</p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-500 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-slate-400" /> {note.downloadsCount} Student Downloads
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toast.success(`Downloading "${note.title}"...`, 'File Download')}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
                  title="Download File"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(note.id)}
                  className="p-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 transition-colors cursor-pointer"
                  title="Remove Material"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Material Modal */}
      {showUploadModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in"
          onClick={() => setShowUploadModal(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Upload Course Study Material</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Material Title</label>
                <input
                  type="text"
                  placeholder="e.g. Chapter 4: Memory Hierarchy and Caches"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:border-blue-600 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Target Course</label>
                  <select
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white outline-none"
                  >
                    <option value="CS501">CS501 - Data Structures</option>
                    <option value="CS504">CS504 - Networks</option>
                    <option value="CS502">CS502 - DBMS</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Resource Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white outline-none"
                  >
                    <option value="SLIDES">Lecture Slides (PDF)</option>
                    <option value="LAB_MANUAL">Lab Manual Sheet</option>
                    <option value="EXAM_PAPER">Exam Sample Paper</option>
                    <option value="CODE_ZIP">Source Code Bundle</option>
                  </select>
                </div>
              </div>

              <div className="p-4 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/60 flex flex-col items-center justify-center text-center">
                <UploadCloud className="w-8 h-8 text-blue-600 mb-1" />
                <p className="text-xs font-semibold text-slate-700">Click or drag & drop files here</p>
                <p className="text-[10px] text-slate-400 mt-0.5">PDF, DOCX, PPTX, ZIP (Max 50MB)</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs"
                >
                  Upload & Share
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
