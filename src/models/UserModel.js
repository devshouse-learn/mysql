const prisma = require('../config/prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class UserModel {
  /**
   * Registrar nuevo usuario
   */
  static async register(username, email, password, fullName) {
    try {
      // Verificar si el usuario ya existe
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { username },
            { email }
          ],
          deletedAt: null
        }
      });

      if (existingUser) {
        throw new Error('El usuario o email ya existe');
      }

      // Hash de la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Crear usuario
      const user = await prisma.user.create({
        data: {
          username,
          email,
          passwordHash: hashedPassword,
          fullName: fullName || null,
          role: 'user',
          isActive: true
        }
      });

      return {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName
      };
    } catch (error) {
      throw new Error(`Error al registrar usuario: ${error.message}`);
    }
  }

  /**
   * Login de usuario
   */
  static async login(username, password) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          username,
          deletedAt: null
        }
      });

      if (!user) {
        throw new Error('Credenciales inválidas');
      }

      const passwordMatch = await bcrypt.compare(password, user.passwordHash);

      if (!passwordMatch) {
        throw new Error('Credenciales inválidas');
      }

      // Generar token JWT
      const token = jwt.sign(
        { id: user.id, username: user.username, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_this_in_production_12345',
        { expiresIn: process.env.JWT_EXPIRATION || '24h' }
      );

      return {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          role: user.role
        }
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Obtener usuario por ID
   */
  static async getUserById(id) {
    try {
      const parsedId = parseInt(id);
      
      if (isNaN(parsedId)) {
        return null;
      }

      const user = await prisma.user.findUnique({
        where: { id: parsedId },
        select: {
          id: true,
          username: true,
          email: true,
          fullName: true,
          role: true,
          isActive: true,
          createdAt: true
        }
      });

      if (!user || user.deletedAt) {
        return null;
      }

      return user;
    } catch (error) {
      throw new Error(`Error al obtener usuario: ${error.message}`);
    }
  }

  /**
   * Obtener todos los usuarios
   */
  static async getAll() {
    try {
      const users = await prisma.user.findMany({
        where: { deletedAt: null },
        select: {
          id: true,
          username: true,
          email: true,
          fullName: true,
          role: true,
          isActive: true,
          createdAt: true
        },
        orderBy: { createdAt: 'desc' }
      });
      return users;
    } catch (error) {
      throw new Error(`Error al listar usuarios: ${error.message}`);
    }
  }

  /**
   * Soft delete de usuario
   */
  static async softDelete(id) {
    try {
      const parsedId = parseInt(id);
      
      if (isNaN(parsedId)) {
        throw new Error('Invalid user ID');
      }

      const user = await prisma.user.update({
        where: { id: parsedId },
        data: { deletedAt: new Date() }
      });
      return true;
    } catch (error) {
      throw new Error(`Error al eliminar usuario: ${error.message}`);
    }
  }
}

module.exports = UserModel;
