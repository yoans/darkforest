import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';

// Simple logger for now
const logger = {
  info: (msg: string, data?: any) => console.log(`[INFO] ${msg}`, data || ''),
  error: (msg: string, error?: any) => console.error(`[ERROR] ${msg}`, error || ''),
  warn: (msg: string, data?: any) => console.warn(`[WARN] ${msg}`, data || ''),
  debug: (msg: string, data?: any) => console.log(`[DEBUG] ${msg}`, data || '')
};

// Simple placeholder agents for now
class SimpleStrategyAgent {
  async execute(task: any) {
    return { 
      success: true, 
      data: { 
        strategy: 'Focus on AI and technology trends',
        keywords: ['artificial intelligence', 'machine learning', 'automation'],
        topics: ['AI in business', 'Future of work', 'Tech trends 2024']
      },
      message: 'Strategy analysis complete' 
    };
  }
}

class SimpleContentAgent {
  async execute(task: any) {
    const topic = task.data?.topic || 'AI Technology';
    return { 
      success: true, 
      data: { 
        title: `The Future of ${topic}: What You Need to Know`,
        content: `# The Future of ${topic}

This is a comprehensive guide about ${topic} and its impact on modern business.

## Introduction

Artificial intelligence is transforming industries across the globe...

## Key Benefits

1. Increased efficiency
2. Better decision making
3. Cost reduction

## Conclusion

The future of ${topic} looks bright with continued innovation and adoption.`,
        wordCount: 150,
        readingTime: '2 minutes'
      },
      message: 'Content generated successfully' 
    };
  }
}

class SimplePublishingAgent {
  async execute(task: any) {
    return { 
      success: true, 
      data: { 
        publishUrl: '/blog/ai-technology-future',
        publishedAt: new Date().toISOString(),
        status: 'published'
      },
      message: 'Content published successfully' 
    };
  }
}

// Create simple placeholder agents
class PlaceholderAgent {
  constructor(private name: string) {}
  
  async execute(task: any) {
    return { 
      success: true, 
      message: `${this.name} agent executed successfully`,
      data: { 
        agentType: this.name,
        taskId: task.id || 'test',
        executedAt: new Date().toISOString()
      }
    };
  }
}

const agents = {
  strategy: new SimpleStrategyAgent(),
  content: new SimpleContentAgent(),
  publishing: new SimplePublishingAgent(),
  analytics: new PlaceholderAgent('Analytics'),
  seo: new PlaceholderAgent('SEO'),
  monetization: new PlaceholderAgent('Monetization'),
  research: new PlaceholderAgent('Research'),
  maintenance: new PlaceholderAgent('Maintenance')
};

async function startAgents() {
  const app = express();
  const server = createServer(app);

  // Middleware
  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  // Health check
  app.get('/health', (req, res) => {
    res.json({ 
      status: 'healthy',
      timestamp: new Date().toISOString(),
      agents: Object.keys(agents).map(id => ({ id, status: 'ready' }))
    });
  });

  // Agent status endpoint
  app.get('/api/agents', (req, res) => {
    res.json({
      agents: Object.keys(agents).map(id => ({
        id,
        status: 'ready',
        type: id,
        lastRun: null
      }))
    });
  });

  // Execute agent endpoint
  app.post('/api/agents/:agentId/execute', async (req, res) => {
    const { agentId } = req.params;
    const { task, data } = req.body;

    try {
      logger.info(`🤖 Executing ${agentId} agent with task: ${task}`);

      const agent = agents[agentId as keyof typeof agents];
      if (!agent) {
        return res.status(404).json({ 
          error: `Agent ${agentId} not found` 
        });
      }

      let result;
      
      // All agents now have a simple execute method
      result = await agent.execute({
        id: `task_${Date.now()}`,
        type: task || 'default',
        data: data || {},
        agentId
      });

      res.json({
        success: true,
        agentId,
        task,
        result,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error(`❌ Agent ${agentId} execution failed:`, error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        agentId,
        task
      });
    }
  });

  // Simple dashboard
  app.get('/dashboard', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>AI Agents Dashboard</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; margin: 2rem; }
            .agent { background: #f8f9fa; padding: 1rem; margin: 0.5rem; border-radius: 8px; display: inline-block; min-width: 200px; }
            .status { color: #28a745; font-weight: bold; }
            button { background: #007bff; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; }
            button:hover { background: #0056b3; }
          </style>
        </head>
        <body>
          <h1>🤖 AI Agents Service</h1>
          <div id="agents">
            ${Object.keys(agents).map(id => `
              <div class="agent">
                <h3>${id.charAt(0).toUpperCase() + id.slice(1)} Agent</h3>
                <p>Status: <span class="status">Ready</span></p>
                <button onclick="testAgent('${id}')">Test Agent</button>
              </div>
            `).join('')}
          </div>
          
          <script>
            function testAgent(agentId) {
              fetch('/api/agents/' + agentId + '/execute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                  task: 'test', 
                  data: { message: 'Test execution' } 
                })
              })
              .then(r => r.json())
              .then(data => {
                alert('Agent Response: ' + JSON.stringify(data.result, null, 2));
              })
              .catch(err => alert('Error: ' + err.message));
            }
          </script>
        </body>
      </html>
    `);
  });

  // Start server
  const port = process.env.PORT || Math.floor(Math.random() * 10000) + 5000;
  server.listen(port, () => {
    logger.info(`🤖 Agents service running on port ${port}`);
    logger.info(`📊 Dashboard: http://localhost:${port}/dashboard`);
    logger.info(`🔧 Available agents: ${Object.keys(agents).join(', ')}`);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    logger.info('🛑 Received SIGTERM, shutting down gracefully');
    server.close(() => {
      logger.info('✅ Agents service terminated');
      process.exit(0);
    });
  });
}

// Start if this is the main module
if (require.main === module) {
  startAgents().catch(error => {
    logger.error('❌ Failed to start agents service:', error);
    process.exit(1);
  });
}

export { startAgents, agents };