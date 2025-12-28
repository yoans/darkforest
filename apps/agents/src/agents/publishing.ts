import { Agent, AgentTask, AgentResult } from '../types/base';

export class PublishingAgent extends Agent {
  id = 'publishing-001';
  name = 'Content Publishing Agent';
  type = 'PUBLISHING';
  version = '1.0.0';

  constructor() {
    super();
  }

  async execute(task: AgentTask): Promise<AgentResult> {
    try {
      switch (task.type) {
        case 'PUBLISH_POST':
          return await this.publishPost(task);
        case 'SCHEDULE_POST':
          return await this.schedulePost(task);
        case 'UPDATE_POST':
          return await this.updatePost(task);
        case 'GENERATE_SOCIAL_POSTS':
          return await this.generateSocialPosts(task);
        default:
          return this.createErrorResult(`Unsupported task type: ${task.type}`);
      }
    } catch (error) {
      return this.createErrorResult(`Publishing agent error: ${error}`);
    }
  }

  getCapabilities(): string[] {
    return [
      'PUBLISH_POST',
      'SCHEDULE_POST', 
      'UPDATE_POST',
      'GENERATE_SOCIAL_POSTS',
      'SEO_META_GENERATION',
      'SITEMAP_UPDATE'
    ];
  }

  private async publishPost(task: AgentTask): Promise<AgentResult> {
    const taskData = task.data as {
      postId?: string;
      siteId?: string;
      content?: Record<string, unknown>;
      metadata?: Record<string, unknown>;
    };
    
    const { siteId = 'default', content = {}, metadata = {} } = taskData;
    
    try {
      // 1. Format content for CMS
      const formattedContent = await this.formatForCMS(content, metadata);
      
      // 2. Generate SEO elements
      const seoElements = await this.generateSEOElements(content, metadata);
      
      // 3. Publish to CMS (Strapi, Ghost, etc.)
      const publishResult = await this.publishToCMS(siteId, {
        ...formattedContent,
        ...seoElements,
        status: 'published',
        publishedAt: new Date().toISOString()
      });
      
      // 4. Update sitemap
      await this.updateSitemap(siteId, publishResult.slug);
      
      // 5. Ping search engines
      await this.pingSearchEngines(siteId, publishResult.url);

      return this.createSuccessResult({
        publishedPost: publishResult,
        url: publishResult.url,
        publishedAt: publishResult.publishedAt
      });
      
    } catch (error) {
      return this.createErrorResult(`Failed to publish post: ${error}`);
    }
  }

  private async schedulePost(task: AgentTask): Promise<AgentResult> {
    const taskData = task.data as { postId?: string; publishAt?: string; timezone?: string };
    const { postId = '', publishAt = '', timezone = 'UTC' } = taskData;
    
    // Schedule the post for future publication
    // This would integrate with your scheduling system (cron, agenda, etc.)
    
    return this.createSuccessResult({
      scheduled: true,
      publishAt,
      timezone,
      scheduledTaskId: `scheduled_${postId}_${Date.now()}`
    });
  }

  private async updatePost(task: AgentTask): Promise<AgentResult> {
    const taskData = task.data as { postId?: string; updates?: Record<string, unknown>; siteId?: string };
    const { postId = '', updates = {}, siteId = 'default' } = taskData;
    
    try {
      await this.updateInCMS(siteId, postId, updates);
      
      return this.createSuccessResult({
        updated: true,
        postId,
        updatedFields: Object.keys(updates),
        lastModified: new Date().toISOString()
      });
      
    } catch (error) {
      return this.createErrorResult(`Failed to update post: ${error}`);
    }
  }

  private async generateSocialPosts(task: AgentTask): Promise<AgentResult> {
    const taskData = task.data as { 
      article?: { url?: string; title?: string; excerpt?: string; tags?: string[] }; 
      platforms?: string[] 
    };
    const { article = {}, platforms = ['twitter', 'linkedin'] } = taskData;
    
    const socialPosts: Record<string, string> = {
      twitter: this.generateTwitterPost(article),
      linkedin: this.generateLinkedInPost(article),
      facebook: this.generateFacebookPost(article)
    };

    const filteredPosts = Object.fromEntries(
      Object.entries(socialPosts).filter(([platform]) => platforms.includes(platform))
    );

    return this.createSuccessResult({
      socialPosts: filteredPosts,
      platforms,
      articleUrl: article.url || ''
    });
  }

