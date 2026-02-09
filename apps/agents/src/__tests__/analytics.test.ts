import { describe, it, expect, beforeEach } from 'vitest';
import { AnalyticsAgent } from '../agents/analytics';

// Only run OpenAI-dependent tests when API key is available
const hasApiKey = !!process.env.OPENAI_API_KEY;

describe('AnalyticsAgent', () => {
  let agent: AnalyticsAgent;

  beforeEach(() => {
    agent = new AnalyticsAgent(process.env.OPENAI_API_KEY || 'test-key');
  });

  describe('basic properties', () => {
    it('should have correct id and type', () => {
      expect(agent.id).toBe('analytics-001');
      expect(agent.name).toBe('Analytics Agent');
      expect(agent.type).toBe('ANALYTICS');
    });

    it('should list capabilities', () => {
      const caps = agent.getCapabilities();
      expect(caps).toContain('ANALYTICS_COLLECTION');
      expect(caps).toContain('PERFORMANCE_REPORT');
      expect(caps).toContain('CONTENT_PERFORMANCE');
      expect(caps).toContain('GROWTH_ANALYSIS');
    });
  });

  describe('metrics collection', () => {
    it('should collect metrics from output directories', async () => {
      const result = await agent.execute({
        id: 'test-metrics',
        type: 'COLLECT_METRICS',
        data: { siteId: 'all', period: '7d' },
        priority: 5,
        retries: 0,
        maxRetries: 3,
      });

      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('metrics');
      expect(result.data?.metrics).toHaveProperty('totalPosts');
      expect(result.data?.metrics).toHaveProperty('postsByBlog');
      expect(result.data).toHaveProperty('contentHealth');
    });
  });

  describe('growth analysis', () => {
    it('should analyze growth trajectory', async () => {
      const result = await agent.execute({
        id: 'test-growth',
        type: 'GROWTH_ANALYSIS',
        data: {},
        priority: 5,
        retries: 0,
        maxRetries: 3,
      });

      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('growth');
      expect(result.data?.growth).toHaveProperty('healthScore');
      expect(typeof (result.data?.growth as any)?.healthScore).toBe('number');
    });
  });

  describe('error handling', () => {
    it('should return error for unsupported task type', async () => {
      const result = await agent.execute({
        id: 'test-error',
        type: 'NONEXISTENT_TASK',
        data: {},
        priority: 5,
        retries: 0,
        maxRetries: 3,
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Unsupported task type');
    });
  });
});
