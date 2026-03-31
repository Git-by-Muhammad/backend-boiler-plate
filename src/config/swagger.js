const swaggerJsdoc = require('swagger-jsdoc');

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Backend Boilerplate API',
      version: '1.0.0',
      description: 'Enterprise-ready modular backend boilerplate API documentation.',
    },
    servers: [{ url: '/api/v1' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    paths: {
      '/health': {
        get: {
          summary: 'Health check',
          responses: { 200: { description: 'Service health details' } },
        },
      },
      '/auth/register': {
        post: { summary: 'Register user', responses: { 201: { description: 'User created' } } },
      },
      '/auth/login': {
        post: { summary: 'Login', responses: { 200: { description: 'Access and refresh tokens' } } },
      },
      '/auth/refresh': {
        post: { summary: 'Refresh token pair', responses: { 200: { description: 'New token pair' } } },
      },
      '/auth/me': {
        get: {
          summary: 'Get current user',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Current user profile' } },
        },
      },
    },
  },
  apis: [],
});

module.exports = swaggerSpec;

