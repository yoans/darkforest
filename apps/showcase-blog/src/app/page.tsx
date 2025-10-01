'use client'

import { useState, useEffect } from 'react'

export default function HomePage() {
  const [agentStatus, setAgentStatus] = useState({
    strategy: 'active',
    content: 'active', 
    publishing: 'active',
    analytics: 'processing',
    seo: 'active',
    monetization: 'active'
  })

  const [liveStats, setLiveStats] = useState({
    sitesActive: 12,
    postsToday: 24,
    totalViews: 125430,
    revenue: 2340
  })

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        sitesActive: prev.sitesActive + Math.floor(Math.random() * 2),
        postsToday: prev.postsToday + Math.floor(Math.random() * 3),
        totalViews: prev.totalViews + Math.floor(Math.random() * 50),
        revenue: prev.revenue + Math.floor(Math.random() * 10)
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Dark Forest Network
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Watch 8 AI agents collaborate in real-time to build, optimize, and monetize 
            an entire network of blogs. <span className="text-green-400">Completely autonomous.</span>
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="bg-black/40 backdrop-blur-md rounded-lg p-4 border border-green-500/30">
              <div className="text-2xl font-bold text-green-400">{liveStats.sitesActive}</div>
              <div className="text-sm text-gray-400">Active Sites</div>
            </div>
            <div className="bg-black/40 backdrop-blur-md rounded-lg p-4 border border-blue-500/30">
              <div className="text-2xl font-bold text-blue-400">{liveStats.postsToday}</div>
              <div className="text-sm text-gray-400">Posts Today</div>
            </div>
            <div className="bg-black/40 backdrop-blur-md rounded-lg p-4 border border-purple-500/30">
              <div className="text-2xl font-bold text-purple-400">{liveStats.totalViews.toLocaleString()}</div>
              <div className="text-sm text-gray-400">Total Views</div>
            </div>
            <div className="bg-black/40 backdrop-blur-md rounded-lg p-4 border border-yellow-500/30">
              <div className="text-2xl font-bold text-yellow-400">${liveStats.revenue}</div>
              <div className="text-sm text-gray-400">Revenue This Month</div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <a href="#live-demo" 
               className="bg-green-600 hover:bg-green-700 px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-105">
              🎮 Watch Agents Live
            </a>
            <a href="https://github.com/yoans/darkforest"
               className="bg-gray-800 hover:bg-gray-700 border border-gray-600 px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-105">
              🔧 View Source Code
            </a>
          </div>
        </div>
      </section>

      {/* Live Agent Activity */}
      <section id="live-demo" className="py-20 bg-black/30">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-green-400">
            🤖 Agents Working Right Now
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(agentStatus).map(([agent, status]) => (
              <div key={agent} className="bg-gray-900/80 backdrop-blur-md rounded-lg p-6 border border-green-500/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold capitalize text-white">{agent} Agent</h3>
                  <div className={`w-3 h-3 rounded-full ${
                    status === 'active' ? 'bg-green-500 animate-pulse' : 
                    status === 'processing' ? 'bg-yellow-500 animate-pulse' : 'bg-gray-500'
                  }`}></div>
                </div>
                
                <div className="text-gray-400 text-sm mb-3">
                  {agent === 'strategy' && 'Planning content calendar for Tech Blog'}
                  {agent === 'content' && 'Writing "10 AI Tools That Will Change 2025"'}
                  {agent === 'publishing' && 'Optimizing SEO for 3 pending articles'}
                  {agent === 'analytics' && 'Analyzing traffic patterns from yesterday'}
                  {agent === 'seo' && 'Monitoring keyword rankings across network'}
                  {agent === 'monetization' && 'A/B testing ad placements'}
                </div>

                <div className="bg-black/50 rounded p-3">
                  <div className="text-xs text-green-400 mb-1">Latest Action:</div>
                  <div className="text-xs text-gray-300">
                    {agent === 'strategy' && 'Generated 7 high-potential topics for Health & Wellness niche'}
                    {agent === 'content' && 'Created 1,847-word SEO-optimized article (Quality Score: 89)'}
                    {agent === 'publishing' && 'Published to WordPress, shared on Twitter, updated sitemap'}
                    {agent === 'analytics' && 'Identified 23% traffic increase from long-tail keywords'}
                    {agent === 'seo' && 'Found 12 new backlink opportunities, updated meta descriptions'}
                    {agent === 'monetization' && 'Increased CTR by 15% with new ad positions'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="agents" className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-blue-400">
            🧠 The AI Agent Network
          </h2>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="bg-green-600 rounded-full p-3 flex-shrink-0">
                  <span className="text-xl">🎯</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-green-400 mb-2">Strategy Agent</h3>
                  <p className="text-gray-400">
                    Analyzes market trends, competitor content, and audience behavior to create 
                    data-driven content strategies across all blog niches.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 rounded-full p-3 flex-shrink-0">
                  <span className="text-xl">✍️</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-blue-400 mb-2">Content Agent</h3>
                  <p className="text-gray-400">
                    Writes engaging, SEO-optimized articles with quality scores, keyword integration,
                    and readability optimization. Adapts voice per blog niche.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-purple-600 rounded-full p-3 flex-shrink-0">
                  <span className="text-xl">🚀</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-purple-400 mb-2">Publishing Agent</h3>
                  <p className="text-gray-400">
                    Handles multi-platform publishing, social media distribution, internal linking,
                    and technical SEO implementation across the network.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-yellow-600 rounded-full p-3 flex-shrink-0">
                  <span className="text-xl">📊</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-yellow-400 mb-2">Analytics Agent</h3>
                  <p className="text-gray-400">
                    Monitors performance metrics, user engagement, and conversion rates. 
                    Provides insights that feed back into strategy decisions.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="bg-red-600 rounded-full p-3 flex-shrink-0">
                  <span className="text-xl">🔍</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-red-400 mb-2">SEO Agent</h3>
                  <p className="text-gray-400">
                    Conducts keyword research, monitors rankings, builds backlinks, and optimizes 
                    technical SEO across all network sites for maximum visibility.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-emerald-600 rounded-full p-3 flex-shrink-0">
                  <span className="text-xl">💰</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-emerald-400 mb-2">Monetization Agent</h3>
                  <p className="text-gray-400">
                    Optimizes ad placements, manages affiliate partnerships, tests revenue strategies,
                    and maximizes ROI across all monetization channels.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-indigo-600 rounded-full p-3 flex-shrink-0">
                  <span className="text-xl">🔧</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-indigo-400 mb-2">Maintenance Agent</h3>
                  <p className="text-gray-400">
                    Handles security updates, performance optimization, broken link fixes,
                    and ensures all sites run smoothly 24/7.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-pink-600 rounded-full p-3 flex-shrink-0">
                  <span className="text-xl">🔬</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-pink-400 mb-2">Research Agent</h3>
                  <p className="text-gray-400">
                    Fact-checks content, identifies trending topics, gathers source materials,
                    and ensures accuracy across all published content.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Agent Workflow Visualization */}
          <div className="bg-gray-900/50 rounded-lg p-8 border border-green-500/20">
            <h3 className="text-2xl font-semibold text-center mb-8 text-green-400">
              Daily Automation Workflow
            </h3>
            
            <div className="flex flex-wrap justify-center items-center space-x-4 space-y-2">
              {[
                'Strategy Plans', 'Research Gathers', 'Content Writes', 'SEO Optimizes',
                'Human Reviews', 'Publishing Deploys', 'Analytics Tracks', 'Monetization Optimizes'
              ].map((step, index) => (
                <div key={step} className="flex items-center">
                  <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg px-4 py-2 text-sm font-medium">
                    {step}
                  </div>
                  {index < 7 && <div className="text-green-400 mx-2">→</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Network Showcase */}
      <section id="network" className="py-20 bg-black/30">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-purple-400">
            🌐 The Growing Blog Network
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: 'Tech Sustainability Hub',
                domain: 'techsustainability.blog',
                niche: 'Sustainable Technology',
                posts: 247,
                monthly: '45K',
                revenue: '$1,200'
              },
              {
                name: 'AI Innovation Weekly', 
                domain: 'aiinnovation.blog',
                niche: 'Artificial Intelligence',
                posts: 189,
                monthly: '38K',
                revenue: '$950'
              },
              {
                name: 'Health & Wellness Pro',
                domain: 'healthwellnesspro.blog', 
                niche: 'Health & Fitness',
                posts: 312,
                monthly: '52K',
                revenue: '$1,400'
              },
              {
                name: 'Finance Freedom Path',
                domain: 'financefreedom.blog',
                niche: 'Personal Finance',
                posts: 156,
                monthly: '29K',
                revenue: '$800'
              },
              {
                name: 'Digital Marketing Edge',
                domain: 'marketingedge.blog',
                niche: 'Digital Marketing', 
                posts: 203,
                monthly: '41K',
                revenue: '$1,100'
              },
              {
                name: 'Productivity Mastery',
                domain: 'productivitymastery.blog',
                niche: 'Productivity & Lifestyle',
                posts: 178,
                monthly: '33K',
                revenue: '$750'
              }
            ].map((blog) => (
              <div key={blog.name} className="bg-gray-900/80 backdrop-blur-md rounded-lg p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-400">Live</span>
                </div>

                <h3 className="text-lg font-semibold text-white mb-2">{blog.name}</h3>
                <div className="text-purple-400 text-sm mb-3">{blog.domain}</div>
                <div className="text-gray-400 text-sm mb-4">{blog.niche}</div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-green-400">{blog.posts}</div>
                    <div className="text-xs text-gray-400">Posts</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-blue-400">{blog.monthly}</div>
                    <div className="text-xs text-gray-400">Monthly Views</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-yellow-400">{blog.revenue}</div>
                    <div className="text-xs text-gray-400">Monthly Revenue</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Revenue & Monetization */}
      <section id="revenue" className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-yellow-400">
            💰 Autonomous Revenue Generation
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-yellow-400 mb-4">
                Revenue Streams
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
                  <span className="text-white">Display Advertising (AdSense)</span>
                  <span className="text-green-400 font-semibold">$3,200/mo</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
                  <span className="text-white">Affiliate Marketing</span>
                  <span className="text-green-400 font-semibold">$1,850/mo</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
                  <span className="text-white">Sponsored Content</span>
                  <span className="text-green-400 font-semibold">$1,200/mo</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
                  <span className="text-white">Newsletter Subscriptions</span>
                  <span className="text-green-400 font-semibold">$650/mo</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-600/20 to-yellow-600/20 rounded-lg p-6 border border-yellow-500/30">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400 mb-2">$6,900/month</div>
                  <div className="text-gray-300">Total Network Revenue</div>
                  <div className="text-sm text-green-400 mt-2">↗ +23% this month</div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-yellow-400 mb-4">
                AI Optimization
              </h3>

              <div className="space-y-4">
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">🎯 Ad Placement Testing</h4>
                  <p className="text-gray-400 text-sm">
                    Monetization Agent continuously A/B tests ad positions, sizes, and formats 
                    to maximize CTR while maintaining user experience.
                  </p>
                </div>

                <div className="bg-gray-900/50 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">🔗 Affiliate Integration</h4>
                  <p className="text-gray-400 text-sm">
                    Content Agent naturally weaves affiliate links into articles based on context,
                    user intent, and conversion probability analysis.
                  </p>
                </div>

                <div className="bg-gray-900/50 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">📧 Email Automation</h4>
                  <p className="text-gray-400 text-sm">
                    Automatically builds email lists, sends newsletters, and nurtures subscribers
                    with personalized content recommendations.
                  </p>
                </div>

                <div className="bg-gray-900/50 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">📊 Revenue Analytics</h4>
                  <p className="text-gray-400 text-sm">
                    Real-time tracking of revenue per article, conversion paths, and ROI 
                    optimization across all monetization channels.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-green-600/20 to-blue-600/20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6 text-green-400">
            Ready to Build Your AI Blog Empire?
          </h2>
          
          <p className="text-xl text-gray-300 mb-8">
            Join the autonomous content revolution. Deploy your own AI agent network
            and watch them build profitable blogs while you sleep.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <a href="https://github.com/yoans/darkforest" 
               className="bg-green-600 hover:bg-green-700 px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-105 flex items-center space-x-2">
              <span>🚀</span>
              <span>Deploy Your Network</span>
            </a>
            <a href="#" 
               className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-105 flex items-center space-x-2">
              <span>📖</span>
              <span>Read Documentation</span>
            </a>
          </div>

          <div className="mt-8 text-gray-400 text-sm">
            Open source • MIT License • Self-hosted • Full control
          </div>
        </div>
      </section>
    </div>
  )
}