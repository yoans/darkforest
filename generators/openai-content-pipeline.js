const ProfessionalBlogGenerator = require('./ProfessionalBlogGenerator');
const BlogNetworkConfig = require('../config/BlogNetworkConfig');

/**
 * OpenAI-Powered Content Pipeline
 * Generates high-quality blog content using GPT-4
 */
class OpenAIContentPipeline {
  constructor() {
    this.config = new BlogNetworkConfig();
    this.generator = new ProfessionalBlogGenerator();
    this.apiKey = process.env.OPENAI_API_KEY;
    
    if (!this.apiKey) {
      console.warn('⚠️  OPENAI_API_KEY not set - using mock content mode');
    }
  }

  /**
   * Generate complete blog post using OpenAI
   */
  async generatePost(blogId, topic = null) {
    const blog = this.config.getBlog(blogId);
    if (!blog) {
      throw new Error(`Blog ${blogId} not found`);
    }

    console.log(`\n🤖 Generating post for: ${blog.name}`);
    
    // Step 1: Generate article outline
    console.log('📝 Creating outline...');
    const outline = await this.generateOutline(blog, topic);
    
    // Step 2: Generate full content
    console.log('✍️  Writing content...');
    const content = await this.generateContent(blog, outline);
    
    // Step 3: Generate SEO metadata
    console.log('🔍 Optimizing SEO...');
    const seo = await this.generateSEO(blog, content);
    
    // Step 4: Create HTML with professional theme
    console.log('🎨 Applying theme...');
    const postData = {
      title: content.title,
      content: content.body,
      author: content.author || 'AI Content Team',
      tags: seo.tags,
      seoDescription: seo.description,
      readingTime: this.calculateReadingTime(content.body),
      publishDate: new Date()
    };
    
    const html = this.generator.generateThemedPost(blogId, postData);
    
    // Step 5: Save the post
    const result = this.generator.savePost(blogId, html, postData);
    
    console.log(`✅ Complete! Saved to: ${result.fileName}`);
    
    return {
      ...result,
      metadata: {
        wordCount: this.countWords(content.body),
        readingTime: postData.readingTime,
        seo,
        outline
      }
    };
  }

  /**
   * Generate article outline using AI or template
   */
  async generateOutline(blog, topic) {
    const selectedTopic = topic || this.selectTopic(blog);
    
    if (this.apiKey) {
      return await this.callOpenAI({
        model: blog.ai.model,
        temperature: 0.8,
        maxTokens: 1000,
        systemPrompt: `You are an expert content strategist for ${blog.name}, specializing in ${blog.niche}.`,
        userPrompt: `Create a detailed outline for a blog post about: "${selectedTopic}"

Requirements:
- Target audience: ${blog.contentStrategy.targetAudience}
- Tone: ${blog.contentStrategy.tone.join(', ')}
- Word count: ${blog.contentStrategy.wordCount.min}-${blog.contentStrategy.wordCount.max} words
- Include: Introduction, 3-5 main sections, Conclusion
- Focus on actionable insights and real-world examples
- Include sections for: key statistics, expert insights, implementation steps

Return the outline in this format:
Title: [Compelling title]
Introduction: [Hook and overview]
Section 1: [Title and key points]
Section 2: [Title and key points]
...
Conclusion: [Key takeaways]`
      });
    }

    // Fallback: Generate outline using template
    return this.generateMockOutline(blog, selectedTopic);
  }

  /**
   * Generate full article content
   */
  async generateContent(blog, outline) {
    if (this.apiKey) {
      const response = await this.callOpenAI({
        model: blog.ai.model,
        temperature: blog.ai.temperature,
        maxTokens: blog.ai.maxTokens,
        systemPrompt: `You are a professional content writer for ${blog.name}. Write in a ${blog.contentStrategy.tone.join(', ')} tone for ${blog.contentStrategy.targetAudience}.`,
        userPrompt: `Write a complete, high-quality blog post based on this outline:

${outline}

Requirements:
- Word count: ${blog.contentStrategy.wordCount.min}-${blog.contentStrategy.wordCount.max} words
- Use markdown formatting (## for h2, ### for h3, **bold**, *italic*, etc.)
- Include real statistics and data where possible
- Write compelling, actionable content
- Use examples and case studies
- Include lists and bullet points for readability
- Write in an engaging, professional style
- Focus on providing genuine value to readers
- Include specific implementation steps where relevant

Format: Return only the markdown content, starting with the title as # heading.`
      });

      return this.parseContentResponse(response);
    }

    // Fallback: Generate mock content
    return this.generateMockContent(blog, outline);
  }

