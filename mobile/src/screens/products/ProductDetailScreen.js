// mobile/src/screens/products/ProductDetailScreen.js
import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Dimensions,
} from 'react-native';
import ApiService from '../../services/api';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import { FavoritesContext } from '../../context/FavoritesContext';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import CustomHeader from '../../components/common/CustomHeader';
import ProfessionalIcon from '../../components/common/ProfessionalIcon';
import { COLORS, SIZES, SPACING, getImageUrl } from '../../utils/constants';
import { formatPrice } from '../../utils/formatters';

const { width } = Dimensions.get('window');

const ProductDetailScreen = ({ route, navigation }) => {
  const { productId } = route.params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [scrollY] = useState(new Animated.Value(0));

  const { addToCart } = useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext);
  const { favorites, addToFavorites, removeFromFavorites } = useContext(FavoritesContext);

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const response = await ApiService.getProductById(productId);
      if (response.success && response.product) {
        setProduct(response.product);
      } else {
        console.error('Produit non trouvé:', productId);
        // Rediriger vers la page précédente si le produit n'existe pas
        navigation.goBack();
      }
    } catch (error) {
      console.error('Erreur chargement produit:', error);
      // Rediriger vers la page précédente en cas d'erreur
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      Alert.alert(
        'Connexion requise',
        'Veuillez vous connecter pour ajouter au panier',
        [{ text: 'OK' }]
      );
      return;
    }

    setAddingToCart(true);
    const result = await addToCart(productId, quantity);
    setAddingToCart(false);

    if (result.success) {
      Alert.alert('Succès', 'Produit ajouté au panier', [
        { text: 'Continuer', style: 'cancel' },
        { text: 'Voir le panier', onPress: () => navigation.navigate('Cart') },
      ]);
    } else {
      Alert.alert('Erreur', result.message);
    }
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const isFavorite = favorites.some(fav => fav.id === product?.id);

  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await removeFromFavorites(product.id);
        Alert.alert('Succès', 'Produit supprimé des favoris');
      } else {
        await addToFavorites(product.id);
        Alert.alert('Succès', 'Produit ajouté aux favoris');
      }
    } catch (error) {
      console.error('❌ Erreur toggle favoris:', error);
      Alert.alert('Erreur', error.message || 'Impossible de modifier les favoris');
    }
  };

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  if (loading) return <Loading />;
  if (!product) return null;

  return (
    <SafeAreaView style={styles.container}>
      <Animated.ScrollView
        style={styles.scrollView}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {/* Image du produit */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: getImageUrl(product.image_url) || 'https://via.placeholder.com/400x400/CCCCCC/FFFFFF?text=Produit' }}
            style={styles.image}
            resizeMode="cover"
          />
          
          {/* Boutons overlay - toujours visibles */}
          <View style={styles.imageOverlay}>
            <TouchableOpacity
              style={styles.backButtonOverlay}
              onPress={() => {
                console.log('🔙 Bouton retour cliqué');
                navigation.goBack();
              }}
              activeOpacity={0.8}
            >
              <ProfessionalIcon 
                name="arrow-back-outline"
                type="ionicons"
                size={20}
                color={COLORS.dark}
              />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.favoriteButtonOverlay}
              onPress={() => {
                console.log('❤️ Bouton favoris cliqué, isFavorite:', isFavorite);
                toggleFavorite();
              }}
              activeOpacity={0.8}
            >
              <ProfessionalIcon 
                name={isFavorite ? "heart" : "heart-outline"}
                type="ionicons"
                size={20}
                color={isFavorite ? COLORS.error : COLORS.dark}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Contenu principal */}
        <View style={styles.content}>
          {/* En-tête du produit */}
          <View style={styles.productHeader}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{product.category_name}</Text>
            </View>
            <View style={styles.stockBadge}>
              <Text style={styles.stockText}>
                {product.stock > 0 ? `${product.stock} en stock` : 'Rupture'}
              </Text>
            </View>
          </View>

          <Text style={styles.productName}>{product.nom}</Text>
          
          {/* Section évaluation */}
          <View style={styles.ratingSection}>
            <View style={styles.ratingContainer}>
              <View style={styles.ratingStarsContainer}>
                <ProfessionalIcon 
                  name="star"
                  type="ionicons"
                  size={14}
                  color={COLORS.warning}
                />
                <Text style={styles.ratingText}> 4.90</Text>
              </View>
              <Text style={styles.ratingCount}>(1000+)</Text>
            </View>
            {product.is_bestseller === 1 && (
              <View style={styles.bestsellerBadge}>
                <Text style={styles.bestsellerText}>#1 Bestseller</Text>
              </View>
            )}
          </View>

          <Text style={styles.productPrice}>{formatPrice(product.prix)}</Text>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>

          {/* Spécifications */}
          {product.specifications && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Spécifications</Text>
              <View style={styles.specifications}>
                {product.specifications.map((spec, index) => (
                  <View key={index} style={styles.specRow}>
                    <Text style={styles.specLabel}>{spec.label}</Text>
                    <Text style={styles.specValue}>{spec.value}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Caractéristiques */}
          {product.features && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Caractéristiques</Text>
              <View style={styles.features}>
                {product.features.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <ProfessionalIcon 
                      name="checkmark-outline"
                      type="ionicons"
                      size={14}
                      color={COLORS.success}
                    />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Sélecteur de quantité */}
          {product.stock > 0 && (
            <View style={styles.quantitySection}>
              <Text style={styles.sectionTitle}>Quantité</Text>
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  style={[styles.quantityButton, quantity === 1 && styles.quantityButtonDisabled]}
                  onPress={decrementQuantity}
                  disabled={quantity === 1}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.quantityButtonText, quantity === 1 && styles.quantityButtonTextDisabled]}>−</Text>
                </TouchableOpacity>
                <View style={styles.quantityDisplay}>
                  <Text style={styles.quantityValue}>{quantity}</Text>
                </View>
                <TouchableOpacity
                  style={[styles.quantityButton, quantity >= product.stock && styles.quantityButtonDisabled]}
                  onPress={incrementQuantity}
                  disabled={quantity >= product.stock}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.quantityButtonText, quantity >= product.stock && styles.quantityButtonTextDisabled]}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Espace pour le footer */}
          <View style={styles.footerSpace} />
        </View>
      </Animated.ScrollView>

      {/* Footer fixe */}
      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <View style={styles.priceSection}>
            <Text style={styles.footerPriceLabel}>Total</Text>
            <Text style={styles.footerPrice}>
              {formatPrice(product.prix * quantity)}
            </Text>
          </View>
          <Button
            title={product.stock > 0 ? 'Ajouter au panier' : 'Rupture de stock'}
            onPress={handleAddToCart}
            loading={addingToCart}
            disabled={product.stock === 0}
            style={styles.addToCartButton}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollView: {
    flex: 1,
  },

  // Image du produit élégante
  imageContainer: {
    position: 'relative',
    height: 420,
    backgroundColor: '#FFFFFF',
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F8F9FA',
  },
  imageOverlay: {
    position: 'absolute',
    top: 50, // Ajusté pour être plus visible
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    zIndex: 10, // S'assurer qu'ils sont au-dessus
  },
  backButtonOverlay: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  favoriteButtonOverlay: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },

  // Contenu principal élégant
  content: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -32,
    paddingTop: SPACING.xl + SPACING.sm,
    paddingHorizontal: SPACING.xl,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  categoryBadge: {
    backgroundColor: COLORS.primary + '15',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: COLORS.primary + '30',
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  stockBadge: {
    backgroundColor: COLORS.success + '15',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: COLORS.success + '30',
  },
  stockText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.success,
    letterSpacing: 0.3,
  },
  productName: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.dark,
    marginBottom: SPACING.sm,
    lineHeight: 26,
    letterSpacing: -0.3,
  },
  // Section évaluation
  ratingSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingStarsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.xs,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF9500',
    marginLeft: 4,
  },
  ratingCount: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  bestsellerBadge: {
    backgroundColor: '#FF9500',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  bestsellerText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.white,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  productPrice: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: SPACING.lg,
    letterSpacing: -0.3,
  },

  // Sections élégantes
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.dark,
    marginBottom: SPACING.md,
    letterSpacing: -0.2,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    fontWeight: '400',
  },

  // Spécifications élégantes
  specifications: {
    backgroundColor: '#FAFBFC',
    borderRadius: 12,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#F0F2F5',
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EAED',
  },
  specLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#666',
    flex: 1,
  },
  specValue: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.dark,
    flex: 1,
    textAlign: 'right',
  },

  // Caractéristiques élégantes
  features: {
    gap: SPACING.sm,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFBFC',
    padding: SPACING.md,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F0F2F5',
  },
  featureText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.dark,
    flex: 1,
    lineHeight: 18,
    marginLeft: SPACING.sm,
  },

  // Sélecteur de quantité élégant
  quantitySection: {
    marginBottom: SPACING.lg,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFBFC',
    borderRadius: 20,
    padding: SPACING.sm,
    borderWidth: 1,
    borderColor: '#F0F2F5',
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: '#F0F2F5',
  },
  quantityButtonDisabled: {
    backgroundColor: '#F5F6F7',
    elevation: 0,
    borderColor: '#E8EAED',
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
  },
  quantityButtonTextDisabled: {
    color: '#BCC1C6',
  },
  quantityDisplay: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    marginHorizontal: SPACING.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: '#F0F2F5',
  },
  quantityValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.dark,
    textAlign: 'center',
    minWidth: 24,
  },

  // Footer élégant
  footerSpace: {
    height: 100,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F2F5',
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  priceSection: {
    flex: 1,
    marginRight: SPACING.lg,
  },
  footerPriceLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  footerPrice: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: -0.3,
  },
  addToCartButton: {
    flex: 2,
    borderRadius: 20,
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});

export default ProductDetailScreen;