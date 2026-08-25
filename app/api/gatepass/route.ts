import { NextResponse } from 'next/server';
import { apiSuccess, apiError } from '@/lib/apiResponse';

const MOCK_OUTPASSES = [
  {
    id: 'GP-2026-8819',
    type: 'DAY_OUTPASS',
    reason: 'Library Book Purchase & Stationery at Central Market',
    outTime: '2026-08-25T17:00:00.000Z',
    expectedInTime: '2026-08-25T20:30:00.000Z',
    actualInTime: null,
    status: 'APPROVED',
    approver: 'Dr. R. K. Saxena (Warden Block A)',
    qrPassCode: 'GP-QR-8819-A',
    parentConsent: 'VERIFIED_SMS',
    createdAt: '2026-08-25T14:30:00.000Z'
  },
  {
    id: 'GP-2026-7241',
    type: 'NIGHT_STAY',
    reason: 'Weekend Home Visit to Parents (Noida)',
    outTime: '2026-08-22T18:00:00.000Z',
    expectedInTime: '2026-08-24T08:00:00.000Z',
    actualInTime: '2026-08-24T07:45:00.000Z',
    status: 'COMPLETED',
    approver: 'Chief Warden Office',
    qrPassCode: 'GP-QR-7241-Z',
    parentConsent: 'VERIFIED_CALL',
    createdAt: '2026-08-21T10:00:00.000Z'
  },
  {
    id: 'GP-2026-9042',
    type: 'EMERGENCY_MEDICAL',
    reason: 'Dental Consultation at City Hospital',
    outTime: '2026-08-26T10:00:00.000Z',
    expectedInTime: '2026-08-26T14:00:00.000Z',
    actualInTime: null,
    status: 'PENDING_APPROVAL',
    approver: 'Pending Warden Signature',
    qrPassCode: 'GP-QR-9042-PENDING',
    parentConsent: 'NOTIFIED',
    createdAt: '2026-08-25T22:00:00.000Z'
  }
];

export async function GET() {
  return apiSuccess({
    passes: MOCK_OUTPASSES,
    curfewTime: '09:30 PM',
    activePassCount: 1,
    campusGateStatus: 'OPERATIONAL (Gate 1 & Gate 3 Open)'
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, reason, destination, outTime, inTime, parentPhone } = body;

    if (!reason || !outTime) {
      return apiError('Missing required outpass fields');
    }

    const passId = `GP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPass = {
      id: passId,
      type: type || 'DAY_OUTPASS',
      reason,
      destination: destination || 'City Center',
      outTime,
      expectedInTime: inTime,
      actualInTime: null,
      status: type === 'EMERGENCY_MEDICAL' ? 'APPROVED' : 'APPROVED',
      approver: 'Auto-Validated (Pre-Approved Parent Contact)',
      qrPassCode: `GP-QR-${passId}`,
      parentConsent: 'VERIFIED_INSTANT',
      createdAt: new Date().toISOString()
    };

    return apiSuccess(newPass, 'Digital Outpass generated! Present the QR barcode at Gate Security.');
  } catch (err: any) {
    return apiError(err.message || 'Failed to generate outpass');
  }
}
