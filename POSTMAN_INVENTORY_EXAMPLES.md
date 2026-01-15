# 🧪 MOVIMIENTOS DE INVENTARIO - Ejemplos Completos para Postman

## ✅ MOVIMIENTOS - Ejemplos Listos para Copiar

### 1️⃣ POST - Crear Movimiento de Inventario (ENTRADA)
```
Método: POST
URL: http://localhost:3000/api/inventory-movements

Headers:
Content-Type: application/json

Body (raw - JSON):
{
  "product_id": 1,
  "movement_type": "entrada",
  "quantity": 10,
  "reference_type": "compra",
  "reference_id": "PO-2026-001",
  "notes": "Compra a proveedor XYZ"
}
```

**Respuesta esperada (201):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "productId": 1,
    "movementType": "entrada",
    "quantity": 10,
    "referenceType": "compra",
    "referenceId": "PO-2026-001",
    "notes": "Compra a proveedor XYZ",
    "createdAt": "2026-01-15T...",
    "deletedAt": null
  },
  "message": "Movimiento de inventario registrado exitosamente"
}
```

---

### 2️⃣ POST - Crear Movimiento (SALIDA)
```
Método: POST
URL: http://localhost:3000/api/inventory-movements

Headers:
Content-Type: application/json

Body (raw - JSON):
{
  "product_id": 1,
  "movement_type": "salida",
  "quantity": 3,
  "reference_type": "venta",
  "reference_id": "INV-2026-100",
  "notes": "Venta a cliente ABC"
}
```

---

### 3️⃣ POST - Crear Movimiento (AJUSTE)
```
Método: POST
URL: http://localhost:3000/api/inventory-movements

Headers:
Content-Type: application/json

Body (raw - JSON):
{
  "product_id": 1,
  "movement_type": "ajuste",
  "quantity": -2,
  "reference_type": "ajuste",
  "reference_id": "ADJ-2026-001",
  "notes": "Productos dañados encontrados en auditoría"
}
```

---

### 4️⃣ GET - Obtener Todos los Movimientos
```
Método: GET
URL: http://localhost:3000/api/inventory-movements?page=1&limit=10

Headers:
Content-Type: application/json
```

**Con filtros:**
```
GET http://localhost:3000/api/inventory-movements?page=1&limit=10&product_id=1&movement_type=entrada
```

---

### 5️⃣ GET - Obtener Movimiento por ID
```
Método: GET
URL: http://localhost:3000/api/inventory-movements/1

Headers:
Content-Type: application/json
```

---

### 6️⃣ PUT - Actualizar Movimiento (NUEVO)
```
Método: PUT
URL: http://localhost:3000/api/inventory-movements/1

Headers:
Content-Type: application/json

Body (raw - JSON):
{
  "product_id": 1,
  "movement_type": "entrada",
  "quantity": 15,
  "reference_type": "compra",
  "reference_id": "PO-2026-001",
  "notes": "Compra actualizada - cantidad corregida"
}
```

---

### 7️⃣ DELETE - Eliminar Movimiento
```
Método: DELETE
URL: http://localhost:3000/api/inventory-movements/1

Headers:
Content-Type: application/json
```

---

## 📋 Campos Requeridos para POST

| Campo | Tipo | Requerido | Valores | Notas |
|-------|------|----------|---------|-------|
| product_id | integer | ✅ | - | ID del producto existente |
| movement_type | string | ✅ | entrada, salida, ajuste | Tipo de movimiento |
| quantity | integer | ✅ | > 0 o < 0 | Cantidad del movimiento |
| reference_type | string | ❌ | compra, venta, ajuste, devolución | Tipo de referencia |
| reference_id | string | ❌ | - | ID de documento relacionado |
| notes | string | ❌ | - | Notas adicionales |

---

## ⚠️ Errores Comunes

### ❌ Error 400 - "product_id is required"
```json
❌ INCORRECTO:
{
  "movement_type": "entrada",
  "quantity": 10
}

✅ CORRECTO:
{
  "product_id": 1,
  "movement_type": "entrada",
  "quantity": 10
}
```

### ❌ Error 400 - "movement_type must be entrada or salida"
```json
❌ INCORRECTO:
{
  "movement_type": "transfer"
}

✅ CORRECTO:
{
  "movement_type": "entrada"
}

Valores válidos: entrada, salida, ajuste, devolución
```

### ❌ Error 400 - "Stock insuficiente"
```
Problema: Intentas hacer una salida pero no hay suficiente stock

Solución:
1. Haz primero una entrada (GET /api/products/1 para ver stock)
2. Luego haz la salida con cantidad ≤ stock disponible
```

### ❌ Error 404 - "Producto no encontrado"
```
Solución: Haz primero GET /api/products para obtener IDs válidos
```

---

## 🔄 Ejemplo Completo de Workflow

**Paso 1: Crear un producto**
```
POST /api/products
{
  "name": "Mouse inalámbrico",
  "sku": "MOUSE-001",
  "price": 29.99,
  "categoryId": 1,
  "quantityInStock": 0
}
Respuesta: id = 50
```

**Paso 2: Registrar entrada de inventario**
```
POST /api/inventory-movements
{
  "product_id": 50,
  "movement_type": "entrada",
  "quantity": 100,
  "reference_type": "compra",
  "reference_id": "PO-2026-050"
}
Stock ahora: 100
```

**Paso 3: Registrar salida (venta)**
```
POST /api/inventory-movements
{
  "product_id": 50,
  "movement_type": "salida",
  "quantity": 10,
  "reference_type": "venta",
  "reference_id": "INV-2026-500"
}
Stock ahora: 90
```

**Paso 4: Actualizar movimiento anterior**
```
PUT /api/inventory-movements/{id}
{
  "product_id": 50,
  "movement_type": "salida",
  "quantity": 15,
  "reference_type": "venta",
  "reference_id": "INV-2026-500"
}
Stock ahora: 85 (restando la diferencia)
```
