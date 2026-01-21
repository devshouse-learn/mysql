#!/bin/bash

echo "🚀 Iniciando Sistema de Gestión de Inventario..."
echo ""

# Verificar si el backend ya está corriendo
if lsof -i :3000 > /dev/null 2>&1; then
    echo "⚠️  Backend ya está corriendo en puerto 3000"
else
    echo "🔵 Iniciando Backend en puerto 3000..."
    cd "/Users/ibacrea/mysql keli /BACKEND." && PORT=3000 node src/server.js > backend.log 2>&1 &
    BACKEND_PID=$!
    sleep 2
    echo "✅ Backend iniciado (PID: $BACKEND_PID)"
fi

# Verificar si el frontend ya está corriendo
if lsof -i :5173 > /dev/null 2>&1; then
    echo "⚠️  Frontend ya está corriendo en puerto 5173"
else
    echo "🟢 Iniciando Frontend en puerto 5173..."
    cd "/Users/ibacrea/mysql keli /BACKEND./FRONTEND" && npm run dev > frontend.log 2>&1 &
    FRONTEND_PID=$!
    sleep 2
    echo "✅ Frontend iniciado (PID: $FRONTEND_PID)"
fi

echo ""
echo "✨ Sistema iniciado correctamente!"
echo ""
echo "📱 Aplicación Frontend: http://localhost:5173"
echo "🔧 API Backend:         http://localhost:3000"
echo "📚 Swagger Docs:        http://localhost:3000/api-docs"
echo ""
echo "👤 Credenciales de prueba:"
echo "   Usuario: admin"
echo "   Contraseña: admin123"
echo ""
echo "📝 Logs:"
echo "   Backend:  tail -f backend.log"
echo "   Frontend: tail -f frontend.log"
echo ""
echo "🛑 Para detener: ./stop-servers.sh"
