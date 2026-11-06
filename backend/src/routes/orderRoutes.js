// backend/src/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/auth');

// Routes publiques pour l'interface admin (temporaire - à sécuriser en production)
router.get('/admin/all', orderController.getAllOrders);
router.put('/admin/:id/status', orderController.updateOrderStatus);
router.delete('/admin/:id', orderController.deleteOrder);
router.get('/admin/:id', orderController.getOrderById);

// Routes pour l'app mobile (nécessitent authentification)
router.use(authMiddleware);
router.post('/', orderController.createOrder);
router.get('/user', orderController.getMyOrders); // Nouvelle route pour l'utilisateur connecté
router.get('/:id', orderController.getOrderById);

// Routes d'administration (avec auth - pour plus tard)
router.get('/', orderController.getAllOrders);
router.put('/:id/status', orderController.updateOrderStatus);
router.delete('/:id', orderController.deleteOrder);

module.exports = router;