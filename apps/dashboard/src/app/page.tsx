export default function HomePage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Dark Forest Network Dashboard
        </h1>
        <p className="text-gray-600">
          AI-powered blog network management and automation
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Active Sites</h3>
          <p className="text-2xl font-bold text-gray-900">12</p>
          <p className="text-sm text-green-600">+2 this month</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Posts This Week</h3>
          <p className="text-2xl font-bold text-gray-900">84</p>
          <p className="text-sm text-green-600">+12% vs last week</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Traffic</h3>
          <p className="text-2xl font-bold text-gray-900">2.3M</p>
          <p className="text-sm text-green-600">+18% this month</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Revenue</h3>
          <p className="text-2xl font-bold text-gray-900">$15,420</p>
          <p className="text-sm text-green-600">+25% this month</p>
        </div>
      </div>

      {/* Recent Activity & Pending Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Recent Agent Activity</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">
                  <strong>Content Agent:</strong> Published "10 Green Tech Innovations" on TechSustainability Hub
                </span>
                <span className="text-xs text-gray-400">2 min ago</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">
                  <strong>Strategy Agent:</strong> Generated content calendar for Health & Wellness Blog
                </span>
                <span className="text-xs text-gray-400">15 min ago</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-600">
                  <strong>SEO Agent:</strong> Optimized 5 posts for better rankings
                </span>
                <span className="text-xs text-gray-400">1 hour ago</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Pending Approvals</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="border border-orange-200 rounded p-4 bg-orange-50">
                <h3 className="font-medium text-gray-900">High-Value Content</h3>
                <p className="text-sm text-gray-600">
                  "Ultimate Guide to Sustainable Investing" - 2,500 words
                </p>
                <div className="mt-2 flex space-x-2">
                  <button className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700">
                    Approve
                  </button>
                  <button className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400">
                    Review
                  </button>
                  <button className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700">
                    Reject
                  </button>
                </div>
              </div>

              <div className="border border-blue-200 rounded p-4 bg-blue-50">
                <h3 className="font-medium text-gray-900">Strategy Change</h3>
                <p className="text-sm text-gray-600">
                  Shift FinanceBlog focus to cryptocurrency content (45% increase in traffic potential)
                </p>
                <div className="mt-2 flex space-x-2">
                  <button className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700">
                    Approve
                  </button>
                  <button className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400">
                    Review
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Agent Status */}
      <div className="mt-8 bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Agent Status</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
              <p className="text-sm font-medium">Strategy Agent</p>
              <p className="text-xs text-gray-500">Active</p>
            </div>
            <div className="text-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
              <p className="text-sm font-medium">Content Agent</p>
              <p className="text-xs text-gray-500">Active</p>
            </div>
            <div className="text-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
              <p className="text-sm font-medium">Publishing Agent</p>
              <p className="text-xs text-gray-500">Active</p>
            </div>
            <div className="text-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mx-auto mb-2"></div>
              <p className="text-sm font-medium">Analytics Agent</p>
              <p className="text-xs text-gray-500">Processing</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}