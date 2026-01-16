const Joi = require('joi');
const UserModel = require('../models/UserModel');
const { logger } = require('../middleware/logger');

const registerSchema = Joi.object({
  username: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  fullName: Joi.string().optional()
});

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
});

const updateProfileSchema = Joi.object({
  fullName: Joi.string().optional(),
  email: Joi.string().email().optional()
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required(),
  confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({
    'any.only': 'Las contraseñas no coinciden'
  })
});

class UserController {
  static async register(req, res) {
    try {
      const { error, value } = registerSchema.validate(req.body);
      
      if (error) {
        logger.warn(`Validación fallida en registro: ${error.details[0].message}`);
        return res.status(400).json({ error: error.details[0].message });
      }
      
      const user = await UserModel.register(value.username, value.email, value.password, value.fullName);
      logger.info(`Nuevo usuario registrado: ${user.username}`);
      
      res.status(201).json({
        message: 'Usuario registrado exitosamente',
        user
      });
    } catch (error) {
      logger.error(`Error en registro: ${error.message}`);
      res.status(400).json({ error: error.message });
    }
  }

  static async login(req, res) {
    try {
      const { error, value } = loginSchema.validate(req.body);
      
      if (error) {
        logger.warn(`Validación fallida en login: ${error.details[0].message}`);
        return res.status(400).json({ error: error.details[0].message });
      }
      
      const result = await UserModel.login(value.username, value.password);
      logger.info(`Login exitoso: ${value.username}`);
      
      res.status(200).json({
        message: 'Login exitoso',
        ...result
      });
    } catch (error) {
      logger.warn(`Login fallido: ${error.message}`);
      res.status(401).json({ error: error.message });
    }
  }

  static async getProfile(req, res) {
    try {
      const user = await UserModel.getUserById(req.user.id);
      
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      
      res.status(200).json({ user });
    } catch (error) {
      logger.error(`Error al obtener perfil: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  }

  static async listUsers(req, res) {
    try {
      const users = await UserModel.getAll();
      res.status(200).json({ users });
    } catch (error) {
      logger.error(`Error al listar usuarios: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  }

  static async updateProfile(req, res) {
    try {
      const { error, value } = updateProfileSchema.validate(req.body);
      
      if (error) {
        logger.warn(`Validación fallida en actualización de perfil: ${error.details[0].message}`);
        return res.status(400).json({ error: error.details[0].message });
      }
      
      const updatedUser = await UserModel.updateUser(req.user.id, value);
      logger.info(`Perfil actualizado: ${updatedUser.username}`);
      
      res.status(200).json({
        success: true,
        message: 'Perfil actualizado exitosamente',
        data: updatedUser
      });
    } catch (error) {
      logger.error(`Error al actualizar perfil: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  }

  static async changePassword(req, res) {
    try {
      const { error, value } = changePasswordSchema.validate(req.body);
      
      if (error) {
        logger.warn(`Validación fallida en cambio de contraseña: ${error.details[0].message}`);
        return res.status(400).json({ error: error.details[0].message });
      }
      
      await UserModel.changePassword(req.user.id, value.currentPassword, value.newPassword);
      logger.info(`Contraseña cambiada para usuario ID: ${req.user.id}`);
      
      res.status(200).json({
        success: true,
        message: 'Contraseña actualizada exitosamente'
      });
    } catch (error) {
      logger.error(`Error al cambiar contraseña: ${error.message}`);
      res.status(401).json({ error: error.message });
    }
  }

  static async refreshToken(req, res) {
    try {
      const result = await UserModel.refreshToken(req.user.id);
      logger.info(`Token renovado para usuario ID: ${req.user.id}`);
      
      res.status(200).json({
        success: true,
        message: 'Token renovado exitosamente',
        ...result
      });
    } catch (error) {
      logger.error(`Error al renovar token: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  }

  static async logout(req, res) {
    try {
      // En una implementación real con Redis o base de datos,
      // aquí invalidarías el token
      logger.info(`Logout exitoso para usuario ID: ${req.user.id}`);
      
      res.status(200).json({
        success: true,
        message: 'Logout exitoso'
      });
    } catch (error) {
      logger.error(`Error en logout: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  }
}
