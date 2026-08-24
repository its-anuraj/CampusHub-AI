import { NextResponse } from 'next/server';
import { apiSuccess, apiError } from '@/lib/apiResponse';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { skills = [], projects = [], experience = [], targetRole = 'Software Engineer' } = body;

    // Calculate intelligent ATS score
    let score = 50;
    const recommendations: string[] = [];

    const skillKeywords = ['react', 'next.js', 'typescript', 'python', 'sql', 'docker', 'aws', 'node.js', 'git', 'tailwind', 'graphql'];
    const matchedSkills = skills.filter((s: string) => skillKeywords.some(k => s.toLowerCase().includes(k)));

    if (matchedSkills.length >= 6) {
      score += 20;
    } else {
      score += matchedSkills.length * 3;
      recommendations.push('Add more industry-standard technical skills like Docker, Cloud (AWS/GCP), or Next.js.');
    }

    if (projects.length >= 2) {
      score += 15;
    } else {
      recommendations.push('Add at least 2 full-stack or data-intensive production projects with GitHub links.');
    }

    if (experience.length >= 1) {
      score += 15;
    } else {
      recommendations.push('Include relevant summer internships, open-source contributions, or campus technical lead roles.');
    }

    const finalScore = Math.min(score, 98);

    return apiSuccess({
      atsScore: finalScore,
      grade: finalScore >= 85 ? 'Strong ATS Match' : finalScore >= 70 ? 'Moderate ATS Match' : 'Needs Optimization',
      targetRole,
      matchedKeywordsCount: matchedSkills.length,
      recommendations: recommendations.length > 0 ? recommendations : [
        'Great resume format! Ensure your project impact bullets use quantifiable metric numbers (e.g., reduced load time by 35%).'
      ],
      aiSuggestions: [
        'Replace passive verbs (e.g. "helped build") with high-impact power verbs (e.g. "Architected", "Engineered", "Optimized").',
        'Ensure contact information contains updated GitHub and LinkedIn hyperlinks.',
        'Keep overall resume strictly to 1 page for campus recruitment drives.'
      ]
    });
  } catch (err: any) {
    return apiError(err.message || 'Failed to analyze resume');
  }
}
