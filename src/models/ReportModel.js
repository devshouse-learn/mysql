const prisma = require('../config/prisma');

class ReportModel {
  /**
   * Obtener resumen de inventario
   */
  static async getInventorySummary() {
    try {
      const [products, categories, movements] = await Promise.all([
        prisma.product.findMany({ where: { deletedAt: null } }),
        prisma.category.findMany({ where: { deletedAt: null } }),
        prisma.inventoryMovement.findMany({ where: { deletedAt: null } })
      ]);

      const totalEntrada = movements
        .filter(m => m.movementType === 'entrada')
        .reduce((sum, m) => sum + m.quantity, 0);

      const totalSalida = movements
        .filter(m => m.movementType === 'salida')
        .reduce((sum, m) => sum + m.quantity, 0);

      const currentStock = products.reduce((sum, p) => sum + p.quantityInStock, 0);

      return {
        total_products: products.length,
        total_categories: categories.length,
        total_entrada: totalEntrada,
        total_salida: totalSalida,
        current_stock: currentStock
      };
    } catch (error) {
      throw new Error('Error al obtener resumen: ' + error.message);
    }
  }

  /**
   * Obtener movimientos por período
   */
  static async getMovementsByPeriod(startDate, endDate) {
    try {
      const movements = await prisma.inventoryMovement.findMany({
        where: {
          deletedAt: null,
          createdAt: {
            gte: new Date(startDate),
            lte: new Date(endDate)
          }
        },
        include: {
          product: true
        }
      });

      return movements;
    } catch (error) {
      throw new Error('Error al obtener movimientos: ' + error.message);
    }
  }

  /**
   * Obtener productos más vendidos
   */
  static async getTopProducts(limit = 10) {
    try {
      const products = await prisma.product.findMany({
        where: { deletedAt: null },
        include: {
          inventoryMovements: {
            where: {
              movementType: 'salida',
              deletedAt: null
            }
          }
        }
      });

      const topProducts = products
        .map(p => ({
          id: p.id,
          name: p.name,
          sku: p.sku,
          total_sold: p.inventoryMovements.reduce((sum, m) => sum + m.quantity, 0)
        }))
        .sort((a, b) => b.total_sold - a.total_sold)
        .slice(0, limit);

      return topProducts;
    } catch (error) {
      throw new Error('Error al obtener productos top: ' + error.message);
    }
  }

  /**
   * Obtener productos con stock bajo
   */
  static async getLowStockProducts(threshold = 10) {
    try {
      const products = await prisma.product.findMany({
        where: {
          deletedAt: null,
          quantityInStock: {
            lte: threshold
          }
        },
        include: { category: true },
        orderBy: { quantityInStock: 'asc' }
      });

      return products;
    } catch (error) {
      throw new Error('Error al obtener productos stock bajo: ' + error.message);
    }
  }

  /**
   * Obtener distribución por categoría
   */
  static async getCategoryDistribution() {
    try {
      const categories = await prisma.category.findMany({
        where: { deletedAt: null },
        include: {
          products: {
            where: { deletedAt: null }
          }
        }
      });

      const distribution = categories.map(c => ({
        category_id: c.id,
        category_name: c.name,
        product_count: c.products.length,
        total_stock: c.products.reduce((sum, p) => sum + p.quantityInStock, 0),
        total_value: c.products.reduce((sum, p) => sum + (p.price * p.quantityInStock), 0)
      }));

      return distribution;
    } catch (error) {
      throw new Error('Error al obtener distribución: ' + error.message);
    }
  }
}

module.exports = ReportModel;
