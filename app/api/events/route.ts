import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { apiSuccess, apiError } from '@/lib/apiResponse';

const MOCK_EVENTS = [
  {
    id: 'evt-1',
    title: 'HackNova 2026: 36-Hour National AI Hackathon',
    description: 'Build cutting-edge agentic AI, LLM agents, and Web3 applications. ₹2.5 Lakhs in cash prizes with top tech VC judges.',
    category: 'HACKATHON',
    venue: 'Campus Innovation Hub & Auditorium',
    date: '2026-09-12T09:00:00.000Z',
    time: '09:00 AM - 09:00 PM (36 Hours)',
    organizer: 'Department of Computer Science & ACM Chapter',
    maxCapacity: 250,
    registered: 184,
    status: 'UPCOMING',
    bannerUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=60'
  },
  {
    id: 'evt-2',
    title: 'Generative AI & LLM Systems Hands-on Workshop',
    description: 'End-to-end prompt engineering, RAG architectures with vector embeddings, and fine-tuning on cloud GPUs.',
    category: 'WORKSHOP',
    venue: 'Advanced Computing Lab 3',
    date: '2026-08-30T10:00:00.000Z',
    time: '10:00 AM - 04:00 PM',
    organizer: 'Google Developer Group (GDG On-Campus)',
    maxCapacity: 80,
    registered: 76,
    status: 'UPCOMING',
    bannerUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=60'
  },
  {
    id: 'evt-3',
    title: 'Vibrance 2026: Annual Cultural & Musical Extravaganza',
    description: 'Inter-college battle of bands, classical dance, pro-night with live celebrity musical performance.',
    category: 'CULTURAL',
    venue: 'Main Campus Stadium Ground',
    date: '2026-10-05T17:00:00.000Z',
    time: '05:00 PM - 11:00 PM',
    organizer: 'Student Cultural Council',
    maxCapacity: 2000,
    registered: 1420,
    status: 'UPCOMING',
    bannerUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=60'
  }
];

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');

    let events: any[] = [];
    try {
      events = await prisma.campusEvent.findMany({
        where: category && category !== 'ALL' ? { category } : undefined,
        orderBy: { date: 'asc' }
      });
    } catch {
      // fallback
    }

    const data = events.length > 0 ? events : MOCK_EVENTS.filter(e => !category || category === 'ALL' || e.category === category);
    return apiSuccess(data);
  } catch (err: any) {
    return apiError(err.message || 'Failed to fetch events');
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === 'REGISTER') {
      const { eventId, studentName, rollNumber, email } = body;
      const ticketCode = `CHUB-TCK-${Math.floor(100000 + Math.random() * 900000)}`;

      let reg;
      try {
        reg = await prisma.eventRegistration.create({
          data: {
            eventId,
            studentName: studentName || 'Alex Kumar',
            rollNumber: rollNumber || '23CSE042',
            email: email || 'alex@campushub.edu',
            ticketCode,
          }
        });
      } catch {
        reg = {
          id: `reg-${Date.now()}`,
          eventId,
          studentName: studentName || 'Alex Kumar',
          rollNumber: rollNumber || '23CSE042',
          email: email || 'alex@campushub.edu',
          ticketCode,
          checkedIn: false,
          registeredAt: new Date().toISOString()
        };
      }

      return apiSuccess({ registration: reg, ticketCode }, 'Successfully registered for event');
    }

    return apiError('Invalid action');
  } catch (err: any) {
    return apiError(err.message || 'Failed to register for event');
  }
}
