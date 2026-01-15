const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Gestión de Inventario',
      version: '1.0.0',
      description: 'API REST completa para gestión de inventario'
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Desarrollo'
      }
    ]
  },
  apis: ['./src/routes/*.js']
};

const specs = swaggerJsdoc(options);

module.exports = specs;
