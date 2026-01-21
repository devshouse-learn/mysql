const prisma = require('../config/prisma');

class WarehouseModel {
  /**
   * Obtener todas las bodegas
   * @param {string} search - Búsqueda por nombre o ubicación
   * @param {boolean} isActive - Filtrar por estado (activo/inactivo)
   * @param {number} page - Página (default: 1)
   * @param {number} limit - Límite por página (default: 10)
   */
  static async getAll(options = {}) {
    try {
      const {
        search = '',
        isActive,
        page = 1,
        limit = 10
      } = options;

      const skip = (page - 1) * limit;

      // Construir filtros
      const where = { deletedAt: null };

      if (search) {
        where.OR = [
          {
            name: {
              contains: search,
              mode: 'insensitive'
            }
          },
          {
            location: {
              contains: search,
              mode: 'insensitive'
            }
          }
        ];
      }

      if (isActive !== undefined) {
        where.isActive = isActive === 'true' || isActive === true;
      }

      const [warehouses, total] = await Promise.all([
        prisma.warehouse.findMany({
          where,
          include: {
            products: {
              where: { deletedAt: null },
              select: {
                id: true,
                quantityInStock: true
              }
            },
            _count: {
              select: { products: true }
            }
          },
          orderBy: { name: 'asc' },
          skip,
          take: limit
        }),
        prisma.warehouse.count({ where })
      ]);

      // Agregar información de stock a cada bodega
      const warehousesWithStockInfo = warehouses.map(warehouse => {
        const productsWithStock = warehouse.products.filter(p => p.quantityInStock > 0).length;
        const productsWithoutStock = warehouse.products.filter(p => p.quantityInStock === 0).length;
        
        // Remover la lista completa de productos para no saturar la respuesta
        const { products, ...warehouseData } = warehouse;
        
        return {
          ...warehouseData,
          totalProducts: warehouse._count.products,
          productsWithStock,
          productsWithoutStock
        };
      });

      return {
        data: warehousesWithStockInfo,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtener una bodega por ID
   * @param {number} id - ID de la bodega
   */
  static async getById(id) {
    try {
      const warehouse = await prisma.warehouse.findFirst({
        where: {
          id: parseInt(id),
          deletedAt: null
        },
        include: {
          products: {
            where: { deletedAt: null },
            select: {
              id: true,
              name: true,
              sku: true,
              quantityInStock: true,
              price: true,
              cost: true
            },
            orderBy: {
              name: 'asc'
            }
          },
          _count: {
            select: { products: true }
          }
        }
      });

      if (!warehouse) {
        return null;
      }

      // Separar productos con stock y sin stock
      const productsWithStock = warehouse.products.filter(p => p.quantityInStock > 0);
      const productsWithoutStock = warehouse.products.filter(p => p.quantityInStock === 0);

      return {
        ...warehouse,
        productsWithStock,
        productsWithoutStock,
        totalProducts: warehouse.products.length,
        totalWithStock: productsWithStock.length,
        totalWithoutStock: productsWithoutStock.length
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Crear una nueva bodega
   * @param {Object} data - Datos de la bodega
   */
  static async create(data) {
    try {
      const { name, location, description, isActive = true } = data;

      // Validar datos requeridos
      if (!name || name.trim() === '') {
        throw new Error('El nombre de la bodega es requerido');
      }

      // Verificar si ya existe una bodega con el mismo nombre
      const existingWarehouse = await prisma.warehouse.findFirst({
        where: {
          name: {
            equals: name,
            mode: 'insensitive'
          },
          deletedAt: null
        }
      });

      if (existingWarehouse) {
        throw new Error('Ya existe una bodega con ese nombre');
      }

      const warehouse = await prisma.warehouse.create({
        data: {
          name: name.trim(),
          location: location?.trim() || null,
          description: description?.trim() || null,
          isActive
        },
        include: {
          _count: {
            select: { products: true }
          }
        }
      });

      return warehouse;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Actualizar una bodega
   * @param {number} id - ID de la bodega
   * @param {Object} data - Datos a actualizar
   */
  static async update(id, data) {
    try {
      // Verificar que la bodega existe
      const warehouse = await this.getById(id);
      if (!warehouse) {
        throw new Error('Bodega no encontrada');
      }

      // Si se está actualizando el nombre, verificar que no exista otro con el mismo nombre
      if (data.name && data.name !== warehouse.name) {
        const existingWarehouse = await prisma.warehouse.findFirst({
          where: {
            name: {
              equals: data.name,
              mode: 'insensitive'
            },
            id: { not: parseInt(id) },
            deletedAt: null
          }
        });

        if (existingWarehouse) {
          throw new Error('Ya existe otra bodega con ese nombre');
        }
      }

      const updatedData = {};
      if (data.name !== undefined) updatedData.name = data.name.trim();
      if (data.location !== undefined) updatedData.location = data.location?.trim() || null;
      if (data.description !== undefined) updatedData.description = data.description?.trim() || null;
      if (data.isActive !== undefined) updatedData.isActive = data.isActive;

      const updatedWarehouse = await prisma.warehouse.update({
        where: { id: parseInt(id) },
        data: updatedData,
        include: {
          _count: {
            select: { products: true }
          }
        }
      });

      return updatedWarehouse;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Eliminar una bodega (soft delete)
   * @param {number} id - ID de la bodega
   */
  static async delete(id) {
    try {
      // Verificar que la bodega existe
      const warehouse = await this.getById(id);
      if (!warehouse) {
        throw new Error('Bodega no encontrada');
      }

      // Verificar que la bodega no tenga productos
      const productsCount = await prisma.product.count({
        where: {
          warehouseId: parseInt(id),
          deletedAt: null
        }
      });

      if (productsCount > 0) {
        throw new Error(`No se puede eliminar la bodega porque tiene ${productsCount} producto(s) asignado(s)`);
      }

      const deletedWarehouse = await prisma.warehouse.update({
        where: { id: parseInt(id) },
        data: { deletedAt: new Date() }
      });

      return deletedWarehouse;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Asignar un producto a una bodega
   * @param {number} warehouseId - ID de la bodega
   * @param {number} productId - ID del producto
   */
  static async assignProduct(warehouseId, productId) {
    try {
      // Verificar que la bodega existe
      const warehouse = await this.getById(warehouseId);
      if (!warehouse) {
        throw new Error('Bodega no encontrada');
      }

      // Verificar que el producto existe
      const product = await prisma.product.findFirst({
        where: {
          id: parseInt(productId),
          deletedAt: null
        }
      });

      if (!product) {
        throw new Error('Producto no encontrado');
      }

      // Asignar el producto a la bodega
      const updatedProduct = await prisma.product.update({
        where: { id: parseInt(productId) },
        data: { warehouseId: parseInt(warehouseId) }
      });

      return updatedProduct;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Quitar un producto de una bodega
   * @param {number} productId - ID del producto
   */
  static async removeProduct(productId) {
    try {
      const product = await prisma.product.findFirst({
        where: {
          id: parseInt(productId),
          deletedAt: null
        }
      });

      if (!product) {
        throw new Error('Producto no encontrado');
      }

      // Quitar la asignación de bodega
      const updatedProduct = await prisma.product.update({
        where: { id: parseInt(productId) },
        data: { warehouseId: null }
      });

      return updatedProduct;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = WarehouseModel;
