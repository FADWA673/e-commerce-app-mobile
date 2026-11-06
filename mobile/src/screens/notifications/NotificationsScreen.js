// mobile/src/screens/notifications/NotificationsScreen.js
import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import CustomHeader from '../../components/common/CustomHeader';
import ProfessionalIcon from '../../components/common/ProfessionalIcon';
import ApiService from '../../services/api';
import { COLORS, SIZES, SPACING } from '../../utils/constants';
import { formatDateTime, formatDate } from '../../utils/formatters';

const NotificationsScreen = ({ navigation }) => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const { theme } = useTheme();
  const [notifications, setNotifications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      loadNotifications();
    }
  }, [isAuthenticated]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      
      // Charger les commandes de l'utilisateur pour générer des notifications
      const ordersResponse = await ApiService.getUserOrders();
      const orders = ordersResponse.orders || [];
      
      // Générer des notifications basées sur les commandes réelles
      const orderNotifications = generateOrderNotifications(orders);
      
      // Ajouter des notifications promotionnelles et système avec nouveaux produits
      const systemNotifications = await generateSystemNotifications();
      
      // Combiner et trier par date
      const allNotifications = [...orderNotifications, ...systemNotifications]
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      setNotifications(allNotifications);
      
    } catch (error) {
      console.error('❌ Erreur chargement notifications:', error);
      // En cas d'erreur, afficher des notifications par défaut
      setNotifications(generateDefaultNotifications());
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const generateOrderNotifications = (orders) => {
    const notifications = [];
    
    orders.forEach(order => {
      const orderDate = new Date(order.created_at);
      const now = new Date();
      const daysDiff = Math.floor((now - orderDate) / (1000 * 60 * 60 * 24));
      
      // Notification de confirmation de commande
      notifications.push({
        id: `order-${order.id}-confirmed`,
        type: 'order_confirmed',
        title: 'Commande confirmée',
        message: `Votre commande #${order.id} a été confirmée et sera bientôt expédiée.`,
        timestamp: order.created_at,
        read: daysDiff > 1,
        icon: 'bag-outline',
        orderId: order.id,
        orderStatus: order.status,
      });
      
      // Notifications basées sur le statut
      if (order.status === 'en_cours') {
        notifications.push({
          id: `order-${order.id}-processing`,
          type: 'order_processing',
          title: 'Commande en préparation',
          message: `Votre commande #${order.id} est en cours de préparation.`,
          timestamp: new Date(orderDate.getTime() + 2 * 60 * 60 * 1000).toISOString(),
          read: daysDiff > 0,
          icon: 'settings-outline',
          orderId: order.id,
          orderStatus: order.status,
        });
      }
      
      if (order.status === 'livree') {
        notifications.push({
          id: `order-${order.id}-delivered`,
          type: 'order_delivered',
          title: 'Commande livrée',
          message: `Votre commande #${order.id} a été livrée avec succès !`,
          timestamp: new Date(orderDate.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          read: daysDiff > 3,
          icon: 'checkmark-circle-outline',
          orderId: order.id,
          orderStatus: order.status,
        });
      }
    });
    
    return notifications;
  };

  const generateSystemNotifications = async () => {
    const now = new Date();
    const notifications = [];
    
    try {
      // Récupérer les nouveaux produits réels
      const newProductsResponse = await ApiService.getNewProducts(3);
      const newProducts = newProductsResponse.products || [];
      
      // Créer des notifications pour les nouveaux produits
      newProducts.forEach((product, index) => {
        notifications.push({
          id: `new-product-${product.id}`,
          type: 'product',
          title: 'Nouveau produit disponible !',
          message: `Découvrez ${product.nom} maintenant disponible à ${product.prix} DH`,
          timestamp: new Date(now.getTime() - (index + 1) * 24 * 60 * 60 * 1000).toISOString(),
          read: index > 0, // Premier produit non lu
          icon: 'sparkles-outline',
          productId: product.id,
          productName: product.nom,
          productPrice: product.prix,
        });
      });
      
    } catch (error) {
      console.log('Erreur chargement nouveaux produits pour notifications:', error);
    }
    
    // Ajouter des notifications promotionnelles
    notifications.push(
      {
        id: 'promo-electronics',
        type: 'promotion',
        title: 'Offre spéciale !',
        message: 'Profitez de -20% sur tous les produits électroniques jusqu\'à dimanche.',
        timestamp: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(),
        read: false,
        icon: 'gift-outline',
      },
      {
        id: 'free-delivery',
        type: 'promotion',
        title: 'Livraison gratuite !',
        message: 'Livraison gratuite pour toute commande de 1000 DH et plus.',
        timestamp: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString(),
        read: true,
        icon: 'car-outline',
      },
      {
        id: 'welcome',
        type: 'system',
        title: 'Bienvenue !',
        message: `Bonjour ${user?.nom || 'cher client'}, bienvenue dans notre application !`,
        timestamp: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        read: true,
        icon: 'hand-left-outline',
      }
    );
    
    return notifications;
  };

  const generateDefaultNotifications = () => {
    const now = new Date();
    return [
      {
        id: 'default-1',
        type: 'system',
        title: 'Bienvenue !',
        message: 'Bienvenue dans notre application de commerce électronique.',
        timestamp: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(),
        read: false,
        icon: 'hand-left-outline',
      },
    ];
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const handleNotificationPress = (notification) => {
    markAsRead(notification.id);
    
    // Navigation basée sur le type de notification
    if (notification.type.startsWith('order_') && notification.orderId) {
      navigation.navigate('Orders', {
        screen: 'OrderDetail',
        params: { orderId: notification.orderId }
      });
    } else if (notification.type === 'promotion') {
      navigation.navigate('Products', { screen: 'ProductList' });
    } else if (notification.type === 'product') {
      if (notification.productId) {
        // Navigation vers le détail du produit spécifique
        navigation.navigate('Products', {
          screen: 'ProductDetail',
          params: { productId: notification.productId }
        });
      } else {
        // Navigation vers la liste des nouveaux produits
        navigation.navigate('Products', { screen: 'ProductList' });
      }
    }
  };

  const getNotificationStyle = (type) => {
    const styles = {
      order_confirmed: { backgroundColor: theme.info + '20', borderColor: theme.info },
      order_processing: { backgroundColor: theme.warning + '20', borderColor: theme.warning },
      order_delivered: { backgroundColor: theme.success + '20', borderColor: theme.success },
      promotion: { backgroundColor: '#FF6B35' + '20', borderColor: '#FF6B35' },
      product: { backgroundColor: theme.primary + '20', borderColor: theme.primary },
      system: { backgroundColor: theme.textSecondary + '20', borderColor: theme.textSecondary },
    };
    return styles[type] || styles.system;
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const notifTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notifTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'À l\'instant';
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `Il y a ${diffInDays}j`;
    
    return formatDate(timestamp);
  };

  const renderNotification = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.notificationCard,
        { backgroundColor: theme.background, borderLeftColor: getNotificationStyle(item.type).borderColor },
        !item.read && styles.unreadCard,
        getNotificationStyle(item.type),
      ]}
      onPress={() => handleNotificationPress(item)}
      activeOpacity={0.8}
    >
      <View style={styles.notificationHeader}>
        <View style={[styles.notificationIcon, { backgroundColor: theme.surface }]}>
          {item.icon === 'bag-outline' ? (
            <Text style={[styles.notificationEmojiIcon, { color: COLORS.primary }]}>🛒</Text>
          ) : (
            <Ionicons name={item.icon} size={18} color={COLORS.primary} />
          )}
        </View>
        <View style={styles.notificationContent}>
          <Text style={[
            styles.notificationTitle, 
            { color: theme.text },
            !item.read && styles.unreadTitle
          ]}>
            {item.title}
          </Text>
          <Text style={[styles.notificationTime, { color: theme.textSecondary }]}>
            {getTimeAgo(item.timestamp)}
          </Text>
        </View>
        {!item.read && <View style={[styles.unreadDot, { backgroundColor: theme.primary }]} />}
      </View>
      <Text style={[styles.notificationMessage, { color: theme.text }]}>{item.message}</Text>
      
      {/* Bouton d'action pour les commandes */}
      {item.type.startsWith('order_') && (
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.primary + '15', borderColor: theme.primary }]}
          onPress={() => handleNotificationPress(item)}
        >
          <Text style={[styles.actionButtonText, { color: theme.primary }]}>
            Voir la commande →
          </Text>
        </TouchableOpacity>
      )}
      
      {/* Bouton d'action pour les nouveaux produits */}
      {item.type === 'product' && item.productId && (
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.success + '15', borderColor: theme.success }]}
          onPress={() => handleNotificationPress(item)}
        >
          <Text style={[styles.actionButtonText, { color: theme.success }]}>
            Voir le produit →
          </Text>
        </TouchableOpacity>
      )}
      
      {/* Bouton d'action pour les promotions */}
      {item.type === 'promotion' && (
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#FF6B35' + '15', borderColor: '#FF6B35' }]}
          onPress={() => handleNotificationPress(item)}
        >
          <Text style={[styles.actionButtonText, { color: '#FF6B35' }]}>
            Voir l'offre →
          </Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.surface }]}>
        <CustomHeader title="Notifications" />
        <View style={styles.emptyContainer}>
          <ProfessionalIcon 
            name="lock-closed-outline"
            type="ionicons"
            size={80}
            color="#ccc"
          />
          <Text style={[styles.emptyTitle, { color: theme.text }]}>Connexion requise</Text>
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            Connectez-vous pour voir vos notifications
          </Text>
          <TouchableOpacity
            style={[styles.loginButton, { backgroundColor: theme.primary }]}
            onPress={() => navigation.navigate('Auth', { screen: 'Login' })}
          >
            <Text style={styles.loginButtonText}>Se connecter</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.surface }]}>
      <CustomHeader 
        title="Notifications"
        rightComponent={
          unreadCount > 0 ? (
            <View style={styles.headerActions}>
              <View style={[styles.unreadBadge, { backgroundColor: theme.danger }]}>
                <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
              </View>
              <TouchableOpacity
                style={[styles.markAllButton, { backgroundColor: theme.primary + '15' }]}
                onPress={markAllAsRead}
              >
                <Text style={[styles.markAllText, { color: theme.primary }]}>Lu</Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
      />

      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.primary]}
            tintColor={theme.primary}
          />
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-outline" size={48} color="#ccc" />
            <Text style={[styles.emptyTitle, { color: theme.text }]}>Aucune notification</Text>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              Vous n'avez pas encore de notifications.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  unreadBadge: {
    borderRadius: 10,
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  unreadBadgeText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '700',
  },
  markAllButton: {
    paddingHorizontal: SPACING.xs,
    paddingVertical: 3,
    borderRadius: 8,
    minWidth: 32,
    alignItems: 'center',
  },
  markAllText: {
    fontSize: 10,
    fontWeight: '600',
  },
  list: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  notificationCard: {
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    borderLeftWidth: 3,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  unreadCard: {
    elevation: 4,
    shadowOpacity: 0.12,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  notificationIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  notificationEmoji: {
    fontSize: 16,
  },
  notificationEmojiIcon: {
    fontSize: 18,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
    letterSpacing: -0.1,
  },
  unreadTitle: {
    fontWeight: '700',
  },
  notificationTime: {
    fontSize: 12,
    fontWeight: '500',
    opacity: 0.7,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 1,
  },
  notificationMessage: {
    fontSize: 13,
    lineHeight: 18,
    marginLeft: 48,
    marginBottom: SPACING.xs,
  },
  actionButton: {
    marginLeft: 48,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 6,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xl * 3,
    paddingHorizontal: SPACING.lg,
  },
  emptyIcon: {
    marginBottom: SPACING.xl,
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: SPACING.xl,
  },
  loginButton: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    borderRadius: 25,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  loginButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
});

export default NotificationsScreen;