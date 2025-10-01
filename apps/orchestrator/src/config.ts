import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3001'),
  DATABASE_URL: z.string(),
  REDIS_URL: z.string(),
  OPENAI_API_KEY: z.string(),
  ANTHROPIC_API_KEY: z.string().optional(),
  STRAPI_URL: z.string().optional(),
  WEBHOOK_SECRET: z.string().optional(),
});

const env = envSchema.parse(process.env);

export const config = {
  nodeEnv: env.NODE_ENV,
  port: parseInt(env.PORT),
  databaseUrl: env.DATABASE_URL,
  redisUrl: env.REDIS_URL,
  openaiApiKey: env.OPENAI_API_KEY,
  anthropicApiKey: env.ANTHROPIC_API_KEY,
  strapiUrl: env.STRAPI_URL,
  webhookSecret: env.WEBHOOK_SECRET,
  
  // Agent settings
  agents: {
    maxConcurrentTasks: 5,
    retryAttempts: 3,
    timeoutMs: 300000, // 5 minutes
  },

  // Scheduling
  schedules: {
    dailyStrategy: '0 6 * * *',    // 6 AM daily
    contentGeneration: '0 */3 * * *', // Every 3 hours
    analytics: '0 22 * * *',       // 10 PM daily  
    maintenance: '0 2 * * 0',      // 2 AM Sundays
  },

  // Quality thresholds
  quality: {
    minWordCount: 800,
    maxWordCount: 3000,
    readabilityScore: 60,
    seoScore: 75,
  },
};