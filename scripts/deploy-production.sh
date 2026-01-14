#!/bin/bash

# Production GitHub Pages Deployment Script
# Optimized for GitHub Actions environment

set -e  # Exit on error

echo "🚀 Preparing GitHub Pages Deployment"
echo "====================================="

# Configuration
OUTPUT_DIR="./output"
DEPLOY_DIR="./deploy"
CONFIG_DIR="./config"

# Check if output directory exists
if [ ! -d "$OUTPUT_DIR" ]; then
    echo "❌ Error: output/ directory not found"
    echo "Tip: Generate content first with: node generators/openai-content-pipeline.js batch 1"
    exit 1
fi

# Clean and create deploy directory
echo "📦 Preparing deployment directory..."
rm -rf "$DEPLOY_DIR"
mkdir -p "$DEPLOY_DIR"

# Copy Dark Forest logo
echo "🎨 Copying Dark Forest logo..."
if [ -f "darkforest.svg" ]; then
    cp darkforest.svg "$DEPLOY_DIR/"
    echo "  ✓ Logo copied"
fi

# Copy all generated blog content
echo "📚 Copying blog content..."
blog_count=0
for blog_dir in "$OUTPUT_DIR"/*; do
    if [ -d "$blog_dir" ]; then
        blog_name=$(basename "$blog_dir")
        echo "  → Copying $blog_name"
        
        mkdir -p "$DEPLOY_DIR/$blog_name"
        cp -r "$blog_dir"/* "$DEPLOY_DIR/$blog_name/" 2>/dev/null || true
        
        # Count posts
        post_count=$(find "$DEPLOY_DIR/$blog_name" -name "*.html" 2>/dev/null | wc -l)
        echo "     ✓ $post_count posts"
        
        blog_count=$((blog_count + 1))
    fi
done

# Load blog configuration
echo "📊 Loading blog configuration..."
if [ -f "$CONFIG_DIR/blog-network-config.json" ]; then
    BLOG_CONFIG=$(cat "$CONFIG_DIR/blog-network-config.json")
else
    echo "⚠️  Warning: blog-network-config.json not found, using defaults"
    BLOG_CONFIG='{}'
fi

# Create main index page with real metrics
echo "📄 Creating showcase index..."
node scripts/generate-showcase-index.js

# Old static index (keeping as fallback comment)
: << 'INDEXEOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI-Powered Blog Network | Automated Content Generation</title>
    <meta name="description" content="Explore our network of AI-powered blogs covering AI, Remote Work, Cybersecurity, and Marketing">
    <meta property="og:title" content="AI-Powered Blog Network">
    <meta property="og:description" content="High-quality, AI-generated content across multiple niches">
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
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }
        
        header {
            text-align: center;
            padding: 4rem 0;
            color: white;
        }
        
        h1 {
            font-size: 3rem;
            font-weight: 800;
            margin-bottom: 1rem;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
            animation: fadeInDown 0.8s ease;
        }
        
        @keyframes fadeInDown {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .tagline {
            font-size: 1.5rem;
            opacity: 0.95;
            margin-bottom: 2rem;
            animation: fadeIn 1s ease 0.3s both;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        .stats {
            display: flex;
            justify-content: center;
            gap: 3rem;
            margin: 2rem 0;
            flex-wrap: wrap;
        }
        
        .stat {
            text-align: center;
            animation: fadeIn 1s ease 0.5s both;
        }
        
        .stat-number {
            font-size: 2.5rem;
            font-weight: 700;
            display: block;
        }
        
        .stat-label {
            font-size: 1rem;
            opacity: 0.9;
        }
        
        .blog-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin: 3rem 0;
        }
        
        .blog-card {
            background: white;
            border-radius: 1rem;
            padding: 2rem;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
            text-decoration: none;
            color: inherit;
            display: block;
            animation: fadeInUp 0.8s ease both;
        }
        
        .blog-card:nth-child(1) { animation-delay: 0.1s; }
        .blog-card:nth-child(2) { animation-delay: 0.2s; }
        .blog-card:nth-child(3) { animation-delay: 0.3s; }
        .blog-card:nth-child(4) { animation-delay: 0.4s; }
        
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
        
        .blog-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 15px 40px rgba(0,0,0,0.3);
        }
        
        .blog-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
            display: block;
        }
        
        .blog-name {
            font-size: 1.5rem;
            font-weight: 700;
            color: #2563eb;
            margin-bottom: 0.5rem;
        }
        
        .blog-niche {
            color: #6b7280;
            font-size: 0.9rem;
            margin-bottom: 1rem;
        }
        
        .blog-stats {
            display: flex;
            gap: 1rem;
            margin: 1rem 0;
            font-size: 0.9rem;
            color: #6b7280;
        }
        
        .blog-cta {
            display: inline-block;
            margin-top: 1rem;
            padding: 0.75rem 1.5rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 0.5rem;
            font-weight: 600;
            transition: all 0.3s ease;
        }
        
        .blog-cta:hover {
            transform: scale(1.05);
        }
        
        .tech-stack {
            background: white;
            border-radius: 1rem;
            padding: 2rem;
            margin: 3rem 0;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        
        .tech-stack h2 {
            color: #2563eb;
            margin-bottom: 1.5rem;
        }
        
        .tech-list {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
        }
        
        .tech-badge {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 2rem;
            font-weight: 600;
            font-size: 0.9rem;
        }
        
        footer {
            text-align: center;
            padding: 2rem;
            color: white;
            opacity: 0.9;
            margin-top: 4rem;
        }
        
        footer a {
            color: white;
            text-decoration: underline;
        }
        
        @media (max-width: 768px) {
            h1 {
                font-size: 2rem;
            }
            
            .tagline {
                font-size: 1.2rem;
            }
            
            .stats {
                flex-direction: column;
                gap: 1.5rem;
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
            <div style="display: flex; align-items: center; justify-content: center; gap: 20px; margin-bottom: 20px;">
                <img src="darkforest.svg" alt="Dark Forest" style="width: 80px; height: 80px; filter: drop-shadow(0 0 20px rgba(0,255,200,0.3));">
                <div>
                    <h1 style="margin: 0;">Dark Forest Blog Network</h1>
                    <p class="tagline" style="margin: 5px 0 0 0;">AI-Powered Autonomous Content Generation</p>
                </div>
            </div>
            
            <div class="stats">
                <div class="stat">
                    <span class="stat-number" id="blogCount">4</span>
                    <span class="stat-label">Active Blogs</span>
                </div>
                <div class="stat">
                    <span class="stat-number" id="postCount">0</span>
                    <span class="stat-label">AI-Generated Posts</span>
                </div>
                <div class="stat">
                    <span class="stat-number">16</span>
                    <span class="stat-label">Posts per Week</span>
                </div>
                <div class="stat">
                    <span class="stat-number">100%</span>
                    <span class="stat-label">AI-Powered</span>
                </div>
            </div>
        </header>
        
        <div class="blog-grid" id="blogGrid">
            <a href="ai-business-insights/" class="blog-card">
                <span class="blog-icon">🤖</span>
                <div class="blog-name">AI Business Insights</div>
                <div class="blog-niche">AI and Business Technology</div>
                <div class="blog-stats">
                    <span>📝 <span class="post-count">0</span> posts</span>
                    <span>⏰ 5/week</span>
                </div>
                <span class="blog-cta">Visit Blog →</span>
            </a>
            
            <a href="remote-work-revolution/" class="blog-card">
                <span class="blog-icon">🌍</span>
                <div class="blog-name">Remote Work Revolution</div>
                <div class="blog-niche">Remote Work & Digital Nomad Lifestyle</div>
                <div class="blog-stats">
                    <span>📝 <span class="post-count">0</span> posts</span>
                    <span>⏰ 4/week</span>
                </div>
                <span class="blog-cta">Visit Blog →</span>
            </a>
            
            <a href="cybersecurity-today/" class="blog-card">
                <span class="blog-icon">🔒</span>
                <div class="blog-name">Cybersecurity Today</div>
                <div class="blog-niche">Cybersecurity & Data Privacy</div>
                <div class="blog-stats">
                    <span>📝 <span class="post-count">0</span> posts</span>
                    <span>⏰ 3/week</span>
                </div>
                <span class="blog-cta">Visit Blog →</span>
            </a>
            
            <a href="marketing-automation-hub/" class="blog-card">
                <span class="blog-icon">📊</span>
                <div class="blog-name">Marketing Automation Hub</div>
                <div class="blog-niche">Marketing Automation & Growth</div>
                <div class="blog-stats">
                    <span>📝 <span class="post-count">0</span> posts</span>
                    <span>⏰ 4/week</span>
                </div>
                <span class="blog-cta">Visit Blog →</span>
            </a>
        </div>
        
        <div class="tech-stack">
            <h2>⚡ Powered By</h2>
            <div class="tech-list">
                <span class="tech-badge">OpenAI GPT-4</span>
                <span class="tech-badge">Node.js</span>
                <span class="tech-badge">GitHub Actions</span>
                <span class="tech-badge">GitHub Pages</span>
                <span class="tech-badge">Automated SEO</span>
                <span class="tech-badge">Responsive Design</span>
                <span class="tech-badge">Daily Updates</span>
            </div>
        </div>
        
        <footer>
            <p>🚀 Powered by AI · Generated with GPT-4</p>
            <p>Last updated: <span id="lastUpdated"></span></p>
            <p style="margin-top: 1rem;">
                <a href="https://github.com/yoans/darkforest" target="_blank">View on GitHub</a>
            </p>
        </footer>
    </div>
    
    <script>
        // Update last updated date
        document.getElementById('lastUpdated').textContent = new Date().toLocaleString();
        
        // Count posts dynamically (this would be dynamic in production)
        const blogCards = document.querySelectorAll('.blog-card');
        let totalPosts = 0;
        
        blogCards.forEach(card => {
            // In production, this would fetch actual post counts
            const randomCount = Math.floor(Math.random() * 10) + 1;
            const countSpan = card.querySelector('.post-count');
            if (countSpan) {
                countSpan.textContent = randomCount;
                totalPosts += randomCount;
            }
        });
        
        document.getElementById('postCount').textContent = totalPosts;
    </script>
</body>
</html>
INDEXEOF

# Create .nojekyll file (required for GitHub Pages)
echo "📄 Creating .nojekyll..."
touch "$DEPLOY_DIR/.nojekyll"

# NOTE: Removed README.md to prevent CDN/Jekyll from using it as index

# Summary
echo ""
echo "✅ Deployment directory ready!"
echo ""
echo "📊 Deployment Summary:"
echo "   Location: $DEPLOY_DIR/"
echo "   Blogs: $blog_count"
echo "   Size: $(du -sh "$DEPLOY_DIR" 2>/dev/null | cut -f1 || echo 'unknown')"
echo ""
echo "🚀 Ready for GitHub Pages deployment!"
