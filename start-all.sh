#!/bin/bash

# Script para iniciar Backend y Frontend simultáneamente

echo "🚀 Iniciando Sistema de Inventario"
echo "==================================="
echo ""

# Detener procesos anteriores
echo "🔄 Deteniendo procesos anteriores..."
pkill -f "nodemon src/server.js" 2>/dev/null
pkill -f "vite" 2>/dev/null
sleep 2

# Iniciar Backend
echo "📦 Iniciando Backend..."
cd "/Users/ibacrea/mysql keli /BACKEND." && npm run dev > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
sleep 3

# Verificar Backend
if lsof -ti:3000 > /dev/null; then
    echo "✅ Backend iniciado en http://localhost:3000"
else
    echo "❌ Error al iniciar Backend"
    cat /tmp/backend.log
    exit 1
fi

# Iniciar Frontend
echo "🎨 Iniciando Frontend..."
cd "/Users/ibacrea/mysql keli /FROTEND." && npm run dev > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
sleep 3

# Verificar Frontend
if lsof -ti:5173 > /dev/null; then
    echo "✅ Frontend iniciado en http://localhost:5173"
else
    echo "❌ Error al iniciar Frontend"
    cat /tmp/frontend.log
    exit 1
fi

echo ""
echo "==================================="
echo "✨ Sistema completamente iniciado"
echo "==================================="
echo ""
echo "📍 URLs:"
echo "   Frontend:  http://localhost:5173"
echo "   Backend:   http://localhost:3000"
echo "   Swagger:   http://localhost:3000/api-docs"
echo ""
echo "👤 Credenciales:"
echo "   Email:     kelib@gmail.com"
echo "   Password:  03v5h0u53"
echo ""
echo "📝 Para detener los servidores:"
echo "   ./stop-all.sh"
echo ""
echo "⚠️  Mantén esta terminal abierta"
echo ""

# Mantener el script corriendo
tail -f /tmp/backend.log /tmp/frontend.log
