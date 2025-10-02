const fs = require('fs');
const path = require('path');
const BlogNetworkConfig = require('../config/BlogNetworkConfig');

/**
 * Professional Blog Generator with Theme Support
 * Creates high-quality, branded HTML blogs with monetization
 */
class ProfessionalBlogGenerator {
  constructor(configPath = null) {
    this.config = new BlogNetworkConfig(configPath);
  }

  /**
   * Generate complete themed blog post
   */
  generateThemedPost(blogId, postData) {
    const blog = this.config.getBlog(blogId);
    if (!blog) {
      throw new Error(`Blog ${blogId} not found`);
    }

    const theme = blog.theme;
    const monetization = this.config.getBlogMonetization(blogId);
    const {title, content, author = 'AI Content Team', publishDate = new Date(), tags = [], seoDescription, readingTime = '5 min'} = postData;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} | ${blog.name}</title>
    <meta name="description" content="${seoDescription || title}">
    <meta name="keywords" content="${tags.join(', ')}">
    <meta name="author" content="${author}">
    
    <!-- Open Graph / Social Media -->
    <meta property="og:type" content="article">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${seoDescription || title}">
    <meta property="og:site_name" content="${blog.name}">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${seoDescription || title}">
    
    <!-- Schema.org markup -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": "${title}",
      "description": "${seoDescription || title}",
      "author": {
        "@type": "Person",
        "name": "${author}"
      },
      "datePublished": "${publishDate.toISOString()}",
      "publisher": {
        "@type": "Organization",
        "name": "${blog.name}"
      }
    }
    </script>
    
    ${this.getAnalyticsCode(monetization)}
    ${this.getAdSenseCode(monetization)}
    
    <style>
        ${this.generateThemeCSS(theme, blog)}
    </style>
</head>
<body>
    ${this.generateHeader(blog, theme)}
    
    <main class="main-content">
        <div class="container">
            <article class="post">
                <header class="post-header">
                    <div class="post-meta">
                        <span class="post-date">${this.formatDate(publishDate)}</span>
                        <span class="post-reading-time">📖 ${readingTime} read</span>
                    </div>
                    
                    <h1 class="post-title">${title}</h1>
                    
                    ${tags.length > 0 ? `
                    <div class="post-tags">
                        ${tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    ` : ''}
                </header>
                
                ${monetization.googleAdsense?.enabled ? this.generateAdSlot('header', monetization) : ''}
                
                <div class="post-content">
                    ${this.formatContent(content)}
                </div>
                
                ${this.generateAffiliateSection(blogId, postData, monetization)}
                
                ${monetization.googleAdsense?.enabled ? this.generateAdSlot('footer', monetization) : ''}
                
                <footer class="post-footer">
                    <div class="author-info">
                        <div class="author-details">
                            <strong>${author}</strong>
                            <p>Expert content writer at ${blog.name}</p>
                        </div>
                    </div>
                    
                    ${this.generateSocialShare(title, blog)}
                    
                    ${monetization.affiliateLinks?.enabled ? `
                    <div class="disclosure">
                        <small>${monetization.affiliateLinks.defaultDisclosure}</small>
                    </div>
                    ` : ''}
                </footer>
            </article>
            
            ${theme.layout.sidebar ? this.generateSidebar(blog, monetization) : ''}
        </div>
    </main>
    
    ${this.generateFooter(blog)}
    
    <script>
        ${this.generateJavaScript(blog, monetization)}
    </script>
