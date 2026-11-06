// mobile/src/services/homeService.js
import ApiService from './api';
import { mapProductsToUI } from '../utils/productMapper';

class HomeService {
  // Récupérer toutes les données nécessaires pour la page d'accueil
  async getHomeData() {
    try {
      const [categoriesResponse, popularProductsResponse, newProductsResponse] = await Promise.all([
        ApiService.getCategories(),
        ApiService.getPopularProducts(6), // Limiter à 6 produits populaires
        ApiService.getNewProducts(6), // Limiter à 6 nouveautés
      ]);

      return {
        categories: categoriesResponse.categories || [],
        popularProducts: popularProductsResponse.products || [],
        newProducts: newProductsResponse.products || [],
      };
    } catch (error) {
      console.error('Erreur lors du chargement des données d\'accueil:', error);
      throw error;
    }
  }

  // Mapper les catégories de la DB vers le format attendu par l'UI
  mapCategoriesToUI(categories) {
    const categoryIcons = {
      'Électronique': { name: 'phone-portrait-outline', type: 'ionicons' },
      'Vêtements': { name: 'shirt-outline', type: 'ionicons' },
      'Maison': { name: 'home-outline', type: 'ionicons' },
      'Sport': { name: 'football-outline', type: 'ionicons' },
      'Livres': { name: 'book-outline', type: 'ionicons' },
      'Beauté': { name: 'color-palette-outline', type: 'ionicons' },
      'Alimentation': { name: 'nutrition-outline', type: 'ionicons' },
      'Accessoires': { name: '🛒', type: 'emoji' },
    };

    const categoryColors = [
      '#FF6B6B', // Rouge
      '#4ECDC4', // Turquoise
      '#FFE66D', // Jaune
      '#3498DB', // Bleu
      '#2ECC71', // Vert
      '#F39C12', // Orange
      '#9B59B6', // Violet
      '#E74C3C', // Rouge foncé
    ];

    return categories.map((category, index) => ({
      id: category.id,
      name: category.nom,
      icon: categoryIcons[category.nom] || { name: 'cube-outline', type: 'ionicons' },
      color: categoryColors[index % categoryColors.length],
      description: category.description,
    }));
  }

  // Mapper les produits de la DB vers le format attendu par l'UI
  mapProductsToUI(products) {
    return mapProductsToUI(products);
  }

  // Vérifier si un produit est récent (moins de 30 jours)
  isNewProduct(createdAt) {
    const productDate = new Date(createdAt);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return productDate > thirtyDaysAgo;
  }

  // Générer une note aléatoire (en attendant un vrai système de notation)
  generateRandomRating() {
    return (Math.random() * 2 + 3).toFixed(1); // Entre 3.0 et 5.0
  }
}

export default new HomeService();