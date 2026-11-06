// mobile/src/components/products/ProductCardSidebar.js
import React, { useState, useContext } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { COLORS, SIZES, SPACING } from '../../utils/constants';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import { FavoritesContext } from '../../context/FavoritesContext';
import { formatPrice } from '../../utils/formatters';

const ProductCardSidebar = ({ product, onPress, onAddToCart }) => {
  const [addingToCart, setAddingToCart] = useState(false);
  
  const { addToCart } = useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext);
  const { toggleFavorite, isFavorite } = useContext(FavoritesContext);

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      Alert.alert(
        'Connexion requise',
        'Veuillez vous connecter pour ajouter au panier'
      );
      return;
    }

    if (product.stock === 0) {
      Alert.alert('Rupture de stock', 'Ce produit n\'est plus disponible');
      return;
    }

    setAddingToCart(true);
    try {
      const result = await addToCart(product.id, 1);
      if (result.success) {
        Alert.alert('Succès', 'Produit ajouté au panier !');
        if (onAddToCart) onAddToCart(product);
      } else {
        Alert.alert('Erreur', result.message);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'ajouter au panier');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleFavoriteToggle = async (e) => {
    e.stopPropagation();
    await toggleFavorite(product.id);
  };

  const isProductFavorite = isFavorite(product.id);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      {/* Layout horizontal pour sidebar */}
      <View style={styles.imageContainer}>
        <Image
          source={{ 
            uri: product.image_url || 'https://via.placeholder.com/120x120/CCCCCC/FFFFFF?text=Produit'
          }}
          style={styles.image}
          resizeMode="cover"
        />
        
        {/* Overlay pour rupture de stock */}
        {product.stock === 0 && (
          <View style={styles.outOfStockOverlay}>
            <Text style={styles.outOfStockText}>Rupture</Text>
          </View>
        )}
      </View>
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.category}>{product.category_name}</Text>
          <TouchableOpacity 
            style={styles.favoriteButton}
            onPress={handleFavoriteToggle}
            activeOpacity={0.8}
          >
            <Text style={styles.favoriteIcon}>
              {isProductFavorite ? '❤️' : '🤍'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.name} numberOfLines={2}>
          {product.nom}
        </Text>
        
        <View style={styles.priceRow}>
          <Text style={styles.price}>{formatPrice(product.prix)}</Text>
          <Text style={styles.stock}>
            {product.stock > 0 ? `${product.stock} en stock` : 'Rupture'}
          </Text>
        </View>

        {/* Bouton Ajouter au panier */}
        <TouchableOpacity 
          style={[
            styles.addToCartButton,
            product.stock === 0 && styles.addToCartButtonDisabled,
            addingToCart && styles.addToCartButtonLoading
          ]}
          onPress={handleAddToCart}
          disabled={product.stock === 0 || addingToCart}
          activeOpacity={0.8}
        >
          <Text style={styles.addToCartIcon}>🛒</Text>
          <Text style={styles.addToCartText}>
            {addingToCart ? 'Ajout...' : product.stock === 0 ? 'Rupture' : 'Ajouter'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginBottom: SPACING.md,
    marginHorizontal: SPACING.sm,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    flexDirection: 'row',
    minHeight: 120,
  },
  imageContainer: {
    position: 'relative',
    width: 120,
    height: 120,
    backgroundColor: '#F8F9FA',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  outOfStockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outOfStockText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: SPACING.sm,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.xs,
  },
  category: {
    fontSize: 10,
    color: COLORS.primary,
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: 0.5,
    flex: 1,
  },
  favoriteButton: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  favoriteIcon: {
    fontSize: 14,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.dark,
    marginBottom: SPACING.xs,
    lineHeight: 18,
    flex: 1,
  },
  priceRow: {
    marginBottom: SPACING.sm,
  },
  price: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 2,
  },
  stock: {
    fontSize: 10,
    color: COLORS.gray,
    fontWeight: '500',
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: 20,
    elevation: 2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  addToCartButtonDisabled: {
    backgroundColor: COLORS.gray,
    elevation: 0,
    shadowOpacity: 0,
  },
  addToCartButtonLoading: {
    backgroundColor: COLORS.secondary,
  },
  addToCartIcon: {
    fontSize: 12,
    marginRight: SPACING.xs,
  },
  addToCartText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
});

export default ProductCardSidebar;