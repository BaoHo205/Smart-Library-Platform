import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    version: '1.0',
    title: 'Smart Library Platform API',
    description: 'API documentation for the Smart Library Platform',
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Local server',
    },
  ],
  tags: [
    {
      name: 'Auth',
      description: 'Authentication-related endpoints',
    },
    {
      name: 'Books',
      description: 'Book-related endpoints',
    },
    {
      name: 'Users',
      description: 'User-related endpoints',
    },
    {
      name: 'Staff',
      description: 'Staff-related endpoints',
    },
    {
      name: 'Reading Sessions',
      description: 'Reading-session endpoints',
    },
  ],
  components: {},
};

const outputFile = './swagger-output.json';
const routes = [
  './routes/apiRoutes.ts',
  './routes/authRoutes.ts',
];

swaggerAutogen()(outputFile, routes, doc);
