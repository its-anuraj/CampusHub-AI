import { NextResponse } from 'next/server';
import { apiSuccess, apiError } from '@/lib/apiResponse';

const BUS_ROUTES = [
  {
    routeId: 'ROUTE-01',
    routeName: 'North Metro Shuttle Express',
    vehicleNo: 'DL-01-EA-9824',
    type: 'Electric AC Deluxe',
    driver: 'Suresh Kumar',
    driverPhone: '+91 98765 00124',
    capacity: 45,
    occupancy: 38,
    speedKmH: 34,
    currentLocation: 'Sector 62 Crossing (Landmark: Metro Pillar 142)',
    etaNextStop: '4 mins',
    status: 'ON_ROUTE',
    stops: [
      { name: 'Campus Gate 1 Terminal', time: '07:30 AM', status: 'DEPARTED' },
      { name: 'City Center Metro Gate 3', time: '07:50 AM', status: 'DEPARTED' },
      { name: 'Sector 62 Crossing', time: '08:10 AM', status: 'APPROACHING' },
      { name: 'Botanical Garden Interchange', time: '08:30 AM', status: 'SCHEDULED' },
      { name: 'Tech Zone Hub', time: '08:50 AM', status: 'SCHEDULED' }
    ]
  },
  {
    routeId: 'ROUTE-02',
    routeName: 'South Campus Ring Road Shuttle',
    vehicleNo: 'DL-01-EB-4412',
    type: 'AC High-Capacity Shuttle',
    driver: 'Rajesh Tyagi',
    driverPhone: '+91 98765 00188',
    capacity: 50,
    occupancy: 42,
    speedKmH: 28,
    currentLocation: 'South Ext Ring Flyover',
    etaNextStop: '2 mins',
    status: 'ON_ROUTE',
    stops: [
      { name: 'Campus Gate 3 (Sports Complex)', time: '08:00 AM', status: 'DEPARTED' },
      { name: 'Green Park Market', time: '08:20 AM', status: 'DEPARTED' },
      { name: 'South Ext Ring Flyover', time: '08:40 AM', status: 'APPROACHING' },
      { name: 'Nehru Place Terminal', time: '09:05 AM', status: 'SCHEDULED' }
    ]
  },
  {
    routeId: 'ROUTE-03',
    routeName: 'Hostel Night Shuttle & Evening Express',
    vehicleNo: 'DL-01-EC-1109',
    type: 'Standard CNG Bus',
    driver: 'Virendra Yadav',
    driverPhone: '+91 98765 00311',
    capacity: 35,
    occupancy: 12,
    speedKmH: 0,
    currentLocation: 'Hostel Block C Parking',
    etaNextStop: 'Departs @ 09:30 PM',
    status: 'STANDBY',
    stops: [
      { name: 'Hostel Block C Parking', time: '09:30 PM', status: 'SCHEDULED' },
      { name: 'Main Academic Block', time: '09:40 PM', status: 'SCHEDULED' },
      { name: 'Campus Library & Cafeteria', time: '09:50 PM', status: 'SCHEDULED' },
      { name: 'Girls Hostel Gate', time: '10:05 PM', status: 'SCHEDULED' }
    ]
  }
];

export async function GET() {
  return apiSuccess({
    routes: BUS_ROUTES,
    activeVehicles: 3,
    onTimeRate: '98.4%',
    emergencyHelpline: '+91 11 2984 0000 (Campus Transport Control Desk)'
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, routeId, studentName, rollNumber } = body;

    if (action === 'RENEW_PASS') {
      return apiSuccess({
        passId: `PASS-${Date.now().toString().slice(-6)}`,
        routeId,
        studentName: studentName || 'Alex Kumar',
        rollNumber: rollNumber || '23CSE042',
        validTill: '2026-12-31',
        qrCode: `CAMPUS-PASS-2026-${Math.floor(100000 + Math.random() * 900000)}`
      }, 'Smart Bus Pass renewed successfully for the current academic semester!');
    }

    return apiError('Invalid transit action');
  } catch (err: any) {
    return apiError(err.message || 'Transit error');
  }
}
