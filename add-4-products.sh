#!/bin/bash

API_URL="http://localhost:3000/api"

echo "🔐 Iniciando sesión..."
TOKEN=$(curl -s -X POST $API_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' | \
  grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Error obteniendo token"
  exit 1
fi

echo "✅ Token obtenido"
echo ""
echo "📦 Agregando 4 productos nuevos..."
echo ""

echo "1/4: Teclado Mecánico RGB..."
curl -s -X POST $API_URL/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Teclado Mecánico RGB",
    "sku": "KB-MECH-RGB-001",
    "description": "Teclado mecánico con iluminación RGB",
    "price": 2400000,
    "cost": 1800000,
    "categoryId": 1,
    "quantityInStock": 25,
    "reorderLevel": 10,
    "status": "active",
    "supplier": "TechGear Colombia"
  }' > /dev/null 2>&1 && echo "✅ Teclado creado" || echo "⚠️  Ya existe o error"

echo "2/4: Webcam HD 1080p..."
curl -s -X POST $API_URL/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Webcam HD 1080p",
    "sku": "CAM-HD-1080-001",
    "description": "Cámara web Full HD con micrófono integrado",
    "price": 1600000,
    "cost": 1200000,
    "categoryId": 1,
    "quantityInStock": 30,
    "reorderLevel": 8,
    "status": "active",
    "supplier": "VideoTech SAS"
  }' > /dev/null 2>&1 && echo "✅ Webcam creada" || echo "⚠️  Ya existe o error"

echo "3/4: Archivador Metálico..."
curl -s -X POST $API_URL/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Archivador Metálico",
    "sku": "FURN-FILE-001",
    "description": "Archivador metálico de 4 cajones",
    "price": 3200000,
    "cost": 2400000,
    "categoryId": 3,
    "quantityInStock": 12,
    "reorderLevel": 5,
    "status": "active",
    "supplier": "Oficinas Modernas"
  }' > /dev/null 2>&1 && echo "✅ Archivador creado" || echo "⚠️  Ya existe o error"

echo "4/4: Resma Papel Bond..."
curl -s -X POST $API_URL/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Resma Papel Bond",
    "sku": "CON-PAPER-A4-001",
    "description": "Resma de papel bond tamaño carta 500 hojas",
    "price": 240000,
    "cost": 180000,
    "categoryId": 4,
    "quantityInStock": 200,
    "reorderLevel": 50,
    "status": "active",
    "supplier": "Papelería Central"
  }' > /dev/null 2>&1 && echo "✅ Resma creada" || echo "⚠️  Ya existe o error"

echo ""
echo "🎉 Proceso completado!"
echo ""
echo "📊 Total de productos:"
curl -s -X GET "$API_URL/products?limit=1" \
  -H "Authorization: Bearer $TOKEN" | \
  grep -o '"total":[0-9]*' | cut -d':' -f2
