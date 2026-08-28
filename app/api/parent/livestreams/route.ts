import { NextResponse } from 'next/server';
import { apiSuccess, apiError } from '@/lib/apiResponse';

let streams = [
  {
    streamId: 'STREAM-CONVOCATION-2026',
    title: '28th Annual University Convocation & Gold Medal Conferral',
    category: 'Institutional Ceremony',
    eventDate: '2026-09-18, 10:00 AM IST',
    streamStatus: 'SCHEDULED_HD',
    chiefGuest: 'Honorable President of India & AICTE Chairman',
    venue: 'Main Campus Grand Amphitheater',
    reservedFamilyVirtualPass: 'VIRT-SEAT-A88',
    streamUrl: 'https://youtube.com/live/campushub-convocation-2026',
    liveChatEnabled: true
  },
  {
    streamId: 'STREAM-SPORTS-MEET',
    title: 'Inter-Collegiate Athletics Championship Finals & Relay',
    category: 'Sports & Cultural',
    eventDate: '2026-09-04, 04:30 PM IST',
    streamStatus: 'UPCOMING_LIVE',
    chiefGuest: 'Olympic Medalist Guest of Honor',
    venue: 'University Olympic Stadium',
    reservedFamilyVirtualPass: 'VIRT-SEAT-B14',
    streamUrl: 'https://youtube.com/live/campushub-sports-meet',
    liveChatEnabled: true
  }
];

export async function GET() {
  return apiSuccess({
    livestreams: streams,
    totalScheduledEvents: streams.length,
    highDefinitionBandwidthReady: true
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { streamId, familyMessage } = body;

    if (!streamId || !familyMessage) {
      return apiError('Missing stream ID or cheer message', 400);
    }

    return apiSuccess({
      messageId: `chat-${Date.now()}`,
      streamId,
      familyMessage,
      sender: 'Parent / Family Member',
      moderationStatus: 'APPROVED'
    }, 'Encouragement message broadcast to convocation big screen live ticker', 201);
  } catch {
    return apiError('Failed to post live stream message', 500);
  }
}
