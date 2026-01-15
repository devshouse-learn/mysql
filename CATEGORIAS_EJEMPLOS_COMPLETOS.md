# 📋 CATEGORÍAS - EJEMPLOS LISTOS (Copiar y Pegar)

## 1️⃣ GET - Ver Todas las Categorías

**URL:**
```
http://localhost:3000/api/categories
```

**Método:** GET

**Headers:**
```
Content-Type: application/json
```

**Body:** Vacío (no enviar nada)

**Resultado esperado:** 200 ✅ (lista de categorías)

---

## 2️⃣ GET - Ver Categoría por ID

**URL:**
```
http://localhost:3000/api/categories/2
```

**Método:** GET

**Headers:**
```
Content-Type: application/json
```

**Body:** Vacío (no enviar nada)

**Resultado esperado:** 200 ✅

---

## 3️⃣ POST - Crear Nueva Categoría

**URL:**
```
http://localhost:3000/api/categories
```

**Método:** POST

**Headers:**
```
Content-Type: application/json
```

**Body (Copiar exacto):**
```json
{
  "name": "Jardín",
  "description": "Productos para el jardín"
}
```

**Resultado esperado:** 201 ✅ (creado)

---

## 4️⃣ PUT - Actualizar Categoría

**URL:**
```
http://localhost:3000/api/categories/2
```

**Método:** PUT

**Headers:**
```
Content-Type: application/json
```

**Body (Copiar exacto):**
```json
{
  "name": "Accesorios Premium",
  "description": "Accesorios de calidad superior"
}
```

**Resultado esperado:** 200 ✅

---

## 5️⃣ DELETE - Eliminar Categoría

**URL:**
```
http://localhost:3000/api/categories/2
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
1. GET http://localhost:3000/api/categories
   Resultado: 200 ✅

2. GET http://localhost:3000/api/categories/1
   Resultado: 200 ✅

3. POST http://localhost:3000/api/categories
   Body: {"name": "Jardín", "description": "..."}
   Resultado: 201 ✅

4. PUT http://localhost:3000/api/categories/2
   Body: {"name": "Accesorios Premium", "description": "..."}
   Resultado: 200 ✅

5. DELETE http://localhost:3000/api/categories/12
   Resultado: 200 ✅
```

**Si todos son ✅ = TODO FUNCIONA CORRECTAMENTE**
