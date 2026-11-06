// mobile/src/screens/cart/CartScreen.js
import React, { useContext, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  Alert, 
  TouchableOpacity,
  Animated,
  SafeAreaView 
} from 'react-native';
import { CartContext } from '../../context/CartContext';
import CartItem from '../../components/cart/CartItem';
import DeliveryProgress from '../../components/cart/DeliveryProgress';
import Loading from '../../components/common/Loading';
import { COLORS, SIZES, SPACING } from '../../utils/constants';

const CartScreen = ({ navigation }) => {
  const { cart, total, loading, updateCartItem, removeFromCart, clearCart } =
    useContext(CartContext);
  
  const [checkoutAnimation] = useState(new Animated.Value(1));

  const handleUpdateQuantity = async (itemId, quantity) => {
    const result = await updateCartItem(itemId, quantity);
    if (!result.success) {
      Alert.alert('Erreur', result.message);
    }
  };

  const handleRemoveItem = async (itemId) => {
    const result = await removeFromCart(itemId);
    if (!result.success) {
      Alert.alert('Erreur', result.message);
    }
  };

  const handleClearCart = () => {
    Alert.alert(
      'Vider le panier',
      'Êtes-vous sûr de vouloir vider complètement votre panier ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Vider',
          style: 'destructive',
          onPress: async () => {
            const result = await clearCart();
            if (!result.success) {
              Alert.alert('Erreur', result.message);
            }
          },
        },
      ]
    );
  };

  const handleCheckout = () => {
    // Animation du bouton
    Animated.sequence([
      Animated.timing(checkoutAnimation, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(checkoutAnimation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    navigation.navigate('Checkout');
  };

  const getTotalItems = () => {
    return cart.reduce((sum, item) => sum + item.quantite, 0);
  };

  if (loading) return <Loading />;

  if (cart.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Text style={styles.emptyIcon}>🛒</Text>
          </View>
          <Text style={styles.emptyTitle}>Votre panier est vide</Text>
          <Text style={styles.emptyText}>
            Découvrez nos produits et ajoutez vos articles préférés à votre panier
          </Text>
          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => navigation.navigate('Products', { screen: 'ProductList' })}
            activeOpacity={0.8}
          >
            <Text style={styles.shopButtonText}>Découvrir nos produits</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header du panier - Version compacte */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Mon Panier</Text>
          <Text style={styles.headerSubtitle}>
            {getTotalItems()} article{getTotalItems() > 1 ? 's' : ''}
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.clearButton}
          onPress={handleClearCart}
          activeOpacity={0.8}
        >
          <Text style={styles.clearButtonText}>Vider</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={cart}
        renderItem={({ item }) => (
          <CartItem
            item={item}
            onUpdateQuantity={handleUpdateQuantity}
            onRemove={handleRemoveItem}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <DeliveryProgress currentTotal={total} freeDeliveryThreshold={1000} deliveryFee={100} />
        }
      />

      {/* Footer avec total et bouton commande - Version compacte */}
      <View style={styles.footer}>
        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Sous-total ({getTotalItems()} articles)</Text>
            <Text style={styles.summaryValue}>{total.toFixed(2)} DH</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Livraison</Text>
            <Text style={[styles.summaryValue, { color: total >= 1000 ? COLORS.success : COLORS.dark }]}>
              {total >= 1000 ? 'Gratuite' : '100 DH'}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>
              {(total + (total >= 1000 ? 0 : 100)).toFixed(2)} DH
            </Text>
          </View>
        </View>

        <Animated.View style={{ transform: [{ scale: checkoutAnimation }] }}>
          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={handleCheckout}
            activeOpacity={0.9}
          >
            <Text style={styles.checkoutButtonText}>
              Passer la commande
            </Text>
            <Text style={styles.checkoutButtonSubtext}>
              {(total + (total >= 1000 ? 0 : 100)).toFixed(2)} DH
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md, // Réduit de lg à md
    backgroundColor: COLORS.white,
    elevation: 2, // Réduit de 4 à 2
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 }, // Réduit de 2 à 1
    shadowOpacity: 0.08, // Réduit de 0.1 à 0.08
    shadowRadius: 4, // Réduit de 8 à 4
  },
  headerTitle: {
    fontSize: 22, // Réduit de 28 à 22
    fontWeight: '700', // Réduit de 800 à 700
    color: COLORS.dark,
    letterSpacing: -0.3, // Réduit de -0.5 à -0.3
  },
  headerSubtitle: {
    fontSize: 13, // Réduit de 14 à 13
    color: COLORS.gray,
    fontWeight: '500',
    marginTop: 2,
  },
  clearButton: {
    backgroundColor: 'rgba(231, 76, 60, 0.1)', // Rouge très léger
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(231, 76, 60, 0.2)',
    minWidth: 70,
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 13,
    color: COLORS.danger,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  list: {
    padding: SPACING.sm, // Réduit de md à sm
    paddingBottom: SPACING.lg, // Réduit de xl à lg
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyIconContainer: {
    backgroundColor: COLORS.white,
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  emptyIcon: {
    fontSize: 60,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.dark,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: 24,
    paddingHorizontal: SPACING.lg,
  },
  shopButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    borderRadius: 16,
    elevation: 6,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  shopButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  footer: {
    backgroundColor: COLORS.white,
    padding: SPACING.md, // Réduit de lg à md
    elevation: 4, // Réduit de 8 à 4
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 }, // Réduit de -2 à -1
    shadowOpacity: 0.08, // Réduit de 0.1 à 0.08
    shadowRadius: 4, // Réduit de 8 à 4
  },
  summaryContainer: {
    marginBottom: SPACING.md, // Réduit de lg à md
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.gray,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 14,
    color: COLORS.dark,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#E8E8E8',
    marginVertical: SPACING.md,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 18, // Réduit de 20 à 18
    fontWeight: '700',
    color: COLORS.dark,
  },
  totalAmount: {
    fontSize: 20, // Réduit de 24 à 20
    fontWeight: '800',
    color: COLORS.primary,
  },
  checkoutButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md, // Réduit de lg à md
    paddingHorizontal: SPACING.lg, // Ajout de padding horizontal
    borderRadius: 12, // Réduit de 16 à 12
    alignItems: 'center',
    elevation: 4, // Réduit de 6 à 4
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 }, // Réduit de 4 à 3
    shadowOpacity: 0.25, // Réduit de 0.3 à 0.25
    shadowRadius: 6, // Réduit de 8 à 6
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  checkoutButtonText: {
    color: COLORS.white,
    fontSize: 15, // Réduit de 17 à 15
    fontWeight: '700',
    marginBottom: 1, // Réduit de 2 à 1
    letterSpacing: 0.3, // Réduit de 0.5 à 0.3
    textTransform: 'uppercase',
  },
  checkoutButtonSubtext: {
    color: COLORS.white,
    fontSize: 13, // Réduit de 14 à 13
    fontWeight: '600',
    opacity: 0.9,
  },
});

export default CartScreen;