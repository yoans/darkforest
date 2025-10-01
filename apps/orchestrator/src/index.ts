import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import { setupRoutes } from './routes';
import { setupQueues } from './queues';
import { setupScheduler } from './scheduler';
import { logger } from './utils/logger';
import { config } from './config';

async function startOrchestrator() {
  const app = express();
  const server = createServer(app);

  // Middleware
  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));

  // Health check
  app.get('/health', (req, res) => {
    res.json({ 
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '0.1.0'
    });
  });

  // Setup core systems
  await setupQueues();
  await setupScheduler();
  setupRoutes(app);

  // Start server
  const port = config.port || 3001;
  server.listen(port, () => {
    logger.info(`🚀 Orchestrator running on port ${port}`);
    logger.info(`📊 Dashboard: http://localhost:${port}/dashboard`);
    logger.info(`🔧 Admin: http://localhost:${port}/admin`);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    logger.info('🛑 Received SIGTERM, shutting down gracefully');
    server.close(() => {
      logger.info('✅ Process terminated');
      process.exit(0);
    });
  });
}

startOrchestrator().catch((error) => {
  logger.error('💥 Failed to start orchestrator:', error);
  process.exit(1);
});