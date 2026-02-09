import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RobustOpenAI } from '../utils/openai';

describe('RobustOpenAI', () => {
  describe('constructor', () => {
    it('should create instance with API key', () => {
      const client = new RobustOpenAI('test-api-key');
      expect(client).toBeDefined();
      expect(client.getClient()).toBeDefined();
    });
  });

  describe('call (requires API key)', () => {
    const hasApiKey = !!process.env.OPENAI_API_KEY;

    it.skipIf(!hasApiKey)('should make successful API call', async () => {
      const client = new RobustOpenAI(process.env.OPENAI_API_KEY!);
      const result = await client.call({
        model: 'gpt-4',
        systemPrompt: 'You are a helpful assistant. Respond in exactly 3 words.',
        userPrompt: 'Say hello',
        maxTokens: 50,
        retries: 2,
      });
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    }, 30000);

    it.skipIf(!hasApiKey)('should parse JSON response with json_mode', async () => {
      const client = new RobustOpenAI(process.env.OPENAI_API_KEY!);
      const result = await client.callJSON<{ greeting: string }>({
        model: 'gpt-4',
        systemPrompt: 'You return valid JSON only.',
        userPrompt: 'Return a JSON object with a "greeting" key and value "hello"',
        jsonMode: true,
        maxTokens: 100,
        retries: 2,
      });
      expect(result).toHaveProperty('greeting');
      expect(typeof result.greeting).toBe('string');
    }, 30000);
  });

  describe('error handling', () => {
    it('should throw after max retries with invalid key', async () => {
      const client = new RobustOpenAI('sk-invalid-key-for-testing');
      await expect(
        client.call({
          systemPrompt: 'test',
          userPrompt: 'test',
          retries: 1,
          retryDelayMs: 100,
        })
      ).rejects.toThrow();
    }, 15000);
  });
});
