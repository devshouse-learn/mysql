# 📋 MOVIMIENTOS DE INVENTARIO - EJEMPLOS LISTOS (Copiar y Pegar)

## ⚠️ IMPORTANTE PRIMERO

**ANTES de crear movimientos, necesitas:**
1. IDs de PRODUCTOS que existan
2. Verificar el stock disponible

**Haz primero:**
```
GET http://localhost:3000/api/products
```

Esto te muestra los productos y sus IDs.

---

## 1️⃣ GET - Ver Todos los Movimientos

**URL:**
```
http://localhost:3000/api/inventory-movements
```

**Método:** GET

**Headers:**
```
Content-Type: application/json
```

**Body:** Vacío (no enviar nada)

**Resultado esperado:** 200 ✅ (lista de movimientos)

---

## 2️⃣ GET - Ver Movimiento por ID

**URL:**
```
http://localhost:3000/api/inventory-movements/1
```

**Método:** GET

**Headers:**
```
Content-Type: application/json
```

**Body:** Vacío (no enviar nada)

**Resultado esperado:** 200 ✅

---

## 3️⃣ POST - Crear Movimiento (ENTRADA - Compra)

**URL:**
```
http://localhost:3000/api/inventory-movements
```

**Método:** POST

**Headers:**
```
Content-Type: application/json
```

**Body (Copiar exacto):**
```json
{
  "product_id": 1,
  "movement_type": "entrada",
  "quantity": 50,
  "reference_type": "compra",
  "reference_id": "PO-2026-001",
  "notes": "Compra inicial de productos"
}
```

**Resultado esperado:** 201 ✅ (creado)

**Nota:** 
- `product_id`: ID del producto (1, 2, 3, etc.)
- `movement_type`: Puede ser: `entrada`, `salida`, `ajuste`, `devolución`
- `quantity`: Número de unidades
- El stock del producto se actualiza automáticamente

---

## 4️⃣ POST - Crear Movimiento (SALIDA - Venta)

**URL:**
```
http://localhost:3000/api/inventory-movements
```

**Método:** POST

**Headers:**
```
Content-Type: application/json
```

**Body (Copiar exacto):**
```json
{
  "product_id": 1,
  "movement_type": "salida",
  "quantity": 10,
  "reference_type": "venta",
  "reference_id": "INV-2026-100",
  "notes": "Venta a cliente XYZ"
}
```

**Resultado esperado:** 201 ✅

**Importante:** La cantidad de salida NO puede exceder el stock disponible.

---

## 5️⃣ POST - Crear Movimiento (AJUSTE)

**URL:**
```
http://localhost:3000/api/inventory-movements
```

**Método:** POST

**Headers:**
```
Content-Type: application/json
```

**Body (Copiar exacto):**
```json
{
  "product_id": 1,
  "movement_type": "ajuste",
  "quantity": -5,
  "reference_type": "ajuste",
  "reference_id": "ADJ-2026-001",
  "notes": "Productos dañados encontrados en auditoría"
}
```

**Resultado esperado:** 201 ✅

**Nota:** Para ajustes, usa cantidad negativa (-5) para reducir stock.

---

## 6️⃣ PUT - Actualizar Movimiento (NUEVO)

**URL:**
```
http://localhost:3000/api/inventory-movements/1
```

**Método:** PUT

**Headers:**
```
Content-Type: application/json
```

**Body (Copiar exacto):**
```json
{
  "product_id": 1,
  "movement_type": "entrada",
  "quantity": 75,
  "reference_type": "compra",
  "reference_id": "PO-2026-001",
  "notes": "Compra actualizada - cantidad corregida a 75"
}
```

**Resultado esperado:** 200 ✅

**Importante:** Al actualizar, se recalcula automáticamente el cambio en stock.

---

## 7️⃣ DELETE - Eliminar Movimiento

**URL:**
```
http://localhost:3000/api/inventory-movements/1
```

**Método:** DELETE

**Headers:**
```
Content-Type: application/json
```

**Body:** Vacío (no enviar nada)

**Resultado esperado:** 200 ✅

---

## 🎯 Orden para Probar TODO

```
1. GET http://localhost:3000/api/inventory-movements
   Resultado: 200 ✅

2. GET http://localhost:3000/api/inventory-movements/1
   Resultado: 200 ✅

3. POST http://localhost:3000/api/inventory-movements
   Body: {"product_id": 1, "movement_type": "entrada", "quantity": 50, ...}
   Resultado: 201 ✅

4. POST http://localhost:3000/api/inventory-movements
   Body: {"product_id": 1, "movement_type": "salida", "quantity": 10, ...}
   Resultado: 201 ✅

5. PUT http://localhost:3000/api/inventory-movements/1
   Body: {"product_id": 1, "movement_type": "entrada", "quantity": 75, ...}
   Resultado: 200 ✅

6. DELETE http://localhost:3000/api/inventory-movements/1
   Resultado: 200 ✅
```

**Si todos son ✅ = TODO FUNCIONA CORRECTAMENTE**

---

## 🛠️ SOLUCIÓN DE ERRORES

### ❌ Error 400 - "product_id is required"
```json
❌ MAL:
{
  "movement_type": "entrada",
  "quantity": 50
}

✅ BIEN:
{
  "product_id": 1,
  "movement_type": "entrada",
  "quantity": 50
}
```

### ❌ Error 400 - "movement_type must be entrada or salida"
```json
❌ MAL:
{
  "movement_type": "transfer"
}

✅ BIEN - Valores válidos:
{
  "movement_type": "entrada"    ← entrada, salida, ajuste, devolución
}
```

### ❌ Error 400 - "Stock insuficiente"
```
Problema: Intentas salida de 50 pero solo tienes 30 en stock

Solución:
1. GET /api/products/1 → Ver stock actual
2. POST salida con cantidad ≤ stock disponible
```

### ❌ Error 404 - "Producto no encontrado"
```
Solución: Usa un product_id que exista
1. GET /api/products → Ver IDs disponibles
2. Usa uno de esos IDs en el movimiento
```

### ❌ Error 404 - "Movimiento no encontrado"
```
Solución: Usa un ID de movimiento que exista
1. GET /api/inventory-movements → Ver IDs disponibles
2. Usa uno de esos IDs en PUT/DELETE
```
