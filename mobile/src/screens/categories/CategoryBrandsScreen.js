// mobile/src/screens/categories/CategoryBrandsScreen.js
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
import CustomHeader from '../../components/common/CustomHeader';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - SPACING.xl * 3) / 2;

const CategoryBrandsScreen = ({ route }) => {
  const navigation = useNavigation();
  const { category } = route.params;
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadBrandsForCategory();
  }, [category.id]);

  const loadBrandsForCategory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Récupérer toutes les marques
      const brandsResponse = await ApiService.getBrands();
      
      // Récupérer les produits de cette catégorie pour filtrer les marques
      const productsResponse = await ApiService.getProducts({ category_id: category.id });
      
      if (brandsResponse.brands && productsResponse.products) {
        // Filtrer les marques qui ont des produits dans cette catégorie
        const categoryBrandIds = [...new Set(
          productsResponse.products
            .filter(product => product.brand_id)
            .map(product => product.brand_id)
        )];
        
        const filteredBrands = brandsResponse.brands.filter(brand => 
          categoryBrandIds.includes(brand.id)
        );
        
        // Ajouter le nombre de produits pour chaque marque
        const brandsWithCount = filteredBrands.map(brand => ({
          ...brand,
          productCount: productsResponse.products.filter(p => p.brand_id === brand.id).length
        }));
        
        setBrands(brandsWithCount);
      }
    } catch (error) {
      console.error('Erreur chargement marques:', error);
      setError('Impossible de charger les marques');
    } finally {
      setLoading(false);
    }
  };

  const handleBrandPress = (brand) => {
    navigation.navigate('BrandProducts', {
      brand,
      category,
    });
  };

  const renderBrandItem = ({ item: brand }) => (
    <TouchableOpacity
      style={styles.brandCard}
      onPress={() => handleBrandPress(brand)}
      activeOpacity={0.8}
    >
      <View style={styles.brandImageContainer}>
        <Image
          source={{ 
            uri: getImageUrl(brand.logo_url) || 'https://via.placeholder.com/80x80/CCCCCC/FFFFFF?text=' + brand.nom.charAt(0)
          }}
          style={styles.brandImage}
          resizeMode="contain"
        />
      </View>
      
      <View style={styles.brandInfo}>
        <Text style={styles.brandName} numberOfLines={1}>
          {brand.nom}
        </Text>
        <Text style={styles.brandDescription} numberOfLines={2}>
          {brand.description || 'Marque de qualité'}
        </Text>
        <View style={styles.productCountContainer}>
          <Text style={styles.productCount}>
            {brand.productCount} produit{brand.productCount > 1 ? 's' : ''}
          </Text>
        </View>
      </View>
      
      <View style={styles.arrowContainer}>
        <Text style={styles.arrow}>→</Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🏷️</Text>
      <Text style={styles.emptyTitle}>Aucune marque disponible</Text>
      <Text style={styles.emptyText}>
        Il n'y a pas encore de marques pour cette catégorie.
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.professionalHeader}>
          <View style={styles.headerTop}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
            
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>Marques</Text>
              <Text style={styles.headerSubtitle}>Chargement...</Text>
            </View>
            
            <View style={styles.searchButton} />
          </View>
        </View>
        
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Chargement des marques...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header professionnel amélioré */}
      <View style={styles.professionalHeader}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Marques</Text>
            <Text style={styles.headerSubtitle}>
              {category?.name || 'Catégorie sélectionnée'}
            </Text>
          </View>
          
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => navigation.navigate('Products', { screen: 'ProductList' })}
            activeOpacity={0.7}
          >
            <Text style={styles.searchIcon}>⌕</Text>
          </TouchableOpacity>
        </View>
        
        {/* Indicateur de catégorie */}
        <View style={styles.categoryIndicator}>
          <Text style={styles.categoryName}>
            {category?.name || 'Toutes les marques'}
          </Text>
          <View style={styles.brandCount}>
            <Text style={styles.brandCountText}>
              {brands.length} marque{brands.length > 1 ? 's' : ''}
            </Text>
          </View>
        </View>
      </View>

      {/* Liste des marques */}
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={loadBrandsForCategory}
          >
            <Text style={styles.retryText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={brands}
            renderItem={renderBrandItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            contentContainerStyle={styles.listContainer}
            columnWrapperStyle={styles.row}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={renderEmptyState}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },

  // Header professionnel
  professionalHeader: {
    backgroundColor: COLORS.primary,
    paddingTop: 50, // Pour le status bar
    paddingBottom: SPACING.lg,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 20,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: SPACING.md,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
    marginTop: 2,
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchIcon: {
    fontSize: 18,
  },
  categoryIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginHorizontal: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  categoryName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
    letterSpacing: -0.3,
  },
  brandCount: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 15,
  },
  brandCountText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.white,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Liste améliorée
  listContainer: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  row: {
    justifyContent: 'space-between',
  },

  // Cartes de marque redesignées
  brandCard: {
    width: ITEM_WIDTH,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#F0F2F5',
    position: 'relative',
    overflow: 'hidden',
  },
  brandImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: SPACING.md,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  brandImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  brandInfo: {
    flex: 1,
    alignItems: 'center',
  },
  brandName: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.dark,
    textAlign: 'center',
    marginBottom: SPACING.xs,
    letterSpacing: -0.3,
  },
  brandDescription: {
    fontSize: 13,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: SPACING.md,
    lineHeight: 18,
    paddingHorizontal: SPACING.xs,
  },
  productCountContainer: {
    backgroundColor: COLORS.primary + '15',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.primary + '30',
  },
  productCount: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '700',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  arrowContainer: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    backgroundColor: COLORS.primary + '20',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: 'bold',
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

export default CategoryBrandsScreen;