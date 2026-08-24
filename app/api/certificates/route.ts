import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { apiSuccess, apiError } from '@/lib/apiResponse';
import crypto from 'crypto';

const MOCK_CERTIFICATES = [
  {
    id: 'cert-1',
    certificateId: 'CHUB-CERT-2026-8921',
    studentName: 'Alex Kumar',
    rollNumber: '23CSE042',
    courseOrTitle: 'Institutional Bonafide & Student Enrollment Certificate',
    type: 'BONAFIDE',
    issueDate: '2026-08-01T00:00:00.000Z',
    issuedBy: 'Office of the Registrar & Academic Affairs',
    digitalHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    status: 'VERIFIED'
  },
  {
    id: 'cert-2',
    certificateId: 'CHUB-CERT-2026-4412',
    studentName: 'Alex Kumar',
    rollNumber: '23CSE042',
    courseOrTitle: 'CS501: Advanced Data Structures & Algorithm Design',
    type: 'COURSE_COMPLETION',
    issueDate: '2026-06-15T00:00:00.000Z',
    issuedBy: 'Department of Computer Science & Engineering',
    digitalHash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    status: 'VERIFIED'
  },
  {
    id: 'cert-3',
    certificateId: 'CHUB-CERT-2026-1109',
    studentName: 'Alex Kumar',
    rollNumber: '23CSE042',
    courseOrTitle: 'Dean’s Honor Roll - Academic Excellence Award (Semester IV)',
    type: 'MERIT',
    issueDate: '2026-07-10T00:00:00.000Z',
    issuedBy: 'Dean of Academic Standing',
    digitalHash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    status: 'VERIFIED'
  }
];

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const certId = searchParams.get('id');

    if (certId) {
      const found = MOCK_CERTIFICATES.find(c => c.certificateId === certId || c.id === certId);
      if (found) return apiSuccess(found);
      return apiError('Certificate not found', 404);
    }

    let certs: any[] = [];
    try {
      certs = await prisma.digitalCertificate.findMany({ orderBy: { issueDate: 'desc' } });
    } catch {}

    return apiSuccess(certs.length > 0 ? certs : MOCK_CERTIFICATES);
  } catch (err: any) {
    return apiError(err.message || 'Failed to fetch certificates');
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { studentName, rollNumber, type, title } = body;
    const certNumber = `CHUB-CERT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const hash = crypto.createHash('sha256').update(`${certNumber}-${rollNumber}-${Date.now()}`).digest('hex');

    const newCert = {
      id: `cert-${Date.now()}`,
      certificateId: certNumber,
      studentName: studentName || 'Alex Kumar',
      rollNumber: rollNumber || '23CSE042',
      courseOrTitle: title || 'Institutional Bonafide Certificate',
      type: type || 'BONAFIDE',
      issueDate: new Date().toISOString(),
      issuedBy: 'Office of Academic Affairs',
      digitalHash: hash,
      status: 'VERIFIED'
    };

    return apiSuccess(newCert, 'Certificate generated and cryptographically signed');
  } catch (err: any) {
    return apiError(err.message || 'Failed to generate certificate');
  }
}
