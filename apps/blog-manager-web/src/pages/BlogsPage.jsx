import React, { useState } from 'react'

export default function BlogsPage() {
  const [blogs] = useState([
    {
      id: 'ai-business-insights',
      name: 'AI Business Insights',
      icon: '🤖',
      theme: 'Professional Corporate',
      posts: 3,
      postsPerWeek: 5,
      status: 'active'
    },
    {
      id: 'remote-work-revolution',
      name: 'Remote Work Revolution',
      icon: '🌍',
      theme: 'Lifestyle Modern',
      posts: 1,
      postsPerWeek: 4,
      status: 'active'
    },
    {
      id: 'cybersecurity-today',
      name: 'Cybersecurity Today',
      icon: '🔒',
      theme: 'Tech Dark',
      posts: 1,
      postsPerWeek: 3,
      status: 'active'
    },
    {
      id: 'marketing-automation-hub',
      name: 'Marketing Automation Hub',
      icon: '📊',
      theme: 'Marketing Vibrant',
      posts: 1,
      postsPerWeek: 4,
      status: 'active'
    }
  ])

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="page-title">📚 Blogs</h1>
            <p className="page-subtitle">Manage your blog network</p>
          </div>
          <button className="btn btn-primary">+ Add New Blog</button>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {blogs.map(blog => (
          <div key={blog.id} className="card" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem'
          }}>
            <div style={{ fontSize: '3rem' }}>{blog.icon}</div>
            <div style={{ flex: 1 }}>
              <h3 style={{ marginBottom: '0.5rem' }}>{blog.name}</h3>
              <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.9rem', color: 'var(--gray-600)' }}>
                <span>Theme: {blog.theme}</span>
                <span>Posts: {blog.posts}</span>
                <span>Schedule: {blog.postsPerWeek}/week</span>
              </div>
            </div>
            <span className="badge badge-success">{blog.status}</span>
            <button className="btn btn-secondary">Configure</button>
          </div>
        ))}
      </div>
    </div>
  )
}
