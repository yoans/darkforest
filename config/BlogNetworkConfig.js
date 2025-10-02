const fs = require('fs');
const path = require('path');

/**
 * Blog Network Configuration Manager
 * Centralized system for managing multiple blogs with themes, requirements, and monetization
 */
class BlogNetworkConfig {
  constructor(configPath = null) {
    this.configPath = configPath || path.join(__dirname, '../config/blog-network-config.json');
    this.config = null;
    this.load();
  }

  /**
   * Load configuration from file
   */
  load() {
    try {
      const configData = fs.readFileSync(this.configPath, 'utf8');
      this.config = JSON.parse(configData);
      console.log(`✅ Loaded configuration for ${this.config.blogs.length} blogs`);
      return true;
    } catch (error) {
      console.error('❌ Failed to load configuration:', error.message);
      this.config = this.getDefaultConfig();
      return false;
    }
  }

  /**
   * Get default configuration if file doesn't exist
   */
  getDefaultConfig() {
    return {
      network: {
        name: "AI Blog Network",
        description: "Automated content generation network"
      },
      blogs: [],
      contentQuality: {
        minimumWordCount: 1000
      }
    };
  }

  /**
   * Save current configuration to file
   */
  save() {
    try {
      fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
      console.log('✅ Configuration saved successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to save configuration:', error.message);
      return false;
    }
  }

  /**
   * Get all blogs
   */
  getAllBlogs() {
    return this.config.blogs || [];
  }

  /**
   * Get specific blog by ID
   */
  getBlog(blogId) {
    return this.config.blogs.find(blog => blog.id === blogId);
  }

  /**
   * Get blog content strategy
   */
  getBlogStrategy(blogId) {
    const blog = this.getBlog(blogId);
    return blog ? blog.contentStrategy : null;
  }

  /**
   * Get blog theme configuration
   */
  getBlogTheme(blogId) {
    const blog = this.getBlog(blogId);
    return blog ? blog.theme : null;
  }

  /**
   * Get blog monetization settings
   */
  getBlogMonetization(blogId) {
    const blog = this.getBlog(blogId);
    if (!blog) return null;

    return {
      ...this.config.network.monetization,
      ...blog.monetization
    };
  }

  /**
   * Get AI settings for content generation
   */
  getAISettings() {
    return this.config.aiSettings || {};
  }

  /**
   * Get content quality requirements
   */
  getQualityRequirements() {
    return this.config.contentQuality || {};
  }

  /**
   * Get deployment configuration
   */
  getDeploymentConfig() {
    return this.config.deployment || {};
  }

  /**
   * Generate content prompt for specific blog
   */
  generateContentPrompt(blogId, topic, contentType = 'article') {
    const blog = this.getBlog(blogId);
    if (!blog) return null;

    const strategy = blog.contentStrategy;
    const quality = this.config.contentQuality;
    const aiSettings = this.config.aiSettings;

    return {
      systemPrompt: aiSettings.systemPrompts.content,
      userPrompt: `
Write a comprehensive ${contentType} about "${topic}" for ${blog.name}.

BLOG CONTEXT:
- Blog Name: ${blog.name}
- Tagline: ${blog.tagline}
- Niche: ${blog.niche}
- Target Audience: ${strategy.targetAudience || 'general audience'}

CONTENT REQUIREMENTS:
- Tone: ${strategy.tone}
- Word Count: ${strategy.wordCountRange[0]}-${strategy.wordCountRange[1]} words
- Include: ${quality.requireExamples ? 'Real-world examples' : ''} ${quality.requireStatistics ? 'Statistics and data' : ''} ${quality.requireActionableAdvice ? 'Actionable advice' : ''}
- Readability: ${quality.readabilityTarget || 'grade-10'} level
- SEO Keywords: ${strategy.seoKeywords.primary.join(', ')}

CONTENT STRUCTURE:
1. Compelling introduction with hook
2. Clear section headers (H2, H3)
3. Bullet points and numbered lists for readability
4. Real-world examples and case studies
5. Data and statistics to support claims
6. Actionable takeaways and recommendations
7. Strong conclusion with call-to-action

STYLE GUIDELINES:
- Write in ${strategy.tone} tone
- Use active voice and clear language
- Include relevant industry terminology
- Provide practical, implementable advice
- Back claims with credible sources
- Format for easy scanning (short paragraphs, lists, bold text)

OUTPUT FORMAT:
Use markdown formatting with proper headers, lists, and emphasis.
      `.trim(),
      
      settings: {
        model: aiSettings.model,
        temperature: aiSettings.temperature,
        maxTokens: aiSettings.maxTokens,
        topP: aiSettings.topP,
        frequencyPenalty: aiSettings.frequencyPenalty,
        presencePenalty: aiSettings.presencePenalty
      }
    };
  }

