// mobile/src/screens/products/ProductListScreen.js
import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import ApiService from '../../services/api';
import { CartContext } from '../../context/CartContext';
import ProductCard from '../../components/products/ProductCard';
import Loading from '../../components/common/Loading';
import FilterModal from '../../components/products/FilterModal';
import ProfessionalIcon from '../../components/common/ProfessionalIcon';
import { useTheme } from '../../context/ThemeContext';
import { COLORS, SIZES, SPACING } from '../../utils/constants';
import { mapProductsToUI } from '../../utils/productMapper';

const ProductListScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({});

  // Récupérer les paramètres de navigation depuis la page d'accueil
  const { 
    categoryId, 
    categoryName, 
    brandId, 
    brandName, 
    title,
    searchQuery: initialSearchQuery 
  } = route.params || {};

  const { getCartCount } = useContext(CartContext);

  // Référence pour le FlatList des catégories (auto-scroll)
  const categoriesRef = useRef(null);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);

  useEffect(() => {
    // Initialiser avec les paramètres de navigation
    if (categoryId) {
      setSelectedCategory(categoryId);
    }
    if (initialSearchQuery) {
      setSearchQuery(initialSearchQuery);
    }
  }, [categoryId, initialSearchQuery]);

  useEffect(() => {
    fetchData();
  }, [selectedCategory, searchQuery, brandId]);

  // Auto-scroll des catégories
  useEffect(() => {
    if (categories.length > 0) {
      const interval = setInterval(() => {
        setCurrentCategoryIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % (categories.length + 1); // +1 pour inclure "TOUTES"
          
          // Scroll automatique vers la catégorie suivante
          if (categoriesRef.current) {
            categoriesRef.current.scrollToIndex({
              index: nextIndex,
              animated: true,
              viewPosition: 0.5, // Centrer l'élément
            });
          }
          
          return nextIndex;
        });
      }, 3000); // Changer toutes les 3 secondes

      return () => clearInterval(interval);
    }
  }, [categories]);

  const fetchData = async () => {
    try {
      const params = {};
      if (selectedCategory) params.category_id = selectedCategory;
      if (brandId) params.brand_id = brandId; // Ajouter le filtrage par marque
      if (searchQuery) params.search = searchQuery;

      console.log('📡 ProductListScreen - Chargement produits avec params:', params);
      if (brandId) {
        console.log('🏷️ Filtrage par marque:', brandName, '(ID:', brandId, ')');
      }

      const [productsRes, categoriesRes] = await Promise.all([
        ApiService.getProducts(params),
        ApiService.getCategories(),
      ]);

      console.log('✅ ProductListScreen - Produits reçus:', productsRes.products?.length || 0);

      // Mapper les produits pour assurer la cohérence des images
      const mappedProducts = mapProductsToUI(productsRes.products || []);
      
      console.log('✅ ProductListScreen - Produits mappés:', mappedProducts.length);
      mappedProducts.forEach(p => {
        console.log(`   - ${p.nom}: image_url=${p.image_url ? 'OUI' : 'NON'}`);
      });

      setProducts(mappedProducts);
      setCategories(categoriesRes.categories || []);
    } catch (error) {
      console.error('Erreur chargement produits:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleApplyFilters = (filters) => {
    setAppliedFilters(filters);
    if (filters.category) {
      setSelectedCategory(filters.category);
    }
    // Ici vous pouvez ajouter la logique pour appliquer d'autres filtres
    setShowFilterModal(false);
  };

  const handleCategoryPress = (category) => {
    if (category.id === null) {
      // "TOUTES" - réinitialiser les filtres
      setSelectedCategory(null);
    } else {
      // Naviguer vers l'écran des marques de cette catégorie
      console.log('🔥 Clic sur catégorie dans ProductList:', category.nom);
      navigation.navigate('CategoryBrands', { category });
    }
  };

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryChip,
        (selectedCategory === item.id || (!selectedCategory && item.id === null)) && styles.categoryChipActive,
      ]}
      onPress={() => handleCategoryPress(item)}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.categoryText,
          (selectedCategory === item.id || (!selectedCategory && item.id === null)) && styles.categoryTextActive,
        ]}
      >
        {item.nom}
      </Text>
    </TouchableOpacity>
  );

  const renderProduct = ({ item, index }) => (
    <View style={styles.productCardContainer}>
      <ProductCard
        product={item}
        onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
        style={styles.gridProductCard}
      />
    </View>
  );

  if (loading) return <Loading />;

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      {/* Header avec compteur panier */}
      <View style={[styles.header, { backgroundColor: theme.background }]}>
        <View>
          <Text style={styles.headerTitle}>
            {brandName ? brandName : categoryName ? categoryName : searchQuery ? 'Recherche' : 'Découvrez'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {brandName ? 'Produits de cette marque' : categoryName ? 'Produits de cette catégorie' : searchQuery ? `"${searchQuery}"` : 'nos produits'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => navigation.navigate('Cart')}
          activeOpacity={0.7}
        >
          <Text style={styles.cartIcon}>🛒</Text>
          {getCartCount() > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{getCartCount()}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Barre de recherche et filtre */}
      <View style={styles.searchRow}>
        <View style={styles.searchContainer}>
          <ProfessionalIcon 
            name="search-outline"
            type="ionicons"
            size={18}
            color={COLORS.primary}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un produit..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={COLORS.gray}
          />
        </View>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilterModal(true)}
          activeOpacity={0.8}
        >
          <ProfessionalIcon 
            name="options-outline"
            type="ionicons"
            size={18}
            color={COLORS.white}
          />
        </TouchableOpacity>
      </View>

      {/* Layout principal avec grille de produits */}
      <View style={[styles.mainContent, { backgroundColor: theme.surface }]}>
        {/* Header des résultats */}
        {products.length > 0 && (
          <View style={[styles.resultsHeader, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
            <Text style={[styles.resultsText, { color: theme.textSecondary }]}>
              {products.length} produit{products.length > 1 ? 's' : ''} trouvé{products.length > 1 ? 's' : ''}
            </Text>
          </View>
        )}

        {/* Catégories horizontales avec auto-scroll */}
        <View style={[styles.categoriesSection, { backgroundColor: theme.background }]}>
          <Text style={[styles.categoriesTitle, { color: theme.text }]}>Catégories</Text>
          <FlatList
            ref={categoriesRef}
            data={[{ id: null, nom: 'TOUTES' }, ...categories]}
            renderItem={renderCategory}
            keyExtractor={(item) => item.id?.toString() || 'all'}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
            onScrollToIndexFailed={(info) => {
              // Gérer l'erreur de scroll si l'index n'existe pas
              const wait = new Promise(resolve => setTimeout(resolve, 500));
              wait.then(() => {
                categoriesRef.current?.scrollToIndex({ 
                  index: info.index, 
                  animated: true,
                  viewPosition: 0.5 
                });
              });
            }}
            getItemLayout={(data, index) => ({
              length: 120, // Largeur approximative d'une catégorie
              offset: 120 * index,
              index,
            })}
          />
        </View>

        {/* Grille des produits 2 colonnes */}
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.productsList}
          numColumns={2}
          columnWrapperStyle={styles.productRow}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <ProfessionalIcon 
                name="search-outline"
                type="ionicons"
                size={80}
                color={COLORS.gray}
                style={{ opacity: 0.3, marginBottom: SPACING.lg }}
              />
              <Text style={styles.emptyTitle}>Aucun produit trouvé</Text>
              <Text style={styles.emptyText}>
                Essayez de modifier vos critères de recherche
              </Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Modal de filtres */}
      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApplyFilters={handleApplyFilters}
        categories={categories}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    paddingTop: SPACING.lg,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.dark,
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 2,
    fontWeight: '500',
  },
  cartButton: {
    position: 'relative',
    backgroundColor: COLORS.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  cartIcon: {
    fontSize: 20,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: COLORS.danger,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: SPACING.md,
    gap: SPACING.sm,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    paddingHorizontal: SPACING.md,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    gap: SPACING.sm,
  },
  filterButton: {
    backgroundColor: COLORS.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  searchInput: {
    flex: 1,
    paddingVertical: SPACING.md,
    fontSize: 14,
    color: COLORS.dark,
    fontWeight: '500',
  },
  mainContent: {
    flex: 1,
  },
  
  // Catégories horizontales
  categoriesSection: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    marginBottom: SPACING.sm,
  },
  categoriesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: SPACING.sm,
  },
  categoriesList: {
    paddingRight: SPACING.md,
  },
  categoryChip: {
    backgroundColor: COLORS.light,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 16,
    marginRight: SPACING.xs,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  categoryChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.dark,
  },
  categoryTextActive: {
    color: COLORS.white,
  },
  
  // Grille de produits
  productsList: {
    padding: SPACING.md,
  },
  productRow: {
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xs,
  },
  productCardContainer: {
    flex: 1,
    maxWidth: '48%',
    marginBottom: SPACING.md,
  },
  gridProductCard: {
    width: '100%',
  },
  resultsHeader: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  resultsText: {
    fontSize: 14,
    color: COLORS.gray,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xl * 2,
    paddingHorizontal: SPACING.md,
    flex: 1,
  },
  emptyTitle: {
    fontSize: SIZES.large,
    fontWeight: '700',
    color: COLORS.dark,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default ProductListScreen;