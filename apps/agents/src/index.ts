import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import { EventEmitter } from 'events';
import { StrategyAgent } from './agents/strategy';
import { ContentAgent } from './agents/content';
import { PublishingAgent } from './agents/publishing';
import { Agent, AgentTask, AgentResult } from './types/base';

// Simple logger for now
const logger = {
  info: (msg: string, data?: any) => console.log(`[INFO] ${msg}`, data || ''),
  error: (msg: string, error?: any) => console.error(`[ERROR] ${msg}`, error || ''),
  warn: (msg: string, data?: any) => console.warn(`[WARN] ${msg}`, data || ''),
  debug: (msg: string, data?: any) => console.log(`[DEBUG] ${msg}`, data || '')
};

// Configuration for always-on operation
interface AgentConfig {
  apiKey: string;
  enableContinuousOperation: boolean;
  triggerMode: 'periodic' | 'event-driven' | 'continuous';
  periodicIntervalMs: number;
}

const config: AgentConfig = {
  apiKey: process.env.OPENAI_API_KEY || '',
  enableContinuousOperation: process.env.ALWAYS_ON === 'true',
  triggerMode: (process.env.TRIGGER_MODE as AgentConfig['triggerMode']) || 'periodic',
  periodicIntervalMs: parseInt(process.env.PERIODIC_INTERVAL_MS || '3600000', 10), // 1 hour default
};

// Configuration constants
const CONTINUOUS_LOOP_DELAY_MS = 100; // Delay between queue checks in continuous mode

// Always-On Agent Orchestrator - Core of the Dark Forest
class AlwaysOnOrchestrator extends EventEmitter {
  private agents: Map<string, Agent> = new Map();
  private isRunning = false;
  private periodicTimer: NodeJS.Timeout | null = null;
  private taskQueue: AgentTask[] = [];
  private executionHistory: Array<{ taskId: string; agentId: string; result: AgentResult; timestamp: Date }> = [];

  constructor(private agentConfig: AgentConfig) {
    super();
    this.initializeAgents();
  }

  private initializeAgents() {
    if (this.agentConfig.apiKey) {
      // Initialize real AI-powered agents
      this.agents.set('strategy', new StrategyAgent(this.agentConfig.apiKey));
      this.agents.set('content', new ContentAgent(this.agentConfig.apiKey));
      this.agents.set('publishing', new PublishingAgent());
      logger.info('🤖 Initialized real AI agents with OpenAI integration');
    } else {
      // Fallback to placeholder agents for development
      logger.warn('⚠️ No API key provided, using placeholder agents');
      this.initializePlaceholderAgents();
    }
  }

  private initializePlaceholderAgents() {
    // Simple placeholder implementation that satisfies BaseAgent interface
    class PlaceholderAgent {
      constructor(
        public id: string,
        public name: string,
        public type: string,
        public version: string = '1.0.0'
      ) {}

      async execute(task: AgentTask): Promise<AgentResult> {
        return {
          success: true,
          data: { 
            agentType: this.type,
            taskId: task.id,
            executedAt: new Date().toISOString(),
            message: `${this.name} executed successfully (placeholder mode)`
          },
          metadata: { agentId: this.id, agentType: this.type, timestamp: new Date().toISOString() }
        };
      }

      validate(): boolean {
        return true;
      }

      getCapabilities(): string[] {
        return [`${this.type}_DEFAULT`];
      }
    }

    this.agents.set('strategy', new PlaceholderAgent('strategy-001', 'Strategy Agent', 'STRATEGY') as unknown as Agent);
    this.agents.set('content', new PlaceholderAgent('content-001', 'Content Agent', 'CONTENT') as unknown as Agent);
    this.agents.set('publishing', new PlaceholderAgent('publishing-001', 'Publishing Agent', 'PUBLISHING') as unknown as Agent);
    this.agents.set('analytics', new PlaceholderAgent('analytics-001', 'Analytics Agent', 'ANALYTICS') as unknown as Agent);
    this.agents.set('seo', new PlaceholderAgent('seo-001', 'SEO Agent', 'SEO') as unknown as Agent);
    this.agents.set('monetization', new PlaceholderAgent('monetization-001', 'Monetization Agent', 'MONETIZATION') as unknown as Agent);
    this.agents.set('research', new PlaceholderAgent('research-001', 'Research Agent', 'RESEARCH') as unknown as Agent);
    this.agents.set('maintenance', new PlaceholderAgent('maintenance-001', 'Maintenance Agent', 'MAINTENANCE') as unknown as Agent);
  }

