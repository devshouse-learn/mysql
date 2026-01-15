# Manual de Configuración de PostgreSQL para Prisma

Si llegaste hasta aquí es porque PostgreSQL no tiene el usuario `ibacrea` configurado.

## ✅ Opción 1: Usar psql (Línea de Comandos)

Abre una terminal y ejecuta:

```bash
# 1. Conectar a PostgreSQL como usuario postgres
psql -U postgres

# 2. Dentro de psql, ejecutar:
CREATE USER ibacrea WITH PASSWORD 'ibacrea2024';
ALTER USER ibacrea CREATEDB;
CREATE DATABASE inventory_db OWNER ibacrea;
\l          # Listar bases de datos para verificar

# Salir
\q
```

## ✅ Opción 2: Usar DBeaver (Gráfico)

1. **Conecta a PostgreSQL** (Server connection por defecto)
2. En el panel izquierdo, haz clic derecho en **"Databases"** → **New Database**
   - Name: `inventory_db`
   - Owner: `postgres` (por ahora)
3. Haz clic derecho en **"Users"** → **New User**
   - Name: `ibacrea`
   - Password: `ibacrea2024`
   - Checkea: "Superuser", "Can create DB"
4. En la database `inventory_db`, haz clic derecho → **Properties** → cambia Owner a `ibacrea`

## ✅ Verificar Conexión

Después de crear el usuario, ejecuta:

```bash
cd "/Users/ibacrea/mysql keli /BACKEND."
PGPASSWORD='ibacrea2024' psql -U ibacrea -d inventory_db -h localhost -c "SELECT 1;"
```

Deberías ver: `?column?` `1`

## ✅ Ejecutar Migraciones de Prisma

Una vez verificado:

```bash
cd "/Users/ibacrea/mysql keli /BACKEND."
npx prisma migrate deploy
```

O si ya ejecutaste el SQL manualmente:

```bash
npx prisma db push
```

## 🔐 Credenciales Finales

```
Host: localhost
Port: 5432
Database: inventory_db
User: ibacrea
Password: ibacrea2024
```

Esto es exactamente lo que está en tu `.env`:
```
DATABASE_URL="postgresql://ibacrea:ibacrea2024@localhost:5432/inventory_db?schema=public"
```
