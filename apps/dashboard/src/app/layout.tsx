import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Dark Forest Dashboard',
  description: 'AI Blog Network Management Dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <div className="flex h-screen">
          {/* Sidebar */}
          <div className="w-64 bg-gray-900 text-white p-6">
            <h1 className="text-xl font-bold mb-8">🌲 Dark Forest</h1>
            <nav className="space-y-2">
              <a href="/" className="block p-2 rounded hover:bg-gray-700">
                📊 Dashboard
              </a>
              <a href="/sites" className="block p-2 rounded hover:bg-gray-700">
                🌐 Sites
              </a>
              <a href="/content" className="block p-2 rounded hover:bg-gray-700">
                📝 Content
              </a>
              <a href="/agents" className="block p-2 rounded hover:bg-gray-700">
                🤖 Agents
              </a>
              <a href="/approvals" className="block p-2 rounded hover:bg-gray-700">
                ✅ Approvals
              </a>
              <a href="/analytics" className="block p-2 rounded hover:bg-gray-700">
                📈 Analytics  
              </a>
              <a href="/settings" className="block p-2 rounded hover:bg-gray-700">
                ⚙️ Settings
              </a>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}