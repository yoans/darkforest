import { z } from 'zod';

// Base agent interface
export interface BaseAgent {
  id: string;
  name: string;
  type: string;
  version: string;
  execute(task: AgentTask): Promise<AgentResult>;
  validate(input: unknown): boolean;
  getCapabilities(): string[];
}

// Task definitions
export const AgentTaskSchema = z.object({
  id: z.string(),
  type: z.string(),
  siteId: z.string().optional(),
  postId: z.string().optional(),
  data: z.record(z.unknown()),
  priority: z.number().default(5),
  retries: z.number().default(0),
  maxRetries: z.number().default(3),
});

export type AgentTask = z.infer<typeof AgentTaskSchema>;

export interface AgentResult {
  success: boolean;
  data?: Record<string, unknown>;
  error?: string;
  requiresApproval?: boolean;
  metadata?: Record<string, unknown>;
}

// Agent capabilities
export interface AgentCapabilities {
  canHandleTaskType(type: string): boolean;
  estimateExecutionTime(task: AgentTask): number;
  getRequiredApprovalTypes(): string[];
}

// Abstract base class for all agents
export abstract class Agent implements BaseAgent {
  abstract id: string;
  abstract name: string;
  abstract type: string;
  abstract version: string;

  abstract execute(task: AgentTask): Promise<AgentResult>;
  
  validate(input: unknown): boolean {
    return AgentTaskSchema.safeParse(input).success;
  }

  abstract getCapabilities(): string[];

  protected async requiresHumanApproval(
    type: string, 
    data: Record<string, unknown>
  ): Promise<boolean> {
    // Override in specific agents to define approval logic
    return false;
  }

  protected createSuccessResult(
    data: Record<string, unknown>, 
    requiresApproval = false
  ): AgentResult {
    return {
      success: true,
      data,
      requiresApproval,
      metadata: {
        agentId: this.id,
        agentType: this.type,
        timestamp: new Date().toISOString(),
      },
    };
  }

  protected createErrorResult(error: string): AgentResult {
    return {
      success: false,
      error,
      metadata: {
        agentId: this.id,
        agentType: this.type,
        timestamp: new Date().toISOString(),
      },
    };
  }
}