'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Search, Bookmark, BookmarkCheck as BookMarked, CheckCircle2, Clock, Filter, Loader2 } from 'lucide-react';
import { libraryBooks } from '@/lib/mockData';

export default function StudentLibraryPage() {
  const [search, setSearch] = useState('');
  const [borrowed, setBorrowed] = useState<string[]>([]);
  const [books, setBooks] = useState<any[]>(libraryBooks);
  const [loading, setLoading] = useState(false);

  const filtered = books.filter((b: any) =>
    !search || b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Campus Library Catalog</h1>
          <p className="text-xs text-slate-500 mt-1">Search books, check real-time stock availability, and reserve textbooks</p>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1.5 max-w-md">
        <Search className="w-3.5 h-3.5 text-slate-400" />
        <input placeholder="Search title, author, subject..." value={search} onChange={e => setSearch(e.target.value)}
          className="bg-transparent text-xs text-slate-900 placeholder:text-slate-400 outline-none flex-1" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((book) => {
          const isBorrowed = borrowed.includes(book.id);
          return (
            <div key={book.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-card flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-14 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-semibold text-slate-900 line-clamp-1">{book.title}</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">{book.author}</p>
                    <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200 mt-1.5 inline-block">{book.subject}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  Copies: <strong className={book.availableCopies > 0 ? 'text-emerald-700' : 'text-red-600'}>{book.availableCopies} available</strong>
                </span>
                <button
                  onClick={() => book.available && setBorrowed(p => isBorrowed ? p.filter(id => id !== book.id) : [...p, book.id])}
                  disabled={!book.available && !isBorrowed}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                    isBorrowed ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    book.available ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs' :
                    'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {isBorrowed ? <><CheckCircle2 className="w-3.5 h-3.5" /> Borrowed</> :
                    book.available ? <><BookMarked className="w-3.5 h-3.5" /> Reserve</> : 'Unavailable'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