  /**
   * Generate strategy prompt for specific blog
   */
  generateStrategyPrompt(blogId, timeframe = 'week') {
    const blog = this.getBlog(blogId);
    if (!blog) return null;

    const strategy = blog.contentStrategy;
    const aiSettings = this.config.aiSettings;

    return {
      systemPrompt: aiSettings.systemPrompts.strategy,
      userPrompt: `
Analyze current trends and create a content strategy for ${blog.name}.

BLOG PROFILE:
- Name: ${blog.name}
- Niche: ${blog.niche}
- Target Audience: ${JSON.stringify(blog.targetAudience, null, 2)}
- Current Topics: ${strategy.keyTopics.join(', ')}
- SEO Focus: ${strategy.seoKeywords.primary.join(', ')}

REQUIREMENTS:
- Generate ${strategy.postsPerWeek} content ideas for the next ${timeframe}
- Identify trending topics in ${blog.niche}
- Suggest high-potential keywords
- Prioritize topics by potential traffic and engagement
- Consider content gaps and competitor analysis
- Align with monetization strategy: ${blog.monetization.strategies.join(', ')}

OUTPUT:
Provide a JSON-formatted strategy with:
{
  "topics": [
    {
      "title": "Article title",
      "keywords": ["keyword1", "keyword2"],
      "searchVolume": "estimated monthly searches",
      "difficulty": "low/medium/high",
      "monetizationPotential": "low/medium/high",
      "rationale": "Why this topic is valuable"
    }
  ],
  "trendingKeywords": ["keyword1", "keyword2"],
  "contentGaps": ["opportunity 1", "opportunity 2"],
  "competitorInsights": "Key observations"
}
      `.trim(),
      
      settings: {
        model: aiSettings.model,
        temperature: 0.7,
        maxTokens: 2000
      }
    };
  }

