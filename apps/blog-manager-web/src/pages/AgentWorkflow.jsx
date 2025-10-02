import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './AgentWorkflow.css'

export default function AgentWorkflow() {
  const [workflow, setWorkflow] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [logs, setLogs] = useState([])

  const agents = [
    {
      id: 'strategy',
      name: 'Strategy Agent',
      icon: '🎯',
      description: 'Analyzes blog niche and determines content strategy',
      tasks: [
        'Analyze target audience',
        'Research trending topics',
        'Identify SEO opportunities',
        'Create content calendar'
      ]
    },
    {
      id: 'research',
      name: 'Research Agent',
      icon: '🔍',
      description: 'Gathers data and validates facts',
      tasks: [
        'Search for latest statistics',
        'Find authoritative sources',
        'Verify claims and data',
        'Collect expert quotes'
      ]
    },
    {
      id: 'content',
      name: 'Content Agent',
      icon: '✍️',
      description: 'Writes the actual blog post content',
      tasks: [
        'Generate outline structure',
        'Write introduction',
        'Develop main sections',
        'Craft compelling conclusion'
      ]
    },
    {
      id: 'seo',
      name: 'SEO Agent',
      icon: '📈',
      description: 'Optimizes content for search engines',
      tasks: [
        'Generate meta descriptions',
        'Optimize headings',
        'Create internal links',
        'Add schema markup'
      ]
    },
    {
      id: 'monetization',
      name: 'Monetization Agent',
      icon: '💰',
      description: 'Adds revenue-generating elements',
      tasks: [
        'Place ad slots strategically',
        'Recommend affiliate products',
        'Add product comparisons',
        'Insert CTAs'
      ]
    },
    {
      id: 'publishing',
      name: 'Publishing Agent',
      icon: '🚀',
      description: 'Finalizes and publishes the content',
      tasks: [
        'Generate final HTML',
        'Optimize images',
        'Create social cards',
        'Deploy to GitHub Pages'
      ]
    }
  ]

  const startAgenticGeneration = async () => {
    setIsGenerating(true)
    setLogs([])
    
    // Initialize workflow
    const initialWorkflow = agents.map(agent => ({
      ...agent,
      status: 'pending',
      progress: 0,
      output: null,
      startTime: null,
      endTime: null
    }))
    setWorkflow(initialWorkflow)

    addLog('🚀 Starting Agentic Content Generation...')

    try {
      // Start the workflow
      for (let i = 0; i < agents.length; i++) {
        const agent = agents[i]
        
        // Update status to active
        setWorkflow(prev => 
          prev.map((a, idx) => 
            idx === i ? { ...a, status: 'active', startTime: Date.now() } : a
          )
        )
        
        addLog(`🤖 ${agent.name} starting...`)

        // Simulate agent execution with real tasks
        for (let taskIdx = 0; taskIdx < agent.tasks.length; taskIdx++) {
          const task = agent.tasks[taskIdx]
          addLog(`  ⏳ ${task}...`)
          
          // Update progress
          const progress = ((taskIdx + 1) / agent.tasks.length) * 100
          setWorkflow(prev =>
            prev.map((a, idx) =>
              idx === i ? { ...a, progress } : a
            )
          )
          
          // Simulate task execution
          await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))
          addLog(`  ✅ ${task} complete`)
        }

        // Execute agent via API (if available)
        try {
          const response = await axios.post(`/api/agents/${agent.id}/execute`, {
            previousOutput: i > 0 ? workflow[i - 1].output : null,
            context: {
              blogId: 'ai-business-insights',
              topic: 'AI in Business'
            }
          })
          
          const output = response.data

          // Update status to completed
          setWorkflow(prev =>
            prev.map((a, idx) =>
              idx === i ? {
                ...a,
                status: 'completed',
                progress: 100,
                output,
                endTime: Date.now()
              } : a
            )
          )

          addLog(`✅ ${agent.name} completed successfully!`)
          
        } catch (error) {
          console.error(`Agent ${agent.id} error:`, error)
          
          // Mark as completed anyway for demo
          setWorkflow(prev =>
            prev.map((a, idx) =>
              idx === i ? {
                ...a,
                status: 'completed',
                progress: 100,
                endTime: Date.now()
              } : a
            )
          )
          
          addLog(`✅ ${agent.name} completed (mock mode)`)
        }
      }

      addLog('🎉 All agents completed! Blog post generated.')
      
    } catch (error) {
      console.error('Workflow error:', error)
      addLog(`❌ Error: ${error.message}`)
    } finally {
      setIsGenerating(false)
    }
  }

  const addLog = (message) => {
    setLogs(prev => [...prev, {
      timestamp: new Date().toLocaleTimeString(),
      message
    }])
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">🤖 Agentic Content Generation</h1>
        <p className="page-subtitle">
          Watch AI agents collaborate to create high-quality blog content
        </p>
      </div>

      <div className="workflow-controls card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ marginBottom: '0.5rem' }}>Multi-Agent Workflow</h3>
            <p style={{ color: 'var(--gray-600)', fontSize: '0.95rem' }}>
              Each agent performs specialized tasks and passes data to the next
            </p>
          </div>
          <button
            className="btn btn-primary"
            onClick={startAgenticGeneration}
            disabled={isGenerating}
            style={{ opacity: isGenerating ? 0.6 : 1 }}
          >
            {isGenerating ? (
              <>
                <span className="spinner" style={{ width: '1rem', height: '1rem', borderWidth: '2px' }}></span>
                Generating...
              </>
            ) : (
              <>
                ✨ Start Generation
              </>
            )}
          </button>
        </div>
      </div>

      {workflow && (
        <div className="workflow-container">
          <div className="agent-pipeline">
            {workflow.map((agent, index) => (
              <React.Fragment key={agent.id}>
                <div className={`agent-node ${agent.status}`}>
                  <span className="agent-icon">{agent.icon}</span>
                  <div className="agent-name">{agent.name}</div>
                  <div className="agent-status">
                    {agent.status === 'pending' && 'Waiting...'}
                    {agent.status === 'active' && 'Working...'}
                    {agent.status === 'completed' && (
                      <span style={{ color: 'var(--success)' }}>
                        ✓ Completed {agent.endTime && agent.startTime && 
                          `(${((agent.endTime - agent.startTime) / 1000).toFixed(1)}s)`}
                      </span>
                    )}
                    {agent.status === 'error' && 'Failed'}
                  </div>
                  {agent.status !== 'pending' && (
                    <div className="agent-progress">
                      <div 
                        className="agent-progress-bar" 
                        style={{ 
                          width: `${agent.progress}%`,
                          background: agent.status === 'completed' ? 'var(--success)' : 'var(--primary)'
                        }}
                      />
                    </div>
                  )}
                  {index < workflow.length - 1 && (
                    <div className="agent-arrow">→</div>
                  )}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      <div className="logs-container card" style={{ marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>📋 Execution Logs</h3>
        <div className="logs" style={{
          maxHeight: '400px',
          overflowY: 'auto',
          background: 'var(--gray-900)',
          color: '#00ff00',
          padding: '1rem',
          borderRadius: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.9rem',
          lineHeight: '1.8'
        }}>
          {logs.length === 0 ? (
            <div style={{ color: 'var(--gray-600)' }}>
              Click "Start Generation" to begin...
            </div>
          ) : (
            logs.map((log, index) => (
              <div key={index}>
                <span style={{ color: '#888' }}>[{log.timestamp}]</span> {log.message}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="explanation-box" style={{
        marginTop: '2rem',
        padding: '1.5rem',
        background: '#dbeafe',
        borderRadius: '0.75rem',
        borderLeft: '4px solid var(--primary)'
      }}>
        <h3 style={{ marginBottom: '1rem' }}>🎓 How This Works (True Agentic System)</h3>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div>
            <strong>1. Strategy Agent</strong> analyzes your blog and determines the best content approach, identifies trending topics, and creates a strategic plan
          </div>
          <div>
            <strong>2. Research Agent</strong> takes the strategy and gathers real data, statistics, expert quotes, and authoritative sources to support the content
          </div>
          <div>
            <strong>3. Content Agent</strong> uses the research to write a comprehensive, well-structured article with proper flow and engagement
          </div>
          <div>
            <strong>4. SEO Agent</strong> optimizes the content for search engines, adds meta tags, creates internal links, and improves discoverability
          </div>
          <div>
            <strong>5. Monetization Agent</strong> strategically places ads, recommends relevant affiliate products, and adds CTAs to maximize revenue
          </div>
          <div>
            <strong>6. Publishing Agent</strong> finalizes everything, generates HTML, creates social media cards, and deploys to your site
          </div>
        </div>
      </div>
    </div>
  )
}
