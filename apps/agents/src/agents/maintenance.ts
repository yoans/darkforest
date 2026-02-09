import { Agent, AgentTask, AgentResult } from '../types/base';
import * as fs from 'fs';
import * as path from 'path';

export class MaintenanceAgent extends Agent {
  id = 'maintenance-001';
  name = 'Maintenance Agent';
  type = 'MAINTENANCE';
  version = '1.0.0';

  constructor() {
    super();
  }

  async execute(task: AgentTask): Promise<AgentResult> {
    try {
      switch (task.type) {
        case 'MAINTENANCE':
        case 'HEALTH_CHECK':
          return await this.healthCheck(task);
        case 'GENERATE_SITEMAP':
          return await this.generateSitemap(task);
        case 'GENERATE_RSS':
          return await this.generateRSSFeed(task);
        case 'BROKEN_LINK_CHECK':
          return await this.checkBrokenLinks(task);
        case 'CLEANUP':
          return await this.cleanup(task);
        case 'GENERATE_ROBOTS_TXT':
          return await this.generateRobotsTxt(task);
        default:
          return this.createErrorResult(`Unsupported task type: ${task.type}`);
      }
    } catch (error) {
      return this.createErrorResult(`Maintenance agent error: ${error}`);
    }
  }

  getCapabilities(): string[] {
    return [
      'MAINTENANCE',
      'HEALTH_CHECK',
      'GENERATE_SITEMAP',
      'GENERATE_RSS',
      'BROKEN_LINK_CHECK',
      'CLEANUP',
      'GENERATE_ROBOTS_TXT',
    ];
  }

  private async healthCheck(_task: AgentTask): Promise<AgentResult> {
    const checks: Array<{ name: string; status: string; details: string }> = [];

    // Check output directory
    const outputDir = path.resolve(__dirname, '../../../../output');
    if (fs.existsSync(outputDir)) {
      const blogs = fs.readdirSync(outputDir).filter(f => 
        fs.statSync(path.join(outputDir, f)).isDirectory()
      );
      checks.push({
        name: 'Output Directory',
        status: 'ok',
        details: `${blogs.length} blog directories found`,
      });

      for (const blog of blogs) {
        const blogPath = path.join(outputDir, blog);
        const posts = fs.readdirSync(blogPath).filter(f => f.endsWith('.html'));
        checks.push({
          name: `Blog: ${blog}`,
          status: posts.length > 0 ? 'ok' : 'warning',
          details: `${posts.length} posts`,
        });
      }
    } else {
      checks.push({ name: 'Output Directory', status: 'error', details: 'Missing' });
    }

    // Check deploy directory
    const deployDir = path.resolve(__dirname, '../../../../deploy');
    if (fs.existsSync(deployDir)) {
      const hasIndex = fs.existsSync(path.join(deployDir, 'index.html'));
      const hasAdsTxt = fs.existsSync(path.join(deployDir, 'ads.txt'));
      checks.push({
        name: 'Deploy Directory',
        status: hasIndex ? 'ok' : 'warning',
        details: `index.html: ${hasIndex}, ads.txt: ${hasAdsTxt}`,
      });
    } else {
      checks.push({ name: 'Deploy Directory', status: 'warning', details: 'Not created yet' });
    }

    // Check config
    const configPath = path.resolve(__dirname, '../../../../config/blog-network-config.json');
    if (fs.existsSync(configPath)) {
      try {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        checks.push({
          name: 'Configuration',
          status: 'ok',
          details: `${config.blogs?.length || 0} blogs configured`,
        });
      } catch {
        checks.push({ name: 'Configuration', status: 'error', details: 'Invalid JSON' });
      }
    }

    // Memory check
    const memUsage = process.memoryUsage();
    const memMB = Math.round(memUsage.rss / 1024 / 1024);
    checks.push({
      name: 'Memory Usage',
      status: memMB < 500 ? 'ok' : 'warning',
      details: `${memMB} MB RSS`,
    });

    // Disk check on output
    let totalSize = 0;
    if (fs.existsSync(outputDir)) {
      totalSize = this.getDirSize(outputDir);
    }
    checks.push({
      name: 'Content Size',
      status: 'ok',
      details: `${(totalSize / 1024 / 1024).toFixed(1)} MB total`,
    });

    const okCount = checks.filter(c => c.status === 'ok').length;
    const warningCount = checks.filter(c => c.status === 'warning').length;
    const errorCount = checks.filter(c => c.status === 'error').length;

    return this.createSuccessResult({
      healthStatus: errorCount > 0 ? 'unhealthy' : warningCount > 0 ? 'degraded' : 'healthy',
      checks,
      summary: {
        total: checks.length,
        ok: okCount,
        warnings: warningCount,
        errors: errorCount,
      },
      checkedAt: new Date().toISOString(),
    });
  }

