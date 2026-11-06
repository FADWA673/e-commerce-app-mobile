// backend/src/routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middleware/auth');

// Toutes les routes sont protégées
router.use(authMiddleware);

router.get('/', cartController.getCart);
router.post('/', cartController.addToCart); // Changé de /add vers /
router.put('/:id', cartController.updateCartItem);
router.delete('/:id', cartController.removeFromCart);
router.delete('/clear', cartController.clearCart); // Ajouté la route clear

module.exports = router;