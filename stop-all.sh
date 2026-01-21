#!/bin/bash

echo "🛑 Deteniendo Sistema de Inventario"
echo "===================================="
echo ""

# Detener Backend
echo "Deteniendo Backend..."
pkill -f "nodemon src/server.js"
pkill -f "node src/server.js"

# Detener Frontend
echo "Deteniendo Frontend..."
pkill -f "vite"

sleep 2

# Verificar
if lsof -ti:3000 > /dev/null 2>&1; then
    echo "⚠️  Backend aún corriendo, forzando..."
    kill -9 $(lsof -ti:3000) 2>/dev/null
fi

if lsof -ti:5173 > /dev/null 2>&1; then
    echo "⚠️  Frontend aún corriendo, forzando..."
    kill -9 $(lsof -ti:5173) 2>/dev/null
fi

echo ""
echo "✅ Todos los servidores detenidos"
echo ""
