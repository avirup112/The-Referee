export class TechStackComparator {
  constructor() {
    this.techStacks = {
      'MEAN': {
        technologies: ['MongoDB', 'Express.js', 'Angular', 'Node.js'],
        strengths: ['javascript_everywhere', 'rapid_development', 'json_native'],
        weaknesses: ['callback_complexity', 'single_threaded'],
        learningCurve: 'medium',
        communitySize: 'large',
        jobMarket: 'excellent'
      },
      'MERN': {
        technologies: ['MongoDB', 'Express.js', 'React', 'Node.js'],
        strengths: ['component_based', 'virtual_dom', 'flexible'],
        weaknesses: ['jsx_learning', 'rapid_changes'],
        learningCurve: 'medium',
        communitySize: 'very_large',
        jobMarket: 'excellent'
      },
      'LAMP': {
        technologies: ['Linux', 'Apache', 'MySQL', 'PHP'],
        strengths: ['mature', 'cost_effective', 'widely_supported'],
        weaknesses: ['performance_limitations', 'security_concerns'],
        learningCurve: 'low',
        communitySize: 'large',
        jobMarket: 'good'
      },
      'Django_Stack': {
        technologies: ['Python', 'Django', 'PostgreSQL', 'Redis'],
        strengths: ['rapid_development', 'batteries_included', 'secure'],
        weaknesses: ['monolithic', 'python_gil'],
        learningCurve: 'low',
        communitySize: 'large',
        jobMarket: 'excellent'
      },
      'Spring_Boot': {
        technologies: ['Java', 'Spring Boot', 'PostgreSQL', 'Maven'],
        strengths: ['enterprise_ready', 'scalable', 'robust'],
        weaknesses: ['verbose', 'memory_intensive'],
        learningCurve: 'high',
        communitySize: 'very_large',
        jobMarket: 'excellent'
      },
      'Rails_Stack': {
        technologies: ['Ruby', 'Rails', 'PostgreSQL', 'Redis'],
        strengths: ['convention_over_config', 'rapid_prototyping', 'elegant'],
        weaknesses: ['performance', 'declining_popularity'],
        learningCurve: 'medium',
        communitySize: 'medium',
        jobMarket: 'good'
      }
    };

    this.criteria = [
      'development_speed',
      'performance',
      'scalability',
      'learning_curve',
      'community_support',
      'job_market',
      'maintenance_cost',
      'security'
    ];
  }

  async recommend(requirements) {
    const suitableStacks = this.filterStacksByRequirements(requirements);
    const evaluatedStacks = await this.evaluateStacks(suitableStacks, requirements);
    
    return {
      recommendation: this.selectBestStack(evaluatedStacks, requirements),
      alternatives: evaluatedStacks.slice(0, 3),
      comparison: evaluatedStacks,
      tradeoffAnalysis: this.analyzeStackTradeoffs(evaluatedStacks),
      implementationPlan: this.generateImplementationPlan(evaluatedStacks[0], requirements)
    };
  }

  filterStacksByRequirements(requirements) {
    let candidateStacks = Object.keys(this.techStacks);

    // Filter by project type
    if (requirements.projectType === 'web_app') {
      // All stacks are suitable for web apps
    } else if (requirements.projectType === 'api') {
      candidateStacks = candidateStacks.filter(stack => 
        !stack.includes('Angular') && !stack.includes('React')
      );
    } else if (requirements.projectType === 'enterprise') {
      candidateStacks = ['Spring_Boot', 'Django_Stack'];
    }

    // Filter by team experience
    if (requirements.teamExperience === 'beginner') {
      candidateStacks = candidateStacks.filter(stack => 
        this.techStacks[stack].learningCurve === 'low' ||
        this.techStacks[stack].learningCurve === 'medium'
      );
    }

    // Filter by timeline
    if (requirements.timeline === 'urgent') {
      candidateStacks = candidateStacks.filter(stack => 
        this.techStacks[stack].strengths.includes('rapid_development') ||
        this.techStacks[stack].strengths.includes('rapid_prototyping')
      );
    }

    return candidateStacks.map(name => ({
      name,
      ...this.techStacks[name]
    }));
  }

  async evaluateStacks(stacks, requirements) {
    return Promise.all(stacks.map(async (stack) => {
      const scores = {};
      
      for (const criterion of this.criteria) {
        scores[criterion] = await this.evaluateStackCriterion(stack, criterion, requirements);
      }

      const totalScore = Object.values(scores).reduce((sum, score) => sum + score.weighted, 0);
      
      return {
        ...stack,
        scores,
        totalScore,
        pros: this.generateStackPros(stack, scores),
        cons: this.generateStackCons(stack, scores),
        bestFor: this.generateBestForScenarios(stack)
      };
    }));
  }

  async evaluateStackCriterion(stack, criterion, requirements) {
    let score = 5;
    let explanation = '';

    switch (criterion) {
      case 'development_speed':
        if (stack.strengths.includes('rapid_development') || 
            stack.strengths.includes('rapid_prototyping')) {
          score = 8;
          explanation = 'Excellent for rapid development';
        } else if (stack.strengths.includes('convention_over_config')) {
          score = 7;
          explanation = 'Good development velocity';
        } else {
          score = 5;
          explanation = 'Standard development speed';
        }
        break;

      case 'performance':
        if (stack.name === 'Spring_Boot') {
          score = 8;
          explanation = 'High performance JVM-based';
        } else if (stack.weaknesses.includes('performance')) {
          score = 4;
          explanation = 'Known performance limitations';
        } else {
          score = 6;
          explanation = 'Adequate performance';
        }
        break;

      case 'scalability':
        if (stack.strengths.includes('scalable')) {
          score = 8;
          explanation = 'Designed for scale';
        } else if (stack.weaknesses.includes('monolithic')) {
          score = 5;
          explanation = 'Monolithic architecture challenges';
        } else {
          score = 6;
          explanation = 'Moderate scalability';
        }
        break;

      case 'learning_curve':
        const curveScore = {
          'low': 8,
          'medium': 6,
          'high': 3
        };
        score = curveScore[stack.learningCurve] || 5;
        explanation = `${stack.learningCurve} learning curve`;
        break;

      case 'community_support':
        const communityScore = {
          'very_large': 9,
          'large': 7,
          'medium': 5,
          'small': 3
        };
        score = communityScore[stack.communitySize] || 5;
        explanation = `${stack.communitySize} community`;
        break;

      case 'job_market':
        const jobScore = {
          'excellent': 9,
          'good': 7,
          'fair': 5,
          'poor': 3
        };
        score = jobScore[stack.jobMarket] || 5;
        explanation = `${stack.jobMarket} job market`;
        break;

      case 'maintenance_cost':
        if (stack.strengths.includes('cost_effective')) {
          score = 8;
          explanation = 'Low maintenance costs';
        } else if (stack.weaknesses.includes('memory_intensive')) {
          score = 4;
          explanation = 'Higher infrastructure costs';
        } else {
          score = 6;
          explanation = 'Standard maintenance costs';
        }
        break;

      case 'security':
        if (stack.strengths.includes('secure')) {
          score = 8;
          explanation = 'Strong security features';
        } else if (stack.weaknesses.includes('security_concerns')) {
          score = 4;
          explanation = 'Requires careful security implementation';
        } else {
          score = 6;
          explanation = 'Standard security practices needed';
        }
        break;
    }

    const weight = requirements.weights?.[criterion] || (1 / this.criteria.length);
    
    return {
      raw: score,
      weighted: score * weight,
      explanation
    };
  }

  generateStackPros(stack, scores) {
    const pros = [];
    
    // Add strength-based pros
    stack.strengths.forEach(strength => {
      pros.push(strength.replace('_', ' '));
    });

    // Add score-based pros
    Object.entries(scores).forEach(([criterion, score]) => {
      if (score.raw >= 7) {
        pros.push(`Strong ${criterion.replace('_', ' ')}`);
      }
    });

    return [...new Set(pros)];
  }

  generateStackCons(stack, scores) {
    const cons = [];
    
    // Add weakness-based cons with better descriptions
    stack.weaknesses.forEach(weakness => {
      const weaknessDescriptions = {
        'callback_complexity': 'Complex callback handling and potential callback hell',
        'single_threaded': 'Single-threaded nature may limit CPU-intensive tasks',
        'jsx_learning': 'JSX syntax requires additional learning curve',
        'rapid_changes': 'Fast-moving ecosystem with frequent updates',
        'performance_limitations': 'May not be suitable for high-performance applications',
        'security_concerns': 'Requires careful security implementation',
        'monolithic': 'Monolithic architecture can limit scalability',
        'python_gil': 'Global Interpreter Lock limits true multithreading',
        'verbose': 'Verbose syntax requires more code to write',
        'memory_intensive': 'Higher memory usage and resource requirements',
        'performance': 'Performance may be slower than compiled languages',
        'declining_popularity': 'Decreasing community adoption and job market'
      };
      
      cons.push(weaknessDescriptions[weakness] || weakness.replace('_', ' '));
    });

    // Add stack-specific cons based on name
    if (stack.name === 'MEAN') {
      cons.push('Angular has a steep learning curve');
      cons.push('MongoDB may not be suitable for complex relationships');
    }
    
    if (stack.name === 'MERN') {
      cons.push('React ecosystem changes frequently');
      cons.push('State management can become complex');
    }
    
    if (stack.name === 'LAMP') {
      cons.push('PHP has mixed reputation in developer community');
      cons.push('Apache configuration can be complex');
    }
    
    if (stack.name === 'Django_Stack') {
      cons.push('Django can be overkill for simple applications');
      cons.push('Python performance limitations for CPU-intensive tasks');
    }
    
    if (stack.name === 'Spring_Boot') {
      cons.push('Java verbosity requires more code');
      cons.push('Higher memory footprint and startup time');
    }
    
    if (stack.name === 'Rails_Stack') {
      cons.push('Ruby performance is slower than other options');
      cons.push('Declining popularity in recent years');
    }

    // Add score-based cons (more realistic thresholds)
    Object.entries(scores).forEach(([criterion, score]) => {
      if (score.raw <= 5) {
        const criterionCons = {
          'development_speed': 'Slower development velocity',
          'performance': 'Performance limitations for high-load applications',
          'scalability': 'Scaling challenges with increased load',
          'learning_curve': 'Steep learning curve for team members',
          'community_support': 'Limited community resources and support',
          'job_market': 'Fewer job opportunities available',
          'maintenance_cost': 'Higher ongoing maintenance costs',
          'security': 'Requires additional security considerations'
        };
        
        if (criterionCons[criterion]) {
          cons.push(criterionCons[criterion]);
        }
      }
    });

    // Ensure at least some cons for realistic comparison
    if (cons.length === 0) {
      cons.push('Requires team training and onboarding time');
      cons.push('Technology stack lock-in considerations');
    }

    return [...new Set(cons)];
  }

  generateBestForScenarios(stack) {
    const scenarios = [];
    
    if (stack.strengths.includes('rapid_development')) {
      scenarios.push('Startups and MVPs');
    }
    if (stack.strengths.includes('enterprise_ready')) {
      scenarios.push('Large enterprise applications');
    }
    if (stack.strengths.includes('cost_effective')) {
      scenarios.push('Budget-conscious projects');
    }
    if (stack.learningCurve === 'low') {
      scenarios.push('Teams new to web development');
    }
    if (stack.jobMarket === 'excellent') {
      scenarios.push('Projects requiring easy hiring');
    }

    return scenarios;
  }

  selectBestStack(stacks, requirements) {
    if (stacks.length === 0) {
      return {
        choice: null,
        reason: 'No suitable stacks found for requirements'
      };
    }

    const topStack = stacks.reduce((best, current) => 
      current.totalScore > best.totalScore ? current : best
    );

    return {
      choice: topStack,
      reason: `Best match for ${requirements.projectType} with score ${topStack.totalScore.toFixed(2)}`,
      confidence: this.calculateConfidence(topStack, stacks),
      keyFactors: this.identifyKeyFactors(topStack, requirements)
    };
  }

  calculateConfidence(topStack, allStacks) {
    if (allStacks.length < 2) return 1.0;
    
    const scores = allStacks.map(s => s.totalScore).sort((a, b) => b - a);
    const scoreDiff = scores[0] - scores[1];
    
    return Math.min(0.6 + (scoreDiff / 3), 1.0);
  }

  identifyKeyFactors(stack, requirements) {
    const factors = [];
    
    if (requirements.timeline === 'urgent' && 
        stack.strengths.includes('rapid_development')) {
      factors.push('Rapid development capability matches urgent timeline');
    }
    
    if (requirements.teamExperience === 'beginner' && 
        stack.learningCurve === 'low') {
      factors.push('Low learning curve suitable for beginner team');
    }
    
    if (requirements.budget === 'limited' && 
        stack.strengths.includes('cost_effective')) {
      factors.push('Cost-effective solution fits budget constraints');
    }

    return factors;
  }

  analyzeStackTradeoffs(stacks) {
    const tradeoffs = [];
    
    // Development Speed vs Performance
    const fastDev = stacks.filter(s => s.scores.development_speed?.raw >= 7);
    const highPerf = stacks.filter(s => s.scores.performance?.raw >= 7);
    
    if (fastDev.length > 0 && highPerf.length > 0) {
      tradeoffs.push({
        type: 'speed_vs_performance',
        description: 'Faster development often comes at the cost of runtime performance',
        fastDevelopment: fastDev.map(s => s.name),
        highPerformance: highPerf.map(s => s.name)
      });
    }

    // Learning Curve vs Power
    const easyLearn = stacks.filter(s => s.learningCurve === 'low');
    const powerful = stacks.filter(s => s.strengths.includes('enterprise_ready'));
    
    if (easyLearn.length > 0 && powerful.length > 0) {
      tradeoffs.push({
        type: 'simplicity_vs_power',
        description: 'Easier technologies may lack advanced enterprise features',
        simple: easyLearn.map(s => s.name),
        powerful: powerful.map(s => s.name)
      });
    }

    return tradeoffs;
  }

  generateImplementationPlan(recommendedStack, requirements) {
    const phases = [];
    
    // Phase 1: Setup
    phases.push({
      phase: 1,
      name: 'Environment Setup',
      duration: '1-2 days',
      tasks: [
        `Install ${recommendedStack.technologies.join(', ')}`,
        'Set up development environment',
        'Configure project structure',
        'Set up version control'
      ]
    });

    // Phase 2: Core Development
    phases.push({
      phase: 2,
      name: 'Core Development',
      duration: requirements.timeline === 'urgent' ? '2-4 weeks' : '4-8 weeks',
      tasks: [
        'Implement core functionality',
        'Set up database schema',
        'Create API endpoints',
        'Implement authentication'
      ]
    });

    // Phase 3: Testing & Deployment
    phases.push({
      phase: 3,
      name: 'Testing & Deployment',
      duration: '1-2 weeks',
      tasks: [
        'Write unit tests',
        'Set up CI/CD pipeline',
        'Deploy to staging',
        'Performance testing',
        'Production deployment'
      ]
    });

    return {
      phases,
      totalEstimate: requirements.timeline === 'urgent' ? '4-7 weeks' : '6-12 weeks',
      teamSize: requirements.teamSize || '3-5 developers',
      keyMilestones: [
        'MVP completion',
        'Beta release',
        'Production launch'
      ]
    };
  }
}