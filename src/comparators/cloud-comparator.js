export class CloudServiceComparator {
  constructor() {
    this.defaultCriteria = [
      'cost_efficiency',
      'performance',
      'scalability',
      'reliability',
      'ease_of_use',
      'feature_completeness',
      'vendor_lock_in'
    ];

    this.serviceProfiles = {
      'AWS': {
        strengths: ['feature_completeness', 'scalability', 'reliability'],
        weaknesses: ['cost_efficiency', 'ease_of_use'],
        marketShare: 0.32,
        regions: 25
      },
      'Azure': {
        strengths: ['enterprise_integration', 'hybrid_cloud', 'cost_efficiency'],
        weaknesses: ['learning_curve'],
        marketShare: 0.20,
        regions: 22
      },
      'GCP': {
        strengths: ['performance', 'ai_ml', 'cost_efficiency'],
        weaknesses: ['feature_completeness', 'enterprise_features'],
        marketShare: 0.09,
        regions: 20
      }
    };
  }

  async compare(services, options = {}) {
    const criteria = options.criteria || this.defaultCriteria;
    const enhancedServices = this.enhanceServiceData(services);
    
    const comparison = await this.evaluateServices(enhancedServices, criteria, options.constraints);
    
    return {
      services: comparison,
      recommendation: this.selectBestService(comparison, options.constraints),
      costAnalysis: this.analyzeCosts(comparison, options.constraints),
      migrationConsiderations: this.analyzeMigration(comparison),
      vendorLockInAnalysis: this.analyzeVendorLockIn(comparison)
    };
  }

  enhanceServiceData(services) {
    return services.map(service => {
      const profile = this.serviceProfiles[service.provider] || {};
      
      return {
        ...service,
        profile,
        estimatedCost: this.estimateCost(service),
        features: this.mapFeatures(service),
        compliance: this.getComplianceInfo(service.provider)
      };
    });
  }

  estimateCost(service) {
    // Simplified cost estimation based on service type and usage
    const baseCosts = {
      'compute': { aws: 0.10, azure: 0.096, gcp: 0.095 },
      'storage': { aws: 0.023, azure: 0.020, gcp: 0.020 },
      'database': { aws: 0.15, azure: 0.14, gcp: 0.13 },
      'networking': { aws: 0.09, azure: 0.087, gcp: 0.085 }
    };

    const provider = service.provider.toLowerCase();
    const serviceType = service.type || 'compute';
    const usage = service.estimatedUsage || 100; // hours/month

    const hourlyRate = baseCosts[serviceType]?.[provider] || 0.10;
    return {
      monthly: hourlyRate * usage,
      yearly: hourlyRate * usage * 12,
      breakdown: {
        compute: hourlyRate * usage * 0.6,
        storage: hourlyRate * usage * 0.2,
        networking: hourlyRate * usage * 0.2
      }
    };
  }

  mapFeatures(service) {
    const commonFeatures = {
      'AWS': ['ec2', 'lambda', 's3', 'rds', 'vpc', 'iam', 'cloudwatch'],
      'Azure': ['vm', 'functions', 'blob', 'sql', 'vnet', 'ad', 'monitor'],
      'GCP': ['compute', 'functions', 'storage', 'sql', 'vpc', 'iam', 'monitoring']
    };

    return commonFeatures[service.provider] || [];
  }

  getComplianceInfo(provider) {
    const compliance = {
      'AWS': ['SOC', 'ISO27001', 'GDPR', 'HIPAA', 'PCI-DSS'],
      'Azure': ['SOC', 'ISO27001', 'GDPR', 'HIPAA', 'FedRAMP'],
      'GCP': ['SOC', 'ISO27001', 'GDPR', 'HIPAA', 'PCI-DSS']
    };

    return compliance[provider] || [];
  }

  async evaluateServices(services, criteria, constraints = {}) {
    return Promise.all(services.map(async (service) => {
      const scores = {};
      
      for (const criterion of criteria) {
        scores[criterion] = await this.evaluateServiceCriterion(service, criterion, constraints);
      }

      const totalScore = Object.values(scores).reduce((sum, score) => sum + score.weighted, 0);
      
      return {
        ...service,
        scores,
        totalScore,
        strengths: this.identifyStrengths(service, scores),
        weaknesses: this.identifyWeaknesses(service, scores),
        useCases: this.generateUseCases(service, scores)
      };
    }));
  }

  async evaluateServiceCriterion(service, criterion, constraints) {
    let score = 5;
    let explanation = '';

    switch (criterion) {
      case 'cost_efficiency':
        const monthlyCost = service.estimatedCost.monthly;
        score = monthlyCost < 100 ? 9 : 
                monthlyCost < 300 ? 7 : 
                monthlyCost < 500 ? 5 : 3;
        explanation = `Estimated monthly cost: $${monthlyCost.toFixed(2)}`;
        break;

      case 'performance':
        const perfScore = service.profile.strengths?.includes('performance') ? 8 : 6;
        score = service.provider === 'GCP' ? 8 : 
                service.provider === 'AWS' ? 7 : 6;
        explanation = `${service.provider} performance characteristics`;
        break;

      case 'scalability':
        score = service.profile.strengths?.includes('scalability') ? 9 : 7;
        explanation = `Auto-scaling and global infrastructure capabilities`;
        break;

      case 'reliability':
        score = service.profile.marketShare > 0.2 ? 8 : 
                service.profile.marketShare > 0.1 ? 7 : 6;
        explanation = `Market presence and SLA guarantees`;
        break;

      case 'ease_of_use':
        score = service.profile.weaknesses?.includes('ease_of_use') ? 5 : 
                service.provider === 'Azure' ? 7 : 6;
        explanation = `Learning curve and management complexity`;
        break;

      case 'feature_completeness':
        score = service.profile.strengths?.includes('feature_completeness') ? 9 : 
                service.features.length > 5 ? 7 : 5;
        explanation = `Available services and integrations`;
        break;

      case 'vendor_lock_in':
        score = service.provider === 'AWS' ? 4 : 
                service.provider === 'Azure' ? 5 : 6;
        explanation = `Portability and open standards support`;
        break;
    }

    const weight = constraints.weights?.[criterion] || (1 / this.defaultCriteria.length);
    
    return {
      raw: score,
      weighted: score * weight,
      explanation
    };
  }

  identifyStrengths(service, scores) {
    const strengths = [];
    
    Object.entries(scores).forEach(([criterion, score]) => {
      if (score.raw >= 7) {
        strengths.push(criterion.replace('_', ' '));
      }
    });

    // Add profile-based strengths
    if (service.profile.strengths) {
      strengths.push(...service.profile.strengths.map(s => s.replace('_', ' ')));
    }

    return [...new Set(strengths)]; // Remove duplicates
  }

  identifyWeaknesses(service, scores) {
    const weaknesses = [];
    
    // Add weaknesses based on scores (more realistic thresholds)
    Object.entries(scores).forEach(([criterion, score]) => {
      if (score.raw <= 5) {
        weaknesses.push(`Limited ${criterion.replace('_', ' ')}`);
      }
    });

    // Add provider-specific weaknesses
    if (service.provider === 'AWS') {
      weaknesses.push('Complex pricing structure');
      weaknesses.push('Steep learning curve for beginners');
      weaknesses.push('High vendor lock-in risk');
    }
    
    if (service.provider === 'Azure') {
      weaknesses.push('Less mature than AWS in some areas');
      weaknesses.push('Documentation can be inconsistent');
    }
    
    if (service.provider === 'GCP') {
      weaknesses.push('Smaller market share and community');
      weaknesses.push('Fewer third-party integrations');
      weaknesses.push('Limited enterprise features compared to AWS');
    }

    // Add profile-based weaknesses
    if (service.profile.weaknesses) {
      weaknesses.push(...service.profile.weaknesses.map(w => w.replace('_', ' ')));
    }

    // Cost-related weaknesses
    if (service.estimatedCost.monthly > 150) {
      weaknesses.push('Higher monthly costs');
    }

    // Ensure at least one weakness for realistic comparison
    if (weaknesses.length === 0) {
      weaknesses.push('Requires cloud expertise for optimization');
      weaknesses.push('Ongoing management and monitoring needed');
    }

    return [...new Set(weaknesses)];
  }

  generateUseCases(service, scores) {
    const useCases = [];
    
    if (scores.cost_efficiency?.raw >= 7) useCases.push('Cost-sensitive projects');
    if (scores.performance?.raw >= 7) useCases.push('High-performance applications');
    if (scores.scalability?.raw >= 8) useCases.push('Rapidly growing applications');
    if (scores.feature_completeness?.raw >= 8) useCases.push('Complex enterprise solutions');
    if (service.compliance.includes('HIPAA')) useCases.push('Healthcare applications');
    if (service.compliance.includes('FedRAMP')) useCases.push('Government projects');

    return useCases;
  }

  selectBestService(services, constraints = {}) {
    let validServices = services;

    // Apply hard constraints
    if (constraints.maxMonthlyCost) {
      validServices = validServices.filter(s => 
        s.estimatedCost.monthly <= constraints.maxMonthlyCost
      );
    }

    if (constraints.requiredCompliance) {
      validServices = validServices.filter(s => 
        constraints.requiredCompliance.every(comp => s.compliance.includes(comp))
      );
    }

    if (validServices.length === 0) {
      return {
        choice: null,
        reason: 'No services meet the specified constraints',
        alternatives: services.slice(0, 2)
      };
    }

    const topService = validServices.reduce((best, current) => 
      current.totalScore > best.totalScore ? current : best
    );

    return {
      choice: topService,
      reason: `Best fit for requirements with score ${topService.totalScore.toFixed(2)}`,
      confidence: this.calculateConfidence(topService, validServices),
      costSavings: this.calculateSavings(topService, validServices)
    };
  }

  calculateConfidence(topService, allServices) {
    if (allServices.length < 2) return 1.0;
    
    const scores = allServices.map(s => s.totalScore).sort((a, b) => b - a);
    const scoreDiff = scores[0] - scores[1];
    
    return Math.min(0.6 + (scoreDiff / 5), 1.0);
  }

  calculateSavings(chosenService, allServices) {
    const costs = allServices.map(s => s.estimatedCost.monthly);
    const maxCost = Math.max(...costs);
    const savings = maxCost - chosenService.estimatedCost.monthly;
    
    return {
      monthly: savings,
      yearly: savings * 12,
      percentage: (savings / maxCost) * 100
    };
  }

  analyzeCosts(services, constraints = {}) {
    const costs = services.map(s => ({
      provider: s.provider,
      monthly: s.estimatedCost.monthly,
      yearly: s.estimatedCost.yearly
    }));

    const cheapest = costs.reduce((min, current) => 
      current.monthly < min.monthly ? current : min
    );

    const mostExpensive = costs.reduce((max, current) => 
      current.monthly > max.monthly ? current : max
    );

    return {
      range: {
        min: cheapest.monthly,
        max: mostExpensive.monthly,
        difference: mostExpensive.monthly - cheapest.monthly
      },
      cheapest: cheapest.provider,
      mostExpensive: mostExpensive.provider,
      averageMonthlyCost: costs.reduce((sum, c) => sum + c.monthly, 0) / costs.length,
      costBreakdown: services.map(s => ({
        provider: s.provider,
        breakdown: s.estimatedCost.breakdown
      }))
    };
  }

  analyzeMigration(services) {
    return {
      easiestToMigrateTo: services
        .filter(s => s.scores.vendor_lock_in?.raw >= 6)
        .map(s => s.provider),
      
      migrationComplexity: services.map(s => ({
        provider: s.provider,
        complexity: s.scores.vendor_lock_in?.raw < 5 ? 'High' : 
                   s.scores.vendor_lock_in?.raw < 7 ? 'Medium' : 'Low',
        timeEstimate: s.scores.vendor_lock_in?.raw < 5 ? '6-12 months' : 
                     s.scores.vendor_lock_in?.raw < 7 ? '3-6 months' : '1-3 months'
      })),
      
      recommendations: [
        'Use containerization to reduce vendor lock-in',
        'Implement infrastructure as code for easier migration',
        'Choose services with open standards when possible'
      ]
    };
  }

  analyzeVendorLockIn(services) {
    return {
      riskLevels: services.map(s => ({
        provider: s.provider,
        risk: s.scores.vendor_lock_in?.raw < 5 ? 'High' : 
              s.scores.vendor_lock_in?.raw < 7 ? 'Medium' : 'Low',
        score: s.scores.vendor_lock_in?.raw
      })),
      
      mitigationStrategies: {
        'High Risk': [
          'Use multi-cloud architecture',
          'Implement abstraction layers',
          'Regular migration testing'
        ],
        'Medium Risk': [
          'Monitor proprietary service usage',
          'Maintain portable data formats',
          'Document dependencies'
        ],
        'Low Risk': [
          'Continue with standard practices',
          'Periodic architecture review'
        ]
      }
    };
  }
}