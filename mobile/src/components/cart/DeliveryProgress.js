// mobile/src/components/cart/DeliveryProgress.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES, SPACING } from '../../utils/constants';

const DeliveryProgress = ({ currentTotal, freeDeliveryThreshold = 1000, deliveryFee = 100 }) => {
  const progress = Math.min(currentTotal / freeDeliveryThreshold, 1);
  const remaining = Math.max(freeDeliveryThreshold - currentTotal, 0);
  const isEligible = currentTotal >= freeDeliveryThreshold;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.icon}>🚚</Text>
        <View style={styles.textContainer}>
          {isEligible ? (
            <Text style={styles.eligibleText}>
              🎉 Félicitations ! Livraison gratuite
            </Text>
          ) : (
            <Text style={styles.progressText}>
              Plus que <Text style={styles.amount}>{remaining.toFixed(2)} DH</Text> pour la livraison gratuite
            </Text>
          )}
        </View>
      </View>
      
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          <View 
            style={[
              styles.progressBarFill, 
              { 
                width: `${progress * 100}%`,
                backgroundColor: isEligible ? COLORS.success : COLORS.primary
              }
            ]} 
          />
        </View>
        <Text style={styles.threshold}>{freeDeliveryThreshold} DH</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    padding: SPACING.sm, // Réduit de md à sm
    borderRadius: 10, // Réduit de 12 à 10
    marginBottom: SPACING.sm, // Réduit de md à sm
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs, // Réduit de sm à xs
  },
  icon: {
    fontSize: 20, // Réduit de 24 à 20
    marginRight: SPACING.xs, // Réduit de sm à xs
  },
  textContainer: {
    flex: 1,
  },
  progressText: {
    fontSize: 13, // Réduit de 14 à 13
    color: COLORS.dark,
    fontWeight: '500',
  },
  eligibleText: {
    fontSize: 13, // Réduit de 14 à 13
    color: COLORS.success,
    fontWeight: '600',
  },
  amount: {
    fontWeight: '700',
    color: COLORS.primary,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBarBackground: {
    flex: 1,
    height: 5, // Réduit de 6 à 5
    backgroundColor: '#E8E8E8',
    borderRadius: 2.5, // Réduit de 3 à 2.5
    marginRight: SPACING.xs, // Réduit de sm à xs
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2.5, // Réduit de 3 à 2.5
  },
  threshold: {
    fontSize: 11, // Réduit de 12 à 11
    color: COLORS.gray,
    fontWeight: '600',
  },
});

export default DeliveryProgress;