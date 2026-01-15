#!/bin/bash

# Script de Setup Rápido - API de Gestión de Inventario
# Ejecuta: chmod +x setup.sh && ./setup.sh

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Setup - API de Gestión de Inventario                    ║"
echo "╚════════════════════════════════════════════════════════════╝"

# 1. Instalar dependencias
echo -e "\n[1/3] Instalando dependencias npm..."
npm install
if [ $? -ne 0 ]; then
    echo "Error al instalar dependencias"
    exit 1
fi
echo "✓ Dependencias instaladas"

# 2. Crear archivo .env
if [ ! -f .env ]; then
    echo -e "\n[2/3] Creando archivo .env..."
    cp .env.example .env
    echo "✓ Archivo .env creado"
    echo "⚠️  IMPORTANTE: Edita .env con tus credenciales MySQL"
else
    echo -e "\n[2/3] Archivo .env ya existe"
fi

# 3. Información final
echo -e "\n[3/3] Resumen de pasos finales:"
echo "─────────────────────────────────────────────────────────────"
echo ""
echo "1. Editar .env con credenciales MySQL:"
echo "   nano .env"
echo ""
echo "2. Crear la base de datos:"
echo "   mysql -u root -p < config/database.sql"
echo ""
echo "3. Iniciar el servidor:"
echo "   npm run dev    (Desarrollo con auto-reload)"
echo "   npm start      (Producción)"
echo ""
echo "4. Acceder a recursos:"
echo "   API:     http://localhost:3000"
echo "   Swagger: http://localhost:3000/api-docs"
echo "   Postman: Importar 'Postman_Collection.json'"
echo ""
echo "─────────────────────────────────────────────────────────────"
echo "✓ Setup completado!"
echo ""
