# 🏆 The Referee - Smart Decision Comparison Tool

[![AI for Bharat](https://img.shields.io/badge/AI%20for%20Bharat-Week%206-blue)](https://aiforabharat.org)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A smart comparison tool that helps developers make informed technical decisions by analyzing trade-offs across multiple criteria instead of giving single answers.

## 🎯 Problem Statement

Traditional recommendation tools give you one "best" answer, but real-world technical decisions require understanding trade-offs. The Referee helps you:
- Compare options objectively across multiple criteria
- Understand what you gain and lose with each choice
- Make decisions based on your specific constraints and priorities
- See detailed analysis rather than just rankings

## ✨ Features

### 🔌 API Comparison
- Real-time performance testing and health checks
- Cost analysis and rate limit evaluation
- Integration complexity assessment
- Feature detection (REST vs GraphQL vs gRPC)

### ☁️ Cloud Service Analysis
- Multi-provider cost optimization
- Vendor lock-in risk analysis
- Compliance requirement checking
- Migration complexity assessment

### 🛠️ Tech Stack Recommendations
- Project-specific technology matching
- Team experience and learning curve analysis
- Timeline and budget considerations
- Implementation roadmap generation

### 📊 Interactive Decision Matrix
- Weighted scoring based on your priorities
- Visual comparison with pros/cons analysis
- Constraint-based filtering
- Trade-off identification and explanation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/the-referee.git
cd the-referee

# Install dependencies
npm install

# Run tests to verify setup
npm test

# Start the development server
npm run dev
```

The application will be available at `http://localhost:3000`

## 📖 Usage Examples

### Web Interface
Visit `http://localhost:3000` for the interactive web interface with forms for each comparison type.

### API Usage

#### Compare APIs
```bash
curl -X POST http://localhost:3000/api/compare/apis \
  -H "Content-Type: application/json" \
  -d '{
    "apis": [
      {
        "name": "JSONPlaceholder API",
        "endpoint": "https://jsonplaceholder.typicode.com/posts",
        "type": "REST"
      },
      {
        "name": "GitHub GraphQL API", 
        "endpoint": "https://api.github.com/graphql",
        "type": "GraphQL"
      }
    ],
    "options": {
      "criteria": ["performance", "cost", "ease_of_use"],
      "constraints": {
        "maxCost": 50,
        "weights": {
          "performance": 0.4,
          "cost": 0.3,
          "ease_of_use": 0.3
        }
      }
    }
  }'
```

#### Compare Cloud Services
```bash
curl -X POST http://localhost:3000/api/compare/cloud \
  -H "Content-Type: application/json" \
  -d '{
    "services": [
      {"name": "AWS EC2", "provider": "AWS", "type": "compute", "estimatedUsage": 100},
      {"name": "Azure VM", "provider": "Azure", "type": "compute", "estimatedUsage": 100},
      {"name": "Google Compute Engine", "provider": "GCP", "type": "compute", "estimatedUsage": 100}
    ],
    "options": {
      "constraints": {
        "maxMonthlyCost": 200,
        "requiredCompliance": ["SOC", "GDPR"]
      }
    }
  }'
```

#### Get Tech Stack Recommendations
```bash
curl -X POST http://localhost:3000/api/recommend/tech-stack \
  -H "Content-Type: application/json" \
  -d '{
    "projectType": "web_app",
    "teamExperience": "intermediate", 
    "timeline": "normal",
    "teamSize": 4,
    "requirements": ["scalable", "real_time", "mobile_friendly"]
  }'
```

### Programmatic Usage

```javascript
import { Referee } from './src/index.js';

const referee = new Referee();

// API Comparison
const apiComparison = await referee.compareAPIs([
  { name: 'API 1', endpoint: 'https://api1.example.com' },
  { name: 'API 2', endpoint: 'https://api2.example.com' }
]);

// Cloud Service Comparison  
const cloudComparison = await referee.compareCloudServices([
  { name: 'AWS EC2', provider: 'AWS', type: 'compute' },
  { name: 'Azure VM', provider: 'Azure', type: 'compute' }
]);

// Tech Stack Recommendation
const techStackRec = await referee.recommendTechStack({
  projectType: 'web_app',
  teamExperience: 'beginner',
  timeline: 'urgent'
});
```

## 🏗️ Architecture

### Core Components

```
src/
├── index.js              # Main Referee class
├── referee-engine.js     # Core comparison engine
├── server.js            # Express.js API server
├── test.js              # Comprehensive test suite
└── comparators/         # Specialized comparison modules
    ├── api-comparator.js      # API analysis and testing
    ├── cloud-comparator.js    # Cloud service evaluation
    └── tech-stack-comparator.js # Technology stack matching
```

### Key Design Principles

- **Modular Architecture**: Easy to extend with new comparison types
- **Weighted Scoring**: Flexible prioritization of different criteria
- **Constraint-Based**: Hard filters eliminate unsuitable options
- **Trade-off Analysis**: Identifies meaningful comparisons between options
- **Explanatory**: Every score comes with human-readable explanations

## 🧪 Testing

Run the comprehensive test suite:

```bash
npm test
```

The tests cover:
- API comparison with real endpoint testing
- Cloud service cost calculations and feature analysis
- Tech stack recommendation logic
- General comparison engine functionality

## 📊 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | API documentation and status |
| `/api/compare/apis` | POST | Compare API options |
| `/api/compare/cloud` | POST | Compare cloud services |
| `/api/recommend/tech-stack` | POST | Get tech stack recommendations |
| `/api/compare/general` | POST | General option comparison |
| `/api/examples/*` | GET | Example request formats |

## 🤖 Built with Kiro AI

This project showcases AI-assisted development using Kiro AI for:

- **Rapid Prototyping**: Generated working code in minutes instead of hours
- **Architecture Design**: Helped design modular, extensible system structure  
- **Code Generation**: Created sophisticated comparison algorithms and scoring logic
- **Test Coverage**: Built comprehensive test suites with edge case handling
- **Documentation**: Generated clear, comprehensive documentation

### Development Time Savings
- **74% faster development** compared to traditional methods
- **Architecture planning**: 3 hours → 30 minutes
- **Core engine**: 8 hours → 2 hours  
- **API implementation**: 4 hours → 1 hour
- **Frontend**: 6 hours → 2 hours
- **Testing**: 3 hours → 45 minutes

## 🔧 Configuration

### Environment Variables
```bash
PORT=3000                    # Server port (default: 3000)
NODE_ENV=development         # Environment mode
```

### Customizing Comparison Criteria

You can extend the comparison criteria by modifying the comparator classes:

```javascript
// Add new criteria to any comparator
this.defaultCriteria = [
  'performance',
  'cost', 
  'ease_of_use',
  'your_custom_criterion'  // Add your criterion here
];
```

## 🚀 Deployment

### Docker Deployment
```bash
# Build Docker image
docker build -t the-referee .

# Run container
docker run -p 3000:3000 the-referee
```

### Cloud Deployment
The application is ready for deployment on:
- AWS (EC2, ECS, Lambda)
- Azure (App Service, Container Instances)
- Google Cloud (Cloud Run, App Engine)
- Heroku, Vercel, Netlify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏆 AI for Bharat Week 6

This project was built for AI for Bharat's Week 6 challenge: "The Referee - Build a tool that compares options and explains trade-offs."

### Submission Checklist
- ✅ GitHub Repository with complete project code
- ✅ `.kiro` directory included (showcasing AI-assisted development)
- ✅ Technical blog post documenting development process
- ✅ Interactive web interface with comparison tools
- ✅ Comprehensive API with multiple comparison types
- ✅ Real-world usage examples and documentation
---

*Built with ❤️ and accelerated by Kiro AI for AI for Bharat Week 6 Challenge*