import { NextResponse } from 'next/server';

const mockWashers = [
  { id: 'WM-01', block: 'Aryabhata Block A (Floor 1)', status: 'AVAILABLE', remainingMins: 0, loadCapacityKg: 8, model: 'LG SmartInverter Pro' },
  { id: 'WM-02', block: 'Aryabhata Block A (Floor 1)', status: 'IN_USE', remainingMins: 18, loadCapacityKg: 8, model: 'LG SmartInverter Pro' },
  { id: 'WM-03', block: 'Aryabhata Block A (Floor 2)', status: 'IN_USE', remainingMins: 32, loadCapacityKg: 10, model: 'Samsung EcoBubble Max' },
  { id: 'WM-04', block: 'Aryabhata Block A (Floor 2)', status: 'AVAILABLE', remainingMins: 0, loadCapacityKg: 10, model: 'Samsung EcoBubble Max' },
  { id: 'WM-05', block: 'Aryabhata Block B (Floor 1)', status: 'MAINTENANCE', remainingMins: 0, loadCapacityKg: 8, model: 'Bosch Serie 6' },
  { id: 'WM-06', block: 'Aryabhata Block B (Floor 2)', status: 'AVAILABLE', remainingMins: 0, loadCapacityKg: 8, model: 'Bosch Serie 6' },
];

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      washers: mockWashers,
      tokenRate: 'Free (2 tokens / week allocated)',
      tokensRemaining: 2,
      activeBooking: null
    }
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { washerId, cycleType = 'Regular Wash (45m)' } = body;

    const token = {
      tokenId: `LND-${Math.floor(1000 + Math.random() * 9000)}`,
      washerId,
      cycleType,
      bookedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 45 * 60000).toISOString(),
      qrCodeData: `CAMPUS-LAUNDRY-${washerId}-${Date.now()}`,
      status: 'CONFIRMED'
    };

    return NextResponse.json({
      success: true,
      message: 'Laundry token generated successfully',
      data: token
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Could not book laundry token' }, { status: 500 });
  }
}
