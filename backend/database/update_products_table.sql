-- Script de mise à jour de la table products
-- À exécuter dans phpMyAdmin

USE ecommerce_db;

-- Ajouter les colonnes pour gérer les sections spéciales
ALTER TABLE products 
ADD COLUMN is_bestseller BOOLEAN DEFAULT FALSE AFTER image_url,
ADD COLUMN is_new BOOLEAN DEFAULT FALSE AFTER is_bestseller,
ADD COLUMN is_featured BOOLEAN DEFAULT FALSE AFTER is_new,
ADD COLUMN display_order INT DEFAULT 0 AFTER is_featured;

-- Créer un index pour améliorer les performances
CREATE INDEX idx_bestseller ON products(is_bestseller);
CREATE INDEX idx_new ON products(is_new);
CREATE INDEX idx_featured ON products(is_featured);
CREATE INDEX idx_display_order ON products(display_order);

-- Afficher un message de confirmation
SELECT 'Table products mise à jour avec succès!' as message;