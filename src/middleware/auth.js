const jwt = require('jsonwebtoken');

// Modo de desarrollo: sin autenticación requerida
const DEV_MODE = process.env.NODE_ENV !== 'production';

const authenticateToken = (req, res, next) => {
  // En desarrollo, permitir acceso sin token
  if (DEV_MODE) {
    req.user = { id: 1, username: 'dev', role: 'admin' }; // Usuario mock
    return next();
  }

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({
      error: 'Token no proporcionado',
      code: 'TOKEN_MISSING'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'tu-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({
        error: 'Token inválido o expirado',
        code: 'TOKEN_INVALID'
      });
    }
    
    req.user = user;
    next();
  });
};

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET || 'tu-secret-key', (err, user) => {
      if (!err) {
        req.user = user;
      }
    });
  }
  
  next();
};

module.exports = { authenticateToken, optionalAuth };
