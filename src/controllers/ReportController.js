const ReportModel = require('../models/ReportModel');
const { logger } = require('../middleware/logger');

class ReportController {
  static async getInventorySummary(req, res) {
    try {
      const summary = await ReportModel.getInventorySummary();
      logger.info('Reporte de resumen de inventario solicitado');
      res.status(200).json(summary);
    } catch (error) {
      logger.error('Error en resumen: ' + error.message);
      res.status(500).json({ error: error.message });
    }
  }

  static async getMovementsByPeriod(req, res) {
    try {
      const { startDate, endDate } = req.query;
      
      if (!startDate || !endDate) {
        return res.status(400).json({ error: 'startDate y endDate son requeridos' });
      }

      const movements = await ReportModel.getMovementsByPeriod(startDate, endDate);
      logger.info(`Movimientos del ${startDate} al ${endDate}`);
      res.status(200).json({ movements });
    } catch (error) {
      logger.error('Error en movimientos: ' + error.message);
      res.status(500).json({ error: error.message });
    }
  }

  static async getTopProducts(req, res) {
    try {
      const { limit = 10 } = req.query;
      const products = await ReportModel.getTopProducts(parseInt(limit));
      logger.info('Productos top solicitados');
      res.status(200).json({ products });
    } catch (error) {
      logger.error('Error en top products: ' + error.message);
      res.status(500).json({ error: error.message });
    }
  }

  static async getLowStockProducts(req, res) {
    try {
      const { threshold = 10 } = req.query;
      const products = await ReportModel.getLowStockProducts(parseInt(threshold));
      logger.info('Productos con bajo stock');
      res.status(200).json({ products, threshold });
    } catch (error) {
      logger.error('Error en bajo stock: ' + error.message);
      res.status(500).json({ error: error.message });
    }
  }

  static async getCategoryDistribution(req, res) {
    try {
      const categories = await ReportModel.getCategoryDistribution();
      logger.info('Distribución por categoría');
      res.status(200).json({ categories });
    } catch (error) {
      logger.error('Error en distribución: ' + error.message);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = ReportController;
