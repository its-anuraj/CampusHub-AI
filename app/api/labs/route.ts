import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { apiSuccess, apiError } from '@/lib/apiResponse';

const MOCK_EQUIPMENT = [
  {
    id: 'eq-1',
    name: 'NVIDIA DGX A100 AI Supercomputer Node (8x 80GB GPUs)',
    labName: 'Center for High Performance Computing & AI',
    department: 'Computer Science & Engineering',
    totalUnits: 2,
    status: 'OPERATIONAL',
    hourlyRate: 0,
    specs: '640GB GPU VRAM, 1.5TB System RAM, Dual AMD EPYC 7742 Processors',
    availableSlots: ['Today 04:00 PM - 08:00 PM', 'Tomorrow 09:00 AM - 01:00 PM', 'Tomorrow 02:00 PM - 06:00 PM']
  },
  {
    id: 'eq-2',
    name: 'Formlabs Form 3+ Stereolithography 3D Resin Printer',
    labName: 'Advanced Prototyping & Mechatronics Fab',
    department: 'Mechanical & Automation',
    totalUnits: 3,
    status: 'OPERATIONAL',
    hourlyRate: 0,
    specs: '25-micron layer resolution, Dental & Engineering photopolymer resins',
    availableSlots: ['Today 02:00 PM - 05:00 PM', 'Tomorrow 10:00 AM - 01:00 PM']
  },
  {
    id: 'eq-3',
    name: 'Keysight 26.5 GHz High-Frequency Spectrum Analyzer',
    labName: 'Microwave & 5G Telecommunication Research Facility',
    department: 'Electronics & Communication',
    totalUnits: 1,
    status: 'OPERATIONAL',
    hourlyRate: 0,
    specs: 'Real-time bandwidth 160 MHz, DANL -163 dBm, Phase noise -114 dBc/Hz',
    availableSlots: ['Tomorrow 03:00 PM - 06:00 PM']
  }
];

export async function GET() {
  try {
    let eq: any[] = [];
    try {
      eq = await prisma.labEquipment.findMany();
    } catch {}

    return apiSuccess({
      equipment: eq.length > 0 ? eq : MOCK_EQUIPMENT,
      activeReservations: [
        { id: 'res-1', equipment: 'NVIDIA DGX A100 AI Node', faculty: 'Dr. Ramesh Kumar', slot: 'Today 04:00 PM - 08:00 PM', project: 'LLM Fine-tuning for Indic Languages', status: 'CONFIRMED' }
      ]
    });
  } catch (err: any) {
    return apiError(err.message || 'Failed to fetch lab equipment');
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { equipmentName, facultyName, slot, project } = body;

    return apiSuccess({
      bookingId: `LAB-RSV-${Math.floor(1000 + Math.random() * 9000)}`,
      equipmentName,
      facultyName: facultyName || 'Dr. Ramesh Kumar',
      slot,
      project: project || 'Doctoral Research Experiment',
      status: 'CONFIRMED'
    }, 'Lab hardware slot reserved successfully');
  } catch (err: any) {
    return apiError(err.message || 'Failed to reserve lab slot');
  }
}
