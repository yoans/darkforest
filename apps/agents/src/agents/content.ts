import { Agent, AgentTask, AgentResult } from '../types/base';
import OpenAI from 'openai';

export class ContentAgent extends Agent {
  id = 'content-001';
  name = 'Content Generation Agent';
  type = 'CONTENT';
  version = '1.0.0';

  private openai: OpenAI;

  constructor(apiKey: string) {
    super();
    this.openai = new OpenAI({ apiKey });
  }

  async execute(task: AgentTask): Promise<AgentResult> {
    try {
      switch (task.type) {
        case 'CONTENT_GENERATION':
          return await this.generateArticle(task);
        case 'CONTENT_OPTIMIZATION':
          return await this.optimizeContent(task);
        case 'TITLE_GENERATION':
          return await this.generateTitles(task);
        default:
          return this.createErrorResult(`Unsupported task type: ${task.type}`);
      }
    } catch (error) {
      return this.createErrorResult(`Content agent error: ${error}`);
    }
  }

  getCapabilities(): string[] {
    return [
      'CONTENT_GENERATION',
      'CONTENT_OPTIMIZATION',
      'TITLE_GENERATION',
      'SEO_WRITING',
      'CONTENT_EXPANSION'
    ];
  }

  private async generateArticle(task: AgentTask): Promise<AgentResult> {
    const { 
      topic, 
      keyword, 
      wordCount = 1000, 
      tone = 'professional',
      audience,
      siteConfig 
    } = task.data;

    const prompt = `
    Write a comprehensive ${wordCount}-word article about "${topic}" targeting the keyword "${keyword}".
    
    Requirements:
    - Audience: ${audience}
    - Tone: ${tone}
    - SEO optimized for "${keyword}"
    - Include relevant headings (H2, H3)
    - Add internal linking opportunities (mark as [INTERNAL_LINK: topic])
    - Include a compelling introduction and conclusion
    - Ensure readability score above 60
    - Add meta description (150-160 characters)
    
    Blog niche: ${siteConfig?.niche}
    Brand voice: ${siteConfig?.brandVoice || 'authoritative yet approachable'}
    
    Format as JSON:
    {
      "title": "SEO optimized title",
      "content": "Full article content with markdown formatting",
      "excerpt": "Brief excerpt for preview",
      "metaDescription": "SEO meta description",
      "headings": ["H2 heading 1", "H2 heading 2"],
      "internalLinks": ["topic1", "topic2"],
      "wordCount": actual_word_count,
      "readabilityScore": estimated_score
    }
    `;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system', 
          content: 'You are an expert content writer and SEO specialist. Create high-quality, engaging articles that rank well in search engines while providing genuine value to readers.'
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return this.createErrorResult('No response from OpenAI');
    }

    try {
      const article = JSON.parse(content);
      
      // Quality checks
      const actualWordCount = article.content?.split(' ').length || 0;
      const meetsWordCount = actualWordCount >= (wordCount * 0.8); // Allow 20% variance
      
      if (!meetsWordCount) {
        return this.createErrorResult(
          `Article too short: ${actualWordCount} words (minimum: ${wordCount * 0.8})`
        );
      }

      // Check for required elements
      if (!article.title || !article.content || !article.metaDescription) {
        return this.createErrorResult('Article missing required elements');
      }

      // This content requires human approval for quality
      const requiresApproval = await this.requiresHumanApproval('content', article);

      return this.createSuccessResult({
        article,
        metadata: {
          model: 'gpt-4',
          tokensUsed: response.usage?.total_tokens,
          actualWordCount,
          qualityScore: this.calculateQualityScore(article),
        }
      }, requiresApproval);

    } catch (parseError) {
      return this.createErrorResult(`Failed to parse article: ${parseError}`);
    }
  }

  private async optimizeContent(task: AgentTask): Promise<AgentResult> {
    const { content, targetKeywords, optimizationGoals } = task.data;

    const prompt = `
    Optimize this existing content for SEO and readability:
    
    Original Content:
    ${content}
    
    Target Keywords: ${targetKeywords.join(', ')}
    Optimization Goals: ${optimizationGoals.join(', ')}
    
    Provide optimized version with:
    1. Better keyword integration
    2. Improved readability
    3. Enhanced structure with headings
    4. Meta description optimization
    5. Suggestions for improvement
    
    Format as JSON with original and optimized versions.
    `;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 3000,
    });

    const optimization = JSON.parse(response.choices[0]?.message?.content || '{}');
    
    return this.createSuccessResult({
      optimization,
      improvements: optimization.suggestions || []
    });
  }

  private async generateTitles(task: AgentTask): Promise<AgentResult> {
    const { topic, keyword, count = 5 } = task.data;

    const prompt = `
    Generate ${count} compelling, SEO-optimized titles for an article about "${topic}" targeting "${keyword}".
    
    Requirements:
    - Include the target keyword
    - 50-60 characters for optimal SEO
    - Click-worthy and engaging
    - Various formats (how-to, list, question, etc.)
    
    Return as JSON array of title objects with SEO analysis.
    `;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
      max_tokens: 1000,
    });

    const titles = JSON.parse(response.choices[0]?.message?.content || '[]');
    
    return this.createSuccessResult({ titles });
  }

  private calculateQualityScore(article: any): number {
    let score = 0;
    
    // Title quality (0-20 points)
    if (article.title && article.title.length >= 30 && article.title.length <= 60) {
      score += 20;
    } else if (article.title) {
      score += 10;
    }

    // Content length (0-20 points)
    const wordCount = article.content?.split(' ').length || 0;
    if (wordCount >= 1000) score += 20;
    else if (wordCount >= 500) score += 15;
    else if (wordCount >= 300) score += 10;

    // Structure (0-20 points)
    const hasHeadings = article.headings && article.headings.length >= 2;
    if (hasHeadings) score += 20;

    // Meta description (0-20 points)  
    const metaLength = article.metaDescription?.length || 0;
    if (metaLength >= 150 && metaLength <= 160) {
      score += 20;
    } else if (metaLength >= 120 && metaLength <= 170) {
      score += 15;
    }

    // Internal links (0-20 points)
    if (article.internalLinks && article.internalLinks.length > 0) {
      score += 20;
    }

    return Math.min(score, 100);
  }

  protected async requiresHumanApproval(
    type: string, 
    data: Record<string, unknown>
  ): Promise<boolean> {
    if (type === 'content') {
      const qualityScore = this.calculateQualityScore(data);
      // Require approval if quality score is below 75
      return qualityScore < 75;
    }
    return false;
  }
}