// backend/src/controllers/productController.js
const db = require('../config/database');
const path = require('path');
const fs = require('fs');

// Obtenir tous les produits avec filtrage
exports.getAllProducts = async (req, res) => {
  try {
    const { category_id, brand_id, search, limit } = req.query;
    
    let query = `
      SELECT p.*, c.nom as category_name, b.nom as brand_name, b.logo_url as brand_logo
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      LEFT JOIN brands b ON p.brand_id = b.id
      WHERE 1=1
    `;
    const params = [];

    // Filtrer par catégorie
    if (category_id) {
      query += ' AND p.category_id = ?';
      params.push(category_id);
    }

    // Filtrer par marque
    if (brand_id) {
      query += ' AND p.brand_id = ?';
      params.push(brand_id);
    }

    // Recherche par nom ou description
    if (search) {
      query += ' AND (p.nom LIKE ? OR p.description LIKE ? OR b.nom LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY p.created_at DESC';

    // Ajouter la limite si spécifiée
    if (limit) {
      query += ' LIMIT ?';
      params.push(parseInt(limit));
    }

    console.log('🔍 Requête getAllProducts:', query);
    console.log('🔍 Paramètres:', params);

    const [products] = await db.query(query, params);

    console.log('✅ Produits trouvés:', products.length);

    // S'assurer que tous les produits ont des valeurs sûres
    const safeProducts = products.map(product => ({
      id: product.id || null,
      nom: product.nom || '',
      description: product.description || '',
      prix: product.prix || 0,
      stock: product.stock || 0,
      category_id: product.category_id || null,
      brand_id: product.brand_id || null,
      image_url: product.image_url || null,
      category_name: product.category_name || '',
      brand_name: product.brand_name || '',
      brand_logo: product.brand_logo || null,
      is_bestseller: product.is_bestseller || 0,
      is_new: product.is_new || 0,
      is_featured: product.is_featured || 0,
      created_at: product.created_at || null,
      updated_at: product.updated_at || null
    }));

    res.json({
      success: true,
      count: safeProducts.length,
      products: safeProducts
    });
  } catch (error) {
    console.error('Erreur récupération produits:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur.' 
    });
  }
};

// Obtenir un produit par ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validation de l'ID
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ 
        success: false, 
        message: 'ID de produit invalide.' 
      });
    }

    console.log('🔍 Recherche produit avec ID:', id);

    const [products] = await db.query(
      `SELECT p.*, c.nom as category_name, b.nom as brand_name, b.logo_url as brand_logo
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       LEFT JOIN brands b ON p.brand_id = b.id
       WHERE p.id = ?`,
      [parseInt(id)]
    );

    if (products.length === 0) {
      console.log('❌ Produit non trouvé pour ID:', id);
      return res.status(404).json({ 
        success: false, 
        message: 'Produit non trouvé.' 
      });
    }

    const product = products[0];
    
    // S'assurer que toutes les valeurs sont définies
    const safeProduct = {
      id: product.id || null,
      nom: product.nom || '',
      description: product.description || '',
      prix: product.prix || 0,
      stock: product.stock || 0,
      category_id: product.category_id || null,
      brand_id: product.brand_id || null,
      image_url: product.image_url || null,
      category_name: product.category_name || '',
      brand_name: product.brand_name || '',
      brand_logo: product.brand_logo || null,
      is_bestseller: product.is_bestseller || 0,
      is_new: product.is_new || 0,
      is_featured: product.is_featured || 0,
      created_at: product.created_at || null,
      updated_at: product.updated_at || null
    };

    console.log('✅ Produit trouvé:', safeProduct.nom);

    res.json({
      success: true,
      product: safeProduct
    });
  } catch (error) {
    console.error('❌ Erreur récupération produit:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur: ' + error.message 
    });
  }
};

