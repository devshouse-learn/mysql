const InventoryMovementModel = require('../models/InventoryMovementModel');
const ProductModel = require('../models/ProductModel');
const Joi = require('joi');

// Esquema de validación para POST
const movementSchema = Joi.object({
  product_id: Joi.number().integer().required(),
  warehouse_id: Joi.number().integer().optional(),
  movement_type: Joi.string().valid('entrada', 'salida').required(),
  quantity: Joi.number().integer().positive().required(),
  notes: Joi.string().max(500).allow('').optional(),
  reference_type: Joi.string().max(100).allow('').optional(),
  reference_id: Joi.string().max(100).allow('').optional(),
  created_by: Joi.number().integer().optional()
});

// Esquema de validación para PUT (campos opcionales)
const updateMovementSchema = Joi.object({
  product_id: Joi.number().integer(),
  warehouse_id: Joi.number().integer(),
  movement_type: Joi.string().valid('entrada', 'salida'),
  quantity: Joi.number().integer().positive(),
  notes: Joi.string().max(500).allow('').optional(),
  reference_type: Joi.string().max(100).allow('').optional(),
  reference_id: Joi.string().max(100).allow('').optional()
});

class InventoryMovementController {
  /**
   * GET /inventory-movements
   * Obtener todos los movimientos de inventario
   */
  static async getAll(req, res) {
    try {
      const filters = {
        product_id: req.query.product_id,
        movement_type: req.query.movement_type,
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        minQuantity: req.query.minQuantity,
        maxQuantity: req.query.maxQuantity,
        page: req.query.page,
        limit: req.query.limit
      };

      const result = await InventoryMovementModel.getAll(filters);
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
   * GET /inventory-movements/product/:productId
   * Obtener movimientos de un producto específico
   */
  static async getByProductId(req, res) {
    try {
      const { productId } = req.params;

      // Verificar que el producto existe
      const product = await ProductModel.getById(productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          error: 'Producto no encontrado'
        });
      }

      const movements = await InventoryMovementModel.getByProductId(productId);
      res.json({
        success: true,
        data: movements,
        total: movements.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * POST /inventory-movements
   * Registrar movimiento de inventario
   */
  static async create(req, res) {
    try {
      const { error, value } = movementSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          error: error.details[0].message
        });
      }

      // Verificar que el producto existe
      const product = await ProductModel.getById(value.product_id);
      if (!product) {
        return res.status(404).json({
          success: false,
          error: 'Producto no encontrado'
        });
      }

      // Validar que la salida no exceda el stock
      if (value.movement_type === 'salida' && value.quantity > product.quantityInStock) {
        return res.status(400).json({
          success: false,
          error: `Stock insuficiente. Disponible: ${product.quantityInStock}`
        });
      }

      const movement = await InventoryMovementModel.create(value);
      res.status(201).json({
        success: true,
        data: movement,
        message: 'Movimiento de inventario registrado exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * GET /inventory-movements/:id
   * Obtener movimiento por ID
   */
  static async getById(req, res) {
    try {
      const { id } = req.params;

      const movement = await InventoryMovementModel.getByIdDirect(id);

      if (!movement) {
        return res.status(404).json({
          success: false,
          error: 'Movimiento no encontrado'
        });
      }

      res.json({
        success: true,
        data: movement
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * PUT /inventory-movements/:id
   * Actualizar movimiento de inventario
   */
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { error, value } = updateMovementSchema.validate(req.body, { allowUnknown: false });
      
      if (error) {
        return res.status(400).json({
          success: false,
          error: error.details[0].message
        });
      }

      const movement = await InventoryMovementModel.getByIdDirect(id);
      if (!movement) {
        return res.status(404).json({
          success: false,
          error: 'Movimiento no encontrado'
        });
      }

      // Si se actualiza product_id, verificar que existe
      if (value.product_id) {
        const product = await ProductModel.getById(value.product_id);
        if (!product) {
          return res.status(404).json({
            success: false,
            error: 'Producto no encontrado'
          });
        }
      }

      const updated = await InventoryMovementModel.update(id, value);
      res.json({
        success: true,
        data: updated,
        message: 'Movimiento de inventario actualizado exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * DELETE /inventory-movements/:id
   * Eliminar movimiento de inventario
   */
  static async delete(req, res) {
    try {
      const { id } = req.params;

      const movement = await InventoryMovementModel.getByIdDirect(id);
      if (!movement) {
        return res.status(404).json({
          success: false,
          error: 'Movimiento no encontrado'
        });
      }

      await InventoryMovementModel.delete(id);
      res.json({
        success: true,
        message: 'Movimiento eliminado exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = InventoryMovementController;
