#!/usr/bin/env node

/**
 * Generate Showcase Index Page with Real Metrics
 */

const fs = require('fs');
const path = require('path');

const DEPLOY_DIR = path.join(__dirname, '..', 'deploy');

// Get real metrics
function getMetrics() {
    const blogs = ['ai-business-insights', 'remote-work-revolution', 'cybersecurity-today', 'marketing-automation-hub'];
    const blogData = [];
    
    let totalPosts = 0;
    
    blogs.forEach(blogSlug => {
        const blogDir = path.join(DEPLOY_DIR, blogSlug);
        if (!fs.existsSync(blogDir)) return;
        
        const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.html'));
        const posts = files.map(f => {
            const slug = f.replace('.html', '');
            const title = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
            return { slug, title, filename: f };
        });
        
        totalPosts += posts.length;
        
        // Get size
        const stats = getDirectorySize(blogDir);
        
        blogData.push({
            slug: blogSlug,
            name: getBlogName(blogSlug),
            icon: getBlogIcon(blogSlug),
            description: getBlogDescription(blogSlug),
            theme: getBlogTheme(blogSlug),
            posts: posts,
            postCount: posts.length,
            size: formatBytes(stats)
        });
    });
    
    return { blogs: blogData, totalPosts };
}

function getDirectorySize(dir) {
    let size = 0;
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);
        if (stats.isFile()) {
            size += stats.size;
        }
    });
    return size;
}

