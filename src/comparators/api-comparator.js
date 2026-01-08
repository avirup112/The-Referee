import axios from 'axios';

export class APIComparator {
  constructor() {
    this.defaultCriteria = [
      'performance',
      'reliability',
      'documentation',
      'rate_limits',
      'cost',
      'ease_of_integration'
    ];
  }

  async compare(apis, options = {}) {
    const criteria = options.criteria || this.defaultCriteria;
    const enhancedAPIs = await this.enhanceAPIData(apis);
    
    const comparison = await this.evaluateAPIs(enhancedAPIs, criteria, options.constraints);
    
    return {
      apis: comparison,
      recommendation: this.selectBestAPI(comparison, options.constraints),
      tradeoffAnalysis: this.analyzeAPITradeoffs(comparison),
      useCaseRecommendations: this.generateUseCaseRecommendations(comparison)
    };
  }

  async enhanceAPIData(apis) {
    return Promise.all(apis.map(async (api) => {
      const healthCheck = await this.checkAPIHealth(api);
      const features = await this.detectAPIFeatures(api);
      
      return {
        ...api,
        health: healthCheck,
        features,
        type: this.detectAPIType(api),
        lastChecked: new Date().toISOString()
      };
    }));
  }

  async checkAPIHealth(api) {
    try {
      const start = Date.now();
      const response = await axios.get(api.endpoint, { 
        timeout: 5000,
        headers: api.headers || {}
      });
      const responseTime = Date.now() - start;
      
      return {
        status: 'healthy',
        responseTime,
        statusCode: response.status,
        available: true
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        responseTime: null,
        statusCode: error.response?.status || 0,
        available: false,
        error: error.message
      };
    }
  }

  async detectAPIFeatures(api) {
    const features = [];
    
    // Detect REST vs GraphQL
    if (api.endpoint.includes('graphql') || api.type === 'graphql') {
      features.push('graphql', 'flexible_queries', 'single_endpoint');
    } else {
      features.push('rest', 'multiple_endpoints', 'cacheable');
    }

    // Check for authentication
    if (api.headers?.Authorization || api.apiKey) {
      features.push('authentication_required');
    }

    // Check for real-time capabilities
    if (api.websocket || api.sse) {
      features.push('real_time');
    }

    return features;
  }

  detectAPIType(api) {
    if (api.endpoint.includes('graphql')) return 'GraphQL';
    if (api.endpoint.includes('grpc')) return 'gRPC';
    return 'REST';
  }

  async evaluateAPIs(apis, criteria, constraints = {}) {
    return Promise.all(apis.map(async (api) => {
      const scores = {};
      
      for (const criterion of criteria) {
        scores[criterion] = await this.evaluateAPICriterion(api, criterion, constraints);
      }

      const totalScore = Object.values(scores).reduce((sum, score) => sum + score.weighted, 0);
      
      return {
        ...api,
        scores,
        totalScore,
        pros: this.generatePros(api, scores),
        cons: this.generateCons(api, scores),
        bestFor: this.generateBestForScenarios(api, scores)
      };
    }));
  }

  async evaluateAPICriterion(api, criterion, constraints) {
    let score = 5; // Default middle score
    let explanation = '';

    switch (criterion) {
      case 'performance':
        if (api.health.available) {
          score = api.health.responseTime < 200 ? 9 : 
                  api.health.responseTime < 500 ? 7 : 
                  api.health.responseTime < 1000 ? 5 : 3;
          explanation = `Response time: ${api.health.responseTime}ms`;
        } else {
          score = 1;
          explanation = 'API unavailable during testing';
        }
        break;

      case 'reliability':
        score = api.health.available ? 
                (api.health.statusCode === 200 ? 8 : 6) : 2;
        explanation = api.health.available ? 
                     'API responding normally' : 'API experiencing issues';
        break;

      case 'documentation':
        // Simulate documentation quality assessment
        score = api.type === 'GraphQL' ? 8 : 
                api.type === 'REST' ? 7 : 6;
        explanation = `${api.type} APIs typically have ${score > 7 ? 'excellent' : 'good'} documentation`;
        break;

      case 'rate_limits':
        score = api.rateLimits ? 
                (api.rateLimits.requests > 1000 ? 8 : 6) : 5;
        explanation = api.rateLimits ? 
                     `${api.rateLimits.requests} requests per ${api.rateLimits.window}` : 
                     'Rate limits not specified';
        break;

      case 'cost':
        score = api.pricing ? 
                (api.pricing.free ? 9 : 
                 api.pricing.cost < 50 ? 7 : 5) : 6;
        explanation = api.pricing ? 
                     `$${api.pricing.cost}/month` : 
                     'Pricing information not available';
        break;

      case 'ease_of_integration':
        score = api.type === 'REST' ? 8 : 
                api.type === 'GraphQL' ? 6 : 5;
        explanation = `${api.type} integration complexity`;
        break;
    }

    const weight = constraints.weights?.[criterion] || 0.16; // Equal weights by default
    
    return {
      raw: score,
      weighted: score * weight,
      explanation
    };
  }

