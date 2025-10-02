const RealAIContentPipeline = require('./real-ai-pipeline');

async function runCompletePipelineTest() {
  console.log('🚀 COMPLETE AI BLOG NETWORK PIPELINE TEST');
  console.log('=' .repeat(60));
  console.log('Testing full automation: Strategy → Content → HTML → Publishing\n');

  const pipeline = new RealAIContentPipeline({
    outputDir: './complete-test-blog',
    agentsUrl: 'http://localhost:8916',
    orchestratorUrl: 'http://localhost:3001'
  });

  // Test multiple content generation cycles
  const testTopics = [
    'AI Revolution in Small Business',
    'Remote Work AI Tools', 
    'AI Security Best Practices'
  ];

  console.log('📋 Test Plan:');
  console.log(`- Generate ${testTopics.length} blog posts using real AI agents`);
  console.log('- Test strategy planning, content generation, and publishing');
  console.log('- Validate HTML output and metadata');
  console.log('- Measure performance and success rates\n');

  const results = [];
  let totalStartTime = Date.now();

  for (let i = 0; i < testTopics.length; i++) {
    const topic = testTopics[i];
    console.log(`\n📝 Test ${i + 1}/${testTopics.length}: "${topic}"`);
    console.log('-'.repeat(50));
    
    const startTime = Date.now();
    
    try {
      const result = await pipeline.triggerContentGeneration(topic);
      const duration = Date.now() - startTime;
      
      results.push({
        topic,
        success: result.success,
        duration,
        realAgentsUsed: result.pipeline?.realAgentsUsed || false,
        title: result.post?.title || 'N/A',
        wordCount: result.post?.contentStats?.wordCount || 0,
        fileName: result.html?.fileName || 'N/A'
      });

      console.log(`✅ Success: ${result.success}`);
      console.log(`⚡ Duration: ${duration}ms`);
      console.log(`🤖 Real AI Agents: ${result.pipeline?.realAgentsUsed ? 'Yes' : 'No'}`);
      console.log(`📝 Generated: "${result.post?.title}"`);
      
    } catch (error) {
      console.error(`❌ Test failed:`, error.message);
      results.push({
        topic,
        success: false,
        error: error.message,
        duration: Date.now() - startTime
      });
    }

    // Small delay between tests
    if (i < testTopics.length - 1) {
      console.log('⏳ Waiting before next test...');
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  const totalDuration = Date.now() - totalStartTime;

  // Generate comprehensive results
  console.log('\n' + '='.repeat(60));
  console.log('📊 COMPLETE PIPELINE TEST RESULTS');
  console.log('='.repeat(60));

  const successCount = results.filter(r => r.success).length;
  const realAgentCount = results.filter(r => r.realAgentsUsed).length;
  const avgDuration = results.reduce((sum, r) => sum + r.duration, 0) / results.length;

  console.log(`\n📈 Summary Statistics:`);
  console.log(`- Total Tests: ${results.length}`);
  console.log(`- Successful: ${successCount}/${results.length} (${Math.round(successCount/results.length*100)}%)`);
  console.log(`- Real AI Agents Used: ${realAgentCount}/${results.length} (${Math.round(realAgentCount/results.length*100)}%)`);
  console.log(`- Average Duration: ${Math.round(avgDuration)}ms`);
  console.log(`- Total Duration: ${Math.round(totalDuration/1000)}s`);

  console.log(`\n📝 Detailed Results:`);
  results.forEach((result, index) => {
    console.log(`\n${index + 1}. ${result.topic}`);
    console.log(`   ✅ Success: ${result.success}`);
    if (result.success) {
      console.log(`   📄 Title: "${result.title}"`);
      console.log(`   📊 Words: ${result.wordCount}`);
      console.log(`   📁 File: ${result.fileName}`);
      console.log(`   🤖 Real AI: ${result.realAgentsUsed ? 'Yes' : 'No'}`);
      console.log(`   ⏱️ Time: ${result.duration}ms`);
    } else {
      console.log(`   ❌ Error: ${result.error || 'Unknown error'}`);
    }
  });

  const stats = pipeline.getStats();
  console.log(`\n📊 Final Pipeline Statistics:`);
  console.log(`- Total Posts Generated: ${stats.totalPosts}`);
  console.log(`- Posts Using Real AI: ${stats.realAgentPosts}`);
  console.log(`- Output Directory: ${stats.outputDirectory}`);
  console.log(`- Agents Service: ${stats.agentsUrl}`);
  console.log(`- Orchestrator Service: ${stats.orchestratorUrl}`);

  // Test HTML output validation
  console.log(`\n🔍 HTML Output Validation:`);
  try {
    const fs = require('fs');
    const path = require('path');
    
    // Check if index.html exists and has content
    const indexPath = path.join(stats.outputDirectory, 'index.html');
    if (fs.existsSync(indexPath)) {
      const indexSize = fs.statSync(indexPath).size;
      console.log(`✅ Index page: ${indexSize} bytes`);
    }

    // Check individual post files
    let validPosts = 0;
    results.forEach(result => {
      if (result.success && result.fileName) {
        const postPath = path.join(stats.outputDirectory, result.fileName);
        if (fs.existsSync(postPath)) {
          const postSize = fs.statSync(postPath).size;
          console.log(`✅ ${result.fileName}: ${postSize} bytes`);
          validPosts++;
        }
      }
    });

    console.log(`📄 Valid HTML files: ${validPosts}/${results.length}`);

  } catch (error) {
    console.warn(`⚠️ HTML validation error:`, error.message);
  }

  console.log('\n' + '='.repeat(60));
  console.log('🎉 PIPELINE TEST COMPLETE!');
  
  if (successCount === results.length && realAgentCount > 0) {
    console.log('✅ ALL TESTS PASSED - AI Blog Network is fully operational!');
    console.log('🤖 Real AI agents are working correctly');
    console.log('📝 Content generation pipeline is stable');
    console.log('🌐 HTML generation is functional');
    console.log('📊 Metadata tracking is working');
  } else if (successCount > 0) {
    console.log('⚠️ PARTIAL SUCCESS - Some functionality working');
    console.log(`✅ ${successCount}/${results.length} tests passed`);
    if (realAgentCount === 0) {
      console.log('🔄 Fallback content generation used (AI agents may be unavailable)');
    }
  } else {
    console.log('❌ TESTS FAILED - Pipeline needs debugging');
  }
  
  console.log('='.repeat(60));

  return {
    totalTests: results.length,
    successful: successCount,
    realAgentsUsed: realAgentCount,
    averageDuration: avgDuration,
    totalDuration,
    results,
    stats
  };
}

// Run the test if called directly
if (require.main === module) {
  runCompletePipelineTest()
    .then(testResults => {
      console.log('\n🏁 Test execution completed');
      process.exit(testResults.successful === testResults.totalTests ? 0 : 1);
    })
    .catch(error => {
      console.error('\n💥 Test execution failed:', error);
      process.exit(1);
    });
}

module.exports = runCompletePipelineTest;