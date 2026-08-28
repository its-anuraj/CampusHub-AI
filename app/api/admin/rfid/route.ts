import { NextResponse } from 'next/server';
import { apiSuccess, apiError } from '@/lib/apiResponse';

let accessPoints = [
  {
    doorId: 'RFID-LAB-401',
    name: 'Advanced Robotics & AI Research Lab',
    building: 'Tech Block 4th Floor',
    lockType: 'Mifare DESFire EV3 + Biometric Fingerprint',
    accessTier: 'RESTRICTED_RESEARCHERS',
    authorizedUsersCount: 38,
    todayTapsCount: 142,
    lockBatteryPct: 92,
    status: 'SECURE_LOCKED'
  },
  {
    doorId: 'RFID-SERVER-01',
    name: 'Central Datacenter & Server Core Room',
    building: 'Admin Block Ground Floor',
    lockType: 'Dual-Custody Keycard + Facial Recognition',
    accessTier: 'ADMIN_ONLY',
    authorizedUsersCount: 6,
    todayTapsCount: 18,
    lockBatteryPct: 100,
    status: 'SECURE_LOCKED'
  },
  {
    doorId: 'RFID-LIB-ARCHIVE',
    name: 'Rare Manuscripts & Digital Heritage Archive',
    building: 'Central Library Floor 3',
    lockType: 'RFID Smart Handle',
    accessTier: 'FACULTY_AND_SCHOLARS',
    authorizedUsersCount: 85,
    todayTapsCount: 54,
    lockBatteryPct: 88,
    status: 'SECURE_LOCKED'
  }
];

export async function GET() {
  return apiSuccess({
    accessPoints,
    totalLocksOnline: accessPoints.length,
    activeKeycardsIssued: 11450,
    tamperAlertsToday: 0
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { doorId, action } = body;

    if (!doorId) {
      return apiError('Missing door lock identifier', 400);
    }

    return apiSuccess({
      doorId,
      action: action || 'REMOTE_UNLOCK_MOMENTARY',
      unlockDurationSeconds: 10,
      authorizedBy: 'Admin Security Supervisor'
    }, 'Remote door strike pulsed for momentary entry', 200);
  } catch {
    return apiError('Failed to trigger door lock strike', 500);
  }
}
