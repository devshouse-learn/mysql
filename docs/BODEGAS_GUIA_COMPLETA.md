# Guía de Uso - Módulo de Bodegas

Esta guía explica cómo usar el módulo de Bodegas (Warehouses) de la API.

## Características Principales

- ✅ CRUD completo de bodegas
- ✅ Asignar productos a bodegas
- ✅ Remover productos de bodegas
- ✅ **Separación de productos con stock y sin stock**
- ✅ Protección contra eliminación de bodegas con productos
- ✅ Búsqueda por nombre o ubicación
- ✅ Paginación de resultados
- ✅ Soft delete

## Información de Stock en Bodegas

Al consultar bodegas, el sistema proporciona información detallada sobre el inventario:

### En el listado de bodegas (GET /api/warehouses):
- `totalProducts`: Total de productos en la bodega
- `productsWithStock`: Cantidad de productos que tienen stock (quantityInStock > 0)
- `productsWithoutStock`: Cantidad de productos sin stock (quantityInStock = 0)

### Al consultar una bodega específica (GET /api/warehouses/:id):
- `productsWithStock`: Array con productos que tienen stock disponible
- `productsWithoutStock`: Array con productos agotados
- `totalProducts`: Total de productos en la bodega
- `totalWithStock`: Cantidad de productos con stock
- `totalWithoutStock`: Cantidad de productos sin stock

Esta separación permite identificar rápidamente qué productos necesitan reabastecimiento.

## Endpoints Disponibles

### 1. Listar todas las bodegas
```http
GET /api/warehouses
```

**Parámetros de consulta:**
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Resultados por página (default: 10)
- `search` (opcional): Buscar por nombre o ubicación
- `isActive` (opcional): Filtrar por estado (true/false)

**Ejemplo de petición:**
```bash
curl http://localhost:3000/api/warehouses?page=1&limit=10&search=Principal
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Bodega Principal",
      "location": "Zona A, Estante 1-10",
      "description": "Bodega para productos de alta rotación",
      "isActive": true,
      "createdAt": "2026-01-19T19:12:21.000Z",
      "updatedAt": "2026-01-19T19:12:21.000Z",
      "deletedAt": null,
      "_count": {
        "products": 15
      },
      "totalProducts": 15,
      "productsWithStock": 12,
      "productsWithoutStock": 3
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "pages": 1
  }
}
```

---

### 2. Obtener una bodega por ID
```http
GET /api/warehouses/:id
```

**Ejemplo de petición:**
```bash
curl http://localhost:3000/api/warehouses/1
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Bodega Principal",
    "location": "Zona A, Estante 1-10",
    "description": "Bodega para productos de alta rotación",
    "isActive": true,
    "createdAt": "2026-01-19T19:12:21.000Z",
    "updatedAt": "2026-01-19T19:12:21.000Z",
    "deletedAt": null,
    "productsWithStock": [
      {
        "id": 1,
        "name": "Laptop HP",
        "sku": "LAP-HP-001",
        "quantityInStock": 25,
        "price": "599.99",
        "cost": "450.00"
      },
      {
        "id": 3,
        "name": "Teclado Mecánico",
        "sku": "TEC-MEC-001",
        "quantityInStock": 50,
        "price": "89.99",
        "cost": "60.00"
      }
    ],
    "productsWithoutStock": [
      {
        "id": 2,
        "name": "Mouse Inalámbrico",
        "sku": "MOU-INA-001",
        "quantityInStock": 0,
        "price": "29.99",
        "cost": "15.00"
      }
    ],
    "totalProducts": 15,
    "totalWithStock": 12,
    "totalWithoutStock": 3,
    "_count": {
      "products": 15
    }
  }
}
```

**Respuesta de error (404):**
```json
{
  "success": false,
  "error": "Bodega no encontrada"
}
```

---

### 3. Crear una nueva bodega
```http
POST /api/warehouses
```

**Headers requeridos:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Cuerpo de la petición:**
```json
{
  "name": "Bodega Principal",
  "location": "Zona A, Estante 1-10",
  "description": "Bodega para productos de alta rotación",
  "isActive": true
}
```

**Campos:**
- `name` (requerido): Nombre único de la bodega (3-100 caracteres)
- `location` (opcional): Ubicación física de la bodega
- `description` (opcional): Descripción de la bodega
- `isActive` (opcional): Estado activo/inactivo (default: true)

