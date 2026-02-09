import { Agent, AgentTask, AgentResult } from '../types/base';
import { RobustOpenAI } from '../utils/openai';
import * as fs from 'fs';
import * as path from 'path';

export class AnalyticsAgent extends Agent {
  id = 'analytics-001';
  name = 'Analytics Agent';
  type = 'ANALYTICS';
  version = '1.0.0';

  private ai: RobustOpenAI;
  private metricsStore: Map<string, any[]> = new Map();

  constructor(apiKey: string) {
    super();
    this.ai = new RobustOpenAI(apiKey);
  }

  async execute(task: AgentTask): Promise<AgentResult> {
    try {
      switch (task.type) {
        case 'ANALYTICS_COLLECTION':
        case 'COLLECT_METRICS':
          return await this.collectMetrics(task);
        case 'PERFORMANCE_REPORT':
          return await this.generatePerformanceReport(task);
        case 'CONTENT_PERFORMANCE':
          return await this.analyzeContentPerformance(task);
        case 'GROWTH_ANALYSIS':
          return await this.analyzeGrowth(task);
        default:
          return this.createErrorResult(`Unsupported task type: ${task.type}`);
      }
    } catch (error) {
      return this.createErrorResult(`Analytics agent error: ${error}`);
    }
  }

  getCapabilities(): string[] {
    return [
      'ANALYTICS_COLLECTION',
      'COLLECT_METRICS',
      'PERFORMANCE_REPORT',
      'CONTENT_PERFORMANCE',
      'GROWTH_ANALYSIS',
    ];
  }

  private async collectMetrics(task: AgentTask): Promise<AgentResult> {
    const { siteId = 'all', period = '7d' } = task.data as {
      siteId?: string;
      period?: string;
    };

    // Scan output directory for actual content metrics
    const outputDir = path.resolve(__dirname, '../../../../output');
    const deployDir = path.resolve(__dirname, '../../../../deploy');
    const metrics = this.scanContentDirectories(outputDir, deployDir);

    // Store metrics for historical tracking
    const key = `${siteId}_${new Date().toISOString().split('T')[0]}`;
    this.metricsStore.set(key, [...(this.metricsStore.get(key) || []), metrics]);

    return this.createSuccessResult({
      siteId,
      period,
      metrics: {
        totalPosts: metrics.totalPosts,
        postsByBlog: metrics.postsByBlog,
        totalWordCount: metrics.totalWordCount,
        avgWordCount: metrics.totalPosts > 0 ? Math.round(metrics.totalWordCount / metrics.totalPosts) : 0,
        latestPost: metrics.latestPost,
        oldestPost: metrics.oldestPost,
        postsThisWeek: metrics.recentPosts,
      },
      contentHealth: {
        blogsActive: Object.keys(metrics.postsByBlog).length,
        blogsWithRecentContent: metrics.blogsWithRecentContent,
        avgPostsPerBlog: metrics.totalPosts > 0 
          ? (metrics.totalPosts / Object.keys(metrics.postsByBlog).length).toFixed(1) 
          : '0',
      },
      collectedAt: new Date().toISOString(),
    });
  }

  private scanContentDirectories(outputDir: string, deployDir: string) {
    const postsByBlog: Record<string, number> = {};
    let totalPosts = 0;
    let totalWordCount = 0;
    let latestPost = '';
    let oldestPost = '';
    let recentPosts = 0;
    let blogsWithRecentContent = 0;
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    for (const dir of [outputDir, deployDir]) {
      if (!fs.existsSync(dir)) continue;

      const blogDirs = fs.readdirSync(dir).filter(f => {
        const fullPath = path.join(dir, f);
        return fs.statSync(fullPath).isDirectory() && !f.startsWith('.');
      });

      for (const blogDir of blogDirs) {
        const blogPath = path.join(dir, blogDir);
        const htmlFiles = fs.readdirSync(blogPath).filter(f => f.endsWith('.html') && f !== 'index.html');

        if (!postsByBlog[blogDir]) postsByBlog[blogDir] = 0;
        postsByBlog[blogDir] += htmlFiles.length;
        totalPosts += htmlFiles.length;

        let blogHasRecent = false;
        for (const file of htmlFiles) {
          const filePath = path.join(blogPath, file);
          try {
            const stats = fs.statSync(filePath);
            const content = fs.readFileSync(filePath, 'utf-8');
            const textContent = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
            totalWordCount += textContent.split(' ').filter(w => w.length > 0).length;

            if (!latestPost || stats.mtimeMs > fs.statSync(latestPost).mtimeMs) {
              latestPost = filePath;
            }
            if (!oldestPost || stats.mtimeMs < fs.statSync(oldestPost).mtimeMs) {
              oldestPost = filePath;
            }
            if (stats.mtimeMs > oneWeekAgo) {
              recentPosts++;
              blogHasRecent = true;
            }
          } catch {
            // Skip files we can't read
          }
        }
        if (blogHasRecent) blogsWithRecentContent++;
      }
    }

    return {
      postsByBlog,
      totalPosts,
      totalWordCount,
      latestPost: latestPost ? path.basename(latestPost) : 'none',
      oldestPost: oldestPost ? path.basename(oldestPost) : 'none',
      recentPosts,
      blogsWithRecentContent,
    };
  }

