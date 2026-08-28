import { NextResponse } from 'next/server';
import { apiSuccess, apiError } from '@/lib/apiResponse';

export async function GET() {
  const rankingReport = {
    framework: 'NIRF (National Institutional Ranking Framework) 2026',
    overallRank: 24,
    previousYearRank: 31,
    engineeringRank: 16,
    totalScore: 68.45,
    parameters: [
      {
        code: 'TLR',
        title: 'Teaching, Learning & Resources',
        weight: 30,
        score: 23.4,
        maxScore: 30,
        details: 'Student-faculty ratio 1:14, 88% faculty with Ph.D., fully modern labs'
      },
      {
        code: 'RPC',
        title: 'Research and Professional Practice',
        weight: 30,
        score: 21.8,
        maxScore: 30,
        details: '420+ Scopus/WoS papers published, 18 funded R&D patents'
      },
      {
        code: 'GO',
        title: 'Graduation Outcomes',
        weight: 20,
        score: 16.5,
        maxScore: 20,
        details: '94.2% campus placement rate, ₹14.8 LPA median salary package'
      },
      {
        code: 'OI',
        title: 'Outreach and Inclusivity',
        weight: 10,
        score: 7.2,
        maxScore: 10,
        details: '34% female student intake, national representation from 22 Indian states'
      },
      {
        code: 'PR',
        title: 'Perception & Peer Reputation',
        weight: 10,
        score: 6.8,
        maxScore: 10,
        details: 'Employer survey score 84/100, academic peer ranking 79/100'
      }
    ],
    qsAsiaRankEstimate: '210-220 Band',
    naacAccreditation: 'A++ Grade (3.72 CGPA)'
  };

  return apiSuccess(rankingReport);
}
