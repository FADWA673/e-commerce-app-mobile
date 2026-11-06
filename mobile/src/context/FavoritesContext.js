// mobile/src/context/FavoritesContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiService from '../services/api';
import { AuthContext } from './AuthContext';

const FAVORITES_KEY = '@ecommerce_favorites';

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (isAuthenticated) {
      loadFavoritesFromAPI();
    } else {
      loadFavoritesFromStorage();
    }
  }, [isAuthenticated]);

  // Charger favoris depuis l'API (utilisateur connecté)
  const loadFavoritesFromAPI = async () => {
    try {
      setLoading(true);
      console.log('🔄 Chargement favoris depuis API...');
      
      const response = await ApiService.getFavorites();
      const apiProducts = response.favorites || [];
      
      console.log('📦 Favoris API reçus:', apiProducts.length);
      
      setFavoriteProducts(apiProducts);
      
      // Extraire les IDs pour la compatibilité
      const favoriteIds = apiProducts.map(product => product.id);
      setFavorites(favoriteIds);
      
      // Sauvegarder localement pour le cache
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favoriteIds));
      
    } catch (error) {
      console.error('❌ Erreur chargement favoris API:', error);
      // Fallback vers le stockage local
      await loadFavoritesFromStorage();
    } finally {
      setLoading(false);
    }
  };

  // Charger favoris depuis AsyncStorage (utilisateur non connecté)
  const loadFavoritesFromStorage = async () => {
    try {
      setLoading(true);
      console.log('🔄 Chargement favoris depuis stockage local...');
      
      const savedFavorites = await AsyncStorage.getItem(FAVORITES_KEY);
      if (savedFavorites) {
        const parsedFavorites = JSON.parse(savedFavorites);
        setFavorites(parsedFavorites);
        
        // Charger les détails des produits
        await loadFavoriteProducts(parsedFavorites);
      } else {
        setFavorites([]);
        setFavoriteProducts([]);
      }
    } catch (error) {
      console.error('❌ Erreur chargement favoris locaux:', error);
      setFavorites([]);
      setFavoriteProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const loadFavoriteProducts = async (favoriteIds) => {
    try {
      const products = [];
      for (const productId of favoriteIds) {
        try {
          const response = await ApiService.getProductById(productId);
          if (response.success && response.product) {
            products.push(response.product);
          }
        } catch (error) {
          console.log(`Erreur chargement produit ${productId}:`, error);
        }
      }
      setFavoriteProducts(products);
    } catch (error) {
      console.error('Erreur chargement produits favoris:', error);
    }
  };

  const addToFavorites = async (productId) => {
    try {
      console.log('❤️ Ajout aux favoris:', productId);
      
      if (favorites.includes(productId)) {
        console.log('Produit déjà en favoris');
        return;
      }

      if (isAuthenticated) {
        // Utilisateur connecté : utiliser l'API
        console.log('🔐 Utilisateur connecté, utilisation API...');
        await ApiService.addToFavorites(productId);
        console.log('✅ Favori ajouté via API');
        
        // Recharger depuis l'API pour synchroniser
        await loadFavoritesFromAPI();
      } else {
        // Utilisateur non connecté : stockage local
        console.log('📱 Utilisateur non connecté, stockage local...');
        const newFavorites = [...favorites, productId];
        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
        setFavorites(newFavorites);
        
        // Charger le produit
        const response = await ApiService.getProductById(productId);
        if (response.success && response.product) {
          setFavoriteProducts(prev => [...prev, response.product]);
        }
        
        console.log('✅ Favori ajouté localement');
      }
    } catch (error) {
      console.error('❌ Erreur ajout favoris:', error);
      
      // Messages d'erreur plus spécifiques
      let errorMessage = 'Impossible d\'ajouter aux favoris';
      if (error.message?.includes('401')) {
        errorMessage = 'Veuillez vous reconnecter';
      } else if (error.message?.includes('Network')) {
        errorMessage = 'Problème de connexion réseau';
      } else if (error.message?.includes('500')) {
        errorMessage = 'Erreur serveur, réessayez plus tard';
      }
      
      throw new Error(errorMessage);
    }
  };

  const removeFromFavorites = async (productId) => {
    try {
      console.log('💔 Suppression des favoris:', productId);
      
      if (isAuthenticated) {
        // Utilisateur connecté : utiliser l'API
        await ApiService.removeFromFavorites(productId);
        console.log('✅ Favori supprimé via API');
        
        // Recharger depuis l'API pour synchroniser
        await loadFavoritesFromAPI();
      } else {
        // Utilisateur non connecté : stockage local
        const newFavorites = favorites.filter(id => id !== productId);
        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
        setFavorites(newFavorites);
        setFavoriteProducts(prev => prev.filter(product => product.id !== productId));
        
        console.log('✅ Favori supprimé localement');
      }
    } catch (error) {
      console.error('❌ Erreur suppression favoris:', error);
      throw error;
    }
  };

  const toggleFavorite = async (productId) => {
    if (isFavorite(productId)) {
      await removeFromFavorites(productId);
    } else {
      await addToFavorites(productId);
    }
  };

  const isFavorite = (productId) => {
    return favorites.includes(productId);
  };

  const getFavoritesCount = () => {
    return favorites.length;
  };

  const clearFavorites = async () => {
    try {
      if (isAuthenticated) {
        await ApiService.clearFavorites();
        await loadFavoritesFromAPI();
      } else {
        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify([]));
        setFavorites([]);
        setFavoriteProducts([]);
      }
    } catch (error) {
      console.error('❌ Erreur vidage favoris:', error);
      throw error;
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites: favoriteProducts, // Retourner les produits complets
        favoriteIds: favorites, // Garder les IDs pour les vérifications
        loading,
        addToFavorites,
        removeFromFavorites,
        toggleFavorite,
        isFavorite,
        getFavoritesCount,
        clearFavorites,
        refreshFavorites: isAuthenticated ? loadFavoritesFromAPI : loadFavoritesFromStorage,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};