  private async generatePerformanceReport(task: AgentTask): Promise<AgentResult> {
    const { siteId = 'network', period = '30d' } = task.data as {
      siteId?: string;
      period?: string;
    };

    // Collect actual metrics first
    const metricsResult = await this.collectMetrics({ ...task, data: { ...task.data, siteId, period } });
    const metrics = metricsResult.data?.metrics;

    const result = await this.ai.callJSON<{
      summary: string;
      highlights: string[];
      concerns: string[];
      recommendations: Array<{
        action: string;
        priority: string;
        expectedImpact: string;
      }>;
      nextSteps: string[];
    }>({
      model: 'gpt-4',
      temperature: 0.5,
      maxTokens: 2000,
      systemPrompt: 'You are a digital marketing analytics expert. Analyze blog network performance data and provide strategic recommendations.',
      userPrompt: `Generate a performance report for this blog network:

Current Metrics:
- Total Posts: ${(metrics as any)?.totalPosts || 0}
- Posts by Blog: ${JSON.stringify((metrics as any)?.postsByBlog || {})}
- Average Word Count: ${(metrics as any)?.avgWordCount || 0}
- Posts This Week: ${(metrics as any)?.postsThisWeek || 0}
- Active Blogs: ${(metricsResult.data?.contentHealth as any)?.blogsActive || 0}

Period: ${period}

Provide a strategic analysis as JSON:
{
  "summary": "executive summary of performance",
  "highlights": ["positive findings"],
  "concerns": ["areas needing attention"],
  "recommendations": [
    {"action": "specific action", "priority": "high|medium|low", "expectedImpact": "description"}
  ],
  "nextSteps": ["immediate action items"]
}`,
      jsonMode: true,
    });

    return this.createSuccessResult({
      report: result,
      metrics,
      period,
      generatedAt: new Date().toISOString(),
    });
  }

  private async analyzeContentPerformance(task: AgentTask): Promise<AgentResult> {
    const { blogId = '', posts = [] } = task.data as {
      blogId?: string;
      posts?: Array<{ title: string; wordCount: number; publishedAt: string }>;
    };

    const result = await this.ai.callJSON<{
      topPerformers: string[];
      underperformers: string[];
      contentMixAnalysis: string;
      recommendations: string[];
      optimalPostLength: number;
      bestPublishingDays: string[];
    }>({
      model: 'gpt-4',
      temperature: 0.5,
      maxTokens: 2000,
      systemPrompt: 'You are a content performance analyst. Evaluate content strategy and provide data-driven recommendations.',
      userPrompt: `Analyze content performance for blog "${blogId}":

Published posts:
${posts.map(p => `- "${p.title}" (${p.wordCount} words, published ${p.publishedAt})`).join('\n')}

Provide analysis as JSON:
{
  "topPerformers": ["titles of likely best-performing posts"],
  "underperformers": ["titles of likely underperforming posts"],
  "contentMixAnalysis": "analysis of content variety and balance",
  "recommendations": ["specific improvements"],
  "optimalPostLength": 1500,
  "bestPublishingDays": ["Tuesday", "Thursday"]
}`,
      jsonMode: true,
    });

    return this.createSuccessResult({
      blogId,
      analysis: result,
      analyzedAt: new Date().toISOString(),
    });
  }

  private async analyzeGrowth(task: AgentTask): Promise<AgentResult> {
    // Use file-based metrics to assess growth trajectory
    const metricsResult = await this.collectMetrics(task);
    
    return this.createSuccessResult({
      growth: {
        contentVelocity: (metricsResult.data?.metrics as any)?.postsThisWeek || 0,
        totalContent: (metricsResult.data?.metrics as any)?.totalPosts || 0,
        activeBlogsCount: (metricsResult.data?.contentHealth as any)?.blogsActive || 0,
        healthScore: this.calculateHealthScore(metricsResult.data),
      },
      analyzedAt: new Date().toISOString(),
    });
  }

  private calculateHealthScore(data: any): number {
    let score = 0;
    const metrics = data?.metrics;
    const health = data?.contentHealth;

    // Posts exist
    if (metrics?.totalPosts > 0) score += 20;
    if (metrics?.totalPosts > 10) score += 10;
    if (metrics?.totalPosts > 50) score += 10;

    // Recent activity
    if (metrics?.postsThisWeek > 0) score += 20;
    if (metrics?.postsThisWeek > 5) score += 10;

    // Content quality
    if (metrics?.avgWordCount > 1000) score += 15;
    if (metrics?.avgWordCount > 1500) score += 5;

    // Blog coverage
    if (health?.blogsActive >= 4) score += 10;

    return Math.min(score, 100);
  }
}