  async start(): Promise<void> {
    if (this.isRunning) {
      logger.warn('Orchestrator already running, start request ignored');
      return;
    }

    this.isRunning = true;
    logger.info('🚀 Always-On Orchestrator started');
    this.emit('started');

    if (this.agentConfig.enableContinuousOperation) {
      this.startContinuousOperation();
    }
  }

  private startContinuousOperation(): void {
    logger.info(`⏰ Starting ${this.agentConfig.triggerMode} operation mode`);

    switch (this.agentConfig.triggerMode) {
      case 'periodic':
        this.startPeriodicTriggers();
        break;
      case 'continuous':
        this.startContinuousLoop();
        break;
      case 'event-driven':
        logger.info('📡 Event-driven mode: waiting for external triggers');
        break;
    }
  }

  private startPeriodicTriggers(): void {
    const intervalMs = this.agentConfig.periodicIntervalMs;
    logger.info(`⏱️ Periodic triggers set for every ${intervalMs / 1000} seconds`);

    this.periodicTimer = setInterval(async () => {
      logger.info('🔄 Periodic trigger fired - executing content pipeline');
      await this.executeContentPipeline();
    }, intervalMs);
  }

  private startContinuousLoop(): void {
    const processLoop = async () => {
      while (this.isRunning) {
        if (this.taskQueue.length > 0) {
          const task = this.taskQueue.shift()!;
          await this.executeTask(task);
        }
        // Small delay to prevent CPU spinning
        await new Promise(resolve => setTimeout(resolve, CONTINUOUS_LOOP_DELAY_MS));
      }
    };
    processLoop().catch(err => logger.error('Continuous loop error:', err));
  }

  async stop(): Promise<void> {
    this.isRunning = false;
    if (this.periodicTimer) {
      clearInterval(this.periodicTimer);
      this.periodicTimer = null;
    }
    logger.info('🛑 Orchestrator stopped');
    this.emit('stopped');
  }

  // Queue a task for execution
  queueTask(task: AgentTask): void {
    this.taskQueue.push(task);
    logger.info(`📥 Task queued: ${task.id} for ${task.type}`);
    this.emit('taskQueued', task);
  }

  // Execute a single task
  async executeTask(task: AgentTask): Promise<AgentResult> {
    const agentId = this.getAgentIdForTask(task.type);
    const agent = this.agents.get(agentId);

    if (!agent) {
      const error = `No agent found for task type: ${task.type}`;
      logger.error(error);
      return { success: false, error };
    }

    logger.info(`🤖 Executing task ${task.id} with ${agentId} agent`);
    this.emit('taskStarted', { taskId: task.id, agentId });

    try {
      const result = await agent.execute(task);
      this.executionHistory.push({ 
        taskId: task.id, 
        agentId, 
        result, 
        timestamp: new Date() 
      });
      
      this.emit('taskCompleted', { taskId: task.id, agentId, result });
      return result;
    } catch (error) {
      const errorResult: AgentResult = { 
        success: false, 
        error: error instanceof Error ? error.message : String(error) 
      };
      this.emit('taskFailed', { taskId: task.id, agentId, error: errorResult.error });
      return errorResult;
    }
  }

