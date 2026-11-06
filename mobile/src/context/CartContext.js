// mobile/src/context/CartContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import ApiService from '../services/api';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCart([]);
      setTotal(0);
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      console.log('🔄 Début fetchCart...');
      const response = await ApiService.getCart();
      console.log('📦 Réponse getCart:', response);
      
      const cartItems = response.cart || [];
      
      // Mapper les items du panier pour s'assurer de la cohérence des données
      const mappedCartItems = cartItems.map(item => ({
        ...item,
        // S'assurer que les propriétés essentielles existent
        nom: item.nom || item.product?.nom || 'Produit sans nom',
        prix: parseFloat(item.prix || item.product?.prix || 0),
        quantite: parseInt(item.quantite || 0),
        image_url: item.image_url || item.product?.image_url,
        stock: parseInt(item.stock || item.product?.stock || 0),
        subtotal: parseFloat(item.subtotal || (item.prix * item.quantite) || 0)
      }));
      
      setCart(mappedCartItems);
      
      // Calculer le total avec vérification de sécurité
      const calculatedTotal = mappedCartItems.reduce((sum, item) => {
        const prix = parseFloat(item.prix || 0);
        const quantite = parseInt(item.quantite || 0);
        
        console.log('💰 Calcul item:', {
          id: item.id,
          nom: item.nom,
          prix: prix,
          quantite: quantite,
          subtotal: prix * quantite
        });
        
        return sum + (prix * quantite);
      }, 0);
      setTotal(calculatedTotal);
      
      console.log('✅ Panier chargé:', mappedCartItems.length, 'articles, Total:', calculatedTotal);
      
    } catch (error) {
      console.error('❌ Erreur récupération panier:', error);
      // En cas d'erreur, initialiser un panier vide
      setCart([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      console.log('🛒 Tentative d\'ajout au panier - Produit ID:', productId, 'Quantité:', quantity);
      
      const response = await ApiService.addToCart({ product_id: productId, quantite: quantity });
      
      console.log('📝 Réponse addToCart:', response);
      
      if (response.success) {
        // Recharger le panier pour avoir les données à jour
        console.log('🔄 Rechargement du panier après ajout...');
        await fetchCart();
        return { success: true, message: 'Produit ajouté au panier !' };
      } else {
        return {
          success: false,
          message: response.message || 'Erreur ajout au panier',
        };
      }
    } catch (error) {
      console.error('❌ Erreur addToCart:', error);
      return {
        success: false,
        message: error.message || 'Erreur ajout au panier',
      };
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      await ApiService.updateCartItem(itemId, { quantite: quantity });
      await fetchCart();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Erreur mise à jour',
      };
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      await ApiService.removeCartItem(itemId);
      await fetchCart();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Erreur suppression',
      };
    }
  };

  const clearCart = async () => {
    try {
      await ApiService.clearCart();
      setCart([]);
      setTotal(0);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Erreur vidage panier',
      };
    }
  };

  const getCartCount = () => {
    return cart.reduce((sum, item) => {
      const quantite = item.quantite || 0;
      return sum + parseInt(quantite);
    }, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        total,
        loading,
        fetchCart,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};