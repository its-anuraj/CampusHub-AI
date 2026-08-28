import { NextResponse } from 'next/server';
import { apiSuccess, apiError } from '@/lib/apiResponse';

let evStations = [
  {
    stationId: 'EV-GRID-01',
    location: 'North Gate Faculty Parking Bay',
    totalPorts: 8,
    activePorts: 6,
    currentPowerDrawKw: 42.5,
    todayEnergyDeliveredKwh: 310.8,
    chargerType: 'CCS-2 / Type 2 Fast Charger (22kW & 50kW)',
    status: 'OPTIMAL_OPERATION'
  },
  {
    stationId: 'EV-GRID-02',
    location: 'Hostel Complex Zone B',
    totalPorts: 12,
    activePorts: 8,
    currentPowerDrawKw: 28.0,
    todayEnergyDeliveredKwh: 194.2,
    chargerType: 'Dual 7.4kW AC Smart Chargers',
    status: 'OPTIMAL_OPERATION'
  },
  {
    stationId: 'EV-GRID-03',
    location: 'E-Shuttle Depot & Fleet Charging Dock',
    totalPorts: 6,
    activePorts: 4,
    currentPowerDrawKw: 80.0,
    todayEnergyDeliveredKwh: 540.0,
    chargerType: '60kW DC Fast Fleet Chargers',
    status: 'FLEET_RECHARGING'
  }
];

export async function GET() {
  const totalLiveDrawKw = evStations.reduce((a, s) => a + s.currentPowerDrawKw, 0);
  const totalKwhDelivered = evStations.reduce((a, s) => a + s.todayEnergyDeliveredKwh, 0);

  return apiSuccess({
    stations: evStations,
    totalLiveDrawKw,
    totalKwhDelivered,
    solarOffsetPercentage: 84.5,
    co2SavedKgToday: Math.round(totalKwhDelivered * 0.82)
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { stationId, action } = body;

    if (!stationId) {
      return apiError('Missing station ID', 400);
    }

    return apiSuccess({
      stationId,
      action: action || 'PORT_REBOOT',
      status: 'COMMAND_DISPATCHED_TO_OCPP_BROKER'
    }, 'OCPP 2.0.1 command dispatched to EV station', 200);
  } catch {
    return apiError('Failed to dispatch EV grid command', 500);
  }
}
