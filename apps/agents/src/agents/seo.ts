import { Agent, AgentTask, AgentResult } from '../types/base';
import { RobustOpenAI } from '../utils/openai';

export class SEOAgent extends Agent {
  id = 'seo-001';
  name = 'SEO Optimization Agent';
  type = 'SEO';
  version = '1.0.0';

  private ai: RobustOpenAI;

  constructor(apiKey: string) {
    super();
    this.ai = new RobustOpenAI(apiKey);
  }

  async execute(task: AgentTask): Promise<AgentResult> {
    try {
      switch (task.type) {
        case 'SEO_OPTIMIZATION':
          return await this.optimizeContent(task);
        case 'KEYWORD_ANALYSIS':
          return await this.analyzeKeywords(task);
        case 'SEO_AUDIT':
          return await this.auditPage(task);
        case 'META_GENERATION':
          return await this.generateMeta(task);
        case 'INTERNAL_LINKING':
          return await this.suggestInternalLinks(task);
        default:
          return this.createErrorResult(`Unsupported task type: ${task.type}`);
      }
    } catch (error) {
      return this.createErrorResult(`SEO agent error: ${error}`);
    }
  }

  getCapabilities(): string[] {
    return [
      'SEO_OPTIMIZATION',
      'KEYWORD_ANALYSIS',
      'SEO_AUDIT',
      'META_GENERATION',
      'INTERNAL_LINKING',
    ];
  }

  private async optimizeContent(task: AgentTask): Promise<AgentResult> {
    const {
      content = '',
      title = '',
      targetKeyword = '',
      secondaryKeywords = [],
    } = task.data as {
      content?: string;
      title?: string;
      targetKeyword?: string;
      secondaryKeywords?: string[];
    };

    const result = await this.ai.callJSON<{
      seoScore: number;
      optimizedTitle: string;
      optimizedMetaDescription: string;
      keywordDensity: { primary: number; recommendation: string };
      headingOptimization: { current: string[]; suggested: string[] };
      contentSuggestions: string[];
      readabilityScore: number;
      readabilitySuggestions: string[];
      schemaRecommendations: object;
      internalLinkOpportunities: string[];
    }>({
      model: 'gpt-4',
      temperature: 0.3,
      maxTokens: 3000,
      systemPrompt: 'You are a senior SEO specialist. Analyze content for search engine optimization and provide specific, actionable improvements. Score rigorously — do not inflate scores.',
      userPrompt: `Analyze and optimize this content for SEO:

Title: "${title}"
Target Keyword: "${targetKeyword}"
Secondary Keywords: ${secondaryKeywords.join(', ')}

Content (first 3000 chars):
${content.substring(0, 3000)}

Provide a comprehensive SEO analysis as JSON:
{
  "seoScore": 0-100,
  "optimizedTitle": "improved title with keyword",
  "optimizedMetaDescription": "155-160 char meta description",
  "keywordDensity": {
    "primary": 1.5,
    "recommendation": "increase/decrease/optimal"
  },
  "headingOptimization": {
    "current": ["existing H2s"],
    "suggested": ["keyword-optimized H2s"]
  },
  "contentSuggestions": ["specific improvement 1", "specific improvement 2"],
  "readabilityScore": 0-100,
  "readabilitySuggestions": ["..."],
  "schemaRecommendations": {"@type": "Article", "...": "..."},
  "internalLinkOpportunities": ["topic that should link to another post"]
}`,
      jsonMode: true,
    });

    return this.createSuccessResult({
      ...result,
      targetKeyword,
      analyzedAt: new Date().toISOString(),
    });
  }

  private async analyzeKeywords(task: AgentTask): Promise<AgentResult> {
    const { seedKeywords = [], niche = 'technology' } = task.data as {
      seedKeywords?: string[];
      niche?: string;
    };

    const result = await this.ai.callJSON<{
      keywords: Array<{
        keyword: string;
        estimatedDifficulty: number;
        estimatedVolume: string;
        intent: string;
        suggestedContentType: string;
        longTailVariations: string[];
      }>;
      clusters: Array<{
        theme: string;
        keywords: string[];
        priority: number;
      }>;
    }>({
      model: 'gpt-4',
      temperature: 0.5,
      maxTokens: 3000,
      systemPrompt: `You are an SEO keyword research expert for the ${niche} niche. Provide realistic keyword analysis with difficulty scores and search intent classification.`,
      userPrompt: `Conduct keyword research starting from these seed keywords: ${seedKeywords.join(', ')}

For each keyword provide:
- Estimated difficulty (1-100, be realistic)
- Estimated monthly search volume range
- Search intent (informational, transactional, navigational, commercial)
- Best content type for this keyword
- 3-5 long-tail variations

Also group keywords into thematic clusters with priority scores.

Return as JSON:
{
  "keywords": [
    {
      "keyword": "...",
      "estimatedDifficulty": 45,
      "estimatedVolume": "1K-10K",
      "intent": "informational",
      "suggestedContentType": "how-to guide",
      "longTailVariations": ["...", "..."]
    }
  ],
  "clusters": [
    {"theme": "...", "keywords": ["..."], "priority": 9}
  ]
}`,
      jsonMode: true,
    });

    return this.createSuccessResult({
      ...result,
      seedKeywords,
      niche,
      analyzedAt: new Date().toISOString(),
    });
  }

