// mobile/src/components/cart/CartSummary.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES, SPACING } from '../../utils/constants';

const CartSummary = ({ cart, total }) => {
  const getTotalItems = () => {
    return cart.reduce((sum, item) => sum + item.quantite, 0);
  };

  const getDeliveryFee = () => {
    return total >= 50 ? 0 : 15; // Livraison gratuite à partir de 50 DH
  };

  const getFinalTotal = () => {
    return total + getDeliveryFee();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Résumé de la commande</Text>
      
      <View style={styles.row}>
        <Text style={styles.label}>Sous-total ({getTotalItems()} articles)</Text>
        <Text style={styles.value}>{total.toFixed(2)} DH</Text>
      </View>
      
      <View style={styles.row}>
        <Text style={styles.label}>Livraison</Text>
        <Text style={[styles.value, getDeliveryFee() === 0 && styles.freeDelivery]}>
          {getDeliveryFee() === 0 ? 'Gratuite' : `${getDeliveryFee()} DH`}
        </Text>
      </View>
      
      {total < 50 && getDeliveryFee() > 0 && (
        <View style={styles.deliveryInfo}>
          <Text style={styles.deliveryInfoText}>
            💡 Ajoutez {(50 - total).toFixed(2)} DH pour la livraison gratuite
          </Text>
        </View>
      )}
      
      <View style={styles.divider} />
      
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalAmount}>{getFinalTotal().toFixed(2)} DH</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    borderRadius: 16,
    marginBottom: SPACING.lg,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.dark,
    marginBottom: SPACING.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  label: {
    fontSize: 14,
    color: COLORS.gray,
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    color: COLORS.dark,
    fontWeight: '600',
  },
  freeDelivery: {
    color: COLORS.success,
  },
  deliveryInfo: {
    backgroundColor: '#E8F5E8',
    padding: SPACING.sm,
    borderRadius: 8,
    marginVertical: SPACING.sm,
  },
  deliveryInfoText: {
    fontSize: 12,
    color: COLORS.success,
    fontWeight: '600',
    textAlign: 'center',
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
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.dark,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.primary,
  },
});

export default CartSummary;