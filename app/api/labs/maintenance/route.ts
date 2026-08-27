import { NextResponse } from 'next/server';

let mockMaintenanceLogs = [
  {
    id: 'EQ-CAL-101',
    equipmentName: 'NVIDIA DGX A100 Server (Node #2)',
    labName: 'AI & Deep Learning High Performance Computing Lab',
    technician: 'Mr. Arvind Joshi',
    lastCalibrationDate: '2026-08-10',
    nextDueCalibration: '2026-11-10',
    healthStatus: 'OPTIMAL',
    voltageFluctuation: 'Nominal (230V ± 1.2%)',
    maintenanceNotes: 'Thermal paste refreshed on GPU heatsinks and firmware patched to v24.08.'
  },
  {
    id: 'EQ-CAL-102',
    equipmentName: 'Keysight 20 GHz Digital Storage Oscilloscope',
    labName: 'RF & Microwave Systems Engineering Lab',
    technician: 'Ms. Priyamvada R.',
    lastCalibrationDate: '2026-07-20',
    nextDueCalibration: '2026-10-20',
    healthStatus: 'CALIBRATED',
    voltageFluctuation: 'Nominal',
    maintenanceNotes: 'Probe attenuation factors recalibrated with NIST reference source.'
  },
  {
    id: 'EQ-CAL-103',
    equipmentName: 'Formlabs Form 3+ SLA 3D Resin Printer',
    labName: 'Rapid Prototyping & Mechatronics FabLab',
    technician: 'Mr. Arvind Joshi',
    lastCalibrationDate: '2026-06-15',
    nextDueCalibration: '2026-09-15',
    healthStatus: 'CALIBRATION_DUE_SOON',
    voltageFluctuation: 'Nominal',
    maintenanceNotes: 'Galvo mirror alignment check recommended prior to major student project prints.'
  }
];

export async function GET() {
  return NextResponse.json({
    success: true,
    data: mockMaintenanceLogs
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { equipmentName, labName, technician, notes } = body;

    const newLog = {
      id: `EQ-CAL-${Math.floor(200 + Math.random() * 800)}`,
      equipmentName: equipmentName || 'High-Precision Instrument',
      labName: labName || 'Main Research Lab',
      technician: technician || 'Lab Incharge',
      lastCalibrationDate: new Date().toISOString().split('T')[0],
      nextDueCalibration: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
      healthStatus: 'OPTIMAL',
      voltageFluctuation: 'Nominal',
      maintenanceNotes: notes || 'Periodic scheduled preventative maintenance successfully performed.'
    };

    mockMaintenanceLogs.unshift(newLog);

    return NextResponse.json({
      success: true,
      message: 'Equipment calibration log recorded',
      data: newLog
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Could not log calibration' }, { status: 500 });
  }
}
