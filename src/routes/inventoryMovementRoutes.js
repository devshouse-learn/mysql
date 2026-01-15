const express = require('express');
const router = express.Router();
const InventoryMovementController = require('../controllers/InventoryMovementController');

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
 *           enum: [entrada, salida, ajuste, devolución]
 *     responses:
 *       200:
 *         description: Lista de movimientos
 *   post:
 *     summary: Crear nuevo movimiento de inventario
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
 *               movement_type:
 *                 type: string
 *                 enum: [entrada, salida, ajuste, devolución]
 *               quantity:
 *                 type: integer
 *               reference_type:
 *                 type: string
 *               reference_id:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Movimiento creado exitosamente
 *       400:
 *         description: Datos inválidos
 */
router.get('/', InventoryMovementController.getAll);
router.post('/', InventoryMovementController.create);

/**
 * @swagger
 * /api/inventory-movements/{id}:
 *   get:
 *     summary: Obtener movimiento de inventario por ID
 *     tags: [Movimientos de Inventario]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Movimiento encontrado
 *       404:
 *         description: Movimiento no encontrado
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
 *                 enum: [entrada, salida, ajuste, devolución]
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
router.put('/:id', InventoryMovementController.update);
router.delete('/:id', InventoryMovementController.delete);

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
