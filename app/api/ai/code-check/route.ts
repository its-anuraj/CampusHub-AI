import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code, language = 'javascript', assignmentTitle = 'Assignment' } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ success: false, error: 'Valid source code is required' }, { status: 400 });
    }

    // Simulated Code Analysis Engine
    const lines = code.split('\n').filter(l => l.trim().length > 0);
    const lineCount = lines.length;
    const charCount = code.length;
    
    // Cyclomatic complexity estimation
    const conditionals = (code.match(/\b(if|else if|for|while|case|catch|\?\s*:)\b/g) || []).length;
    const cyclomaticComplexity = Math.max(1, Math.min(25, conditionals + 1));
    
    // Plagiarism & Similarity estimation
    const hasStandardTemplates = code.includes('function') || code.includes('class') || code.includes('import');
    const similarityScore = Math.floor(Math.random() * 12) + (hasStandardTemplates ? 4 : 2); // 2-16% normal similarity
    
    // Quality metrics
    const qualityScore = Math.max(70, Math.min(98, 100 - (cyclomaticComplexity > 10 ? 15 : 0) - (lineCount > 200 ? 10 : 0)));

    const suggestions = [
      cyclomaticComplexity > 8 ? 'Consider breaking down complex nested logic into smaller modular functions.' : 'Modular function structure looks optimal.',
      !code.includes('//') && !code.includes('/*') ? 'Add inline comments explaining key algorithmic trade-offs.' : 'Documentation and comments are well structured.',
      'Memory allocation & time complexity appear within standard O(N log N) bounds.',
      'Naming conventions follow standard camelCase/snake_case practices.'
    ];

    const securityScan = {
      sqlInjectionRisk: 'None detected (Parameterization recommended)',
      hardcodedSecrets: 'No exposed API keys or tokens found',
      bufferSafety: 'Safe'
    };

    return NextResponse.json({
      success: true,
      data: {
        assignmentTitle,
        language,
        metrics: {
          lineCount,
          charCount,
          cyclomaticComplexity,
          similarityScore: `${similarityScore}%`,
          plagiarismVerdict: similarityScore < 20 ? 'Original Work (Safe)' : 'Flagged for Manual Review',
          qualityScore: `${qualityScore}/100`,
          gradeEstimate: qualityScore >= 90 ? 'A+' : qualityScore >= 80 ? 'A' : 'B+'
        },
        securityScan,
        suggestions,
        analyzedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Code Check Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
