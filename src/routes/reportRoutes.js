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
 *     responses:
 *       200:
 *         description: Resumen de inventario
 */
router.get('/inventory-summary', authenticateToken, ReportController.getInventorySummary);

/**
 * @swagger
 * /api/reports/movements-by-period:
 *   get:
 *     summary: Movimientos por período
 *     tags: [Reportes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 */
router.get('/movements-by-period', authenticateToken, ReportController.getMovementsByPeriod);

/**
 * @swagger
 * /api/reports/top-products:
 *   get:
 *     summary: Productos más vendidos
 *     tags: [Reportes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 */
router.get('/top-products', authenticateToken, ReportController.getTopProducts);

/**
 * @swagger
 * /api/reports/low-stock:
 *   get:
 *     summary: Productos con bajo stock
 *     tags: [Reportes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: threshold
 *         schema:
 *           type: integer
 *           default: 10
 */
router.get('/low-stock', authenticateToken, ReportController.getLowStockProducts);

/**
 * @swagger
 * /api/reports/category-distribution:
 *   get:
 *     summary: Distribución de productos por categoría
 *     tags: [Reportes]
 *     security:
 *       - BearerAuth: []
 */
router.get('/category-distribution', authenticateToken, ReportController.getCategoryDistribution);

module.exports = router;
