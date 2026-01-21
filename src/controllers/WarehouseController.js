const WarehouseModel = require('../models/WarehouseModel');
const Joi = require('joi');

// Esquema de validación para bodega
const warehouseSchema = Joi.object({
  name: Joi.string().required().min(3).max(100),
  location: Joi.string().allow('', null),
  description: Joi.string().allow('', null),
  isActive: Joi.boolean()
});

// Esquema de validación para actualización
const warehouseUpdateSchema = Joi.object({
  name: Joi.string().min(3).max(100),
  location: Joi.string().allow('', null),
  description: Joi.string().allow('', null),
  isActive: Joi.boolean()
});

// Esquema de validación para asignar/quitar producto
const assignProductSchema = Joi.object({
  productId: Joi.number().integer().positive().required()
});

class WarehouseController {
  /**
   * GET /warehouses
   * Obtener todas las bodegas
   */
  static async getAll(req, res) {
    try {
      const options = {
        search: req.query.search,
        isActive: req.query.isActive,
        page: req.query.page ? parseInt(req.query.page) : 1,
        limit: req.query.limit ? parseInt(req.query.limit) : 10
      };
      const result = await WarehouseModel.getAll(options);
      res.json({
        success: true,
        ...result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * GET /warehouses/:id
   * Obtener bodega por ID
   */
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const warehouse = await WarehouseModel.getById(id);

      if (!warehouse) {
        return res.status(404).json({
          success: false,
          error: 'Bodega no encontrada'
        });
      }

      res.json({
        success: true,
        data: warehouse
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * POST /warehouses
   * Crear nueva bodega
   */
  static async create(req, res) {
    try {
      const { error, value } = warehouseSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          error: error.details[0].message
        });
      }

      const warehouse = await WarehouseModel.create(value);

      res.status(201).json({
        success: true,
        message: 'Bodega creada exitosamente',
        data: warehouse
      });
    } catch (error) {
      if (error.message.includes('Ya existe')) {
        return res.status(409).json({
          success: false,
          error: error.message
        });
      }

      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * PUT /warehouses/:id
   * Actualizar bodega
   */
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { error, value } = warehouseUpdateSchema.validate(req.body);
      
      if (error) {
        return res.status(400).json({
          success: false,
          error: error.details[0].message
        });
      }

      const warehouse = await WarehouseModel.update(id, value);

      res.json({
        success: true,
        message: 'Bodega actualizada exitosamente',
        data: warehouse
      });
    } catch (error) {
      if (error.message === 'Bodega no encontrada') {
        return res.status(404).json({
          success: false,
          error: error.message
        });
      }

      if (error.message.includes('Ya existe')) {
        return res.status(409).json({
          success: false,
          error: error.message
        });
      }

      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * DELETE /warehouses/:id
   * Eliminar bodega (soft delete)
   */
  static async delete(req, res) {
    try {
      const { id } = req.params;
      await WarehouseModel.delete(id);

      res.json({
        success: true,
        message: 'Bodega eliminada exitosamente'
      });
    } catch (error) {
      if (error.message === 'Bodega no encontrada') {
        return res.status(404).json({
          success: false,
          error: error.message
        });
      }

      if (error.message.includes('No se puede eliminar')) {
        return res.status(400).json({
          success: false,
          error: error.message
        });
      }

      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * POST /warehouses/:id/products
   * Asignar un producto a la bodega
   */
  static async assignProduct(req, res) {
    try {
      const { id } = req.params;
      const { error, value } = assignProductSchema.validate(req.body);
      
      if (error) {
        return res.status(400).json({
          success: false,
          error: error.details[0].message
        });
      }

      const product = await WarehouseModel.assignProduct(id, value.productId);

      res.json({
        success: true,
        message: 'Producto asignado a la bodega exitosamente',
        data: product
      });
    } catch (error) {
      if (error.message.includes('no encontrad')) {
        return res.status(404).json({
          success: false,
          error: error.message
        });
      }

      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * DELETE /warehouses/products/:productId
   * Quitar un producto de su bodega
   */
  static async removeProduct(req, res) {
    try {
      const { productId } = req.params;
      const product = await WarehouseModel.removeProduct(productId);

      res.json({
        success: true,
        message: 'Producto removido de la bodega exitosamente',
        data: product
      });
    } catch (error) {
      if (error.message === 'Producto no encontrado') {
        return res.status(404).json({
          success: false,
          error: error.message
        });
      }

      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = WarehouseController;
