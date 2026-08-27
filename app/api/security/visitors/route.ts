import { NextResponse } from 'next/server';

let mockVisitorPasses = [
  {
    id: 'VPASS-1001',
    visitorName: 'Dr. Ramesh N. Sharma',
    organization: 'Indian Institute of Technology Delhi',
    purpose: 'External PhD Thesis Defense Examiner',
    hostFaculty: 'Dr. S. K. Raman (HOD CSE)',
    vehicleNumber: 'DL 3C AB 4412',
    parkingSlot: 'Bay P-04 (Academic Zone)',
    entryTime: '2026-08-27 09:30 AM',
    status: 'ACTIVE_ON_CAMPUS'
  },
  {
    id: 'VPASS-1002',
    visitorName: 'Ms. Geeta Sundaram',
    organization: 'Oracle India Ltd',
    purpose: 'Campus Placement Keynote Speaker',
    hostFaculty: 'Prof. Ananya Roy (Training & Placement Cell)',
    vehicleNumber: 'KA 01 MJ 8821',
    parkingSlot: 'Bay P-01 (Auditorium)',
    entryTime: '2026-08-27 10:15 AM',
    status: 'ACTIVE_ON_CAMPUS'
  },
  {
    id: 'VPASS-1003',
    visitorName: 'Mr. Prateek Bansal',
    organization: 'Schneider Electric Labs',
    purpose: 'IoT Smart Grid Hardware Demonstration',
    hostFaculty: 'Dr. Vikramaditya (ECE)',
    vehicleNumber: 'UP 16 XY 1290',
    parkingSlot: 'Bay P-12',
    entryTime: '2026-08-26 02:00 PM',
    status: 'CHECKED_OUT'
  }
];

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      passes: mockVisitorPasses,
      activeVisitorsOnCampus: mockVisitorPasses.filter(p => p.status === 'ACTIVE_ON_CAMPUS').length,
      availableParkingBays: 24,
      totalParkingBays: 40
    }
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { visitorName, organization, purpose, hostFaculty, vehicleNumber } = body;

    const newPass = {
      id: `VPASS-${Math.floor(1000 + Math.random() * 9000)}`,
      visitorName: visitorName || 'Guest Visitor',
      organization: organization || 'Corporate Guest',
      purpose: purpose || 'Official Meeting',
      hostFaculty: hostFaculty || 'Administration Office',
      vehicleNumber: vehicleNumber || 'N/A (Pedestrian Entry)',
      parkingSlot: vehicleNumber ? `Bay P-${Math.floor(10 + Math.random() * 25)}` : 'None',
      entryTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'ACTIVE_ON_CAMPUS'
    };

    mockVisitorPasses.unshift(newPass);

    return NextResponse.json({
      success: true,
      message: 'Visitor pass issued and logged into ANPR security terminal',
      data: newPass
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Could not issue visitor pass' }, { status: 500 });
  }
}