  private async generateSitemap(task: AgentTask): Promise<AgentResult> {
    const { baseUrl = 'https://darkforest.sagaciasoft.com' } = task.data as { baseUrl?: string };
    const deployDir = path.resolve(__dirname, '../../../../deploy');
    
    if (!fs.existsSync(deployDir)) {
      return this.createErrorResult('Deploy directory not found. Run deployment first.');
    }

    const urls: Array<{ loc: string; lastmod: string; priority: string; changefreq: string }> = [];

    // Add homepage
    urls.push({
      loc: baseUrl,
      lastmod: new Date().toISOString().split('T')[0],
      priority: '1.0',
      changefreq: 'daily',
    });

    // Scan deploy directory for blog posts
    const blogDirs = fs.readdirSync(deployDir).filter(f => {
      const fullPath = path.join(deployDir, f);
      return fs.statSync(fullPath).isDirectory() && !f.startsWith('.');
    });

    for (const blogDir of blogDirs) {
      // Blog index page
      urls.push({
        loc: `${baseUrl}/${blogDir}/`,
        lastmod: new Date().toISOString().split('T')[0],
        priority: '0.8',
        changefreq: 'daily',
      });

      // Individual posts
      const blogPath = path.join(deployDir, blogDir);
      const posts = fs.readdirSync(blogPath).filter(f => f.endsWith('.html') && f !== 'index.html');

      for (const post of posts) {
        const stats = fs.statSync(path.join(blogPath, post));
        urls.push({
          loc: `${baseUrl}/${blogDir}/${post.replace('.html', '')}`,
          lastmod: stats.mtime.toISOString().split('T')[0],
          priority: '0.6',
          changefreq: 'weekly',
        });
      }
    }

    // Generate XML
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    const sitemapPath = path.join(deployDir, 'sitemap.xml');
    fs.writeFileSync(sitemapPath, xml, 'utf-8');

    return this.createSuccessResult({
      sitemapPath,
      urlCount: urls.length,
      blogs: blogDirs,
      generatedAt: new Date().toISOString(),
    });
  }