  /**
   * Validate blog configuration
   */
  validateBlog(blogId) {
    const blog = this.getBlog(blogId);
    if (!blog) return { valid: false, errors: ['Blog not found'] };

    const errors = [];

    // Required fields
    if (!blog.name) errors.push('Blog name is required');
    if (!blog.niche) errors.push('Blog niche is required');
    if (!blog.contentStrategy) errors.push('Content strategy is required');
    if (!blog.theme) errors.push('Theme configuration is required');

    // Content strategy validation
    if (blog.contentStrategy) {
      if (!blog.contentStrategy.postsPerWeek || blog.contentStrategy.postsPerWeek < 1) {
        errors.push('Invalid posts per week');
      }
      if (!blog.contentStrategy.wordCountRange || blog.contentStrategy.wordCountRange.length !== 2) {
        errors.push('Invalid word count range');
      }
    }

    // Theme validation
    if (blog.theme) {
      if (!blog.theme.colors || !blog.theme.colors.primary) {
        errors.push('Theme colors not properly configured');
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Get next scheduled post time for blog
   */
  getNextPostTime(blogId) {
    const blog = this.getBlog(blogId);
    if (!blog || !blog.publishing || !blog.publishing.schedule) {
      return null;
    }

    // Parse schedule (e.g., "Mon, Wed, Fri 8am EST")
    // This is a simplified version - would need full cron parsing for production
    const schedule = blog.publishing.schedule;
    return {
      schedule,
      autoPublish: blog.publishing.autoPublish,
      requiresReview: blog.publishing.requiresReview
    };
  }

  /**
   * Get monetization configuration with product recommendations
   */
  getMonetizationStrategy(blogId, contentTopic) {
    const blog = this.getBlog(blogId);
    if (!blog) return null;

    const monetization = this.getBlogMonetization(blogId);

    return {
      adsenseEnabled: monetization.googleAdsense?.enabled,
      adSlots: monetization.googleAdsense?.adSlots,
      
      affiliateEnabled: monetization.amazonAssociates?.enabled,
      affiliateCategories: blog.monetization.productCategories,
      
      productRecommendations: this.getProductRecommendations(blogId, contentTopic),
      
      disclosure: monetization.affiliateLinks?.defaultDisclosure,
      
      priority: blog.monetization.priority,
      strategies: blog.monetization.strategies
    };
  }

  /**
   * Get product recommendations based on topic and blog niche
   */
  getProductRecommendations(blogId, topic) {
    const blog = this.getBlog(blogId);
    if (!blog) return [];

    // This would integrate with Amazon API or product database
    // For now, return category-based recommendations
    return blog.monetization.productCategories.map(category => ({
      category,
      placement: 'in-article',
      type: 'contextual-recommendation'
    }));
  }

  /**
   * Export configuration for specific blog
   */
  exportBlogConfig(blogId) {
    const blog = this.getBlog(blogId);
    if (!blog) return null;

    return {
      blog,
      network: this.config.network,
      quality: this.config.contentQuality,
      ai: this.config.aiSettings,
      deployment: this.config.deployment
    };
  }

  /**
   * Get statistics about the blog network
   */
  getNetworkStats() {
    const blogs = this.getAllBlogs();
    
    return {
      totalBlogs: blogs.length,
      totalPostsPerWeek: blogs.reduce((sum, blog) => 
        sum + (blog.contentStrategy?.postsPerWeek || 0), 0
      ),
      niches: [...new Set(blogs.map(blog => blog.niche))],
      monetizationEnabled: blogs.filter(blog => 
        blog.monetization?.priority === 'high' || 
        blog.monetization?.priority === 'very-high'
      ).length,
      averageWordCount: blogs.reduce((sum, blog) => {
        const range = blog.contentStrategy?.wordCountRange || [0, 0];
        return sum + (range[0] + range[1]) / 2;
      }, 0) / blogs.length
    };
  }
}

module.exports = BlogNetworkConfig;

// Example usage
if (require.main === module) {
  const config = new BlogNetworkConfig();
  
  console.log('\n📊 Blog Network Configuration');
  console.log('='.repeat(60));
  
  const stats = config.getNetworkStats();
  console.log('\nNetwork Stats:');
  console.log(`- Total Blogs: ${stats.totalBlogs}`);
  console.log(`- Posts/Week: ${stats.totalPostsPerWeek}`);
  console.log(`- Niches: ${stats.niches.join(', ')}`);
  console.log(`- Avg Word Count: ${Math.round(stats.averageWordCount)}`);
  
  console.log('\n📚 Blogs:');
  config.getAllBlogs().forEach((blog, index) => {
    console.log(`\n${index + 1}. ${blog.name}`);
    console.log(`   ID: ${blog.id}`);
    console.log(`   Niche: ${blog.niche}`);
    console.log(`   Posts/Week: ${blog.contentStrategy.postsPerWeek}`);
    console.log(`   Monetization: ${blog.monetization.priority}`);
    
    const validation = config.validateBlog(blog.id);
    console.log(`   Valid: ${validation.valid ? '✅' : '❌'}`);
    if (!validation.valid) {
      console.log(`   Errors: ${validation.errors.join(', ')}`);
    }
  });
  
  // Test prompt generation
  console.log('\n📝 Sample Content Prompt:');
  const prompt = config.generateContentPrompt('ai-business-insights', 'AI ROI Calculator for Small Business');
  if (prompt) {
    console.log(`Model: ${prompt.settings.model}`);
    console.log(`System: ${prompt.systemPrompt.substring(0, 100)}...`);
    console.log(`Prompt length: ${prompt.userPrompt.length} chars`);
  }
}