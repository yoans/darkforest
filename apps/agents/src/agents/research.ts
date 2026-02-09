import { Agent, AgentTask, AgentResult } from '../types/base';
import { RobustOpenAI } from '../utils/openai';

export class ResearchAgent extends Agent {
  id = 'research-001';
  name = 'Research Agent';
  type = 'RESEARCH';
  version = '1.0.0';

  private ai: RobustOpenAI;

  constructor(apiKey: string) {
    super();
    this.ai = new RobustOpenAI(apiKey);
  }

  async execute(task: AgentTask): Promise<AgentResult> {
    try {
      switch (task.type) {
        case 'RESEARCH':
        case 'TRENDING_TOPICS':
          return await this.researchTrendingTopics(task);
        case 'FACT_CHECK':
          return await this.factCheck(task);
        case 'COMPETITOR_RESEARCH':
          return await this.competitorResearch(task);
        case 'SOURCE_GATHERING':
          return await this.gatherSources(task);
        default:
          return this.createErrorResult(`Unsupported task type: ${task.type}`);
      }
    } catch (error) {
      return this.createErrorResult(`Research agent error: ${error}`);
    }
  }

  getCapabilities(): string[] {
    return [
      'RESEARCH',
      'TRENDING_TOPICS',
      'FACT_CHECK',
      'COMPETITOR_RESEARCH',
      'SOURCE_GATHERING',
    ];
  }

  private async researchTrendingTopics(task: AgentTask): Promise<AgentResult> {
    const { niche = 'technology', count = 10, timeframe = 'this week' } = task.data as {
      niche?: string;
      count?: number;
      timeframe?: string;
    };

    const result = await this.ai.callJSON<{
      trends: Array<{
        topic: string;
        relevanceScore: number;
        searchVolume: string;
        competition: string;
        contentAngle: string;
        targetKeywords: string[];
      }>;
      insights: string;
      recommendedContentTypes: string[];
    }>({
      model: 'gpt-4',
      temperature: 0.8,
      maxTokens: 3000,
      systemPrompt: `You are a market research analyst specializing in ${niche}. Your job is to identify trending topics, emerging themes, and content opportunities. Always return well-researched, specific topics with data-driven insights. Current date: ${new Date().toISOString().split('T')[0]}`,
      userPrompt: `Research and identify the top ${count} trending topics in the "${niche}" space for ${timeframe}.

For each topic provide:
- A specific, actionable topic title
- Relevance score (1-100)
- Estimated search volume trend (rising, stable, declining)
- Competition level (low, medium, high)
- Recommended content angle
- 3-5 target keywords

Also provide:
- Overall market insights for this niche
- Recommended content types to prioritize

Return as JSON:
{
  "trends": [
    {
      "topic": "...",
      "relevanceScore": 85,
      "searchVolume": "rising",
      "competition": "medium",
      "contentAngle": "...",
      "targetKeywords": ["kw1", "kw2", "kw3"]
    }
  ],
  "insights": "Overall market analysis...",
  "recommendedContentTypes": ["how-to guides", "comparisons", ...]
}`,
      jsonMode: true,
    });

    return this.createSuccessResult({
      trends: result.trends,
      insights: result.insights,
      recommendedContentTypes: result.recommendedContentTypes,
      niche,
      timeframe,
      generatedAt: new Date().toISOString(),
    });
  }

