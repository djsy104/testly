const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Test Tracker API',
      version: '1.0.0',
      description: 'API documentation for the Test Tracker back-end',
    },
    servers: [{ url: 'http://localhost:8080', description: 'Local server' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        AuthResponse: {
          type: 'object',
          properties: {
            user: { $ref: '#/components/schemas/UserPublic' },
            token: { type: 'string' },
          },
        },
        UserPublic: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            userID: { type: 'string' },
          },
        },
        Test: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            type: { type: 'string', enum: ['Quiz', 'Exam', 'Midterm', 'Final Exam', 'Other'] },
            status: { type: 'string', enum: ['Upcoming', 'In Review', 'Completed'] },
            date: { type: 'string', format: 'date-time' },
            score: { type: 'number', nullable: true },
            isArchived: { type: 'boolean' },
            createdBy: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: {
              type: 'object',
              properties: {
                message: { type: 'string' },
                details: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      field: { type: 'string' },
                      message: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        },
        ValidationErrorResponse: {
          type: 'object',
          properties: {
            errors: {
              type: 'object',
              properties: {
                message: { type: 'string' },
                formattedErrors: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      field: { type: 'string' },
                      message: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js'],
};

module.exports = swaggerJSDoc(options);
