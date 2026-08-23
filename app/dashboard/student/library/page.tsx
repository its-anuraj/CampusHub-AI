'use client';

import { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Bookmark,
  CheckCircle2,
  Clock,
  Filter,
  Loader2,
  AlertCircle,
  QrCode,
  BookMarked,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { libraryBooks } from '@/lib/mockData';
import { useToast } from '@/lib/toastContext';

interface IssuedBook {
  id: string;
  bookId: string;
  title: string;
  author: string;
  issuedDate: string;
  dueDate: string;
  daysRemaining: number;
}

const INITIAL_ISSUED: IssuedBook[] = [
  {
    id: 'iss-1',
    bookId: '1',
    title: 'Introduction to Algorithms (CLRS)',
    author: 'Cormen, Leiserson, Rivest, Stein',
    issuedDate: '2026-08-10',
    dueDate: '2026-08-25',
    daysRemaining: 2,
  },
  {
    id: 'iss-2',
    bookId: '2',
    title: 'Database System Concepts (6th Edition)',
    author: 'Silberschatz, Korth, Sudarshan',
    issuedDate: '2026-08-14',
    dueDate: '2026-08-29',
    daysRemaining: 6,
  },
];

export default function StudentLibraryPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'CATALOG' | 'ISSUED'>('CATALOG');
  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('ALL');
  const [books, setBooks] = useState<any[]>(libraryBooks);
  const [issuedBooks, setIssuedBooks] = useState<IssuedBook[]>(INITIAL_ISSUED);
  const [loading, setLoading] = useState(false);

  const subjects = ['ALL', 'Computer Science', 'Electronics', 'Mathematics', 'Mechanical', 'Management'];

  const filteredBooks = books.filter((b: any) => {
    const matchSearch =
      !search ||
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase()) ||
      b.subject.toLowerCase().includes(search.toLowerCase());
    const matchSubject = selectedSubject === 'ALL' || b.subject.toLowerCase() === selectedSubject.toLowerCase();
    return matchSearch && matchSubject;
  });

  const handleReserve = async (book: any) => {
    if (book.availableCopies <= 0) {
      toast.error('No physical copies currently available to reserve.', 'Out of Stock');
      return;
    }

    // Check if already issued
    if (issuedBooks.some((b) => b.bookId === book.id)) {
      toast.warning('You already have this book issued.', 'Duplicate Request');
      return;
    }

    setLoading(true);
    try {
      // Optimistic update
      setBooks((prev) =>
        prev.map((b) => (b.id === book.id ? { ...b, availableCopies: Math.max(0, b.availableCopies - 1) } : b))
      );

      const newIssued: IssuedBook = {
        id: `iss-${Date.now()}`,
        bookId: book.id,
        title: book.title,
        author: book.author,
        issuedDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
        daysRemaining: 14,
      };

      setIssuedBooks([newIssued, ...issuedBooks]);
      toast.success(`"${book.title}" reserved! Pick it up from Central Library within 3 days.`, 'Reservation Confirmed');
    } catch {
      toast.error('Failed to reserve book.');
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = (issueId: string, title: string, bookId: string) => {
    setIssuedBooks(issuedBooks.filter((b) => b.id !== issueId));
    setBooks((prev) =>
      prev.map((b) => (b.id === bookId ? { ...b, availableCopies: b.availableCopies + 1 } : b))
    );
    toast.success(`"${title}" returned successfully. Thank you!`, 'Book Returned');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Campus Library Catalog</h1>
          <p className="text-xs text-slate-500 mt-1">
            Search 15,000+ textbooks, check real-time shelf availability, and manage your borrowed book loans
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('CATALOG')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'CATALOG' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Catalog Explorer ({books.length})
          </button>
          <button
            onClick={() => setActiveTab('ISSUED')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'ISSUED' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>My Active Loans</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-100 text-blue-800 font-bold">
              {issuedBooks.length}
            </span>
          </button>
        </div>
      </div>

      {activeTab === 'CATALOG' ? (
        <>
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3.5 py-2 w-full sm:max-w-md shadow-2xs focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-600/10 transition-all">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                placeholder="Search title, author, ISBN code..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent text-xs text-slate-900 placeholder:text-slate-400 outline-none flex-1"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              {subjects.map((sub) => (
                <button
                  key={sub}
                  onClick={() => setSelectedSubject(sub)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    selectedSubject === sub
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>

          {/* Book Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBooks.map((book) => {
              const isIssued = issuedBooks.some((b) => b.bookId === book.id);
              const hasCopies = book.availableCopies > 0;

              return (
                <div
                  key={book.id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-start gap-3.5">
                      <div className="w-12 h-16 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 shadow-inner">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">{book.title}</h3>
                        <p className="text-[11px] text-slate-500 mt-1">{book.author}</p>
                        <div className="flex items-center gap-1.5 mt-2">
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                            {book.subject}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="text-[11px]">
                      <span className="text-slate-400 block text-[10px]">Stock:</span>
                      <strong className={hasCopies ? 'text-emerald-700 font-semibold' : 'text-rose-600 font-semibold'}>
                        {book.availableCopies} available
                      </strong>
                    </div>

                    <button
                      onClick={() => handleReserve(book)}
                      disabled={!hasCopies || isIssued}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        isIssued
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : hasCopies
                          ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                      }`}
                    >
                      {isIssued ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" /> Issued
                        </>
                      ) : hasCopies ? (
                        <>
                          <BookMarked className="w-3.5 h-3.5" /> Reserve
                        </>
                      ) : (
                        'Out of Stock'
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* My Issued Books Tab */
        <div className="space-y-4">
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 flex items-center gap-3 text-amber-900 text-xs">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <p>
              Please return books before their due dates to prevent overdue fines (₹5/day). Books can be renewed online once if no reservations are pending.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {issuedBooks.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-14 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 line-clamp-2">{item.title}</h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">{item.author}</p>
                      <p className="text-[10px] text-slate-400 mt-1">Issued: {item.issuedDate}</p>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      item.daysRemaining <= 3
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}
                  >
                    {item.daysRemaining} days left
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-600">
                    Due: <strong>{item.dueDate}</strong>
                  </span>
                  <button
                    onClick={() => handleReturn(item.id, item.title, item.bookId)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-500" /> Return Book
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