  // Execute the full content generation pipeline
  async executeContentPipeline(siteConfig?: Record<string, unknown>): Promise<{
    strategy?: AgentResult;
    content?: AgentResult;
    publishing?: AgentResult;
  }> {
    const pipelineId = `pipeline_${Date.now()}`;
    logger.info(`🔄 Starting content pipeline: ${pipelineId}`);
    this.emit('pipelineStarted', { pipelineId });

    const results: { strategy?: AgentResult; content?: AgentResult; publishing?: AgentResult } = {};

    // Step 1: Strategy Planning
    const strategyTask: AgentTask = {
      id: `${pipelineId}_strategy`,
      type: 'STRATEGY_PLANNING',
      data: { siteConfig: siteConfig || { niche: 'AI and Technology', audience: 'Business professionals', postsPerWeek: 3, goals: ['traffic', 'monetization'] } },
      priority: 1,
      retries: 0,
      maxRetries: 3
    };
    results.strategy = await this.executeTask(strategyTask);

    if (!results.strategy.success) {
      logger.error('Strategy planning failed, aborting pipeline');
      return results;
    }

    // Step 2: Content Generation
    const topics = (results.strategy.data as Record<string, unknown>)?.strategy as { topics?: Array<{ title?: string; keyword?: string }> } | undefined;
    const topicList = topics?.topics || [{ title: 'AI in Business', keyword: 'AI business' }];
    const firstTopic = topicList.length > 0 ? topicList[0] : { title: 'AI in Business', keyword: 'AI business' };

    const contentTask: AgentTask = {
      id: `${pipelineId}_content`,
      type: 'CONTENT_GENERATION',
      data: { 
        topic: firstTopic.title || 'AI in Business',
        keyword: firstTopic.keyword || 'AI technology',
        wordCount: 1200,
        tone: 'professional',
        audience: 'Business executives',
        siteConfig
      },
      priority: 1,
      retries: 0,
      maxRetries: 3
    };
    results.content = await this.executeTask(contentTask);

    if (!results.content.success) {
      logger.error('Content generation failed');
      return results;
    }

    // Step 3: Publishing (if content doesn't require approval)
    if (!results.content.requiresApproval) {
      const publishTask: AgentTask = {
        id: `${pipelineId}_publish`,
        type: 'PUBLISH_POST',
        data: { 
          content: results.content.data?.article,
          metadata: { siteName: 'Dark Forest Blog' }
        },
        priority: 1,
        retries: 0,
        maxRetries: 3
      };
      results.publishing = await this.executeTask(publishTask);
    } else {
      logger.info('📋 Content requires human approval before publishing');
    }

    logger.info(`✅ Content pipeline completed: ${pipelineId}`);
    this.emit('pipelineCompleted', { pipelineId, results });
    return results;
  }

  private getAgentIdForTask(taskType: string): string {
    const typeMap: Record<string, string> = {
      'STRATEGY_PLANNING': 'strategy',
      'KEYWORD_RESEARCH': 'strategy',
      'COMPETITOR_ANALYSIS': 'strategy',
      'CONTENT_GENERATION': 'content',
      'CONTENT_OPTIMIZATION': 'content',
      'TITLE_GENERATION': 'content',
      'PUBLISH_POST': 'publishing',
      'SCHEDULE_POST': 'publishing',
      'UPDATE_POST': 'publishing',
      'GENERATE_SOCIAL_POSTS': 'publishing',
      'ANALYTICS_COLLECTION': 'analytics',
      'SEO_OPTIMIZATION': 'seo',
      'MONETIZATION_OPTIMIZATION': 'monetization',
      'RESEARCH': 'research',
      'MAINTENANCE': 'maintenance'
    };
    return typeMap[taskType] || 'strategy';
  }

  getAgent(agentId: string): Agent | undefined {
    return this.agents.get(agentId);
  }

  getAllAgents(): Map<string, Agent> {
    return this.agents;
  }

  getStatus(): { 
    isRunning: boolean; 
    triggerMode: string; 
    agentCount: number;
    queueLength: number;
    recentExecutions: number;
  } {
    return {
      isRunning: this.isRunning,
      triggerMode: this.agentConfig.triggerMode,
      agentCount: this.agents.size,
      queueLength: this.taskQueue.length,
      recentExecutions: this.executionHistory.filter(
        h => h.timestamp > new Date(Date.now() - 3600000)
      ).length
    };
  }
}

// Global orchestrator instance
const orchestrator = new AlwaysOnOrchestrator(config);

