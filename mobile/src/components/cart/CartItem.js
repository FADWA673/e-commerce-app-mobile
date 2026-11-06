// mobile/src/components/cart/CartItem.js
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  Animated,
  Alert 
} from 'react-native';
import { COLORS, SIZES, SPACING } from '../../utils/constants';
import { getImageUrl } from '../../utils/constants';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const [scaleAnim] = useState(new Animated.Value(1));
  const [updating, setUpdating] = useState(false);

  const animatePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const incrementQuantity = async () => {
    if (item.quantite < item.stock && !updating) {
      setUpdating(true);
      animatePress();
      await onUpdateQuantity(item.id, item.quantite + 1);
      setUpdating(false);
    } else if (item.quantite >= item.stock) {
      Alert.alert('Stock insuffisant', 'Quantité maximale atteinte');
    }
  };

  const decrementQuantity = async () => {
    if (item.quantite > 1 && !updating) {
      setUpdating(true);
      animatePress();
      await onUpdateQuantity(item.id, item.quantite - 1);
      setUpdating(false);
    }
  };

  const handleRemove = () => {
    Alert.alert(
      'Supprimer du panier',
      `Voulez-vous retirer "${item.nom}" de votre panier ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Supprimer', 
          style: 'destructive',
          onPress: () => onRemove(item.id)
        }
      ]
    );
  };

  // Obtenir l'URL de l'image avec fallback
  const getProductImage = () => {
    // Essayer différentes sources d'image
    const imageUrl = item.image_url || item.product?.image_url;
    return getImageUrl(imageUrl) || 'https://via.placeholder.com/100x100/CCCCCC/FFFFFF?text=Produit';
  };

  console.log('🖼️ CartItem image debug:', {
    itemId: item.id,
    nom: item.nom,
    image_url: item.image_url,
    productImage: item.product?.image_url,
    finalUrl: getProductImage()
  });

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: getProductImage() }} 
          style={styles.image}
          onError={(error) => {
            console.log('❌ Erreur chargement image panier:', getProductImage(), error.nativeEvent.error);
          }}
          onLoad={() => {
            console.log('✅ Image panier chargée:', getProductImage());
          }}
        />
        {item.quantite >= item.stock && (
          <View style={styles.stockBadge}>
            <Text style={styles.stockBadgeText}>Max</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={2}>
            {item.nom}
          </Text>
          <TouchableOpacity 
            style={styles.removeButton}
            onPress={handleRemove}
            activeOpacity={0.7}
          >
            <Text style={styles.removeIcon}>✕</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.price}>{item.prix} DH</Text>
        
        <View style={styles.footer}>
          <View style={styles.quantitySection}>
            <Text style={styles.quantityLabel}>Quantité</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity
                style={[
                  styles.quantityButton,
                  styles.decrementButton,
                  item.quantite <= 1 && styles.quantityButtonDisabled
                ]}
                onPress={decrementQuantity}
                disabled={item.quantite <= 1 || updating}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.quantityButtonText,
                  item.quantite <= 1 && styles.quantityButtonTextDisabled
                ]}>−</Text>
              </TouchableOpacity>
              
              <View style={styles.quantityDisplay}>
                <Text style={styles.quantityValue}>{item.quantite}</Text>
              </View>
              
              <TouchableOpacity
                style={[
                  styles.quantityButton,
                  styles.incrementButton,
                  item.quantite >= item.stock && styles.quantityButtonDisabled
                ]}
                onPress={incrementQuantity}
                disabled={item.quantite >= item.stock || updating}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.quantityButtonText,
                  item.quantite >= item.stock && styles.quantityButtonTextDisabled
                ]}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.subtotalSection}>
            <Text style={styles.subtotalLabel}>Sous-total</Text>
            <Text style={styles.subtotalAmount}>
              {(parseFloat(item.prix || 0) * parseInt(item.quantite || 0)).toFixed(2)} DH
            </Text>
          </View>
        </View>

        {item.stock <= 5 && (
          <View style={styles.stockWarning}>
            <Text style={styles.stockWarningText}>
              ⚠️ Plus que {item.stock} en stock
            </Text>
          </View>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 16, // Réduit de 20 à 16
    padding: SPACING.md, // Réduit de lg à md
    marginBottom: SPACING.md, // Réduit de lg à md
    elevation: 4, // Réduit de 8 à 4
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, // Réduit de 4 à 2
    shadowOpacity: 0.1, // Réduit de 0.15 à 0.1
    shadowRadius: 4, // Réduit de 8 à 4
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: 80, // Réduit de 100 à 80
    height: 80, // Réduit de 100 à 80
    borderRadius: 12, // Réduit de 16 à 12
    backgroundColor: COLORS.lightGray,
  },
  stockBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: COLORS.warning,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  stockBadgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    marginLeft: SPACING.md, // Réduit de lg à md
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.xs, // Réduit de sm à xs
  },
  name: {
    flex: 1,
    fontSize: 15, // Réduit de 16 à 15
    fontWeight: '600', // Réduit de 700 à 600
    color: COLORS.dark,
    lineHeight: 20, // Réduit de 22 à 20
    marginRight: SPACING.sm,
  },
  removeButton: {
    backgroundColor: '#FFE5E5',
    width: 24, // Réduit de 28 à 24
    height: 24, // Réduit de 28 à 24
    borderRadius: 12, // Réduit de 14 à 12
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeIcon: {
    fontSize: 12, // Réduit de 14 à 12
    color: COLORS.danger,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 16, // Réduit de 18 à 16
    color: COLORS.primary,
    fontWeight: '700', // Réduit de 800 à 700
    marginBottom: SPACING.sm, // Réduit de md à sm
  },
  footer: {
    marginBottom: SPACING.xs, // Réduit de sm à xs
  },
  quantitySection: {
    marginBottom: SPACING.sm, // Réduit de md à sm
  },
  quantityLabel: {
    fontSize: 11, // Réduit de 12 à 11
    color: COLORS.gray,
    fontWeight: '600',
    marginBottom: SPACING.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 32, // Réduit de 40 à 32
    height: 32, // Réduit de 40 à 32
    borderRadius: 16, // Réduit de 20 à 16
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2, // Réduit de 3 à 2
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 }, // Réduit de 2 à 1
    shadowOpacity: 0.08, // Réduit de 0.1 à 0.08
    shadowRadius: 2, // Réduit de 4 à 2
  },
  decrementButton: {
    backgroundColor: '#FFE5E5',
  },
  incrementButton: {
    backgroundColor: '#E5F5E5',
  },
  quantityButtonDisabled: {
    backgroundColor: '#F5F5F5',
    elevation: 0,
    shadowOpacity: 0,
  },
  quantityButtonText: {
    fontSize: 16, // Réduit de 20 à 16
    fontWeight: 'bold',
  },
  quantityButtonTextDisabled: {
    color: COLORS.lightGray,
  },
  quantityDisplay: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: SPACING.md, // Réduit de lg à md
    paddingVertical: SPACING.xs, // Réduit de sm à xs
    borderRadius: 10, // Réduit de 12 à 10
    marginHorizontal: SPACING.sm, // Réduit de md à sm
    minWidth: 40, // Réduit de 50 à 40
    alignItems: 'center',
  },
  quantityValue: {
    fontSize: 16, // Réduit de 18 à 16
    fontWeight: '700', // Réduit de 800 à 700
    color: COLORS.dark,
  },
  subtotalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: SPACING.sm, // Réduit de md à sm
    borderRadius: 10, // Réduit de 12 à 10
  },
  subtotalLabel: {
    fontSize: 13, // Réduit de 14 à 13
    color: COLORS.gray,
    fontWeight: '600',
  },
  subtotalAmount: {
    fontSize: 16, // Réduit de 18 à 16
    fontWeight: '700', // Réduit de 800 à 700
    color: COLORS.primary,
  },
  stockWarning: {
    backgroundColor: '#FFF3CD',
    padding: SPACING.sm,
    borderRadius: 8,
    marginTop: SPACING.sm,
  },
  stockWarningText: {
    fontSize: 12,
    color: '#856404',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default CartItem;