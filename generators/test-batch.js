const AIContentPipeline = require('./ai-content-pipeline');

async function testBatchGeneration() {
  console.log('🚀 Testing batch content generation...\n');
  
  const pipeline = new AIContentPipeline({
    outputDir: './batch-demo-blog'
  });

  // Generate 3 posts with different topics
  const topics = [
    'The ROI of Marketing Automation',
    'Future of Remote Work Technology', 
    'Cybersecurity in the Age of AI'
  ];

  try {
    const results = await pipeline.generateBatch(3, topics);
    
    console.log('\n📊 Final Results Summary:');
    console.log('='.repeat(50));
    
    results.forEach((result, index) => {
      console.log(`\nPost ${index + 1}:`);
      console.log(`✅ Success: ${result.success}`);
      if (result.success) {
        console.log(`📝 Title: ${result.post.title}`);
        console.log(`📄 File: ${result.html.fileName}`);
        console.log(`🏷️ Tags: ${result.post.tags.join(', ')}`);
        console.log(`📊 Words: ${result.post.contentStats.wordCount}`);
      } else {
        console.log(`❌ Error: ${result.error}`);
      }
    });

    const stats = pipeline.getStats();
    console.log('\n📈 Pipeline Statistics:');
    console.log('='.repeat(30));
    console.log(`Total Posts: ${stats.totalPosts}`);
    console.log(`Recent Posts (24h): ${stats.recentPosts}`);
    console.log(`Output Directory: ${stats.outputDirectory}`);
    console.log(`Last Generated: ${stats.lastGenerated}`);

  } catch (error) {
    console.error('❌ Batch generation failed:', error);
  }
}

testBatchGeneration();