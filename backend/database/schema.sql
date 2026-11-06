-- Script de création de la base de données E-commerce
-- À exécuter dans phpMyAdmin ou MySQL Workbench

-- Créer la base de données
CREATE DATABASE IF NOT EXISTS ecommerce_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ecommerce_db;

-- Table des catégories
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des produits
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(200) NOT NULL,
    description TEXT,
    prix DECIMAL(10,2) NOT NULL,
    stock INT DEFAULT 0,
    category_id INT,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_category (category_id),
    INDEX idx_prix (prix),
    INDEX idx_stock (stock)
);

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    telephone VARCHAR(20),
    adresse TEXT,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- Table du panier
CREATE TABLE IF NOT EXISTS cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantite INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_product (user_id, product_id),
    INDEX idx_user (user_id)
);

-- Table des commandes
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    statut ENUM('en_attente', 'confirmee', 'expediee', 'livree', 'annulee') DEFAULT 'en_attente',
    adresse_livraison TEXT NOT NULL,
    telephone_livraison VARCHAR(20),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_statut (statut),
    INDEX idx_date (created_at)
);

-- Table des détails de commande
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantite INT NOT NULL,
    prix_unitaire DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_order (order_id),
    INDEX idx_product (product_id)
);

-- Table des favoris
CREATE TABLE IF NOT EXISTS favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_product (user_id, product_id),
    INDEX idx_user (user_id)
);

-- Insérer des catégories par défaut
INSERT INTO categories (nom, description) VALUES
('Électronique', 'Smartphones, ordinateurs, accessoires électroniques'),
('Vêtements', 'Mode homme, femme et enfant'),
('Alimentation', 'Produits alimentaires et boissons'),
('Maison & Jardin', 'Décoration, meubles, jardinage'),
('Sport & Loisirs', 'Équipements sportifs et loisirs'),
('Beauté & Santé', 'Cosmétiques, soins et produits de santé');

-- Insérer des produits d'exemple
INSERT INTO products (nom, description, prix, stock, category_id, image_url) VALUES
('iPhone 15 Pro', 'Le nouvel iPhone 15 Pro avec puce A17 Pro et appareil photo professionnel', 1299.99, 15, 1, 'https://via.placeholder.com/300x300/007bff/ffffff?text=iPhone+15+Pro'),
('MacBook Air M2', 'MacBook Air avec puce M2, écran 13 pouces, 256GB SSD', 1199.99, 8, 1, 'https://via.placeholder.com/300x300/007bff/ffffff?text=MacBook+Air'),
('AirPods Pro', 'Écouteurs sans fil avec réduction de bruit active', 249.99, 25, 1, 'https://via.placeholder.com/300x300/007bff/ffffff?text=AirPods+Pro'),
('T-shirt Premium', 'T-shirt en coton bio, confortable et durable', 29.99, 50, 2, 'https://via.placeholder.com/300x300/28a745/ffffff?text=T-shirt'),
('Jeans Slim', 'Jeans slim fit, coupe moderne et confortable', 79.99, 30, 2, 'https://via.placeholder.com/300x300/28a745/ffffff?text=Jeans'),
('Miel naturel', 'Miel naturel de montagne, pot de 500g', 15.99, 100, 3, 'https://via.placeholder.com/300x300/ffc107/ffffff?text=Miel'),
('Canapé 3 places', 'Canapé confortable en tissu, 3 places', 599.99, 5, 4, 'https://via.placeholder.com/300x300/6f42c1/ffffff?text=Canapé'),
('Ballon de football', 'Ballon de football officiel, taille 5', 24.99, 40, 5, 'https://via.placeholder.com/300x300/fd7e14/ffffff?text=Ballon'),
('Crème hydratante', 'Crème hydratante pour visage, tous types de peau', 19.99, 60, 6, 'https://via.placeholder.com/300x300/e83e8c/ffffff?text=Crème');

-- Créer un utilisateur admin par défaut
INSERT INTO users (nom, email, password, role) VALUES
('Administrateur', 'admin@ecommerce.ma', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');
-- Mot de passe: password

-- Afficher un message de confirmation
SELECT 'Base de données créée avec succès!' as message;