-- Script pour ajouter les colonnes is_bestseller, is_new, is_featured si elles n'existent pas
-- Exécuter ce script dans phpMyAdmin ou MySQL Workbench

-- Vérifier et ajouter la colonne is_bestseller
SET @column_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = 'ecommerce_app'
    AND TABLE_NAME = 'products'
    AND COLUMN_NAME = 'is_bestseller'
);

SET @sql = IF(@column_exists = 0,
    'ALTER TABLE products ADD COLUMN is_bestseller TINYINT(1) DEFAULT 0 AFTER image_url',
    'SELECT "Column is_bestseller already exists" as message'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Vérifier et ajouter la colonne is_new
SET @column_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = 'ecommerce_app'
    AND TABLE_NAME = 'products'
    AND COLUMN_NAME = 'is_new'
);

SET @sql = IF(@column_exists = 0,
    'ALTER TABLE products ADD COLUMN is_new TINYINT(1) DEFAULT 0 AFTER is_bestseller',
    'SELECT "Column is_new already exists" as message'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Vérifier et ajouter la colonne is_featured
SET @column_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = 'ecommerce_app'
    AND TABLE_NAME = 'products'
    AND COLUMN_NAME = 'is_featured'
);

SET @sql = IF(@column_exists = 0,
    'ALTER TABLE products ADD COLUMN is_featured TINYINT(1) DEFAULT 0 AFTER is_new',
    'SELECT "Column is_featured already exists" as message'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Ajouter la colonne display_order pour l'ordre d'affichage
SET @column_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = 'ecommerce_app'
    AND TABLE_NAME = 'products'
    AND COLUMN_NAME = 'display_order'
);

SET @sql = IF(@column_exists = 0,
    'ALTER TABLE products ADD COLUMN display_order INT DEFAULT 0 AFTER is_featured',
    'SELECT "Column display_order already exists" as message'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Mettre à jour quelques produits existants pour les tests
UPDATE products SET is_bestseller = 1 WHERE id IN (1, 2, 3);
UPDATE products SET is_new = 1 WHERE id IN (2, 4, 5);
UPDATE products SET is_featured = 1 WHERE id IN (1, 3, 4);

SELECT 'Script terminé avec succès!' as message;