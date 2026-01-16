const prisma = require('../config/prisma');

class ReportModel {
  static async getInventorySummary(filters = {}) {
    try {
      const { categoryId, startDate, endDate } = filters;
      
      const whereProduct = { deletedAt: null };
      const whereMovement = { deletedAt: null };
      
      if (categoryId) {
        whereProduct.categoryId = parseInt(categoryId);
        whereMovement.product = { categoryId: parseInt(categoryId) };
      }
      
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        
        whereMovement.createdAt = { gte: start, lte: end };
      }

      const [products, categories, movements] = await Promise.all([
        prisma.product.findMany({ where: whereProduct }),
        prisma.category.findMany({ where: { deletedAt: null } }),
        prisma.inventoryMovement.findMany({ where: whereMovement, include: { product: true } })
      ]);

      const totalEntrada = movements.filter(m => m.movementType === 'entrada').reduce((sum, m) => sum + m.quantity, 0);
      const totalSalida = movements.filter(m => m.movementType === 'salida').reduce((sum, m) => sum + m.quantity, 0);
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

  static async getMovementsByPeriod(filters = {}) {
    try {
      const { startDate, endDate, movementType, productId, categoryId, minQuantity, maxQuantity, reason, sortBy = 'createdAt', order = 'desc', page = 1, limit = 20 } = filters;

      const where = { deletedAt: null };
      
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        where.createdAt = { gte: start, lte: end };
      }
      
      if (movementType) where.movementType = movementType;
      if (productId) where.productId = parseInt(productId);
      if (categoryId) where.product = { categoryId: parseInt(categoryId) };
      
      if (minQuantity || maxQuantity) {
        where.quantity = {};
        if (minQuantity) where.quantity.gte = parseInt(minQuantity);
        if (maxQuantity) where.quantity.lte = parseInt(maxQuantity);
      }
      
      if (reason) where.reason = { contains: reason, mode: 'insensitive' };

      const orderBy = {};
      if (sortBy === 'date') orderBy.createdAt = order;
      else if (sortBy === 'quantity') orderBy.quantity = order;
      else if (sortBy === 'product') orderBy.product = { name: order };
      else orderBy[sortBy] = order;

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const take = parseInt(limit);

      const [movements, total] = await Promise.all([
        prisma.inventoryMovement.findMany({ where, include: { product: { include: { category: true } } }, orderBy, skip, take }),
        prisma.inventoryMovement.count({ where })
      ]);

      return {
        data: movements,
        pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) }
      };
    } catch (error) {
      throw new Error('Error al obtener movimientos: ' + error.message);
    }
  }

  static async getTopProducts(filters = {}) {
    try {
      const { limit = 10, categoryId, startDate, endDate, minSold } = filters;
      
      const whereProduct = { deletedAt: null };
      const whereMovement = { movementType: 'salida', deletedAt: null };
      
      if (categoryId) whereProduct.categoryId = parseInt(categoryId);
      
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        whereMovement.createdAt = { gte: start, lte: end };
      }

      const products = await prisma.product.findMany({
        where: whereProduct,
        include: { inventoryMovements: { where: whereMovement }, category: true }
      });

      let topProducts = products
        .map(p => ({
          id: p.id,
          name: p.name,
          sku: p.sku,
          price: p.price,
          category: p.category?.name,
          total_sold: p.inventoryMovements.reduce((sum, m) => sum + m.quantity, 0)
        }))
        .filter(p => !minSold || p.total_sold >= parseInt(minSold))
        .sort((a, b) => b.total_sold - a.total_sold)
        .slice(0, parseInt(limit));

      return topProducts;
    } catch (error) {
      throw new Error('Error al obtener productos top: ' + error.message);
    }
  }

  static async getLowStockProducts(filters = {}) {
    try {
      const { threshold = 10, categoryId, search, sortBy = 'quantityInStock', order = 'asc', minPrice, maxPrice } = filters;

      const where = { deletedAt: null, quantityInStock: { lte: parseInt(threshold) } };
      
      if (categoryId) where.categoryId = parseInt(categoryId);
      
      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { sku: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      if (minPrice || maxPrice) {
        where.price = {};
        if (minPrice) where.price.gte = parseFloat(minPrice);
        if (maxPrice) where.price.lte = parseFloat(maxPrice);
      }

      const orderByObj = {};
      orderByObj[sortBy] = order;

      const products = await prisma.product.findMany({ where, include: { category: true }, orderBy: orderByObj });

      return products;
    } catch (error) {
      throw new Error('Error al obtener productos stock bajo: ' + error.message);
    }
  }

  static async getCategoryDistribution(filters = {}) {
    try {
      const { minProducts, minStock, minValue, sortBy = 'total_value', order = 'desc' } = filters;

      const categories = await prisma.category.findMany({
        where: { deletedAt: null },
        include: { products: { where: { deletedAt: null } } }
      });

      let distribution = categories.map(c => ({
        category_id: c.id,
        category_name: c.name,
        product_count: c.products.length,
        total_stock: c.products.reduce((sum, p) => sum + p.quantityInStock, 0),
        total_value: c.products.reduce((sum, p) => sum + (p.price * p.quantityInStock), 0)
      }));

      if (minProducts) distribution = distribution.filter(d => d.product_count >= parseInt(minProducts));
      if (minStock) distribution = distribution.filter(d => d.total_stock >= parseInt(minStock));
      if (minValue) distribution = distribution.filter(d => d.total_value >= parseFloat(minValue));

      distribution.sort((a, b) => {
        const aVal = a[sortBy];
        const bVal = b[sortBy];
        return order === 'asc' ? aVal - bVal : bVal - aVal;
      });

      return distribution;
    } catch (error) {
      throw new Error('Error al obtener distribución: ' + error.message);
    }
  }
}

module.exports = ReportModel;