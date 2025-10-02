import React, { useState } from 'react'

export default function GeneratePage() {
  const [selectedBlog, setSelectedBlog] = useState('ai-business-insights')
  const [topic, setTopic] = useState('')
  const [generating, setGenerating] = useState(false)

  const blogs = [
    { id: 'ai-business-insights', name: 'AI Business Insights', icon: '🤖' },
    { id: 'remote-work-revolution', name: 'Remote Work Revolution', icon: '🌍' },
    { id: 'cybersecurity-today', name: 'Cybersecurity Today', icon: '🔒' },
    { id: 'marketing-automation-hub', name: 'Marketing Automation Hub', icon: '📊' }
  ]

  const handleGenerate = async () => {
    setGenerating(true)
    // TODO: Implement actual generation
    setTimeout(() => {
      setGenerating(false)
      alert('Post generated! Check the Agent Workflow tab to see the process.')
    }, 2000)
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">✨ Generate Content</h1>
        <p className="page-subtitle">Create AI-powered blog posts</p>
      </div>

      <div className="card" style={{ maxWidth: '800px' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>New Blog Post</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
              Select Blog
            </label>
            <select
              value={selectedBlog}
              onChange={(e) => setSelectedBlog(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: '1px solid var(--gray-300)',
                fontSize: '1rem'
              }}
            >
              {blogs.map(blog => (
                <option key={blog.id} value={blog.id}>
                  {blog.icon} {blog.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
              Topic (Optional)
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Leave empty for auto-selection from blog topics"
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: '1px solid var(--gray-300)',
                fontSize: '1rem'
              }}
            />
            <div style={{ fontSize: '0.85rem', color: 'var(--gray-600)', marginTop: '0.5rem' }}>
              If left empty, the Strategy Agent will choose the best topic based on trends
            </div>
          </div>

          <button
            className="btn btn-primary"
            onClick={handleGenerate}
            disabled={generating}
            style={{ width: 'fit-content', opacity: generating ? 0.6 : 1 }}
          >
            {generating ? (
              <>
                <span className="spinner" style={{ width: '1rem', height: '1rem', borderWidth: '2px' }}></span>
                Generating...
              </>
            ) : (
              <>
                🤖 Start Agentic Generation
              </>
            )}
          </button>
        </div>
      </div>

      <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#fef3c7', borderRadius: '0.75rem' }}>
        <h4 style={{ marginBottom: '0.75rem' }}>💡 Pro Tip: Watch the Workflow</h4>
        <p style={{ color: 'var(--gray-700)' }}>
          After clicking generate, switch to the <strong>Agent Workflow</strong> tab to watch
          all 6 AI agents collaborate in real-time to create your content!
        </p>
      </div>
    </div>
  )
}
