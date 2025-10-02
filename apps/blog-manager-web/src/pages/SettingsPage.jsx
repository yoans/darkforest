import React, { useState } from 'react'

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState('')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    // TODO: Save to backend
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">⚙️ Settings</h1>
        <p className="page-subtitle">Configure your blog network</p>
      </div>

      <div className="card" style={{ maxWidth: '800px' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>API Keys</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
              OpenAI API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: '1px solid var(--gray-300)',
                fontSize: '1rem'
              }}
            />
            <div style={{ fontSize: '0.85rem', color: 'var(--gray-600)', marginTop: '0.5rem' }}>
              Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">OpenAI Platform</a>
            </div>
          </div>

          <button
            className={`btn ${saved ? 'btn-success' : 'btn-primary'}`}
            onClick={handleSave}
            style={{ width: 'fit-content' }}
          >
            {saved ? '✓ Saved!' : '💾 Save Settings'}
          </button>
        </div>
      </div>

      <div className="card" style={{ maxWidth: '800px', marginTop: '1.5rem' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>System Status</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--gray-50)', borderRadius: '0.5rem' }}>
            <span>Orchestrator Service</span>
            <span className="badge badge-success">Running</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--gray-50)', borderRadius: '0.5rem' }}>
            <span>Agents Service</span>
            <span className="badge badge-success">Running</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--gray-50)', borderRadius: '0.5rem' }}>
            <span>OpenAI Connection</span>
            <span className="badge badge-warning">Not Configured</span>
          </div>
        </div>
      </div>
    </div>
  )
}
