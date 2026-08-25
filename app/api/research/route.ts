import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { apiSuccess, apiError } from '@/lib/apiResponse';

const MOCK_PUBLICATIONS = [
  {
    id: 'res-1',
    title: 'Autonomous Multi-Agent Collaboration for Distributed Resource Allocation in Edge Computing',
    facultyName: 'Dr. Ramesh Kumar',
    department: 'Computer Science & Engineering',
    journal: 'IEEE Transactions on Parallel and Distributed Systems',
    doi: '10.1109/TPDS.2026.3198421',
    year: 2026,
    citations: 34,
    abstract: 'We formulate a novel reinforcement learning framework for decentralized agentic workload scheduling across heterogeneous edge clusters.',
    downloadUrl: '#'
  },
  {
    id: 'res-2',
    title: 'Fault-Tolerant Cryptographic Consensus Protocols for Scalable Institutional Ledgers',
    facultyName: 'Dr. Ramesh Kumar',
    department: 'Computer Science & Engineering',
    journal: 'Springer Nature Computer Science',
    doi: '10.1007/s42979-025-02194-x',
    year: 2025,
    citations: 78,
    abstract: 'An empirical benchmarking of quantum-resistant zero-knowledge verification in academic credential management.',
    downloadUrl: '#'
  }
];

let mockGrants = [
  {
    id: 'grt-1',
    title: 'Development of Next-Gen Agentic AI Systems for Healthcare Triage',
    agency: 'Department of Science & Technology (DST - SERB)',
    grantAmount: 4500000,
    duration: '2025 - 2028 (3 Years)',
    status: 'SANCTIONED & ACTIVE',
    progress: 65,
    leadPi: 'Dr. Ramesh Kumar (Principal Investigator)'
  },
  {
    id: 'grt-2',
    title: 'Secure IoT Infrastructure for Smart Campus Energy Optimization',
    agency: 'Ministry of Electronics and Information Technology (MeitY)',
    grantAmount: 2800000,
    duration: '2026 - 2027 (18 Months)',
    status: 'IN_PROGRESS',
    progress: 40,
    leadPi: 'Dr. Ramesh Kumar (Co-PI)'
  }
];

export async function GET() {
  try {
    let papers: any[] = [];
    try {
      papers = await prisma.researchPaper.findMany({ orderBy: { year: 'desc' } });
    } catch {}

    return apiSuccess({
      publications: papers.length > 0 ? papers : MOCK_PUBLICATIONS,
      grants: mockGrants,
      metrics: {
        totalPapers: 24,
        totalCitations: 1420,
        hIndex: 18,
        i10Index: 21,
        totalGrantFunding: '₹73.0 Lakhs'
      }
    });
  } catch (err: any) {
    return apiError(err.message || 'Failed to fetch research repository');
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, title, journal, doi, year, citations, abstract, facultyName, department, agency, grantAmount, duration } = body;

    if (action === 'APPLY_GRANT') {
      const newGrant = {
        id: `grt-${Date.now().toString().slice(-4)}`,
        title,
        agency: agency || 'DST - SERB',
        grantAmount: Number(grantAmount) || 2500000,
        duration: duration || '2026 - 2029 (3 Years)',
        status: 'UNDER_PEER_REVIEW',
        progress: 10,
        leadPi: facultyName || 'Dr. Ramesh Kumar (Principal Investigator)'
      };
      mockGrants = [newGrant, ...mockGrants];
      return apiSuccess(newGrant, 'Research grant proposal submitted for institutional and sponsoring agency peer review.');
    }

    let newPaper;
    try {
      newPaper = await prisma.researchPaper.create({
        data: {
          title,
          journal: journal || 'IEEE Transactions',
          doi: doi || null,
          year: Number(year) || 2026,
          citations: Number(citations) || 0,
          abstract: abstract || '',
          facultyName: facultyName || 'Dr. Ramesh Kumar',
          department: department || 'Computer Science & Engineering'
        }
      });
    } catch {
      newPaper = {
        id: `res-${Date.now()}`,
        title,
        journal: journal || 'IEEE Transactions',
        doi: doi || null,
        year: Number(year) || 2026,
        citations: Number(citations) || 0,
        abstract: abstract || '',
        facultyName: facultyName || 'Dr. Ramesh Kumar',
        department: department || 'Computer Science & Engineering',
        createdAt: new Date().toISOString()
      };
    }

    return apiSuccess(newPaper, 'Research paper added to institutional repository');
  } catch (err: any) {
    return apiError(err.message || 'Failed to record research publication');
  }
}
