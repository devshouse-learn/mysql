const ProductModel = require('../models/ProductModel');
const Joi = require('joi');

// Esquema de validación para crear producto
const createProductSchema = Joi.object({
  name: Joi.string().required().min(3).max(150),
  description: Joi.string().allow(''),
  category_id: Joi.number().integer().required(),
  price: Joi.number().required().positive(),
  quantity: Joi.number().integer().min(0),
  sku: Joi.string().required().min(3).max(50),
  status: Joi.string().valid('active', 'inactive')
});

// Esquema de validación para actualizar producto
const updateProductSchema = Joi.object({
  name: Joi.string().min(3).max(150),
  description: Joi.string().allow(''),
  category_id: Joi.number().integer(),
  price: Joi.number().positive(),
  quantity: Joi.number().integer().min(0),
  sku: Joi.string().min(3).max(50),
  status: Joi.string().valid('active', 'inactive')
});

class ProductController {
  /**
   * GET /products
   * Obtener todos los productos con filtros opcionales
   */
  static async getAll(req, res) {
    try {
      const filters = {
        category_id: req.query.category_id ? parseInt(req.query.category_id) : null,
        status: req.query.status || null,
        search: req.query.search || null
      };

      const products = await ProductModel.getAll(filters);
      res.json({
        success: true,
        data: products,
        total: products.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * GET /products/:id
   * Obtener producto por ID
   */
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const product = await ProductModel.getById(id);

      if (!product) {
        return res.status(404).json({
          success: false,
          error: 'Producto no encontrado'
        });
      }

      res.json({
        success: true,
        data: product
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * POST /products
   * Crear nuevo producto
   */
  static async create(req, res) {
    try {
      // Validar datos
      const { error, value } = createProductSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          error: error.details[0].message
        });
      }

      // Verificar SKU único
      const skuExists = await ProductModel.checkSkuExists(value.sku);
      if (skuExists) {
        return res.status(400).json({
          success: false,
          error: 'El SKU ya existe'
        });
      }

      const product = await ProductModel.create(value);
      res.status(201).json({
        success: true,
        data: product,
        message: 'Producto creado exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * PUT /products/:id
   * Actualizar producto
   */
  static async update(req, res) {
    try {
      const { id } = req.params;

      // Validar que el producto existe
      const product = await ProductModel.getById(id);
      if (!product) {
        return res.status(404).json({
          success: false,
          error: 'Producto no encontrado'
        });
      }

      // Validar datos
      const { error, value } = updateProductSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          error: error.details[0].message
        });
      }

      // Verificar SKU único si se está actualizando
      if (value.sku && value.sku !== product.sku) {
        const skuExists = await ProductModel.checkSkuExists(value.sku, id);
        if (skuExists) {
          return res.status(400).json({
            success: false,
            error: 'El SKU ya existe'
          });
        }
      }

      const updatedProduct = await ProductModel.update(id, value);
      res.json({
        success: true,
        data: updatedProduct,
        message: 'Producto actualizado exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * DELETE /products/:id
   * Eliminar producto
   */
  static async delete(req, res) {
    try {
      const { id } = req.params;

      const product = await ProductModel.getById(id);
      if (!product) {
        return res.status(404).json({
          success: false,
          error: 'Producto no encontrado'
        });
      }

      await ProductModel.delete(id);
      res.json({
        success: true,
        message: 'Producto eliminado exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = ProductController;
