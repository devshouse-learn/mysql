-- Crear base de datos
CREATE DATABASE IF NOT EXISTS inventory_db;
USE inventory_db;

-- Tabla de Categorías
CREATE TABLE IF NOT EXISTS categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de Productos
CREATE TABLE IF NOT EXISTS products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  category_id INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  quantity INT NOT NULL DEFAULT 0,
  sku VARCHAR(50) UNIQUE NOT NULL,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Tabla de Movimientos de Inventario
CREATE TABLE IF NOT EXISTS inventory_movements (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  movement_type ENUM('entrada', 'salida') NOT NULL,
  quantity INT NOT NULL,
  reason VARCHAR(255),
  reference VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Tabla de Proveedores
CREATE TABLE IF NOT EXISTS suppliers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(150) NOT NULL,
  contact_name VARCHAR(100),
  email VARCHAR(100),
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  country VARCHAR(100),
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de Órdenes de Compra
CREATE TABLE IF NOT EXISTS purchase_orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  supplier_id INT NOT NULL,
  order_date DATE NOT NULL,
  expected_delivery_date DATE,
  actual_delivery_date DATE,
  status ENUM('pendiente', 'recibida', 'cancelada') DEFAULT 'pendiente',
  total DECIMAL(12, 2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
);

-- Tabla de Items de Órdenes de Compra
CREATE TABLE IF NOT EXISTS purchase_order_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  purchase_order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(12, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (purchase_order_id) REFERENCES purchase_orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Índices para mejorar performance
CREATE INDEX idx_product_category ON products(category_id);
CREATE INDEX idx_product_sku ON products(sku);
CREATE INDEX idx_product_status ON products(status);
CREATE INDEX idx_movement_product ON inventory_movements(product_id);
CREATE INDEX idx_movement_date ON inventory_movements(created_at);
CREATE INDEX idx_po_supplier ON purchase_orders(supplier_id);
CREATE INDEX idx_po_status ON purchase_orders(status);
CREATE INDEX idx_poi_po ON purchase_order_items(purchase_order_id);

-- Datos de ejemplo
INSERT INTO categories (name, description) VALUES
('Electrónica', 'Productos electrónicos y accesorios'),
('Ropa', 'Prendas de vestir'),
('Alimentos', 'Productos alimenticios'),
('Libros', 'Libros y material de lectura');

INSERT INTO products (name, description, category_id, price, quantity, sku, status) VALUES
('Laptop Dell', 'Laptop Dell Inspiron 15', 1, 899.99, 10, 'SKU001', 'active'),
('Mouse Logitech', 'Mouse inalámbrico', 1, 29.99, 50, 'SKU002', 'active'),
('Camiseta Básica', 'Camiseta 100% algodón', 2, 19.99, 100, 'SKU003', 'active'),
('Pan Integral', 'Pan integral fresco', 3, 3.99, 45, 'SKU004', 'active'),
('El Quijote', 'Novela clásica de Cervantes', 4, 15.99, 25, 'SKU005', 'active');

INSERT INTO suppliers (name, contact_name, email, phone, city, country, status) VALUES
('Proveedor Tech SA', 'Juan Pérez', 'juan@proveedortech.com', '555-0001', 'Madrid', 'España', 'active'),
('Textiles México', 'María García', 'maria@textilesmx.com', '555-0002', 'Ciudad de México', 'México', 'active'),
('Alimentos Frescos Ltd', 'Carlos López', 'carlos@alimentosfrescos.com', '555-0003', 'Barcelona', 'España', 'active');
