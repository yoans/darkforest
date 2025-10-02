const fs = require('fs');
const path = require('path');

/**
 * Simple HTML Blog Generator
 * Generates static HTML pages from content data
 */
class SimpleBlogGenerator {
  constructor(outputDir = './generated-sites') {
    this.outputDir = outputDir;
    this.ensureOutputDir();
  }

  ensureOutputDir() {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * Generate a complete blog post HTML file
   */
  generatePost(postData) {
    const { title, content, author = 'AI Agent', publishDate = new Date(), slug, tags = [], seoDescription } = postData;
    
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} | AI Blog Network</title>
    <meta name="description" content="${seoDescription || title}">
    <meta name="keywords" content="${tags.join(', ')}">
    <meta name="author" content="${author}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${seoDescription || title}">
    <meta property="og:type" content="article">
    
    <style>
        :root {
            --primary-color: #2563eb;
            --secondary-color: #64748b;
            --text-color: #1e293b;
            --bg-color: #ffffff;
            --border-color: #e2e8f0;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: var(--text-color);
            background-color: var(--bg-color);
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
        }
        
        .header {
            text-align: center;
            margin-bottom: 3rem;
            padding-bottom: 2rem;
            border-bottom: 1px solid var(--border-color);
        }
        
        .header h1 {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 1rem;
            color: var(--primary-color);
        }
        
        .meta {
            color: var(--secondary-color);
            font-size: 0.9rem;
            margin-bottom: 1rem;
        }
        
        .tags {
            display: flex;
            gap: 0.5rem;
            justify-content: center;
            flex-wrap: wrap;
        }
        
        .tag {
            background: var(--primary-color);
            color: white;
            padding: 0.25rem 0.75rem;
            border-radius: 1rem;
            font-size: 0.8rem;
            text-decoration: none;
        }
        
        .content {
            font-size: 1.1rem;
            line-height: 1.8;
            margin-bottom: 3rem;
        }
        
        .content h2 {
            font-size: 1.8rem;
            margin: 2rem 0 1rem 0;
            color: var(--primary-color);
        }
        
        .content h3 {
            font-size: 1.4rem;
            margin: 1.5rem 0 0.75rem 0;
            color: var(--text-color);
        }
        
        .content p {
            margin-bottom: 1.5rem;
        }
        
        .content ul, .content ol {
            margin: 1rem 0 1.5rem 2rem;
        }
        
        .content li {
            margin-bottom: 0.5rem;
        }
        
        .content code {
            background: #f1f5f9;
            padding: 0.2rem 0.4rem;
            border-radius: 0.25rem;
            font-family: 'Courier New', monospace;
            font-size: 0.9rem;
        }
        
        .content pre {
            background: #1e293b;
            color: #e2e8f0;
            padding: 1rem;
            border-radius: 0.5rem;
            overflow-x: auto;
            margin: 1.5rem 0;
        }
        
        .footer {
            border-top: 1px solid var(--border-color);
            padding-top: 2rem;
            text-align: center;
            color: var(--secondary-color);
        }
        
        .cta {
            background: linear-gradient(135deg, var(--primary-color), #3b82f6);
            color: white;
            padding: 2rem;
            border-radius: 1rem;
            text-align: center;
            margin: 3rem 0;
        }
        
        .cta h3 {
            margin-bottom: 1rem;
        }
        
        .cta p {
            margin-bottom: 1.5rem;
        }
        
        .btn {
            display: inline-block;
            background: rgba(255, 255, 255, 0.2);
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s ease;
        }
        
        .btn:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-2px);
        }
        
        @media (max-width: 768px) {
            .container {
                padding: 1rem;
            }
            
            .header h1 {
                font-size: 2rem;
            }
            
            .content {
                font-size: 1rem;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header class="header">
            <h1>${title}</h1>
            <div class="meta">
                By ${author} • ${new Date(publishDate).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                })}
            </div>
            ${tags.length > 0 ? `
            <div class="tags">
                ${tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            ` : ''}
        </header>
        
        <main class="content">
            ${this.formatContent(content)}
        </main>
        
        <div class="cta">
            <h3>🤖 Generated by AI Agents</h3>
            <p>This content was automatically created, optimized, and published by our intelligent blog network system.</p>
            <a href="#" class="btn">Learn More About AI Automation</a>
        </div>
        
        <footer class="footer">
            <p>© ${new Date().getFullYear()} AI Blog Network - Powered by Dark Forest</p>
            <p>This post was generated automatically using advanced AI agents</p>
        </footer>
    </div>
    
    <script>
        // Simple analytics and interactions
        console.log('📊 Post viewed:', '${title}');
        
        // Smooth scrolling for internal links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
        
        // Reading progress indicator
        const createProgressBar = () => {
            const progressBar = document.createElement('div');
            progressBar.style.cssText = \`
                position: fixed;
                top: 0;
                left: 0;
                width: 0%;
                height: 3px;
                background: var(--primary-color);
                z-index: 1000;
                transition: width 0.3s ease;
            \`;
            document.body.appendChild(progressBar);
            
            window.addEventListener('scroll', () => {
                const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
                progressBar.style.width = Math.min(scrollPercent, 100) + '%';
            });
        };
        
        createProgressBar();
    </script>
</body>
</html>`;

    const fileName = slug ? `${slug}.html` : `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.html`;
    const filePath = path.join(this.outputDir, fileName);
    
    fs.writeFileSync(filePath, html, 'utf8');
    
    return {
      success: true,
      filePath: filePath,
      url: `/${fileName}`,
      fileName: fileName
    };
  }

