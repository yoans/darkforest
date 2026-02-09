'use client';

import { useState, useEffect, useCallback } from 'react';

interface AgentInfo {
  id: string;
  name: string;
  type: string;
  version: string;
  status: string;
  capabilities: string[];
}

interface OrchestratorStatus {
  isRunning: boolean;
  triggerMode: string;
  agentCount: number;
  queueLength: number;
  recentExecutions: number;
}

interface PipelineResult {
  success: boolean;
  results?: any;
  error?: string;
  timestamp: string;
}

const AGENTS_API = process.env.NEXT_PUBLIC_AGENTS_URL || 'http://localhost:8916';

export default function HomePage() {
  const [agents, setAgents] = useState<AgentInfo[]>([]);
  const [orchestratorStatus, setOrchestratorStatus] = useState<OrchestratorStatus | null>(null);
  const [pipelineResult, setPipelineResult] = useState<PipelineResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [triggeringPipeline, setTriggeringPipeline] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const [agentsRes, statusRes] = await Promise.allSettled([
        fetch(`${AGENTS_API}/api/agents`),
        fetch(`${AGENTS_API}/api/orchestrator/status`),
      ]);

      if (agentsRes.status === 'fulfilled' && agentsRes.value.ok) {
        const data = await agentsRes.value.json();
        setAgents(data.agents || []);
      }

      if (statusRes.status === 'fulfilled' && statusRes.value.ok) {
        const data = await statusRes.value.json();
        setOrchestratorStatus(data);
      }

      setLastRefresh(new Date());
    } catch (err: any) {
      setError(err.message || 'Failed to connect to agents service');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const triggerPipeline = async () => {
    setTriggeringPipeline(true);
    setPipelineResult(null);
    try {
      const res = await fetch(`${AGENTS_API}/api/orchestrator/trigger-pipeline`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      setPipelineResult(data);
    } catch (err: any) {
      setPipelineResult({ success: false, error: err.message, timestamp: new Date().toISOString() });
    } finally {
      setTriggeringPipeline(false);
    }
  };

  const triggerAgent = async (agentId: string, taskType: string) => {
    try {
      const res = await fetch(`${AGENTS_API}/api/agents/${agentId}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: taskType,
          data: { siteConfig: { niche: 'AI and Technology', audience: 'Business professionals', postsPerWeek: 3, goals: ['traffic', 'monetization'] } },
        }),
      });
      const data = await res.json();
      setPipelineResult(data);
    } catch (err: any) {
      setPipelineResult({ success: false, error: err.message, timestamp: new Date().toISOString() });
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Connecting to Dark Forest agents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dark Forest Network Dashboard
          </h1>
          <p className="text-gray-600">
            AI-powered blog network management and automation
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-400">
            Updated {lastRefresh.toLocaleTimeString()}
          </span>
          <button
            onClick={fetchData}
            className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200 transition"
          >
            ↻ Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">
            <strong>Connection Error:</strong> {error}
          </p>
          <p className="text-red-600 text-xs mt-1">
            Make sure the agents service is running on {AGENTS_API}
          </p>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
          <h3 className="text-sm font-medium text-gray-500">System Status</h3>
          <p className="text-2xl font-bold text-gray-900">
            {orchestratorStatus?.isRunning ? '🟢 Running' : '🔴 Stopped'}
          </p>
          <p className="text-sm text-gray-600">{orchestratorStatus?.triggerMode || 'unknown'} mode</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
          <h3 className="text-sm font-medium text-gray-500">Active Agents</h3>
          <p className="text-2xl font-bold text-gray-900">{orchestratorStatus?.agentCount || agents.length || 0}</p>
          <p className="text-sm text-green-600">all operational</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
          <h3 className="text-sm font-medium text-gray-500">Queued Tasks</h3>
          <p className="text-2xl font-bold text-gray-900">{orchestratorStatus?.queueLength || 0}</p>
          <p className="text-sm text-gray-600">pending execution</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-orange-500">
          <h3 className="text-sm font-medium text-gray-500">Recent Executions</h3>
          <p className="text-2xl font-bold text-gray-900">{orchestratorStatus?.recentExecutions || 0}</p>
          <p className="text-sm text-gray-600">last hour</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-pink-500">
          <h3 className="text-sm font-medium text-gray-500">Blog Sites</h3>
          <p className="text-2xl font-bold text-gray-900">4</p>
          <p className="text-sm text-green-600">all publishing</p>
        </div>
      </div>

      {/* Pipeline Trigger */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-2">🚀 Content Pipeline</h2>
        <p className="text-gray-300 text-sm mb-4">
          Execute the full pipeline: Strategy → Research → Content → SEO → Publishing
        </p>
        <button
          onClick={triggerPipeline}
          disabled={triggeringPipeline}
          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition"
        >
          {triggeringPipeline ? '⏳ Running Pipeline...' : '▶ Execute Pipeline'}
        </button>

        {pipelineResult && (
          <div className="mt-4 p-4 bg-black/30 rounded-lg">
            <pre className="text-xs text-gray-300 overflow-auto max-h-64 whitespace-pre-wrap">
              {JSON.stringify(pipelineResult, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Agent Grid */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">🤖 Agent Network</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {agents.map((agent) => (
            <div key={agent.id} className="bg-white rounded-lg shadow p-5 hover:shadow-md transition">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-gray-900 text-sm">{agent.name}</h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  ● {agent.status}
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-3">
                {agent.type} v{agent.version}
              </p>
              {agent.capabilities && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {agent.capabilities.slice(0, 3).map((cap) => (
                    <span key={cap} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                      {cap.toLowerCase().replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              )}
              <button
                onClick={() => triggerAgent(agent.id.split('-')[0] || agent.id, agent.capabilities?.[0] || 'default')}
                className="w-full py-1.5 text-xs bg-gray-900 text-white rounded hover:bg-gray-800 transition"
              >
                Execute
              </button>
            </div>
          ))}
        </div>

        {agents.length === 0 && !error && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No agents connected. Start the agents service to see them here.</p>
          </div>
        )}
      </div>

      {/* Blog Network */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">📚 Blog Network</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { id: 'ai-business-insights', name: 'AI Business Insights', icon: '🤖', niche: 'AI & Business Tech' },
              { id: 'remote-work-revolution', name: 'Remote Work Revolution', icon: '🌍', niche: 'Remote Work' },
              { id: 'cybersecurity-today', name: 'Cybersecurity Today', icon: '🔒', niche: 'Cybersecurity' },
              { id: 'marketing-automation-hub', name: 'Marketing Automation Hub', icon: '📊', niche: 'Marketing' },
            ].map((blog) => (
              <a
                key={blog.id}
                href={`https://darkforest.sagaciasoft.com/${blog.id}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition"
              >
                <span className="text-3xl">{blog.icon}</span>
                <div>
                  <h3 className="font-medium text-gray-900">{blog.name}</h3>
                  <p className="text-sm text-gray-500">{blog.niche}</p>
                </div>
                <span className="ml-auto text-xs text-gray-400">Visit →</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}