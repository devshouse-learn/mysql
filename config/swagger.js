const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Gestión de Inventario',
      version: '1.0.0',
      description: `
        API REST completa para gestión de inventario con las siguientes características:
        - Gestión de productos y categorías
        - Sistema de bodegas/almacenes múltiples
        - Control de movimientos de inventario por bodega (entradas/salidas)
        - Reportes y estadísticas en tiempo real
        - Autenticación JWT
        - Sistema de usuarios con roles (admin/user)
        - Soft delete en todas las entidades
        - Prisma ORM con MySQL
      `,
      contact: {
        name: 'API Support',
        email: 'support@inventory-api.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de Desarrollo'
      },
      {
        url: 'https://api.inventory.com',
        description: 'Servidor de Producción'
      }
    ],
    tags: [
      {
        name: 'Autenticación',
        description: 'Endpoints para registro, login y gestión de usuarios'
      },
      {
        name: 'Categorías',
        description: 'CRUD completo de categorías de productos'
      },
      {
        name: 'Productos',
        description: 'Gestión completa de productos con filtros avanzados'
      },
      {
        name: 'Bodegas',
        description: 'Gestión de bodegas/almacenes para control de inventario por ubicación'
      },
      {
        name: 'Movimientos de Inventario',
        description: 'Control de entradas y salidas de inventario por bodega'
      },
      {
        name: 'Reportes',
        description: 'Estadísticas y reportes del inventario (requiere autenticación)'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Ingrese el token JWT obtenido al hacer login. Formato: Bearer {token}'
        }
      },
      schemas: {
        Category: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1
            },
            name: {
              type: 'string',
              example: 'Electrónica'
            },
            description: {
              type: 'string',
              example: 'Productos electrónicos y tecnológicos'
            },
            isActive: {
              type: 'boolean',
              example: true
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Product: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1
            },
            name: {
              type: 'string',
              example: 'Laptop Dell XPS 13'
            },
            sku: {
              type: 'string',
              example: 'DELL-XPS-001'
            },
            description: {
              type: 'string',
              example: 'Laptop de alto rendimiento con procesador Intel i7'
            },
            price: {
              type: 'number',
              format: 'decimal',
              example: 1299.99
            },
            cost: {
              type: 'number',
              format: 'decimal',
              example: 999.99
            },
            categoryId: {
              type: 'integer',
              example: 1
            },
            quantityInStock: {
              type: 'integer',
              example: 25
            },
            reorderLevel: {
              type: 'integer',
              example: 10
            },
            status: {
              type: 'string',
              enum: ['active', 'inactive'],
              example: 'active'
            },
            supplier: {
              type: 'string',
              example: 'Dell Inc.'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Warehouse: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1
            },
            name: {
              type: 'string',
              example: 'Bodega Central'
            },
            location: {
              type: 'string',
              example: 'Av. Principal 123, Ciudad'
            },
            description: {
              type: 'string',
              example: 'Bodega principal de almacenamiento'
            },
            capacity: {
              type: 'integer',
              example: 10000
            },
            isActive: {
              type: 'boolean',
              example: true
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        InventoryMovement: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1
            },
            productId: {
              type: 'integer',
              example: 1
            },
            warehouseId: {
              type: 'integer',
              example: 1
            },
            movementType: {
              type: 'string',
              enum: ['entrada', 'salida'],
              example: 'entrada'
            },
            quantity: {
              type: 'integer',
              example: 50
            },
            referenceType: {
              type: 'string',
              example: 'orden_compra'
            },
            referenceId: {
              type: 'string',
              example: 'OC-2024-001'
            },
            notes: {
              type: 'string',
              example: 'Recepción de inventario mensual'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1
            },
            username: {
              type: 'string',
              example: 'admin'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'admin@inventory.com'
            },
            fullName: {
              type: 'string',
              example: 'Administrador Sistema'
            },
            role: {
              type: 'string',
              enum: ['admin', 'user'],
              example: 'admin'
            },
            isActive: {
              type: 'boolean',
              example: true
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'string',
              example: 'Mensaje de error descriptivo'
            }
          }
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Operación exitosa'
            }
          }
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            data: {
              type: 'array',
              items: {
                type: 'object'
              }
            },
            pagination: {
              type: 'object',
              properties: {
                total: {
                  type: 'integer',
                  example: 100
                },
                page: {
                  type: 'integer',
                  example: 1
                },
                limit: {
                  type: 'integer',
                  example: 10
                },
                pages: {
                  type: 'integer',
                  example: 10
                }
              }
            }
          }
        }
      },
      responses: {
        UnauthorizedError: {
          description: 'Token de autenticación no válido o no proporcionado',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                success: false,
                error: 'Token no proporcionado'
              }
            }
          }
        },
        NotFoundError: {
          description: 'Recurso no encontrado',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                success: false,
                error: 'Recurso no encontrado'
              }
            }
          }
        },
        ValidationError: {
          description: 'Error de validación de datos',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                success: false,
                error: 'name es requerido'
              }
            }
          }
        }
      }
    },
    security: [
      {
        BearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.js']
};

const specs = swaggerJsdoc(options);

module.exports = specs;