  /**
   * Format content from markdown-like syntax to HTML
   */
  formatContent(content) {
    if (!content) return '';
    
    return content
      // Headers
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      
      // Bold and italic
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2">$1</a>')
      
      // Code blocks
      .replace(/```([^`]+)```/gim, '<pre><code>$1</code></pre>')
      .replace(/`([^`]+)`/gim, '<code>$1</code>')
      
      // Lists
      .replace(/^\d+\.\s(.*)$/gim, '<li>$1</li>')
      .replace(/^[-*]\s(.*)$/gim, '<li>$1</li>')
      
      // Paragraphs
      .split('\n\n')
      .map(paragraph => {
        paragraph = paragraph.trim();
        if (!paragraph) return '';
        if (paragraph.startsWith('<h') || paragraph.startsWith('<li') || paragraph.startsWith('<pre')) {
          return paragraph;
        }
        return `<p>${paragraph.replace(/\n/g, '<br>')}</p>`;
      })
      .join('\n');
  }

  /**
   * Generate an index page listing all posts
   */
  generateIndex(posts = []) {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Blog Network - Autonomous Content Generation</title>
    <meta name="description" content="Fully automated blog network powered by AI agents. Fresh content generated 24/7.">
    <style>
        /* Same CSS as above but adapted for index page */
        :root {
            --primary-color: #2563eb;
            --secondary-color: #64748b;
            --text-color: #1e293b;
            --bg-color: #ffffff;
            --border-color: #e2e8f0;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: var(--text-color);
            background-color: var(--bg-color);
        }
        
        .container {
            max-width: 1000px;
            margin: 0 auto;
            padding: 2rem;
        }
        
        .hero {
            text-align: center;
            padding: 4rem 0;
            background: linear-gradient(135deg, var(--primary-color), #3b82f6);
            color: white;
            margin: -2rem -2rem 3rem -2rem;
            border-radius: 0 0 2rem 2rem;
        }
        
        .hero h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
        }
        
        .hero p {
            font-size: 1.2rem;
            opacity: 0.9;
        }
        
        .posts-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 2rem;
            margin-top: 3rem;
        }
        
        .post-card {
            background: white;
            border: 1px solid var(--border-color);
            border-radius: 1rem;
            padding: 1.5rem;
            transition: all 0.3s ease;
            text-decoration: none;
            color: inherit;
        }
        
        .post-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 10px 25px rgba(37, 99, 235, 0.1);
        }
        
        .post-card h3 {
            font-size: 1.25rem;
            margin-bottom: 0.5rem;
            color: var(--primary-color);
        }
        
        .post-card p {
            color: var(--secondary-color);
            margin-bottom: 1rem;
        }
        
        .post-meta {
            font-size: 0.875rem;
            color: var(--secondary-color);
        }
        
        @media (max-width: 768px) {
            .hero h1 {
                font-size: 2rem;
            }
            
            .posts-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="hero">
            <h1>🤖 AI Blog Network</h1>
            <p>Fully Autonomous Content Generation • 24/7 Publishing • AI-Powered SEO</p>
        </div>
        
        <main>
            ${posts.length > 0 ? `
            <h2>Latest AI-Generated Posts</h2>
            <div class="posts-grid">
                ${posts.map(post => `
                <a href="${post.url}" class="post-card">
                    <h3>${post.title}</h3>
                    <p>${post.excerpt || 'AI-generated content exploring the latest trends and insights.'}</p>
                    <div class="post-meta">
                        ${new Date(post.publishDate).toLocaleDateString()} • ${post.author || 'AI Agent'}
                    </div>
                </a>
                `).join('')}
            </div>
            ` : `
            <div style="text-align: center; padding: 3rem;">
                <h2>🚀 Blog Network Initializing...</h2>
                <p>AI agents are generating fresh content. Check back soon!</p>
            </div>
            `}
        </main>
    </div>
</body>
</html>`;

    const filePath = path.join(this.outputDir, 'index.html');
    fs.writeFileSync(filePath, html, 'utf8');
    
    return {
      success: true,
      filePath: filePath,
      postsCount: posts.length
    };
  }
}

module.exports = SimpleBlogGenerator;

// Example usage if run directly
if (require.main === module) {
  const generator = new SimpleBlogGenerator('./test-output');
  
  // Test post
  const testPost = {
    title: 'The Future of AI Automation in Business',
    content: `# Introduction

Artificial intelligence is transforming how businesses operate across every industry.

## Key Benefits

* **Increased Efficiency**: AI automates repetitive tasks
* **Better Decision Making**: Data-driven insights
* **Cost Reduction**: Streamlined operations

## Implementation Strategy

1. Start with simple automation
2. Scale gradually
3. Monitor and optimize

The future belongs to companies that embrace AI automation today.`,
    author: 'Strategy AI Agent',
    tags: ['AI', 'Business', 'Automation'],
    seoDescription: 'Discover how AI automation is revolutionizing business operations and learn implementation strategies for success.'
  };
  
  const result = generator.generatePost(testPost);
  console.log('Generated test post:', result);
  
  const indexResult = generator.generateIndex([{
    title: testPost.title,
    url: result.url,
    publishDate: new Date(),
    author: testPost.author,
    excerpt: 'AI automation is transforming business operations...'
  }]);
  console.log('Generated index:', indexResult);
}