</body>
</html>`;

    return html;
  }

  /**
   * Generate theme-specific CSS
   */
  generateThemeCSS(theme, blog) {
    return `
        :root {
            --primary-color: ${theme.colors.primary};
            --secondary-color: ${theme.colors.secondary};
            --accent-color: ${theme.colors.accent};
            --bg-color: ${theme.colors.background};
            --text-color: ${theme.colors.text};
            --font-heading: ${theme.fonts.heading};
            --font-body: ${theme.fonts.body};
            --font-code: ${theme.fonts.code};
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: var(--font-body);
            line-height: 1.7;
            color: var(--text-color);
            background-color: var(--bg-color);
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
            display: grid;
            grid-template-columns: ${theme.layout.sidebar ? '1fr 300px' : '1fr'};
            gap: 3rem;
        }
        
        /* Header Styles */
        .site-header {
            background: ${theme.headerStyle === 'bold' ? 'linear-gradient(135deg, var(--primary-color), var(--accent-color))' : 'var(--bg-color)'};
            padding: 1.5rem 0;
            border-bottom: ${theme.headerStyle === 'minimal' ? '1px solid #e5e7eb' : 'none'};
            box-shadow: ${theme.headerStyle === 'tech' ? '0 2px 10px rgba(0,0,0,0.1)' : 'none'};
        }
        
        .site-header .container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            grid-template-columns: 1fr;
        }
        
        .site-logo {
            font-size: 1.5rem;
            font-weight: 700;
            font-family: var(--font-heading);
            color: ${theme.headerStyle === 'bold' ? '#ffffff' : 'var(--primary-color)'};
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .site-nav {
            display: flex;
            gap: 2rem;
        }
        
        .site-nav a {
            color: ${theme.headerStyle === 'bold' ? 'rgba(255,255,255,0.9)' : 'var(--text-color)'};
            text-decoration: none;
            font-weight: 500;
            transition: all 0.3s ease;
        }
        
        .site-nav a:hover {
            color: ${theme.headerStyle === 'bold' ? '#ffffff' : 'var(--primary-color)'};
        }
        
        /* Main Content */
        .main-content {
            padding: 3rem 0;
        }
        
        .post {
            background: ${theme.colors.background === '#111827' ? '#1f2937' : '#ffffff'};
            padding: ${theme.layout.sidebar ? '2rem' : '3rem'};
            border-radius: 1rem;
            box-shadow: ${theme.colors.background === '#111827' ? 'none' : '0 1px 3px rgba(0,0,0,0.1)'};
        }
        
        .post-header {
            margin-bottom: 2.5rem;
            padding-bottom: 2rem;
            border-bottom: 2px solid ${theme.colors.primary};
        }
        
        .post-meta {
            display: flex;
            gap: 1.5rem;
            margin-bottom: 1rem;
            font-size: 0.9rem;
            color: var(--secondary-color);
        }
        
        .post-title {
            font-family: var(--font-heading);
            font-size: 2.5rem;
            font-weight: 800;
            color: var(--text-color);
            line-height: 1.2;
            margin-bottom: 1rem;
        }
        
        .post-tags {
            display: flex;
            gap: 0.5rem;
            flex-wrap: wrap;
            margin-top: 1rem;
        }
        
        .tag {
            background: var(--primary-color);
            color: white;
            padding: 0.35rem 0.9rem;
            border-radius: 2rem;
            font-size: 0.85rem;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.3s ease;
        }
        
        .tag:hover {
            background: var(--accent-color);
            transform: translateY(-2px);
        }
        
        /* Content Typography */
        .post-content {
            font-size: 1.1rem;
            line-height: 1.8;
        }
        
        .post-content h2 {
            font-family: var(--font-heading);
            font-size: 2rem;
            font-weight: 700;
            color: var(--primary-color);
            margin: 2.5rem 0 1.25rem 0;
            line-height: 1.3;
        }
        
        .post-content h3 {
            font-family: var(--font-heading);
            font-size: 1.5rem;
            font-weight: 600;
            color: var(--text-color);
            margin: 2rem 0 1rem 0;
        }
        
        .post-content p {
            margin-bottom: 1.5rem;
        }
        
        .post-content ul, .post-content ol {
            margin: 1.5rem 0 1.5rem 2rem;
        }
        
        .post-content li {
            margin-bottom: 0.75rem;
        }
        
        .post-content strong {
            color: var(--primary-color);
            font-weight: 700;
        }
        
        .post-content em {
            font-style: italic;
        }
        
        .post-content a {
            color: var(--primary-color);
            text-decoration: underline;
            transition: all 0.3s ease;
        }
        
        .post-content a:hover {
            color: var(--accent-color);
        }
        
        .post-content code {
            background: ${theme.colors.background === '#111827' ? '#374151' : '#f3f4f6'};
            padding: 0.2rem 0.5rem;
            border-radius: 0.3rem;
            font-family: var(--font-code);
            font-size: 0.9em;
            color: ${theme.colors.background === '#111827' ? '#e5e7eb' : '#1f2937'};
        }
        
        .post-content pre {
            background: ${theme.colors.background === '#111827' ? '#1f2937' : '#1e293b'};
            color: #e5e7eb;
            padding: 1.5rem;
            border-radius: 0.75rem;
            overflow-x: auto;
            margin: 2rem 0;
            line-height: 1.6;
        }
        
        .post-content pre code {
            background: none;
            padding: 0;
            color: inherit;
        }
        
        .post-content blockquote {
            border-left: 4px solid var(--primary-color);
            padding-left: 1.5rem;
            margin: 2rem 0;
            font-style: italic;
            color: var(--secondary-color);
        }
        
        /* Affiliate Product Section */
        .affiliate-products {
            background: linear-gradient(135deg, rgba(37, 99, 235, 0.05), rgba(59, 130, 246, 0.05));
            border: 2px solid var(--primary-color);
            border-radius: 1rem;
            padding: 2rem;
            margin: 3rem 0;
        }
        
        .affiliate-products h3 {
            color: var(--primary-color);
            margin-bottom: 1.5rem;
        }
        
        .product-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin-top: 1.5rem;
        }
        
        .product-card {
            background: var(--bg-color);
            padding: 1.5rem;
            border-radius: 0.75rem;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
        }
        
        .product-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 4px 16px rgba(37, 99, 235, 0.2);
        }
        
        .product-card h4 {
            color: var(--text-color);
            margin-bottom: 0.5rem;
        }
        
        .product-card .price {
            color: var(--primary-color);
            font-size: 1.5rem;
            font-weight: 700;
            margin: 0.5rem 0;
        }
        
        .product-card .cta-button {
            display: inline-block;
            background: var(--primary-color);
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            text-decoration: none;
            font-weight: 600;
            margin-top: 1rem;
            transition: all 0.3s ease;
        }
        
        .product-card .cta-button:hover {
            background: var(--accent-color);
            transform: scale(1.05);
        }
        
        /* Post Footer */
        .post-footer {
            margin-top: 3rem;
            padding-top: 2rem;
            border-top: 2px solid #e5e7eb;
        }
        
        .author-info {
            display: flex;
            align-items: center;
            gap: 1.5rem;
            margin-bottom: 2rem;
        }
        
        .social-share {
            display: flex;
            gap: 1rem;
            margin: 2rem 0;
        }
        
        .social-button {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem 1.25rem;
            background: var(--primary-color);
            color: white;
            text-decoration: none;
            border-radius: 0.5rem;
            font-weight: 600;
            transition: all 0.3s ease;
        }
        
        .social-button:hover {
            background: var(--accent-color);
            transform: translateY(-2px);
        }
        
        .disclosure {
            background: #f9fafb;
            padding: 1rem;
            border-radius: 0.5rem;
            margin-top: 2rem;
            font-size: 0.9rem;
            color: var(--secondary-color);
        }
        
        /* Sidebar */
        .sidebar {
            position: sticky;
            top: 2rem;
            height: fit-content;
        }
        
        .sidebar-widget {
            background: ${theme.colors.background === '#111827' ? '#1f2937' : '#f9fafb'};
            padding: 1.5rem;
            border-radius: 0.75rem;
            margin-bottom: 1.5rem;
        }
        
        .sidebar-widget h3 {
            font-size: 1.25rem;
            margin-bottom: 1rem;
            color: var(--primary-color);
        }
        
        /* Site Footer */
        .site-footer {
            background: ${theme.footerStyle === 'detailed' ? '#1e293b' : '#f9fafb'};
            color: ${theme.footerStyle === 'detailed' ? '#e5e7eb' : 'var(--text-color)'};
            padding: 3rem 0 2rem 0;
            margin-top: 4rem;
        }
        
        .footer-content {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
            margin-bottom: 2rem;
        }
        
        .footer-bottom {
            text-align: center;
            padding-top: 2rem;
            border-top: 1px solid ${theme.footerStyle === 'detailed' ? '#374151' : '#e5e7eb'};
            font-size: 0.9rem;
        }
        
        /* Responsive */
        @media (max-width: 768px) {
            .container {
                grid-template-columns: 1fr;
                padding: 0 1rem;
            }
            
            .post {
                padding: 1.5rem;
            }
            
            .post-title {
                font-size: 2rem;
            }
            
            .post-content {
                font-size: 1rem;
            }
            
            .site-nav {
                display: none;
            }
            
            .sidebar {
                position: static;
            }
        }
        
        /* Reading Progress Bar */
        .reading-progress {
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 4px;
            background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
            z-index: 1000;
            transition: width 0.2s ease;
        }
        
        /* Ad Slots */
        .ad-slot {
            margin: 2rem 0;
            padding: 1rem;
            background: #f9fafb;
            border: 1px dashed #d1d5db;
            border-radius: 0.5rem;
            text-align: center;
            min-height: 250px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    `;
  }

  /**
   * Generate header HTML
   */
  generateHeader(blog, theme) {
    return `
    <header class="site-header">
        <div class="container">
            <a href="/" class="site-logo">
                <span class="logo-icon">${theme.logo.icon}</span>
                ${theme.logo.content}
            </a>
            <nav class="site-nav">
                <a href="/">Home</a>
                <a href="/about.html">About</a>
                <a href="/topics.html">Topics</a>
                <a href="/contact.html">Contact</a>
            </nav>
        </div>
    </header>
    <div class="reading-progress"></div>
    `;
  }

  /**
   * Generate sidebar
   */
  generateSidebar(blog, monetization) {
    return `
    <aside class="sidebar">
        ${monetization.googleAdsense?.enabled ? `
        <div class="sidebar-widget">
            <h3>Sponsored</h3>
            ${this.generateAdSlot('sidebar', monetization)}
        </div>
        ` : ''}
        
        <div class="sidebar-widget">
            <h3>About ${blog.name}</h3>
            <p>${blog.tagline}</p>
        </div>
        
        <div class="sidebar-widget">
            <h3>Popular Topics</h3>
            <div class="topic-list">
                ${blog.contentStrategy.keyTopics.slice(0, 5).map(topic => 
                    `<a href="/topic/${topic.toLowerCase().replace(/\s+/g, '-')}.html" class="topic-link">${topic}</a>`
                ).join('')}
            </div>
        </div>
    </aside>
    `;
  }

  /**
   * Generate footer HTML
   */
  generateFooter(blog) {
    return `
    <footer class="site-footer">
        <div class="container">
            <div class="footer-content">
                <div>
                    <h3>${blog.name}</h3>
                    <p>${blog.tagline}</p>
                </div>
                <div>
                    <h4>Topics</h4>
                    <ul>
                        ${blog.contentStrategy.keyTopics.slice(0, 5).map(topic => 
                            `<li><a href="#">${topic}</a></li>`
                        ).join('')}
                    </ul>
                </div>
                <div>
                    <h4>Connect</h4>
                    <ul>
                        <li><a href="#">Twitter</a></li>
                        <li><a href="#">LinkedIn</a></li>
                        <li><a href="#">RSS Feed</a></li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; ${new Date().getFullYear()} ${blog.name}. All rights reserved.</p>
                <p>Powered by AI Content Generation</p>
            </div>
        </div>
    </footer>
    `;
  }

  /**
   * Generate affiliate product section
   */
  generateAffiliateSection(blogId, postData, monetization) {
    if (!monetization.affiliateEnabled) return '';

    const blog = this.config.getBlog(blogId);
    const products = blog.monetization.productCategories.slice(0, 3);

    return `
    <div class="affiliate-products">
        <h3>🎯 Recommended Tools & Resources</h3>
        <p>Based on this article, here are our top recommendations:</p>
        <div class="product-grid">
            ${products.map((category, index) => `
            <div class="product-card">
                <h4>${this.getCategoryTitle(category)}</h4>
                <p>${this.getCategoryDescription(category)}</p>
                <div class="price">View Deals →</div>
                <a href="#" class="cta-button" rel="nofollow sponsored">Check It Out</a>
            </div>
            `).join('')}
        </div>
    </div>
    `;
  }

  getCategoryTitle(category) {
    const titles = {
      'AI software': 'AI Platform Suite',
      'business tools': 'Business Productivity Tools',
      'online courses': 'Expert-Led Courses',
      'productivity tools': 'Productivity Software',
      'marketing software': 'Marketing Automation Platform',
      'security software': 'Enterprise Security Suite',
      'VPN services': 'Premium VPN Service'
    };
    return titles[category] || category;
  }

  getCategoryDescription(category) {
    const descriptions = {
      'AI software': 'Powerful AI tools to automate your workflow',
      'business tools': 'Essential software for modern businesses',
      'online courses': 'Learn from industry experts',
      'productivity tools': 'Boost your team productivity',
      'marketing software': 'Automate and scale your marketing',
      'security software': 'Protect your business from threats',
      'VPN services': 'Secure and private internet access'
    };
    return descriptions[category] || 'Top-rated solution for your needs';
  }

  /**
   * Generate social sharing buttons
   */
  generateSocialShare(title, blog) {
    const encodedTitle = encodeURIComponent(title);
    const encodedUrl = encodeURIComponent(`https://${blog.domain}`);

    return `
    <div class="social-share">
        <strong>Share this article:</strong>
        <a href="https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}" 
           class="social-button" target="_blank" rel="noopener">
            🐦 Twitter
        </a>
        <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}" 
           class="social-button" target="_blank" rel="noopener">
            💼 LinkedIn
        </a>
        <a href="https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}" 
           class="social-button" target="_blank" rel="noopener">
            📘 Facebook
        </a>
    </div>
    `;
  }

  /**
   * Generate Google Analytics code
   */
  getAnalyticsCode(monetization) {
    const gaId = this.config.config.network.analytics.googleAnalyticsId;
    if (!gaId || gaId === 'G-XXXXXXXXXX') return '';

    return `
    <!-- Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=${gaId}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${gaId}');
    </script>
    `;
  }

  /**
   * Generate Google AdSense code
   */
  getAdSenseCode(monetization) {
    if (!monetization.googleAdsense?.enabled) return '';
    
    const publisherId = monetization.googleAdsense.publisherId;
    if (publisherId === 'ca-pub-XXXXXXXXXXXXXXXX') return '';

    return `
    <!-- Google AdSense -->
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}"
         crossorigin="anonymous"></script>
    `;
  }

  /**
   * Generate ad slot placeholder
   */
  generateAdSlot(position, monetization) {
    if (!monetization.googleAdsense?.enabled) return '';

    return `
    <div class="ad-slot">
        <ins class="adsbygoogle"
             style="display:block"
             data-ad-client="${monetization.googleAdsense.publisherId}"
             data-ad-slot="${monetization.googleAdsense.adSlots[position] || '0000000000'}"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
        <script>
             (adsbygoogle = window.adsbygoogle || []).push({});
        </script>
    </div>
    `;
  }

  /**
   * Format content from markdown to HTML
   */
  formatContent(content) {
    if (!content) return '';
    
    return content
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h2>$1</h2>') // Convert h1 to h2 in body
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener">$1</a>')
      .replace(/```([^`]+)```/gim, '<pre><code>$1</code></pre>')
      .replace(/`([^`]+)`/gim, '<code>$1</code>')
      .split('\n\n')
      .map(paragraph => {
        paragraph = paragraph.trim();
        if (!paragraph) return '';
        if (paragraph.startsWith('<h') || paragraph.startsWith('<pre') || paragraph.startsWith('<ul') || paragraph.startsWith('<ol')) {
          return paragraph;
        }
        if (paragraph.match(/^[-*]\s/)) {
          const items = paragraph.split('\n').map(line => line.replace(/^[-*]\s/, '')).filter(Boolean);
          return '<ul>' + items.map(item => `<li>${item}</li>`).join('') + '</ul>';
        }
        if (paragraph.match(/^\d+\.\s/)) {
          const items = paragraph.split('\n').map(line => line.replace(/^\d+\.\s/, '')).filter(Boolean);
          return '<ol>' + items.map(item => `<li>${item}</li>`).join('') + '</ol>';
        }
        return `<p>${paragraph.replace(/\n/g, '<br>')}</p>`;
      })
      .join('\n');
  }

  /**
   * Generate JavaScript for interactions
   */
  generateJavaScript(blog, monetization) {
    return `
        // Reading progress bar
        window.addEventListener('scroll', () => {
            const progressBar = document.querySelector('.reading-progress');
            const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
            progressBar.style.width = Math.min(scrollPercent, 100) + '%';
        });

        // Track article engagement
        console.log('📊 Article viewed:', document.title);
        
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });

        // External link tracking
        document.querySelectorAll('a[href^="http"]').forEach(link => {
            link.addEventListener('click', function() {
                console.log('External link clicked:', this.href);
            });
        });
    `;
  }

  /**
   * Format date for display
   */
  formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /**
   * Save generated blog post
   */
  savePost(blogId, html, postData) {
    const blog = this.config.getBlog(blogId);
    const outputDir = path.join(__dirname, '../output', blog.id);
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const slug = postData.slug || postData.title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    const fileName = `${slug}.html`;
    const filePath = path.join(outputDir, fileName);
    
    fs.writeFileSync(filePath, html, 'utf8');
    
    return {
      success: true,
      filePath,
      fileName,
      url: `/${fileName}`,
      blogId: blog.id,
      blogName: blog.name
    };
  }
}