  private async auditPage(task: AgentTask): Promise<AgentResult> {
    const { url = '', html = '', targetKeyword = '' } = task.data as {
      url?: string;
      html?: string;
      targetKeyword?: string;
    };

    const contentPreview = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').substring(0, 2000);

    const result = await this.ai.callJSON<{
      overallScore: number;
      titleTag: { score: number; current: string; recommendation: string };
      metaDescription: { score: number; current: string; recommendation: string };
      headings: { score: number; issues: string[] };
      contentQuality: { score: number; wordCount: number; issues: string[] };
      technicalSEO: { issues: string[]; score: number };
      prioritizedFixes: Array<{ priority: number; fix: string; impact: string }>;
    }>({
      model: 'gpt-4',
      temperature: 0.2,
      maxTokens: 2500,
      systemPrompt: 'You are an SEO auditor. Analyze web pages and provide specific, prioritized improvement recommendations.',
      userPrompt: `Audit this page for SEO:
URL: ${url}
Target Keyword: "${targetKeyword}"

Page content (text extracted):
${contentPreview}

Provide a complete SEO audit as JSON with scores for each area and prioritized fixes.
{
  "overallScore": 0-100,
  "titleTag": {"score": 0-100, "current": "...", "recommendation": "..."},
  "metaDescription": {"score": 0-100, "current": "...", "recommendation": "..."},
  "headings": {"score": 0-100, "issues": ["..."]},
  "contentQuality": {"score": 0-100, "wordCount": 0, "issues": ["..."]},
  "technicalSEO": {"issues": ["..."], "score": 0-100},
  "prioritizedFixes": [{"priority": 1, "fix": "...", "impact": "high|medium|low"}]
}`,
      jsonMode: true,
    });

    return this.createSuccessResult({
      ...result,
      url,
      targetKeyword,
      auditedAt: new Date().toISOString(),
    });
  }

  private async generateMeta(task: AgentTask): Promise<AgentResult> {
    const { title = '', content = '', targetKeyword = '' } = task.data as {
      title?: string;
      content?: string;
      targetKeyword?: string;
    };

    const result = await this.ai.callJSON<{
      metaTitle: string;
      metaDescription: string;
      ogTitle: string;
      ogDescription: string;
      twitterTitle: string;
      twitterDescription: string;
      canonicalSlug: string;
      focusKeyphrase: string;
    }>({
      model: 'gpt-4',
      temperature: 0.5,
      maxTokens: 1000,
      systemPrompt: 'You are an SEO specialist. Generate optimal meta tags for search engines and social media.',
      userPrompt: `Generate SEO meta tags for:
Title: "${title}"
Keyword: "${targetKeyword}"
Content preview: ${content.substring(0, 500)}

Return JSON with optimized meta tags:
{
  "metaTitle": "50-60 chars, include keyword",
  "metaDescription": "155-160 chars, compelling, include keyword",
  "ogTitle": "optimized for social sharing",
  "ogDescription": "optimized for social sharing",
  "twitterTitle": "optimized for Twitter",
  "twitterDescription": "optimized for Twitter",
  "canonicalSlug": "keyword-optimized-url-slug",
  "focusKeyphrase": "primary focus keyword"
}`,
      jsonMode: true,
    });

    return this.createSuccessResult(result);
  }

  private async suggestInternalLinks(task: AgentTask): Promise<AgentResult> {
    const { content = '', existingPosts = [] } = task.data as {
      content?: string;
      existingPosts?: Array<{ title: string; slug: string; keywords: string[] }>;
    };

    const result = await this.ai.callJSON<{
      suggestions: Array<{
        anchorText: string;
        targetPost: string;
        targetSlug: string;
        relevanceScore: number;
        contextSentence: string;
      }>;
    }>({
      model: 'gpt-4',
      temperature: 0.3,
      maxTokens: 2000,
      systemPrompt: 'You are an SEO internal linking specialist. Suggest natural, relevant internal links between blog posts.',
      userPrompt: `Suggest internal links for this content:

Content (preview):
${content.substring(0, 2000)}

Existing posts that could be linked to:
${existingPosts.map(p => `- "${p.title}" (${p.slug}) [keywords: ${p.keywords.join(', ')}]`).join('\n')}

Return JSON:
{
  "suggestions": [
    {
      "anchorText": "natural anchor text from the content",
      "targetPost": "title of post to link to",
      "targetSlug": "slug of target post",
      "relevanceScore": 90,
      "contextSentence": "the sentence where the link should be placed"
    }
  ]
}`,
      jsonMode: true,
    });

    return this.createSuccessResult({
      ...result,
      analyzedAt: new Date().toISOString(),
    });
  }
}
