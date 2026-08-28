import { NextResponse } from 'next/server';
import { apiSuccess, apiError } from '@/lib/apiResponse';

let researchGrants = [
  {
    id: 'grant-2026-01',
    projectTitle: 'Edge-AI Distributed Sensor Networks for Precision Smart Campus Agriculture',
    fundingAgency: 'DST (Department of Science & Technology)',
    sanctionOrderNo: 'DST/TDT/AGRI/2026/89',
    principalInvestigator: 'Dr. Ramesh Kulkarni (ECE)',
    coPI: 'Dr. Arpita Sen (CSE)',
    totalSanctionedAmountLakhs: 48.5,
    disbursedAmountLakhs: 24.25,
    utilizedAmountLakhs: 18.1,
    status: 'ACTIVE_EXECUTION',
    startDate: '2025-09-01',
    endDate: '2027-08-31',
    milestones: [
      { name: 'Sensor node hardware assembly & RF verification', status: 'COMPLETED' },
      { name: 'TinyML quantized inference model deployment', status: 'IN_PROGRESS' },
      { name: 'Final field trials and annual audit review', status: 'PENDING' }
    ]
  },
  {
    id: 'grant-2026-02',
    projectTitle: 'Quantum Safe Cryptographic Primitives for Institutional Blockchain Ledgers',
    fundingAgency: 'SERB (Science and Engineering Research Board)',
    sanctionOrderNo: 'SERB/CRG/2025/1104',
    principalInvestigator: 'Dr. Vivek Swaminathan (CSE)',
    coPI: 'Dr. Neha Saxena (Math)',
    totalSanctionedAmountLakhs: 62.0,
    disbursedAmountLakhs: 62.0,
    utilizedAmountLakhs: 44.8,
    status: 'ACTIVE_EXECUTION',
    startDate: '2025-01-15',
    endDate: '2027-01-14',
    milestones: [
      { name: 'Lattice-based signature scheme benchmarking', status: 'COMPLETED' },
      { name: 'FPGA hardware accelerator fabrication', status: 'COMPLETED' },
      { name: 'Standardization draft and patent filing', status: 'IN_PROGRESS' }
    ]
  }
];

export async function GET() {
  const totalFundingLakhs = researchGrants.reduce((acc, g) => acc + g.totalSanctionedAmountLakhs, 0);
  const totalUtilizedLakhs = researchGrants.reduce((acc, g) => acc + g.utilizedAmountLakhs, 0);

  return apiSuccess({
    grants: researchGrants,
    totalFundingLakhs,
    totalUtilizedLakhs,
    activeProjectsCount: researchGrants.length
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { projectTitle, fundingAgency, principalInvestigator, totalSanctionedAmountLakhs } = body;

    if (!projectTitle || !fundingAgency || !totalSanctionedAmountLakhs) {
      return apiError('Missing required grant proposal fields', 400);
    }

    const newGrant = {
      id: `grant-${Date.now()}`,
      projectTitle,
      fundingAgency,
      sanctionOrderNo: `REQ/${Date.now().toString().slice(-4)}`,
      principalInvestigator: principalInvestigator || 'Faculty Member',
      coPI: 'Department Co-PI',
      totalSanctionedAmountLakhs: Number(totalSanctionedAmountLakhs),
      disbursedAmountLakhs: Number(totalSanctionedAmountLakhs) * 0.5,
      utilizedAmountLakhs: 0,
      status: 'PROPOSAL_SUBMITTED',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2028-03-31',
      milestones: [
        { name: 'Proposal sanction and institutional clearance', status: 'IN_PROGRESS' },
        { name: 'Equipment procurement and setup', status: 'PENDING' }
      ]
    };

    researchGrants.unshift(newGrant);
    return apiSuccess(newGrant, 'Grant proposal submitted to Dean (R&D)', 201);
  } catch {
    return apiError('Failed to record research grant', 500);
  }
}
