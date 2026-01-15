# 🧪 Ejemplos Completos para Pruebas en Postman

## ✅ CATEGORÍAS - Ejemplos Listos para Copiar

### 1️⃣ POST - Crear Nueva Categoría (FUNCIONA)
```
Método: POST
URL: http://localhost:3000/api/categories

Headers:
Content-Type: application/json

Body (raw - JSON):
{
  "name": "Oficina",
  "description": "Productos para oficina"
}
```

**Respuesta esperada (201):**
```json
{
  "success": true,
  "data": {
    "id": 13,
    "name": "Oficina",
    "description": "Productos para oficina",
    "isActive": true,
    "createdAt": "2026-01-15T...",
    "updatedAt": "2026-01-15T...",
    "deletedAt": null
  },
  "message": "Categoría creada exitosamente"
}
```

---

### 2️⃣ GET - Obtener Todas las Categorías
```
Método: GET
URL: http://localhost:3000/api/categories

Headers:
Content-Type: application/json
```

**Respuesta esperada (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Electrónica",
      "description": "Productos electrónicos varios",
      "isActive": true,
      "createdAt": "2026-01-14T17:37:49.910Z",
      "updatedAt": "2026-01-14T17:37:49.910Z",
      "deletedAt": null
    },
    // ... más categorías
  ],
  "total": 10
}
```

---

### 3️⃣ GET - Obtener Categoría por ID (ID=1)
```
Método: GET
URL: http://localhost:3000/api/categories/1

Headers:
Content-Type: application/json
```

**Respuesta esperada (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Electrónica",
    "description": "Productos electrónicos varios",
    "isActive": true,
    "createdAt": "2026-01-14T17:37:49.910Z",
    "updatedAt": "2026-01-14T17:37:49.910Z",
    "deletedAt": null
  }
}
```

---

### 4️⃣ PUT - Actualizar Categoría (ID=1)
```
Método: PUT
URL: http://localhost:3000/api/categories/1

Headers:
Content-Type: application/json

Body (raw - JSON):
{
  "name": "Electrónica Premium",
  "description": "Productos electrónicos de alta gama"
}
```

**Respuesta esperada (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Electrónica Premium",
    "description": "Productos electrónicos de alta gama",
    "isActive": true,
    "createdAt": "2026-01-14T17:37:49.910Z",
    "updatedAt": "2026-01-15T12:00:00.000Z",
    "deletedAt": null
  },
  "message": "Categoría actualizada exitosamente"
}
```

---

### 5️⃣ DELETE - Eliminar Categoría (ID=1)
```
Método: DELETE
URL: http://localhost:3000/api/categories/1

Headers:
Content-Type: application/json
```

**Respuesta esperada (200):**
```json
{
  "success": true,
  "message": "Categoría eliminada exitosamente"
}
```

---

## 🛠️ SOLUCIÓN DE ERRORES COMUNES

### ❌ Error 400 - "name is required"
**Problema:** Falta el campo `name` en el JSON

**Solución:**
```json
✅ CORRECTO:
{
  "name": "Mi Categoría",
  "description": "Descripción"
}

❌ INCORRECTO:
{
  "descripción": "Sin nombre"
}
```

---

### ❌ Error 400 - "name length must be at least 3 characters"
**Problema:** El nombre tiene menos de 3 caracteres

**Solución:**
```json
❌ INCORRECTO - Solo 2 caracteres:
{
  "name": "AB"
}

✅ CORRECTO - 3 o más caracteres:
{
  "name": "ABC",
  "description": "Descripción"
}
```

---

### ❌ Error 400 - "La categoría ya existe"
**Problema:** Ya existe una categoría con ese nombre

**Soluciones:**
```json
❌ INCORRECTO - Ya existe "Electrónica":
{
  "name": "Electrónica"
}

✅ CORRECTO - Nombre único:
{
  "name": "Electrónica 2",
  "description": "Otra categoría"
}

O usa un timestamp:
{
  "name": "Categoría Test " + new Date().getTime(),
  "description": "Prueba"
}

O números aleatorios:
{
  "name": "Categoría " + Math.random(),
  "description": "Prueba"
}
```

---

### ❌ Error 404 - "Categoría no encontrada"
**Problema:** Estás usando un ID que no existe

**Solución:**
1. Primero haz un GET a `/api/categories` para ver los IDs disponibles
2. Luego usa un ID que exista

```
Ejemplo:
GET /api/categories → te muestra todos con sus IDs
Luego usa uno de esos IDs:
GET /api/categories/1
GET /api/categories/2
GET /api/categories/3
etc.
```

---

## 📋 PLAN DE PRUEBA COMPLETO

Sigue este orden para verificar que todo funciona:

1. ✅ **GET /api/categories** → Ver todas las categorías existentes
2. ✅ **GET /api/categories/1** → Ver detalles de una categoría específica
3. ✅ **POST /api/categories** → Crear una nueva con nombre único
4. ✅ **PUT /api/categories/{id}** → Actualizar la que creaste
5. ✅ **DELETE /api/categories/{id}** → Eliminar la que creaste

---

## 🆘 Si Todavía Tienes Errores

Comparte:
1. La URL exacta que estás usando
2. El método (GET, POST, PUT, DELETE)
3. El Body JSON que envías (si aplica)
4. El error exacto que recibes
5. El código HTTP (200, 400, 404, 500, etc.)

Así puedo ayudarte mejor.
