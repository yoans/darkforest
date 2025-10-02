import { Express } from 'express';
import { logger } from './utils/logger';

export function setupRoutes(app: Express) {
  logger.info('🛠️ Setting up API routes');

  // API routes
  app.get('/api/status', (req, res) => {
    res.json({
      status: 'running',
      timestamp: new Date().toISOString(),
      activeAgents: 0,
      queueSize: 0,
      uptime: process.uptime()
    });
  });

  app.get('/api/agents', (req, res) => {
    res.json({
      agents: [
        { id: 'strategy', status: 'idle', lastRun: null },
        { id: 'content', status: 'idle', lastRun: null },
        { id: 'publishing', status: 'idle', lastRun: null },
        { id: 'analytics', status: 'idle', lastRun: null },
        { id: 'seo', status: 'idle', lastRun: null },
        { id: 'monetization', status: 'idle', lastRun: null },
        { id: 'research', status: 'idle', lastRun: null },
        { id: 'maintenance', status: 'idle', lastRun: null }
      ]
    });
  });

  app.post('/api/agents/:agentId/trigger', (req, res) => {
    const { agentId } = req.params;
    logger.info(`🤖 Triggering agent: ${agentId}`);
    
    // TODO: Implement agent triggering
    res.json({
      success: true,
      message: `Agent ${agentId} triggered successfully`,
      taskId: `task_${Date.now()}`
    });
  });

  app.get('/dashboard', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>AI Blog Network - Orchestrator</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; margin: 2rem; }
            .card { background: #f8f9fa; padding: 1.5rem; margin: 1rem 0; border-radius: 8px; }
            .status { display: inline-block; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.875rem; }
            .status.idle { background: #e3f2fd; color: #1976d2; }
            .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; }
          </style>
        </head>
        <body>
          <h1>🤖 AI Blog Network Orchestrator</h1>
          <div class="card">
            <h3>System Status</h3>
            <p>Status: <span class="status idle">Running</span></p>
            <p>Uptime: ${Math.floor(process.uptime())} seconds</p>
            <p>Memory Usage: ${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB</p>
          </div>
          
          <div class="card">
            <h3>Active Agents</h3>
            <div class="grid">
              <div>Strategy Agent <span class="status idle">Idle</span></div>
              <div>Content Agent <span class="status idle">Idle</span></div>
              <div>Publishing Agent <span class="status idle">Idle</span></div>
              <div>Analytics Agent <span class="status idle">Idle</span></div>
              <div>SEO Agent <span class="status idle">Idle</span></div>
              <div>Monetization Agent <span class="status idle">Idle</span></div>
              <div>Research Agent <span class="status idle">Idle</span></div>
              <div>Maintenance Agent <span class="status idle">Idle</span></div>
            </div>
          </div>
          
          <div class="card">
            <h3>Quick Actions</h3>
            <button onclick="triggerAgent('strategy')">Trigger Strategy Planning</button>
            <button onclick="triggerAgent('content')">Generate Content</button>
            <button onclick="triggerAgent('publishing')">Publish Posts</button>
            
            <script>
              function triggerAgent(agentId) {
                fetch('/api/agents/' + agentId + '/trigger', { method: 'POST' })
                  .then(r => r.json())
                  .then(data => alert(data.message))
                  .catch(err => alert('Error: ' + err.message));
              }
            </script>
          </div>
        </body>
      </html>
    `);
  });

  logger.info('✅ Routes setup complete');
}