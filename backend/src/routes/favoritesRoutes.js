// backend/src/routes/favoritesRoutes.js
const express = require('express');
const router = express.Router();
const favoritesController = require('../controllers/favoritesController');
const authMiddleware = require('../middleware/auth');

// Toutes les routes nécessitent une authentification
router.use(authMiddleware);

// Routes des favoris
router.get('/', favoritesController.getFavorites);
router.post('/', favoritesController.addToFavorites);
router.delete('/:product_id', favoritesController.removeFromFavorites);
router.get('/check/:product_id', favoritesController.isFavorite);
router.delete('/', favoritesController.clearFavorites);

module.exports = router;