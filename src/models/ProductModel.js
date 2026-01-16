// src/models/ProductModel.js
// Modelo de Productos usando Prisma ORM

const prisma = require('../config/prisma');

class ProductModel {
  /**
   * Obtener todos los productos con paginación, búsqueda y filtros
   * @param {number} page - Página (default: 1)
   * @param {number} limit - Límite por página (default: 10)
   * @param {string} search - Búsqueda en nombre, SKU o descripción
   * @param {number} categoryId - Filtrar por categoría
   * @param {string} status - Filtrar por estado (active, inactive)
   * @param {number} minPrice - Precio mínimo
   * @param {number} maxPrice - Precio máximo
   * @param {number} minStock - Stock mínimo
   * @param {string} supplier - Filtrar por proveedor
   * @param {string} sortBy - Campo para ordenar (name, price, quantity_in_stock)
   * @param {string} sortOrder - Orden (asc, desc)
   */
  static async getAll(options = {}) {
    const {
      page = 1,
      limit = 10,
      search = '',
      categoryId,
      status = 'active',
      minPrice,
      maxPrice,
      minStock,
      supplier,
      sortBy = 'name',
      sortOrder = 'asc'
    } = options;

    const skip = (page - 1) * limit;

    // Construir filtros
    const where = {
      deletedAt: null
    };

    // Solo añadir status si no es 'all'
    if (status && status !== 'all') {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (categoryId) {
      where.categoryId = parseInt(categoryId);
    }

    // Filtros de precio
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) {
        where.price.gte = parseFloat(minPrice);
      }
      if (maxPrice !== undefined) {
        where.price.lte = parseFloat(maxPrice);
      }
    }

    // Filtro de stock mínimo
    if (minStock !== undefined) {
      where.quantityInStock = {
        gte: parseInt(minStock)
      };
    }

    // Filtro de proveedor
    if (supplier) {
      where.supplier = {
        contains: supplier,
        mode: 'insensitive'
      };
    }

    // Mapa de campos para ordenamiento
    const sortFieldMap = {
      'name': 'name',
      'price': 'price',
      'quantity_in_stock': 'quantityInStock',
      'created_at': 'createdAt'
    };

    const orderBy = {
      [sortFieldMap[sortBy] || 'name']: sortOrder.toLowerCase() === 'desc' ? 'desc' : 'asc'
    };

    try {
      // Obtener productos y total
      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where,
          include: { category: true },
          skip,
          take: limit,
          orderBy
        }),
        prisma.product.count({ where })
      ]);

      return {
        data: products,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new Error(`Error fetching products: ${error.message}`);
    }
  }

  /**
   * Obtener producto por ID
   */
  static async getById(id) {
    try {
      const parsedId = parseInt(id);
      
      if (isNaN(parsedId)) {
        return null;
      }

      const product = await prisma.product.findUnique({
        where: { id: parsedId },
        include: { category: true }
      });

      if (!product || product.deletedAt) {
        return null;
      }

      return product;
    } catch (error) {
      throw new Error(`Error fetching product: ${error.message}`);
    }
  }

  /**
   * Crear nuevo producto
   */
  static async create(productData) {
    try {
      const product = await prisma.product.create({
        data: {
          name: productData.name,
          sku: productData.sku,
          description: productData.description || null,
          price: parseFloat(productData.price),
          cost: productData.cost ? parseFloat(productData.cost) : null,
          categoryId: parseInt(productData.category_id),
          quantityInStock: parseInt(productData.quantity) || 0,
          reorderLevel: parseInt(productData.reorderLevel) || 10,
          status: productData.status || 'active',
          supplier: productData.supplier || null,
          barcode: productData.barcode || null
        },
        include: { category: true }
      });

      return product;
    } catch (error) {
      throw new Error(`Error creating product: ${error.message}`);
    }
  }

  /**
   * Actualizar producto
   */
  static async update(id, updates) {
    try {
      const parsedId = parseInt(id);
      
      if (isNaN(parsedId)) {
        throw new Error('Invalid product ID');
      }

      const product = await prisma.product.update({
        where: { id: parsedId },
        data: {
          ...(updates.name && { name: updates.name }),
          ...(updates.description !== undefined && { description: updates.description }),
          ...(updates.price && { price: parseFloat(updates.price) }),
          ...(updates.cost && { cost: parseFloat(updates.cost) }),
          ...(updates.category_id && { categoryId: parseInt(updates.category_id) }),
          ...(updates.quantity !== undefined && { quantityInStock: parseInt(updates.quantity) }),
          ...(updates.reorderLevel && { reorderLevel: parseInt(updates.reorderLevel) }),
          ...(updates.status && { status: updates.status }),
          ...(updates.supplier && { supplier: updates.supplier }),
          ...(updates.barcode && { barcode: updates.barcode })
        },
        include: { category: true }
      });

      return product;
    } catch (error) {
      throw new Error(`Error updating product: ${error.message}`);
    }
  }

  /**
   * Soft delete de producto
   */
  static async softDelete(id) {
    try {
      const parsedId = parseInt(id);
      
      if (isNaN(parsedId)) {
        throw new Error('Invalid product ID');
      }

      const product = await prisma.product.update({
        where: { id: parsedId },
        data: { deletedAt: new Date() },
        include: { category: true }
      });

      return product;
    } catch (error) {
      throw new Error(`Error deleting product: ${error.message}`);
    }
  }

  /**
   * Alias para softDelete
   */
  static async delete(id) {
    return this.softDelete(id);
  }

  /**
   * Verificar si SKU existe
   */
  static async checkSkuExists(sku, excludeId = null) {
    try {
      const where = { sku, deletedAt: null };
      if (excludeId) {
        const parsedExcludeId = parseInt(excludeId);
        if (!isNaN(parsedExcludeId)) {
          where.id = { not: parsedExcludeId };
        }
      }

      const product = await prisma.product.findFirst({ where });
      return !!product;
    } catch (error) {
      throw new Error(`Error checking SKU: ${error.message}`);
    }
  }

  /**
   * Obtener estado de stock
   */
  static async getStockStatus(id) {
    try {
      const product = await prisma.product.findUnique({
        where: { id: parseInt(id) }
      });

      if (!product || product.deletedAt) {
        return null;
      }

      return {
        productId: product.id,
        name: product.name,
        currentStock: product.quantityInStock,
        reorderLevel: product.reorderLevel,
        status: product.quantityInStock <= product.reorderLevel ? 'LOW' : 'OK'
      };
    } catch (error) {
      throw new Error(`Error getting stock status: ${error.message}`);
    }
  }

  /**
   * Obtener productos con stock bajo
   */
  static async getLowStockProducts() {
    try {
      const products = await prisma.product.findMany({
        where: {
          deletedAt: null,
          status: 'active'
        },
        include: { category: true },
        orderBy: { quantityInStock: 'asc' }
      });

      return products.filter(p => p.quantityInStock <= p.reorderLevel);
    } catch (error) {
      throw new Error(`Error fetching low stock products: ${error.message}`);
    }
  }
}

module.exports = ProductModel;
