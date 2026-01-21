# 🎨 Frontend - Sistema de Gestión de Inventario

Aplicación web moderna construida con React + Vite para la gestión completa de inventario.

## ✨ Características

- 🔐 **Autenticación**: Login y registro con JWT
- 📊 **Dashboard**: Estadísticas en tiempo real
- 📂 **Categorías**: CRUD completo
- 📦 **Productos**: Gestión con categorías y stock
- 🏪 **Bodegas**: Sistema de almacenes múltiples
- 📊 **Movimientos**: Control de entradas/salidas por bodega
- 📈 **Reportes**: Análisis y gráficos de inventario
- 🎨 **Diseño Moderno**: UI/UX responsiva

## 🚀 Inicio Rápido

### 1. Instalar Dependencias

```bash
cd FRONTEND
npm install
```

### 2. Iniciar en Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en: **http://localhost:5173**

### 3. Credenciales por Defecto

```
Usuario: admin
Contraseña: admin123
```

## 📁 Estructura del Proyecto

```
FRONTEND/
├── src/
│   ├── components/
│   │   ├── Layout.jsx          # Layout principal con sidebar
│   │   └── PrivateRoute.jsx    # Protección de rutas
│   ├── context/
│   │   └── AuthContext.jsx     # Contexto de autenticación
│   ├── pages/
│   │   ├── Login.jsx           # Página de login
│   │   ├── Register.jsx        # Página de registro
│   │   ├── Dashboard.jsx       # Dashboard con reportes
│   │   ├── Categories.jsx      # CRUD de categorías
│   │   ├── Products.jsx        # CRUD de productos
│   │   ├── Warehouses.jsx      # CRUD de bodegas
│   │   └── Movements.jsx       # Gestión de movimientos
│   ├── services/
│   │   ├── api.js              # Configuración de Axios
│   │   └── index.js            # Servicios de API
│   ├── App.jsx                 # Componente principal
│   ├── App.css                 # Estilos globales
│   └── main.jsx                # Punto de entrada
├── package.json
├── vite.config.js
└── index.html
```

## 🛠️ Tecnologías

- **React 18** - Framework UI
- **React Router v6** - Enrutamiento
- **Axios** - Cliente HTTP
- **Vite** - Build tool ultrarrápido
- **CSS Modules** - Estilos modernos

## 📋 Funcionalidades por Módulo

### 🔐 Autenticación
- Login con usuario/contraseña
- Registro de nuevos usuarios
- Almacenamiento de token JWT
- Redirección automática

### 📊 Dashboard
- Total de productos, categorías y bodegas
- Valor total del inventario
- Productos con stock bajo
- Distribución por categoría

### 📂 Categorías
- ✅ Listar todas las categorías
- ✅ Crear nueva categoría
- ✅ Editar categoría existente
- ✅ Eliminar categoría (soft delete)
- ✅ Ver cantidad de productos por categoría

### 📦 Productos
- ✅ Listar todos los productos
- ✅ Crear producto con categoría
- ✅ Editar información del producto
- ✅ Eliminar producto
- ✅ Ver stock y nivel de reorden
- ✅ Gestión de precios y costos

### 🏪 Bodegas
- ✅ Listar todas las bodegas
- ✅ Crear nueva bodega
- ✅ Editar información de bodega
- ✅ Eliminar bodega
- ✅ Configurar ubicación y capacidad

### 📊 Movimientos de Inventario
- ✅ Registrar entradas de inventario
- ✅ Registrar salidas de inventario
- ✅ Seleccionar bodega destino
- ✅ Agregar referencias y notas
- ✅ Historial completo de movimientos

## 🎨 Características de UI/UX

- ✨ Diseño moderno y limpio
- 📱 Totalmente responsivo
- 🌙 Sidebar con navegación clara
- 🎯 Modales para crear/editar
- 🎨 Badges de estado coloridos
- ⚡ Carga rápida con Vite
- 🔔 Mensajes de error/éxito
- 🎭 Animaciones suaves

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

## 🔗 Integración con Backend

El frontend se comunica con el backend en:
- **Base URL**: `http://localhost:3000/api`
- **Proxy**: Configurado en `vite.config.js`

### Endpoints Utilizados

```javascript
// Autenticación
POST /api/auth/login
POST /api/auth/register

// Categorías
GET    /api/categories
POST   /api/categories
PUT    /api/categories/:id
DELETE /api/categories/:id

// Productos
GET    /api/products
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id

// Bodegas
GET    /api/warehouses
POST   /api/warehouses
PUT    /api/warehouses/:id
DELETE /api/warehouses/:id

// Movimientos
GET    /api/inventory-movements
POST   /api/inventory-movements
DELETE /api/inventory-movements/:id

// Reportes
GET /api/reports/inventory-summary
GET /api/reports/low-stock
GET /api/reports/category-distribution
```

## 🎯 Flujo de Trabajo

1. **Login**: Accede con tus credenciales
2. **Dashboard**: Ve estadísticas generales
3. **Crear Categorías**: Define tus categorías de productos
4. **Crear Bodegas**: Configura tus almacenes
5. **Agregar Productos**: Registra productos con categoría
6. **Movimientos**: Registra entradas/salidas de inventario
7. **Reportes**: Analiza el estado del inventario

## 🐛 Solución de Problemas

### El frontend no se conecta al backend
```bash
# Verifica que el backend esté corriendo en puerto 3000
cd .. && npm run dev
```

### Error de CORS
El backend ya incluye configuración CORS. Si hay problemas:
- Verifica que el backend esté en `http://localhost:3000`
- Revisa la configuración del proxy en `vite.config.js`

### Dependencias faltantes
```bash
npm install
```

## 📝 Notas

- El token JWT se almacena en `localStorage`
- Las rutas están protegidas con `PrivateRoute`
- El logout limpia el token automáticamente
- Todas las peticiones incluyen el token en headers

## 🎉 ¡Listo!

Tu aplicación frontend está lista para gestionar todo el inventario de manera visual e intuitiva.

**URL**: http://localhost:5173
**Backend**: http://localhost:3000
**Swagger**: http://localhost:3000/api-docs
