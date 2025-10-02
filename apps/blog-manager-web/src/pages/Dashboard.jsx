import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalBlogs: 4,
    totalPosts: 6,
    postsThisWeek: 3,
    totalWords: 10500
  })

  const [recentPosts, setRecentPosts] = useState([
    {
      id: 1,
      title: 'How AI is Revolutionizing Business Operations in 2025',
      blog: 'AI Business Insights',
      date: '2 hours ago',
      status: 'published',
      views: 0
    },
    {
      id: 2,
      title: 'The Complete Guide to Remote Work Best Practices',
      blog: 'Remote Work Revolution',
      date: '5 hours ago',
      status: 'published',
      views: 0
    }
  ])

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">📊 Dashboard</h1>
        <p className="page-subtitle">Overview of your AI-powered blog network</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">
            <span>📚</span> Total Blogs
          </div>
          <div className="stat-value">{stats.totalBlogs}</div>
          <div className="stat-change">
            All blogs active
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-label">
            <span>📝</span> Total Posts
          </div>
          <div className="stat-value">{stats.totalPosts}</div>
          <div className="stat-change">
            +{stats.postsThisWeek} this week
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">
            <span>📊</span> Total Words
          </div>
          <div className="stat-value">{stats.totalWords.toLocaleString()}</div>
          <div className="stat-change">
            ~{Math.round(stats.totalWords / stats.totalPosts)} avg
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-label">
            <span>💰</span> Revenue Potential
          </div>
          <div className="stat-value">$0</div>
          <div className="stat-change">
            Enable monetization
          </div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '1.5rem' }}>📄 Recent Posts</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {recentPosts.map(post => (
            <div key={post.id} style={{
              padding: '1rem',
              background: 'var(--gray-50)',
              borderRadius: '0.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                  {post.title}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--gray-600)' }}>
                  {post.blog} • {post.date}
                </div>
              </div>
              <span className="badge badge-success">{post.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
