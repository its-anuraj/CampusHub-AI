import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { apiSuccess, apiError } from '@/lib/apiResponse';

const MOCK_COUNSELORS = [
  {
    id: 'coun-1',
    name: 'Dr. Maya Sen, Ph.D.',
    role: 'Senior Clinical Psychologist & Wellness Lead',
    experience: '14+ Years',
    specialties: ['Academic Stress & Burnout', 'Anxiety & Panic Relief', 'Career Transition'],
    availableSlots: ['Today 03:00 PM', 'Tomorrow 10:30 AM', 'Tomorrow 04:00 PM'],
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'coun-2',
    name: 'Dr. Rajesh Nair, MD',
    role: 'Chief Campus Medical Officer',
    experience: '18+ Years',
    specialties: ['General Medicine', 'Sleep Hygiene', 'Physical Health Consultations'],
    availableSlots: ['Daily 09:00 AM - 01:00 PM (Walk-ins)'],
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80'
  }
];

const EMERGENCY_HELPLINES = [
  { name: '24/7 Campus Emergency Medical SOS', phone: '+91 1800 233 9911', desc: 'On-campus ambulance dispatch (< 4 min ETA)' },
  { name: 'National Tele-MANAS Mental Health Support', phone: '14416 (Toll-Free)', desc: '24x7 Government certified psychological counseling' },
  { name: 'Campus Security Control Room', phone: '+91 98765 00100', desc: 'Emergency security patrol and hostel wardens' }
];

export async function GET() {
  try {
    return apiSuccess({
      counselors: MOCK_COUNSELORS,
      helplines: EMERGENCY_HELPLINES,
      moodHistory: [
        { date: '2026-08-20', mood: 'FOCUSED', score: 8 },
        { date: '2026-08-21', mood: 'STRESSED', score: 4 },
        { date: '2026-08-22', mood: 'CALM', score: 7 },
        { date: '2026-08-23', mood: 'ENERGIZED', score: 9 },
        { date: '2026-08-24', mood: 'CALM', score: 8 },
      ]
    });
  } catch (err: any) {
    return apiError(err.message || 'Failed to fetch wellness data');
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === 'BOOK_COUNSELING') {
      const { counselor, slot, isAnonymous } = body;
      return apiSuccess({
        appointmentId: `WLN-${Math.floor(1000 + Math.random() * 9000)}`,
        counselor: counselor || 'Dr. Maya Sen',
        slot: slot || 'Tomorrow 10:30 AM',
        isAnonymous: Boolean(isAnonymous),
        venue: 'Campus Wellness Sanctuary • Room 204 (Private Consultation Suite)',
        status: 'CONFIRMED'
      }, 'Confidential counseling session confirmed');
    }

    if (action === 'LOG_MOOD') {
      const { mood, notes } = body;
      return apiSuccess({ mood, notes, timestamp: new Date().toISOString() }, 'Daily mood check-in logged');
    }

    return apiError('Invalid action');
  } catch (err: any) {
    return apiError(err.message || 'Failed to process wellness action');
  }
}