**Ejemplo de petición:**
```bash
curl -X POST http://localhost:3000/api/warehouses \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bodega Secundaria",
    "location": "Zona B",
    "description": "Almacén temporal"
  }'
```

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "message": "Bodega creada exitosamente",
  "data": {
    "id": 2,
    "name": "Bodega Secundaria",
    "location": "Zona B",
    "description": "Almacén temporal",
    "isActive": true,
    "createdAt": "2026-01-19T19:15:00.000Z",
    "updatedAt": "2026-01-19T19:15:00.000Z",
    "deletedAt": null,
    "_count": {
      "products": 0
    }
  }
}
```

**Errores posibles:**
- `400`: Error de validación (nombre muy corto, etc.)
- `409`: Ya existe una bodega con ese nombre

---

### 4. Actualizar una bodega
```http
PUT /api/warehouses/:id
```

**Headers requeridos:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Cuerpo de la petición (todos los campos son opcionales):**
```json
{
  "name": "Bodega Principal Actualizada",
  "location": "Zona A Renovada",
  "description": "Nueva descripción",
  "isActive": false
}
```

**Ejemplo de petición:**
```bash
curl -X PUT http://localhost:3000/api/warehouses/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bodega Central",
    "location": "Zona A-1"
  }'
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Bodega actualizada exitosamente",
  "data": {
    "id": 1,
    "name": "Bodega Central",
    "location": "Zona A-1",
    "description": "Bodega para productos de alta rotación",
    "isActive": true,
    "createdAt": "2026-01-19T19:12:21.000Z",
    "updatedAt": "2026-01-19T19:20:00.000Z",
    "deletedAt": null,
    "_count": {
      "products": 15
    }
  }
}
```

---

### 5. Eliminar una bodega
```http
DELETE /api/warehouses/:id
```

**⚠️ IMPORTANTE:** No se puede eliminar una bodega que tenga productos asignados. Primero debes remover todos los productos de la bodega.

**Headers requeridos:**
```
Authorization: Bearer {token}
```

**Ejemplo de petición:**
```bash
curl -X DELETE http://localhost:3000/api/warehouses/2 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Bodega eliminada exitosamente"
}
```

**Respuesta de error (400) - Bodega con productos:**
```json
{
  "success": false,
  "error": "No se puede eliminar la bodega porque tiene 15 producto(s) asignado(s)"
}
```

**Respuesta de error (404):**
```json
{
  "success": false,
  "error": "Bodega no encontrada"
}
```

---

### 6. Asignar un producto a una bodega
```http
POST /api/warehouses/:id/products
```

**Headers requeridos:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Cuerpo de la petición:**
```json
{
  "productId": 5
}
```

**Ejemplo de petición:**
```bash
curl -X POST http://localhost:3000/api/warehouses/1/products \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": 5
  }'
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Producto asignado a la bodega exitosamente",
  "data": {
    "id": 5,
    "name": "Mouse Logitech",
    "sku": "MOU-LOG-001",
    "warehouseId": 1,
    // ... otros campos del producto
  }
}
```

**Errores posibles:**
- `404`: Bodega o producto no encontrado
- `400`: Error de validación

---

### 7. Quitar un producto de su bodega
```http
DELETE /api/warehouses/products/:productId
```

**Headers requeridos:**
```
Authorization: Bearer {token}
```

**Ejemplo de petición:**
```bash
curl -X DELETE http://localhost:3000/api/warehouses/products/5 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Producto removido de la bodega exitosamente",
  "data": {
    "id": 5,
    "name": "Mouse Logitech",
    "sku": "MOU-LOG-001",
    "warehouseId": null,
    // ... otros campos del producto
  }
}
```

---

## Flujo de Trabajo Típico

### 1. Crear una bodega
```bash
# Primero obtén un token de autenticación
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'

# Crear la bodega
curl -X POST http://localhost:3000/api/warehouses \
  -H "Authorization: Bearer TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bodega Norte",
    "location": "Planta 2, Sección A"
  }'
```

### 2. Asignar productos a la bodega
```bash
# Asignar producto con ID 1
curl -X POST http://localhost:3000/api/warehouses/1/products \
  -H "Authorization: Bearer TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{"productId": 1}'

# Asignar producto con ID 2
curl -X POST http://localhost:3000/api/warehouses/1/products \
  -H "Authorization: Bearer TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{"productId": 2}'
```

### 2.1 Ver resumen de bodegas con información de stock
```bash
curl http://localhost:3000/api/warehouses
```

**Ejemplo de respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Bodega Norte",
      "location": "Planta 2, Sección A",
      "isActive": true,
      "createdAt": "2026-01-19T19:30:00.000Z",
      "updatedAt": "2026-01-19T19:30:00.000Z",
      "deletedAt": null,
      "_count": {
        "products": 5
      },
      "totalProducts": 5,
      "productsWithStock": 4,
      "productsWithoutStock": 1
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "pages": 1
  }
}
```

**Ventajas:** Desde el listado puedes ver rápidamente qué bodegas tienen productos sin stock sin necesidad de consultar cada bodega individualmente.