function formatBytes(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function getBlogName(slug) {
    const names = {
        'ai-business-insights': 'AI Business Insights',
        'remote-work-revolution': 'Remote Work Revolution',
        'cybersecurity-today': 'Cybersecurity Today',
        'marketing-automation-hub': 'Marketing Automation Hub'
    };
    return names[slug] || slug;
}

function getBlogIcon(slug) {
    const icons = {
        'ai-business-insights': '🤖',
        'remote-work-revolution': '🌍',
        'cybersecurity-today': '🔒',
        'marketing-automation-hub': '📊'
    };
    return icons[slug] || '📝';
}

function getBlogDescription(slug) {
    const descriptions = {
        'ai-business-insights': 'Exploring AI implementation strategies, digital transformation, and business automation',
        'remote-work-revolution': 'Work-life balance, productivity tips, and remote work best practices',
        'cybersecurity-today': 'Security tools, threat analysis, and data protection strategies',
        'marketing-automation-hub': 'Conversion optimization, marketing automation, and growth strategies'
    };
    return descriptions[slug] || 'High-quality automated content';
}

function getBlogTheme(slug) {
    const themes = {
        'ai-business-insights': 'Corporate Blue',
        'remote-work-revolution': 'Lifestyle Modern',
        'cybersecurity-today': 'Tech Dark',
        'marketing-automation-hub': 'Marketing Vibrant'
    };
    return themes[slug] || 'Professional';
}

function generateHTML(data) {
    const { blogs, totalPosts } = data;
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI-Powered Blog Network | Autonomous Content Generation</title>
    <meta name="description" content="Explore our network of ${blogs.length} AI-powered blogs with ${totalPosts} high-quality articles">
    <meta property="og:title" content="AI-Powered Blog Network Showcase">
    <meta property="og:description" content="Autonomous multi-agent system generating professional content across multiple niches">
    <meta property="og:type" content="website">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            line-height: 1.6;
            color: #1f2937;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 2rem;
        }
        
        header {
            text-align: center;
            padding: 4rem 0 3rem;
            color: white;
        }
        
        h1 {
            font-size: 3.5rem;
            font-weight: 800;
            margin-bottom: 1rem;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
            animation: fadeInDown 0.8s ease;
        }
        
        .tagline {
            font-size: 1.4rem;
            opacity: 0.95;
            margin-bottom: 2rem;
            animation: fadeInUp 0.8s ease 0.2s both;
        }
        
        .stats {
            display: flex;
            justify-content: center;
            gap: 3rem;
            margin: 2rem 0;
            flex-wrap: wrap;
            animation: fadeInUp 0.8s ease 0.4s both;
        }
        
        .stat {
            text-align: center;
        }
        
        .stat-number {
            font-size: 3rem;
            font-weight: 800;
            display: block;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
        }
        
        .stat-label {
            font-size: 1rem;
            opacity: 0.9;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .blog-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: 2rem;
            margin: 3rem 0;
        }
        
        .blog-card {
            background: white;
            border-radius: 1rem;
            padding: 2rem;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
            animation: fadeInUp 0.6s ease both;
        }
        
        .blog-card:nth-child(1) { animation-delay: 0.1s; }
        .blog-card:nth-child(2) { animation-delay: 0.2s; }
        .blog-card:nth-child(3) { animation-delay: 0.3s; }
        .blog-card:nth-child(4) { animation-delay: 0.4s; }
        
        .blog-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 15px 40px rgba(0,0,0,0.3);
        }
        
        .blog-icon {
            font-size: 4rem;
            margin-bottom: 1rem;
            display: block;
        }
        
        .blog-name {
            font-size: 1.75rem;
            font-weight: 700;
            color: #2563eb;
            margin-bottom: 0.5rem;
        }
        
        .blog-description {
            color: #6b7280;
            font-size: 1rem;
            margin-bottom: 1.5rem;
            line-height: 1.5;
        }
        
        .blog-meta {
            display: flex;
            gap: 1.5rem;
            margin: 1.5rem 0;
            padding: 1rem;
            background: #f9fafb;
            border-radius: 0.5rem;
            font-size: 0.9rem;
        }
        
        .meta-item {
            display: flex;
            flex-direction: column;
        }
        
        .meta-label {
            color: #9ca3af;
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .meta-value {
            color: #1f2937;
            font-weight: 600;
            font-size: 1.1rem;
        }
        
        .post-list {
            margin: 1rem 0;
            padding: 0;
            list-style: none;
        }
        
        .post-item {
            padding: 0.75rem;
            margin-bottom: 0.5rem;
            background: #f9fafb;
            border-radius: 0.5rem;
            transition: all 0.2s ease;
        }
        
        .post-item:hover {
            background: #f3f4f6;
            transform: translateX(5px);
        }
        
        .post-link {
            color: #4b5563;
            text-decoration: none;
            font-size: 0.95rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .post-link:hover {
            color: #2563eb;
        }
        
        .post-link::before {
            content: "📄";
            font-size: 1rem;
        }
        
        .blog-cta {
            display: inline-block;
            margin-top: 1rem;
            padding: 0.875rem 1.75rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 0.5rem;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.3s ease;
        }
        
        .blog-cta:hover {
            transform: scale(1.05);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }
        
        .tech-section {
            background: white;
            border-radius: 1rem;
            padding: 2.5rem;
            margin: 3rem 0;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            animation: fadeInUp 0.8s ease 0.6s both;
        }
        
        .tech-section h2 {
            color: #2563eb;
            margin-bottom: 1.5rem;
            font-size: 2rem;
        }
        
        .tech-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
            margin-top: 2rem;
        }
        
        .tech-item {
            text-align: center;
            padding: 1.5rem;
            background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
            border-radius: 0.75rem;
            transition: all 0.3s ease;
        }
        
        .tech-item:hover {
            transform: translateY(-5px);
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        
        .tech-icon {
            font-size: 2rem;
            margin-bottom: 0.5rem;
        }
        
        .tech-name {
            font-weight: 600;
            font-size: 1.1rem;
        }
        
        footer {
            text-align: center;
            padding: 3rem 2rem;
            color: white;
            opacity: 0.95;
            margin-top: 4rem;
        }
        
        footer a {
            color: white;
            text-decoration: underline;
        }
        
        @keyframes fadeInDown {
            from {
                opacity: 0;
                transform: translateY(-30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @media (max-width: 768px) {
            h1 {
                font-size: 2.5rem;
            }
            
            .tagline {
                font-size: 1.2rem;
            }
            
            .stats {
                gap: 1.5rem;
            }
            
            .stat-number {
                font-size: 2rem;
            }
            
            .blog-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>🤖 AI-Powered Blog Network</h1>
            <p class="tagline">Autonomous Multi-Agent Content Generation System</p>
            
            <div class="stats">
                <div class="stat">
                    <span class="stat-number">${blogs.length}</span>
                    <span class="stat-label">Active Blogs</span>
                </div>
                <div class="stat">
                    <span class="stat-number">${totalPosts}</span>
                    <span class="stat-label">Published Posts</span>
                </div>
                <div class="stat">
                    <span class="stat-number">100%</span>
                    <span class="stat-label">AI Generated</span>
                </div>
            </div>
        </header>
        
        <main>
            <div class="blog-grid">
${blogs.map(blog => `                <div class="blog-card">
                    <span class="blog-icon">${blog.icon}</span>
                    <h2 class="blog-name">${blog.name}</h2>
                    <p class="blog-description">${blog.description}</p>
                    
                    <div class="blog-meta">
                        <div class="meta-item">
                            <span class="meta-label">Articles</span>
                            <span class="meta-value">${blog.postCount}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">Size</span>
                            <span class="meta-value">${blog.size}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">Theme</span>
                            <span class="meta-value">${blog.theme}</span>
                        </div>
                    </div>
                    
                    <ul class="post-list">
${blog.posts.map(post => `                        <li class="post-item">
                            <a href="${blog.slug}/${post.filename}" class="post-link">${post.title}</a>
                        </li>`).join('\n')}
                    </ul>
                    
                    <a href="${blog.slug}/" class="blog-cta">Explore Blog →</a>
                </div>`).join('\n')}
            </div>
            
            <div class="tech-section">
                <h2>⚡ Technology Stack</h2>
                <p style="color: #6b7280; margin-bottom: 2rem;">
                    Powered by cutting-edge AI and modern web technologies
                </p>
                
                <div class="tech-grid">
                    <div class="tech-item">
                        <div class="tech-icon">🧠</div>
                        <div class="tech-name">OpenAI GPT-4</div>
                    </div>
                    <div class="tech-item">
                        <div class="tech-icon">🤖</div>
                        <div class="tech-name">Multi-Agent System</div>
                    </div>
                    <div class="tech-item">
                        <div class="tech-icon">⚡</div>
                        <div class="tech-name">GitHub Actions</div>
                    </div>
                    <div class="tech-item">
                        <div class="tech-icon">🌐</div>
                        <div class="tech-name">GitHub Pages</div>
                    </div>
                    <div class="tech-item">
                        <div class="tech-icon">📊</div>
                        <div class="tech-name">Analytics Ready</div>
                    </div>
                    <div class="tech-item">
                        <div class="tech-icon">💰</div>
                        <div class="tech-name">Monetization</div>
                    </div>
                </div>
            </div>
            
            <div class="tech-section">
                <h2>🎯 How It Works</h2>
                <p style="color: #6b7280; line-height: 1.8; font-size: 1.1rem;">
                    This blog network is powered by an <strong>autonomous multi-agent system</strong> that runs on GitHub Actions. 
                    Every day, specialized AI agents collaborate to research trending topics, generate high-quality content, 
                    optimize for SEO, and publish automatically. Each blog has its own unique theme and content strategy, 
                    all managed from a centralized configuration system.
                </p>
                <p style="color: #6b7280; line-height: 1.8; font-size: 1.1rem; margin-top: 1rem;">
                    <strong>Key Features:</strong> Automated content generation • Professional themes • SEO optimization • 
                    Monetization ready • Analytics integration • Zero server costs
                </p>
            </div>
        </main>
        
        <footer>
            <p>
                Built with ❤️ using AI • Deployed on <a href="https://pages.github.com/" target="_blank">GitHub Pages</a> • 
                Generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <p style="margin-top: 1rem; font-size: 0.9rem;">
                🚀 Autonomous • 🎨 Professional • 📈 Scalable
            </p>
        </footer>
    </div>
</body>
</html>`;
}

// Main execution
try {
    console.log('📊 Gathering metrics...');
    const data = getMetrics();
    
    console.log(`✅ Found ${data.blogs.length} blogs with ${data.totalPosts} total posts`);
    
    console.log('📝 Generating showcase HTML...');
    const html = generateHTML(data);
    
    console.log('💾 Writing index.html...');
    fs.writeFileSync(path.join(DEPLOY_DIR, 'index.html'), html);
    
    console.log('✅ Showcase index created successfully!');
} catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
}