  private async generateRSSFeed(task: AgentTask): Promise<AgentResult> {
    const { 
      baseUrl = 'https://darkforest.sagaciasoft.com',
      blogId = '',
    } = task.data as { baseUrl?: string; blogId?: string };

    const deployDir = path.resolve(__dirname, '../../../../deploy');
    const outputDir = path.resolve(__dirname, '../../../../output');
    const feedResults: Array<{ blogId: string; feedPath: string; itemCount: number }> = [];

    const blogDirs = blogId 
      ? [blogId] 
      : (fs.existsSync(deployDir) 
        ? fs.readdirSync(deployDir).filter(f => {
            const fp = path.join(deployDir, f);
            return fs.statSync(fp).isDirectory() && !f.startsWith('.');
          })
        : []);

    for (const blog of blogDirs) {
      const blogPath = path.join(deployDir, blog);
      if (!fs.existsSync(blogPath)) continue;

      const posts = fs.readdirSync(blogPath)
        .filter(f => f.endsWith('.html') && f !== 'index.html')
        .map(f => {
          const filePath = path.join(blogPath, f);
          const stats = fs.statSync(filePath);
          const content = fs.readFileSync(filePath, 'utf-8');
          
          // Extract title from HTML
          const titleMatch = content.match(/<title>([^<]+)<\/title>/);
          const title = titleMatch ? titleMatch[1].split('|')[0].trim() : f.replace('.html', '');
          
          // Extract description
          const descMatch = content.match(/<meta\s+name="description"\s+content="([^"]+)"/);
          const description = descMatch ? descMatch[1] : title;

          return { file: f, title, description, date: stats.mtime, slug: f.replace('.html', '') };
        })
        .sort((a, b) => b.date.getTime() - a.date.getTime());

      const blogName = blog.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

      const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${blogName}</title>
    <link>${baseUrl}/${blog}/</link>
    <description>Latest articles from ${blogName}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/${blog}/feed.xml" rel="self" type="application/rss+xml"/>
${posts.slice(0, 20).map(p => `    <item>
      <title>${this.escapeXml(p.title)}</title>
      <link>${baseUrl}/${blog}/${p.slug}</link>
      <guid>${baseUrl}/${blog}/${p.slug}</guid>
      <description>${this.escapeXml(p.description)}</description>
      <pubDate>${p.date.toUTCString()}</pubDate>
    </item>`).join('\n')}
  </channel>
</rss>`;

      const feedPath = path.join(blogPath, 'feed.xml');
      fs.writeFileSync(feedPath, rss, 'utf-8');
      feedResults.push({ blogId: blog, feedPath, itemCount: Math.min(posts.length, 20) });
    }

    return this.createSuccessResult({
      feeds: feedResults,
      totalFeeds: feedResults.length,
      generatedAt: new Date().toISOString(),
    });
  }

  private async checkBrokenLinks(task: AgentTask): Promise<AgentResult> {
    const deployDir = path.resolve(__dirname, '../../../../deploy');
    const brokenLinks: Array<{ file: string; link: string; reason: string }> = [];
    let totalLinks = 0;

    if (!fs.existsSync(deployDir)) {
      return this.createSuccessResult({ brokenLinks: [], totalLinks: 0, message: 'No deploy directory' });
    }

    const htmlFiles = this.findFiles(deployDir, '.html');
    
    for (const file of htmlFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      const linkMatches = content.matchAll(/href="([^"]+)"/g);
      
      for (const match of linkMatches) {
        totalLinks++;
        const link = match[1];
        
        // Check internal links
        if (link.startsWith('/') || link.startsWith('./') || link.startsWith('../')) {
          const resolvedPath = path.resolve(path.dirname(file), link.replace(/\/$/, '/index.html'));
          if (!fs.existsSync(resolvedPath) && !fs.existsSync(resolvedPath + '.html')) {
            brokenLinks.push({
              file: path.relative(deployDir, file),
              link,
              reason: 'File not found',
            });
          }
        }
        
        // Check for placeholder links
        if (link === '#' || link.includes('XXXXXXXXXX') || link === 'javascript:void(0)') {
          brokenLinks.push({
            file: path.relative(deployDir, file),
            link,
            reason: 'Placeholder link',
          });
        }
      }
    }

    return this.createSuccessResult({
      totalLinks,
      brokenLinks,
      brokenCount: brokenLinks.length,
      healthScore: totalLinks > 0 ? Math.round(((totalLinks - brokenLinks.length) / totalLinks) * 100) : 100,
      checkedAt: new Date().toISOString(),
    });
  }

  private async cleanup(_task: AgentTask): Promise<AgentResult> {
    const cleaned: string[] = [];
    const outputDir = path.resolve(__dirname, '../../../../output');

    // Remove empty directories
    if (fs.existsSync(outputDir)) {
      const dirs = fs.readdirSync(outputDir);
      for (const dir of dirs) {
        const dirPath = path.join(outputDir, dir);
        if (fs.statSync(dirPath).isDirectory()) {
          const files = fs.readdirSync(dirPath);
          if (files.length === 0) {
            fs.rmdirSync(dirPath);
            cleaned.push(`Removed empty directory: ${dir}`);
          }
        }
      }
    }

    // Check for temp files
    const tempPatterns = ['.tmp', '.bak', '~'];
    if (fs.existsSync(outputDir)) {
      const allFiles = this.findFiles(outputDir, '');
      for (const file of allFiles) {
        const ext = path.extname(file);
        if (tempPatterns.some(p => file.endsWith(p))) {
          fs.unlinkSync(file);
          cleaned.push(`Removed temp file: ${path.relative(outputDir, file)}`);
        }
      }
    }

    return this.createSuccessResult({
      cleanedItems: cleaned,
      cleanedCount: cleaned.length,
      cleanedAt: new Date().toISOString(),
    });
  }

  private async generateRobotsTxt(task: AgentTask): Promise<AgentResult> {
    const { baseUrl = 'https://darkforest.sagaciasoft.com' } = task.data as { baseUrl?: string };
    const deployDir = path.resolve(__dirname, '../../../../deploy');

    const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml

# Crawl-delay for polite crawling
User-agent: *
Crawl-delay: 1
`;

    if (fs.existsSync(deployDir)) {
      fs.writeFileSync(path.join(deployDir, 'robots.txt'), robotsTxt, 'utf-8');
    }

    return this.createSuccessResult({
      robotsTxtGenerated: true,
      sitemapUrl: `${baseUrl}/sitemap.xml`,
      generatedAt: new Date().toISOString(),
    });
  }

  // Utility methods
  private getDirSize(dirPath: string): number {
    let size = 0;
    try {
      const files = fs.readdirSync(dirPath);
      for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
          size += this.getDirSize(filePath);
        } else {
          size += stat.size;
        }
      }
    } catch {
      // ignore
    }
    return size;
  }

  private findFiles(dir: string, ext: string): string[] {
    const results: string[] = [];
    try {
      const entries = fs.readdirSync(dir);
      for (const entry of entries) {
        const fullPath = path.join(dir, entry);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          results.push(...this.findFiles(fullPath, ext));
        } else if (!ext || entry.endsWith(ext)) {
          results.push(fullPath);
        }
      }
    } catch {
      // ignore
    }
    return results;
  }

  private escapeXml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}
