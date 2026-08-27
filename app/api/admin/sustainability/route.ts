import { NextResponse } from 'next/server';

export async function GET() {
  const telemetry = {
    solarGenerationTodayKwh: 3480.4,
    solarCapacityKw: 750,
    gridImportKwh: 1240.2,
    carbonOffsetKgToday: 2854,
    treesPlantedEquivalent: 136,
    waterRecycledLitersToday: 18500,
    buildingEfficiency: [
      { buildingName: 'Academic Block A (CSE/ECE)', solarGeneratedKwh: 1120, powerConsumedKwh: 980, netZeroStatus: 'POSITIVE (+140 kWh)' },
      { buildingName: 'Central Research Complex', solarGeneratedKwh: 840, powerConsumedKwh: 1150, netZeroStatus: 'DEFICIT (-310 kWh)' },
      { buildingName: 'Aryabhata Residential Complex', solarGeneratedKwh: 980, powerConsumedKwh: 890, netZeroStatus: 'POSITIVE (+90 kWh)' },
      { buildingName: 'Sports Arena & Cafeteria', solarGeneratedKwh: 540, powerConsumedKwh: 460, netZeroStatus: 'POSITIVE (+80 kWh)' }
    ],
    timestamp: new Date().toISOString()
  };

  return NextResponse.json({
    success: true,
    data: telemetry
  });
}
