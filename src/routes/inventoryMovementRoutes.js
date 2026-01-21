const express = require('express');
const router = express.Router();
const InventoryMovementController = require('../controllers/InventoryMovementController');
const { authenticateToken } = require('../middleware/auth');

/**
 * @swagger
 * /api/inventory-movements:
 *   get:
 *     summary: Obtener todos los movimientos de inventario
 *     tags: [Movimientos de Inventario]
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
 *         name: product_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: movement_type
 *         schema:
 *           type: string
 *           enum: [entrada, salida]
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *           description: Fecha inicial (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *           description: Fecha final (YYYY-MM-DD)
 *       - in: query
 *         name: minQuantity
 *         schema:
 *           type: integer
 *           description: Cantidad mínima
 *       - in: query
 *         name: maxQuantity
 *         schema:
 *           type: integer
 *           description: Cantidad máxima
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *           description: Filtrar por categoría del producto
 *       - in: query
 *         name: reference_type
 *         schema:
 *           type: string
 *           description: Tipo de referencia (orden_compra, venta, ajuste, etc.)
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [movement_date, quantity, product_id]
 *           default: movement_date
 *           description: Campo por el cual ordenar
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *           description: Orden ascendente o descendente
 *     responses:
 *       200:
 *         description: Lista de movimientos con paginación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 *   post:
 *     summary: Crear nuevo movimiento de inventario
 *     description: Registra un movimiento de entrada o salida de inventario. Para salidas, verifica que haya stock suficiente.
 *     tags: [Movimientos de Inventario]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [product_id, movement_type, quantity]
 *             properties:
 *               product_id:
 *                 type: integer
 *                 example: 1
 *               movement_type:
 *                 type: string
 *                 enum: [entrada, salida]
 *                 example: entrada
 *               quantity:
 *                 type: integer
 *                 example: 50
 *               reference_type:
 *                 type: string
 *                 example: orden_compra
 *               reference_id:
 *                 type: string
 *                 example: OC-2024-001
 *               notes:
 *                 type: string
 *                 example: Recepción de inventario mensual
 *           examples:
 *             entrada:
 *               summary: Entrada de inventario
 *               value:
 *                 product_id: 1
 *                 movement_type: entrada
 *                 quantity: 100
 *                 reference_type: orden_compra
 *                 reference_id: OC-2024-001
 *                 notes: Compra de inventario inicial
 *             salida:
 *               summary: Salida de inventario
 *               value:
 *                 product_id: 2
 *                 movement_type: salida
 *                 quantity: 5
 *                 reference_type: venta
 *                 reference_id: VTA-2024-050
 *                 notes: Venta a cliente
 *     responses:
 *       201:
 *         description: Movimiento creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/InventoryMovement'
 *                 message:
 *                   type: string
 *                   example: Movimiento de inventario registrado exitosamente
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         description: Producto no encontrado
 */
router.get('/', InventoryMovementController.getAll);
router.post('/', authenticateToken, InventoryMovementController.create);

/**
 * @swagger
 * /api/inventory-movements/{id}:
 *   get:
 *     summary: Obtener movimiento de inventario por ID
 *     description: Retorna los detalles completos de un movimiento incluyendo información del producto
 *     tags: [Movimientos de Inventario]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del movimiento
 *         example: 1
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Movimiento encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/InventoryMovement'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *   put:
 *     summary: Actualizar movimiento de inventario
 *     tags: [Movimientos de Inventario]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_id:
 *                 type: integer
 *               movement_type:
 *                 type: string
 *                 enum: [entrada, salida]
 *               quantity:
 *                 type: integer
 *               reference_type:
 *                 type: string
 *               reference_id:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Movimiento actualizado
 *       400:
 *         description: Datos inválidos
 *   delete:
 *     summary: Eliminar movimiento de inventario
 *     tags: [Movimientos de Inventario]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Movimiento eliminado
 *       404:
 *         description: Movimiento no encontrado
 */
router.get('/:id', InventoryMovementController.getById);
router.put('/:id', authenticateToken, InventoryMovementController.update);
router.delete('/:id', authenticateToken, InventoryMovementController.delete);

/**
 * @swagger
 * /api/inventory-movements/product/{productId}:
 *   get:
 *     summary: Obtener movimientos por producto
 *     tags: [Movimientos de Inventario]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Movimientos del producto
 */
router.get('/product/:productId', InventoryMovementController.getByProductId);

module.exports = router;
