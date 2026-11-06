// mobile/src/services/storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@ecommerce_token';
const USER_KEY = '@ecommerce_user';
const CART_KEY = '@ecommerce_cart';

export const storage = {
  // Token
  async saveToken(token) {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    } catch (error) {
      console.error('Erreur sauvegarde token:', error);
    }
  },

  async getToken() {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error('Erreur récupération token:', error);
      return null;
    }
  },

  async removeToken() {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
    } catch (error) {
      console.error('Erreur suppression token:', error);
    }
  },

  // User
  async saveUser(user) {
    try {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Erreur sauvegarde user:', error);
    }
  },

  async getUser() {
    try {
      const user = await AsyncStorage.getItem(USER_KEY);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Erreur récupération user:', error);
      return null;
    }
  },

  async removeUser() {
    try {
      await AsyncStorage.removeItem(USER_KEY);
    } catch (error) {
      console.error('Erreur suppression user:', error);
    }
  },

  // Cart
  async saveCart(cart) {
    try {
      await AsyncStorage.setItem(CART_KEY, JSON.stringify(cart));
      console.log('Panier sauvegardé:', cart.length, 'articles');
    } catch (error) {
      console.error('Erreur sauvegarde panier:', error);
    }
  },

  async getCart() {
    try {
      const cart = await AsyncStorage.getItem(CART_KEY);
      const parsedCart = cart ? JSON.parse(cart) : [];
      console.log('Panier récupéré:', parsedCart.length, 'articles');
      return parsedCart;
    } catch (error) {
      console.error('Erreur récupération panier:', error);
      return [];
    }
  },

  async clearCart() {
    try {
      await AsyncStorage.removeItem(CART_KEY);
      console.log('Panier vidé');
    } catch (error) {
      console.error('Erreur vidage panier:', error);
    }
  },

  // Tout supprimer
  async clearAll() {
    try {
      await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY, CART_KEY]);
    } catch (error) {
      console.error('Erreur suppression storage:', error);
    }
  },
};