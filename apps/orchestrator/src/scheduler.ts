import cron from 'node-cron';
import { logger } from './utils/logger';
import { addTask } from './queues';

export async function setupScheduler() {
  logger.info('⏰ Setting up task scheduler');

  // Strategy planning - every 6 hours
  cron.schedule('0 */6 * * *', async () => {
    logger.info('🎯 Running scheduled strategy planning');
    await addTask('strategy', { 
      type: 'analyze-trends',
      scheduled: true 
    });
  });

  // Content generation - every 2 hours
  cron.schedule('0 */2 * * *', async () => {
    logger.info('✍️ Running scheduled content generation');
    await addTask('content', { 
      type: 'generate-posts',
      scheduled: true 
    });
  });

  // Publishing check - every hour
  cron.schedule('0 * * * *', async () => {
    logger.info('📤 Running scheduled publishing check');
    await addTask('publishing', { 
      type: 'publish-ready-content',
      scheduled: true 
    });
  });

  // SEO optimization - daily at 2 AM
  cron.schedule('0 2 * * *', async () => {
    logger.info('🔍 Running scheduled SEO optimization');
    await addTask('seo', { 
      type: 'optimize-existing-content',
      scheduled: true 
    });
  });

  // Analytics collection - daily at 3 AM
  cron.schedule('0 3 * * *', async () => {
    logger.info('📊 Running scheduled analytics collection');
    await addTask('analytics', { 
      type: 'collect-metrics',
      scheduled: true 
    });
  });

  // Research trending topics - every 4 hours
  cron.schedule('0 */4 * * *', async () => {
    logger.info('🔬 Running scheduled research');
    await addTask('research', { 
      type: 'trending-topics',
      scheduled: true 
    });
  });

  // Monetization optimization - daily at 4 AM
  cron.schedule('0 4 * * *', async () => {
    logger.info('💰 Running scheduled monetization optimization');
    await addTask('monetization', { 
      type: 'optimize-ads',
      scheduled: true 
    });
  });

  // Maintenance tasks - daily at 5 AM
  cron.schedule('0 5 * * *', async () => {
    logger.info('🧹 Running scheduled maintenance');
    await addTask('maintenance', { 
      type: 'cleanup-old-content',
      scheduled: true 
    });
  });

  // Health check - every 15 minutes
  cron.schedule('*/15 * * * *', async () => {
    logger.debug('💓 System health check');
    // Simple health metrics
    const memUsage = process.memoryUsage();
    if (memUsage.rss > 500 * 1024 * 1024) { // 500MB threshold
      logger.warn(`⚠️ High memory usage: ${Math.round(memUsage.rss / 1024 / 1024)}MB`);
    }
  });

  logger.info('✅ Scheduler setup complete');
  logger.info('📅 Active schedules:');
  logger.info('   - Strategy: Every 6 hours');
  logger.info('   - Content: Every 2 hours');
  logger.info('   - Publishing: Every hour');
  logger.info('   - SEO: Daily at 2 AM');
  logger.info('   - Analytics: Daily at 3 AM');
  logger.info('   - Research: Every 4 hours');
  logger.info('   - Monetization: Daily at 4 AM');
  logger.info('   - Maintenance: Daily at 5 AM');
}