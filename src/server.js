import express from 'express';
import cors from 'cors';
import { Referee } from './index.js';

const app = express();
const port = process.env.PORT || 3000;
const referee = new Referee();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://the-referee.vercel.app', 'https://the-referee-git-main-avirup12.vercel.app']
    : ['http://localhost:3000'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

// API status endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'The Referee API',
    version: '1.0.0',
    description: 'Smart comparison tool for technical decisions',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    endpoints: {
      '/api/compare/apis': 'Compare API options',
      '/api/compare/cloud': 'Compare cloud services',
      '/api/recommend/tech-stack': 'Get tech stack recommendations',
      '/api/compare/general': 'General option comparison'
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Comparison
app.post('/api/compare/apis', async (req, res) => {
  try {
    console.log('API Compare request received:', req.body);
    
    const { apis, options } = req.body;
    
    if (!apis || !Array.isArray(apis) || apis.length < 2) {
      return res.status(400).json({
        error: 'Please provide at least 2 APIs to compare',
        received: apis
      });
    }

    // Validate API objects
    for (const api of apis) {
      if (!api.name || !api.endpoint) {
        return res.status(400).json({
          error: 'Each API must have a name and endpoint',
          received: api
        });
      }
    }

    const result = await referee.compareAPIs(apis, options);
    console.log('API Compare result generated successfully');
    res.json(result);
  } catch (error) {
    console.error('API Compare error:', error);
    res.status(500).json({
      error: 'Failed to compare APIs',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Cloud Service Comparison
app.post('/api/compare/cloud', async (req, res) => {
  try {
    const { services, options } = req.body;
    
    if (!services || !Array.isArray(services) || services.length < 2) {
      return res.status(400).json({
        error: 'Please provide at least 2 cloud services to compare'
      });
    }

    const result = await referee.compareCloudServices(services, options);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to compare cloud services',
      message: error.message
    });
  }
});

// Tech Stack Recommendation
app.post('/api/recommend/tech-stack', async (req, res) => {
  try {
    const requirements = req.body;
    
    if (!requirements.projectType) {
      return res.status(400).json({
        error: 'Project type is required'
      });
    }

    const result = await referee.recommendTechStack(requirements);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to recommend tech stack',
      message: error.message
    });
  }
});

// General Comparison
app.post('/api/compare/general', async (req, res) => {
  try {
    const { options, criteria, constraints } = req.body;
    
    if (!options || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({
        error: 'Please provide at least 2 options to compare'
      });
    }

    if (!criteria || !Array.isArray(criteria)) {
      return res.status(400).json({
        error: 'Please provide comparison criteria'
      });
    }

    const result = await referee.compareOptions(options, criteria, constraints);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to compare options',
      message: error.message
    });
  }
});

// Example endpoints for testing
app.get('/api/examples/apis', (req, res) => {
  res.json({
    example: {
      apis: [
        {
          name: 'REST API',
          endpoint: 'https://jsonplaceholder.typicode.com/posts',
          type: 'REST',
          rateLimits: { requests: 1000, window: 'hour' },
          pricing: { free: true, cost: 0 }
        },
        {
          name: 'GraphQL API',
          endpoint: 'https://api.github.com/graphql',
          type: 'GraphQL',
          rateLimits: { requests: 5000, window: 'hour' },
          pricing: { free: false, cost: 25 }
        }
      ],
      options: {
        criteria: ['performance', 'cost', 'ease_of_use'],
        constraints: {
          maxCost: 50,
          weights: {
            performance: 0.4,
            cost: 0.3,
            ease_of_use: 0.3
          }
        }
      }
    }
  });
});

app.get('/api/examples/cloud', (req, res) => {
  res.json({
    example: {
      services: [
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
      ],
      options: {
        criteria: ['cost_efficiency', 'performance', 'ease_of_use'],
        constraints: {
          maxMonthlyCost: 200,
          requiredCompliance: ['SOC', 'GDPR']
        }
      }
    }
  });
});

app.get('/api/examples/tech-stack', (req, res) => {
  res.json({
    example: {
      projectType: 'web_app',
      teamExperience: 'intermediate',
      timeline: 'normal',
      budget: 'medium',
      requirements: ['scalable', 'real_time', 'mobile_friendly'],
      teamSize: 4
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message
  });
});

// 404 handler
app.use((req, res) => {
  // If it's an API request, return JSON error
  if (req.path.startsWith('/api/')) {
    res.status(404).json({
      error: 'API endpoint not found',
      path: req.path,
      availableEndpoints: [
        'GET /api',
        'GET /api/health',
        'POST /api/compare/apis',
        'POST /api/compare/cloud',
        'POST /api/recommend/tech-stack',
        'POST /api/compare/general'
      ]
    });
  } else {
    // For non-API requests, serve the HTML file (SPA fallback)
    res.sendFile('index.html', { root: 'public' });
  }
});

app.listen(port, () => {
  console.log(`🏆 The Referee is running on port ${port}`);
  console.log(`📊 API Documentation: http://localhost:${port}`);
  console.log(`🔗 Example APIs: http://localhost:${port}/api/examples/apis`);
  console.log(`☁️  Example Cloud: http://localhost:${port}/api/examples/cloud`);
  console.log(`🛠️  Example Tech Stack: http://localhost:${port}/api/examples/tech-stack`);
});

export default app;