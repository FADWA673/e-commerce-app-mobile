// backend/src/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const uploadController = require('../controllers/uploadController');

// Routes publiques
router.get('/', productController.getAllProducts);
router.get('/categories', productController.getCategories);
router.get('/brands', productController.getBrands);
router.get('/bestsellers', productController.getBestsellers);
router.get('/new', productController.getNewProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/:id', productController.getProductById);

// Routes d'administration
router.post('/', uploadController.uploadProductImage, productController.createProduct);
router.put('/:id', uploadController.uploadProductImage, productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

// Routes pour les catégories
router.post('/categories', productController.createCategory);
router.put('/categories/:id', productController.updateCategory);
router.delete('/categories/:id', productController.deleteCategory);
router.get('/categories/:id', productController.getCategoryById);
router.get('/categories/:id/brands', productController.getCategoryBrands);

// Routes pour les marques
router.post('/brands', uploadController.uploadBrandLogo, productController.createBrand);
router.put('/brands/:id', uploadController.uploadBrandLogo, productController.updateBrand);
router.delete('/brands/:id', productController.deleteBrand);
router.get('/brands/:id', productController.getBrandById);
router.get('/brands/:brandId/products', productController.getProductsByBrand);

module.exports = router;