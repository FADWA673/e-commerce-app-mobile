// mobile/src/screens/orders/OrderDetailScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  SafeAreaView,
  Alert,
  RefreshControl,
} from 'react-native';
import ApiService from '../../services/api';
import Loading from '../../components/common/Loading';
import { COLORS, SIZES, SPACING } from '../../utils/constants';
import { formatPrice } from '../../utils/formatters';
import { getImageUrl } from '../../utils/constants';

const OrderDetailScreen = ({ route, navigation }) => {
  const { orderId } = route.params;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadOrderDetails();
  }, [orderId]);

  const loadOrderDetails = async () => {
    try {
      setLoading(true);
      console.log('🔄 Chargement détails commande:', orderId);
      
      const response = await ApiService.getOrderById(orderId);
      console.log('📦 Détails commande reçus:', response.order?.id || 'Aucune');
      
      if (response.success && response.order) {
        setOrder(response.order);
      } else {
        Alert.alert('Erreur', 'Commande non trouvée');
        navigation.goBack();
      }
    } catch (error) {
      console.error('❌ Erreur chargement détails:', error);
      Alert.alert('Erreur', 'Impossible de charger les détails de la commande');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrderDetails();
    setRefreshing(false);
  };

  const getStatusColor = (status) => {
    const colors = {
      'en_attente': COLORS.warning,
      'validee': COLORS.info,
      'livree': COLORS.success,
      'annulee': COLORS.danger,
    };
    return colors[status] || COLORS.gray;
  };

  const getStatusText = (status) => {
    const texts = {
      'en_attente': 'En attente',
      'validee': 'Validée',
      'livree': 'Livrée',
      'annulee': 'Annulée',
    };
    return texts[status] || status;
  };

  const getStatusIcon = (status) => {
    const icons = {
      'en_attente': '⏳',
      'validee': '✅',
      'livree': '📦',
      'annulee': '❌',
    };
    return icons[status] || '📋';
  };

  const renderOrderItem = (item) => (
    <View key={item.id} style={styles.orderItem}>
      <View style={styles.itemImageContainer}>
        <Image
          source={{
            uri: getImageUrl(item.image_url) || 'https://via.placeholder.com/60x60/CCCCCC/FFFFFF?text=Produit'
          }}
          style={styles.itemImage}
          onError={(error) => {
            console.log('❌ Erreur image commande:', item.image_url, error.nativeEvent.error);
          }}
        />
      </View>
      <View style={styles.itemDetails}>
        <Text style={styles.itemName} numberOfLines={2}>
          {item.nom}
        </Text>
        <Text style={styles.itemPrice}>
          {formatPrice(parseFloat(item.prix || item.prix_unitaire || 0))} × {item.quantite}
        </Text>
        <Text style={styles.itemSubtotal}>
          {formatPrice(parseFloat(item.prix || item.prix_unitaire || 0) * parseInt(item.quantite))}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return <Loading />;
  }

  if (!order) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>😕</Text>
          <Text style={styles.errorTitle}>Commande non trouvée</Text>
          <Text style={styles.errorText}>
            Cette commande n'existe pas ou a été supprimée
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header de la commande */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.orderNumber}>Commande #{order.id}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.statut) }]}>
              <Text style={styles.statusIcon}>{getStatusIcon(order.statut)}</Text>
              <Text style={styles.statusText}>{getStatusText(order.statut)}</Text>
            </View>
          </View>
          <Text style={styles.orderDate}>
            Passée le {new Date(order.created_at).toLocaleDateString('fr-FR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>

        {/* Progression de la commande */}
        <View style={styles.progressSection}>
          <Text style={styles.sectionTitle}>Suivi de commande</Text>
          <View style={styles.progressContainer}>
            <View style={[
              styles.progressStep,
              ['en_attente', 'validee', 'livree'].includes(order.statut) && styles.progressStepActive
            ]}>
              <Text style={styles.progressIcon}>📝</Text>
              <Text style={styles.progressLabel}>Commande passée</Text>
            </View>
            <View style={[
              styles.progressStep,
              ['validee', 'livree'].includes(order.statut) && styles.progressStepActive
            ]}>
              <Text style={styles.progressIcon}>✅</Text>
              <Text style={styles.progressLabel}>Validée</Text>
            </View>
            <View style={[
              styles.progressStep,
              order.statut === 'livree' && styles.progressStepActive
            ]}>
              <Text style={styles.progressIcon}>📦</Text>
              <Text style={styles.progressLabel}>Livrée</Text>
            </View>
          </View>
        </View>

        {/* Articles commandés */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Articles commandés</Text>
          <View style={styles.itemsList}>
            {order.items?.map(renderOrderItem)}
          </View>
        </View>

        {/* Résumé financier */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Résumé</Text>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                Sous-total ({order.items?.length || 0} articles)
              </Text>
              <Text style={styles.summaryValue}>{formatPrice(parseFloat(order.total))}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Livraison</Text>
              <Text style={styles.summaryValue}>Gratuite</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalAmount}>{formatPrice(parseFloat(order.total))}</Text>
            </View>
          </View>
        </View>

        {/* Adresse de livraison */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Adresse de livraison</Text>
          <View style={styles.addressContainer}>
            <Text style={styles.addressIcon}>📍</Text>
            <Text style={styles.addressText}>{order.adresse_livraison}</Text>
          </View>
        </View>

        {/* Informations de paiement */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mode de paiement</Text>
          <View style={styles.paymentContainer}>
            <Text style={styles.paymentIcon}>💰</Text>
            <Text style={styles.paymentText}>Paiement à la livraison (Cash)</Text>
          </View>
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
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
    marginBottom: SPACING.sm,
  },
  orderNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.dark,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 16,
  },
  statusIcon: {
    fontSize: 16,
    marginRight: SPACING.xs,
  },
  statusText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  orderDate: {
    fontSize: 14,
    color: COLORS.gray,
    fontWeight: '500',
  },
  progressSection: {
    backgroundColor: COLORS.white,
    margin: SPACING.md,
    padding: SPACING.lg,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.md,
  },
  progressStep: {
    alignItems: 'center',
    flex: 1,
    opacity: 0.4,
  },
  progressStepActive: {
    opacity: 1,
  },
  progressIcon: {
    fontSize: 24,
    marginBottom: SPACING.xs,
  },
  progressLabel: {
    fontSize: 12,
    color: COLORS.dark,
    fontWeight: '600',
    textAlign: 'center',
  },
  section: {
    backgroundColor: COLORS.white,
    margin: SPACING.md,
    marginTop: 0,
    padding: SPACING.lg,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.dark,
    marginBottom: SPACING.md,
  },
  itemsList: {
    gap: SPACING.md,
  },
  orderItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.light,
    padding: SPACING.md,
    borderRadius: 12,
  },
  itemImageContainer: {
    marginRight: SPACING.md,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: COLORS.lightGray,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: SPACING.xs,
  },
  itemPrice: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: SPACING.xs,
  },
  itemSubtotal: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  summaryContainer: {
    gap: SPACING.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    backgroundColor: COLORS.lightGray,
    marginVertical: SPACING.sm,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.dark,
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.primary,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.light,
    padding: SPACING.md,
    borderRadius: 12,
  },
  addressIcon: {
    fontSize: 20,
    marginRight: SPACING.md,
  },
  addressText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.dark,
    lineHeight: 22,
  },
  paymentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.light,
    padding: SPACING.md,
    borderRadius: 12,
  },
  paymentIcon: {
    fontSize: 20,
    marginRight: SPACING.md,
  },
  paymentText: {
    fontSize: 16,
    color: COLORS.dark,
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  errorIcon: {
    fontSize: 60,
    marginBottom: SPACING.lg,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.dark,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 24,
  },
  bottomSpace: {
    height: SPACING.xl,
  },
});

export default OrderDetailScreen;