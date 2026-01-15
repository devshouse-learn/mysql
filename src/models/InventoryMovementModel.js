const prisma = require('../config/prisma');

class InventoryMovementModel {
  /**
   * Obtener todos los movimientos con paginación
   */
  static async getAll(filters = {}) {
    try {
      const page = parseInt(filters.page) || 1;
      const limit = parseInt(filters.limit) || 10;
      const skip = (page - 1) * limit;

      const where = { deletedAt: null };

      if (filters.product_id) {
        where.productId = parseInt(filters.product_id);
      }

      if (filters.movement_type) {
        where.movementType = filters.movement_type;
      }

      const [movements, total] = await Promise.all([
        prisma.inventoryMovement.findMany({
          where,
          include: { product: true, createdBy: true },
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' }
        }),
        prisma.inventoryMovement.count({ where })
      ]);

      return {
        data: movements,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new Error(`Error fetching movements: ${error.message}`);
    }
  }

  /**
   * Crear movimiento de inventario con transacción
   */
  static async create(data) {
    try {
      const result = await prisma.$transaction(async (tx) => {
        // Crear el movimiento
        const movement = await tx.inventoryMovement.create({
          data: {
            productId: parseInt(data.product_id),
            movementType: data.movement_type,
            quantity: parseInt(data.quantity),
            referenceType: data.reference_type || null,
            referenceId: data.reference_id || null,
            notes: data.notes || null,
            createdById: data.created_by ? parseInt(data.created_by) : null
          },
          include: { product: true }
        });

        // Actualizar cantidad de producto
        const quantityChange = data.movement_type === 'entrada' 
          ? parseInt(data.quantity)
          : -parseInt(data.quantity);

        const updatedProduct = await tx.product.update({
          where: { id: parseInt(data.product_id) },
          data: {
            quantityInStock: {
              increment: quantityChange
            }
          }
        });

        return { movement, updatedProduct };
      });

      return result.movement;
    } catch (error) {
      throw new Error(`Error creating movement: ${error.message}`);
    }
  }

  /**
   * Obtener movimientos de un producto
   */
  static async getByProductId(productId) {
    try {
      const movements = await prisma.inventoryMovement.findMany({
        where: {
          productId: parseInt(productId),
          deletedAt: null
        },
        include: { product: true, createdBy: true },
        orderBy: { createdAt: 'desc' }
      });
      return movements;
    } catch (error) {
      throw new Error(`Error fetching product movements: ${error.message}`);
    }
  }

  /**
   * Obtener movimiento por ID
   */
  static async getByIdDirect(id) {
    try {
      const parsedId = parseInt(id);
      
      if (isNaN(parsedId)) {
        return null;
      }

      const movement = await prisma.inventoryMovement.findUnique({
        where: { id: parsedId },
        include: { product: true }
      });
      
      if (!movement || movement.deletedAt) {
        return null;
      }

      return movement;
    } catch (error) {
      throw new Error(`Error fetching movement: ${error.message}`);
    }
  }

  /**
   * Actualizar movimiento de inventario
   */
  static async update(id, data) {
    try {
      const parsedId = parseInt(id);
      
      if (isNaN(parsedId)) {
        throw new Error('Invalid inventory movement ID');
      }

      const result = await prisma.$transaction(async (tx) => {
        // Obtener movimiento actual
        const currentMovement = await tx.inventoryMovement.findUnique({
          where: { id: parsedId },
          include: { product: true }
        });

        if (!currentMovement) {
          throw new Error('Movimiento no encontrado');
        }

        // Calcular cambio en cantidad
        const oldQuantityChange = currentMovement.movementType === 'entrada' 
          ? currentMovement.quantity
          : -currentMovement.quantity;

        const newQuantityChange = data.movement_type === 'entrada' 
          ? parseInt(data.quantity)
          : -parseInt(data.quantity);

        const netQuantityChange = newQuantityChange - oldQuantityChange;

        const parsedProductId = parseInt(data.product_id);

        // Actualizar el movimiento
        const updatedMovement = await tx.inventoryMovement.update({
          where: { id: parsedId },
          data: {
            productId: parsedProductId,
            movementType: data.movement_type,
            quantity: parseInt(data.quantity),
            referenceType: data.reference_type || null,
            referenceId: data.reference_id || null,
            notes: data.notes || null
          },
          include: { product: true }
        });

        // Actualizar cantidad de producto
        await tx.product.update({
          where: { id: parsedProductId },
          data: {
            quantityInStock: {
              increment: netQuantityChange
            }
          }
        });

        return updatedMovement;
      });

      return result;
    } catch (error) {
      throw new Error(`Error updating movement: ${error.message}`);
    }
  }

  /**
   * Soft delete de movimiento
   */
  static async softDelete(id) {
    try {
      const parsedId = parseInt(id);
      
      if (isNaN(parsedId)) {
        throw new Error('Invalid inventory movement ID');
      }

      const movement = await prisma.inventoryMovement.update({
        where: { id: parsedId },
        data: { deletedAt: new Date() }
      });
      return movement;
    } catch (error) {
      throw new Error(`Error deleting movement: ${error.message}`);
    }
  }

  /**
   * Alias para softDelete
   */
  static async delete(id) {
    return this.softDelete(id);
  }
}

module.exports = InventoryMovementModel;
