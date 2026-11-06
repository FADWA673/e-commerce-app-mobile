-- Script pour ajouter le système de marques
-- À exécuter dans phpMyAdmin

USE ecommerce_db;

-- Créer la table des marques
CREATE TABLE IF NOT EXISTS brands (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    description TEXT,
    logo_url VARCHAR(255),
    website VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Ajouter la colonne brand_id à la table products
ALTER TABLE products 
ADD COLUMN brand_id INT AFTER category_id,
ADD FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE SET NULL;

-- Créer un index pour améliorer les performances
CREATE INDEX idx_brand_id ON products(brand_id);

-- Insérer quelques marques d'exemple
INSERT INTO brands (nom, description, is_active) VALUES
('Nike', 'Marque de sport et vêtements', TRUE),
('Adidas', 'Équipements sportifs et mode', TRUE),
('Zara', 'Mode et vêtements tendance', TRUE),
('H&M', 'Mode accessible et moderne', TRUE),
('Apple', 'Technologie et électronique', TRUE),
('Samsung', 'Électronique et smartphones', TRUE),
('Sony', 'Électronique et divertissement', TRUE),
('Nestlé', 'Alimentation et boissons', TRUE),
('Danone', 'Produits laitiers et alimentation', TRUE),
('Coca-Cola', 'Boissons et rafraîchissements', TRUE);

-- Afficher un message de confirmation
SELECT 'Système de marques créé avec succès!' as message;
SELECT 'Marques ajoutées:' as info, COUNT(*) as total FROM brands;