module.exports = ProfessionalBlogGenerator;

// Test if run directly
if (require.main === module) {
  const generator = new ProfessionalBlogGenerator();
  
  // Generate sample post for first blog
  const blog = generator.config.getAllBlogs()[0];
  console.log(`\n🎨 Generating themed post for: ${blog.name}`);
  
  const testPost = {
    title: 'How AI is Revolutionizing Business Operations in 2025',
    content: `# Introduction

Artificial intelligence has moved beyond the realm of science fiction and into the everyday operations of businesses worldwide. In 2025, AI isn't just a competitive advantage—it's becoming a necessity for survival.

## The Current State of AI in Business

Recent studies show that **87% of businesses** have either adopted or are planning to adopt AI technologies within the next 18 months. This rapid adoption is driven by:

* **Cost Reduction**: AI automates repetitive tasks, reducing operational costs by 25-40%
* **Improved Decision Making**: Data-driven insights lead to better strategic choices
* **Enhanced Customer Experience**: 24/7 AI-powered support and personalization
* **Competitive Advantage**: Early adopters see 2-3x growth compared to laggards

## Real-World Success Stories

### Manufacturing Excellence
A mid-sized manufacturer implemented AI-powered predictive maintenance, resulting in:
- 35% reduction in downtime
- $2.4M annual savings
- 50% improvement in equipment lifespan

### Customer Service Revolution
An e-commerce company deployed AI chatbots and saw:
- 73% of queries resolved without human intervention
- Customer satisfaction scores increase from 3.2 to 4.7 out of 5
- Support costs decrease by 60%

## Implementation Strategy

### Phase 1: Assessment (Weeks 1-2)
1. Identify high-impact use cases
2. Evaluate current infrastructure
3. Set measurable KPIs
4. Allocate budget and resources

### Phase 2: Pilot Program (Months 1-3)
1. Start with one department or process
2. Choose user-friendly, proven solutions
3. Train team members thoroughly
4. Monitor results closely

### Phase 3: Scale and Optimize (Months 4-12)
1. Expand successful implementations
2. Integrate systems across departments
3. Continuously improve based on data
4. Build internal AI expertise

## Key Takeaways

The businesses thriving in 2025 share common traits:
- They started their AI journey early
- They focused on solving real business problems, not chasing trends
- They invested in people as much as technology
- They measured and optimized continuously

## Conclusion

AI isn't coming—it's here. The question isn't whether your business should adopt AI, but how quickly you can implement it effectively. Start small, measure results, and scale what works.

The future belongs to businesses that embrace AI today.`,
    author: 'AI Strategy Team',
    tags: ['AI', 'Business Strategy', 'Digital Transformation', 'Automation'],
    seoDescription: 'Discover how AI is revolutionizing business operations in 2025. Learn implementation strategies, real-world success stories, and key takeaways for your business.',
    readingTime: '8 min'
  };

  const html = generator.generateThemedPost(blog.id, testPost);
  const result = generator.savePost(blog.id, html, testPost);
  
  console.log('\n✅ Generated:', result.fileName);
  console.log('📁 Location:', result.filePath);
  console.log('🌐 URL:', result.url);
  console.log(`\n🎉 Open the file to see the professional themed blog post!`);
}