# Guía de Autenticación en Postman

## ✅ Cambios Realizados

Se ha agregado el middleware de autenticación a las siguientes rutas:

### Categorías
- ✅ `GET /api/categories` - No requiere autenticación
- ✅ `GET /api/categories/:id` - No requiere autenticación
- 🔒 `POST /api/categories` - **REQUIERE AUTENTICACIÓN**
- 🔒 `PUT /api/categories/:id` - **REQUIERE AUTENTICACIÓN**
- 🔒 `DELETE /api/categories/:id` - **REQUIERE AUTENTICACIÓN**

### Productos
- ✅ `GET /api/products` - No requiere autenticación
- ✅ `GET /api/products/:id` - No requiere autenticación
- 🔒 `POST /api/products` - **REQUIERE AUTENTICACIÓN**
- 🔒 `PUT /api/products/:id` - **REQUIERE AUTENTICACIÓN**
- 🔒 `DELETE /api/products/:id` - **REQUIERE AUTENTICACIÓN**

### Movimientos de Inventario
- ✅ `GET /api/inventory-movements` - No requiere autenticación
- ✅ `GET /api/inventory-movements/:id` - No requiere autenticación
- 🔒 `POST /api/inventory-movements` - **REQUIERE AUTENTICACIÓN**
- 🔒 `PUT /api/inventory-movements/:id` - **REQUIERE AUTENTICACIÓN**
- 🔒 `DELETE /api/inventory-movements/:id` - **REQUIERE AUTENTICACIÓN**

### Reportes
- 🔒 Todas las rutas de reportes **REQUIEREN AUTENTICACIÓN**

---

## 🔐 Cómo usar la autenticación en Postman

### Paso 1: Registrar un usuario (solo primera vez)

**Endpoint:** `POST http://localhost:3000/api/auth/register`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "username": "admin",
  "email": "admin@example.com",
  "password": "admin123",
  "fullName": "Administrador"
}
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com"
  }
}
```

---

### Paso 2: Iniciar sesión para obtener el token

**Endpoint:** `POST http://localhost:3000/api/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Inicio de sesión exitoso",
  "data": {
    "user": {
      "id": 1,
      "username": "admin",
      "email": "admin@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**⚠️ IMPORTANTE:** Copia el valor del campo `token` (todo el texto largo).

---

### Paso 3: Usar el token en las peticiones protegidas

Hay **dos formas** de usar el token en Postman:

#### Opción A: Configuración automática (RECOMENDADO)

1. En Postman, selecciona la pestaña **"Authorization"** de tu petición
2. En el menú desplegable "Type", selecciona **"Bearer Token"**
3. Pega el token en el campo **"Token"**
4. Haz la petición normalmente

#### Opción B: Configuración manual

1. Ve a la pestaña **"Headers"** de tu petición
2. Agrega un nuevo header:
   - **Key:** `Authorization`
   - **Value:** `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   
   (Nota: Debe empezar con la palabra `Bearer` seguida de un espacio y luego el token)

---

## 📋 Ejemplos de Peticiones

### ✅ GET sin autenticación (funciona sin token)
```
GET http://localhost:3000/api/categories
```
No requiere headers de autorización.

---

### 🔒 POST con autenticación (requiere token)

**Endpoint:** `POST http://localhost:3000/api/categories`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Body (JSON):**
```json
{
  "name": "Electrónica",
  "description": "Productos electrónicos"
}
```

---

### 🔒 PUT con autenticación (requiere token)

**Endpoint:** `PUT http://localhost:3000/api/categories/1`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Body (JSON):**
```json
{
  "name": "Electrónica Actualizada",
  "description": "Descripción actualizada"
}
```

---

## ❌ Errores Comunes

### Error 401: Token no proporcionado
```json
{
  "error": "Token no proporcionado",
  "code": "TOKEN_MISSING"
}
```
**Solución:** Asegúrate de incluir el header `Authorization` con el formato correcto.

---

### Error 403: Token inválido o expirado
```json
{
  "error": "Token inválido o expirado",
  "code": "TOKEN_INVALID"
}
```
**Solución:** 
- Vuelve a hacer login para obtener un nuevo token
- Verifica que copiaste el token completo
- Asegúrate de que hay un espacio entre "Bearer" y el token

---

### Error 404: Ruta no encontrada
```json
{
  "success": false,
  "error": "Ruta no encontrada"
}
```
**Solución:** 
- Verifica que la URL esté correcta
- Asegúrate de que el servidor esté ejecutándose
- Revisa que estés usando el método HTTP correcto (GET, POST, PUT, DELETE)

---

## 🚀 Configuración de Colección en Postman (OPCIONAL)

Para no tener que copiar el token en cada petición:

1. Crea una **Collection** en Postman
2. Haz clic derecho en la colección → **"Edit"**
3. Ve a la pestaña **"Authorization"**
4. Selecciona **"Bearer Token"**
5. Pega tu token en el campo **"Token"**
6. Haz clic en **"Save"**

Ahora todas las peticiones dentro de esta colección heredarán automáticamente el token.

---

## 🔄 Variables de Entorno en Postman (AVANZADO)

1. Crea un nuevo **Environment** en Postman
2. Agrega una variable:
   - **Variable:** `auth_token`
   - **Initial Value:** (vacío)
   - **Current Value:** (vacío)

3. En la petición de LOGIN, ve a la pestaña **"Tests"** y agrega:
```javascript
var jsonData = pm.response.json();
pm.environment.set("auth_token", jsonData.data.token);
```

4. En las peticiones protegidas, usa:
   - **Type:** Bearer Token
   - **Token:** `{{auth_token}}`

Así el token se actualizará automáticamente cada vez que hagas login.

---

## 📞 Verificación del Sistema

Para verificar que todo funciona:

1. **Sin token:** `GET http://localhost:3000/api/categories` → ✅ Debe funcionar
2. **Con token:** `POST http://localhost:3000/api/categories` → 🔒 Requiere token
3. **Token inválido:** Usa un token incorrecto → ❌ Error 403
4. **Sin token en ruta protegida:** → ❌ Error 401
