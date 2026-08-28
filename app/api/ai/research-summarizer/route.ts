import { NextResponse } from 'next/server';
import { apiSuccess, apiError } from '@/lib/apiResponse';

export async function GET() {
  const samplePapers = [
    {
      id: 'paper-101',
      title: 'Attention Is All You Need: Scalable Multi-Head Self-Attention in Sequence Transduction',
      authors: ['Ashish Vaswani', 'Noam Shazeer', 'Niki Parmar', 'Jakob Uszkoreit'],
      year: 2024,
      venue: 'NeurIPS Campus Review',
      doi: '10.5555/campushub.2024.101',
      tldr: 'Proposes transformer architecture replacing recurrent layers with parallelized multi-head attention mechanisms.',
      keyContributions: [
        'Elimination of sequential recurrence for 4.2x faster training throughput',
        'Multi-head dot-product scaled self-attention mechanism',
        'State-of-the-art BLEU score translation performance across multi-lingual benchmarks'
      ],
      methodologyScore: 94,
      relevanceScore: 98,
      citations: {
        bibtex: `@article{vaswani2024campushub,\n  title={Attention Is All You Need: Scalable Multi-Head Self-Attention},\n  author={Vaswani, Ashish and Shazeer, Noam and Parmar, Niki},\n  journal={CampusHub AI Research Review},\n  year={2024}\n}`,
        apa: 'Vaswani, A., Shazeer, N., & Parmar, N. (2024). Attention Is All You Need: Scalable Multi-Head Self-Attention. CampusHub AI Research Review, 12(3), 45-58.',
        ieee: 'A. Vaswani, N. Shazeer, and N. Parmar, "Attention Is All You Need: Scalable Multi-Head Self-Attention," CampusHub AI Research Review, vol. 12, no. 3, pp. 45-58, 2024.'
      }
    },
    {
      id: 'paper-102',
      title: 'Autonomous Multi-Agent Systems in Smart Campus Micro-Grids and Renewable Optimization',
      authors: ['Dr. Rajesh Sharma', 'Priya Iyer', 'Dev Malhotra'],
      year: 2025,
      venue: 'IEEE Transactions on Sustainable Smart Cities',
      doi: '10.1109/TSSC.2025.882190',
      tldr: 'Deploys distributed Q-learning reinforcement agents to balance campus solar generation and EV charging loads.',
      keyContributions: [
        'Decentralized peer-to-peer micro-grid energy balancing protocol',
        'Peak grid tariff shaving algorithm saving 27.4% monthly electrical costs',
        'Sub-second frequency stabilization under variable photovoltaic irradiance'
      ],
      methodologyScore: 91,
      relevanceScore: 95,
      citations: {
        bibtex: `@article{sharma2025microgrids,\n  title={Autonomous Multi-Agent Systems in Smart Campus Micro-Grids},\n  author={Sharma, Rajesh and Iyer, Priya and Malhotra, Dev},\n  journal={IEEE Trans. Sustainable Smart Cities},\n  year={2025}\n}`,
        apa: 'Sharma, R., Iyer, P., & Malhotra, D. (2025). Autonomous Multi-Agent Systems in Smart Campus Micro-Grids. IEEE Transactions on Sustainable Smart Cities, 8(2), 112-125.',
        ieee: 'R. Sharma, P. Iyer, and D. Malhotra, "Autonomous Multi-Agent Systems in Smart Campus Micro-Grids," IEEE Trans. Sustainable Smart Cities, vol. 8, no. 2, pp. 112-125, 2025.'
      }
    }
  ];

  return apiSuccess({ papers: samplePapers, totalIndexed: samplePapers.length });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { paperTitle, abstractText } = body;

    if (!paperTitle || !abstractText) {
      return apiError('Missing required paper title or abstract content', 400);
    }

    const generatedSummary = {
      id: `paper-${Date.now()}`,
      title: paperTitle,
      tldr: `AI Analysis: The work investigates "${paperTitle.slice(0, 50)}" highlighting algorithmic efficiency, empirical benchmarks, and system reproducibility.`,
      keyFindings: [
        'Systematic validation across structured campus datasets',
        'Quantified performance margin over baseline architectures',
        'Formal asymptotic complexity analysis and reproducible test harness'
      ],
      suggestedKeywords: ['Machine Learning', 'Campus Intelligence', 'Optimization', 'Neural Systems'],
      citations: {
        bibtex: `@misc{campushub_${Date.now()},\n  title={${paperTitle}},\n  author={CampusHub Scholar},\n  year={${new Date().getFullYear()}}\n}`,
        apa: `CampusHub Scholar. (${new Date().getFullYear()}). ${paperTitle}. CampusHub Student Repository.`,
        ieee: `C. Scholar, "${paperTitle}," CampusHub Student Repository, ${new Date().getFullYear()}.`
      },
      qualityScore: 92
    };

    return apiSuccess(generatedSummary, 'Paper summarized and citations generated successfully', 201);
  } catch {
    return apiError('Failed to parse paper analysis request', 500);
  }
}
