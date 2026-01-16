const ReportModel = require('../models/ReportModel');
const { logger } = require('../middleware/logger');

class ReportController {
  static async getInventorySummary(req, res) {
    try {
      const filters = {
        categoryId: req.query.categoryId,
        startDate: req.query.startDate,
        endDate: req.query.endDate
      };
      const summary = await ReportModel.getInventorySummary(filters);
      logger.info('Reporte de resumen de inventario solicitado');
      res.status(200).json(summary);
    } catch (error) {
      logger.error('Error en resumen: ' + error.message);
      res.status(500).json({ error: error.message });
    }
  }

  static async getMovementsByPeriod(req, res) {
    try {
      const filters = {
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        movementType: req.query.movementType,
        productId: req.query.productId,
        categoryId: req.query.categoryId,
        minQuantity: req.query.minQuantity,
        maxQuantity: req.query.maxQuantity,
        reason: req.query.reason,
        sortBy: req.query.sortBy,
        order: req.query.order,
        page: req.query.page,
        limit: req.query.limit
      };

      const result = await ReportModel.getMovementsByPeriod(filters);
      logger.info(`Movimientos solicitados`);
      res.status(200).json(result);
    } catch (error) {
      logger.error('Error en movimientos: ' + error.message);
      res.status(500).json({ error: error.message });
    }
  }

  static async getTopProducts(req, res) {
    try {
      const filters = {
        limit: req.query.limit,
        categoryId: req.query.categoryId,
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        minSold: req.query.minSold
      };
      const products = await ReportModel.getTopProducts(filters);
      logger.info('Productos top solicitados');
      res.status(200).json({ products });
    } catch (error) {
      logger.error('Error en top products: ' + error.message);
      res.status(500).json({ error: error.message });
    }
  }

  static async getLowStockProducts(req, res) {
    try {
      const filters = {
        threshold: req.query.threshold,
        categoryId: req.query.categoryId,
        search: req.query.search,
        sortBy: req.query.sortBy,
        order: req.query.order,
        minPrice: req.query.minPrice,
        maxPrice: req.query.maxPrice
      };
      const products = await ReportModel.getLowStockProducts(filters);
      logger.info('Productos con bajo stock');
      res.status(200).json({ products });
    } catch (error) {
      logger.error('Error en bajo stock: ' + error.message);
      res.status(500).json({ error: error.message });
    }
  }

  static async getCategoryDistribution(req, res) {
    try {
      const filters = {
        minProducts: req.query.minProducts,
        minStock: req.query.minStock,
        minValue: req.query.minValue,
        sortBy: req.query.sortBy,
        order: req.query.order
      };
      const categories = await ReportModel.getCategoryDistribution(filters);
      logger.info('Distribución por categoría');
      res.status(200).json({ categories });
    } catch (error) {
      logger.error('Error en distribución: ' + error.message);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = ReportController;
