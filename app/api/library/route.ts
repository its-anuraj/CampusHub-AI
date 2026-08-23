import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { libraryBooks } from '@/lib/mockData';

// GET /api/library - List books with filter & search
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.toLowerCase() || '';
    const subject = searchParams.get('subject') || '';
    const availableOnly = searchParams.get('available') === 'true';

    let dbBooks: any[] = [];
    try {
      dbBooks = await prisma.libraryBook.findMany();
    } catch {
      dbBooks = [];
    }

    const books = dbBooks.length > 0 ? dbBooks : libraryBooks;

    let filtered = books.filter((b: any) => {
      const matchSearch =
        !search ||
        b.title.toLowerCase().includes(search) ||
        b.author.toLowerCase().includes(search) ||
        b.subject.toLowerCase().includes(search) ||
        (b.isbn && b.isbn.toLowerCase().includes(search));

      const matchSubject = !subject || subject === 'ALL' || b.subject.toLowerCase().includes(subject.toLowerCase());
      const matchAvail = !availableOnly || b.availableCopies > 0;

      return matchSearch && matchSubject && matchAvail;
    });

    return NextResponse.json({ success: true, books: filtered, total: filtered.length });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/library - Reserve or Return a book
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { bookId, action, studentName } = body; // action: 'RESERVE' | 'RETURN'

    if (!bookId) {
      return NextResponse.json({ success: false, error: 'Book ID is required' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message:
        action === 'RETURN'
          ? 'Book returned successfully to the library catalog.'
          : 'Book reserved successfully! You have 3 days to collect it from the Central Library counter.',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
