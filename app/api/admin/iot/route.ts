import { NextResponse } from 'next/server';

const mockIoTRooms = [
  {
    roomId: 'LH-101 (Main Lecture Hall)',
    temperatureC: 22.4,
    humidityPercent: 48,
    co2Ppm: 520,
    airQualityIndex: 'EXCELLENT',
    occupancyCount: 84,
    maxCapacity: 120,
    hvacAutomationStatus: 'AUTO_ECO_MODE',
    powerDrawKw: 4.2
  },
  {
    roomId: 'LAB-304 (AI & GPU Cluster)',
    temperatureC: 19.8,
    humidityPercent: 42,
    co2Ppm: 460,
    airQualityIndex: 'OPTIMAL',
    occupancyCount: 22,
    maxCapacity: 30,
    hvacAutomationStatus: 'HIGH_PRECISION_COOLING',
    powerDrawKw: 8.9
  },
  {
    roomId: 'LIB-201 (Central Study Lounge)',
    temperatureC: 23.1,
    humidityPercent: 52,
    co2Ppm: 680,
    airQualityIndex: 'GOOD',
    occupancyCount: 140,
    maxCapacity: 180,
    hvacAutomationStatus: 'FRESH_AIR_CIRCULATION',
    powerDrawKw: 5.1
  },
  {
    roomId: 'SEM-402 (Executive Seminar Room)',
    temperatureC: 21.9,
    humidityPercent: 45,
    co2Ppm: 490,
    airQualityIndex: 'EXCELLENT',
    occupancyCount: 0,
    maxCapacity: 60,
    hvacAutomationStatus: 'STANDBY_IDLE',
    powerDrawKw: 0.4
  }
];

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      rooms: mockIoTRooms,
      totalSensorsOnline: 128,
      avgCampusTempC: 21.8,
      avgCampusCo2Ppm: 537,
      systemHealth: 'ALL_NODES_NORMAL',
      lastTelemetryPing: new Date().toISOString()
    }
  });
}
