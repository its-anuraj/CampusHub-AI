import { NextResponse } from 'next/server';

let mockClaims = [
  {
    id: 'CLM-901',
    itemTitle: 'Sony WH-1000XM5 Noise Canceling Headphones (Silver)',
    foundLocation: 'Central Library (3rd Floor Reading Hall)',
    foundDate: '2026-08-26',
    securityCustodian: 'Desk Officer Ramesh K.',
    claimantStudent: 'Tanya Mehra',
    proofProvided: 'Bluetooth MAC Address match & invoice receipt photo',
    matchConfidencePercent: 96,
    status: 'VERIFIED_READY_FOR_PICKUP'
  },
  {
    id: 'CLM-902',
    itemTitle: 'Casio fx-991CW Scientific Calculator (Black)',
    foundLocation: 'Physics Lab II',
    foundDate: '2026-08-25',
    securityCustodian: 'Lab Assistant Suresh P.',
    claimantStudent: 'Karan Sharma',
    proofProvided: 'Engraved initials "KS" on back battery cover',
    matchConfidencePercent: 91,
    status: 'PENDING_SECURITY_REVIEW'
  }
];

export async function GET() {
  return NextResponse.json({
    success: true,
    data: mockClaims
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { itemTitle, foundLocation, proofDescription } = body;

    const newClaim = {
      id: `CLM-${Math.floor(100 + Math.random() * 900)}`,
      itemTitle: itemTitle || 'Unspecified Item',
      foundLocation: foundLocation || 'Main Campus',
      foundDate: new Date().toISOString().split('T')[0],
      securityCustodian: 'Main Gate Control Station',
      claimantStudent: 'Current Student',
      proofProvided: proofDescription || 'Visual proof & identity document provided',
      matchConfidencePercent: Math.floor(85 + Math.random() * 14),
      status: 'PENDING_SECURITY_REVIEW'
    };

    mockClaims.unshift(newClaim);

    return NextResponse.json({
      success: true,
      message: 'Claim filed and queued for campus security handover verification',
      data: newClaim
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Could not submit item claim' }, { status: 500 });
  }
}
