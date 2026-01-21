#!/bin/bash

echo "🛑 Deteniendo servidores..."
echo ""

# Detener procesos en puerto 3000 (Backend)
if lsof -i :3000 > /dev/null 2>&1; then
    PID=$(lsof -t -i :3000)
    kill -9 $PID 2>/dev/null
    echo "✅ Backend detenido (puerto 3000)"
else
    echo "ℹ️  Backend no está corriendo"
fi

# Detener procesos en puerto 5173 (Frontend)
if lsof -i :5173 > /dev/null 2>&1; then
    PID=$(lsof -t -i :5173)
    kill -9 $PID 2>/dev/null
    echo "✅ Frontend detenido (puerto 5173)"
else
    echo "ℹ️  Frontend no está corriendo"
fi

echo ""
echo "✅ Servidores detenidos"
