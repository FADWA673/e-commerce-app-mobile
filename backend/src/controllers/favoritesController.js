// backend/src/controllers/favoritesController.js
const db = require('../config/database');

// Obtenir les favoris de l'utilisateur
exports.getFavorites = async (req, res) => {
  try {
    console.log('🔍 Récupération favoris utilisateur:', req.userId);
    
    const [favorites] = await db.query(
      `SELECT f.*, p.*, c.nom as category_name, b.nom as brand_name, b.logo_url as brand_logo
       FROM favorites f
       JOIN products p ON f.product_id = p.id
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN brands b ON p.brand_id = b.id
       WHERE f.user_id = ?
       ORDER BY f.created_at DESC`,
      [req.userId]
    );

    console.log('✅ Favoris trouvés:', favorites.length);

    res.json({
      success: true,
      favorites
    });
  } catch (error) {
    console.error('Erreur récupération favoris:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur.' 
    });
  }
};

// Ajouter un produit aux favoris
exports.addToFavorites = async (req, res) => {
  try {
    const { product_id } = req.body;
    
    console.log('❤️ Ajout aux favoris:', {
      userId: req.userId,
      productId: product_id
    });

    if (!product_id) {
      return res.status(400).json({ 
        success: false, 
        message: 'ID du produit requis.' 
      });
    }

    // Vérifier si le produit existe
    const [products] = await db.query('SELECT id FROM products WHERE id = ?', [product_id]);
    if (products.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Produit non trouvé.' 
      });
    }

    // Ajouter aux favoris (ignore si déjà existant grâce à UNIQUE KEY)
    await db.query(
      'INSERT IGNORE INTO favorites (user_id, product_id) VALUES (?, ?)',
      [req.userId, product_id]
    );

    console.log('✅ Produit ajouté aux favoris');

    res.json({
      success: true,
      message: 'Produit ajouté aux favoris'
    });
  } catch (error) {
    console.error('Erreur ajout favoris:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur.' 
    });
  }
};

// Supprimer un produit des favoris
exports.removeFromFavorites = async (req, res) => {
  try {
    const { product_id } = req.params;
    
    console.log('💔 Suppression des favoris:', {
      userId: req.userId,
      productId: product_id
    });

    const [result] = await db.query(
      'DELETE FROM favorites WHERE user_id = ? AND product_id = ?',
      [req.userId, product_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé dans les favoris'
      });
    }

    console.log('✅ Produit supprimé des favoris');

    res.json({
      success: true,
      message: 'Produit supprimé des favoris'
    });
  } catch (error) {
    console.error('Erreur suppression favoris:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur.' 
    });
  }
};

// Vérifier si un produit est en favoris
exports.isFavorite = async (req, res) => {
  try {
    const { product_id } = req.params;
    
    const [favorites] = await db.query(
      'SELECT id FROM favorites WHERE user_id = ? AND product_id = ?',
      [req.userId, product_id]
    );

    res.json({
      success: true,
      isFavorite: favorites.length > 0
    });
  } catch (error) {
    console.error('Erreur vérification favoris:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur.' 
    });
  }
};

// Vider tous les favoris
exports.clearFavorites = async (req, res) => {
  try {
    console.log('🗑️ Vidage favoris utilisateur:', req.userId);
    
    await db.query('DELETE FROM favorites WHERE user_id = ?', [req.userId]);

    console.log('✅ Favoris vidés');

    res.json({
      success: true,
      message: 'Favoris vidés'
    });
  } catch (error) {
    console.error('Erreur vidage favoris:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur.' 
    });
  }
};