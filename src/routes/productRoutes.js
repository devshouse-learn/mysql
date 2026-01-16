const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');
const { authenticateToken } = require('../middleware/auth');

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Obtener todos los productos
 *     tags: [Productos]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           description: Buscar por nombre, SKU o descripción
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, all]
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *           description: Precio mínimo
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *           description: Precio máximo
 *       - in: query
 *         name: minStock
 *         schema:
 *           type: integer
 *           description: Stock mínimo disponible
 *       - in: query
 *         name: supplier
 *         schema:
 *           type: string
 *           description: Filtrar por proveedor
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, price, quantity_in_stock, created_at]
 *           default: name
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *       - in: query
 *         name: barcode
 *         schema:
 *           type: string
 *         description: Buscar por código de barras
 *       - in: query
 *         name: hasStock
 *         schema:
 *           type: boolean
 *         description: Filtrar productos con stock disponible
 *       - in: query
 *         name: lowStock
 *         schema:
 *           type: boolean
 *         description: Filtrar productos con stock bajo (menor al reorderLevel)
 *     responses:
 *       200:
 *         description: Lista de productos con paginación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 *   post:
 *     summary: Crear nuevo producto
 *     tags: [Productos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, sku, price, categoryId]
 *             properties:
 *               name:
 *                 type: string
 *               sku:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               cost:
 *                 type: number
 *               categoryId:
 *                 type: integer
 *               quantityInStock:
 *                 type: integer
 *               reorderLevel:
 *                 type: integer
 *               supplier:
 *                 type: string
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 *       400:
 *         description: Datos inválidos
 */
router.get('/', ProductController.getAll);
router.post('/', ProductController.create);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Obtener producto por ID
 *     description: Retorna los detalles completos de un producto incluyendo su categoría
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del producto
 *         example: 1
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Producto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *   put:
 *     summary: Actualizar producto
 *     description: Actualiza los datos de un producto existente (todos los campos son opcionales)
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del producto a actualizar
 *         example: 1
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Laptop Dell XPS 15
 *               sku:
 *                 type: string
 *                 example: DELL-XPS-002
 *               description:
 *                 type: string
 *                 example: Versión mejorada
 *               price:
 *                 type: number
 *                 example: 1499.99
 *               cost:
 *                 type: number
 *                 example: 1199.99
 *               categoryId:
 *                 type: integer
 *                 example: 1
 *               quantityInStock:
 *                 type: integer
 *                 example: 15
 *               reorderLevel:
 *                 type: integer
 *                 example: 5
 *               supplier:
 *                 type: string
 *                 example: Dell Inc.
 *               barcode:
 *                 type: string
 *                 example: 123456789012
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *                 example: active
 *     responses:
 *       200:
 *         description: Producto actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *                 message:
 *                   type: string
 *                   example: Producto actualizado exitosamente
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *   delete:
 *     summary: Eliminar producto (soft delete)
 *     description: Realiza un soft delete del producto (no se elimina físicamente de la base de datos)
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del producto a eliminar
 *         example: 1
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Producto eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get('/:id', ProductController.getById);
router.put('/:id', ProductController.update);
router.delete('/:id', ProductController.delete);

/**
 * @swagger
 * /api/products/category/{categoryId}:
 *   get:
 *     summary: Obtener productos por categoría
 *     description: Lista todos los productos de una categoría específica
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         description: ID de la categoría
 *         example: 1
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, all]
 *         description: Filtrar por estado
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Lista de productos de la categoría
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */

/**
 * @swagger
 * /api/products/low-stock:
 *   get:
 *     summary: Productos con stock bajo
 *     description: Lista productos que están por debajo de su nivel de reorden
 *     tags: [Productos]
 *     parameters:
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *         description: Filtrar por categoría
 *       - in: query
 *         name: threshold
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Nivel máximo de stock a considerar
 *     responses:
 *       200:
 *         description: Lista de productos con stock bajo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 */

module.exports = router;
