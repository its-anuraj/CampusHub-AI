'use client';

import { useState } from 'react';
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
  FileText,
  Eye,
  DollarSign,
  X,
  Book
} from 'lucide-react';
import { libraryBooks } from '@/lib/mockData';
import { useToast } from '@/lib/toastContext';
import { cn } from '@/lib/utils';

interface IssuedBook {
  id: string;
  bookId: string;
  title: string;
  author: string;
  issuedDate: string;
  dueDate: string;
  daysRemaining: number;
  fineAmount: number;
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
    fineAmount: 0
  },
  {
    id: 'iss-2',
    bookId: '2',
    title: 'Database System Concepts (6th Edition)',
    author: 'Silberschatz, Korth, Sudarshan',
    issuedDate: '2026-08-14',
    dueDate: '2026-08-29',
    daysRemaining: 6,
    fineAmount: 0
  },
];

export default function StudentLibraryPage() {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<'CATALOG' | 'ISSUED'>('CATALOG');
  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('ALL');
  const [books, setBooks] = useState<any[]>(libraryBooks);
  const [issuedBooks, setIssuedBooks] = useState<IssuedBook[]>(INITIAL_ISSUED);
  const [eBookReader, setEBookReader] = useState<any>(null);
  const [reservationModal, setReservationModal] = useState<any>(null);

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
      addToast({
        title: 'Out of Stock',
        message: 'No physical copies currently available on shelf.',
        type: 'warning'
      });
      return;
    }

    if (issuedBooks.some((b) => b.bookId === book.id)) {
      addToast({
        title: 'Already Issued',
        message: 'You already have an active loan for this book.',
        type: 'warning'
      });
      return;
    }

    const reservationCode = `LIB-RES-${Math.floor(100000 + Math.random() * 900000)}`;
    setReservationModal({
      book,
      code: reservationCode,
      holdTill: new Date(Date.now() + 48 * 3600 * 1000).toLocaleString()
    });

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
      fineAmount: 0
    };

    setIssuedBooks([newIssued, ...issuedBooks]);
    addToast({
      title: 'Book Reserved on Hold!',
      message: `"${book.title}" held at Central Library circulation desk for 48 hours.`,
      type: 'success'
    });
  };

  const handleRenewBook = (issueId: string, title: string) => {
    setIssuedBooks(prev => prev.map(b => {
      if (b.id === issueId) {
        return {
          ...b,
          dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
          daysRemaining: 14
        };
      }
      return b;
    }));
    addToast({
      title: 'Loan Extended (+14 Days)',
      message: `Due date for "${title}" has been successfully extended.`,
      type: 'success'
    });
  };

  const handleReturn = (issueId: string, title: string, bookId: string) => {
    setIssuedBooks(issuedBooks.filter((b) => b.id !== issueId));
    setBooks((prev) =>
      prev.map((b) => (b.id === bookId ? { ...b, availableCopies: b.availableCopies + 1 } : b))
    );
    addToast({
      title: 'Book Returned',
      message: `"${title}" returned to library shelf without overdue fine.`,
      type: 'success'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-700 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5 text-yellow-300" /> Digital & Physical Library Hub
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Smart Campus Library & E-Book Portal</h1>
          <p className="text-white/90 text-sm sm:text-base">
            Search 15,000+ textbooks, check real-time shelf copies, reserve books online, read digital PDF chapters, and manage active loans.
          </p>
        </div>
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Control Strip */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-card p-4 rounded-2xl border border-border shadow-xs">
        {/* Tab switch */}
        <div className="flex items-center gap-1.5 p-1 bg-muted rounded-xl">
          <button
            onClick={() => setActiveTab('CATALOG')}
            className={cn(
              "px-4 py-2 rounded-lg text-xs font-semibold transition-all",
              activeTab === 'CATALOG' ? "bg-card text-blue-600 dark:text-blue-400 shadow-xs" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Catalog Explorer ({books.length})
          </button>
          <button
            onClick={() => setActiveTab('ISSUED')}
            className={cn(
              "px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5",
              activeTab === 'ISSUED' ? "bg-card text-blue-600 dark:text-blue-400 shadow-xs" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <span>My Active Loans</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold">
              {issuedBooks.length}
            </span>
          </button>
        </div>

        {activeTab === 'CATALOG' && (
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 sm:w-60">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search title, author, ISBN..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-background border border-border rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-3 py-2 text-xs bg-background border border-border rounded-xl font-medium focus:ring-2 focus:ring-blue-500"
            >
              {subjects.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Catalog Grid */}
      {activeTab === 'CATALOG' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book: any) => {
            const isAvailable = book.availableCopies > 0;
            return (
              <div
                key={book.id}
                className="bg-card border border-border hover:border-blue-500/50 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 transition"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-muted text-foreground">
                      {book.subject}
                    </span>
                    <span className={cn(
                      "px-2.5 py-0.5 rounded-full text-xs font-semibold",
                      isAvailable ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" :
                      "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                    )}>
                      {isAvailable ? `${book.availableCopies} Available` : 'Reserved Out'}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-foreground line-clamp-2">{book.title}</h3>
                  <p className="text-xs text-muted-foreground">{book.author}</p>
                  <p className="text-[10px] text-muted-foreground font-mono">ISBN: {book.isbn}</p>
                </div>

                <div className="pt-3 border-t border-border/60 flex items-center gap-2">
                  <button
                    onClick={() => setEBookReader(book)}
                    className="flex-1 py-2 px-3 rounded-xl border border-border hover:bg-muted text-xs font-semibold flex items-center justify-center gap-1 transition"
                  >
                    <Eye className="w-3.5 h-3.5 text-blue-500" /> Read E-Book
                  </button>
                  <button
                    onClick={() => handleReserve(book)}
                    disabled={!isAvailable}
                    className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-xs font-semibold flex items-center justify-center gap-1 shadow-xs transition"
                  >
                    <Bookmark className="w-3.5 h-3.5" /> Reserve Copy
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Issued Books View */
        <div className="space-y-4">
          {issuedBooks.length === 0 ? (
            <div className="p-12 text-center bg-card border border-border rounded-2xl space-y-2">
              <BookOpen className="w-8 h-8 text-muted-foreground mx-auto" />
              <p className="text-sm font-semibold text-foreground">No active book loans</p>
              <p className="text-xs text-muted-foreground">Explore the catalog to reserve course textbooks.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {issuedBooks.map((item) => (
                <div key={item.id} className="p-5 rounded-2xl bg-card border border-border space-y-4 shadow-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-foreground">{item.title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.author}</p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400">
                      {item.daysRemaining} Days Left
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-muted/40 p-3 rounded-xl">
                    <div>
                      <span className="text-muted-foreground block">Issue Date</span>
                      <strong className="text-foreground">{item.issuedDate}</strong>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Return Due</span>
                      <strong className="text-foreground">{item.dueDate}</strong>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRenewBook(item.id, item.title)}
                      className="flex-1 py-2 rounded-xl border border-border hover:bg-muted text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Renew (+14d)
                    </button>
                    <button
                      onClick={() => handleReturn(item.id, item.title, item.bookId)}
                      className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Return Book
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* E-Book Reader Modal */}
      {eBookReader && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-start pb-3 border-b border-border">
              <div>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">CAMPUS DIGITAL READER</span>
                <h3 className="font-bold text-lg text-foreground">{eBookReader.title}</h3>
                <p className="text-xs text-muted-foreground">Author: {eBookReader.author}</p>
              </div>
              <button onClick={() => setEBookReader(null)} className="p-1 rounded text-muted-foreground hover:bg-muted">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 rounded-xl bg-muted/30 border border-border space-y-3 text-xs leading-relaxed">
              <h4 className="font-bold text-sm text-foreground">Chapter 1: Foundational Principles & Architecture</h4>
              <p className="text-muted-foreground">
                In computational systems design, data structure selection directly impacts algorithmic runtime complexity (Big-O notation).
                Efficient pointer-based traversals, balanced search trees (AVL, Red-Black), and amortized analysis ensure sub-millisecond query latency across distributed nodes.
              </p>
              <div className="p-3 bg-muted rounded-lg font-mono text-[11px] text-foreground">
                <code>{`// Time Complexity: O(log N) search and insertion\nfunction binarySearchTreeLookup(node, key) {\n  if (!node || node.val === key) return node;\n  return key < node.val ? binarySearchTreeLookup(node.left, key) : binarySearchTreeLookup(node.right, key);\n}`}</code>
              </div>
              <p className="text-muted-foreground">
                This digital edition is licensed for authorized university student research. 12 chapters available offline.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setEBookReader(null)}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
              >
                Done Reading
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reservation Holding Pass Modal */}
      {reservationModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="space-y-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                SHELF HOLD RESERVATION
              </span>
              <h3 className="font-bold text-base text-foreground mt-2">{reservationModal.book.title}</h3>
              <p className="text-xs text-muted-foreground font-mono">Code: {reservationModal.code}</p>
            </div>

            <div className="p-4 bg-white rounded-2xl shadow-inner inline-block mx-auto">
              <QrCode className="w-40 h-40 text-slate-900 mx-auto" />
            </div>

            <p className="text-xs text-muted-foreground">
              Present this QR to Library Counter to collect your book within 48 hours.
            </p>

            <button
              onClick={() => setReservationModal(null)}
              className="w-full py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
