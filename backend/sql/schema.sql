-- Botica Nova Salud - Esquema MySQL
CREATE DATABASE IF NOT EXISTS botica_nova_salud
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE botica_nova_salud;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  rol ENUM('admin','vendedor') NOT NULL DEFAULT 'vendedor',
  activo TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS categorias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(80) NOT NULL UNIQUE,
  descripcion VARCHAR(255) NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  descripcion VARCHAR(255) NULL,
  categoria_id INT NOT NULL,
  precio DECIMAL(10,2) NOT NULL CHECK (precio >= 0),
  stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
  stock_minimo INT NOT NULL DEFAULT 5 CHECK (stock_minimo >= 0),
  activo TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_prod_cat FOREIGN KEY (categoria_id) REFERENCES categorias(id),
  INDEX idx_prod_nombre (nombre),
  INDEX idx_prod_stock (stock)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS ventas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  cliente VARCHAR(120) NULL,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_venta_user FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS detalle_ventas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  venta_id INT NOT NULL,
  producto_id INT NOT NULL,
  cantidad INT NOT NULL CHECK (cantidad > 0),
  precio_unitario DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  CONSTRAINT fk_det_venta FOREIGN KEY (venta_id) REFERENCES ventas(id) ON DELETE CASCADE,
  CONSTRAINT fk_det_prod FOREIGN KEY (producto_id) REFERENCES productos(id)
) ENGINE=InnoDB;

-- Datos de ejemplo
INSERT IGNORE INTO categorias (id, nombre, descripcion) VALUES
 (1,'Analgésicos','Dolor y fiebre'),
 (2,'Antibióticos','Con receta'),
 (3,'Vitaminas','Suplementos'),
 (4,'Cuidado personal','Higiene y cuidado');

INSERT IGNORE INTO productos (id, nombre, descripcion, categoria_id, precio, stock, stock_minimo) VALUES
 (1,'Paracetamol 500mg','Caja x 100',1,12.50,50,10),
 (2,'Ibuprofeno 400mg','Caja x 20',1,8.00,4,10),
 (3,'Amoxicilina 500mg','Caja x 12',2,15.90,25,8),
 (4,'Vitamina C 1g','Tubo x 10',3,9.90,3,5),
 (5,'Alcohol medicinal 250ml','Frasco',4,4.50,40,10);
-- El usuario admin se crea con: npm run seed:admin
