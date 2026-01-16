const express = require('express');
const ReportController = require('../controllers/ReportController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /api/reports:
 *   get:
 *     summary: Listado de endpoints de reportes disponibles
 *     tags: [Reportes]
 *     responses:
 *       200:
 *         description: Lista de endpoints
 */
router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Endpoints de Reportes disponibles',
    endpoints: {
      'inventory-summary': '/api/reports/inventory-summary',
      'movements-by-period': '/api/reports/movements-by-period',
      'top-products': '/api/reports/top-products',
      'low-stock': '/api/reports/low-stock',
      'category-distribution': '/api/reports/category-distribution'
    }
  });
});

/**
 * @swagger
 * /api/reports/inventory-summary:
 *   get:
 *     summary: Resumen general del inventario
 *     tags: [Reportes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *         description: Filtrar por categoría
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha inicial (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha final (YYYY-MM-DD)
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, all]
 *           default: active
 *         description: Estado de los productos a incluir
 *     responses:
 *       200:
 *         description: Resumen de inventario con totales y estadísticas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalProducts:
 *                       type: integer
 *                       example: 150
 *                     totalValue:
 *                       type: number
 *                       example: 45230.50
 *                     totalStock:
 *                       type: integer
 *                       example: 3500
 *                     categories:
 *                       type: integer
 *                       example: 12
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/inventory-summary', authenticateToken, ReportController.getInventorySummary);

/**
 * @swagger
 * /api/reports/movements-by-period:
 *   get:
 *     summary: Movimientos por período con paginación y filtros
 *     tags: [Reportes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha inicial (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha final (YYYY-MM-DD)
 *       - in: query
 *         name: movementType
 *         schema:
 *           type: string
 *           enum: [entrada, salida]
 *       - in: query
 *         name: productId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Lista paginada de movimientos en el período
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/movements-by-period', authenticateToken, ReportController.getMovementsByPeriod);

/**
 * @swagger
 * /api/reports/top-products:
 *   get:
 *     summary: Productos más vendidos (salidas de inventario)
 *     description: Retorna los productos con más movimientos de salida en un período
 *     tags: [Reportes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           maximum: 100
 *         description: Número máximo de productos a retornar
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha inicial (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha final (YYYY-MM-DD)
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *         description: Filtrar por categoría
 *     responses:
 *       200:
 *         description: Lista de productos más vendidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       product:
 *                         $ref: '#/components/schemas/Product'
 *                       totalQuantity:
 *                         type: integer
 *                         example: 250
 *                       totalMovements:
 *                         type: integer
 *                         example: 45
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/top-products', authenticateToken, ReportController.getTopProducts);

/**
 * @swagger
 * /api/reports/low-stock:
 *   get:
 *     summary: Productos con stock bajo o agotado
 *     description: Retorna productos que están por debajo del umbral de stock configurado
 *     tags: [Reportes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: threshold
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Umbral de stock bajo
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *         description: Filtrar por categoría
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Buscar por nombre o SKU
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [quantityInStock, name, price]
 *           default: quantityInStock
 *         description: Campo por el cual ordenar
 *       - in: query
 *         name: includeOutOfStock
 *         schema:
 *           type: boolean
 *           default: true
 *         description: Incluir productos sin stock
 *     responses:
 *       200:
 *         description: Lista de productos con stock bajo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/low-stock', authenticateToken, ReportController.getLowStockProducts);

/**
 * @swagger
 * /api/reports/category-distribution:
 *   get:
 *     summary: Distribución de productos por categoría
 *     description: Retorna estadísticas de productos y valor de inventario agrupadas por categoría
 *     tags: [Reportes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: includeInactive
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Incluir categorías inactivas
 *     responses:
 *       200:
 *         description: Distribución por categorías
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       category:
 *                         $ref: '#/components/schemas/Category'
 *                       productCount:
 *                         type: integer
 *                         example: 25
 *                       totalValue:
 *                         type: number
 *                         example: 12350.75
 *                       totalStock:
 *                         type: integer
 *                         example: 450
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/category-distribution', authenticateToken, ReportController.getCategoryDistribution);

module.exports = router;