  private async formatForCMS(content: any, metadata: any) {
    // Convert markdown to HTML, process images, etc.
    return {
      title: content.title,
      content: content.content,
      excerpt: content.excerpt,
      slug: this.generateSlug(content.title),
      featuredImage: metadata.featuredImage || null,
      tags: metadata.tags || [],
      categories: metadata.categories || []
    };
  }

  private async generateSEOElements(content: any, metadata: any) {
    return {
      metaTitle: content.title,
      metaDescription: content.metaDescription,
      canonicalUrl: metadata.canonicalUrl || null,
      schema: this.generateSchemaMarkup(content, metadata),
      openGraphTags: this.generateOpenGraphTags(content, metadata),
      twitterTags: this.generateTwitterTags(content, metadata)
    };
  }

  private async publishToCMS(siteId: string, postData: any) {
    // This would integrate with your CMS API (Strapi, Ghost, WordPress, etc.)
    // For now, return mock response
    return {
      id: `post_${Date.now()}`,
      slug: postData.slug,
      url: `https://site-${siteId}.com/${postData.slug}`,
      publishedAt: postData.publishedAt,
      status: 'published'
    };
  }

  private async updateSitemap(siteId: string, slug: string) {
    // Update sitemap.xml with new post
    console.log(`Updating sitemap for site ${siteId} with new post: ${slug}`);
  }

  private async pingSearchEngines(siteId: string, url: string) {
    // Ping Google, Bing, etc. about new content
    console.log(`Pinging search engines for new content: ${url}`);
  }

  private async updateInCMS(siteId: string, postId: string, updates: any) {
    // Update existing post in CMS
    return {
      id: postId,
      updated: true,
      lastModified: new Date().toISOString()
    };
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  private generateSchemaMarkup(content: any, metadata: any) {
    return {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": content.title,
      "description": content.metaDescription,
      "author": {
        "@type": "Organization", 
        "name": metadata.siteName || "Dark Forest Blog"
      },
      "datePublished": new Date().toISOString(),
      "dateModified": new Date().toISOString()
    };
  }

  private generateOpenGraphTags(content: Record<string, unknown>, metadata: Record<string, unknown>) {
    return {
      "og:title": content.title || '',
      "og:description": content.metaDescription || '',
      "og:type": "article",
      "og:image": metadata.featuredImage || metadata.defaultImage || ''
    };
  }

  private generateTwitterTags(content: Record<string, unknown>, metadata: Record<string, unknown>) {
    return {
      "twitter:card": "summary_large_image",
      "twitter:title": content.title || '',
      "twitter:description": content.metaDescription || '',
      "twitter:image": metadata.featuredImage || metadata.defaultImage || ''
    };
  }

  private generateTwitterPost(article: { url?: string; title?: string; tags?: string[] }): string {
    const maxLength = 280;
    const title = article.title || 'New Article';
    const url = article.url || '';
    const hashtags = article.tags?.slice(0, 2).map((tag: string) => `#${tag}`).join(' ') || '';
    
    let tweet = `${title}\n\n${url}`;
    if (hashtags && (tweet + ' ' + hashtags).length <= maxLength) {
      tweet += ` ${hashtags}`;
    }
    
    return tweet.length <= maxLength ? tweet : `${title.slice(0, maxLength - url.length - 10)}...\n\n${url}`;
  }

  private generateLinkedInPost(article: { url?: string; title?: string; excerpt?: string; tags?: string[] }): string {
    return `${article.title || ''}\n\n${article.excerpt || ''}\n\nRead more: ${article.url || ''}\n\n${article.tags?.map((tag: string) => `#${tag}`).join(' ') || ''}`;
  }

  private generateFacebookPost(article: { url?: string; title?: string; excerpt?: string }): string {
    return `${article.title || ''}\n\n${article.excerpt || ''}\n\n${article.url || ''}`;
  }
}