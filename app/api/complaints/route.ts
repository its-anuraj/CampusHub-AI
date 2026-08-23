import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

const INITIAL_COMPLAINTS = [
  {
    id: 'CMP-2026-001',
    title: 'Hostel Block B 3rd Floor Wi-Fi router disconnection',
    description: 'Wi-Fi connectivity has been dropping frequently since yesterday evening in rooms 301-315.',
    category: 'INTERNET',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    submittedBy: 'Anuraj Singh (CS2023-042)',
    assignedTo: 'Network Operations Team',
    createdAt: '2026-08-22T10:30:00Z',
    slaHours: 24,
  },
  {
    id: 'CMP-2026-002',
    title: 'Water dispenser cooling issue in Mechanical Block',
    description: 'The RO water dispenser on 1st floor is not cooling properly.',
    category: 'WATER',
    priority: 'MEDIUM',
    status: 'RESOLVED',
    submittedBy: 'Sneha Patel (ME2023-019)',
    assignedTo: 'Campus Maintenance',
    createdAt: '2026-08-20T14:15:00Z',
    resolvedAt: '2026-08-21T11:00:00Z',
    slaHours: 48,
  },
  {
    id: 'CMP-2026-003',
    title: 'Lab 2 projector flickering during lectures',
    description: 'The HDMI connector on the central podium is loose, causing screen blankouts.',
    category: 'INFRASTRUCTURE',
    priority: 'HIGH',
    status: 'PENDING',
    submittedBy: 'Dr. Priya Sharma',
    assignedTo: 'AV Support Team',
    createdAt: '2026-08-23T08:00:00Z',
    slaHours: 12,
  },
];

// GET /api/complaints
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');

    let complaints = INITIAL_COMPLAINTS;

    if (category && category !== 'ALL') {
      complaints = complaints.filter((c) => c.category.toUpperCase() === category.toUpperCase());
    }

    if (status && status !== 'ALL') {
      complaints = complaints.filter((c) => c.status.toUpperCase() === status.toUpperCase());
    }

    return NextResponse.json({ success: true, complaints });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/complaints - Register grievance
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, category, priority, submittedBy } = body;

    if (!title || !description) {
      return NextResponse.json({ success: false, error: 'Title and description are required' }, { status: 400 });
    }

    const newTicket = {
      id: `CMP-2026-${Math.floor(100 + Math.random() * 900)}`,
      title,
      description,
      category: category || 'OTHER',
      priority: priority || 'MEDIUM',
      status: 'PENDING',
      submittedBy: submittedBy || 'Student',
      assignedTo: 'Campus Support Desk',
      createdAt: new Date().toISOString(),
      slaHours: priority === 'URGENT' ? 12 : priority === 'HIGH' ? 24 : 48,
    };

    return NextResponse.json({ success: true, ticket: newTicket });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PATCH /api/complaints - Update status
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { ticketId, status, resolutionNotes } = body;

    return NextResponse.json({
      success: true,
      message: `Ticket ${ticketId} updated to ${status}.`,
      updatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
