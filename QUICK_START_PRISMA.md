# 🚀 Quick Start con Prisma - Paso a Paso

## 1️⃣ Instalar Dependencias (5 minutos)

```bash
cd "/Users/ibacrea/mysql keli/BACKEND."
npm install
```

Esto instala:
- ✅ Prisma ORM (`@prisma/client`, `prisma`)
- ✅ Express y dependencias
- ✅ JWT, bcrypt, validaciones
- ✅ Winston logging
- ✅ Todas las demás dependencias

## 2️⃣ Ejecutar Migraciones de Prisma (2 minutos)

### Opción A: Primera vez (Recomendado)

Si aún **NO has corrido el SQL en DBeaver**:

```bash
npx prisma migrate deploy
```

Esto:
- Crea todas las tablas
- Crea índices
- Inserta datos de ejemplo (usuario admin, categorías, productos)

### Opción B: Ya corriste el SQL

Si ya ejecutaste el schema en DBeaver:

```bash
npx prisma db push
```

## 3️⃣ Ver Datos en Prisma Studio (Opcional)

Herramienta visual para ver/editar datos:

```bash
npx prisma studio
```

Se abrirá en http://localhost:5555

## 4️⃣ Instalar npm dependencias (si falta)

```bash
npm install
```

## 5️⃣ Iniciar Servidor

```bash
npm run dev
```

Deberías ver:
```
🎉 Servidor ejecutándose en puerto 3000
📚 Swagger en http://localhost:3000/api-docs
```

## 6️⃣ Verificar en Swagger

1. Abre: http://localhost:3000/api-docs
2. Prueba GET /api/products
3. Deberías ver los 8 productos de ejemplo

## 🔐 Credenciales de Admin

- **Usuario:** admin
- **Email:** admin@inventory.local
- **Password:** admin123 (sin encriptar - para primeras pruebas)

Para login:
```bash
POST /api/auth/login
{
  "username": "admin",
  "password": "admin123"
}
```

Respuesta:
```json
{
  "message": "Login exitoso",
  "token": "eyJhbGc..."
}
```

## 📊 Datos de Ejemplo Incluidos

### Categorías (5):
- Electrónica
- Muebles
- Accesorios
- Software
- Consumibles

### Productos (8):
- Monitor LG 24" ($250)
- Teclado Mecánico ($120)
- Escritorio Ejecutivo ($450)
- Silla Ergonómica ($350)
- Cable HDMI 5m ($15)
- Pasta Térmica ($12)
- Windows 11 Pro ($199)
- Cuadernos Block ($25)

## ⚠️ Troubleshooting

### Error: "ENOTFOUND localhost"

PostgreSQL no está ejecutándose. Inicia:

```bash
brew services start postgresql
```

### Error: "database inventory_db does not exist"

Crea manualmente:

```bash
psql -U postgres -c "CREATE DATABASE inventory_db OWNER ibacrea;"
```

### Error: "role ibacrea does not exist"

```bash
psql -U postgres -c "CREATE USER ibacrea WITH PASSWORD 'ibacrea2024';"
psql -U postgres -c "ALTER USER ibacrea CREATEDB;"
```

## 📖 Documentación Completa

- [PRISMA_MIGRATIONS.md](./PRISMA_MIGRATIONS.md) - Guía completa de Prisma
- [README.md](../README.md) - Documentación general
- [BACKEND_V2_FEATURES.md](../BACKEND_V2_FEATURES.md) - Características del backend

## 🎯 Próximos Pasos

1. ✅ npm install
2. ✅ Ejecutar migraciones
3. ✅ Iniciar servidor (npm run dev)
4. ✅ Probar en Swagger
5. ⬜ Actualizar controladores para usar Prisma
6. ⬜ Ejecutar tests (npm test)
7. ⬜ Desplegar a producción

## 💡 Cambios Principales (Prisma)

**Antes (SQL directo):**
```javascript
const [rows] = await connection.query('SELECT * FROM products WHERE id = ?', [id]);
```

**Ahora (Prisma):**
```javascript
const product = await prisma.product.findUnique({ where: { id } });
```

✨ Más limpio, type-safe y eficiente
