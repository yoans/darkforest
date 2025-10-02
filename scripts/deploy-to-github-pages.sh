#!/bin/bash

# GitHub Pages Deployment Script
# Deploys all generated blogs to GitHub Pages

set -e  # Exit on error

echo "🚀 GitHub Pages Deployment Script"
echo "=================================="
echo ""

# Configuration
OUTPUT_DIR="./output"
DEPLOY_DIR="./deploy"
NETWORK_SHOWCASE_DIR="./apps/showcase-blog"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if output directory exists
if [ ! -d "$OUTPUT_DIR" ]; then
    echo "❌ Error: output/ directory not found. Generate content first!"
    exit 1
fi

echo "${BLUE}📦 Step 1: Preparing deployment directory${NC}"
rm -rf "$DEPLOY_DIR"
mkdir -p "$DEPLOY_DIR"

# Create main index page (network showcase)
echo "${BLUE}📄 Step 2: Creating network index${NC}"
cat > "$DEPLOY_DIR/index.html" << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI-Powered Blog Network | Automated Content Generation</title>
    <meta name="description" content="A showcase of AI-powered content generation across multiple niche blogs">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
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
        }
        
        .tagline {
            font-size: 1.5rem;
            opacity: 0.95;
            margin-bottom: 2rem;
        }
        
        .stats {
            display: flex;
            justify-content: center;
            gap: 3rem;
            margin: 2rem 0;
        }
        
        .stat {
            text-align: center;
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
        }
        
        .blog-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 15px 40px rgba(0,0,0,0.3);
        }
        
        .blog-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
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
        }
        
        @media (max-width: 768px) {
            h1 { font-size: 2rem; }
            .tagline { font-size: 1.2rem; }
            .stats { flex-direction: column; gap: 1.5rem; }
            .blog-grid { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>🤖 AI-Powered Blog Network</h1>
            <p class="tagline">Automated Content Generation at Scale</p>
            
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
            </div>
        </header>
        
        <div class="blog-grid" id="blogGrid">
            <!-- Blogs will be dynamically loaded -->
        </div>
        
        <div class="tech-stack">
            <h2>⚡ Technology Stack</h2>
            <div class="tech-list">
                <span class="tech-badge">OpenAI GPT-4</span>
                <span class="tech-badge">Node.js</span>
                <span class="tech-badge">Vanilla JS</span>
                <span class="tech-badge">GitHub Pages</span>
                <span class="tech-badge">GitHub Actions</span>
                <span class="tech-badge">Automated SEO</span>
                <span class="tech-badge">Responsive Design</span>
                <span class="tech-badge">Google Analytics</span>
                <span class="tech-badge">AdSense Integration</span>
            </div>
        </div>
        
        <footer>
            <p>🚀 Powered by AI · Built with ❤️ using GPT-4</p>
            <p>Last updated: <span id="lastUpdated"></span></p>
        </footer>
    </div>
    
    <script>
        // Blog configuration
        const blogs = [
            {
                id: 'ai-business-insights',
                name: 'AI Business Insights',
                icon: '🤖',
                niche: 'AI and Business Technology',
                postsPerWeek: 5,
                path: 'ai-business-insights'
            },
            {
                id: 'remote-work-revolution',
                name: 'Remote Work Revolution',
                icon: '🌍',
                niche: 'Remote Work and Digital Nomad Lifestyle',
                postsPerWeek: 4,
                path: 'remote-work-revolution'
            },
            {
                id: 'cybersecurity-today',
                name: 'Cybersecurity Today',
                icon: '🔒',
                niche: 'Cybersecurity and Data Privacy',
                postsPerWeek: 3,
                path: 'cybersecurity-today'
            },
            {
                id: 'marketing-automation-hub',
                name: 'Marketing Automation Hub',
                icon: '📊',
                niche: 'Marketing Automation and Growth',
                postsPerWeek: 4,
                path: 'marketing-automation-hub'
            }
        ];
        
        // Load blogs
        const blogGrid = document.getElementById('blogGrid');
        let totalPosts = 0;
        
        blogs.forEach(blog => {
            const card = document.createElement('a');
            card.className = 'blog-card';
            card.href = `${blog.path}/`;
            
            // Count posts (this will be dynamic in production)
            const postCount = Math.floor(Math.random() * 10) + 5; // Placeholder
            totalPosts += postCount;
            
            card.innerHTML = `
                <div class="blog-icon">${blog.icon}</div>
                <div class="blog-name">${blog.name}</div>
                <div class="blog-niche">${blog.niche}</div>
                <div class="blog-stats">
                    <span>📝 ${postCount} posts</span>
                    <span>⏰ ${blog.postsPerWeek}/week</span>
                </div>
                <span class="blog-cta">Visit Blog →</span>
            `;
            
            blogGrid.appendChild(card);
        });
        
        // Update stats
        document.getElementById('postCount').textContent = totalPosts;
        document.getElementById('lastUpdated').textContent = new Date().toLocaleDateString();
    </script>
</body>
</html>
EOF

# Copy all blog directories
echo "${BLUE}📚 Step 3: Copying blog content${NC}"
blog_count=0
for blog_dir in "$OUTPUT_DIR"/*; do
    if [ -d "$blog_dir" ]; then
        blog_name=$(basename "$blog_dir")
        echo "  → Copying $blog_name"
        
        mkdir -p "$DEPLOY_DIR/$blog_name"
        cp -r "$blog_dir"/* "$DEPLOY_DIR/$blog_name/" 2>/dev/null || true
        
        # Create index.html for each blog
        post_count=$(find "$DEPLOY_DIR/$blog_name" -name "*.html" | wc -l)
        
        # Generate blog index page
        cat > "$DEPLOY_DIR/$blog_name/index.html" << BLOGEOF
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>$blog_name Blog | AI-Generated Content</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #1f2937;
            background: #f9fafb;
        }
        .container { max-width: 1000px; margin: 0 auto; padding: 2rem; }
        header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 3rem 2rem;
            border-radius: 1rem;
            margin-bottom: 3rem;
            text-align: center;
        }
        h1 { font-size: 2.5rem; margin-bottom: 0.5rem; }
        .back-link {
            display: inline-block;
            margin-bottom: 1rem;
            color: white;
            text-decoration: none;
            opacity: 0.9;
        }
        .back-link:hover { opacity: 1; }
        .post-grid {
            display: grid;
            gap: 2rem;
        }
        .post-card {
            background: white;
            padding: 2rem;
            border-radius: 0.75rem;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
        }
        .post-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .post-card h2 {
            color: #2563eb;
            margin-bottom: 0.5rem;
        }
        .post-card a {
            color: inherit;
            text-decoration: none;
        }
        .read-more {
            display: inline-block;
            margin-top: 1rem;
            color: #2563eb;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <a href="../" class="back-link">← Back to Network</a>
            <h1>$blog_name</h1>
            <p>$post_count AI-Generated Articles</p>
        </header>
        
        <div class="post-grid" id="postGrid"></div>
    </div>
    
    <script>
        // Load and display posts
        const postGrid = document.getElementById('postGrid');
        
        // This would be dynamic in production
        const posts = [];
        document.querySelectorAll('a[href\$=".html"]').forEach(link => {
            if (link.href.includes('/') && !link.href.includes('index.html')) {
                posts.push({
                    title: link.textContent || 'Untitled',
                    url: link.getAttribute('href')
                });
            }
        });
        
        // Display placeholder if no posts found
        if (posts.length === 0) {
            postGrid.innerHTML = '<p>No posts found. Generate content first!</p>';
        }
    </script>
</body>
</html>
BLOGEOF
        
        ((blog_count++))
    fi
done

echo "${GREEN}✅ Prepared $blog_count blogs for deployment${NC}"

# Create .nojekyll file (required for GitHub Pages)
echo "${BLUE}📄 Step 4: Configuring for GitHub Pages${NC}"
touch "$DEPLOY_DIR/.nojekyll"

# Create README
cat > "$DEPLOY_DIR/README.md" << 'EOF'
# AI-Powered Blog Network

This directory contains automatically generated blog content powered by GPT-4.

## Blogs

- **AI Business Insights**: AI and Business Technology
- **Remote Work Revolution**: Remote Work and Digital Nomad Lifestyle
- **Cybersecurity Today**: Cybersecurity and Data Privacy
- **Marketing Automation Hub**: Marketing Automation and Growth

## Technology

- OpenAI GPT-4 for content generation
- Vanilla JavaScript (no frameworks)
- GitHub Pages for hosting
- Automated deployment via GitHub Actions

Last updated: $(date)
EOF

echo "${GREEN}✅ Deployment directory ready!${NC}"
echo ""
echo "${YELLOW}📦 Deployment Summary:${NC}"
echo "   Location: $DEPLOY_DIR/"
echo "   Blogs: $blog_count"
echo "   Size: $(du -sh "$DEPLOY_DIR" | cut -f1)"
echo ""
echo "${BLUE}🚀 Next Steps:${NC}"
echo "   1. Initialize git repo: cd $DEPLOY_DIR && git init"
echo "   2. Create GitHub repository"
echo "   3. Push to GitHub: git add . && git commit -m 'Initial deploy' && git push"
echo "   4. Enable GitHub Pages in repository settings"
echo "   5. Your network will be live at: https://YOUR-USERNAME.github.io/YOUR-REPO"
echo ""
echo "${GREEN}✨ Deployment prepared successfully!${NC}"
