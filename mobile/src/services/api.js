// mobile/src/services/api.js
import { API_URL } from '../utils/constants';
import { storage } from './storage';

class ApiService {
  // Méthode générique pour les requêtes
  async request(endpoint, options = {}) {
    try {
      const url = `${API_URL}${endpoint}`;
      
      // Récupérer le token pour l'authentification
      const token = await storage.getToken();
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        ...options,
      };

      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur réseau');
      }

      return data;
    } catch (error) {
      console.error('Erreur API:', error);
      throw error;
    }
  }

  // Récupérer tous les produits
  async getProducts(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.category_id) {
        queryParams.append('category_id', params.category_id);
      }
      
      if (params.brand_id) {
        queryParams.append('brand_id', params.brand_id);
      }
      
      if (params.search) {
        queryParams.append('search', params.search);
      }

      if (params.limit) {
        queryParams.append('limit', params.limit);
      }

      const queryString = queryParams.toString();
      const endpoint = `/products${queryString ? `?${queryString}` : ''}`;
      
      console.log('📡 Appel API getProducts:', endpoint);
      console.log('📡 Paramètres:', params);
      const response = await this.request(endpoint);
      console.log('✅ Produits reçus:', response.products?.length || 0);
      
      return response;
    } catch (error) {
      console.error('❌ Erreur API getProducts:', error);
      // Retourner une liste vide au lieu de données mockées
      return { products: [] };
    }
  }
  // Récupérer un produit par ID
  async getProductById(id) {
    try {
      console.log('📡 Appel API getProductById:', id);
      const response = await this.request(`/products/${id}`);
      console.log('✅ Produit reçu:', response.product?.nom || 'Aucun');
      return response;
    } catch (error) {
      console.error('❌ Erreur API getProductById:', error);
      // Retourner null au lieu de lancer une erreur
      return { success: false, product: null, message: error.message };
    }
  }

  // Récupérer toutes les catégories
  async getCategories() {
    try {
      console.log('📡 Appel API getCategories');
      const response = await this.request('/products/categories');
      console.log('✅ Catégories reçues:', response.categories?.length || 0);
      return response;
    } catch (error) {
      console.error('❌ Erreur API getCategories:', error);
      // Retourner une liste vide au lieu de données mockées
      return { categories: [] };
    }
  }

  // Récupérer les marques d'une catégorie
  async getCategoryBrands(categoryId) {
    try {
      console.log('📡 Appel API getCategoryBrands, categoryId:', categoryId);
      const response = await this.request(`/products/categories/${categoryId}/brands`);
      console.log('✅ Marques de catégorie reçues:', response.brands?.length || 0);
      return response;
    } catch (error) {
      console.error('❌ Erreur API getCategoryBrands:', error);
      // Retourner une liste vide au lieu de données mockées
      return { brands: [] };
    }
  }

  // Récupérer toutes les marques
  async getBrands() {
    try {
      console.log('📡 Appel API getBrands');
      const response = await this.request('/products/brands');
      console.log('✅ Marques reçues:', response.brands?.length || 0);
      return response;
    } catch (error) {
      console.error('❌ Erreur API getBrands:', error);
      // Retourner une liste vide au lieu de données mockées
      return { brands: [] };
    }
  }

  // Récupérer les produits populaires (les plus récents pour l'exemple)
  async getPopularProducts(limit = 10) {
    return this.getBestsellers(limit);
  }

  // Récupérer les bestsellers
  async getBestsellers(limit = 10) {
    try {
      console.log('📡 Appel API getBestsellers, limit:', limit);
      const response = await this.request(`/products/bestsellers?limit=${limit}`);
      console.log('✅ Bestsellers reçus:', response.products?.length || 0);
      return response;
    } catch (error) {
      console.error('❌ Erreur API getBestsellers:', error);
      // Retourner une liste vide au lieu de données mockées
      return { products: [] };
    }
  }

  // Récupérer les nouveautés (produits récents)
  async getNewProducts(limit = 10) {
    try {
      console.log('📡 Appel API getNewProducts, limit:', limit);
      const response = await this.request(`/products/new?limit=${limit}`);
      console.log('✅ Nouveautés reçues:', response.products?.length || 0);
      return response;
    } catch (error) {
      console.error('❌ Erreur API getNewProducts:', error);
      // Retourner une liste vide au lieu de données mockées
      return { products: [] };
    }
  }

  // Récupérer les produits en vedette
  async getFeaturedProducts(limit = 10) {
    try {
      console.log('📡 Appel API getFeaturedProducts, limit:', limit);
      const response = await this.request(`/products/featured?limit=${limit}`);
      console.log('✅ Produits vedette reçus:', response.products?.length || 0);
      return response;
    } catch (error) {
      console.error('❌ Erreur API getFeaturedProducts:', error);
      // Retourner une liste vide au lieu de données mockées
      return { products: [] };
    }
  }

  // Récupérer les produits par catégorie
  async getProductsByCategory(categoryId) {
    return this.getProducts({ category_id: categoryId });
  }

  // Rechercher des produits
  async searchProducts(searchTerm) {
    return this.getProducts({ search: searchTerm });
  }

  // === MÉTHODES PANIER ===
  
  // Récupérer le panier
  async getCart() {
    try {
      return await this.request('/cart');
    } catch (error) {
      console.log('API non disponible, utilisation du panier local');
      // Récupérer le panier depuis AsyncStorage
      const cartItems = await storage.getCart();
      const total = cartItems.reduce((sum, item) => sum + (item.product.prix * item.quantite), 0);
      
      return {
        cart: cartItems,
        total: total
      };
    }
  }

  // Méthode pour gérer le panier mocké
  getMockCart() {
    // Dans une vraie app, on utiliserait AsyncStorage
    // Pour l'instant, on utilise une variable globale
    if (!global.mockCart) {
      global.mockCart = [];
      console.log('Initialisation du panier mocké vide');
    }
    console.log('Récupération panier mocké:', global.mockCart.length, 'articles');
    return global.mockCart;
  }

  // Sauvegarder le panier mocké
  saveMockCart(cart) {
    global.mockCart = cart;
    console.log('Sauvegarde panier mocké:', cart.length, 'articles');
  }

  // Ajouter un produit au panier
  async addToCart(data) {
    try {
      return await this.request('/cart', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.log('API non disponible, ajout au panier local');
      
      // Récupérer le produit pour avoir ses détails
      const productResponse = await this.getProductById(data.product_id);
      const product = productResponse.product;
      
      // Récupérer le panier actuel depuis AsyncStorage
      const currentCart = await storage.getCart();
      
      // Vérifier si le produit existe déjà dans le panier
      const existingItemIndex = currentCart.findIndex(item => item.product_id === data.product_id);
      
      if (existingItemIndex >= 0) {
        // Mettre à jour la quantité
        currentCart[existingItemIndex].quantite += data.quantite || 1;
      } else {
        // Ajouter un nouvel item
        const newItem = {
          id: Date.now(), // ID temporaire
          product_id: data.product_id,
          quantite: data.quantite || 1,
          product: {
            id: product.id,
            nom: product.nom,
            prix: product.prix,
            image_url: product.image_url,
            category_name: product.category_name
          }
        };
        currentCart.push(newItem);
      }
      
      // Sauvegarder le panier dans AsyncStorage
      await storage.saveCart(currentCart);
      
      return {
        success: true,
        message: 'Produit ajouté au panier',
        cart: currentCart
      };
    }
  }

  // Mettre à jour un item du panier
  async updateCartItem(itemId, data) {
    try {
      return await this.request(`/cart/${itemId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.log('API non disponible, mise à jour panier local');
      
      const currentCart = await storage.getCart();
      const itemIndex = currentCart.findIndex(item => item.id === itemId);
      
      if (itemIndex >= 0) {
        if (data.quantite <= 0) {
          // Supprimer l'item si quantité <= 0
          currentCart.splice(itemIndex, 1);
        } else {
          // Mettre à jour la quantité
          currentCart[itemIndex].quantite = data.quantite;
        }
        
        await storage.saveCart(currentCart);
        
        return {
          success: true,
          message: 'Panier mis à jour',
          cart: currentCart
        };
      }
      
      throw new Error('Item non trouvé');
    }
  }

  // Supprimer un item du panier
  async removeCartItem(itemId) {
    try {
      return await this.request(`/cart/${itemId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.log('API non disponible, suppression panier local');
      
      const currentCart = await storage.getCart();
      const itemIndex = currentCart.findIndex(item => item.id === itemId);
      
      if (itemIndex >= 0) {
        currentCart.splice(itemIndex, 1);
        await storage.saveCart(currentCart);
        
        return {
          success: true,
          message: 'Produit supprimé du panier',
          cart: currentCart
        };
      }
      
      throw new Error('Item non trouvé');
    }
  }

  // Vider le panier
  async clearCart() {
    try {
      return await this.request('/cart/clear', {
        method: 'DELETE',
      });
    } catch (error) {
      console.log('API non disponible, vidage panier local');
      
      await storage.clearCart();
      
      return {
        success: true,
        message: 'Panier vidé',
        cart: []
      };
    }
  }

  // === MÉTHODES FAVORIS ===
  
  // Récupérer les favoris de l'utilisateur
  async getFavorites() {
    try {
      console.log('📡 Appel API getFavorites');
      const response = await this.request('/favorites');
      console.log('✅ Favoris reçus:', response.favorites?.length || 0);
      return response;
    } catch (error) {
      console.error('❌ Erreur API getFavorites:', error);
      return { favorites: [] };
    }
  }

  // Ajouter un produit aux favoris
  async addToFavorites(productId) {
    try {
      console.log('📡 Appel API addToFavorites:', productId);
      const response = await this.request('/favorites', {
        method: 'POST',
        body: JSON.stringify({ product_id: productId }),
      });
      console.log('✅ Produit ajouté aux favoris');
      return response;
    } catch (error) {
      console.error('❌ Erreur API addToFavorites:', error);
      throw error;
    }
  }

  // Supprimer un produit des favoris
  async removeFromFavorites(productId) {
    try {
      console.log('📡 Appel API removeFromFavorites:', productId);
      const response = await this.request(`/favorites/${productId}`, {
        method: 'DELETE',
      });
      console.log('✅ Produit supprimé des favoris');
      return response;
    } catch (error) {
      console.error('❌ Erreur API removeFromFavorites:', error);
      throw error;
    }
  }

  // Vérifier si un produit est en favoris
  async isFavorite(productId) {
    try {
      const response = await this.request(`/favorites/check/${productId}`);
      return response.isFavorite;
    } catch (error) {
      console.error('❌ Erreur API isFavorite:', error);
      return false;
    }
  }

  // Vider tous les favoris
  async clearFavorites() {
    try {
      console.log('📡 Appel API clearFavorites');
      const response = await this.request('/favorites', {
        method: 'DELETE',
      });
      console.log('✅ Favoris vidés');
      return response;
    } catch (error) {
      console.error('❌ Erreur API clearFavorites:', error);
      throw error;
    }
  }
  
  // Connexion
  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // Inscription
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // === MÉTHODES COMMANDES ===
  
  // Créer une commande
  async createOrder(orderData) {
    try {
      console.log('📡 Appel API createOrder:', orderData);
      const response = await this.request('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
      });
      console.log('✅ Commande créée:', response);
      return response;
    } catch (error) {
      console.error('❌ Erreur API createOrder:', error);
      throw error;
    }
  }

  // Récupérer les commandes de l'utilisateur
  async getUserOrders() {
    try {
      console.log('📡 Appel API getUserOrders');
      const response = await this.request('/orders/user');
      console.log('✅ Commandes utilisateur reçues:', response.orders?.length || 0);
      return response;
    } catch (error) {
      console.error('❌ Erreur API getUserOrders:', error);
      return { orders: [] };
    }
  }

  // Récupérer une commande par ID
  async getOrderById(orderId) {
    try {
      console.log('📡 Appel API getOrderById:', orderId);
      const response = await this.request(`/orders/${orderId}`);
      console.log('✅ Commande reçue:', response.order?.id || 'Aucune');
      return response;
    } catch (error) {
      console.error('❌ Erreur API getOrderById:', error);
      return { success: false, order: null, message: error.message };
    }
  }

  // Changer le mot de passe
  async changePassword(passwordData) {
    try {
      console.log('📡 Appel API changePassword');
      const response = await this.request('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({
          current_password: passwordData.currentPassword,
          new_password: passwordData.newPassword,
        }),
      });
      console.log('✅ Mot de passe changé avec succès');
      return response;
    } catch (error) {
      console.error('❌ Erreur API changePassword:', error);
      return { 
        success: false, 
        message: error.message || 'Erreur lors du changement de mot de passe' 
      };
    }
  }
}

export default new ApiService();