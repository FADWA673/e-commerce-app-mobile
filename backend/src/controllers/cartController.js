// backend/src/controllers/cartController.js
const db = require('../config/database');

// Obtenir le panier de l'utilisateur
exports.getCart = async (req, res) => {
  try {
    const [cartItems] = await db.query(
      `SELECT c.*, p.nom, p.description, p.prix, p.image_url, p.stock,
              (c.quantite * p.prix) as subtotal
       FROM cart c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = ?`,
      [req.userId]
    );

    const total = cartItems.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);

    res.json({
      success: true,
      cart: cartItems,
      total: total.toFixed(2)
    });
  } catch (error) {
    console.error('Erreur récupération panier:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur.' 
    });
  }
};

// Ajouter un produit au panier
exports.addToCart = async (req, res) => {
  try {
    console.log('🛒 Tentative d\'ajout au panier');
    console.log('- User ID:', req.userId);
    console.log('- Body:', req.body);
    
    const { product_id, quantite } = req.body;

    if (!product_id || !quantite || quantite < 1) {
      console.log('❌ Données invalides:', { product_id, quantite });
      return res.status(400).json({ 
        success: false, 
        message: 'Produit et quantité requis.' 
      });
    }

    // Vérifier le stock
    const [products] = await db.query(
      'SELECT stock FROM products WHERE id = ?',
      [product_id]
    );

    if (products.length === 0) {
      console.log('❌ Produit non trouvé:', product_id);
      return res.status(404).json({ 
        success: false, 
        message: 'Produit non trouvé.' 
      });
    }

    if (products[0].stock < quantite) {
      console.log('❌ Stock insuffisant:', products[0].stock, 'demandé:', quantite);
      return res.status(400).json({ 
        success: false, 
        message: 'Stock insuffisant.' 
      });
    }

    // Vérifier si le produit est déjà dans le panier
    const [existing] = await db.query(
      'SELECT * FROM cart WHERE user_id = ? AND product_id = ?',
      [req.userId, product_id]
    );

    if (existing.length > 0) {
      // Mettre à jour la quantité
      console.log('📝 Mise à jour quantité existante');
      await db.query(
        'UPDATE cart SET quantite = quantite + ? WHERE user_id = ? AND product_id = ?',
        [quantite, req.userId, product_id]
      );
    } else {
      // Ajouter au panier
      console.log('➕ Ajout nouveau produit au panier');
      await db.query(
        'INSERT INTO cart (user_id, product_id, quantite) VALUES (?, ?, ?)',
        [req.userId, product_id, quantite]
      );
    }

    console.log('✅ Produit ajouté au panier avec succès');
    res.json({
      success: true,
      message: 'Produit ajouté au panier'
    });
  } catch (error) {
    console.error('❌ Erreur ajout panier:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur.' 
    });
  }
};

// Modifier la quantité d'un produit
exports.updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantite } = req.body;

    if (quantite < 1) {
      return res.status(400).json({ 
        success: false, 
        message: 'Quantité invalide.' 
      });
    }

    // Vérifier que l'item appartient à l'utilisateur
    const [cartItem] = await db.query(
      'SELECT product_id FROM cart WHERE id = ? AND user_id = ?',
      [id, req.userId]
    );

    if (cartItem.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Article non trouvé dans le panier.' 
      });
    }

    // Vérifier le stock
    const [products] = await db.query(
      'SELECT stock FROM products WHERE id = ?',
      [cartItem[0].product_id]
    );

    if (products[0].stock < quantite) {
      return res.status(400).json({ 
        success: false, 
        message: 'Stock insuffisant.' 
      });
    }

    await db.query(
      'UPDATE cart SET quantite = ? WHERE id = ? AND user_id = ?',
      [quantite, id, req.userId]
    );

    res.json({
      success: true,
      message: 'Quantité mise à jour'
    });
  } catch (error) {
    console.error('Erreur mise à jour panier:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur.' 
    });
  }
};

// Supprimer un produit du panier
exports.removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      'DELETE FROM cart WHERE id = ? AND user_id = ?',
      [id, req.userId]
    );

    res.json({
      success: true,
      message: 'Produit retiré du panier'
    });
  } catch (error) {
    console.error('Erreur suppression panier:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur.' 
    });
  }
};

// Vider le panier
exports.clearCart = async (req, res) => {
  try {
    await db.query('DELETE FROM cart WHERE user_id = ?', [req.userId]);

    res.json({
      success: true,
      message: 'Panier vidé'
    });
  } catch (error) {
    console.error('Erreur vidage panier:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur.' 
    });
  }
};