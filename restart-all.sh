#!/bin/bash

echo "🔄 Reiniciando servidores..."

# Detener procesos existentes
echo "⏹️  Deteniendo procesos anteriores..."
pkill -9 -f "node src/server.js" 2>/dev/null
pkill -9 -f "vite" 2>/dev/null
sleep 2

# Limpiar puertos
echo "🧹 Limpiando puertos..."
lsof -ti :3000 | xargs kill -9 2>/dev/null
lsof -ti :5173 | xargs kill -9 2>/dev/null
sleep 2

# Iniciar backend
echo "🚀 Iniciando backend en puerto 3000..."
cd "/Users/ibacrea/mysql keli /BACKEND."
PORT=3000 nohup node src/server.js > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
sleep 3

# Verificar backend
if lsof -i :3000 > /dev/null 2>&1; then
    echo "✅ Backend corriendo en puerto 3000 (PID: $BACKEND_PID)"
else
    echo "❌ Error: Backend no inició correctamente"
    exit 1
fi

# Iniciar frontend
echo "🎨 Iniciando frontend en puerto 5173..."
cd "/Users/ibacrea/mysql keli /BACKEND./FRONTEND"
nohup npm run dev > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
sleep 4

# Verificar frontend
if lsof -i :5173 > /dev/null 2>&1; then
    echo "✅ Frontend corriendo en puerto 5173 (PID: $FRONTEND_PID)"
else
    echo "❌ Error: Frontend no inició correctamente"
    tail -20 /tmp/frontend.log
    exit 1
fi

echo ""
echo "✅ ¡SISTEMA INICIADO CORRECTAMENTE!"
echo ""
echo "📊 URLs:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:3000"
echo "   Swagger:  http://localhost:3000/api-docs"
echo ""
echo "🔐 Credenciales:"
echo "   Usuario:  admin"
echo "   Password: admin123"
echo ""
echo "📝 Logs:"
echo "   Backend:  tail -f /tmp/backend.log"
echo "   Frontend: tail -f /tmp/frontend.log"
