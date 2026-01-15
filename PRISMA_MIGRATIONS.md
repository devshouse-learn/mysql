# 🔄 Migraciones de Prisma - Guía de Instalación y Uso

## ✅ Requisitos Previos

- PostgreSQL ejecutándose en localhost:5432
- Usuario `ibacrea` con contraseña `ibacrea2024` creado
- Base de datos `inventory_db` creada y asignada al usuario

## 📋 Pasos para Ejecutar las Migraciones

### 1. Instalar Dependencias (npm install)

Desde el directorio `/Users/ibacrea/mysql keli/BACKEND.`:

```bash
npm install
```

Esto instalará:
- `@prisma/client` - Cliente de Prisma para Node.js
- `prisma` - CLI de Prisma para migraciones
- Todas las demás dependencias

### 2. Opción A: Usar Prisma Migrate (Recomendado)

Si aún **no has ejecutado el schema SQL** en DBeaver:

```bash
npx prisma migrate deploy
```

Esto:
- Crea la base de datos si no existe
- Ejecuta todas las tablas y relaciones
- Inserta datos de ejemplo
- Crea todos los índices

### 3. Opción B: Ya Ejecutaste el SQL en DBeaver

Si ya corriste el script SQL en DBeaver:

```bash
npx prisma db push
```

Prisma sincronizará el schema.prisma con la base de datos existente.

### 4. (Opcional) Resetear Base de Datos Completa

⚠️ **Esto elimina TODOS los datos**:

```bash
npx prisma migrate reset
```

Se te pedirá confirmación antes de proceder.

## 📊 Verificar la Instalación

```bash
# Ver estado de migraciones
npx prisma migrate status

# Abrir Prisma Studio (visualizador gráfico)
npx prisma studio
```

## 🔗 Generar Cliente de Prisma

Si necesitas regenerar el cliente después de cambios en schema.prisma:

```bash
npx prisma generate
```

## 📝 Crear Nueva Migración (Futuro)

Después de cambiar `schema.prisma`:

```bash
npx prisma migrate dev --name nombre_descriptivo_del_cambio
```

Ejemplo:
```bash
npx prisma migrate dev --name add_discount_column
```

## 🐛 Troubleshooting

### Error: "ENOTFOUND localhost" o "connection refused"

Verifica que PostgreSQL está ejecutándose:
```bash
# En macOS con Homebrew
brew services list | grep postgres
```

Inicia PostgreSQL:
```bash
brew services start postgresql
```

### Error: "role ibacrea does not exist"

Crea el usuario en PostgreSQL:
```bash
psql -U postgres -c "CREATE USER ibacrea WITH PASSWORD 'ibacrea2024';"
psql -U postgres -c "ALTER USER ibacrea CREATEDB;"
```

### Error: "database inventory_db does not exist"

Crea la base de datos:
```bash
psql -U postgres -c "CREATE DATABASE inventory_db OWNER ibacrea;"
```

## 📁 Estructura de Migraciones de Prisma

```
prisma/
├── schema.prisma          # Definición del schema
├── migrations/            # Carpeta de migraciones (creada automáticamente)
│   ├── 20240114_init
│   │   └── migration.sql
│   └── migration_lock.toml
└── dev.db                # Base de datos local (si usas SQLite, no en PostgreSQL)
```

## 🚀 Próximos Pasos Después de Migraciones

1. **Actualizar Modelos**: Los archivos en `src/models/` deben usar Prisma en lugar de queries SQL
2. **Instalar npm**: `npm install`
3. **Iniciar servidor**: `npm run dev`
4. **Abrir Swagger**: http://localhost:3000/api-docs
5. **Usar Prisma Studio**: `npx prisma studio` para ver/editar datos gráficamente

## 📚 Recursos de Prisma

- [Documentación Oficial](https://www.prisma.io/docs)
- [Referencia de Schema](https://www.prisma.io/docs/concepts/components/prisma-schema)
- [Migraciones](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Cliente Prisma](https://www.prisma.io/docs/concepts/components/prisma-client)
