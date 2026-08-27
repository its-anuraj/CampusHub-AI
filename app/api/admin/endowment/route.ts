import { NextResponse } from 'next/server';

let mockEndowment = {
  totalCorpusRaisedInr: 45000000, // 4.5 Crores
  annualScholarshipsDisbursedInr: 12500000,
  activeStudentBeneficiaries: 142,
  donorsCount: 380,
  featuredGrants: [
    { id: 'GR-01', name: 'Silicon Valley Alumni Merit Fellowship', corpusInr: 15000000, department: 'AI & Data Science', studentsSupported: 45 },
    { id: 'GR-02', name: 'Dr. APJ Abdul Kalam Innovation Grant', corpusInr: 12000000, department: 'Robotics & Mechatronics', studentsSupported: 32 },
    { id: 'GR-03', name: 'Women in STEM Excellence Endowment', corpusInr: 10000000, department: 'All Engineering Streams', studentsSupported: 50 },
    { id: 'GR-04', name: 'NextGen Clean Energy Research Seed Fund', corpusInr: 8000000, department: 'Electrical & Green Tech', studentsSupported: 15 }
  ]
};

export async function GET() {
  return NextResponse.json({
    success: true,
    data: mockEndowment
  });
}
