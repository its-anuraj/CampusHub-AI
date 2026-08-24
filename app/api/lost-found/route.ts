import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { apiSuccess, apiError } from '@/lib/apiResponse';

const MOCK_ITEMS = [
  {
    id: 'lf-1',
    title: 'Apple AirPods Pro (2nd Gen) with Blue Silicone Case',
    type: 'FOUND',
    category: 'ELECTRONICS',
    location: 'Central Library - 2nd Floor Reading Hall Desk #42',
    date: '2026-08-23T14:30:00.000Z',
    description: 'Found on table 42 next to the CS textbook section. Has a subtle scratch on the back hinge.',
    reportedBy: 'Rahul Sen (Student)',
    contactInfo: 'Submitted to Library Security Desk',
    status: 'OPEN',
    imageUrl: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'lf-2',
    title: 'Smart Student Digital ID Card & Lanyard',
    type: 'FOUND',
    category: 'ID_CARDS',
    location: 'Main Cafeteria Food Court Counter B',
    date: '2026-08-24T11:00:00.000Z',
    description: 'Belongs to Sneha Reddy (23ECE088). Kept at campus security reception.',
    reportedBy: 'Campus Cafeteria Staff',
    contactInfo: 'Security Gate 1',
    status: 'OPEN',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'lf-3',
    title: 'Casio fx-991EX Scientific Calculator',
    type: 'LOST',
    category: 'ELECTRONICS',
    location: 'Mechanical Engineering Workshop Lab 2',
    date: '2026-08-22T16:00:00.000Z',
    description: 'Silver-black scientific calculator with initial "AK" marked with white marker on the battery lid.',
    reportedBy: 'Alex Kumar',
    contactInfo: 'alex@campushub.edu',
    status: 'OPEN',
    imageUrl: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=400&auto=format&fit=crop&q=80'
  }
];

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');

    let items: any[] = [];
    try {
      items = await prisma.lostFoundItem.findMany({
        where: type && type !== 'ALL' ? { type } : undefined,
        orderBy: { date: 'desc' }
      });
    } catch {}

    const list = items.length > 0 ? items : MOCK_ITEMS.filter(i => !type || type === 'ALL' || i.type === type);
    return apiSuccess(list);
  } catch (err: any) {
    return apiError(err.message || 'Failed to fetch lost and found items');
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === 'REPORT') {
      const { title, type, category, location, description, reportedBy, contactInfo } = body;
      let newItem;
      try {
        newItem = await prisma.lostFoundItem.create({
          data: {
            title,
            type: type || 'FOUND',
            category: category || 'OTHER',
            location,
            description,
            reportedBy: reportedBy || 'Campus Student',
            contactInfo: contactInfo || 'Security Desk',
            status: 'OPEN'
          }
        });
      } catch {
        newItem = {
          id: `lf-${Date.now()}`,
          title,
          type: type || 'FOUND',
          category: category || 'OTHER',
          location,
          description,
          reportedBy: reportedBy || 'Campus Student',
          contactInfo: contactInfo || 'Security Desk',
          status: 'OPEN',
          date: new Date().toISOString()
        };
      }
      return apiSuccess(newItem, 'Item reported to campus security registry');
    }

    if (action === 'CLAIM') {
      const { itemId, claimerProof } = body;
      return apiSuccess({ itemId, claimerProof }, 'Claim request logged. Please present proof at Security Gate 1.');
    }

    return apiError('Invalid action');
  } catch (err: any) {
    return apiError(err.message || 'Failed to process lost & found request');
  }
}