  private async factCheck(task: AgentTask): Promise<AgentResult> {
    const { claims = [], context = '' } = task.data as {
      claims?: string[];
      context?: string;
    };

    const result = await this.ai.callJSON<{
      results: Array<{
        claim: string;
        verdict: string;
        confidence: number;
        explanation: string;
        suggestedRevision: string;
      }>;
    }>({
      model: 'gpt-4',
      temperature: 0.2,
      maxTokens: 2000,
      systemPrompt: 'You are a meticulous fact-checker. Evaluate claims for accuracy, identifying potential misinformation, outdated statistics, or misleading statements. Be conservative — flag anything uncertain.',
      userPrompt: `Fact-check these claims from the context of: "${context}"

Claims to verify:
${claims.map((c, i) => `${i + 1}. ${c}`).join('\n')}

For each claim, return:
{
  "results": [
    {
      "claim": "original claim",
      "verdict": "verified|likely-true|unverifiable|likely-false|false",
      "confidence": 0.85,
      "explanation": "why this verdict",
      "suggestedRevision": "better wording if needed"
    }
  ]
}`,
      jsonMode: true,
    });

    return this.createSuccessResult({
      factCheckResults: result.results,
      totalClaims: claims.length,
      verifiedCount: result.results.filter(r => r.verdict === 'verified' || r.verdict === 'likely-true').length,
    });
  }

  private async competitorResearch(task: AgentTask): Promise<AgentResult> {
    const { niche = 'technology', focusAreas = ['content strategy', 'keywords', 'topics'] } = task.data as {
      niche?: string;
      focusAreas?: string[];
    };

    const result = await this.ai.callJSON<{
      competitorInsights: Array<{
        area: string;
        findings: string[];
        opportunities: string[];
        threats: string[];
      }>;
      contentGaps: string[];
      recommendedActions: string[];
    }>({
      model: 'gpt-4',
      temperature: 0.7,
      maxTokens: 2500,
      systemPrompt: `You are a competitive intelligence analyst for the ${niche} space. Analyze market dynamics and identify strategic opportunities for content creation.`,
      userPrompt: `Conduct a competitive landscape analysis for the "${niche}" niche.

Focus areas: ${focusAreas.join(', ')}

Provide:
1. Key insights for each focus area (findings, opportunities, threats)
2. Content gaps that competitors are missing
3. Recommended strategic actions

Return as JSON:
{
  "competitorInsights": [
    {
      "area": "content strategy",
      "findings": ["..."],
      "opportunities": ["..."],
      "threats": ["..."]
    }
  ],
  "contentGaps": ["gap1", "gap2"],
  "recommendedActions": ["action1", "action2"]
}`,
      jsonMode: true,
    });

    return this.createSuccessResult({
      ...result,
      niche,
      analyzedAt: new Date().toISOString(),
    });
  }

  private async gatherSources(task: AgentTask): Promise<AgentResult> {
    const { topic = '', niche = 'technology' } = task.data as {
      topic?: string;
      niche?: string;
    };

    const result = await this.ai.callJSON<{
      sources: Array<{
        title: string;
        type: string;
        relevance: number;
        keyTakeaway: string;
        citationText: string;
      }>;
      statistics: Array<{
        stat: string;
        context: string;
        year: number;
      }>;
      expertQuotes: Array<{
        quote: string;
        attribution: string;
        context: string;
      }>;
    }>({
      model: 'gpt-4',
      temperature: 0.5,
      maxTokens: 2500,
      systemPrompt: `You are a research assistant specializing in ${niche}. Provide well-sourced information, statistics, and expert perspectives. Note: provide realistic examples of the types of sources, statistics, and quotes that should be gathered through proper research tools.`,
      userPrompt: `Gather research materials for an article about "${topic}" in the ${niche} space.

Provide:
1. 5-8 recommended reference sources (reports, studies, articles)
2. 5-10 relevant statistics with context and approximate dates
3. 3-5 expert perspectives/quotes relevant to this topic

Return as JSON:
{
  "sources": [{"title": "...", "type": "report|study|article", "relevance": 90, "keyTakeaway": "...", "citationText": "..."}],
  "statistics": [{"stat": "...", "context": "...", "year": 2025}],
  "expertQuotes": [{"quote": "...", "attribution": "...", "context": "..."}]
}`,
      jsonMode: true,
    });

    return this.createSuccessResult({
      ...result,
      topic,
      niche,
      gatheredAt: new Date().toISOString(),
    });
  }
}
