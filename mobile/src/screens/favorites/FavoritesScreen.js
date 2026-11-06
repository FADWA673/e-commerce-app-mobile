// mobile/src/screens/favorites/FavoritesScreen.js
import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Image,
  RefreshControl,
} from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import ApiService from '../../services/api';
import Loading from '../../components/common/Loading';
import CustomHeader from '../../components/common/CustomHeader';
import { SimpleIcon } from '../../components/common/ProfessionalIcon';
import { COLORS, SIZES, SPACING } from '../../utils/constants';
import { getImageUrl } from '../../utils/constants';
import { formatPrice } from '../../utils/formatters';
import { mapProductToUI } from '../../utils/productMapper';

const FavoritesScreen = ({ navigation }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const loadData = async () => {
    try {
      setLoading(true);
      console.log('🔄 Chargement favoris...');
      
      const favoritesResponse = await ApiService.getFavorites();
      console.log('📦 Favoris reçus:', favoritesResponse.favorites?.length || 0);

      // Mapper les favoris pour l'UI
      const mappedFavorites = (favoritesResponse.favorites || []).map(mapProductToUI);
      setFavorites(mappedFavorites);
      
    } catch (error) {
      console.error('❌ Erreur chargement favoris:', error);
      Alert.alert('Erreur', 'Impossible de charger vos favoris');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleRemoveFromFavorites = async (productId) => {
    try {
      await ApiService.removeFromFavorites(productId);
      setFavorites(prev => prev.filter(item => item.id !== productId));
      Alert.alert('Succès', 'Produit supprimé des favoris');
    } catch (error) {
      console.error('❌ Erreur suppression favoris:', error);
      Alert.alert('Erreur', 'Impossible de supprimer le produit');
    }
  };

  const handleClearAll = () => {
    Alert.alert(
      'Vider les favoris',
      'Êtes-vous sûr de vouloir supprimer tous vos favoris ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await ApiService.clearFavorites();
              setFavorites([]);
              Alert.alert('Succès', 'Favoris vidés');
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de vider les favoris');
            }
          },
        },
      ]
    );
  };

  const getFilteredFavorites = () => {
    return favorites;
  };

  const renderCategoryFilter = ({ item }) => null; // Supprimé

  const renderFavoriteProduct = ({ item }) => {
    // Vérification de sécurité pour éviter les erreurs de rendu
    if (!item || !item.id) {
      return null;
    }

    return (
      <TouchableOpacity
        style={styles.productCard}
        onPress={() => navigation.navigate('Products', { 
          screen: 'ProductDetail', 
          params: { productId: item.id } 
        })}
        activeOpacity={0.9}
      >
        {/* Image du produit */}
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: getImageUrl(item.image_url) || 'https://via.placeholder.com/150x150/CCCCCC/FFFFFF?text=Produit'
            }}
            style={styles.productImage}
            onError={(error) => {
              console.log('❌ Erreur image favoris:', item.image_url, error.nativeEvent.error);
            }}
          />
          
          {/* Bouton supprimer avec icône professionnelle */}
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemoveFromFavorites(item.id)}
            activeOpacity={0.8}
          >
            <SimpleIcon 
              iconKey="favoritesFilled" 
              containerSize={28} 
              size={14}
              style={{
                backgroundColor: COLORS.white,
                elevation: 3,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.15,
                shadowRadius: 3,
              }}
            />
          </TouchableOpacity>

          {/* Badges avec icônes professionnelles */}
          {item.is_bestseller && (
            <View style={styles.bestsellerBadge}>
              <SimpleIcon 
                iconKey="rating" 
                containerSize={20} 
                size={10}
                style={{ backgroundColor: 'transparent' }}
              />
            </View>
          )}
          {item.is_new && (
            <View style={styles.newBadge}>
              <Text style={styles.badgeText}>NEW</Text>
            </View>
          )}
        </View>

        {/* Informations du produit */}
        <View style={styles.productInfo}>
          <Text style={styles.categoryName}>{String(item.category_name || 'PRODUIT')}</Text>
          <Text style={styles.productName} numberOfLines={2}>{String(item.nom || 'Produit')}</Text>
          <Text style={styles.productPrice}>{formatPrice(item.prix) || '0 DH'}</Text>
          <Text style={styles.stockInfo}>{String(item.stock || 0)} en stock</Text>
          
          {/* Bouton ajouter au panier avec icône professionnelle */}
          <TouchableOpacity
            style={styles.addToCartButton}
            onPress={() => {
              // Logique d'ajout au panier
              Alert.alert('Info', 'Fonctionnalité d\'ajout au panier à implémenter');
            }}
            activeOpacity={0.8}
          >
            <SimpleIcon 
              iconKey="cart" 
              containerSize={16} 
              size={10}
              style={{ backgroundColor: 'transparent', marginRight: 6 }}
            />
            <Text style={styles.addToCartText}>AJOUTER</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <CustomHeader
          title="Mes Favoris"
          navigation={navigation}
        />
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <SimpleIcon 
              iconKey="privacy" 
              containerSize={80} 
              size={40}
              style={{ backgroundColor: 'transparent' }}
            />
          </View>
          <Text style={styles.emptyTitle}>Connexion requise</Text>
          <Text style={styles.emptyText}>
            Connectez-vous pour voir vos favoris
          </Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate('Auth', { screen: 'Login' })}
          >
            <SimpleIcon 
              iconKey="personalInfo" 
              containerSize={20} 
              size={12}
              style={{ backgroundColor: 'transparent', marginRight: 8 }}
            />
            <Text style={styles.loginButtonText}>Se connecter</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const filteredFavorites = getFilteredFavorites();

  // Composant bouton vider pour le header
  const rightHeaderComponent = favorites.length > 0 ? (
    <TouchableOpacity
      style={styles.clearButton}
      onPress={handleClearAll}
      activeOpacity={0.8}
    >
      <SimpleIcon 
        iconKey="delete" 
        containerSize={16} 
        size={10}
        style={{ backgroundColor: 'transparent', marginRight: 6 }}
      />
      <Text style={styles.clearButtonText}>Vider</Text>
    </TouchableOpacity>
  ) : null;

  return (
    <View style={styles.container}>
      {/* Header personnalisé */}
      <CustomHeader
        title={`Mes Favoris (${favorites.length.toString()})`}
        navigation={navigation}
        rightComponent={rightHeaderComponent}
      />

      {favorites.length > 0 ? (
        <>
          {/* Liste des favoris */}
          <FlatList
            data={filteredFavorites}
            renderItem={renderFavoriteProduct}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            contentContainerStyle={styles.productsList}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <SimpleIcon 
              iconKey="favorites" 
              containerSize={80} 
              size={40}
              style={{ backgroundColor: 'transparent' }}
            />
          </View>
          <Text style={styles.emptyTitle}>Aucun favori</Text>
          <Text style={styles.emptyText}>
            Vous n'avez pas encore ajouté de produits à vos favoris.{'\n'}
            Explorez nos produits et ajoutez ceux que vous aimez !
          </Text>
          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => navigation.navigate('Products', { screen: 'ProductList' })}
            activeOpacity={0.8}
          >
            <SimpleIcon 
              iconKey="products" 
              containerSize={20} 
              size={12}
              style={{ backgroundColor: 'transparent', marginRight: 8 }}
            />
            <Text style={styles.shopButtonText}>Découvrir nos produits</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  clearButton: {
    backgroundColor: COLORS.danger,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 2,
    shadowColor: COLORS.danger,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    minWidth: 70,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  clearButtonText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  filtersSection: {
    // Supprimé - plus de filtres
  },
  categoriesList: {
    // Supprimé - plus de catégories
  },
  categoryButton: {
    // Supprimé - plus de boutons catégorie
  },
  categoryButtonActive: {
    // Supprimé - plus de boutons catégorie
  },
  categoryIcon: {
    // Supprimé - plus d'icônes catégorie
  },
  categoryText: {
    // Supprimé - plus de texte catégorie
  },
  categoryTextActive: {
    // Supprimé - plus de texte catégorie actif
  },
  productsList: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  productCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    margin: SPACING.sm,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: 'hidden',
    maxWidth: '46%',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  imageContainer: {
    position: 'relative',
    height: 140,
    backgroundColor: COLORS.light,
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 2,
  },
  bestsellerBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: COLORS.warning,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    elevation: 2,
    shadowColor: COLORS.warning,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  newBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: COLORS.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    elevation: 2,
    shadowColor: COLORS.success,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.white,
    letterSpacing: 0.3,
  },
  productInfo: {
    padding: SPACING.md,
  },
  categoryName: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  productName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.dark,
    marginBottom: 6,
    lineHeight: 18,
    minHeight: 36,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 4,
  },
  stockInfo: {
    fontSize: 11,
    color: COLORS.gray,
    marginBottom: SPACING.sm,
    fontWeight: '500',
  },
  addToCartButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  addToCartText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
    backgroundColor: COLORS.white,
    margin: SPACING.lg,
    borderRadius: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  emptyIconContainer: {
    backgroundColor: COLORS.primary + '10',
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
    elevation: 2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.dark,
    marginBottom: SPACING.md,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: 24,
    paddingHorizontal: SPACING.lg,
    fontWeight: '500',
  },
  shopButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    borderRadius: 25,
    elevation: 6,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  shopButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    borderRadius: 25,
    elevation: 6,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  loginButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  emptyFilterContainer: {
    // Supprimé - plus de filtres
  },
  emptyFilterIcon: {
    // Supprimé - plus de filtres
  },
  emptyFilterTitle: {
    // Supprimé - plus de filtres
  },
  emptyFilterText: {
    // Supprimé - plus de filtres
  },
});

export default FavoritesScreen;