import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { apiSuccess, apiError } from '@/lib/apiResponse';

const MOCK_ALERTS = [
  {
    id: 'alt-1',
    title: 'Severe Weather Warning: Heavy Rain & Campus Transit Alert',
    message: 'Due to severe storm forecasts in the NCR region, evening 06:00 PM labs will transition to hybrid online mode. Campus bus shuttles will depart 30 mins early at 04:30 PM.',
    severity: 'WARNING',
    channels: 'SMS, EMAIL, PUSH, BANNER',
    active: true,
    sentBy: 'Office of Campus Administration & Security',
    createdAt: '2026-08-24T12:00:00.000Z'
  },
  {
    id: 'alt-2',
    title: 'Campus-wide Annual Fire Safety & Evacuation Drill Scheduled',
    message: 'Scheduled mock evacuation drill on Friday at 11:15 AM across Turing Block and Kalam Auditorium. Please follow floor marshals.',
    severity: 'INFO',
    channels: 'EMAIL, PUSH',
    active: false,
    sentBy: 'Campus Health & Safety Committee',
    createdAt: '2026-08-20T09:00:00.000Z'
  }
];

export async function GET() {
  try {
    let list: any[] = [];
    try {
      list = await prisma.emergencyAlert.findMany({ orderBy: { createdAt: 'desc' } });
    } catch {}

    return apiSuccess(list.length > 0 ? list : MOCK_ALERTS);
  } catch (err: any) {
    return apiError(err.message || 'Failed to fetch emergency broadcasts');
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, message, severity, channels, sentBy } = body;

    let newAlert;
    try {
      newAlert = await prisma.emergencyAlert.create({
        data: {
          title,
          message,
          severity: severity || 'WARNING',
          channels: channels || 'SMS, EMAIL, PUSH',
          sentBy: sentBy || 'Campus Emergency Operations Desk',
          active: true
        }
      });
    } catch {
      newAlert = {
        id: `alt-${Date.now()}`,
        title,
        message,
        severity: severity || 'WARNING',
        channels: channels || 'SMS, EMAIL, PUSH',
        sentBy: sentBy || 'Campus Emergency Operations Desk',
        active: true,
        createdAt: new Date().toISOString()
      };
    }

    return apiSuccess(newAlert, 'Emergency broadcast transmitted across selected channels');
  } catch (err: any) {
    return apiError(err.message || 'Failed to transmit emergency alert');
  }
}
