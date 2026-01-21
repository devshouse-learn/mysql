# 🚀 Inicio Rápido del Sistema

## ✅ Solución al Error de Carga de Datos

El problema estaba en que **ambos servidores deben estar corriendo** para que la aplicación funcione correctamente.

---

## 📦 Servidores Necesarios

### 1. Backend (Puerto 3000)
- **Función**: API REST con base de datos
- **Puerto**: 3000
- **URL**: http://localhost:3000

### 2. Frontend (Puerto 5173)  
- **Función**: Interfaz React
- **Puerto**: 5173
- **URL**: http://localhost:5173

---

## 🎯 Inicio Automático

### Opción 1: Script automático (Recomendado)
```bash
cd "/Users/ibacrea/mysql keli /BACKEND."
./start-servers.sh
```

### Opción 2: Manual (2 terminales)

**Terminal 1 - Backend:**
```bash
cd "/Users/ibacrea/mysql keli /BACKEND."
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd "/Users/ibacrea/mysql keli /BACKEND./FRONTEND"
npm run dev
```

---

## 🛑 Detener Servidores

```bash
cd "/Users/ibacrea/mysql keli /BACKEND."
./stop-servers.sh
```

O presiona `Ctrl+C` en cada terminal

---

## ✅ Verificar que Todo Funciona

### 1. Verifica que los puertos estén abiertos:
```bash
lsof -i :3000  # Backend debe aparecer
lsof -i :5173  # Frontend debe aparecer
```

### 2. Prueba el backend:
```bash
curl http://localhost:3000/api/categories
```

### 3. Abre el navegador:
```
http://localhost:5173
```

---

## 📊 Datos Disponibles

Ya tienes cargados en la base de datos:

- ✅ **8 usuarios** (admin, keli, y más)
- ✅ **15 categorías** 
- ✅ **14 productos** con stock
- ✅ **3 bodegas**
- ✅ **21 movimientos** de inventario

---

## 🔐 Credenciales

```
Usuario: admin
Contraseña: admin123
```

```
Usuario: keli  
Contraseña: 03v5h0u53
```

---

## 🎨 Funcionalidades Disponibles

Una vez que inicies sesión, podrás:

1. **📊 Dashboard** - Ver estadísticas en tiempo real
2. **📂 Categorías** - CRUD completo
3. **📦 Productos** - Gestión completa con stock
4. **🏪 Bodegas** - Administración de almacenes
5. **📊 Movimientos** - Registrar entradas/salidas
6. **📈 Reportes** - Análisis y gráficos

---

## 🔧 Solución de Problemas

### ❌ "Error al cargar reportes" o "Error al cargar estadísticas"

**Causa**: El backend no está corriendo

**Solución**:
```bash
# Verifica si está corriendo
lsof -i :3000

# Si no aparece nada, inicia el backend
cd "/Users/ibacrea/mysql keli /BACKEND."
npm run dev
```

### ❌ Página en blanco o no carga

**Causa**: El frontend no está corriendo

**Solución**:
```bash
# Verifica si está corriendo
lsof -i :5173

# Si no aparece nada, inicia el frontend
cd "/Users/ibacrea/mysql keli /BACKEND./FRONTEND"
npm run dev
```

### ❌ No se conecta al backend

**Causa**: CORS o puerto incorrecto

**Solución**:
1. Verifica que el backend esté en puerto 3000
2. Limpia el caché del navegador
3. Recarga la página (Cmd+Shift+R)

---

## 📝 Logs

Ver logs en tiempo real:

```bash
# Backend
tail -f backend.log

# Frontend  
tail -f frontend.log
```

---

## 🎉 ¡Listo!

Ahora tu sistema de gestión de inventario está completamente funcional con:
- ✅ Backend corriendo
- ✅ Frontend corriendo
- ✅ Base de datos con datos de ejemplo
- ✅ Todas las funcionalidades operativas

**Accede a**: http://localhost:5173
