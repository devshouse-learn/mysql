# 📦 PRODUCTOS - EJEMPLOS LISTOS (Copiar y Pegar)

## ⚠️ IMPORTANTE PRIMERO

**ANTES de crear productos, necesitas:**
1. IDs de CATEGORÍAS que existan
2. Nombres únicos para cada producto (SKU único)

**Haz primero:**
```
GET http://localhost:3000/api/categories
```

Esto te muestra las categorías y sus IDs.

---

## 1️⃣ GET - Ver Todos los Productos

**URL:**
```
http://localhost:3000/api/products
```

**Método:** GET

**Headers:**
```
Content-Type: application/json
```

**Body:** Vacío (no enviar nada)

**Resultado esperado:** 200 ✅ (lista de productos)

---

## 2️⃣ GET - Ver Producto por ID

**URL:**
```
http://localhost:3000/api/products/1
```

**Método:** GET

**Headers:**
```
Content-Type: application/json
```

**Body:** Vacío (no enviar nada)

**Resultado esperado:** 200 ✅

---

## 3️⃣ POST - Crear Nuevo Producto

**URL:**
```
http://localhost:3000/api/products
```

**Método:** POST

**Headers:**
```
Content-Type: application/json
```

**Body (Copiar exacto):**
```json
{
  "name": "Mouse Inalámbrico",
  "sku": "MOUSE-001",
  "description": "Mouse inalámbrico de 2.4GHz",
  "price": 29.99,
  "cost": 15.00,
  "categoryId": 1,
  "quantityInStock": 100,
  "reorderLevel": 20,
  "supplier": "Proveedor XYZ"
}
```

**Resultado esperado:** 201 ✅ (creado)

**Campos requeridos:**
- `name` (3-150 caracteres)
- `sku` (3-50 caracteres, ÚNICO)
- `price` (mayor a 0)
- `categoryId` (ID de categoría existente)

**Campos opcionales:**
- `description`
- `cost`
- `quantityInStock`
- `reorderLevel`
- `supplier`

---

## 4️⃣ PUT - Actualizar Producto

**URL:**
```
http://localhost:3000/api/products/1
```

**Método:** PUT

**Headers:**
```
Content-Type: application/json
```

**Body (Copiar exacto):**
```json
{
  "name": "Mouse Inalámbrico Premium",
  "sku": "MOUSE-001",
  "description": "Mouse inalámbrico gaming de 2.4GHz",
  "price": 49.99,
  "cost": 25.00,
  "categoryId": 1,
  "quantityInStock": 150,
  "reorderLevel": 30,
  "supplier": "Proveedor XYZ"
}
```

**Resultado esperado:** 200 ✅

**Importante:** 
- Todos los campos se pueden actualizar
- El SKU debe ser único (no usar uno que ya existe)
- El categoryId debe existir

---

## 5️⃣ DELETE - Eliminar Producto

**URL:**
```
http://localhost:3000/api/products/1
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
1. GET http://localhost:3000/api/products
   Resultado: 200 ✅

2. GET http://localhost:3000/api/products/1
   Resultado: 200 ✅

3. POST http://localhost:3000/api/products
   Body: {"name": "Mouse...", "sku": "MOUSE-001", "price": 29.99, ...}
   Resultado: 201 ✅

4. PUT http://localhost:3000/api/products/1
   Body: {"name": "Mouse Premium", "sku": "MOUSE-001", "price": 49.99, ...}
   Resultado: 200 ✅

5. DELETE http://localhost:3000/api/products/1
   Resultado: 200 ✅
```

**Si todos son ✅ = TODO FUNCIONA CORRECTAMENTE**

---

## 🛠️ SOLUCIÓN DE ERRORES

### ❌ Error 400 - "name is required"
```json
❌ MAL:
{
  "sku": "MOUSE-001",
  "price": 29.99
}

✅ BIEN:
{
  "name": "Mouse",
  "sku": "MOUSE-001",
  "price": 29.99,
  "categoryId": 1
}
```

### ❌ Error 400 - "sku is required"
```json
❌ MAL:
{
  "name": "Mouse",
  "price": 29.99
}

✅ BIEN:
{
  "name": "Mouse",
  "sku": "MOUSE-001",
  "price": 29.99,
  "categoryId": 1
}
```

### ❌ Error 400 - "price is required"
```json
❌ MAL:
{
  "name": "Mouse",
  "sku": "MOUSE-001"
}

✅ BIEN:
{
  "name": "Mouse",
  "sku": "MOUSE-001",
  "price": 29.99,
  "categoryId": 1
}
```

### ❌ Error 400 - "categoryId is required"
```json
❌ MAL:
{
  "name": "Mouse",
  "sku": "MOUSE-001",
  "price": 29.99
}

✅ BIEN:
{
  "name": "Mouse",
  "sku": "MOUSE-001",
  "price": 29.99,
  "categoryId": 1
}
```

### ❌ Error 400 - "SKU already exists"
```
Problema: Ya existe un producto con ese SKU

Solución: Usa un SKU diferente/único
✅ {"sku": "MOUSE-002"}
✅ {"sku": "MOUSE-" + Date.now()}
```

### ❌ Error 404 - "Producto no encontrado"
```
Solución: Usa un ID que exista
1. GET /api/products → Ver IDs disponibles
2. Luego usa uno de esos IDs:
   GET /api/products/1
   GET /api/products/2
   etc
```

---

## 📋 CAMPOS COMPLETOS

| Campo | Tipo | Requerido | Min/Max | Nota |
|-------|------|----------|---------|------|
| name | string | ✅ | 3-150 | Nombre producto |
| sku | string | ✅ | 3-50 | Código único |
| price | number | ✅ | > 0 | Precio venta |
| categoryId | integer | ✅ | - | ID categoría |
| description | string | ❌ | - | Descripción |
| cost | number | ❌ | > 0 | Costo compra |
| quantityInStock | integer | ❌ | ≥ 0 | Cantidad |
| reorderLevel | integer | ❌ | ≥ 0 | Stock mínimo |
| supplier | string | ❌ | - | Proveedor |

---

## 📝 EJEMPLOS RÁPIDOS

### Crear Mouse:
```json
{
  "name": "Mouse USB",
  "sku": "MOUSE-USB-001",
  "price": 15.99,
  "categoryId": 1
}
```

### Crear Teclado:
```json
{
  "name": "Teclado Mecánico",
  "sku": "TECLADO-MECH-001",
  "description": "Teclado mecánico RGB",
  "price": 89.99,
  "cost": 50,
  "categoryId": 1,
  "quantityInStock": 50,
  "reorderLevel": 10
}
```

### Crear Monitor:
```json
{
  "name": "Monitor 27 pulgadas",
  "sku": "MONITOR-27-001",
  "description": "Monitor 4K 27 pulgadas",
  "price": 399.99,
  "cost": 250,
  "categoryId": 1,
  "quantityInStock": 20,
  "reorderLevel": 5,
  "supplier": "LG"
}
```

---

## ✅ CHECKLIST FINAL

```
☑ ¿Hiciste GET /api/categories para ver categoryIds?
☑ ¿Usas categoryId que existe?
☑ ¿El SKU es único (no repetido)?
☑ ¿Tienes todos los campos requeridos?
☑ ¿El JSON está bien formado?
☑ ¿Usas ID sin corchetes? (/api/products/1 no /api/products/{1})
```

Si marcaste todo: ✅ Debe funcionar
