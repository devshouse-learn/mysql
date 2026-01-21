#!/bin/bash

echo "🔍 VERIFICACIÓN COMPLETA DEL SISTEMA"
echo "===================================="
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar Backend
echo "1️⃣  Verificando Backend (Puerto 3000)..."
BACKEND=$(lsof -ti:3000)
if [ -z "$BACKEND" ]; then
    echo -e "${RED}❌ Backend NO está corriendo${NC}"
else
    echo -e "${GREEN}✅ Backend corriendo (PID: $BACKEND)${NC}"
fi

# Verificar Frontend
echo ""
echo "2️⃣  Verificando Frontend (Puerto 5173)..."
FRONTEND=$(lsof -ti:5173)
if [ -z "$FRONTEND" ]; then
    echo -e "${RED}❌ Frontend NO está corriendo${NC}"
else
    echo -e "${GREEN}✅ Frontend corriendo (PID: $FRONTEND)${NC}"
fi

# Login Test
echo ""
echo "3️⃣  Probando Login..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"kelib@gmail.com","password":"03v5h0u53"}')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    echo -e "${RED}❌ Login FALLÓ${NC}"
    echo "Respuesta: $LOGIN_RESPONSE"
else
    echo -e "${GREEN}✅ Login exitoso${NC}"
    echo "Token obtenido: ${TOKEN:0:20}..."
fi

# Test Categorías
echo ""
echo "4️⃣  Probando endpoint de Categorías..."
CATEGORIES=$(curl -s http://localhost:3000/api/categories \
  -H "Authorization: Bearer $TOKEN")

if echo "$CATEGORIES" | grep -q "id"; then
    COUNT=$(echo "$CATEGORIES" | grep -o '"id":' | wc -l | tr -d ' ')
    echo -e "${GREEN}✅ Categorías cargadas: $COUNT categorías${NC}"
else
    echo -e "${RED}❌ No se pudieron cargar categorías${NC}"
    echo "Respuesta: $CATEGORIES"
fi

# Test Productos
echo ""
echo "5️⃣  Probando endpoint de Productos..."
PRODUCTS=$(curl -s http://localhost:3000/api/products \
  -H "Authorization: Bearer $TOKEN")

if echo "$PRODUCTS" | grep -q "id"; then
    COUNT=$(echo "$PRODUCTS" | grep -o '"id":' | wc -l | tr -d ' ')
    echo -e "${GREEN}✅ Productos cargados: $COUNT productos${NC}"
else
    echo -e "${RED}❌ No se pudieron cargar productos${NC}"
fi

# Test Bodegas
echo ""
echo "6️⃣  Probando endpoint de Bodegas..."
WAREHOUSES=$(curl -s http://localhost:3000/api/warehouses \
  -H "Authorization: Bearer $TOKEN")

if echo "$WAREHOUSES" | grep -q "id"; then
    COUNT=$(echo "$WAREHOUSES" | grep -o '"id":' | wc -l | tr -d ' ')
    echo -e "${GREEN}✅ Bodegas cargadas: $COUNT bodegas${NC}"
else
    echo -e "${RED}❌ No se pudieron cargar bodegas${NC}"
fi

echo ""
echo "===================================="
echo "📊 RESUMEN"
echo "===================================="
echo -e "${YELLOW}Backend:${NC} http://localhost:3000"
echo -e "${YELLOW}Frontend:${NC} http://localhost:5173"
echo -e "${YELLOW}Swagger:${NC} http://localhost:3000/api-docs"
echo ""
echo -e "${YELLOW}Usuario:${NC} kelib@gmail.com"
echo -e "${YELLOW}Contraseña:${NC} 03v5h0u53"
echo ""
