const express = require('express');
const router = express.Router();
const WarehouseController = require('../controllers/WarehouseController');
const { authenticateToken } = require('../middleware/auth');

/**
 * @swagger
 * /api/warehouses:
 *   get:
 *     summary: Obtener todas las bodegas
 *     tags: [Bodegas]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Resultados por página
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Buscar por nombre o ubicación
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: Filtrar por estado (activo/inactivo)
 *     description: |
 *       Retorna una lista paginada de bodegas con información de stock:
 *       - totalProducts: Total de productos en la bodega
 *       - productsWithStock: Cantidad de productos con stock disponible
 *       - productsWithoutStock: Cantidad de productos sin stock
 *     responses:
 *       200:
 *         description: Lista de bodegas
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
 *                     $ref: '#/components/schemas/Warehouse'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *       400:
 *         description: Error en la petición
 *   post:
 *     summary: Crear nueva bodega
 *     description: Crea una nueva bodega para almacenar productos
 *     tags: [Bodegas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Bodega Principal
 *               location:
 *                 type: string
 *                 example: Zona A, Estante 1-10
 *               description:
 *                 type: string
 *                 example: Bodega para productos de alta rotación
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Bodega creada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Bodega creada exitosamente
 *                 data:
 *                   $ref: '#/components/schemas/Warehouse'
 *       400:
 *         description: Error de validación
 *       409:
 *         description: Ya existe una bodega con ese nombre
 */
router.get('/', WarehouseController.getAll);
router.post('/', authenticateToken, WarehouseController.create);

/**
 * @swagger
 * /api/warehouses/{id}:
 *   get:
 *     summary: Obtener bodega por ID
 *     description: |
 *       Retorna información detallada de la bodega incluyendo:
 *       - productsWithStock: Array de productos con inventario disponible
 *       - productsWithoutStock: Array de productos sin stock
 *       - totalProducts, totalWithStock, totalWithoutStock: Contadores
 *     tags: [Bodegas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la bodega
 *     responses:
 *       200:
 *         description: Detalles de la bodega
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Warehouse'
 *       404:
 *         description: Bodega no encontrada
 *   put:
 *     summary: Actualizar bodega
 *     description: Actualiza la información de una bodega existente
 *     tags: [Bodegas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la bodega
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               location:
 *                 type: string
 *               description:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Bodega actualizada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Bodega actualizada exitosamente
 *                 data:
 *                   $ref: '#/components/schemas/Warehouse'
 *       404:
 *         description: Bodega no encontrada
 *       409:
 *         description: Ya existe otra bodega con ese nombre
 *   delete:
 *     summary: Eliminar bodega
 *     description: Elimina una bodega (soft delete). No se permite si la bodega tiene productos asignados.
 *     tags: [Bodegas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la bodega
 *     responses:
 *       200:
 *         description: Bodega eliminada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Bodega eliminada exitosamente
 *       400:
 *         description: No se puede eliminar porque tiene productos asignados
 *       404:
 *         description: Bodega no encontrada
 */
router.get('/:id', WarehouseController.getById);
router.put('/:id', authenticateToken, WarehouseController.update);
router.delete('/:id', authenticateToken, WarehouseController.delete);

/**
 * @swagger
 * /api/warehouses/{id}/products:
 *   post:
 *     summary: Asignar producto a bodega
 *     description: Asigna un producto existente a una bodega
 *     tags: [Bodegas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la bodega
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productId]
 *             properties:
 *               productId:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       200:
 *         description: Producto asignado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Producto asignado a la bodega exitosamente
 *                 data:
 *                   type: object
 *       404:
 *         description: Bodega o producto no encontrado
 */
router.post('/:id/products', authenticateToken, WarehouseController.assignProduct);

/**
 * @swagger
 * /api/warehouses/products/{productId}:
 *   delete:
 *     summary: Quitar producto de bodega
 *     description: Remueve un producto de su bodega asignada
 *     tags: [Bodegas]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto removido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Producto removido de la bodega exitosamente
 *                 data:
 *                   type: object
 *       404:
 *         description: Producto no encontrado
 */
router.delete('/products/:productId', authenticateToken, WarehouseController.removeProduct);

/**
 * @swagger
 * components:
 *   schemas:
 *     Warehouse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: Bodega Principal
 *         location:
 *           type: string
 *           example: Zona A, Estante 1-10
 *         description:
 *           type: string
 *           example: Bodega para productos de alta rotación
 *         isActive:
 *           type: boolean
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         deletedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         _count:
 *           type: object
 *           properties:
 *             products:
 *               type: integer
 *               example: 15
 *         products:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               name:
 *                 type: string
 *               sku:
 *                 type: string
 *               quantityInStock:
 *                 type: integer
 *               price:
 *                 type: number
 */

module.exports = router;
