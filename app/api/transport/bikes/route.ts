import { NextResponse } from 'next/server';

const mockBikeStations = [
  { id: 'ST-01', name: 'Main Campus Gate & Bus Terminal', availableBikes: 12, totalDocks: 20, batteryAvg: 92, lat: 28.545, lng: 77.192 },
  { id: 'ST-02', name: 'Central Research Library Hub', availableBikes: 6, totalDocks: 15, batteryAvg: 88, lat: 28.548, lng: 77.195 },
  { id: 'ST-03', name: 'Hostel Residential Complex A & B', availableBikes: 18, totalDocks: 25, batteryAvg: 95, lat: 28.552, lng: 77.198 },
  { id: 'ST-04', name: 'Indoor Sports Arena & Swimming Pool', availableBikes: 4, totalDocks: 10, batteryAvg: 76, lat: 28.542, lng: 77.189 },
  { id: 'ST-05', name: 'Department of Computer Science & AI', availableBikes: 9, totalDocks: 15, batteryAvg: 90, lat: 28.549, lng: 77.191 },
  { id: 'ST-06', name: 'Student Cafeteria & Food Court', availableBikes: 14, totalDocks: 20, batteryAvg: 85, lat: 28.546, lng: 77.194 }
];

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      stations: mockBikeStations,
      totalFleetSize: 105,
      co2SavedKg: 1420.5,
      studentTripsToday: 384,
      rentalPolicy: 'First 30 minutes free with student smart card'
    }
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { stationId, bikeType = 'Electric Pedelec' } = body;

    const rentalSession = {
      sessionId: `BIKE-RENT-${Date.now().toString().slice(-6)}`,
      stationId,
      bikeNumber: `EC-${Math.floor(100 + Math.random() * 900)}`,
      bikeType,
      batteryPercent: 94,
      unlockedAt: new Date().toISOString(),
      qrUnlockCode: `CAMPUS-ECYCLE-AUTH-${Math.random().toString(36).substring(7)}`,
      status: 'ACTIVE_RIDE',
      costEstimate: '₹0.00 (Student Pass Tier)'
    };

    return NextResponse.json({
      success: true,
      message: 'Bike unlocked successfully. Have a safe ride!',
      data: rentalSession
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Could not initiate bike rental' }, { status: 500 });
  }
}
