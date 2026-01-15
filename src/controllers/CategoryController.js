const CategoryModel = require('../models/CategoryModel');
const Joi = require('joi');

// Esquema de validación
const categorySchema = Joi.object({
  name: Joi.string().required().min(3).max(100),
  description: Joi.string().allow('')
});

class CategoryController {
  /**
   * GET /categories
   * Obtener todas las categorías
   */
  static async getAll(req, res) {
    try {
      const categories = await CategoryModel.getAll();
      res.json({
        success: true,
        data: categories,
        total: categories.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * GET /categories/:id
   * Obtener categoría por ID
   */
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const category = await CategoryModel.getById(id);

      if (!category) {
        return res.status(404).json({
          success: false,
          error: 'Categoría no encontrada'
        });
      }

      res.json({
        success: true,
        data: category
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * POST /categories
   * Crear nueva categoría
   */
  static async create(req, res) {
    try {
      const { error, value } = categorySchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          error: error.details[0].message
        });
      }

      // Verificar nombre único
      const nameExists = await CategoryModel.checkNameExists(value.name);
      if (nameExists) {
        return res.status(400).json({
          success: false,
          error: 'La categoría ya existe'
        });
      }

      const category = await CategoryModel.create(value);
      res.status(201).json({
        success: true,
        data: category,
        message: 'Categoría creada exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * PUT /categories/:id
   * Actualizar categoría
   */
  static async update(req, res) {
    try {
      const { id } = req.params;

      const category = await CategoryModel.getById(id);
      if (!category) {
        return res.status(404).json({
          success: false,
          error: 'Categoría no encontrada'
        });
      }

      const { error, value } = categorySchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          error: error.details[0].message
        });
      }

      // Verificar nombre único
      if (value.name !== category.name) {
        const nameExists = await CategoryModel.checkNameExists(value.name, id);
        if (nameExists) {
          return res.status(400).json({
            success: false,
            error: 'La categoría ya existe'
          });
        }
      }

      const updatedCategory = await CategoryModel.update(id, value);
      res.json({
        success: true,
        data: updatedCategory,
        message: 'Categoría actualizada exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * DELETE /categories/:id
   * Eliminar categoría
   */
  static async delete(req, res) {
    try {
      const { id } = req.params;

      const category = await CategoryModel.getById(id);
      if (!category) {
        return res.status(404).json({
          success: false,
          error: 'Categoría no encontrada'
        });
      }

      await CategoryModel.delete(id);
      res.json({
        success: true,
        message: 'Categoría eliminada exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = CategoryController;
