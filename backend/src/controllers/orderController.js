// backend/src/controllers/orderController.js
const db = require('../config/database');

// Créer une commande
exports.createOrder = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    const { adresse_livraison } = req.body;

    if (!adresse_livraison) {
      return res.status(400).json({ 
        success: false, 
        message: 'Adresse de livraison requise.' 
      });
    }

    // Commencer la transaction
    await connection.beginTransaction();

    // Récupérer le panier
    const [cartItems] = await connection.query(
      `SELECT c.*, p.prix, p.stock, p.nom
       FROM cart c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = ?`,
      [req.userId]
    );

    if (cartItems.length === 0) {
      await connection.rollback();
      return res.status(400).json({ 
        success: false, 
        message: 'Panier vide.' 
      });
    }

    // Vérifier le stock
    for (const item of cartItems) {
      if (item.stock < item.quantite) {
        await connection.rollback();
        return res.status(400).json({ 
          success: false, 
          message: `Stock insuffisant pour ${item.nom}` 
        });
      }
    }

    // Calculer le total
    const total = cartItems.reduce(
      (sum, item) => sum + (parseFloat(item.prix) * item.quantite), 
      0
    );

    // Créer la commande
    const [orderResult] = await connection.query(
      'INSERT INTO orders (user_id, total, adresse_livraison) VALUES (?, ?, ?)',
      [req.userId, total, adresse_livraison]
    );

    const orderId = orderResult.insertId;

    // Ajouter les items de la commande
    for (const item of cartItems) {
      await connection.query(
        'INSERT INTO order_items (order_id, product_id, quantite, prix) VALUES (?, ?, ?, ?)',
        [orderId, item.product_id, item.quantite, item.prix]
      );

      // Décrémenter le stock
      await connection.query(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [item.quantite, item.product_id]
      );
    }

    // Vider le panier
    await connection.query('DELETE FROM cart WHERE user_id = ?', [req.userId]);

    // Valider la transaction
    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Commande créée avec succès',
      order_id: orderId,
      total: total.toFixed(2)
    });
  } catch (error) {
    await connection.rollback();
    console.error('Erreur création commande:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur.' 
    });
  } finally {
    connection.release();
  }
};

// Obtenir toutes les commandes (pour l'admin)
exports.getAllOrders = async (req, res) => {
  try {
    const { status, limit = 50 } = req.query;
    
    let query = `
      SELECT o.*, u.nom as user_name, u.email as user_email, u.telephone as user_phone
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      query += ' AND o.statut = ?';
      params.push(status);
    }

    query += ' ORDER BY o.created_at DESC LIMIT ?';
    params.push(parseInt(limit));

    const [orders] = await db.query(query, params);

    // Pour chaque commande, récupérer les items
    for (let order of orders) {
      const [items] = await db.query(
        `SELECT oi.*, p.nom as product_name
         FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = ?`,
        [order.id]
      );
      order.items = items;
    }

    res.json({
      success: true,
      orders
    });
  } catch (error) {
    console.error('Erreur récupération commandes:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur.' 
    });
  }
};

// Obtenir les commandes de l'utilisateur connecté
exports.getMyOrders = async (req, res) => {
  try {
    console.log('🔍 Récupération commandes utilisateur:', req.userId);
    
    const [orders] = await db.query(
      `SELECT * FROM orders 
       WHERE user_id = ? 
       ORDER BY created_at DESC`,
      [req.userId]
    );

    // Pour chaque commande, récupérer les items
    for (let order of orders) {
      const [items] = await db.query(
        `SELECT oi.*, p.nom, p.image_url
         FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = ?`,
        [order.id]
      );
      order.items = items;
    }

    console.log('✅ Commandes trouvées:', orders.length);

    res.json({
      success: true,
      orders
    });
  } catch (error) {
    console.error('Erreur historique commandes:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur.' 
    });
  }
};

// Obtenir les commandes d'un utilisateur (pour l'admin)
exports.getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    const [orders] = await db.query(
      `SELECT * FROM orders 
       WHERE user_id = ? 
       ORDER BY created_at DESC`,
      [userId]
    );

    // Pour chaque commande, récupérer les items
    for (let order of orders) {
      const [items] = await db.query(
        `SELECT oi.*, p.nom, p.image_url
         FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = ?`,
        [order.id]
      );
      order.items = items;
    }

    res.json({
      success: true,
      orders
    });
  } catch (error) {
    console.error('Erreur historique commandes:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur.' 
    });
  }
};

// Obtenir les détails d'une commande
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const [orders] = await db.query(
      `SELECT o.*, u.nom as user_name, u.email as user_email, u.telephone as user_phone
       FROM orders o
       JOIN users u ON o.user_id = u.id
       WHERE o.id = ?`,
      [id]
    );

    if (orders.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Commande non trouvée.' 
      });
    }

    const [items] = await db.query(
      `SELECT oi.*, p.nom as product_name, p.image_url
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [id]
    );

    orders[0].items = items;

    res.json({
      success: true,
      order: orders[0]
    });
  } catch (error) {
    console.error('Erreur détails commande:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur.' 
    });
  }
};

// Mettre à jour le statut d'une commande
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { statut } = req.body;

    const validStatuses = ['en_attente', 'validee', 'livree', 'annulee'];
    
    if (!validStatuses.includes(statut)) {
      return res.status(400).json({
        success: false,
        message: 'Statut invalide'
      });
    }

    const [result] = await db.query(
      'UPDATE orders SET statut = ? WHERE id = ?',
      [statut, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Commande non trouvée'
      });
    }

    res.json({
      success: true,
      message: 'Statut mis à jour avec succès'
    });
  } catch (error) {
    console.error('Erreur mise à jour statut:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// Supprimer une commande
exports.deleteOrder = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    const { id } = req.params;

    await connection.beginTransaction();

    // Supprimer les items de la commande
    await connection.query('DELETE FROM order_items WHERE order_id = ?', [id]);

    // Supprimer la commande
    const [result] = await connection.query('DELETE FROM orders WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: 'Commande non trouvée'
      });
    }

    await connection.commit();

    res.json({
      success: true,
      message: 'Commande supprimée avec succès'
    });
  } catch (error) {
    await connection.rollback();
    console.error('Erreur suppression commande:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  } finally {
    connection.release();
  }
};