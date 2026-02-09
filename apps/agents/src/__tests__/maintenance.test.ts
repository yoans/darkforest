import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MaintenanceAgent } from '../agents/maintenance';
import * as fs from 'fs';
import * as path from 'path';

describe('MaintenanceAgent', () => {
  let agent: MaintenanceAgent;

  beforeEach(() => {
    agent = new MaintenanceAgent();
  });

  describe('basic properties', () => {
    it('should have correct id and type', () => {
      expect(agent.id).toBe('maintenance-001');
      expect(agent.name).toBe('Maintenance Agent');
      expect(agent.type).toBe('MAINTENANCE');
    });

    it('should list capabilities', () => {
      const caps = agent.getCapabilities();
      expect(caps).toContain('HEALTH_CHECK');
      expect(caps).toContain('GENERATE_SITEMAP');
      expect(caps).toContain('GENERATE_RSS');
      expect(caps).toContain('BROKEN_LINK_CHECK');
    });
  });

  describe('health check', () => {
    it('should return health status', async () => {
      const result = await agent.execute({
        id: 'test-1',
        type: 'HEALTH_CHECK',
        data: {},
        priority: 5,
        retries: 0,
        maxRetries: 3,
      });

      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('healthStatus');
      expect(result.data).toHaveProperty('checks');
      expect(result.data).toHaveProperty('summary');
      expect(result.data?.summary).toHaveProperty('total');
      expect(result.data?.summary).toHaveProperty('ok');
    });
  });

  describe('sitemap generation', () => {
    it('should generate sitemap when deploy dir exists', async () => {
      const deployDir = path.resolve(__dirname, '../../../../deploy');
      
      if (fs.existsSync(deployDir)) {
        const result = await agent.execute({
          id: 'test-2',
          type: 'GENERATE_SITEMAP',
          data: { baseUrl: 'https://darkforest.sagaciasoft.com' },
          priority: 5,
          retries: 0,
          maxRetries: 3,
        });

        expect(result.success).toBe(true);
        expect(result.data).toHaveProperty('urlCount');
        expect((result.data?.urlCount as number)).toBeGreaterThan(0);
        
        // Verify sitemap file was created
        const sitemapPath = path.join(deployDir, 'sitemap.xml');
        expect(fs.existsSync(sitemapPath)).toBe(true);
        
        const content = fs.readFileSync(sitemapPath, 'utf-8');
        expect(content).toContain('<?xml version="1.0"');
        expect(content).toContain('<urlset');
        expect(content).toContain('darkforest.sagaciasoft.com');
      }
    });
  });

  describe('RSS feed generation', () => {
    it('should generate RSS feeds when deploy dir exists', async () => {
      const deployDir = path.resolve(__dirname, '../../../../deploy');
      
      if (fs.existsSync(deployDir)) {
        const result = await agent.execute({
          id: 'test-3',
          type: 'GENERATE_RSS',
          data: { baseUrl: 'https://darkforest.sagaciasoft.com' },
          priority: 5,
          retries: 0,
          maxRetries: 3,
        });

        expect(result.success).toBe(true);
        expect(result.data).toHaveProperty('feeds');
        expect(result.data).toHaveProperty('totalFeeds');
      }
    });
  });

  describe('broken link check', () => {
    it('should check for broken links', async () => {
      const result = await agent.execute({
        id: 'test-4',
        type: 'BROKEN_LINK_CHECK',
        data: {},
        priority: 5,
        retries: 0,
        maxRetries: 3,
      });

      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('totalLinks');
      expect(result.data).toHaveProperty('brokenLinks');
      expect(result.data).toHaveProperty('healthScore');
    });
  });

  describe('error handling', () => {
    it('should return error for unsupported task type', async () => {
      const result = await agent.execute({
        id: 'test-5',
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
