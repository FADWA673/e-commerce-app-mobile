// mobile/src/screens/home/HomeScreen.js
import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  TextInput,
  Dimensions,
  Image,
} from 'react-native';
import { COLORS, SIZES, SPACING, BASE_URL, getImageUrl } from '../../utils/constants';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import ProfessionalIcon from '../../components/common/ProfessionalIcon';
import HomeService from '../../services/homeService';
import ApiService from '../../services/api';
import { formatPrice } from '../../utils/formatters';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { getCartCount } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  // Références pour le scroll automatique fluide et infini
  const brandsRef = useRef(null);
  const scrollX = useRef(0);
  const [duplicatedBrands, setDuplicatedBrands] = useState([]);

  // Debug pour vérifier le nombre d'articles dans le panier
  useEffect(() => {
    console.log('🛒 Nombre d\'articles dans le panier:', getCartCount());
  }, [getCartCount]);

  // Créer des marques dupliquées pour le scroll infini
  useEffect(() => {
    if (brands.length > 0) {
      // Dupliquer les marques pour créer un effet infini
      const duplicated = [...brands, ...brands, ...brands];
      setDuplicatedBrands(duplicated);
    }
  }, [brands]);

  // Auto-scroll fluide et infini des marques
  useEffect(() => {
    if (duplicatedBrands.length > 0) {
      const interval = setInterval(() => {
        scrollX.current += 1; // Scroll de 1px à la fois pour plus de fluidité
        
        if (brandsRef.current && brandsRef.current.scrollTo) {
          brandsRef.current.scrollTo({
            x: scrollX.current,
            y: 0,
            animated: false, // Pas d'animation pour un scroll plus fluide
          });
          
          // Reset quand on atteint la fin du premier set de marques
          const itemWidth = 100; // Largeur approximative d'une marque + margin
          const resetPoint = brands.length * itemWidth;
          
          if (scrollX.current >= resetPoint) {
            scrollX.current = 0;
            if (brandsRef.current && brandsRef.current.scrollTo) {
              brandsRef.current.scrollTo({
                x: 0,
                y: 0,
                animated: false,
              });
            }
          }
        }
      }, 50); // 50ms pour un scroll fluide

      return () => clearInterval(interval);
    }
  }, [duplicatedBrands, brands]);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Chargement des données depuis l\'API...');
      
      // Charger les données directement depuis l'API
      const [categoriesResponse, brandsResponse, bestsellersResponse, recentProductsResponse] = await Promise.all([
        ApiService.getCategories(),
        ApiService.getBrands(),
        ApiService.getBestsellers(6), // Limiter à 6 bestsellers
        ApiService.getProducts({ limit: 8 }) // Récupérer les 8 derniers produits ajoutés
      ]);

      console.log('📊 Données reçues:');
      console.log('- Catégories:', categoriesResponse.categories?.length || 0);
      console.log('- Marques:', brandsResponse.brands?.length || 0);
      console.log('- Bestsellers:', bestsellersResponse.products?.length || 0);
      console.log('- Produits récents:', recentProductsResponse.products?.length || 0);

      // Mapper les données pour l'UI
      const mappedCategories = HomeService.mapCategoriesToUI(categoriesResponse.categories || []);
      const mappedBrands = brandsResponse.brands || [];
      const mappedPopularProducts = HomeService.mapProductsToUI(bestsellersResponse.products || []);
      const mappedNewProducts = HomeService.mapProductsToUI(recentProductsResponse.products || []);
      
      setCategories(mappedCategories);
      setBrands(mappedBrands);
      setPopularProducts(mappedPopularProducts);
      setNewProducts(mappedNewProducts);
      
      console.log('✅ Données chargées avec succès');
      
    } catch (error) {
      console.error('❌ Erreur lors du chargement des données d\'accueil:', error);
      setError('Impossible de charger les données. Vérifiez votre connexion.');
      
      // NE PAS utiliser de données de fallback - afficher des listes vides
      setCategories([]);
      setBrands([]);
      setPopularProducts([]);
      setNewProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigation.navigate('Products', {
        screen: 'ProductList',
        params: { searchQuery: searchQuery.trim() }
      });
    }
  };

  const handleCategoryPress = (category) => {
    console.log('🔥 Clic sur catégorie:', category.name);
    navigation.navigate('CategoryBrands', { category });
  };

  const handleBrandPress = (brand) => {
    console.log('🔥 Clic sur marque:', brand.nom, 'ID:', brand.id);
    // Navigation correcte vers l'onglet Products puis ProductList
    navigation.navigate('Products', {
      screen: 'ProductList',
      params: { 
        brandId: brand.id,
        brandName: brand.nom,
        title: `Produits ${brand.nom}` // Titre personnalisé pour la page
      }
    });
  };

  const handleProductPress = (product) => {
    navigation.navigate('Products', {
      screen: 'ProductDetail',
      params: { productId: product.id }
    });
  };

  const renderBrandItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.cleanBrandCard}
      onPress={() => handleBrandPress(item)}
      activeOpacity={0.8}
    >
      <View style={styles.cleanBrandLogoContainer}>
        {item.logo_url ? (
          <Image
            source={{ 
              uri: getImageUrl(item.logo_url) // Utiliser la fonction helper pour l'URL
            }}
            style={styles.cleanBrandLogo}
            resizeMode="contain"
            onError={(error) => {
              console.log('❌ Erreur chargement logo:', item.nom, 'URL:', getImageUrl(item.logo_url));
            }}
            onLoad={() => {
              console.log('✅ Logo chargé:', item.nom, 'URL:', getImageUrl(item.logo_url));
            }}
          />
        ) : (
          <Text style={[styles.cleanBrandInitial, { color: theme.primary }]}>
            {item.nom?.charAt(0).toUpperCase() || 'B'}
          </Text>
        )}
      </View>
      <Text style={[styles.cleanBrandName, { color: theme.text }]} numberOfLines={1}>
        {item.nom}
      </Text>
    </TouchableOpacity>
  );

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.cleanCategoryCard}
      onPress={() => handleCategoryPress(item)}
      activeOpacity={0.8}
    >
      <View style={styles.cleanCategoryIconContainer}>
        {item.icon.type === 'emoji' ? (
          <Text style={[styles.categoryEmojiIcon, { color: item.color }]}>{item.icon.name}</Text>
        ) : (
          <ProfessionalIcon 
            name={item.icon.name}
            type={item.icon.type}
            size={32}
            color={item.color}
          />
        )}
      </View>
      <Text style={[styles.cleanCategoryName, { color: theme.text }]} numberOfLines={1}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderProductItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.luxuryProductCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
      onPress={() => handleProductPress(item)}
      activeOpacity={0.9}
    >
      <View style={[styles.productImagePlaceholder, { backgroundColor: theme.background }]}>
        {item.image ? (
          <Image
            source={{ uri: item.image }}
            style={styles.productImage}
            resizeMode="cover"
            onError={(error) => {
              console.log('❌ Erreur chargement image:', item.image, error.nativeEvent.error);
            }}
            onLoad={() => {
              console.log('✅ Image chargée:', item.image);
            }}
          />
        ) : (
          <Text style={[styles.productImageText, { color: theme.textSecondary }]}>◯</Text>
        )}
        {item.isNew && (
          <View style={[styles.newBadgeAnimated, { backgroundColor: theme.success }]}>
            <Text style={styles.newBadgeText}>NEW</Text>
          </View>
        )}
        {item.isBestseller && (
          <View style={[styles.bestsellerBadge, { backgroundColor: theme.primary }]}>
            <Text style={styles.bestsellerBadgeText}>★</Text>
          </View>
        )}
      </View>
      <View style={styles.productInfo}>
        <Text style={[styles.productCategory, { color: theme.primary }]}>{item.category}</Text>
        <Text style={[styles.productName, { color: theme.text }]} numberOfLines={2}>{item.name}</Text>
        <Text style={[styles.productPrice, { color: theme.primary }]}>{formatPrice(item.price)}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.surface }]}>
        <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.textSecondary }]}>Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.surface }]}>
        <View style={[styles.errorContainer, { backgroundColor: theme.background }]}>
          <Text style={styles.errorText}>😕</Text>
          <Text style={[styles.errorMessage, { color: theme.textSecondary }]}>{error}</Text>
          <TouchableOpacity style={[styles.retryButton, { backgroundColor: theme.primary }]} onPress={loadHomeData}>
            <Text style={styles.retryButtonText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.primary }]}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Header optimisé et compact */}
        <View style={[styles.compactHeader, { backgroundColor: theme.primary }]}>
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
              <Text style={[styles.greetingText, { color: theme.background + 'CC' }]}>Bonjour</Text>
              <Text style={[styles.userName, { color: theme.background }]}>{user?.nom || 'Invité'}</Text>
            </View>
            <TouchableOpacity
              style={[styles.cartButton, { backgroundColor: theme.background + '20' }]}
              onPress={() => navigation.navigate('Cart')}
              activeOpacity={0.8}
            >
              <Text style={[styles.cartIcon, { color: theme.background }]}>🛒</Text>
              <TouchableOpacity 
                style={[styles.cartBadgeAlways, { backgroundColor: theme.danger }]}
                onPress={() => navigation.navigate('Cart')}
                activeOpacity={0.7}
              >
                <Text style={styles.cartBadgeText}>{getCartCount()}</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>

          {/* Barre de recherche moderne */}
          <View style={[styles.modernSearchContainer, { backgroundColor: theme.background, borderColor: theme.border }]}>
            <View style={[styles.searchIconContainer, { backgroundColor: theme.primary + '10' }]}>
              <ProfessionalIcon 
                name="search-outline"
                type="ionicons"
                size={18}
                color={theme.primary}
              />
            </View>
            <TextInput
              style={[styles.modernSearchInput, { color: theme.text }]}
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              placeholderTextColor={theme.textSecondary}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity 
                style={styles.clearSearchButton}
                onPress={() => setSearchQuery('')}
              >
                <ProfessionalIcon 
                  name="close-circle"
                  type="ionicons"
                  size={16}
                  color={theme.textSecondary}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Contenu avec fond différent */}
        <View style={[styles.contentContainer, { backgroundColor: theme.surface }]}>
          {/* Scroll horizontal des catégories avec icônes rondes */}
          <View style={[styles.categoriesSection, { backgroundColor: theme.background }]}>
            <Text style={[styles.categoriesTitle, { color: theme.text }]}>Catégories</Text>
            <FlatList
              data={categories}
              renderItem={renderCategoryItem}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesList}
            />
          </View>

          {/* Section des marques avec scroll automatique fluide et infini */}
          <View style={[styles.brandsSection, { backgroundColor: theme.background }]}>
            <Text style={[styles.brandsTitle, { color: theme.text }]}>Nos Marques</Text>
            <ScrollView
              ref={brandsRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.brandsList}
              scrollEventThrottle={16}
              onScroll={(event) => {
                // Synchroniser la position de scroll
                if (event && event.nativeEvent && event.nativeEvent.contentOffset) {
                  scrollX.current = event.nativeEvent.contentOffset.x;
                }
              }}
              onScrollBeginDrag={() => {
                // Arrêter le scroll automatique quand l'utilisateur fait défiler manuellement
                // On peut ajouter cette logique plus tard si nécessaire
              }}
            >
              {duplicatedBrands.map((brand, index) => (
                <View key={`${brand.id}-${index}`}>
                  {renderBrandItem({ item: brand, index })}
                </View>
              ))}
            </ScrollView>
          </View>

        {/* Section Bestsellers */}
        <View style={[styles.luxurySection, { backgroundColor: theme.background }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.luxurySectionTitle, { color: theme.text }]}>Bestsellers</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Products', { screen: 'ProductList' })}>
              <Text style={[styles.seeAllText, { color: theme.primary }]}>Voir tout →</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.bestsellersBadge, { backgroundColor: theme.primary + '10', borderColor: theme.primary + '20' }]}>
            <ProfessionalIcon 
              name="star"
              type="ionicons"
              size={16}
              color={theme.primary}
            />
            <Text style={[styles.bestsellersText, { color: theme.primary }]}>Nos produits les plus populaires</Text>
          </View>
          <FlatList
            data={popularProducts}
            renderItem={renderProductItem}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productsList}
            ListEmptyComponent={() => (
              <View style={[styles.emptyProductsContainer, { backgroundColor: theme.surface }]}>
                <Text style={[styles.emptyProductsText, { color: theme.textSecondary }]}>
                  Aucun bestseller disponible
                </Text>
                <Text style={[styles.emptyProductsSubtext, { color: theme.textSecondary }]}>
                  Revenez bientôt pour découvrir nos produits populaires
                </Text>
              </View>
            )}
          />
        </View>

        {/* Bannière promotionnelle élégante */}
        <View style={[styles.luxuryPromoBanner, { backgroundColor: theme.primary }]}>
          <View style={styles.promoContent}>
            <Text style={styles.promoTitle}>Offre Exclusive</Text>
            <Text style={styles.promoDescription}>
              Livraison gratuite sur toutes vos commandes
            </Text>
            <TouchableOpacity
              style={[styles.promoButton, { backgroundColor: theme.background }]}
              onPress={() => navigation.navigate('Products', { screen: 'ProductList' })}
              activeOpacity={0.8}
            >
              <Text style={[styles.promoButtonText, { color: theme.primary }]}>Découvrir</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Section Nouveautés améliorée */}
        <View style={[styles.luxurySection, { backgroundColor: theme.background }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.luxurySectionTitle, { color: theme.text }]}>Nouveautés</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Products', { screen: 'ProductList' })}>
              <Text style={[styles.seeAllText, { color: theme.primary }]}>Voir tout →</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={newProducts}
            renderItem={renderProductItem}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productsList}
            pagingEnabled={false}
            decelerationRate="fast"
            snapToInterval={200}
            snapToAlignment="start"
            ListEmptyComponent={() => (
              <View style={[styles.emptyProductsContainer, { backgroundColor: theme.surface }]}>
                <Text style={[styles.emptyProductsText, { color: theme.textSecondary }]}>
                  Aucune nouveauté disponible
                </Text>
                <Text style={[styles.emptyProductsSubtext, { color: theme.textSecondary }]}>
                  Revenez bientôt pour découvrir nos dernières nouveautés
                </Text>
              </View>
            )}
          />
        </View>

        {/* Espace en bas */}
        <View style={styles.bottomSpace} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: SIZES.medium,
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  errorText: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  errorMessage: {
    fontSize: SIZES.medium,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  retryButton: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: 25,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  retryButtonText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: SIZES.medium,
  },

  // Header compact optimisé
  compactHeader: {
    paddingTop: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  headerLeft: {
    flex: 1,
  },
  greetingText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    opacity: 0.9,
  },
  userName: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  cartButton: {
    position: 'relative',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cartIcon: {
    fontSize: 20,
  },
  cartBadgeAlways: {
    position: 'absolute',
    top: -6,
    right: -6,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  cartBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  cartBadgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },

  // Barre de recherche moderne
  modernSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    borderWidth: 1,
    marginHorizontal: SPACING.sm,
  },
  searchIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  modernSearchInput: {
    flex: 1,
    paddingVertical: SPACING.sm,
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  clearSearchButton: {
    padding: SPACING.xs,
    marginLeft: SPACING.xs,
  },

  // Section catégories avec design moderne
  categoriesSection: {
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
  categoriesTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: SPACING.md,
  },
  categoriesList: {
    paddingRight: SPACING.lg,
  },
  // Catégories Clean Design (sans arrière-plan)
  cleanCategoryCard: {
    alignItems: 'center',
    marginRight: SPACING.lg,
    width: 90,
    justifyContent: 'center',
  },
  cleanCategoryIconContainer: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  cleanCategoryName: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  categoryEmojiIcon: {
    fontSize: 32,
  },

  // Section marques modernes
  brandsSection: {
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.sm,
  },
  brandsTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: SPACING.md,
  },
  brandsList: {
    paddingRight: SPACING.lg,
  },
  // Marques Clean Design (sans arrière-plan)
  cleanBrandCard: {
    alignItems: 'center',
    marginRight: SPACING.lg,
    width: 90,
    justifyContent: 'center',
  },
  cleanBrandLogoContainer: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  cleanBrandLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  cleanBrandInitial: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  cleanBrandName: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 16,
    letterSpacing: 0.2,
  },

  // Sections noir et blanc
  luxurySection: {
    marginTop: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  luxurySectionTitle: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
  },

  // Section Bestsellers
  bestsellersBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: 20,
    marginBottom: SPACING.lg,
    borderWidth: 1,
  },
  bestsellersIcon: {
    fontSize: 16,
    marginRight: SPACING.sm,
    fontWeight: '400',
  },
  bestsellersText: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },

  // Produits beige/marron
  productsList: {
    paddingRight: SPACING.lg,
  },
  // Cards produits premium
  luxuryProductCard: {
    borderRadius: 24,
    marginRight: SPACING.lg,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    overflow: 'hidden',
    width: 200,
    borderWidth: 1,
    position: 'relative',
  },
  productImagePlaceholder: {
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productImageText: {
    fontSize: 40,
    opacity: 0.15,
    fontWeight: '100',
  },
  // Badge NEW animé
  newBadgeAnimated: {
    position: 'absolute',
    top: SPACING.sm,
    left: SPACING.sm,
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    transform: [{ scale: 1.05 }],
  },
  newBadgeText: {
    color: COLORS.white,
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  bestsellerBadge: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  bestsellerBadgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  productInfo: {
    padding: SPACING.md,
  },
  productCategory: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  productName: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: SPACING.sm,
    lineHeight: 18,
    minHeight: 36,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '800',
  },

  // Bannière promotionnelle noir et blanc
  luxuryPromoBanner: {
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.xl,
    backgroundColor: COLORS.primary,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  promoContent: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  promoTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  promoDescription: {
    fontSize: 16,
    color: COLORS.white,
    opacity: 0.9,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: 22,
  },
  promoButton: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: 25,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  promoButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '700',
  },

  bottomSpace: {
    height: SPACING.xl,
  },
  
  // Messages d'état vide
  emptyProductsContainer: {
    width: width - (SPACING.lg * 2),
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginHorizontal: SPACING.lg,
  },
  emptyProductsText: {
    fontSize: SIZES.medium,
    fontWeight: '600',
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  emptyProductsSubtext: {
    fontSize: SIZES.small,
    color: COLORS.gray,
    textAlign: 'center',
    opacity: 0.7,
  },
});

export default HomeScreen;