  /**
   * Generate SEO metadata
   */
  async generateSEO(blog, content) {
    const title = content.title;
    const body = content.body.substring(0, 1000); // First 1000 chars

    if (this.apiKey) {
      const response = await this.callOpenAI({
        model: 'gpt-4',
        temperature: 0.7,
        maxTokens: 500,
        systemPrompt: 'You are an SEO expert.',
        userPrompt: `Generate SEO metadata for this article:
Title: ${title}
Content preview: ${body}

Target keywords: ${blog.contentStrategy.seoKeywords.join(', ')}

Generate:
1. Meta description (155-160 characters, compelling, includes primary keyword)
2. 5-7 relevant tags
3. URL slug (lowercase, hyphens, max 5 words)

Format as JSON:
{
  "description": "...",
  "tags": ["tag1", "tag2", ...],
  "slug": "..."
}`
      });

      try {
        return JSON.parse(response);
      } catch (e) {
        // Fallback if JSON parsing fails
        return this.generateMockSEO(blog, title);
      }
    }

    return this.generateMockSEO(blog, title);
  }

  /**
   * Call OpenAI API
   */
  async callOpenAI({ model, temperature, maxTokens, systemPrompt, userPrompt }) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model,
          temperature,
          max_tokens: maxTokens,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ]
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('❌ OpenAI API call failed:', error.message);
      throw error;
    }
  }

  /**
   * Parse content response into structured format
   */
  parseContentResponse(response) {
    const lines = response.split('\n');
    let title = 'Untitled';
    
    // Extract title (first # heading)
    for (const line of lines) {
      if (line.startsWith('# ')) {
        title = line.replace('# ', '').trim();
        break;
      }
    }

    return {
      title,
      body: response,
      author: 'AI Content Team'
    };
  }

  /**
   * Select topic from blog's key topics
   */
  selectTopic(blog) {
    const topics = blog.contentStrategy.keyTopics;
    return topics[Math.floor(Math.random() * topics.length)];
  }

  /**
   * Calculate reading time
   */
  calculateReadingTime(content) {
    const words = this.countWords(content);
    const minutes = Math.ceil(words / 200); // Average reading speed: 200 words/min
    return `${minutes} min`;
  }

  /**
   * Count words in content
   */
  countWords(text) {
    return text.split(/\s+/).filter(word => word.length > 0).length;
  }

  /**
   * Generate mock outline (fallback when no API key)
   */
  generateMockOutline(blog, topic) {
    return `Title: The Complete Guide to ${topic} in ${new Date().getFullYear()}
Introduction: Understanding the importance and current landscape
Section 1: Core Concepts and Fundamentals
Section 2: Best Practices and Strategies
Section 3: Real-World Applications and Case Studies
Section 4: Implementation Guide
Conclusion: Key Takeaways and Next Steps`;
  }

  /**
   * Generate mock content (fallback when no API key)
   */
  generateMockContent(blog, outline) {
    const topic = outline.split('\n')[0].replace('Title: ', '');
    
    return {
      title: topic,
      body: `# ${topic}

## Introduction

${blog.niche} is rapidly evolving, and staying ahead requires both knowledge and action. In this comprehensive guide, we'll explore everything you need to know.

## Understanding the Fundamentals

The foundation of success in ${blog.niche} starts with understanding key principles:

* **Strategic Planning**: Develop a clear roadmap
* **Data-Driven Decisions**: Use analytics to guide choices
* **Continuous Learning**: Stay updated with latest trends
* **Implementation Focus**: Theory means nothing without action

## Best Practices

Industry leaders follow these proven strategies:

### Practice 1: Start with Assessment
Before implementing any solution, thoroughly assess your current state. This includes:
- Identifying pain points
- Measuring baseline metrics
- Setting clear objectives
- Allocating appropriate resources

### Practice 2: Pilot Before Scaling
Smart organizations test new approaches on a small scale first. This reduces risk and allows for:
- Quick iteration based on feedback
- Cost-effective learning
- Proof of concept before major investment

### Practice 3: Measure and Optimize
Continuous improvement requires:
- Regular performance tracking
- A/B testing different approaches
- Data analysis and insights
- Agile adaptation to results

## Real-World Success Stories

**Case Study 1: Mid-Size Enterprise**
A company in the ${blog.niche} space implemented these strategies and saw:
- 45% increase in efficiency
- 30% cost reduction
- 2x ROI within 12 months

**Case Study 2: Startup Success**
An early-stage company leveraged these principles to:
- Scale from 5 to 50 employees
- Achieve profitability in 18 months
- Secure Series A funding

## Implementation Guide

Ready to get started? Follow these steps:

1. **Week 1-2**: Assessment phase
   - Audit current capabilities
   - Identify gaps and opportunities
   - Set measurable KPIs

2. **Month 1**: Planning and preparation
   - Develop detailed roadmap
   - Secure stakeholder buy-in
   - Allocate budget and resources

3. **Month 2-3**: Pilot implementation
   - Start with one department/area
   - Train team thoroughly
   - Monitor closely and adjust

4. **Month 4-6**: Scale and optimize
   - Expand successful initiatives
   - Refine based on learnings
   - Build long-term capabilities

## Key Takeaways

Success in ${blog.niche} requires:
- Strategic thinking combined with practical action
- Data-driven decision making
- Continuous learning and adaptation
- Focus on measurable results

## Conclusion

The landscape is changing rapidly, but the fundamentals remain constant. Organizations that invest in the right strategies, measure results, and adapt quickly will thrive.

Start with one area, measure impact, and scale what works. The future belongs to those who act today.`,
      author: 'AI Content Team'
    };
  }

  /**
   * Generate mock SEO (fallback when no API key)
   */
  generateMockSEO(blog, title) {
    const slug = title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .split('-')
      .slice(0, 6)
      .join('-');

    // Handle both array and object formats for seoKeywords
    const keywords = Array.isArray(blog.contentStrategy.seoKeywords) 
      ? blog.contentStrategy.seoKeywords 
      : Object.keys(blog.contentStrategy.seoKeywords || {});

    return {
      description: `${title.substring(0, 145)}... | ${blog.name}`,
      tags: keywords.slice(0, 6),
      slug
    };
  }

  /**
   * Batch generate posts for multiple blogs
   */
  async generateBatch(numberOfPosts = 1) {
    const blogs = this.config.getAllBlogs();
    const results = [];

    console.log(`\n🚀 Batch generating ${numberOfPosts} post(s) for each of ${blogs.length} blogs...\n`);

    for (const blog of blogs) {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`📚 ${blog.name} (${blog.id})`);
      console.log(`${'='.repeat(60)}`);

      for (let i = 0; i < numberOfPosts; i++) {
        try {
          const result = await this.generatePost(blog.id);
          results.push(result);
          
          // Respect rate limits (if using real API)
          if (this.apiKey && i < numberOfPosts - 1) {
            console.log('⏳ Waiting 2s to respect rate limits...');
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
        } catch (error) {
          console.error(`❌ Failed to generate post for ${blog.name}:`, error.message);
        }
      }
    }

    // Summary
    console.log(`\n${'='.repeat(60)}`);
    console.log(`✅ Batch Complete!`);
    console.log(`${'='.repeat(60)}`);
    console.log(`📊 Generated: ${results.length} posts`);
    console.log(`📁 Location: ${__dirname}/../output/`);
    
    const totalWords = results.reduce((sum, r) => sum + (r.metadata?.wordCount || 0), 0);
    console.log(`📝 Total words: ${totalWords.toLocaleString()}`);
    console.log(`⏱️  Avg reading time: ${Math.round(results.reduce((sum, r) => {
      const time = parseInt(r.metadata?.readingTime || '0');
      return sum + time;
    }, 0) / results.length)} min`);

    return results;
  }
}

module.exports = OpenAIContentPipeline;

// Test if run directly
if (require.main === module) {
  const pipeline = new OpenAIContentPipeline();
  
  const args = process.argv.slice(2);
  const command = args[0] || 'single';
  
  if (command === 'batch') {
    const count = parseInt(args[1]) || 1;
    pipeline.generateBatch(count)
      .then(results => {
        console.log('\n🎉 All done! Check the output/ directory.');
        process.exit(0);
      })
      .catch(error => {
        console.error('\n❌ Batch generation failed:', error);
        process.exit(1);
      });
  } else {
    // Generate single post for first blog
    const blogId = args[0] || 'ai-business-insights';
    pipeline.generatePost(blogId)
      .then(result => {
        console.log('\n🎉 Success! Open the file to view your professional blog post.');
        process.exit(0);
      })
      .catch(error => {
        console.error('\n❌ Generation failed:', error);
        process.exit(1);
      });
  }
}
