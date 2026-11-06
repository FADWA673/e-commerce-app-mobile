// mobile/src/components/orders/OrderFilters.js
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {
  COLORS,
  SIZES,
  SPACING,
  ORDER_STATUS,
} from '../../utils/constants';

const OrderFilters = ({ selectedFilter, onFilterChange, orderCounts }) => {
  const filters = [
    { key: 'all', label: 'Toutes', icon: '📋' },
    { key: 'en_attente', label: 'En attente', icon: '⏳' },
    { key: 'validee', label: 'Validées', icon: '✅' },
    { key: 'livree', label: 'Livrées', icon: '📦' },
    { key: 'annulee', label: 'Annulées', icon: '❌' },
  ];

  const getFilterCount = (filterKey) => {
    if (filterKey === 'all') {
      return Object.values(orderCounts).reduce((sum, count) => sum + count, 0);
    }
    return orderCounts[filterKey] || 0;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Filtrer par statut</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContainer}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterButton,
              selectedFilter === filter.key && styles.filterButtonActive,
            ]}
            onPress={() => onFilterChange(filter.key)}
            activeOpacity={0.8}
          >
            <Text style={styles.filterIcon}>{filter.icon}</Text>
            <Text
              style={[
                styles.filterLabel,
                selectedFilter === filter.key && styles.filterLabelActive,
              ]}
            >
              {filter.label}
            </Text>
            {getFilterCount(filter.key) > 0 && (
              <View style={styles.countBadge}>
                <Text style={styles.countText}>{getFilterCount(filter.key)}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.lg,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.dark,
    marginLeft: SPACING.lg,
    marginBottom: SPACING.md,
  },
  filtersContainer: {
    paddingHorizontal: SPACING.md,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 25,
    marginRight: SPACING.sm,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  filterIcon: {
    fontSize: 16,
    marginRight: SPACING.xs,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.dark,
  },
  filterLabelActive: {
    color: COLORS.white,
  },
  countBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: COLORS.danger,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  countText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default OrderFilters;