### 3. Consultar la bodega con sus productos
```bash
curl http://localhost:3000/api/warehouses/1
```

**Ejemplo de respuesta mostrando productos con stock y sin stock:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Bodega Norte",
    "location": "Planta 2, Sección A",
    "description": null,
    "isActive": true,
    "createdAt": "2026-01-19T19:30:00.000Z",
    "updatedAt": "2026-01-19T19:30:00.000Z",
    "deletedAt": null,
    "_count": {
      "products": 3
    },
    "productsWithStock": [
      {
        "id": 1,
        "name": "Laptop HP",
        "sku": "LAP-001",
        "quantityInStock": 25,
        "price": "599.99",
        "cost": "450.00"
      },
      {
        "id": 3,
        "name": "Mouse Logitech",
        "sku": "MOU-001",
        "quantityInStock": 100,
        "price": "19.99",
        "cost": "10.00"
      }
    ],
    "productsWithoutStock": [
      {
        "id": 2,
        "name": "Monitor Dell",
        "sku": "MON-001",
        "quantityInStock": 0,
        "price": "299.99",
        "cost": "200.00"
      }
    ],
    "totalProducts": 3,
    "totalWithStock": 2,
    "totalWithoutStock": 1
  }
}
```

**Nota:** Puedes ver claramente que hay 2 productos con stock disponible y 1 producto agotado que necesita reabastecimiento.

### 4. Remover productos antes de eliminar la bodega
```bash
# Remover producto 1
curl -X DELETE http://localhost:3000/api/warehouses/products/1 \
  -H "Authorization: Bearer TOKEN_AQUI"

# Remover producto 2
curl -X DELETE http://localhost:3000/api/warehouses/products/2 \
  -H "Authorization: Bearer TOKEN_AQUI"
```

### 5. Eliminar la bodega
```bash
curl -X DELETE http://localhost:3000/api/warehouses/1 \
  -H "Authorization: Bearer TOKEN_AQUI"
```

---

## Usando Postman

1. **Importar la colección**: La documentación Swagger está disponible en `http://localhost:3000/api-docs`

2. **Configurar autenticación**:
   - Crear una variable de entorno `token` en Postman
   - Hacer login y guardar el token
   - Usar `{{token}}` en el header Authorization

3. **Ejemplos de prueba**:
   - Crear 2-3 bodegas
   - Asignar productos a diferentes bodegas
   - Intentar eliminar una bodega con productos (debe fallar)
   - Remover productos y luego eliminar la bodega (debe funcionar)

---

## Modelo de Datos

```javascript
Warehouse {
  id: Integer (autoincrement)
  name: String (unique, required)
  location: String (opcional)
  description: String (opcional)
  isActive: Boolean (default: true)
  createdAt: DateTime
  updatedAt: DateTime
  deletedAt: DateTime (nullable)
  
  // Relaciones
  products: Product[] (relación uno a muchos)
}
```

---

## Validaciones Implementadas

### Al crear/actualizar:
- ✅ Nombre requerido (3-100 caracteres)
- ✅ Nombre debe ser único
- ✅ Location, description y isActive son opcionales

### Al eliminar:
- ✅ Verifica que la bodega no tenga productos asignados
- ✅ Usa soft delete (deletedAt)

### Al asignar productos:
- ✅ Verifica que la bodega existe
- ✅ Verifica que el producto existe
- ✅ Actualiza la relación warehouse_id en el producto

---

## Códigos de Estado HTTP

- `200`: Operación exitosa
- `201`: Recurso creado exitosamente
- `400`: Error de validación o lógica de negocio
- `404`: Recurso no encontrado
- `409`: Conflicto (nombre duplicado)
- `500`: Error interno del servidor

---

## Notas Importantes

1. **Soft Delete**: Las bodegas eliminadas no se borran físicamente, se marca `deletedAt`
2. **Protección de datos**: No se puede eliminar una bodega con productos
3. **Unicidad**: El nombre de la bodega debe ser único
4. **Autenticación**: Los endpoints de escritura requieren token JWT
5. **Búsqueda**: Busca tanto en nombre como en ubicación (case-insensitive)

---

## Integración con Productos

La relación entre productos y bodegas es opcional:
- Un producto puede no tener bodega asignada (`warehouseId: null`)
- Un producto puede tener una bodega asignada (`warehouseId: 1`)
- Una bodega puede tener muchos productos
- Si se elimina la bodega, los productos quedan sin bodega (`onDelete: SetNull`)

Para ver la bodega de un producto, consulta el endpoint de productos:
```bash
curl http://localhost:3000/api/products/1
```

La respuesta incluirá el campo `warehouse` si el producto está asignado a una bodega.
