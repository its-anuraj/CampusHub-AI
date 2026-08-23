import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

const SEED_POSTS = [
  {
    id: 'p-1',
    title: 'How to prepare for Dynamic Programming in Technical Rounds?',
    content:
      'Any recommended problem sets or patterns for mastering 2D DP and Bitmask DP before upcoming campus placement season?',
    author: 'Anuraj Singh',
    category: 'Career & Placements',
    isAnonymous: false,
    tags: ['DSA', 'Placements', 'Algorithms', 'Interviews'],
    likes: 24,
    replies: 8,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'p-2',
    title: 'Operating Systems Deadlock Bank Algorithm doubts',
    content:
      'Can someone explain safety state vs safe sequence with a quick numerical example from today’s lecture by Dr. Anita?',
    author: 'Sneha Roy',
    category: 'Academics',
    isAnonymous: false,
    tags: ['Operating Systems', 'Academics', 'CS503'],
    likes: 15,
    replies: 4,
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 'p-3',
    title: 'Annual TechFest Hackathon 2026 Registration Open!',
    content:
      '48-hour AI & Web3 Hackathon happening next weekend in Computing Lab. Prizes worth ₹1,50,000. Team sizes 2-4 members.',
    author: 'ACM Student Chapter',
    category: 'Campus Events',
    isAnonymous: false,
    tags: ['Hackathon', 'TechFest', 'Events', 'Prizes'],
    likes: 56,
    replies: 19,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
];

// GET /api/discussion
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search')?.toLowerCase() || '';

    let posts = SEED_POSTS;

    if (category && category !== 'ALL') {
      posts = posts.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      posts = posts.filter(
        (p) =>
          p.title.toLowerCase().includes(search) ||
          p.content.toLowerCase().includes(search) ||
          p.tags.some((t) => t.toLowerCase().includes(search))
      );
    }

    return NextResponse.json({ success: true, posts });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/discussion
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, author, isAnonymous, tags, category } = body;

    if (!title || !content) {
      return NextResponse.json({ success: false, error: 'Title and content are required' }, { status: 400 });
    }

    const newPost = {
      id: `p-${Date.now()}`,
      title,
      content,
      author: isAnonymous ? 'Anonymous Scholar' : author || 'Campus Student',
      isAnonymous: Boolean(isAnonymous),
      category: category || 'General Academics',
      tags: Array.isArray(tags) ? tags : [],
      likes: 1,
      replies: 0,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, post: newPost });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
