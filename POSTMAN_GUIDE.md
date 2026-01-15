# 📘 Guía de Sintaxis JSON para POST Requests

## ⚠️ Errores Comunes de Sintaxis JSON

### ❌ INCORRECTO
```json
{name: "Test"}                          // Falta comillas en las claves
{name: 'Test'}                          // Comillas simples no son válidas en JSON
{"name": "Test",}                       // Coma al final
{"name": "Test" "category": "A"}        // Falta coma entre propiedades
{"name": Test}                          // Falta comillas en el valor string
```

### ✅ CORRECTO
```json
{"name": "Test"}
{"name": "Test", "description": "Desc"}
{"product_id": 1, "quantity": 5}
```

---

## 📝 Ejemplos de Cada Endpoint

### 1. POST /api/auth/register
**Estructura JSON válida:**
```json
{
  "username": "newuser",
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe"
}
```

**Con curl:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"newuser","email":"user@example.com","password":"password123"}'
```

---

### 2. POST /api/products
**Estructura JSON válida:**
```json
{
  "name": "Product Name",
  "sku": "SKU-12345",
  "price": 99.99,
  "category_id": 1,
  "description": "Optional description",
  "quantity": 10
}
```

**Con curl:**
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Product Name","sku":"SKU-12345","price":99.99,"category_id":1}'
```

---

### 3. POST /api/categories
**Estructura JSON válida:**
```json
{
  "name": "Category Name",
  "description": "Optional description"
}
```

**Con curl:**
```bash
curl -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -d '{"name":"Category Name"}'
```

---

### 4. POST /api/inventory-movements
**Estructura JSON válida:**
```json
{
  "product_id": 1,
  "movement_type": "entrada",
  "quantity": 10,
  "notes": "Optional notes"
}
```

**Con curl:**
```bash
curl -X POST http://localhost:3000/api/inventory-movements \
  -H "Content-Type: application/json" \
  -d '{"product_id":1,"movement_type":"entrada","quantity":10}'
```

---

## 🔧 Tips para Evitar Errores de Sintaxis

### En Postman:
1. **Selecciona Body → raw → JSON**
2. **Usa comillas dobles** para todas las claves y strings
3. **Asegúrate de no dejar comas al final**
4. **Usa números sin comillas** para valores numéricos

### En curl desde terminal:
1. **Usa comillas simples** para envolver el JSON: `-d '{"key":"value"}'`
2. **Escapa las comillas internas** si es necesario
3. **No uses espacios innecesarios** dentro del JSON

### Validar JSON:
Copia tu JSON en https://jsonlint.com para verificar que es válido.

---

## 🧪 Test Rápido

Ejecuta esto en terminal para verificar que funciona:

```bash
# Test 1: Categories
curl -s -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -d '{"name":"TestCategory"}' | grep success

# Test 2: Products  
curl -s -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"TestProduct","sku":"TEST123","price":50,"category_id":1}' | grep success

# Test 3: Inventory Movements
curl -s -X POST http://localhost:3000/api/inventory-movements \
  -H "Content-Type: application/json" \
  -d '{"product_id":1,"movement_type":"entrada","quantity":5}' | grep success
```

Si todos devuelven `"success":true`, ¡todo está funcionando correctamente!
