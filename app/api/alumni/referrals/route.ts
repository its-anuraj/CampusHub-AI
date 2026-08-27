import { NextResponse } from 'next/server';

let mockReferrals = [
  {
    id: 'ref-1',
    company: 'Google',
    role: 'Associate Software Engineer (L3)',
    location: 'Bangalore / Hyderabad',
    alumniName: 'Vikram Sethi',
    batch: 'Batch of 2022 (CSE)',
    openPositions: 3,
    deadline: '2026-09-15',
    eligibility: 'B.Tech / M.Tech (CGPA >= 8.0, Strong DSA & Systems)',
    referralSlotsRemaining: 4
  },
  {
    id: 'ref-2',
    company: 'Microsoft',
    role: 'Software Development Engineer I (Azure Core)',
    location: 'Hyderabad / Remote',
    alumniName: 'Sneha Rao',
    batch: 'Batch of 2021 (IT)',
    openPositions: 5,
    deadline: '2026-09-20',
    eligibility: 'Batch 2026/2027 Graduating (C++, Go, Distributed Systems)',
    referralSlotsRemaining: 2
  },
  {
    id: 'ref-3',
    company: 'Adobe',
    role: 'Member of Technical Staff - Machine Learning',
    location: 'Noida / Bangalore',
    alumniName: 'Abhishek Nair',
    batch: 'Batch of 2020 (AI & DS)',
    openPositions: 2,
    deadline: '2026-09-30',
    eligibility: 'Strong Python, PyTorch, Diffusion models & Computer Vision',
    referralSlotsRemaining: 5
  }
];

export async function GET() {
  return NextResponse.json({
    success: true,
    data: mockReferrals
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { referralId, studentPitch, resumeUrl, githubUrl } = body;

    const application = {
      applicationId: `APP-REF-${Math.random().toString(36).substring(7).toUpperCase()}`,
      referralId,
      submittedAt: new Date().toISOString(),
      status: 'UNDER_ALUMNI_REVIEW',
      resumeUrl: resumeUrl || 'https://campushub.internal/resumes/std_sample.pdf',
      githubUrl: githubUrl || 'https://github.com/student',
      studentPitch
    };

    return NextResponse.json({
      success: true,
      message: 'Referral pitch sent directly to alumni inbox',
      data: application
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Could not submit referral request' }, { status: 500 });
  }
}
