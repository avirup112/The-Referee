# The Referee - Project Context

## Project Overview
The Referee is a smart comparison tool built for AI for Bharat Week 6 challenge. It helps users make informed technical decisions by comparing options and explaining trade-offs instead of giving single answers.

## Key Features
- **API Comparison**: Real-time performance testing and feature analysis
- **Cloud Service Evaluation**: Cost optimization and vendor lock-in analysis  
- **Tech Stack Recommendations**: Personalized suggestions based on requirements
- **Interactive Decision Matrix**: Visual comparison with weighted scoring
- **Constraint-Based Filtering**: Filter options based on specific requirements

## Architecture
- **Backend**: Node.js with Express.js REST API
- **Frontend**: Vanilla HTML/CSS/JavaScript with responsive design
- **Core Engine**: Modular comparison system with pluggable comparators
- **Testing**: Built-in test suite for all comparison types

## Development Approach with Kiro AI
This project leverages Kiro AI for:
- Rapid prototyping and code generation
- Architectural decision making
- Code structure optimization
- Documentation generation
- Testing strategy implementation

## File Structure
```
src/
├── index.js              # Main Referee class
├── referee-engine.js     # Core comparison engine
├── server.js            # Express.js API server
├── test.js              # Test suite
└── comparators/         # Specialized comparison modules
    ├── api-comparator.js
    ├── cloud-comparator.js
    └── tech-stack-comparator.js
```

## API Endpoints
- `POST /api/compare/apis` - Compare API options
- `POST /api/compare/cloud` - Compare cloud services  
- `POST /api/recommend/tech-stack` - Get tech stack recommendations
- `POST /api/compare/general` - General option comparison

## Usage Examples
The tool provides practical examples for each comparison type, making it easy for users to understand the trade-offs between different technical choices.

## Submission Requirements
- ✅ GitHub Repository with complete code
- ✅ .kiro directory included (not in .gitignore)
- 📝 Technical blog post for AWS Builder Center
- 🔗 Dashboard submission with both links