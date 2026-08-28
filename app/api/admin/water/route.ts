import { NextResponse } from 'next/server';
import { apiSuccess, apiError } from '@/lib/apiResponse';

let waterReservoirs = [
  {
    tankId: 'RES-OVERHEAD-01',
    name: 'North Zone Central Overhead Reservoir',
    capacityLiters: 150000,
    currentLevelLiters: 124000,
    fillPercentage: 82.6,
    flowRateLpm: 45.2,
    waterQuality: { tdsPpm: 120, ph: 7.2, turbidityNtu: 0.8 },
    status: 'OPTIMAL'
  },
  {
    tankId: 'RES-RWH-02',
    name: 'Rainwater Harvesting Deep Aquifer Sump',
    capacityLiters: 200000,
    currentLevelLiters: 178000,
    fillPercentage: 89.0,
    flowRateLpm: 12.0,
    waterQuality: { tdsPpm: 95, ph: 7.0, turbidityNtu: 0.5 },
    status: 'OPTIMAL'
  },
  {
    tankId: 'RES-STP-03',
    name: 'Sewage Treatment Plant (STP) Recycled Water Tank',
    capacityLiters: 80000,
    currentLevelLiters: 62000,
    fillPercentage: 77.5,
    flowRateLpm: 60.0,
    waterQuality: { tdsPpm: 340, ph: 7.6, turbidityNtu: 2.1 },
    status: 'GARDEN_FLUSHING_FEED'
  }
];

export async function GET() {
  const totalWaterStoredLiters = waterReservoirs.reduce((a, r) => a + r.currentLevelLiters, 0);
  const totalCapacityLiters = waterReservoirs.reduce((a, r) => a + r.capacityLiters, 0);

  return apiSuccess({
    reservoirs: waterReservoirs,
    totalWaterStoredLiters,
    totalCapacityLiters,
    recycledWaterUtilizationPct: 78.4,
    dailyWaterSavedLiters: 45000
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tankId, valveState } = body;

    if (!tankId) {
      return apiError('Missing tank identifier', 400);
    }

    return apiSuccess({
      tankId,
      valveState: valveState || 'OPEN_AUTO',
      telemetryUpdated: true
    }, 'Smart water valve solenoid state toggled', 200);
  } catch {
    return apiError('Failed to control water valve', 500);
  }
}