// Créer un nouveau produit
exports.createProduct = async (req, res) => {
  try {
    const { nom, description, prix, stock, category_id, brand_id, is_bestseller, is_new, is_featured } = req.body;
    
    console.log('Données reçues:', req.body);
    console.log('Fichier reçu:', req.file);
    
    // Validation
    if (!nom || !prix || !category_id) {
      return res.status(400).json({
        success: false,
        message: 'Nom, prix et catégorie sont obligatoires.'
      });
    }

    // URL de l'image si uploadée
    let image_url = null;
    if (req.file) {
      image_url = `/uploads/products/${req.file.filename}`;
      console.log('Image URL générée:', image_url);
    }

    const [result] = await db.query(
      `INSERT INTO products (nom, description, prix, stock, category_id, brand_id, image_url, is_bestseller, is_new, is_featured, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        nom, 
        description, 
        parseFloat(prix), 
        parseInt(stock) || 0, 
        category_id,
        brand_id || null,
        image_url,
        is_bestseller === 'true' || is_bestseller === true ? 1 : 0,
        is_new === 'true' || is_new === true ? 1 : 0,
        is_featured === 'true' || is_featured === true ? 1 : 0
      ]
    );

    console.log('Produit créé avec ID:', result.insertId);

    res.status(201).json({
      success: true,
      message: 'Produit créé avec succès.',
      product: {
        id: result.insertId,
        nom,
        description,
        prix: parseFloat(prix),
        stock: parseInt(stock) || 0,
        category_id,
        brand_id: brand_id || null,
        image_url,
        is_bestseller: is_bestseller === 'true' || is_bestseller === true,
        is_new: is_new === 'true' || is_new === true,
        is_featured: is_featured === 'true' || is_featured === true
      }
    });
  } catch (error) {
    console.error('Erreur création produit:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du produit: ' + error.message
    });
  }
};

// Mettre à jour un produit
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, description, prix, stock, category_id, brand_id, is_bestseller, is_new, is_featured } = req.body;

    console.log('Mise à jour produit ID:', id);
    console.log('Données reçues:', req.body);
    console.log('Fichier reçu:', req.file);

    // Vérifier si le produit existe
    const [existingProduct] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
    if (existingProduct.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé.'
      });
    }

    // Préparer les données à mettre à jour
    let updateData = {
      nom: nom || existingProduct[0].nom,
      description: description || existingProduct[0].description,
      prix: prix ? parseFloat(prix) : existingProduct[0].prix,
      stock: stock !== undefined ? parseInt(stock) : existingProduct[0].stock,
      category_id: category_id || existingProduct[0].category_id,
      brand_id: brand_id !== undefined ? (brand_id || null) : existingProduct[0].brand_id,
      image_url: existingProduct[0].image_url,
      is_bestseller: is_bestseller !== undefined ? (is_bestseller === 'true' || is_bestseller === true ? 1 : 0) : existingProduct[0].is_bestseller,
      is_new: is_new !== undefined ? (is_new === 'true' || is_new === true ? 1 : 0) : existingProduct[0].is_new,
      is_featured: is_featured !== undefined ? (is_featured === 'true' || is_featured === true ? 1 : 0) : existingProduct[0].is_featured
    };

    // Gérer la nouvelle image
    if (req.file) {
      // Supprimer l'ancienne image si elle existe
      if (existingProduct[0].image_url) {
        const oldImagePath = path.join(__dirname, '../../uploads/products', path.basename(existingProduct[0].image_url));
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
          console.log('Ancienne image supprimée:', oldImagePath);
        }
      }
      updateData.image_url = `/uploads/products/${req.file.filename}`;
      console.log('Nouvelle image URL:', updateData.image_url);
    }

    await db.query(
      `UPDATE products SET nom = ?, description = ?, prix = ?, stock = ?, category_id = ?, brand_id = ?, image_url = ?, 
       is_bestseller = ?, is_new = ?, is_featured = ? 
       WHERE id = ?`,
      [
        updateData.nom, 
        updateData.description, 
        updateData.prix, 
        updateData.stock, 
        updateData.category_id,
        updateData.brand_id,
        updateData.image_url,
        updateData.is_bestseller,
        updateData.is_new,
        updateData.is_featured,
        id
      ]
    );

    console.log('Produit mis à jour avec succès');

    res.json({
      success: true,
      message: 'Produit mis à jour avec succès.',
      product: { id: parseInt(id), ...updateData }
    });
  } catch (error) {
    console.error('Erreur mise à jour produit:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du produit: ' + error.message
    });
  }
};

// Supprimer un produit
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier si le produit existe
    const [existingProduct] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
    if (existingProduct.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé.'
      });
    }

    // Supprimer l'image si elle existe
    if (existingProduct[0].image_url) {
      const imagePath = path.join(__dirname, '../../uploads/products', path.basename(existingProduct[0].image_url));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Supprimer le produit de la base de données
    await db.query('DELETE FROM products WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Produit supprimé avec succès.'
    });
  } catch (error) {
    console.error('Erreur suppression produit:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du produit.'
    });
  }
};

// Obtenir toutes les catégories
exports.getCategories = async (req, res) => {
  try {
    // Récupérer les catégories avec le nombre de produits
    const [categories] = await db.query(`
      SELECT 
        c.*,
        COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id AND p.is_active = 1
      GROUP BY c.id
      ORDER BY c.nom
    `);

    res.json({
      success: true,
      categories
    });
  } catch (error) {
    console.error('Erreur récupération catégories:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur.' 
    });
  }
};

// Obtenir les produits bestsellers
exports.getBestsellers = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    console.log('🔍 Récupération bestsellers, limit:', limit);
    
    const [products] = await db.query(
      `SELECT p.*, c.nom as category_name, b.nom as brand_name, b.logo_url as brand_logo
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       LEFT JOIN brands b ON p.brand_id = b.id
       WHERE p.is_bestseller = 1
       ORDER BY p.created_at DESC 
       LIMIT ?`,
      [parseInt(limit)]
    );

    console.log('✅ Bestsellers trouvés:', products.length);
    products.forEach(p => console.log(`- ${p.nom} (bestseller: ${p.is_bestseller})`));

    res.json({
      success: true,
      products
    });
  } catch (error) {
    console.error('Erreur récupération bestsellers:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur.' 
    });
  }
};

// Obtenir les nouveaux produits
exports.getNewProducts = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    console.log('🔍 Récupération nouveaux produits, limit:', limit);
    
    const [products] = await db.query(
      `SELECT p.*, c.nom as category_name, b.nom as brand_name, b.logo_url as brand_logo
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       LEFT JOIN brands b ON p.brand_id = b.id
       WHERE p.is_new = 1
       ORDER BY p.created_at DESC 
       LIMIT ?`,
      [parseInt(limit)]
    );

    console.log('✅ Nouveaux produits trouvés:', products.length);
    products.forEach(p => console.log(`- ${p.nom} (nouveau: ${p.is_new})`));

    res.json({
      success: true,
      products
    });
  } catch (error) {
    console.error('Erreur récupération nouveaux produits:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur.' 
    });
  }
};

// Obtenir les produits en vedette
exports.getFeaturedProducts = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const [products] = await db.query(
      `SELECT p.*, c.nom as category_name, b.nom as brand_name, b.logo_url as brand_logo
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       LEFT JOIN brands b ON p.brand_id = b.id
       WHERE p.is_featured = 1 AND p.stock > 0
       ORDER BY p.display_order ASC, p.created_at DESC 
       LIMIT ?`,
      [parseInt(limit)]
    );

    res.json({
      success: true,
      products
    });
  } catch (error) {
    console.error('Erreur récupération produits vedette:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur.' 
    });
  }
};

// === GESTION DES MARQUES ===

// Obtenir toutes les marques
exports.getBrands = async (req, res) => {
  try {
    // Récupérer les marques avec le nombre de produits
    const [brands] = await db.query(`
      SELECT 
        b.*,
        COUNT(p.id) as product_count
      FROM brands b
      LEFT JOIN products p ON b.id = p.brand_id AND p.is_active = 1
      WHERE b.is_active = 1
      GROUP BY b.id
      ORDER BY b.nom
    `);

    res.json({
      success: true,
      brands
    });
  } catch (error) {
    console.error('Erreur récupération marques:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur.' 
    });
  }
};

// Obtenir une marque par ID
exports.getBrandById = async (req, res) => {
  try {
    const { id } = req.params;

    const [brands] = await db.query('SELECT * FROM brands WHERE id = ?', [id]);

    if (brands.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Marque non trouvée.'
      });
    }

    res.json({
      success: true,
      brand: brands[0]
    });
  } catch (error) {
    console.error('Erreur récupération marque:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur.'
    });
  }
};

// Créer une nouvelle marque
exports.createBrand = async (req, res) => {
  try {
    const { nom, description, website } = req.body;

    if (!nom) {
      return res.status(400).json({
        success: false,
        message: 'Le nom de la marque est obligatoire.'
      });
    }

    // URL du logo si uploadé
    let logo_url = null;
    if (req.file) {
      logo_url = `/uploads/brands/${req.file.filename}`;
    }

    const [result] = await db.query(
      'INSERT INTO brands (nom, description, logo_url, website, created_at) VALUES (?, ?, ?, ?, NOW())',
      [nom, description, logo_url, website]
    );

    res.status(201).json({
      success: true,
      message: 'Marque créée avec succès.',
      brand: {
        id: result.insertId,
        nom,
        description,
        logo_url,
        website
      }
    });
  } catch (error) {
    console.error('Erreur création marque:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la marque.'
    });
  }
};

// Mettre à jour une marque
exports.updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, description, website } = req.body;

    // Vérifier si la marque existe
    const [existingBrand] = await db.query('SELECT * FROM brands WHERE id = ?', [id]);
    if (existingBrand.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Marque non trouvée.'
      });
    }

    let logo_url = existingBrand[0].logo_url;
    if (req.file) {
      logo_url = `/uploads/brands/${req.file.filename}`;
      
      // Supprimer l'ancien logo si il existe
      if (existingBrand[0].logo_url) {
        const oldLogoPath = path.join(__dirname, '../../uploads/brands', path.basename(existingBrand[0].logo_url));
        if (fs.existsSync(oldLogoPath)) {
          fs.unlinkSync(oldLogoPath);
        }
      }
    }

    await db.query(
      'UPDATE brands SET nom = ?, description = ?, logo_url = ?, website = ?, updated_at = NOW() WHERE id = ?',
      [nom || existingBrand[0].nom, description || existingBrand[0].description, logo_url, website || existingBrand[0].website, id]
    );

    res.json({
      success: true,
      message: 'Marque mise à jour avec succès.',
      brand: {
        id: parseInt(id),
        nom: nom || existingBrand[0].nom,
        description: description || existingBrand[0].description,
        logo_url,
        website: website || existingBrand[0].website
      }
    });
  } catch (error) {
    console.error('Erreur mise à jour marque:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la marque.'
    });
  }
};

// Supprimer une marque
exports.deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier si la marque existe
    const [existingBrand] = await db.query('SELECT * FROM brands WHERE id = ?', [id]);
    if (existingBrand.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Marque non trouvée.'
      });
    }

    // Vérifier s'il y a des produits avec cette marque
    const [products] = await db.query('SELECT COUNT(*) as count FROM products WHERE brand_id = ?', [id]);
    if (products[0].count > 0) {
      return res.status(400).json({
        success: false,
        message: 'Impossible de supprimer une marque qui a des produits associés.'
      });
    }

    // Supprimer le logo si il existe
    if (existingBrand[0].logo_url) {
      const logoPath = path.join(__dirname, '../../uploads/brands', path.basename(existingBrand[0].logo_url));
      if (fs.existsSync(logoPath)) {
        fs.unlinkSync(logoPath);
      }
    }

    await db.query('DELETE FROM brands WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Marque supprimée avec succès.'
    });
  } catch (error) {
    console.error('Erreur suppression marque:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la marque.'
    });
  }
};

// Obtenir les produits par marque
exports.getProductsByBrand = async (req, res) => {
  try {
    const { brandId } = req.params;
    const { limit = 20 } = req.query;
    
    const [products] = await db.query(
      `SELECT p.*, c.nom as category_name, b.nom as brand_name, b.logo_url as brand_logo
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       LEFT JOIN brands b ON p.brand_id = b.id
       WHERE p.brand_id = ? AND p.stock > 0
       ORDER BY p.created_at DESC 
       LIMIT ?`,
      [brandId, parseInt(limit)]
    );

    res.json({
      success: true,
      products
    });
  } catch (error) {
    console.error('Erreur récupération produits par marque:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur.' 
    });
  }
};

// Obtenir les marques d'une catégorie
exports.getCategoryBrands = async (req, res) => {
  try {
    const { id } = req.params;

    const [brands] = await db.query(
      `SELECT DISTINCT b.* 
       FROM brands b 
       INNER JOIN products p ON b.id = p.brand_id 
       WHERE p.category_id = ? AND b.is_active = 1 
       ORDER BY b.nom`,
      [id]
    );

    res.json({
      success: true,
      brands
    });
  } catch (error) {
    console.error('Erreur récupération marques de catégorie:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur.'
    });
  }
};

// Obtenir une catégorie par ID
exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const [categories] = await db.query('SELECT * FROM categories WHERE id = ?', [id]);

    if (categories.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Catégorie non trouvée.'
      });
    }

    res.json({
      success: true,
      category: categories[0]
    });
  } catch (error) {
    console.error('Erreur récupération catégorie:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur.'
    });
  }
};

// Créer une nouvelle catégorie
exports.createCategory = async (req, res) => {
  try {
    const { nom, description } = req.body;

    if (!nom) {
      return res.status(400).json({
        success: false,
        message: 'Le nom de la catégorie est obligatoire.'
      });
    }

    const [result] = await db.query(
      'INSERT INTO categories (nom, description, created_at) VALUES (?, ?, NOW())',
      [nom, description]
    );

    res.status(201).json({
      success: true,
      message: 'Catégorie créée avec succès.',
      category: {
        id: result.insertId,
        nom,
        description
      }
    });
  } catch (error) {
    console.error('Erreur création catégorie:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la catégorie.'
    });
  }
};

// Mettre à jour une catégorie
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, description } = req.body;

    // Vérifier si la catégorie existe
    const [existingCategory] = await db.query('SELECT * FROM categories WHERE id = ?', [id]);
    if (existingCategory.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Catégorie non trouvée.'
      });
    }

    await db.query(
      'UPDATE categories SET nom = ?, description = ?, updated_at = NOW() WHERE id = ?',
      [nom || existingCategory[0].nom, description || existingCategory[0].description, id]
    );

    res.json({
      success: true,
      message: 'Catégorie mise à jour avec succès.',
      category: {
        id: parseInt(id),
        nom: nom || existingCategory[0].nom,
        description: description || existingCategory[0].description
      }
    });
  } catch (error) {
    console.error('Erreur mise à jour catégorie:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la catégorie.'
    });
  }
};

// Supprimer une catégorie
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier si la catégorie existe
    const [existingCategory] = await db.query('SELECT * FROM categories WHERE id = ?', [id]);
    if (existingCategory.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Catégorie non trouvée.'
      });
    }

    // Vérifier s'il y a des produits dans cette catégorie
    const [products] = await db.query('SELECT COUNT(*) as count FROM products WHERE category_id = ?', [id]);
    if (products[0].count > 0) {
      return res.status(400).json({
        success: false,
        message: 'Impossible de supprimer une catégorie qui contient des produits.'
      });
    }

    await db.query('DELETE FROM categories WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Catégorie supprimée avec succès.'
    });
  } catch (error) {
    console.error('Erreur suppression catégorie:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la catégorie.'
    });
  }
};