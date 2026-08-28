import { NextResponse } from 'next/server';
import { apiSuccess, apiError } from '@/lib/apiResponse';

let iprList = [
  {
    id: 'pat-2026-001',
    applicationNumber: '202641012899 A',
    title: 'Adaptive Dual-Band Terahertz Metamaterial Antenna Array for Ultra-Dense Campus IoT',
    inventors: ['Dr. Ramesh Kulkarni', 'Aditya Singh', 'Prof. Sunita Deshmukh'],
    filingDate: '2025-11-20',
    currentStage: 'EXAMINATION_REQUESTED',
    jurisdiction: 'Indian Patent Office (IPO - Chennai)',
    commercializationStatus: 'TECH_TRANSFER_OPEN',
    iprCellAdvisor: 'Adv. S. Raghavan (IPR Cell)'
  },
  {
    id: 'pat-2026-002',
    applicationNumber: '202641009844 B',
    title: 'Zero-Knowledge Cryptographic Credential Verification System on Distributed Ledgers',
    inventors: ['Dr. Vivek Swaminathan', 'Tanvi Saxena'],
    filingDate: '2025-06-14',
    currentStage: 'PUBLISHED_IN_JOURNAL',
    jurisdiction: 'Indian Patent Office (IPO - Mumbai)',
    commercializationStatus: 'INCUBATED_STARTUP_LICENSED',
    iprCellAdvisor: 'Adv. S. Raghavan (IPR Cell)'
  }
];

export async function GET() {
  return apiSuccess({
    patents: iprList,
    totalPatentsFiled: iprList.length,
    patentsGranted: 3,
    institutionalSupportGrantInr: 150000
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, inventors, jurisdiction } = body;

    if (!title || !inventors) {
      return apiError('Missing invention title or inventors list', 400);
    }

    const newPatent = {
      id: `pat-${Date.now()}`,
      applicationNumber: `20264100${Math.floor(1000 + Math.random() * 9000)} A`,
      title,
      inventors: Array.isArray(inventors) ? inventors : [inventors],
      filingDate: new Date().toISOString().split('T')[0],
      currentStage: 'PROVISIONAL_SPECIFICATION_FILED',
      jurisdiction: jurisdiction || 'Indian Patent Office (IPO)',
      commercializationStatus: 'TECH_TRANSFER_OPEN',
      iprCellAdvisor: 'IPR Cell Assigned'
    };

    iprList.unshift(newPatent);
    return apiSuccess(newPatent, 'Patent disclosure submitted to University IPR Cell', 201);
  } catch {
    return apiError('Failed to record patent filing', 500);
  }
}
