import { NextResponse } from 'next/server';
import { apiSuccess, apiError } from '@/lib/apiResponse';

let facilities = [
  {
    id: 'fac-badminton',
    name: 'Indoor Badminton Court 1 & 2',
    category: 'Racquet Sports',
    location: 'Sports Complex Wing A',
    maxCapacity: 4,
    currentOccupancy: 2,
    availableSlots: ['05:00 PM - 06:00 PM', '06:00 PM - 07:00 PM', '07:00 PM - 08:00 PM'],
    equipmentProvided: ['Yonex Rackets', 'Mavis 350 Shuttles', 'Synthetic Grip Mats']
  },
  {
    id: 'fac-gym',
    name: 'Olympic Weightlifting & Cardio Gym',
    category: 'Fitness',
    location: 'Sports Complex Wing B (Floor 2)',
    maxCapacity: 40,
    currentOccupancy: 22,
    availableSlots: ['06:00 AM - 08:00 AM', '04:30 PM - 06:30 PM', '07:00 PM - 09:00 PM'],
    equipmentProvided: ['Squat Racks', 'Treadmills', 'Dumbbells up to 40kg', 'Concept2 Rower']
  },
  {
    id: 'fac-cricket',
    name: 'Floodlit Cricket Turf Nets',
    category: 'Team Sports',
    location: 'Outdoor Stadium Grounds',
    maxCapacity: 12,
    currentOccupancy: 6,
    availableSlots: ['05:30 PM - 07:00 PM', '07:00 PM - 08:30 PM'],
    equipmentProvided: ['Bowling Machine', 'Leather Balls', 'Batting Pads & Helmets']
  }
];

export async function GET() {
  return apiSuccess({ facilities, activePassHolder: true });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { facilityId, timeSlot, playerCount } = body;

    if (!facilityId || !timeSlot) {
      return apiError('Missing facility or time slot selection', 400);
    }

    const booking = {
      bookingId: `court-res-${Date.now()}`,
      facilityId,
      timeSlot,
      playerCount: playerCount || 2,
      passQrCode: `CAMPUS-SPORTS-${Date.now()}`,
      status: 'CONFIRMED',
      bookedAt: new Date().toLocaleTimeString()
    };

    return apiSuccess(booking, 'Sports court slot reserved successfully', 201);
  } catch {
    return apiError('Failed to reserve court slot', 500);
  }
}
