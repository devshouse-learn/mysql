const prisma = require('../config/prisma');

class CategoryModel {
  /**
   * Obtener todas las categorías
   */
  static async getAll() {
    try {
      const categories = await prisma.category.findMany({
        where: { deletedAt: null },
        orderBy: { name: 'asc' }
      });
      return categories;
    } catch (error) {
      throw new Error(`Error fetching categories: ${error.message}`);
    }
  }

  /**
   * Obtener categoría por ID
   */
  static async getById(id) {
    try {
      const parsedId = parseInt(id);
      
      if (isNaN(parsedId)) {
        return null;
      }

      const category = await prisma.category.findUnique({
        where: { id: parsedId }
      });

      if (!category || category.deletedAt) {
        return null;
      }

      return category;
    } catch (error) {
      throw new Error(`Error fetching category: ${error.message}`);
    }
  }

  /**
   * Crear categoría
   */
  static async create(data) {
    try {
      const category = await prisma.category.create({
        data: {
          name: data.name,
          description: data.description || null,
          isActive: data.isActive !== false
        }
      });
      return category;
    } catch (error) {
      throw new Error(`Error creating category: ${error.message}`);
    }
  }

  /**
   * Actualizar categoría
   */
  static async update(id, data) {
    try {
      const parsedId = parseInt(id);
      
      if (isNaN(parsedId)) {
        throw new Error('Invalid category ID');
      }

      const category = await prisma.category.update({
        where: { id: parsedId },
        data: {
          ...(data.name && { name: data.name }),
          ...(data.description !== undefined && { description: data.description }),
          ...(data.isActive !== undefined && { isActive: data.isActive })
        }
      });
      return category;
    } catch (error) {
      throw new Error(`Error updating category: ${error.message}`);
    }
  }

  /**
   * Soft delete de categoría
   */
  static async softDelete(id) {
    try {
      const parsedId = parseInt(id);
      
      if (isNaN(parsedId)) {
        throw new Error('Invalid category ID');
      }

      const category = await prisma.category.update({
        where: { id: parsedId },
        data: { deletedAt: new Date() }
      });
      return category;
    } catch (error) {
      throw new Error(`Error deleting category: ${error.message}`);
    }
  }

  /**
   * Alias para softDelete
   */
  static async delete(id) {
    return this.softDelete(id);
  }

  /**
   * Verificar si nombre de categoría existe
   */
  static async checkNameExists(name, excludeId = null) {
    try {
      const where = { name, deletedAt: null };
      if (excludeId) {
        const parsedExcludeId = parseInt(excludeId);
        if (!isNaN(parsedExcludeId)) {
          where.id = { not: parsedExcludeId };
        }
      }

      const category = await prisma.category.findFirst({ where });
      return !!category;
    } catch (error) {
      throw new Error(`Error checking category name: ${error.message}`);
    }
  }
}

module.exports = CategoryModel;
