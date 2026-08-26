import { NextResponse } from 'next/server';
import { apiSuccess, apiError } from '@/lib/apiResponse';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { skills = [], projects = [], experience = [], targetRole = 'Software Engineer' } = body;

    // Calculate intelligent ATS score
    let score = 50;
    const recommendations: string[] = [];

    // Target role specific keyword requirements
    const roleKeywordsMap: Record<string, string[]> = {
      'Full Stack Engineer': ['react', 'next.js', 'typescript', 'node.js', 'sql', 'docker', 'tailwind', 'graphql', 'redis', 'ci/cd'],
      'AI/ML Specialist': ['python', 'pytorch', 'tensorflow', 'scikit-learn', 'rag', 'vector embeddings', 'huggingface', 'docker', 'fastapi'],
      'DevOps & Cloud Engineer': ['docker', 'kubernetes', 'aws', 'terraform', 'ci/cd', 'linux', 'prometheus', 'github actions', 'nginx'],
      'Data Scientist': ['python', 'sql', 'pandas', 'tableau', 'spark', 'machine learning', 'powerbi', 'statistics'],
      'Cybersecurity Analyst': ['wireshark', 'siem', 'network security', 'cryptography', 'owasp', 'penetration testing', 'linux']
    };

    const targetKeywords = roleKeywordsMap[targetRole] || roleKeywordsMap['Full Stack Engineer'];
    const matchedSkills = targetKeywords.filter((k: string) =>
      skills.some((s: string) => s.toLowerCase().includes(k)) ||
      projects.some((p: any) => (p.tech + ' ' + p.bullets).toLowerCase().includes(k))
    );
    const missingKeywords = targetKeywords.filter((k: string) => !matchedSkills.includes(k));

    // Calculate intelligent ATS score
    let score = 45;
    const recommendations: string[] = [];

    const skillScore = Math.min(30, Math.round((matchedSkills.length / targetKeywords.length) * 30));
    score += skillScore;

    if (missingKeywords.length > 0) {
      recommendations.push(`Target role "${targetRole}" strongly values: ${missingKeywords.slice(0, 3).join(', ')}.`);
    }

    if (projects.length >= 2) {
      score += 15;
    } else {
      recommendations.push('Add at least 2 production-grade projects with quantifiable performance metrics.');
    }

    if (experience.length >= 1) {
      score += 10;
    }

    const finalScore = Math.min(score, 98);

    return apiSuccess({
      atsScore: finalScore,
      grade: finalScore >= 85 ? 'Strong ATS Match' : finalScore >= 70 ? 'Moderate ATS Match' : 'Needs Optimization',
      targetRole,
      matchedKeywords: matchedSkills,
      missingKeywords,
      breakdown: {
        contactInfo: 100,
        technicalSkills: Math.round((matchedSkills.length / targetKeywords.length) * 100),
        projectExperience: projects.length >= 2 ? 95 : 60,
        actionVerbs: 85
      },
      recommendations: recommendations.length > 0 ? recommendations : [
        'Great resume format! Ensure your project impact bullets use quantifiable metric numbers (e.g., reduced load time by 35%).'
      ],
      aiSuggestions: [
        'Replace passive verbs with high-impact action verbs (e.g. "Architected", "Engineered", "Optimized", "Scaled").',
        'Ensure contact information contains updated GitHub and LinkedIn URLs.',
        'Keep overall resume strictly to 1 page for university placement drives.'
      ]
    });
  } catch (err: any) {
    return apiError(err.message || 'Failed to analyze resume');
  }
}
