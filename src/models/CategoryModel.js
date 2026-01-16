const prisma = require('../config/prisma');

class CategoryModel {
  /**
   * Obtener todas las categorías
   * @param {string} search - Búsqueda por nombre
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
        where.name = {
          contains: search,
          mode: 'insensitive'
        };
      }

      if (isActive !== undefined) {
        where.isActive = isActive === 'true' || isActive === true;
      }

      const [categories, total] = await Promise.all([
        prisma.category.findMany({
          where,
          orderBy: { name: 'asc' },
          skip,
          take: limit
        }),
        prisma.category.count({ where })
      ]);

      return {
        data: categories,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      };
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
