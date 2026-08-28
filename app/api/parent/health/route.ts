import { NextResponse } from 'next/server';
import { apiSuccess, apiError } from '@/lib/apiResponse';

let medicalVisits = [
  {
    visitId: 'MED-2026-042',
    date: '2026-08-14',
    doctorName: 'Dr. Sunita Murthy (Campus Medical Officer)',
    diagnosis: 'Seasonal Viral Bronchitis & Fatigue',
    vitals: { bp: '118/76 mmHg', pulseBpm: 72, spo2Pct: 99, tempF: '98.8 F' },
    prescriptions: [
      { medicine: 'Azithromycin 500mg', dosage: '1 tablet daily for 3 days', foodInstruction: 'Post meals' },
      { medicine: 'Paracetamol 650mg (SOS)', dosage: 'As needed for fever', foodInstruction: 'Post meals' }
    ],
    restPrescribedDays: 2,
    followUpDate: '2026-08-18',
    status: 'RECOVERED_HEALTHY'
  }
];

export async function GET() {
  return apiSuccess({
    studentName: 'Aditya Singh',
    bloodGroup: 'O+ Positive',
    allergies: ['Penicillin (Moderate)'],
    emergencyContact: '+91 98765 43210 (Mother)',
    campusHealthInsurancePolicy: 'STAR-HEALTH-UNIV-99201',
    insuranceCoverageInr: 200000,
    visits: medicalVisits
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { allergyUpdate, emergencyNote } = body;

    return apiSuccess({
      updated: true,
      allergyUpdate,
      emergencyNote,
      notifiedCampusClinic: true
    }, 'Medical record updated and synced with Campus Health Center', 200);
  } catch {
    return apiError('Failed to update medical record', 500);
  }
}
