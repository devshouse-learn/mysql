# 🧪 PRODUCTOS - Ejemplos Completos para Postman

## ✅ PRODUCTOS - Ejemplos Listos para Copiar

### 1️⃣ POST - Crear Nuevo Producto
```
Método: POST
URL: http://localhost:3000/api/products

Headers:
Content-Type: application/json

Body (raw - JSON):
{
  "name": "Laptop Dell XPS 13",
  "sku": "DELL-XPS-001",
  "description": "Laptop ultradelgada de 13 pulgadas",
  "price": 1299.99,
  "cost": 900,
  "categoryId": 1,
  "quantityInStock": 5,
  "reorderLevel": 2,
  "supplier": "Dell Inc"
}
```

**Nota importante:** `categoryId` debe ser un ID existente. Haz primero GET /api/categories para obtener IDs válidos.

---

### 2️⃣ GET - Obtener Todos los Productos
```
Método: GET
URL: http://localhost:3000/api/products?page=1&limit=10

Headers:
Content-Type: application/json
```

**Con filtros opcionales:**
```
GET http://localhost:3000/api/products?page=1&limit=10&categoryId=1&search=laptop&status=active
```

---

### 3️⃣ GET - Obtener Producto por ID
```
Método: GET
URL: http://localhost:3000/api/products/1

Headers:
Content-Type: application/json
```

---

### 4️⃣ PUT - Actualizar Producto
```
Método: PUT
URL: http://localhost:3000/api/products/1

Headers:
Content-Type: application/json

Body (raw - JSON):
{
  "name": "Laptop Dell XPS 15",
  "price": 1499.99,
  "quantityInStock": 8,
  "reorderLevel": 3
}
```

---

### 5️⃣ DELETE - Eliminar Producto
```
Método: DELETE
URL: http://localhost:3000/api/products/1

Headers:
Content-Type: application/json
```

---

## 📋 Campos Requeridos para POST

| Campo | Tipo | Requerido | Minimo/Máximo | Notas |
|-------|------|----------|---------------|-------|
| name | string | ✅ | 3-150 | Nombre del producto |
| sku | string | ✅ | 3-50 | Código único del producto |
| price | number | ✅ | > 0 | Precio de venta |
| categoryId | integer | ✅ | - | ID de categoría existente |
| description | string | ❌ | - | Descripción opcional |
| cost | number | ❌ | > 0 | Costo de compra |
| quantityInStock | integer | ❌ | ≥ 0 | Cantidad en inventario |
| reorderLevel | integer | ❌ | ≥ 0 | Cantidad para reordenar |
| supplier | string | ❌ | - | Proveedor |

---

## ⚠️ Errores Comunes

### ❌ Error 400 - "sku is required"
```json
❌ INCORRECTO:
{
  "name": "Laptop",
  "price": 1000,
  "categoryId": 1
}

✅ CORRECTO:
{
  "name": "Laptop",
  "sku": "LAPTOP-001",
  "price": 1000,
  "categoryId": 1
}
```

### ❌ Error 400 - "categoryId not found"
```
Solución: Haz primero GET /api/categories y usa un ID válido
```

### ❌ Error 400 - "SKU already exists"
```json
❌ INCORRECTO - SKU duplicado:
{
  "sku": "LAPTOP-001"
}

✅ CORRECTO - SKU único:
{
  "sku": "LAPTOP-002"
}
```
