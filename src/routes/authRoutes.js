const express = require('express');
const UserController = require('../controllers/UserController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar nuevo usuario
 *     description: Crea una nueva cuenta de usuario en el sistema
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 example: juanperez
 *                 description: Nombre de usuario único
 *               email:
 *                 type: string
 *                 format: email
 *                 example: usuario@example.com
 *                 description: Email único del usuario
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: password123
 *                 description: Contraseña (mínimo 6 caracteres)
 *               fullName:
 *                 type: string
 *                 example: Juan Pérez
 *                 description: Nombre completo del usuario
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuario registrado exitosamente
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */
router.post('/register', UserController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login de usuario
 *     description: Autenticación de usuario y obtención de token JWT
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin
 *                 description: Nombre de usuario
 *               password:
 *                 type: string
 *                 example: admin123
 *                 description: Contraseña del usuario
 *     responses:
 *       200:
 *         description: Login exitoso, devuelve token JWT
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login exitoso
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                   description: Token JWT para autenticación
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Credenciales inválidas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               error: Credenciales inválidas
 */
router.post('/login', UserController.login);

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Obtener perfil del usuario autenticado
 *     description: Retorna la información completa del usuario actualmente autenticado
 *     tags: [Autenticación]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *   put:
 *     summary: Actualizar perfil del usuario
 *     description: Permite al usuario actualizar su información de perfil (nombre completo, email)
 *     tags: [Autenticación]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: Juan Carlos Pérez
 *                 description: Nombre completo del usuario
 *               email:
 *                 type: string
 *                 format: email
 *                 example: nuevoemail@example.com
 *                 description: Nuevo email del usuario
 *           examples:
 *             updateFullName:
 *               summary: Actualizar solo nombre
 *               value:
 *                 fullName: María González López
 *             updateEmail:
 *               summary: Actualizar solo email
 *               value:
 *                 email: maria.gonzalez@empresa.com
 *             updateBoth:
 *               summary: Actualizar ambos campos
 *               value:
 *                 fullName: María González López
 *                 email: maria.gonzalez@empresa.com
 *     responses:
 *       200:
 *         description: Perfil actualizado exitosamente
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
 *                   example: Perfil actualizado exitosamente
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/profile', authenticateToken, UserController.getProfile);
router.put('/profile', authenticateToken, UserController.updateProfile);

/**
 * @swagger
 * /api/auth/change-password:
 *   post:
 *     summary: Cambiar contraseña
 *     description: Permite al usuario autenticado cambiar su contraseña actual
 *     tags: [Autenticación]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *               - confirmPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: oldpassword123
 *                 description: Contraseña actual del usuario
 *               newPassword:
 *                 type: string
 *                 minLength: 6
 *                 example: newpassword456
 *                 description: Nueva contraseña (mínimo 6 caracteres)
 *               confirmPassword:
 *                 type: string
 *                 example: newpassword456
 *                 description: Confirmación de la nueva contraseña
 *     responses:
 *       200:
 *         description: Contraseña actualizada exitosamente
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
 *                   example: Contraseña actualizada exitosamente
 *       400:
 *         description: Validación fallida o contraseñas no coinciden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: Las contraseñas no coinciden
 *       401:
 *         description: Contraseña actual incorrecta o no autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: Contraseña actual incorrecta
 */
router.post('/change-password', authenticateToken, UserController.changePassword);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Cerrar sesión
 *     description: Cierra la sesión del usuario autenticado (en implementación completa invalidaría el token)
 *     tags: [Autenticación]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Logout exitoso
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
 *                   example: Logout exitoso
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post('/logout', authenticateToken, UserController.logout);

module.exports = router;
