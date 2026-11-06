// mobile/src/components/products/ProductCard.js
import React, { useState, useContext } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { COLORS, SIZES, SPACING } from '../../utils/constants';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import { FavoritesContext } from '../../context/FavoritesContext';

const ProductCard = ({ product, onPress, onAddToCart }) => {
  const [addingToCart, setAddingToCart] = useState(false);
  
  const { addToCart } = useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext);
  const { toggleFavorite, isFavorite } = useContext(FavoritesContext);

  const handleAddToCart = async (e) => {
    e.stopPropagation(); // Empêcher la navigation vers les détails
    
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
      <View style={styles.imageContainer}>
        <Image
          source={{ 
            uri: product.image || product.image_url || 'https://via.placeholder.com/200x200/CCCCCC/FFFFFF?text=Produit'
          }}
          style={styles.image}
          resizeMode="cover"
          onError={(error) => {
            console.log('❌ Erreur chargement image ProductCard:', product.image || product.image_url, error.nativeEvent.error);
          }}
          onLoad={() => {
            console.log('✅ Image ProductCard chargée:', product.image || product.image_url);
          }}
        />
        
        {/* Bouton Favoris */}
        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={handleFavoriteToggle}
          activeOpacity={0.8}
        >
          <Text style={[styles.favoriteIcon, isProductFavorite && styles.favoriteIconActive]}>
            {isProductFavorite ? '❤️' : '🤍'}
          </Text>
        </TouchableOpacity>

        {/* Badges de stock */}
        {product.stock < 10 && product.stock > 0 && (
          <View style={styles.lowStockBadge}>
            <Text style={styles.lowStockText}>Stock limité</Text>
          </View>
        )}
        {product.stock === 0 && (
          <View style={styles.outOfStockOverlay}>
            <Text style={styles.outOfStockText}>Rupture de stock</Text>
          </View>
        )}
      </View>
      
      <View style={styles.content}>
        <Text style={styles.category}>{product.category_name}</Text>
        <Text style={styles.name} numberOfLines={2}>
          {product.nom}
        </Text>
        
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{product.prix} DH</Text>
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
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 140,
    backgroundColor: '#F8F9FA',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    backgroundColor: 'rgba(255,255,255,0.9)',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  favoriteIcon: {
    fontSize: 20,
  },
  favoriteIconActive: {
    transform: [{ scale: 1.1 }],
  },
  lowStockBadge: {
    position: 'absolute',
    top: SPACING.sm,
    left: SPACING.sm,
    backgroundColor: COLORS.warning,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  lowStockText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  outOfStockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outOfStockText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  content: {
    padding: SPACING.sm,
  },
  category: {
    fontSize: 11,
    color: COLORS.primary,
    textTransform: 'uppercase',
    fontWeight: '700',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.dark,
    marginBottom: SPACING.sm,
    minHeight: 36,
    lineHeight: 18,
  },
  priceContainer: {
    marginBottom: SPACING.md,
  },
  price: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 2,
  },
  stock: {
    fontSize: 11,
    color: COLORS.gray,
    fontWeight: '500',
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: 25,
    elevation: 3,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
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
    fontSize: 16,
    marginRight: SPACING.xs,
  },
  addToCartText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

export default ProductCard;