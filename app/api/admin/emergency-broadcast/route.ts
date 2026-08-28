import { NextResponse } from 'next/server';
import { apiSuccess, apiError } from '@/lib/apiResponse';

let activeBroadcasts = [
  {
    broadcastId: 'EMERG-2026-09',
    severity: 'MEDIUM_ALERT',
    alertType: 'Severe Monsoon Rain & Flash Waterlogging Precaution',
    targetZones: ['All Campus Zones', 'Hostel Blocks A-E', 'Parking Lots'],
    channels: ['Campus Mobile Push', 'SMS Gateway', 'Digital Classroom Signage'],
    messageText: 'Heavy precipitation forecast for next 3 hours. Low-lying pedestrian underpasses temporarily cordoned.',
    dispatchedAt: 'Today 09:15 AM',
    dispatchedBy: 'Campus Security Control Room',
    deliveryStats: { pushed: 8420, smsDelivered: 8390, screensTriggered: 142 }
  }
];

export async function GET() {
  return apiSuccess({
    broadcasts: activeBroadcasts,
    sirenSystemStatus: 'ARMED_AND_READY',
    paSpeakerSystemReady: true,
    totalAudienceCovered: 12450
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { alertType, severity, messageText, targetZones } = body;

    if (!alertType || !messageText) {
      return apiError('Missing required emergency broadcast payload', 400);
    }

    const newBroadcast = {
      broadcastId: `EMERG-${Date.now().toString().slice(-4)}`,
      severity: severity || 'CRITICAL_ALERT',
      alertType,
      targetZones: targetZones || ['All Campus Sectors'],
      channels: ['Campus Mobile Push', 'SMS Emergency Relay', 'PA Speakers Siren'],
      messageText,
      dispatchedAt: new Date().toLocaleTimeString(),
      dispatchedBy: 'Admin Emergency Desk',
      deliveryStats: { pushed: 9200, smsDelivered: 9150, screensTriggered: 156 }
    };

    activeBroadcasts.unshift(newBroadcast);
    return apiSuccess(newBroadcast, 'Emergency siren & multi-channel broadcast fired across campus', 201);
  } catch {
    return apiError('Failed to trigger emergency broadcast', 500);
  }
}
