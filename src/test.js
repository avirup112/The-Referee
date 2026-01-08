import { Referee } from './index.js';

async function runTests() {
  console.log('🏆 Testing The Referee...\n');
  
  const referee = new Referee();

  // Test 1: API Comparison
  console.log('📊 Test 1: API Comparison');
  try {
    const apiResult = await referee.compareAPIs([
      {
        name: 'JSONPlaceholder API',
        endpoint: 'https://jsonplaceholder.typicode.com/posts',
        type: 'REST',
        rateLimits: { requests: 1000, window: 'hour' },
        pricing: { free: true, cost: 0 }
      },
      {
        name: 'GitHub GraphQL API',
        endpoint: 'https://api.github.com/graphql',
        type: 'GraphQL',
        rateLimits: { requests: 5000, window: 'hour' },
        pricing: { free: false, cost: 25 }
      }
    ]);
    
    console.log('✅ API Comparison successful');
    console.log(`Recommended: ${apiResult.recommendation.choice?.name || 'None'}`);
    console.log(`Reason: ${apiResult.recommendation.reason}\n`);
  } catch (error) {
    console.log('❌ API Comparison failed:', error.message, '\n');
  }

  // Test 2: Cloud Service Comparison
  console.log('☁️ Test 2: Cloud Service Comparison');
  try {
    const cloudResult = await referee.compareCloudServices([
      {
        name: 'AWS EC2',
        provider: 'AWS',
        type: 'compute',
        estimatedUsage: 100
      },
      {
        name: 'Azure VM',
        provider: 'Azure',
        type: 'compute',
        estimatedUsage: 100
      },
      {
        name: 'Google Compute Engine',
        provider: 'GCP',
        type: 'compute',
        estimatedUsage: 100
      }
    ]);
    
    console.log('✅ Cloud Service Comparison successful');
    console.log(`Recommended: ${cloudResult.recommendation.choice?.provider || 'None'}`);
    console.log(`Monthly Cost: $${cloudResult.recommendation.choice?.estimatedCost.monthly.toFixed(2) || 'N/A'}`);
    console.log(`Reason: ${cloudResult.recommendation.reason}\n`);
  } catch (error) {
    console.log('❌ Cloud Service Comparison failed:', error.message, '\n');
  }

  // Test 3: Tech Stack Recommendation
  console.log('🛠️ Test 3: Tech Stack Recommendation');
  try {
    const techStackResult = await referee.recommendTechStack({
      projectType: 'web_app',
      teamExperience: 'intermediate',
      timeline: 'normal',
      budget: 'medium',
      teamSize: 4
    });
    
    console.log('✅ Tech Stack Recommendation successful');
    console.log(`Recommended: ${techStackResult.recommendation.choice?.name || 'None'}`);
    console.log(`Technologies: ${techStackResult.recommendation.choice?.technologies.join(', ') || 'N/A'}`);
    console.log(`Reason: ${techStackResult.recommendation.reason}\n`);
  } catch (error) {
    console.log('❌ Tech Stack Recommendation failed:', error.message, '\n');
  }

  // Test 4: General Comparison
  console.log('⚖️ Test 4: General Comparison');
  try {
    const generalResult = await referee.compareOptions([
      { name: 'Option A', cost: 100, performance: 8, ease_of_use: 6 },
      { name: 'Option B', cost: 150, performance: 6, ease_of_use: 9 },
      { name: 'Option C', cost: 80, performance: 7, ease_of_use: 7 }
    ], ['performance', 'cost', 'ease_of_use']);
    
    console.log('✅ General Comparison successful');
    console.log(`Recommended: ${generalResult.recommendation.choice?.name || 'None'}`);
    console.log(`Score: ${generalResult.recommendation.choice?.totalScore.toFixed(2) || 'N/A'}`);
    console.log(`Reason: ${generalResult.recommendation.reason}\n`);
  } catch (error) {
    console.log('❌ General Comparison failed:', error.message, '\n');
  }

  console.log('🎉 All tests completed!');
}

// Run tests if this file is executed directly
runTests().catch(console.error);

export { runTests };