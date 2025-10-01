import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Dark Forest Network - AI-Powered Blog Automation',
  description: 'Watch AI agents collaborate to build, maintain, and monetize an entire network of blogs. The future of content creation is autonomous.',
  keywords: 'AI blog network, automated content creation, AI agents, blog monetization, content automation',
  authors: [{ name: 'Dark Forest Network' }],
  openGraph: {
    title: 'Dark Forest Network - AI Blog Automation in Action',
    description: 'Witness 8 AI agents working together to create, optimize, and monetize content across multiple blogs',
    type: 'website',
    url: 'https://darkforest.network',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dark Forest Network - AI Blog Automation',
    description: 'AI agents building blogs autonomously',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-green-900 text-white">
        {/* Navigation */}
        <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-md border-b border-green-500/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-bold text-green-400">🌲 Dark Forest</h1>
                <span className="text-sm text-gray-400">AI Blog Network</span>
              </div>
              
              <div className="flex items-center space-x-6">
                <a href="#live-demo" className="text-gray-300 hover:text-green-400 transition-colors">
                  Live Demo
                </a>
                <a href="#agents" className="text-gray-300 hover:text-green-400 transition-colors">
                  Agents
                </a>
                <a href="#network" className="text-gray-300 hover:text-green-400 transition-colors">
                  Network
                </a>
                <a href="#revenue" className="text-gray-300 hover:text-green-400 transition-colors">
                  Revenue
                </a>
                <a href="https://github.com/yoans/darkforest" 
                   className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors">
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="pt-16">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-black/40 border-t border-green-500/20 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-green-400 font-semibold">🌲 Dark Forest Network</span>
                <span className="text-gray-400">|</span>
                <span className="text-gray-400">Autonomous Blog Creation</span>
              </div>
              
              <div className="flex items-center space-x-6">
                <a href="https://github.com/yoans/darkforest" className="text-gray-400 hover:text-green-400">
                  Source Code
                </a>
                <a href="#contact" className="text-gray-400 hover:text-green-400">
                  Contact
                </a>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-400">Agents Active</span>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}