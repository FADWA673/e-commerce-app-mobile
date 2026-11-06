-- Ajouter des logos aux marques existantes
USE ecommerce_db;

-- Mettre à jour les marques avec des URLs de logos (placeholders pour l'exemple)
UPDATE brands SET 
    logo_url = 'https://via.placeholder.com/80x80/FF0000/FFFFFF?text=NIKE',
    website = 'https://www.nike.com'
WHERE nom = 'Nike';

UPDATE brands SET 
    logo_url = 'https://via.placeholder.com/80x80/000000/FFFFFF?text=ADIDAS',
    website = 'https://www.adidas.com'
WHERE nom = 'Adidas';

UPDATE brands SET 
    logo_url = 'https://via.placeholder.com/80x80/000000/FFFFFF?text=ZARA',
    website = 'https://www.zara.com'
WHERE nom = 'Zara';

UPDATE brands SET 
    logo_url = 'https://via.placeholder.com/80x80/FF0000/FFFFFF?text=H&M',
    website = 'https://www.hm.com'
WHERE nom = 'H&M';

UPDATE brands SET 
    logo_url = 'https://via.placeholder.com/80x80/000000/FFFFFF?text=APPLE',
    website = 'https://www.apple.com'
WHERE nom = 'Apple';

UPDATE brands SET 
    logo_url = 'https://via.placeholder.com/80x80/1f4e79/FFFFFF?text=SAMSUNG',
    website = 'https://www.samsung.com'
WHERE nom = 'Samsung';

UPDATE brands SET 
    logo_url = 'https://via.placeholder.com/80x80/000000/FFFFFF?text=SONY',
    website = 'https://www.sony.com'
WHERE nom = 'Sony';

UPDATE brands SET 
    logo_url = 'https://via.placeholder.com/80x80/FF6B35/FFFFFF?text=NESTLE',
    website = 'https://www.nestle.com'
WHERE nom = 'Nestlé';

UPDATE brands SET 
    logo_url = 'https://via.placeholder.com/80x80/0066CC/FFFFFF?text=DANONE',
    website = 'https://www.danone.com'
WHERE nom = 'Danone';

UPDATE brands SET 
    logo_url = 'https://via.placeholder.com/80x80/FF0000/FFFFFF?text=COCA',
    website = 'https://www.coca-cola.com'
WHERE nom = 'Coca-Cola';

-- Afficher les marques mises à jour
SELECT 'Logos de marques ajoutés avec succès!' as message;
SELECT id, nom, logo_url, website FROM brands WHERE logo_url IS NOT NULL;