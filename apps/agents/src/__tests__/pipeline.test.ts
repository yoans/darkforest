import { describe, it, expect, beforeEach } from 'vitest';
import { ContentAgent } from '../agents/content';
import { StrategyAgent } from '../agents/strategy';
import { PublishingAgent } from '../agents/publishing';
import { ResearchAgent } from '../agents/research';
import { SEOAgent } from '../agents/seo';
import { MonetizationAgent } from '../agents/monetization';
import { MaintenanceAgent } from '../agents/maintenance';
import { AnalyticsAgent } from '../agents/analytics';

const hasApiKey = !!process.env.OPENAI_API_KEY;
const apiKey = process.env.OPENAI_API_KEY || 'test-key';

describe('Content Pipeline Integration', () => {
  describe.skipIf(!hasApiKey)('full pipeline with real API', () => {
    it('should execute strategy → content → SEO → publishing pipeline', async () => {
      // Step 1: Strategy
      const strategy = new StrategyAgent(apiKey);
      const strategyResult = await strategy.execute({
        id: 'pipeline-strategy',
        type: 'STRATEGY_PLANNING',
        data: {
          siteConfig: {
            niche: 'AI and Technology',
            audience: 'Business professionals',
            postsPerWeek: 3,
            goals: ['traffic', 'engagement'],
          },
        },
        priority: 1,
        retries: 0,
        maxRetries: 3,
      });

      expect(strategyResult.success).toBe(true);
      expect(strategyResult.data?.strategy).toBeDefined();
      const topics = (strategyResult.data?.strategy as any)?.topics;
      expect(Array.isArray(topics)).toBe(true);
      expect(topics.length).toBeGreaterThan(0);

      // Step 2: Content Generation using first topic from strategy
      const content = new ContentAgent(apiKey);
      const contentResult = await content.execute({
        id: 'pipeline-content',
        type: 'CONTENT_GENERATION',
        data: {
          topic: topics[0].title,
          keyword: topics[0].keyword,
          wordCount: 800,
          tone: 'professional',
          audience: 'Business executives',
        },
        priority: 1,
        retries: 0,
        maxRetries: 3,
      });

      expect(contentResult.success).toBe(true);
      expect(contentResult.data?.article).toBeDefined();

      // Step 3: SEO Optimization
      const seo = new SEOAgent(apiKey);
      const article = contentResult.data?.article as any;
      const seoResult = await seo.execute({
        id: 'pipeline-seo',
        type: 'META_GENERATION',
        data: {
          title: article.title,
          content: article.content,
          targetKeyword: topics[0].keyword,
        },
        priority: 1,
        retries: 0,
        maxRetries: 3,
      });

      expect(seoResult.success).toBe(true);
      expect(seoResult.data?.metaTitle).toBeDefined();
      expect(seoResult.data?.metaDescription).toBeDefined();

      // Step 4: Publishing
      const publishing = new PublishingAgent();
      const publishResult = await publishing.execute({
        id: 'pipeline-publish',
        type: 'PUBLISH_POST',
        data: {
          content: {
            title: article.title,
            content: article.content,
            excerpt: article.excerpt,
            metaDescription: seoResult.data?.metaDescription,
          },
          metadata: { siteName: 'AI Business Insights' },
        },
        priority: 1,
        retries: 0,
        maxRetries: 3,
      });

      expect(publishResult.success).toBe(true);
      expect(publishResult.data?.publishedPost).toBeDefined();
    }, 120000); // 2 minute timeout for full pipeline
  });

  describe('agent instantiation', () => {
    it('should create all agents without errors', () => {
      expect(() => new ContentAgent(apiKey)).not.toThrow();
      expect(() => new StrategyAgent(apiKey)).not.toThrow();
      expect(() => new PublishingAgent()).not.toThrow();
      expect(() => new ResearchAgent(apiKey)).not.toThrow();
      expect(() => new SEOAgent(apiKey)).not.toThrow();
      expect(() => new MonetizationAgent(apiKey)).not.toThrow();
      expect(() => new MaintenanceAgent()).not.toThrow();
      expect(() => new AnalyticsAgent(apiKey)).not.toThrow();
    });

    it('all agents should have capabilities', () => {
      const agents = [
        new ContentAgent(apiKey),
        new StrategyAgent(apiKey),
        new PublishingAgent(),
        new ResearchAgent(apiKey),
        new SEOAgent(apiKey),
        new MonetizationAgent(apiKey),
        new MaintenanceAgent(),
        new AnalyticsAgent(apiKey),
      ];

      for (const agent of agents) {
        const caps = agent.getCapabilities();
        expect(Array.isArray(caps)).toBe(true);
        expect(caps.length).toBeGreaterThan(0);
      }
    });

    it('all agents should reject unknown task types', async () => {
      const agents = [
        new ContentAgent(apiKey),
        new StrategyAgent(apiKey),
        new PublishingAgent(),
        new ResearchAgent(apiKey),
        new SEOAgent(apiKey),
        new MonetizationAgent(apiKey),
        new MaintenanceAgent(),
        new AnalyticsAgent(apiKey),
      ];

      for (const agent of agents) {
        const result = await agent.execute({
          id: 'test-unknown',
          type: 'TOTALLY_FAKE_TASK',
          data: {},
          priority: 5,
          retries: 0,
          maxRetries: 3,
        });
        expect(result.success).toBe(false);
        expect(result.error).toBeDefined();
      }
    });
  });
});
