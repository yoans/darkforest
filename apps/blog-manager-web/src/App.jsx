import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import AgentWorkflow from './pages/AgentWorkflow'
import BlogsPage from './pages/BlogsPage'
import GeneratePage from './pages/GeneratePage'
import SettingsPage from './pages/SettingsPage'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')

  return (
    <div className="app">
      <nav className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">🤖</span>
            <span className="logo-text">Blog Network</span>
          </div>
        </div>
        
        <div className="nav-links">
          <NavLink 
            icon="📊" 
            label="Dashboard" 
            to="dashboard"
            active={activeTab === 'dashboard'}
            onClick={() => setActiveTab('dashboard')}
          />
          <NavLink 
            icon="🔄" 
            label="Agent Workflow" 
            to="workflow"
            active={activeTab === 'workflow'}
            onClick={() => setActiveTab('workflow')}
          />
          <NavLink 
            icon="📚" 
            label="Blogs" 
            to="blogs"
            active={activeTab === 'blogs'}
            onClick={() => setActiveTab('blogs')}
          />
          <NavLink 
            icon="✨" 
            label="Generate" 
            to="generate"
            active={activeTab === 'generate'}
            onClick={() => setActiveTab('generate')}
          />
          <NavLink 
            icon="⚙️" 
            label="Settings" 
            to="settings"
            active={activeTab === 'settings'}
            onClick={() => setActiveTab('settings')}
          />
        </div>
      </nav>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/workflow" element={<AgentWorkflow />} />
          <Route path="/blogs" element={<BlogsPage />} />
          <Route path="/generate" element={<GeneratePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </main>
    </div>
  )
}

function NavLink({ icon, label, to, active, onClick }) {
  return (
    <Link 
      to={`/${to}`} 
      className={`nav-link ${active ? 'active' : ''}`}
      onClick={onClick}
    >
      <span className="nav-icon">{icon}</span>
      <span className="nav-label">{label}</span>
    </Link>
  )
}

export default function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  )
}