  generatePros(api, scores) {
    const pros = [];
    
    Object.entries(scores).forEach(([criterion, score]) => {
      if (score.raw >= 7) {
        pros.push(`Strong ${criterion.replace('_', ' ')}: ${score.explanation}`);
      }
    });

    if (api.features.includes('real_time')) pros.push('Real-time capabilities');
    if (api.features.includes('graphql')) pros.push('Flexible query language');
    if (api.health.available) pros.push('Currently available and responsive');

    return pros;
  }

  generateCons(api, scores) {
    const cons = [];
    
    // Add cons based on scores (more realistic thresholds)
    Object.entries(scores).forEach(([criterion, score]) => {
      if (score.raw <= 5) {
        cons.push(`Limited ${criterion.replace('_', ' ')}: ${score.explanation}`);
      }
    });

    // Add specific API-related cons
    if (!api.health.available) {
      cons.push('API currently unavailable or experiencing issues');
    }
    
    if (api.features.includes('authentication_required')) {
      cons.push('Requires authentication setup and API key management');
    }
    
    if (api.type === 'GraphQL') {
      cons.push('Steeper learning curve compared to REST APIs');
      cons.push('May be overkill for simple data fetching');
    }
    
    if (api.type === 'REST') {
      cons.push('Multiple endpoints to manage and document');
      cons.push('Less flexible than GraphQL for complex queries');
    }
    
    if (api.rateLimits && api.rateLimits.requests < 1000) {
      cons.push(`Low rate limits: ${api.rateLimits.requests} requests per ${api.rateLimits.window}`);
    }
    
    if (api.pricing && !api.pricing.free) {
      cons.push(`Paid service: $${api.pricing.cost}/month cost consideration`);
    }

    // Ensure at least one con for realistic comparison
    if (cons.length === 0) {
      cons.push('May require additional integration effort');
      cons.push('Performance depends on network conditions');
    }

    return cons;
  }

  generateBestForScenarios(api, scores) {
    const scenarios = [];
    
    if (scores.performance?.raw >= 8) scenarios.push('High-performance applications');
    if (scores.cost?.raw >= 8) scenarios.push('Budget-conscious projects');
    if (api.features.includes('graphql')) scenarios.push('Complex data fetching requirements');
    if (api.features.includes('real_time')) scenarios.push('Real-time applications');
    if (scores.ease_of_integration?.raw >= 7) scenarios.push('Rapid prototyping');

    return scenarios;
  }

  selectBestAPI(apis, constraints = {}) {
    const validAPIs = apis.filter(api => api.health.available);
    
    if (validAPIs.length === 0) {
      return {
        choice: null,
        reason: 'No APIs are currently available',
        alternatives: apis.slice(0, 2)
      };
    }

    const topAPI = validAPIs.reduce((best, current) => 
      current.totalScore > best.totalScore ? current : best
    );

    return {
      choice: topAPI,
      reason: `Best overall performance with score ${topAPI.totalScore.toFixed(2)}`,
      confidence: this.calculateConfidence(topAPI, validAPIs),
      alternatives: validAPIs.filter(api => api !== topAPI).slice(0, 2)
    };
  }

  calculateConfidence(topAPI, allAPIs) {
    if (allAPIs.length < 2) return 1.0;
    
    const scores = allAPIs.map(api => api.totalScore).sort((a, b) => b - a);
    const scoreDiff = scores[0] - scores[1];
    
    return Math.min(0.6 + (scoreDiff / 10), 1.0);
  }

  analyzeAPITradeoffs(apis) {
    const tradeoffs = [];
    
    // Performance vs Cost tradeoff
    const highPerf = apis.filter(api => api.scores.performance?.raw >= 7);
    const lowCost = apis.filter(api => api.scores.cost?.raw >= 7);
    
    if (highPerf.length > 0 && lowCost.length > 0) {
      tradeoffs.push({
        type: 'performance_vs_cost',
        description: 'Higher performance APIs typically cost more',
        highPerformance: highPerf.map(api => api.name),
        lowCost: lowCost.map(api => api.name)
      });
    }

    // Flexibility vs Simplicity
    const graphqlAPIs = apis.filter(api => api.type === 'GraphQL');
    const restAPIs = apis.filter(api => api.type === 'REST');
    
    if (graphqlAPIs.length > 0 && restAPIs.length > 0) {
      tradeoffs.push({
        type: 'flexibility_vs_simplicity',
        description: 'GraphQL offers more flexibility but REST is simpler to implement',
        flexible: graphqlAPIs.map(api => api.name),
        simple: restAPIs.map(api => api.name)
      });
    }

    return tradeoffs;
  }

  generateUseCaseRecommendations(apis) {
    return {
      'High Traffic Applications': apis
        .filter(api => api.scores.performance?.raw >= 7)
        .map(api => api.name),
      
      'Budget Projects': apis
        .filter(api => api.scores.cost?.raw >= 7)
        .map(api => api.name),
      
      'Complex Data Requirements': apis
        .filter(api => api.features.includes('graphql'))
        .map(api => api.name),
      
      'Real-time Features': apis
        .filter(api => api.features.includes('real_time'))
        .map(api => api.name),
      
      'Quick Prototypes': apis
        .filter(api => api.scores.ease_of_integration?.raw >= 7)
        .map(api => api.name)
    };
  }
}