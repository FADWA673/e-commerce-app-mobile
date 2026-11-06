// mobile/src/components/orders/OrderCard.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import {
  COLORS,
  SIZES,
  SPACING,
  ORDER_STATUS,
  ORDER_STATUS_COLORS,
} from '../../utils/constants';
import { formatDate, formatDateTime } from '../../utils/formatters';

const OrderCard = ({ order, onPress }) => {
  const [scaleAnim] = useState(new Animated.Value(1));

  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.98,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const getStatusIcon = (status) => {
    const icons = {
      en_attente: '⏳',
      validee: '✅',
      livree: '📦',
      annulee: '❌',
    };
    return icons[status] || '📋';
  };

  const getStatusColor = (status) => {
    return ORDER_STATUS_COLORS[status] || COLORS.gray;
  };

  const getTotalItems = () => {
    return order.items?.reduce((sum, item) => sum + item.quantite, 0) || 0;
  };

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        style={styles.card}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        {/* Header de la commande */}
        <View style={styles.header}>
          <View style={styles.orderInfo}>
            <Text style={styles.orderId}>Commande #{order.id}</Text>
            <Text style={styles.orderDate}>{formatDate(order.created_at)}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.statut) }]}>
            <Text style={styles.statusIcon}>{getStatusIcon(order.statut)}</Text>
            <Text style={styles.statusText}>{ORDER_STATUS[order.statut]}</Text>
          </View>
        </View>

        {/* Informations sur les articles */}
        <View style={styles.itemsSection}>
          <View style={styles.itemsHeader}>
            <Text style={styles.itemsTitle}>
              {getTotalItems()} article{getTotalItems() > 1 ? 's' : ''}
            </Text>
            <Text style={styles.orderTime}>{formatDateTime(order.created_at)}</Text>
          </View>
          
          <View style={styles.itemsList}>
            {order.items?.slice(0, 2).map((item, index) => (
              <View key={index} style={styles.itemRow}>
                <Text style={styles.itemName} numberOfLines={1}>
                  {item.nom}
                </Text>
                <Text style={styles.itemQuantity}>x{item.quantite}</Text>
              </View>
            ))}
            {order.items?.length > 2 && (
              <Text style={styles.moreItems}>
                +{order.items.length - 2} autre{order.items.length - 2 > 1 ? 's' : ''} article{order.items.length - 2 > 1 ? 's' : ''}
              </Text>
            )}
          </View>
        </View>

        {/* Footer avec total */}
        <View style={styles.footer}>
          <View style={styles.totalSection}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>
              {parseFloat(order.total).toFixed(2)} DH
            </Text>
          </View>
          <View style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Voir détails →</Text>
          </View>
        </View>

        {/* Indicateur de progression pour les commandes en cours */}
        {(order.statut === 'en_attente' || order.statut === 'validee') && (
          <View style={styles.progressSection}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: order.statut === 'en_attente' ? '25%' : '75%',
                    backgroundColor: getStatusColor(order.statut)
                  }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {order.statut === 'en_attente' ? 'En cours de traitement...' : 'En cours de livraison...'}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: SPACING.lg,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.dark,
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    color: COLORS.gray,
    fontWeight: '500',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statusIcon: {
    fontSize: 16,
    marginRight: SPACING.xs,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.white,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  itemsSection: {
    marginBottom: SPACING.md,
  },
  itemsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  itemsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.dark,
  },
  orderTime: {
    fontSize: 12,
    color: COLORS.gray,
    fontWeight: '500',
  },
  itemsList: {
    backgroundColor: '#F8F9FA',
    padding: SPACING.md,
    borderRadius: 12,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    color: COLORS.dark,
    fontWeight: '500',
    marginRight: SPACING.sm,
  },
  itemQuantity: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '700',
  },
  moreItems: {
    fontSize: 12,
    color: COLORS.gray,
    fontStyle: 'italic',
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
  },
  totalSection: {
    flex: 1,
  },
  totalLabel: {
    fontSize: 14,
    color: COLORS.gray,
    fontWeight: '500',
    marginBottom: 2,
  },
  totalAmount: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.primary,
  },
  actionButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: 25,
    elevation: 3,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  actionButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
  },
  progressSection: {
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E8E8E8',
    borderRadius: 2,
    marginBottom: SPACING.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: COLORS.gray,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default OrderCard;