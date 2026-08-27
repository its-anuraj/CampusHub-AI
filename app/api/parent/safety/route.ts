import { NextResponse } from 'next/server';

let mockSafetyTimeline = [
  {
    id: 'TL-01',
    timestamp: 'Today, 08:45 AM',
    location: 'Main Academic Block Gate (RFID Tap)',
    eventType: 'CAMPUS_ENTRY',
    verifiedBy: 'Automated Turnstile #3',
    safetyStatus: 'NORMAL'
  },
  {
    id: 'TL-02',
    timestamp: 'Today, 10:15 AM',
    location: 'Central Computer Science Lab 4',
    eventType: 'LAB_CHECK_IN',
    verifiedBy: 'Biometric Attendance Scanner',
    safetyStatus: 'NORMAL'
  },
  {
    id: 'TL-03',
    timestamp: 'Today, 01:20 PM',
    location: 'Student Dining Hall & Cafeteria',
    eventType: 'MEAL_PASS_SCAN',
    verifiedBy: 'Digital POS Counter',
    safetyStatus: 'NORMAL'
  },
  {
    id: 'TL-04',
    timestamp: 'Today, 05:40 PM',
    location: 'Central University Library (Reading Floor)',
    eventType: 'LIBRARY_ACCESS',
    verifiedBy: 'Smart Card Kiosk',
    safetyStatus: 'NORMAL'
  },
  {
    id: 'TL-05',
    timestamp: 'Today, 08:15 PM',
    location: 'Aryabhata Hostel Block A Resident Gate',
    eventType: 'HOSTEL_RETURN',
    verifiedBy: 'Residential Warden Roster',
    safetyStatus: 'SAFE_IN_HOSTEL'
  }
];

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      studentName: 'Aarav Sharma (24CS089)',
      currentLocationStatus: 'SAFE_INSIDE_HOSTEL (Block A - Room 204)',
      curfewTime: '10:00 PM',
      curfewComplianceStatus: 'ON_TIME',
      campusGeofenceState: 'WITHIN_CAMPUS_PERIMETER',
      timeline: mockSafetyTimeline
    }
  });
}
