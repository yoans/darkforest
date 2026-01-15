#!/usr/bin/env node

/**
 * Generate index.html for each blog in the deploy directory
 * Creates a listing page with all articles for each blog
 */

const fs = require('fs');
const path = require('path');

const DEPLOY_DIR = path.join(__dirname, '../deploy');
const CONFIG_PATH = path.join(process.cwd(), 'config/blog-network-config.json');

// Load blog configuration
let blogConfig = { blogs: [] };
try {
  if (fs.existsSync(CONFIG_PATH)) {
    blogConfig = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
    console.log('✓ Loaded blog configuration');
  } else {
    console.warn('⚠️  Config not found at:', CONFIG_PATH);
  }
} catch (e) {
  console.warn('⚠️  Could not load blog config:', e.message);
}

// Get blog metadata by ID
function getBlogMeta(blogId) {
  const blog = blogConfig.blogs?.find(b => b.id === blogId);
  return blog || {
    name: blogId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    tagline: 'AI-Generated Content',
    theme: { colors: { primary: '#2563eb' } }
  };
}

// Extract title from HTML file
function extractTitle(htmlPath) {
  try {
    const content = fs.readFileSync(htmlPath, 'utf8');
    const titleMatch = content.match(/<title>([^|<]+)/);
    if (titleMatch) {
      return titleMatch[1].trim();
    }
    const h1Match = content.match(/<h1[^>]*>([^<]+)/);
    if (h1Match) {
      return h1Match[1].trim();
    }
  } catch (e) {}
  
  // Fallback: convert filename to title
  const filename = path.basename(htmlPath, '.html');
  return filename.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

// Extract description from HTML file
function extractDescription(htmlPath) {
  try {
    const content = fs.readFileSync(htmlPath, 'utf8');
    const descMatch = content.match(/<meta\s+name="description"\s+content="([^"]+)"/);
    if (descMatch) {
      return descMatch[1];
    }
  } catch (e) {}
  return 'Read this article for valuable insights and actionable strategies.';
}

// Generate index HTML for a blog
function generateBlogIndex(blogId, articles) {
  const meta = getBlogMeta(blogId);
  const primaryColor = meta.theme?.colors?.primary || '#2563eb';
  
  const articleListHTML = articles.map(article => `
                <article class="article-card">
                    <h2><a href="${article.filename}">${article.title}</a></h2>
                    <p>${article.description}</p>
                    <a href="${article.filename}" class="read-more">Read Article →</a>
                </article>
  `).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${meta.name} | Dark Forest Blog Network</title>
    <meta name="description" content="${meta.tagline} - Part of the Dark Forest autonomous blog network.">
    <meta property="og:title" content="${meta.name}">
    <meta property="og:description" content="${meta.tagline}">
    <meta property="og:type" content="website">
    <link rel="canonical" href="https://darkforest.sagaciasoft.com/${blogId}/">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #1f2937;
            background: #f9fafb;
        }
        
        .header {
            background: linear-gradient(135deg, ${primaryColor}, ${primaryColor}dd);
            color: white;
            padding: 3rem 2rem;
            text-align: center;
        }
        
        .header h1 {
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
        }
        
        .header .tagline {
            opacity: 0.9;
            font-size: 1.1rem;
        }
        
        .header .back-link {
            display: inline-block;
            margin-top: 1rem;
            color: white;
            opacity: 0.8;
            text-decoration: none;
        }
        
        .header .back-link:hover {
            opacity: 1;
        }
        
        .container {
            max-width: 900px;
            margin: 0 auto;
            padding: 2rem;
        }
        
        .article-count {
            text-align: center;
            color: #6b7280;
            margin-bottom: 2rem;
        }
        
        .articles-grid {
            display: grid;
            gap: 1.5rem;
        }
        
        .article-card {
            background: white;
            padding: 1.5rem;
            border-radius: 0.75rem;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .article-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        
        .article-card h2 {
            font-size: 1.25rem;
            margin-bottom: 0.5rem;
        }
        
        .article-card h2 a {
            color: ${primaryColor};
            text-decoration: none;
        }
        
        .article-card h2 a:hover {
            text-decoration: underline;
        }
        
        .article-card p {
            color: #6b7280;
            font-size: 0.95rem;
            margin-bottom: 1rem;
        }
        
        .read-more {
            color: ${primaryColor};
            text-decoration: none;
            font-weight: 500;
        }
        
        .read-more:hover {
            text-decoration: underline;
        }
        
        .footer {
            text-align: center;
            padding: 2rem;
            color: #6b7280;
            font-size: 0.9rem;
        }
        
        .footer a {
            color: ${primaryColor};
        }
    </style>
</head>
<body>
    <header class="header">
        <h1>${meta.name}</h1>
        <p class="tagline">${meta.tagline}</p>
        <a href="/" class="back-link">← Back to Dark Forest Network</a>
    </header>
    
    <main class="container">
        <p class="article-count">${articles.length} article${articles.length !== 1 ? 's' : ''} published</p>
        
        <div class="articles-grid">
            ${articleListHTML}
        </div>
    </main>
    
    <footer class="footer">
        <p>Part of the <a href="/">Dark Forest Blog Network</a></p>
        <p>Autonomous AI-powered content generation</p>
    </footer>
</body>
</html>`;
}

// Main execution
console.log('📑 Generating blog index pages...');

// Find all blog directories in deploy
const entries = fs.readdirSync(DEPLOY_DIR, { withFileTypes: true });
const blogDirs = entries.filter(e => e.isDirectory() && !e.name.startsWith('.'));

let totalIndexes = 0;

for (const dir of blogDirs) {
  const blogId = dir.name;
  const blogPath = path.join(DEPLOY_DIR, blogId);
  
  // Find all HTML files (except index.html)
  const files = fs.readdirSync(blogPath).filter(f => 
    f.endsWith('.html') && f !== 'index.html'
  );
  
  if (files.length === 0) {
    console.log(`  ⚠️  ${blogId}: No articles found, skipping`);
    continue;
  }
  
  // Extract article metadata
  const articles = files.map(filename => {
    const filepath = path.join(blogPath, filename);
    return {
      filename,
      title: extractTitle(filepath),
      description: extractDescription(filepath)
    };
  });
  
  // Generate and save index.html
  const indexHTML = generateBlogIndex(blogId, articles);
  const indexPath = path.join(blogPath, 'index.html');
  fs.writeFileSync(indexPath, indexHTML);
  
  console.log(`  ✓ ${blogId}/index.html (${articles.length} articles)`);
  totalIndexes++;
}

console.log(`\n✅ Generated ${totalIndexes} blog index pages`);
