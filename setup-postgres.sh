#!/bin/bash

# Script para crear usuario y BD en PostgreSQL
# Uso: bash setup-postgres.sh

echo "🐘 PostgreSQL Setup Script"
echo "=========================="
echo ""

# Función para ejecutar comando con password
exec_postgres() {
    local cmd="$1"
    PGPASSWORD="" psql -U postgres -h localhost -c "$cmd" 2>&1
}

echo "1️⃣  Conectando a PostgreSQL..."
if exec_postgres "SELECT 1" > /dev/null; then
    echo "   ✅ PostgreSQL está activo"
else
    echo "   ❌ No se puede conectar a PostgreSQL"
    echo "   Asegúrate de que PostgreSQL está ejecutándose"
    exit 1
fi

echo ""
echo "2️⃣  Creando usuario ibacrea..."
exec_postgres "CREATE USER ibacrea WITH PASSWORD 'ibacrea2024';" 2>/dev/null
exec_postgres "ALTER USER ibacrea CREATEDB;" 2>/dev/null
echo "   ✅ Usuario creado"

echo ""
echo "3️⃣  Creando base de datos inventory_db..."
exec_postgres "CREATE DATABASE inventory_db OWNER ibacrea;" 2>/dev/null
echo "   ✅ Base de datos creada"

echo ""
echo "4️⃣  Verificando credenciales..."
PGPASSWORD="ibacrea2024" psql -U ibacrea -d inventory_db -h localhost -c "SELECT 'Conexión exitosa' AS status;" 2>&1 | grep -q "Conexión exitosa"
if [ $? -eq 0 ]; then
    echo "   ✅ Credenciales válidas"
else
    echo "   ⚠️  Verifica que el usuario se creó correctamente"
fi

echo ""
echo "✅ Setup completado"
echo ""
echo "📝 Próximo paso:"
echo "   cd \"/Users/ibacrea/mysql keli /BACKEND.\""
echo "   npx prisma migrate deploy"
echo ""
