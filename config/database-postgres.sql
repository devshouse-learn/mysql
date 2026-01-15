-- PostgreSQL Schema para Inventory Management System
-- Script de inicialización completo

-- Habilitar extensiones requeridas
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de Usuarios
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

-- Tabla de Categorías
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

-- Tabla de Productos
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    cost DECIMAL(10, 2),
    category_id INTEGER NOT NULL,
    quantity_in_stock INTEGER DEFAULT 0,
    reorder_level INTEGER DEFAULT 10,
    status VARCHAR(50) DEFAULT 'active',
    supplier VARCHAR(255),
    barcode VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Tabla de Movimientos de Inventario
CREATE TABLE IF NOT EXISTS inventory_movements (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL,
    movement_type VARCHAR(50) NOT NULL,
    quantity INTEGER NOT NULL,
    reference_type VARCHAR(50),
    reference_id VARCHAR(100),
    notes TEXT,
    created_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Tabla de Órdenes de Compra
CREATE TABLE IF NOT EXISTS purchase_orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(100) UNIQUE NOT NULL,
    supplier_id INTEGER,
    status VARCHAR(50) DEFAULT 'pending',
    expected_delivery_date DATE,
    received_date DATE,
    total_amount DECIMAL(12, 2),
    notes TEXT,
    created_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Tabla de Detalles de Órdenes de Compra
CREATE TABLE IF NOT EXISTS purchase_order_items (
    id SERIAL PRIMARY KEY,
    purchase_order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity_ordered INTEGER NOT NULL,
    quantity_received INTEGER DEFAULT 0,
    unit_price DECIMAL(10, 2) NOT NULL,
    received_at TIMESTAMP,
    FOREIGN KEY (purchase_order_id) REFERENCES purchase_orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Tabla de Auditoría
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INTEGER,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Índices para optimización
CREATE INDEX idx_products_category ON products(category_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_products_sku ON products(sku) WHERE deleted_at IS NULL;
CREATE INDEX idx_products_status ON products(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_movements_product ON inventory_movements(product_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_movements_type ON inventory_movements(movement_type) WHERE deleted_at IS NULL;
CREATE INDEX idx_movements_created ON inventory_movements(created_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_username ON users(username) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_categories_name ON categories(name) WHERE deleted_at IS NULL;
CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);

-- Insertar datos de ejemplo
-- Usuario administrador (password: admin123 hasheado con bcrypt)
INSERT INTO users (username, email, password_hash, full_name, role, is_active) 
VALUES ('admin', 'admin@inventory.local', '$2b$10$YQv8kVX.X7p5HYMS5fWZ2OWPpVsXZcV5zQ5kF8M9kJZ5M2Zl2k7km', 'Administrador', 'admin', true)
ON CONFLICT (username) DO NOTHING;

-- Categorías de ejemplo
INSERT INTO categories (name, description, is_active)
VALUES 
    ('Electrónica', 'Productos electrónicos varios', true),
    ('Muebles', 'Muebles para oficina y hogar', true),
    ('Accesorios', 'Accesorios y repuestos', true),
    ('Software', 'Licencias y software', true),
    ('Consumibles', 'Artículos consumibles', true)
ON CONFLICT (name) DO NOTHING;

-- Productos de ejemplo
INSERT INTO products (name, sku, description, price, cost, category_id, quantity_in_stock, reorder_level, status, supplier)
VALUES 
    ('Monitor LG 24"', 'MON-LG-24-001', 'Monitor FHD 24 pulgadas', 250.00, 150.00, 1, 15, 5, 'active', 'LG Electronics'),
    ('Teclado Mecánico', 'KEY-MECH-001', 'Teclado mecánico RGB', 120.00, 70.00, 1, 8, 3, 'active', 'Corsair'),
    ('Escritorio Ejecutivo', 'FURN-DESK-001', 'Escritorio de madera 1.5m', 450.00, 250.00, 2, 5, 2, 'active', 'MueblesPro'),
    ('Silla Ergonómica', 'FURN-CHAIR-001', 'Silla ergonómica con soporte lumbar', 350.00, 180.00, 2, 10, 3, 'active', 'MueblesPro'),
    ('Cable HDMI 5m', 'ACC-HDMI-5M', 'Cable HDMI de alta velocidad', 15.00, 5.00, 3, 50, 10, 'active', 'Generic'),
    ('Pasta Térmica', 'ACC-THERMAL-001', 'Pasta térmica premium', 12.00, 4.00, 3, 30, 10, 'active', 'Arctic'),
    ('Windows 11 Pro', 'SW-WIN11-PRO', 'Licencia Windows 11 Pro', 199.00, 100.00, 4, 5, 1, 'active', 'Microsoft'),
    ('Cuadernos Block', 'CON-NOTEBOOK-A4', 'Pack de 5 cuadernos A4', 25.00, 12.00, 5, 100, 20, 'active', 'Scribe')
ON CONFLICT (sku) DO NOTHING;

-- Ejemplos de movimientos de inventario
INSERT INTO inventory_movements (product_id, movement_type, quantity, reference_type, reference_id, notes, created_by)
SELECT 
    p.id,
    'entrada',
    10,
    'PO',
    'PO-2024-001',
    'Entrada de compra',
    u.id
FROM products p
CROSS JOIN users u
WHERE p.sku = 'MON-LG-24-001' AND u.username = 'admin'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Permisos básicos por rol (comentado para futuro uso)
-- GRANT SELECT ON ALL TABLES IN SCHEMA public TO ibacrea;
-- GRANT INSERT, UPDATE, DELETE ON products, categories, inventory_movements TO ibacrea;

-- Comentarios de tabla
COMMENT ON TABLE products IS 'Tabla principal de productos del inventario';
COMMENT ON TABLE inventory_movements IS 'Registro de todos los movimientos de stock';
COMMENT ON TABLE users IS 'Usuarios del sistema con roles y permisos';
COMMENT ON COLUMN products.deleted_at IS 'Soft delete - registro lógico eliminado si no es NULL';
COMMENT ON COLUMN inventory_movements.movement_type IS 'Tipo de movimiento: entrada, salida, ajuste, devolución';

-- Verificación final
SELECT 'Schema PostgreSQL creado exitosamente' AS status;
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_categories FROM categories;
SELECT COUNT(*) as total_products FROM products;
