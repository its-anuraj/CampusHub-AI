import { NextResponse } from 'next/server';
import { apiSuccess, apiError } from '@/lib/apiResponse';

let printQueue = [
  {
    id: 'print-001',
    fileName: 'Operating_Systems_Lab_Record_Final.pdf',
    pages: 14,
    colorMode: 'Grayscale',
    duplex: 'Double-Sided',
    copies: 1,
    costInr: 14,
    status: 'READY_AT_KIOSK',
    pickupPin: '8492',
    kioskLocation: 'Central Library 1st Floor (Kiosk #2)',
    submittedAt: '10:15 AM'
  },
  {
    id: 'print-002',
    fileName: 'Capstone_Project_Synopsis_Poster.pdf',
    pages: 1,
    colorMode: 'Full Color',
    duplex: 'Single-Sided',
    copies: 2,
    costInr: 20,
    status: 'PRINTED',
    pickupPin: '3104',
    kioskLocation: 'Admin Block Ground Floor (Kiosk #1)',
    submittedAt: 'Yesterday 4:30 PM'
  }
];

export async function GET() {
  return apiSuccess({
    queue: printQueue,
    monthlyQuotaRemainingPages: 186,
    kiosks: [
      { id: 'k1', name: 'Central Library Kiosk #1', paperStatus: 'OK', status: 'ONLINE', queueWaitMins: 2 },
      { id: 'k2', name: 'Computer Science Lab Kiosk #3', paperStatus: 'OK', status: 'ONLINE', queueWaitMins: 0 },
      { id: 'k3', name: 'Hostel Block 3 Kiosk', paperStatus: 'LOW_PAPER', status: 'ONLINE', queueWaitMins: 5 }
    ]
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fileName, pages, colorMode, duplex, copies, kioskLocation } = body;

    if (!fileName || !pages) {
      return apiError('Missing required print job parameters', 400);
    }

    const pin = Math.floor(1000 + Math.random() * 9000).toString();
    const cost = (colorMode === 'Full Color' ? 10 : 1) * Number(pages) * (Number(copies) || 1);

    const newJob = {
      id: `print-${Date.now()}`,
      fileName,
      pages: Number(pages),
      colorMode: colorMode || 'Grayscale',
      duplex: duplex || 'Double-Sided',
      copies: Number(copies) || 1,
      costInr: cost,
      status: 'READY_AT_KIOSK',
      pickupPin: pin,
      kioskLocation: kioskLocation || 'Central Library 1st Floor (Kiosk #2)',
      submittedAt: 'Just now'
    };

    printQueue.unshift(newJob);
    return apiSuccess(newJob, 'Print job queued successfully. Use your PIN at the kiosk.', 201);
  } catch {
    return apiError('Failed to queue print job', 500);
  }
}
