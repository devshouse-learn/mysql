# 🎯 API de Gestión de Inventario

Backend completo con Node.js, Express, Prisma ORM y PostgreSQL.

## 📋 Características

- ✅ **Autenticación**: JWT con bcrypt
- ✅ **ORM**: Prisma para PostgreSQL
- ✅ **Validación**: Joi schemas
- ✅ **Logging**: Winston (archivos + consola)
- ✅ **Documentación**: Swagger UI
- ✅ **Soft Delete**: En todas las tablas principales
- ✅ **Paginación**: En todos los endpoints de listado

## 🚀 Inicio Rápido

### 1. Instalar Dependencias
```bash
npm install
```

### 2. Configurar Base de Datos

El archivo `.env` ya está configurado. Ejecutar migraciones:

```bash
# Generar cliente Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate deploy

# (Opcional) Ver datos en Prisma Studio
npx prisma studio
```

### 3. Iniciar Servidor
```bash
# Desarrollo (con nodemon)
npm run dev

# Producción
npm start
```

El servidor estará disponible en: **http://localhost:3000**

## 📚 Documentación

- **Swagger UI**: http://localhost:3000/api-docs
- **Endpoints**: Ver sección de API más abajo

## 🔑 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/profile` - Obtener perfil (requiere token)

### Categorías
- `GET /api/categories` - Listar categorías (paginado)
- `POST /api/categories` - Crear categoría
- `GET /api/categories/:id` - Obtener categoría
- `PUT /api/categories/:id` - Actualizar categoría
- `DELETE /api/categories/:id` - Eliminar categoría

### Productos
- `GET /api/products` - Listar productos (paginado, filtros)
- `POST /api/products` - Crear producto
- `GET /api/products/:id` - Obtener producto
- `PUT /api/products/:id` - Actualizar producto
- `DELETE /api/products/:id` - Eliminar producto

### Movimientos de Inventario
- `GET /api/inventory-movements` - Listar movimientos (paginado)
- `POST /api/inventory-movements` - Crear movimiento
- `GET /api/inventory-movements/:id` - Obtener movimiento
- `GET /api/inventory-movements/product/:id` - Movimientos de un producto

### Reportes (requieren autenticación)
- `GET /api/reports/inventory-summary` - Resumen de inventario
- `GET /api/reports/movements-by-period` - Movimientos por período
- `GET /api/reports/top-products` - Productos más vendidos
- `GET /api/reports/low-stock` - Productos con stock bajo
- `GET /api/reports/category-distribution` - Distribución por categoría

## 📖 Guías Disponibles

- **[QUICK_START_PRISMA.md](docs/QUICK_START_PRISMA.md)** - Guía rápida de Prisma
- **[GUIA_POSTMAN_COMPLETA.md](docs/GUIA_POSTMAN_COMPLETA.md)** - Ejemplos de uso con Postman
- **[CATEGORIAS_EJEMPLOS_COMPLETOS.md](docs/CATEGORIAS_EJEMPLOS_COMPLETOS.md)** - Ejemplos de categorías
- **[PRODUCTOS_EJEMPLOS_COMPLETOS.md](docs/PRODUCTOS_EJEMPLOS_COMPLETOS.md)** - Ejemplos de productos
- **[MOVIMIENTOS_EJEMPLOS_COMPLETOS.md](docs/MOVIMIENTOS_EJEMPLOS_COMPLETOS.md)** - Ejemplos de movimientos
- **[ERRORES_CORREGIDOS.md](docs/ERRORES_CORREGIDOS.md)** - Lista de correcciones aplicadas
- **[VERIFICACION_BACKEND.md](docs/VERIFICACION_BACKEND.md)** - Guía de verificación
- **[LIMPIEZA_PROYECTO.md](docs/LIMPIEZA_PROYECTO.md)** - Resumen de la limpieza

## 🏗️ Estructura del Proyecto

```
BACKEND/
├── README.md                  # 📖 Documentación principal
├── package.json               # Dependencias y scripts
├── .env                       # Variables de entorno
├── .gitignore                 # Archivos ignorados
│
├── docs/                      # 📚 Documentación
│   ├── QUICK_START_PRISMA.md
│   ├── GUIA_POSTMAN_COMPLETA.md
│   ├── CATEGORIAS_EJEMPLOS_COMPLETOS.md
│   ├── PRODUCTOS_EJEMPLOS_COMPLETOS.md
│   ├── MOVIMIENTOS_EJEMPLOS_COMPLETOS.md
│   ├── ERRORES_CORREGIDOS.md
│   ├── VERIFICACION_BACKEND.md
│   └── LIMPIEZA_PROYECTO.md
│
├── config/
│   └── swagger.js             # Configuración Swagger
│
├── src/
│   ├── server.js              # Punto de entrada
│   ├── config/
│   │   └── prisma.js          # Cliente Prisma singleton
│   ├── controllers/           # Lógica de negocio
│   ├── models/                # Modelos con Prisma
│   ├── routes/                # Rutas de Express
│   └── middleware/
│       ├── auth.js            # Autenticación JWT
│       └── logger.js          # Winston logging
│
├── prisma/
│   ├── schema.prisma          # Esquema de base de datos
│   ├── seed.js                # Datos iniciales
│   └── migrations/            # Historial de migraciones
│
└── logs/                      # Logs de la aplicación
```

## 🛠️ Tecnologías

- **Node.js** 18+
- **Express** 4.18
- **Prisma ORM** 5.8
- **PostgreSQL** 14+
- **JWT** para autenticación
- **Bcrypt** para hash de contraseñas
- **Joi** para validación
- **Winston** para logging
- **Swagger** para documentación

## 📝 Variables de Entorno

El archivo `.env` incluye:

```env
DATABASE_URL=postgresql://ibacrea:password@localhost:5432/inventory_db
PORT=3000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=24h
```

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Con coverage
npm test -- --coverage
```

## 🔧 Comandos Útiles de Prisma

```bash
# Generar cliente Prisma
npx prisma generate

# Ver estado de migraciones
npx prisma migrate status

# Crear nueva migración
npx prisma migrate dev --name nombre_migracion

# Aplicar migraciones en producción
npx prisma migrate deploy

# Abrir Prisma Studio (GUI)
npx prisma studio

# Sincronizar schema sin migraciones
npx prisma db push

# Ver schema de DB actual
npx prisma db pull
```

## 📊 Estructura de Respuestas

### Éxito (Listados)
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "pages": 10
  }
}
```

### Éxito (Operaciones)
```json
{
  "success": true,
  "data": {...},
  "message": "Operación exitosa"
}
```

### Error
```json
{
  "success": false,
  "error": "Mensaje descriptivo del error"
}
```

## 🔐 Autenticación

La mayoría de endpoints requieren token JWT en el header:

```
Authorization: Bearer <token>
```

Para obtener un token:
1. Registra un usuario: `POST /api/auth/register`
2. Inicia sesión: `POST /api/auth/login`
3. Usa el token recibido en los siguientes requests

## 📞 Soporte

Para más información, consulta las guías en el directorio raíz o la documentación Swagger.

## 📄 Licencia

MIT

---

**Última actualización**: 16 de enero de 2026
