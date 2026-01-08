export class RefereeEngine {
  constructor() {
    this.defaultWeights = {
      performance: 0.3,
      cost: 0.25,
      ease_of_use: 0.2,
      scalability: 0.15,
      community_support: 0.1
    };
  }

  async compare(options, criteria, constraints = {}) {
    const weights = constraints.weights || this.defaultWeights;
    const evaluatedOptions = await this.evaluateOptions(options, criteria, constraints);
    
    return {
      comparison: evaluatedOptions,
      recommendation: this.generateRecommendation(evaluatedOptions, constraints),
      tradeoffs: this.analyzeTradeoffs(evaluatedOptions),
      summary: this.generateSummary(evaluatedOptions, constraints)
    };
  }

  async evaluateOptions(options, criteria, constraints) {
    return Promise.all(options.map(async (option) => {
      const scores = {};
      let totalScore = 0;
      
      for (const criterion of criteria) {
        const score = await this.evaluateCriterion(option, criterion, constraints);
        scores[criterion] = score;
        totalScore += score.weighted;
      }

      return {
        ...option,
        scores,
        totalScore,
        meetsConstraints: this.checkConstraints(option, constraints)
      };
    }));
  }

  async evaluateCriterion(option, criterion, constraints) {
    // Simulate evaluation logic - in real implementation, this would call actual APIs/services
    const baseScore = Math.random() * 10; // 0-10 scale
    const weight = constraints.weights?.[criterion] || this.defaultWeights[criterion] || 0.1;
    
    return {
      raw: baseScore,
      weighted: baseScore * weight,
      explanation: this.generateCriterionExplanation(option, criterion, baseScore)
    };
  }

  generateCriterionExplanation(option, criterion, score) {
    const explanations = {
      performance: score > 7 ? 'Excellent response times and throughput' : 
                   score > 5 ? 'Good performance for most use cases' : 'May have performance limitations',
      cost: score > 7 ? 'Very cost-effective solution' : 
            score > 5 ? 'Reasonable pricing for features offered' : 'Higher cost may impact budget',
      ease_of_use: score > 7 ? 'Intuitive and well-documented' : 
                   score > 5 ? 'Moderate learning curve' : 'Complex setup and configuration',
      scalability: score > 7 ? 'Scales seamlessly with growth' : 
                   score > 5 ? 'Handles moderate scale well' : 'Limited scalability options'
    };
    
    return explanations[criterion] || `Score: ${score.toFixed(1)}/10`;
  }

  checkConstraints(option, constraints) {
    // Check if option meets hard constraints
    if (constraints.maxCost && option.cost > constraints.maxCost) return false;
    if (constraints.requiredFeatures) {
      return constraints.requiredFeatures.every(feature => 
        option.features?.includes(feature)
      );
    }
    return true;
  }

  generateRecommendation(evaluatedOptions, constraints) {
    const validOptions = evaluatedOptions.filter(opt => opt.meetsConstraints);
    
    if (validOptions.length === 0) {
      return {
        choice: null,
        reason: 'No options meet the specified constraints',
        alternatives: evaluatedOptions.slice(0, 2)
      };
    }

    const topOption = validOptions.reduce((best, current) => 
      current.totalScore > best.totalScore ? current : best
    );

    return {
      choice: topOption,
      reason: this.generateRecommendationReason(topOption, validOptions),
      confidence: this.calculateConfidence(topOption, validOptions)
    };
  }

  generateRecommendationReason(topOption, allOptions) {
    const strengths = Object.entries(topOption.scores)
      .filter(([_, score]) => score.raw > 7)
      .map(([criterion, _]) => criterion);
    
    return `Best overall choice due to strong ${strengths.join(', ')} with total score of ${topOption.totalScore.toFixed(2)}`;
  }

  calculateConfidence(topOption, allOptions) {
    if (allOptions.length < 2) return 1.0;
    
    const secondBest = allOptions
      .filter(opt => opt !== topOption)
      .reduce((best, current) => current.totalScore > best.totalScore ? current : best);
    
    const scoreDiff = topOption.totalScore - secondBest.totalScore;
    return Math.min(0.5 + (scoreDiff / 10), 1.0);
  }

  analyzeTradeoffs(evaluatedOptions) {
    const tradeoffs = [];
    
    evaluatedOptions.forEach((option, i) => {
      evaluatedOptions.slice(i + 1).forEach(other => {
        const comparison = this.compareTwo(option, other);
        if (comparison.hasTradeoff) {
          tradeoffs.push(comparison);
        }
      });
    });

    return tradeoffs;
  }

  compareTwo(optionA, optionB) {
    const aStrengths = [];
    const bStrengths = [];
    
    Object.keys(optionA.scores).forEach(criterion => {
      const aDiff = optionA.scores[criterion].raw - optionB.scores[criterion].raw;
      if (Math.abs(aDiff) > 1) {
        if (aDiff > 0) aStrengths.push(criterion);
        else bStrengths.push(criterion);
      }
    });

    return {
      hasTradeoff: aStrengths.length > 0 && bStrengths.length > 0,
      optionA: optionA.name,
      optionB: optionB.name,
      aStrengths,
      bStrengths,
      summary: `${optionA.name} excels in ${aStrengths.join(', ')} while ${optionB.name} is better for ${bStrengths.join(', ')}`
    };
  }

  generateSummary(evaluatedOptions, constraints) {
    const topThree = evaluatedOptions
      .filter(opt => opt.meetsConstraints)
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, 3);

    return {
      totalOptions: evaluatedOptions.length,
      validOptions: evaluatedOptions.filter(opt => opt.meetsConstraints).length,
      topChoices: topThree.map(opt => ({
        name: opt.name,
        score: opt.totalScore.toFixed(2),
        keyStrength: this.getKeyStrength(opt)
      })),
      keyInsight: this.generateKeyInsight(evaluatedOptions, constraints)
    };
  }

  getKeyStrength(option) {
    const bestCriterion = Object.entries(option.scores)
      .reduce((best, [criterion, score]) => 
        score.raw > best.score ? { criterion, score: score.raw } : best,
        { criterion: '', score: 0 }
      );
    
    return bestCriterion.criterion;
  }

  generateKeyInsight(evaluatedOptions, constraints) {
    const avgScores = {};
    const criteria = Object.keys(evaluatedOptions[0].scores);
    
    criteria.forEach(criterion => {
      avgScores[criterion] = evaluatedOptions.reduce((sum, opt) => 
        sum + opt.scores[criterion].raw, 0) / evaluatedOptions.length;
    });

    const strongestArea = Object.entries(avgScores)
      .reduce((best, [criterion, score]) => 
        score > best.score ? { criterion, score } : best,
        { criterion: '', score: 0 }
      );

    return `Overall, options perform best in ${strongestArea.criterion} (avg: ${strongestArea.score.toFixed(1)}/10)`;
  }
}