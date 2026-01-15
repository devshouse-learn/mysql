# 📚 GUÍA COMPLETA DE PRUEBAS EN POSTMAN

## 🚀 INICIO RÁPIDO

El servidor está corriendo en: **http://localhost:3000**

Documentación Swagger: **http://localhost:3000/api-docs**

---

## 📁 ARCHIVOS DE REFERENCIA

- [CATEGORÍAS - Ejemplos completos](POSTMAN_TEST_EXAMPLES.md)
- [PRODUCTOS - Ejemplos completos](POSTMAN_PRODUCTS_EXAMPLES.md)
- [MOVIMIENTOS - Ejemplos completos](POSTMAN_INVENTORY_EXAMPLES.md)

---

## ✅ RESUMEN DE ENDPOINTS

### 📂 CATEGORÍAS
| Método | Endpoint | Estado |
|--------|----------|--------|
| GET | `/api/categories` | ✅ Funciona |
| POST | `/api/categories` | ✅ Funciona |
| GET | `/api/categories/{id}` | ✅ Funciona |
| PUT | `/api/categories/{id}` | ✅ Funciona |
| DELETE | `/api/categories/{id}` | ✅ Funciona |

### 📦 PRODUCTOS
| Método | Endpoint | Estado |
|--------|----------|--------|
| GET | `/api/products` | ✅ Funciona |
| POST | `/api/products` | ✅ Funciona |
| GET | `/api/products/{id}` | ✅ Funciona |
| PUT | `/api/products/{id}` | ✅ Funciona |
| DELETE | `/api/products/{id}` | ✅ Funciona |

### 📊 MOVIMIENTOS DE INVENTARIO
| Método | Endpoint | Estado |
|--------|----------|--------|
| GET | `/api/inventory-movements` | ✅ Funciona |
| POST | `/api/inventory-movements` | ✅ Funciona |
| GET | `/api/inventory-movements/{id}` | ✅ Funciona |
| PUT | `/api/inventory-movements/{id}` | ✅ **NUEVO** |
| DELETE | `/api/inventory-movements/{id}` | ✅ Funciona |

### 📈 REPORTES
| Método | Endpoint | Estado |
|--------|----------|--------|
| GET | `/api/reports` | ✅ Funciona |
| GET | `/api/reports/inventory-summary` | ✅ Funciona |
| GET | `/api/reports/movements-by-period` | ✅ Funciona |
| GET | `/api/reports/top-products` | ✅ Funciona |
| GET | `/api/reports/low-stock` | ✅ Funciona |
| GET | `/api/reports/category-distribution` | ✅ Funciona |

---

## 🎯 ORDEN DE PRUEBAS RECOMENDADO

### 1️⃣ CATEGORÍAS (5 pruebas)
```
1. GET /api/categories → Ver todas
2. GET /api/categories/1 → Ver una específica
3. POST /api/categories → Crear nueva (nombre único)
4. PUT /api/categories/{id} → Actualizar
5. DELETE /api/categories/{id} → Eliminar
```

### 2️⃣ PRODUCTOS (5 pruebas)
```
1. GET /api/products → Ver todas
2. POST /api/products → Crear (requiere categoryId válido)
3. GET /api/products/{id} → Ver una específica
4. PUT /api/products/{id} → Actualizar
5. DELETE /api/products/{id} → Eliminar
```

### 3️⃣ MOVIMIENTOS DE INVENTARIO (5 pruebas)
```
1. GET /api/inventory-movements → Ver todos
2. POST /api/inventory-movements → Crear entrada
3. GET /api/inventory-movements/{id} → Ver uno
4. PUT /api/inventory-movements/{id} → Actualizar (NUEVO)
5. DELETE /api/inventory-movements/{id} → Eliminar
```

### 4️⃣ REPORTES (1 prueba)
```
1. GET /api/reports → Ver endpoints disponibles
```

---

## 🛠️ PASOS PARA PROBAR

### En Postman:

1. **Abre Postman**
2. **New Request**
3. **Selecciona el método** (GET, POST, PUT, DELETE)
4. **Pega la URL** exacta
5. **En Headers, agrega:**
   ```
   Content-Type: application/json
   ```
6. **Si es POST/PUT, en Body (raw, JSON):**
   - Copia los ejemplos de los archivos
   - Asegúrate de que sea JSON válido
   - Reemplaza valores con datos únicos
7. **Click en Send**
8. **Verifica el Status Code:**
   - ✅ 200 = OK (GET, PUT, DELETE)
   - ✅ 201 = Creado (POST)
   - ❌ 400 = Error en datos
   - ❌ 404 = No encontrado
   - ❌ 500 = Error del servidor

---

## 🔍 VERIFICAR QUE TODO FUNCIONA

```
1. GET /api/categories/1 → Status 200 ✅
2. POST /api/categories con nombre único → Status 201 ✅
3. GET /api/products/1 → Status 200 ✅
4. POST /api/products con datos válidos → Status 201 ✅
5. GET /api/inventory-movements/1 → Status 200 ✅
6. POST /api/inventory-movements → Status 201 ✅
7. PUT /api/inventory-movements/1 → Status 200 ✅
```

Si todos son ✅, **todo está funcionando correctamente**.

---

## 🆘 SOLUCIÓN DE PROBLEMAS

### Problema: Status 400
**Causas posibles:**
- Falta un campo requerido
- Valor inválido (ejemplo: nombre < 3 caracteres)
- JSON mal formado
- Campo duplicado (ejemplo: categoryId que no existe)

**Solución:**
- Verifica el Body JSON
- Revisa que sea sintaxis válida (sin comas extras)
- Asegúrate de tener todos los campos requeridos

---

### Problema: Status 404
**Causas posibles:**
- ID que no existe
- Ruta mal escrita

**Solución:**
- Haz primero un GET para obtener IDs válidos
- Verifica la URL exacta

---

### Problema: Status 500
**Causas posibles:**
- Error del servidor
- Error en la BD
- Campo inválido

**Solución:**
- Revisa los logs del servidor
- Verifica que los datos sean válidos

---

## 📝 NOTAS IMPORTANTES

- **Siempre** agrega `Content-Type: application/json` en Headers
- **Nombres/SKU** deben ser únicos
- **CategoryId** debe existir antes de crear productos
- **ProductId** debe existir antes de crear movimientos
- Los campos opcionales pueden omitirse
- Las operaciones DELETE hacen **soft delete** (se guardan con fecha)

---

## ✨ Estado Actual

✅ **Backend corriendo en http://localhost:3000**
✅ **Swagger disponible en http://localhost:3000/api-docs**
✅ **Todos los endpoints funcionan**
✅ **10 categorías en BD para pruebas**
✅ **Documentación completa lista**

**¡Listo para empezar las pruebas en Postman!**
