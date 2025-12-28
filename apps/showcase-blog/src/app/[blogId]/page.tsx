import Link from 'next/link'
import { notFound } from 'next/navigation'

// Blog configurations matching blog-network-config.json
const blogs: Record<string, {
  name: string
  tagline: string
  icon: string
  niche: string
  colors: { primary: string; background: string; text: string }
}> = {
  'ai-business-insights': {
    name: 'AI Business Insights',
    tagline: 'Transforming Business with Artificial Intelligence',
    icon: '🤖',
    niche: 'AI and Business Technology',
    colors: { primary: '#2563eb', background: '#ffffff', text: '#1e293b' }
  },
  'remote-work-revolution': {
    name: 'Remote Work Revolution',
    tagline: 'The Future of Work is Here',
    icon: '🌍',
    niche: 'Remote Work and Digital Nomad Lifestyle',
    colors: { primary: '#10b981', background: '#f9fafb', text: '#111827' }
  },
  'cybersecurity-today': {
    name: 'Cybersecurity Today',
    tagline: 'Protecting Your Digital Future',
    icon: '🔒',
    niche: 'Cybersecurity and Data Privacy',
    colors: { primary: '#ef4444', background: '#111827', text: '#f3f4f6' }
  },
  'marketing-automation-hub': {
    name: 'Marketing Automation Hub',
    tagline: 'Scale Your Marketing with Automation',
    icon: '📈',
    niche: 'Marketing Automation and Growth',
    colors: { primary: '#8b5cf6', background: '#ffffff', text: '#1e293b' }
  },
  'sustainable-tech-future': {
    name: 'Sustainable Tech Future',
    tagline: 'Green Technology for a Better Tomorrow',
    icon: '🌱',
    niche: 'Green Technology and Sustainability',
    colors: { primary: '#059669', background: '#f0fdf4', text: '#1e293b' }
  },
  'personal-finance-mastery': {
    name: 'Personal Finance Mastery',
    tagline: 'Build Wealth, Achieve Freedom',
    icon: '💰',
    niche: 'Personal Finance and Investing',
    colors: { primary: '#0d9488', background: '#ffffff', text: '#1e293b' }
  },
  'health-wellness-hub': {
    name: 'Health & Wellness Hub',
    tagline: 'Your Guide to a Healthier Life',
    icon: '🧘',
    niche: 'Health and Wellness',
    colors: { primary: '#f472b6', background: '#fff1f2', text: '#1e293b' }
  },
  'productivity-hacks': {
    name: 'Productivity Hacks',
    tagline: 'Work Smarter, Not Harder',
    icon: '⚡',
    niche: 'Productivity and Personal Development',
    colors: { primary: '#6366f1', background: '#f8fafc', text: '#1e293b' }
  },
  'ecommerce-insights': {
    name: 'E-Commerce Insights',
    tagline: 'Grow Your Online Business',
    icon: '🛒',
    niche: 'E-Commerce and Online Business',
    colors: { primary: '#f59e0b', background: '#ffffff', text: '#1e293b' }
  },
  'creative-ai-studio': {
    name: 'Creative AI Studio',
    tagline: 'AI-Powered Creativity Unleashed',
    icon: '🎨',
    niche: 'AI in Creative Arts',
    colors: { primary: '#ec4899', background: '#faf5ff', text: '#1e1b4b' }
  }
}

// Sample posts data (in production, this would come from generated content)
const samplePosts = [
  {
    id: 1,
    title: 'Getting Started with Our AI-Powered Content',
    excerpt: 'Learn how our autonomous AI agents create high-quality, SEO-optimized content around the clock.',
    readTime: '5 min read'
  },
  {
    id: 2,
    title: 'The Future of Automated Content Creation',
    excerpt: 'Discover how machine learning is revolutionizing the way we create and publish content online.',
    readTime: '8 min read'
  },
  {
    id: 3,
    title: 'Maximizing SEO with AI-Generated Articles',
    excerpt: 'Our agents optimize every piece of content for search engines while maintaining readability.',
    readTime: '6 min read'
  }
]

// Generate static params for all blog pages
export function generateStaticParams() {
  return Object.keys(blogs).map((blogId) => ({
    blogId,
  }))
}

export default function BlogPage({ params }: { params: { blogId: string } }) {
  const blogId = params.blogId
  
  const blog = blogs[blogId]
  
  if (!blog) {
    notFound()
  }

  const isDarkTheme = blog.colors.background === '#111827'
  const currentDate = new Date().toLocaleDateString()

  return (
    <div 
      className="min-h-screen"
      style={{ 
        backgroundColor: blog.colors.background, 
        color: blog.colors.text 
      }}
    >
      {/* Blog Header */}
      <header 
        className="border-b py-8"
        style={{ borderColor: `${blog.colors.primary}30` }}
      >
        <div className="max-w-4xl mx-auto px-4">
          <Link 
            href="/"
            className={`text-sm mb-4 inline-block hover:underline ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}
          >
            ← Back to Dark Forest Network
          </Link>
          
          <div className="flex items-center gap-4 mt-4">
            <span className="text-5xl">{blog.icon}</span>
            <div>
              <h1 
                className="text-3xl md:text-4xl font-bold"
                style={{ color: blog.colors.primary }}
              >
                {blog.name}
              </h1>
              <p className={`text-lg mt-1 ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
                {blog.tagline}
              </p>
            </div>
          </div>
          
          <div 
            className={`mt-4 text-sm ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}
          >
            Niche: {blog.niche} • AI-Powered Content
          </div>
        </div>
      </header>

      {/* Posts List */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h2 
          className="text-2xl font-bold mb-8"
          style={{ color: blog.colors.primary }}
        >
          Latest Posts
        </h2>
        
        <div className="space-y-8">
          {samplePosts.map((post) => (
            <article 
              key={post.id}
              className={`p-6 rounded-lg border transition-all hover:shadow-lg cursor-pointer ${
                isDarkTheme 
                  ? 'bg-gray-800/50 border-gray-700 hover:border-gray-600' 
                  : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm'
              }`}
            >
              <h3 
                className="text-xl font-semibold mb-2 hover:underline"
                style={{ color: blog.colors.primary }}
              >
                {post.title}
              </h3>
              <p className={`mb-4 ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
                {post.excerpt}
              </p>
              <div className={`text-sm ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
                {currentDate} • {post.readTime}
              </div>
            </article>
          ))}
        </div>

        {/* Coming Soon Notice */}
        <div 
          className={`mt-12 p-6 rounded-lg text-center ${
            isDarkTheme ? 'bg-gray-800' : 'bg-gray-50'
          }`}
        >
          <div className="text-3xl mb-4">🤖</div>
          <h3 className="text-lg font-semibold mb-2">AI Agents Working</h3>
          <p className={`${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
            Our AI agents are continuously creating new content for this blog.
            <br />
            Check back soon for more articles!
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer 
        className={`py-8 mt-12 border-t ${isDarkTheme ? 'border-gray-700' : 'border-gray-200'}`}
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className={`text-sm ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
            Part of the <span style={{ color: blog.colors.primary }}>Dark Forest Network</span> • 
            AI-Powered Autonomous Content
          </p>
          <div className="mt-2 flex justify-center gap-2 items-center">
            <div 
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: blog.colors.primary }}
            ></div>
            <span className={`text-xs ${isDarkTheme ? 'text-gray-500' : 'text-gray-400'}`}>
              Agents Active
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}
