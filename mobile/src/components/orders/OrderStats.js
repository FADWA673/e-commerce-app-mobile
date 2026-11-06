// mobile/src/components/orders/OrderStats.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES, SPACING } from '../../utils/constants';

const OrderStats = ({ orders }) => {
  const getStats = () => {
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + parseFloat(order.total), 0);
    const completedOrders = orders.filter(order => order.statut === 'livree').length;
    const pendingOrders = orders.filter(order => 
      order.statut === 'en_attente' || order.statut === 'validee'
    ).length;

    return {
      totalOrders,
      totalSpent,
      completedOrders,
      pendingOrders,
    };
  };

  const stats = getStats();

  const StatCard = ({ icon, label, value, color = COLORS.primary }) => (
    <View style={styles.statCard}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Résumé</Text>
      <View style={styles.statsGrid}>
        <StatCard
          icon="📊"
          label="Total commandes"
          value={stats.totalOrders}
          color={COLORS.primary}
        />
        <StatCard
          icon="💰"
          label="Total dépensé"
          value={`${stats.totalSpent.toFixed(2)} DH`}
          color={COLORS.success}
        />
        <StatCard
          icon="✅"
          label="Livrées"
          value={stats.completedOrders}
          color={COLORS.success}
        />
        <StatCard
          icon="⏳"
          label="En cours"
          value={stats.pendingOrders}
          color={COLORS.warning}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    margin: SPACING.md,
    padding: SPACING.lg,
    borderRadius: 16,
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#F8F9FA',
    padding: SPACING.md,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: SPACING.xs,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.gray,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
  },
});

export default OrderStats;