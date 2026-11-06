// mobile/src/screens/brands/BrandProductsScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Image,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SIZES, SPACING, getImageUrl } from '../../utils/constants';
import ApiService from '../../services/api';
import HomeService from '../../services/homeService';
import { formatPrice } from '../../utils/formatters';
import CustomHeader from '../../components/common/CustomHeader';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - SPACING.xl * 3) / 2;

const BrandProductsScreen = ({ route }) => {
  const navigation = useNavigation();
  const { brand, category } = route.params;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadBrandProducts();
  }, [brand.id, category.id]);

  const loadBrandProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Chargement produits pour marque:', brand.nom, 'ID:', brand.id);
      console.log('🔍 Dans catégorie:', category.name, 'ID:', category.id);
      
      // Récupérer les produits de cette marque dans cette catégorie
      const response = await ApiService.getProducts({ 
        category_id: category.id,
        brand_id: brand.id 
      });
      
      console.log('📦 Produits reçus:', response.products?.length || 0);
      
      if (response.products) {
        // Mapper les produits pour l'UI
        const mappedProducts = HomeService.mapProductsToUI(response.products);
        console.log('✅ Produits mappés:', mappedProducts.length);
        setProducts(mappedProducts);
      }
    } catch (error) {
      console.error('Erreur chargement produits marque:', error);
      setError('Impossible de charger les produits');
    } finally {
      setLoading(false);
    }
  };

  const handleProductPress = (product) => {
    navigation.navigate('ProductDetail', { productId: product.id });
  };

  const renderProductItem = ({ item: product }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => handleProductPress(product)}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ 
            uri: product.image || 'https://via.placeholder.com/200x200/CCCCCC/FFFFFF?text=Produit'
          }}
          style={styles.productImage}
          resizeMode="cover"
        />
        {product.isNew && (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>NOUVEAU</Text>
          </View>
        )}
        {product.isBestseller && (
          <View style={styles.bestsellerBadge}>
            <Text style={styles.bestsellerText}>★</Text>
          </View>
        )}
      </View>
      
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.productPrice}>
          {formatPrice(product.price)}
        </Text>
        <View style={styles.ratingContainer}>
          <View style={styles.ratingSection}>
            <Text style={styles.ratingText}>⭐ {product.rating || '4.5'}</Text>
          </View>
          <View style={styles.stockSection}>
            <Text style={[
              styles.stockText,
              { color: product.stock > 0 ? COLORS.success : COLORS.danger }
            ]}>
              {product.stock > 0 ? `${product.stock} en stock` : 'Rupture'}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📦</Text>
      <Text style={styles.emptyTitle}>Aucun produit disponible</Text>
      <Text style={styles.emptyText}>
        Il n'y a pas encore de produits {brand.nom} dans la catégorie {category.name}.
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <CustomHeader
          title="Chargement..."
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Chargement des produits...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header personnalisé avec logo de marque */}
      <CustomHeader
        title={brand.nom}
        rightComponent={
          <Image
            source={{ 
              uri: getImageUrl(brand.logo_url) || 'https://via.placeholder.com/32x32/CCCCCC/FFFFFF?text=' + brand.nom.charAt(0)
            }}
            style={styles.brandLogoHeader}
            resizeMode="contain"
          />
        }
      />

      {/* Breadcrumb */}
      <View style={styles.breadcrumb}>
        <TouchableOpacity onPress={() => navigation.navigate('Home', { screen: 'HomeMain' })}>
          <Text style={styles.breadcrumbText}>Accueil</Text>
        </TouchableOpacity>
        <Text style={styles.breadcrumbSeparator}> › </Text>
        <TouchableOpacity onPress={() => navigation.navigate('CategoryBrands', { category })}>
          <Text style={styles.breadcrumbText}>{category.name}</Text>
        </TouchableOpacity>
        <Text style={styles.breadcrumbSeparator}> › </Text>
        <Text style={styles.breadcrumbActive}>{brand.nom}</Text>
      </View>

      {/* Statistiques */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{products.length}</Text>
          <Text style={styles.statLabel}>Produit{products.length > 1 ? 's' : ''}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {products.filter(p => p.stock > 0).length}
          </Text>
          <Text style={styles.statLabel}>Disponible{products.filter(p => p.stock > 0).length > 1 ? 's' : ''}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {products.filter(p => p.isNew).length}
          </Text>
          <Text style={styles.statLabel}>Nouveauté{products.filter(p => p.isNew).length > 1 ? 's' : ''}</Text>
        </View>
      </View>

      {/* Liste des produits */}
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={loadBrandProducts}
          >
            <Text style={styles.retryText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  
  // Logo de marque dans le header
  brandLogoHeader: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.light,
  },

  // Breadcrumb amélioré
  breadcrumb: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F5',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  breadcrumbText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  breadcrumbSeparator: {
    fontSize: 14,
    color: COLORS.gray,
    marginHorizontal: 4,
  },
  breadcrumbActive: {
    fontSize: 14,
    color: COLORS.dark,
    fontWeight: '700',
  },

  // Statistiques redesignées
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.lg,
    marginVertical: SPACING.sm,
    marginHorizontal: SPACING.md,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.gray,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E8EAED',
    marginVertical: SPACING.sm,
  },

  // Liste améliorée
  listContainer: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  row: {
    justifyContent: 'space-between',
  },

  // Cartes produits redesignées
  productCard: {
    width: ITEM_WIDTH,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    marginBottom: SPACING.lg,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 140, // Plus grand pour une meilleure présentation
  },
  productImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F8F9FA',
  },
  newBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: COLORS.danger,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    elevation: 2,
  },
  newBadgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  bestsellerBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    elevation: 2,
  },
  bestsellerText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '700',
  },
  productInfo: {
    padding: SPACING.md,
  },
  productName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.dark,
    marginBottom: 8,
    lineHeight: 20,
    letterSpacing: -0.2,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: '#FF9500',
    fontWeight: '600',
  },
  stockSection: {
    alignItems: 'flex-end',
  },
  stockText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },

  // États vides et erreurs améliorés
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  loadingText: {
    marginTop: SPACING.lg,
    fontSize: 16,
    color: COLORS.gray,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: SPACING.xl,
    opacity: 0.6,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.dark,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: SPACING.lg,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.danger,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: 25,
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  retryText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 16,
  },
});

export default BrandProductsScreen;