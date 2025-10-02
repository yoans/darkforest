import { logger } from './utils/logger';

// Simple in-memory queue for now (will upgrade to Redis later)
interface Task {
  id: string;
  agentId: string;
  type: string;
  data: any;
  timestamp: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

class SimpleQueue {
  private tasks: Map<string, Task> = new Map();
  private workers: Map<string, (task: Task) => Promise<any>> = new Map();

  addTask(agentId: string, taskData: any): string {
    const taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const task: Task = {
      id: taskId,
      agentId,
      type: taskData.type || 'default',
      data: taskData,
      timestamp: new Date().toISOString(),
      status: 'pending'
    };

    this.tasks.set(taskId, task);
    logger.info(`� Added task ${taskId} for agent ${agentId}`);
    
    // Process immediately for now
    this.processTask(taskId);
    
    return taskId;
  }

  private async processTask(taskId: string) {
    const task = this.tasks.get(taskId);
    if (!task) return;

    try {
      task.status = 'processing';
      logger.info(`🔄 Processing task: ${taskId}`);
      
      // Simple processing simulation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      task.status = 'completed';
      logger.info(`✅ Task completed: ${taskId}`);
      
    } catch (error) {
      task.status = 'failed';
      logger.error(`❌ Task failed: ${taskId}`, error);
    }
  }

  getTask(taskId: string): Task | undefined {
    return this.tasks.get(taskId);
  }

  getAllTasks(): Task[] {
    return Array.from(this.tasks.values());
  }

  getTasksByAgent(agentId: string): Task[] {
    return Array.from(this.tasks.values()).filter(task => task.agentId === agentId);
  }
}

const taskQueue = new SimpleQueue();
const contentQueue = new SimpleQueue();

export async function setupQueues() {
  logger.info('🔄 Setting up simple in-memory queues');
  
  try {
    logger.info('✅ Simple queues initialized');
    logger.info('ℹ️ Note: Using in-memory queues for development. Will upgrade to Redis for production.');
  } catch (error) {
    logger.error('❌ Failed to setup queues:', error);
  }
}

export async function addTask(agentId: string, taskData: any) {
  try {
    const taskId = taskQueue.addTask(agentId, {
      ...taskData,
      timestamp: new Date().toISOString()
    });
    
    logger.info(`📝 Added task for ${agentId}: ${taskId}`);
    return { id: taskId, agentId, data: taskData };
  } catch (error) {
    logger.error(`❌ Failed to add task for ${agentId}:`, error);
    return null;
  }
}

export async function addContentJob(topic: string, requirements: any) {
  try {
    const taskId = contentQueue.addTask('content', {
      type: 'generate-content',
      topic,
      requirements,
      timestamp: new Date().toISOString()
    });
    
    logger.info(`✍️ Added content job: ${taskId}`);
    return { id: taskId, topic, requirements };
  } catch (error) {
    logger.error(`❌ Failed to add content job:`, error);
    return null;
  }
}

export { taskQueue, contentQueue };