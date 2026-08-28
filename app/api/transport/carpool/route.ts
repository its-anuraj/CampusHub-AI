import { NextResponse } from 'next/server';
import { apiSuccess, apiError } from '@/lib/apiResponse';

let carpools = [
  {
    id: 'pool-1',
    driverName: 'Aman Verma',
    vehicleType: 'Car (Hyundai i20)',
    origin: 'Koramangala 5th Block',
    destination: 'Main Campus East Gate',
    departureTime: '08:30 AM',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    totalSeats: 4,
    availableSeats: 2,
    farePerTripInr: 60,
    femaleOnly: false,
    riders: ['Rohan S.', 'Ananya G.'],
    status: 'ACTIVE'
  },
  {
    id: 'pool-2',
    driverName: 'Sneha Reddy',
    vehicleType: 'EV Scooter (Ather 450X)',
    origin: 'HSR Layout Sector 2',
    destination: 'Science & Tech Block',
    departureTime: '08:45 AM',
    days: ['Mon', 'Wed', 'Fri'],
    totalSeats: 1,
    availableSeats: 1,
    farePerTripInr: 35,
    femaleOnly: true,
    riders: [],
    status: 'ACTIVE'
  },
  {
    id: 'pool-3',
    driverName: 'Karan Patel',
    vehicleType: 'Car (Tata Nexon EV)',
    origin: 'Indiranagar Metro Station',
    destination: 'Hostel Block 4',
    departureTime: '09:00 AM',
    days: ['Mon', 'Tue', 'Thu', 'Fri'],
    totalSeats: 3,
    availableSeats: 1,
    farePerTripInr: 75,
    femaleOnly: false,
    riders: ['Vikram P.', 'Siddharth M.'],
    status: 'ACTIVE'
  }
];

export async function GET() {
  return apiSuccess({ carpools, totalRoutes: carpools.length });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { driverName, vehicleType, origin, destination, departureTime, totalSeats, farePerTripInr, femaleOnly } = body;

    if (!driverName || !origin || !destination || !departureTime) {
      return apiError('Missing required carpool route details', 400);
    }

    const newPool = {
      id: `pool-${Date.now()}`,
      driverName,
      vehicleType: vehicleType || 'Car',
      origin,
      destination,
      departureTime,
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      totalSeats: Number(totalSeats) || 3,
      availableSeats: Number(totalSeats) || 3,
      farePerTripInr: Number(farePerTripInr) || 50,
      femaleOnly: Boolean(femaleOnly),
      riders: [],
      status: 'ACTIVE'
    };

    carpools.unshift(newPool);
    return apiSuccess(newPool, 'Carpool ride published successfully', 201);
  } catch {
    return apiError('Failed to publish carpool route', 500);
  }
}
