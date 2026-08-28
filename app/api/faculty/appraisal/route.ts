import { NextResponse } from 'next/server';
import { apiSuccess, apiError } from '@/lib/apiResponse';

export async function GET() {
  const pbasProfile = {
    facultyName: 'Dr. Vivek Swaminathan',
    department: 'Computer Science & Engineering',
    currentDesignation: 'Associate Professor',
    targetPromotion: 'Professor (Level 14)',
    academicYear: '2025-2026',
    categories: [
      {
        categoryNumber: 'Category I',
        title: 'Teaching-Learning & Evaluation Activities',
        maxTargetScore: 100,
        claimedScore: 95,
        criteria: [
          { name: 'Lectures / Tutorials Conducted (100% compliance)', score: 50 },
          { name: 'Innovative Teaching Pedagogies & AI LMS integration', score: 25 },
          { name: 'Examination & University Evaluation Duties', score: 20 }
        ]
      },
      {
        categoryNumber: 'Category II',
        title: 'Professional Development & Institute Governance',
        maxTargetScore: 50,
        claimedScore: 48,
        criteria: [
          { name: 'NBA Accreditation Department Coordinator', score: 20 },
          { name: 'IEEE Student Branch Counselor', score: 15 },
          { name: 'Curriculum Revision Board Member', score: 13 }
        ]
      },
      {
        categoryNumber: 'Category III',
        title: 'Research & Academic Contributions (Scopus/SCI)',
        maxTargetScore: 150,
        claimedScore: 142,
        criteria: [
          { name: '4 SCI Indexed Journal Publications (Q1/Q2)', score: 80 },
          { name: 'DST Sponsored Project Principal Investigator', score: 40 },
          { name: '2 Granted Indian Patents', score: 22 }
        ]
      }
    ],
    totalApiScoreClaimed: 285,
    minimumApiRequiredForPromotion: 250,
    casEligibilityStatus: 'ELIGIBLE_FOR_PROMOTION'
  };

  return apiSuccess(pbasProfile);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { category, activityTitle, claimedPoints } = body;

    if (!category || !activityTitle || !claimedPoints) {
      return apiError('Missing required appraisal line item parameters', 400);
    }

    return apiSuccess({
      activityId: `pbas-item-${Date.now()}`,
      category,
      activityTitle,
      claimedPoints: Number(claimedPoints),
      verificationStatus: 'PENDING_IQAC_AUDIT'
    }, 'Appraisal credit added to CAS portfolio', 201);
  } catch {
    return apiError('Failed to record PBAS credit', 500);
  }
}
