import OpenAI from 'openai';

const logger = {
  info: (msg: string, data?: any) => console.log(`[INFO] ${msg}`, data || ''),
  error: (msg: string, error?: any) => console.error(`[ERROR] ${msg}`, error || ''),
  warn: (msg: string, data?: any) => console.warn(`[WARN] ${msg}`, data || ''),
  debug: (msg: string, data?: any) => console.log(`[DEBUG] ${msg}`, data || ''),
};

export interface OpenAICallOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt: string;
  userPrompt: string;
  jsonMode?: boolean;
  retries?: number;
  retryDelayMs?: number;
}

/**
 * Hardened OpenAI client with retries, exponential backoff, and json_mode support.
 */
export class RobustOpenAI {
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey, timeout: 120_000 });
  }

  /**
   * Call OpenAI with automatic retries, exponential backoff, and optional JSON mode.
   */
  async call(options: OpenAICallOptions): Promise<string> {
    const {
      model = 'gpt-4',
      temperature = 0.7,
      maxTokens = 4000,
      systemPrompt,
      userPrompt,
      jsonMode = false,
      retries = 3,
      retryDelayMs = 1000,
    } = options;

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        logger.debug(`OpenAI call attempt ${attempt}/${retries} [${model}]`);

        const params: OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming = {
          model,
          temperature,
          max_tokens: maxTokens,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
        };

        if (jsonMode) {
          params.response_format = { type: 'json_object' };
        }

        const response = await this.client.chat.completions.create(params);

        const content = response.choices[0]?.message?.content;
        if (!content) {
          throw new Error('Empty response from OpenAI');
        }

        return content;
      } catch (error: any) {
        lastError = error;
        const isRateLimit = error?.status === 429;
        const isServerError = error?.status >= 500;
        const isTimeout = error?.code === 'ETIMEDOUT' || error?.code === 'ECONNABORTED';

        if (attempt < retries && (isRateLimit || isServerError || isTimeout)) {
          const delay = retryDelayMs * Math.pow(2, attempt - 1) + Math.random() * 500;
          logger.warn(`OpenAI call failed (attempt ${attempt}), retrying in ${Math.round(delay)}ms: ${error.message}`);
          await new Promise(resolve => setTimeout(resolve, delay));
        } else if (attempt < retries) {
          // Non-retryable error but still have attempts left — try once more
          const delay = retryDelayMs * attempt;
          logger.warn(`OpenAI call failed (attempt ${attempt}): ${error.message}`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw new Error(`OpenAI call failed after ${retries} attempts: ${lastError?.message}`);
  }

  /**
   * Call OpenAI and parse the result as JSON. Uses json_mode for reliability.
   */
  async callJSON<T = any>(options: OpenAICallOptions): Promise<T> {
    const content = await this.call({ ...options, jsonMode: true });
    
    try {
      return JSON.parse(content);
    } catch {
      // Try to extract JSON from markdown code blocks
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[1].trim());
      }
      
      // Try to find JSON object/array in response
      const objectMatch = content.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
      if (objectMatch) {
        return JSON.parse(objectMatch[1]);
      }
      
      throw new Error(`Failed to parse JSON from OpenAI response: ${content.substring(0, 200)}`);
    }
  }

  /**
   * Get usage stats for monitoring
   */
  getClient(): OpenAI {
    return this.client;
  }
}