async function startAgents() {
  const app = express();
  const server = createServer(app);

  // Middleware
  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  // Health check
  app.get('/health', (req, res) => {
    const status = orchestrator.getStatus();
    res.json({ 
      status: 'healthy',
      timestamp: new Date().toISOString(),
      orchestrator: status,
      agents: Array.from(orchestrator.getAllAgents().keys()).map(id => ({ id, status: 'ready' }))
    });
  });

  // Agent status endpoint
  app.get('/api/agents', (req, res) => {
    const agents = orchestrator.getAllAgents();
    res.json({
      agents: Array.from(agents.entries()).map(([id, agent]) => ({
        id,
        name: agent.name,
        type: agent.type,
        version: agent.version,
        capabilities: agent.getCapabilities(),
        status: 'ready'
      }))
    });
  });

  // Orchestrator status endpoint
  app.get('/api/orchestrator/status', (req, res) => {
    res.json(orchestrator.getStatus());
  });

  // Trigger content pipeline manually (event-driven trigger)
  app.post('/api/orchestrator/trigger-pipeline', async (req, res) => {
    const { siteConfig } = req.body;
    try {
      logger.info('🔄 Manual pipeline trigger received');
      const results = await orchestrator.executeContentPipeline(siteConfig);
      res.json({
        success: true,
        results,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error('Pipeline execution failed:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Queue a task for execution
  app.post('/api/orchestrator/queue-task', (req, res) => {
    const { task } = req.body;
    if (!task || !task.type) {
      return res.status(400).json({ error: 'Task with type is required' });
    }
    
    const taskWithId = {
      id: task.id || `task_${Date.now()}`,
      ...task,
      priority: task.priority || 5,
      retries: 0,
      maxRetries: task.maxRetries || 3
    };
    
    orchestrator.queueTask(taskWithId);
    res.json({ 
      success: true, 
      taskId: taskWithId.id,
      message: 'Task queued successfully' 
    });
  });

  // Execute agent endpoint (backwards compatible)
  app.post('/api/agents/:agentId/execute', async (req, res) => {
    const { agentId } = req.params;
    const { task, data } = req.body;

    try {
      logger.info(`🤖 Executing ${agentId} agent with task: ${task}`);

      const agent = orchestrator.getAgent(agentId);
      if (!agent) {
        return res.status(404).json({ 
          error: `Agent ${agentId} not found`,
          availableAgents: Array.from(orchestrator.getAllAgents().keys())
        });
      }

      const agentTask = {
        id: `task_${Date.now()}`,
        type: task || 'default',
        data: data || {},
        priority: 5,
        retries: 0,
        maxRetries: 3
      };

      const result = await orchestrator.executeTask(agentTask);

      res.json({
        success: result.success,
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

  // Dashboard with always-on status
  app.get('/dashboard', (req, res) => {
    const status = orchestrator.getStatus();
    const agents = orchestrator.getAllAgents();
    
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Dark Forest - Always-On Agentic System</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, sans-serif; 
              margin: 0; 
              padding: 2rem;
              background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
              color: #e5e5e5;
              min-height: 100vh;
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 2rem;
              padding-bottom: 1rem;
              border-bottom: 1px solid #333;
            }
            h1 { margin: 0; color: #00ff88; }
            .status-badge {
              padding: 0.5rem 1rem;
              border-radius: 20px;
              font-weight: bold;
              text-transform: uppercase;
              font-size: 0.8rem;
            }
            .status-running { background: #00ff88; color: #000; }
            .status-stopped { background: #ff4444; color: #fff; }
            .stats-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 1rem;
              margin-bottom: 2rem;
            }
            .stat-card {
              background: rgba(255,255,255,0.05);
              padding: 1.5rem;
              border-radius: 12px;
              border: 1px solid rgba(255,255,255,0.1);
            }
            .stat-value { font-size: 2rem; font-weight: bold; color: #00ff88; }
            .stat-label { font-size: 0.9rem; color: #888; margin-top: 0.5rem; }
            .agents-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
              gap: 1rem;
              margin-bottom: 2rem;
            }
            .agent { 
              background: rgba(255,255,255,0.05);
              padding: 1.5rem;
              border-radius: 12px;
              border: 1px solid rgba(255,255,255,0.1);
              transition: all 0.3s ease;
            }
            .agent:hover {
              background: rgba(0,255,136,0.1);
              border-color: #00ff88;
              transform: translateY(-2px);
            }
            .agent h3 { margin: 0 0 0.5rem 0; color: #fff; }
            .agent-type { font-size: 0.8rem; color: #00ff88; margin-bottom: 1rem; }
            .status { color: #00ff88; font-weight: bold; }
            button { 
              background: #00ff88; 
              color: #000; 
              border: none; 
              padding: 0.75rem 1.5rem; 
              border-radius: 8px; 
              cursor: pointer;
              font-weight: 600;
              transition: all 0.3s ease;
            }
            button:hover { 
              background: #00cc6a;
              transform: scale(1.02);
            }
            .trigger-section {
              background: rgba(255,255,255,0.05);
              padding: 1.5rem;
              border-radius: 12px;
              margin-bottom: 2rem;
            }
            .trigger-section h2 { margin-top: 0; color: #00ff88; }
            #pipelineResult {
              background: rgba(0,0,0,0.3);
              padding: 1rem;
              border-radius: 8px;
              margin-top: 1rem;
              font-family: monospace;
              font-size: 0.85rem;
              white-space: pre-wrap;
              max-height: 300px;
              overflow-y: auto;
              display: none;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🌲 Dark Forest - Always-On Agentic System</h1>
            <span class="status-badge ${status.isRunning ? 'status-running' : 'status-stopped'}">
              ${status.isRunning ? '● Running' : '○ Stopped'}
            </span>
          </div>
          
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-value">${status.agentCount}</div>
              <div class="stat-label">Active Agents</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${status.triggerMode}</div>
              <div class="stat-label">Trigger Mode</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${status.queueLength}</div>
              <div class="stat-label">Queued Tasks</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${status.recentExecutions}</div>
              <div class="stat-label">Recent Executions (1hr)</div>
            </div>
          </div>
          
          <div class="trigger-section">
            <h2>🚀 Trigger Content Pipeline</h2>
            <p>Manually trigger the full content generation pipeline (Strategy → Content → Publishing)</p>
            <button onclick="triggerPipeline()">Execute Pipeline</button>
            <div id="pipelineResult"></div>
          </div>
          
          <h2 style="color: #00ff88; margin-bottom: 1rem;">🤖 Agents</h2>
          <div class="agents-grid">
            ${Array.from(agents.entries()).map(([id, agent]) => `
              <div class="agent">
                <h3>${agent.name}</h3>
                <div class="agent-type">${agent.type} v${agent.version}</div>
                <p>Status: <span class="status">Ready</span></p>
                <button onclick="testAgent('${id}')">Test Agent</button>
              </div>
            `).join('')}
          </div>
          
          <script>
            async function testAgent(agentId) {
              const resultDiv = document.getElementById('pipelineResult');
              resultDiv.style.display = 'block';
              resultDiv.textContent = 'Executing ' + agentId + ' agent...';
              
              try {
                const response = await fetch('/api/agents/' + agentId + '/execute', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ 
                    task: 'STRATEGY_PLANNING', 
                    data: { siteConfig: { niche: 'Test', audience: 'Developers', postsPerWeek: 1, goals: ['test'] } } 
                  })
                });
                const data = await response.json();
                resultDiv.textContent = 'Agent Response:\\n' + JSON.stringify(data, null, 2);
              } catch (err) {
                resultDiv.textContent = 'Error: ' + err.message;
              }
            }
            
            async function triggerPipeline() {
              const resultDiv = document.getElementById('pipelineResult');
              resultDiv.style.display = 'block';
              resultDiv.textContent = 'Executing content pipeline...\\n';
              
              try {
                const response = await fetch('/api/orchestrator/trigger-pipeline', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({})
                });
                const data = await response.json();
                resultDiv.textContent += '\\nPipeline Result:\\n' + JSON.stringify(data, null, 2);
              } catch (err) {
                resultDiv.textContent += '\\nError: ' + err.message;
              }
            }
          </script>
        </body>
      </html>
    `);
  });

  // Start orchestrator
  await orchestrator.start();

  // Start server
  const port = process.env.PORT || 8916;
  server.listen(port, () => {
    logger.info(`🌲 Dark Forest Always-On Agents running on port ${port}`);
    logger.info(`📊 Dashboard: http://localhost:${port}/dashboard`);
    logger.info(`🤖 Mode: ${config.triggerMode}`);
    logger.info(`🔧 Available agents: ${Array.from(orchestrator.getAllAgents().keys()).join(', ')}`);
  });

  // Graceful shutdown
  process.on('SIGTERM', async () => {
    logger.info('🛑 Received SIGTERM, shutting down gracefully');
    await orchestrator.stop();
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

export { startAgents, orchestrator, AlwaysOnOrchestrator };