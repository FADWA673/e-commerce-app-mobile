// mobile/src/screens/profile/NotificationSettingsScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import ProfessionalIcon from '../../components/common/ProfessionalIcon';
import { COLORS, SPACING } from '../../utils/constants';

const NotificationSettingsScreen = ({ navigation }) => {
  // États pour les différents types de notifications
  const [settings, setSettings] = useState({
    // Notifications générales
    allNotifications: true,
    
    // Notifications de commandes
    orderConfirmation: true,
    orderShipped: true,
    orderDelivered: true,
    orderCancelled: true,
    
    // Notifications marketing
    promotions: false,
    newProducts: false,
    recommendations: true,
    
    // Notifications sociales
    reviews: true,
    wishlistUpdates: false,
    
    // Canaux de notification
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    
    // Horaires
    quietHours: false,
    weekendNotifications: true,
  });

  const [quietHoursTime, setQuietHoursTime] = useState({
    start: '22:00',
    end: '08:00',
  });

  const updateSetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSaveSettings = () => {
    // Simulation de sauvegarde
    Alert.alert(
      'Paramètres sauvegardés',
      'Vos préférences de notifications ont été mises à jour',
      [{ text: 'OK' }]
    );
  };

  const handleResetToDefaults = () => {
    Alert.alert(
      'Réinitialiser',
      'Voulez-vous restaurer les paramètres par défaut ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Réinitialiser',
          onPress: () => {
            setSettings({
              allNotifications: true,
              orderConfirmation: true,
              orderShipped: true,
              orderDelivered: true,
              orderCancelled: true,
              promotions: false,
              newProducts: false,
              recommendations: true,
              reviews: true,
              wishlistUpdates: false,
              pushNotifications: true,
              emailNotifications: true,
              smsNotifications: false,
              quietHours: false,
              weekendNotifications: true,
            });
            Alert.alert('Réinitialisé', 'Paramètres restaurés par défaut');
          },
        },
      ]
    );
  };

  const NotificationSection = ({ title, description, children }) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {description && (
          <Text style={styles.sectionDescription}>{description}</Text>
        )}
      </View>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );

  const NotificationToggle = ({ 
    title, 
    subtitle, 
    value, 
    onValueChange, 
    disabled = false,
    icon 
  }) => (
    <View style={[styles.toggleItem, disabled && styles.toggleItemDisabled]}>
      <View style={styles.toggleLeft}>
        {icon && (
          <View style={styles.toggleIcon}>
            <Text style={styles.toggleEmoji}>{icon}</Text>
          </View>
        )}
        <View style={styles.toggleTextContainer}>
          <Text style={[styles.toggleTitle, disabled && styles.toggleTitleDisabled]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[styles.toggleSubtitle, disabled && styles.toggleSubtitleDisabled]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{ 
          false: '#D1D5DB', 
          true: disabled ? '#D1D5DB' : COLORS.primary + '80' 
        }}
        thumbColor={value && !disabled ? COLORS.primary : '#F3F4F6'}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.simpleBackButton}
          activeOpacity={0.8}
        >
          <ProfessionalIcon 
            name="arrow-back-outline"
            type="ionicons"
            size={20}
            color={COLORS.dark}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity
          onPress={handleSaveSettings}
          style={styles.saveButton}
        >
          <Text style={styles.saveButtonText}>Sauver</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Contrôle principal */}
        <NotificationSection
          title="Contrôle général"
          description="Activez ou désactivez toutes les notifications"
        >
          <NotificationToggle
            icon="🔔"
            title="Toutes les notifications"
            subtitle="Contrôle principal pour toutes les notifications"
            value={settings.allNotifications}
            onValueChange={(value) => updateSetting('allNotifications', value)}
          />
        </NotificationSection>

        {/* Notifications de commandes */}
        <NotificationSection
          title="Commandes"
          description="Restez informé de l'état de vos commandes"
        >
          <NotificationToggle
            icon="✅"
            title="Confirmation de commande"
            subtitle="Quand votre commande est confirmée"
            value={settings.orderConfirmation}
            onValueChange={(value) => updateSetting('orderConfirmation', value)}
            disabled={!settings.allNotifications}
          />
          <NotificationToggle
            icon="📦"
            title="Commande expédiée"
            subtitle="Quand votre commande est expédiée"
            value={settings.orderShipped}
            onValueChange={(value) => updateSetting('orderShipped', value)}
            disabled={!settings.allNotifications}
          />
          <NotificationToggle
            icon="🚚"
            title="Commande livrée"
            subtitle="Quand votre commande est livrée"
            value={settings.orderDelivered}
            onValueChange={(value) => updateSetting('orderDelivered', value)}
            disabled={!settings.allNotifications}
          />
          <NotificationToggle
            icon="❌"
            title="Commande annulée"
            subtitle="Si votre commande est annulée"
            value={settings.orderCancelled}
            onValueChange={(value) => updateSetting('orderCancelled', value)}
            disabled={!settings.allNotifications}
          />
        </NotificationSection>

        {/* Notifications marketing */}
        <NotificationSection
          title="Marketing et promotions"
          description="Offres spéciales et nouveautés"
        >
          <NotificationToggle
            icon="🎁"
            title="Promotions et soldes"
            subtitle="Offres spéciales et réductions"
            value={settings.promotions}
            onValueChange={(value) => updateSetting('promotions', value)}
            disabled={!settings.allNotifications}
          />
          <NotificationToggle
            icon="🆕"
            title="Nouveaux produits"
            subtitle="Quand de nouveaux produits arrivent"
            value={settings.newProducts}
            onValueChange={(value) => updateSetting('newProducts', value)}
            disabled={!settings.allNotifications}
          />
          <NotificationToggle
            icon="💡"
            title="Recommandations"
            subtitle="Produits recommandés pour vous"
            value={settings.recommendations}
            onValueChange={(value) => updateSetting('recommendations', value)}
            disabled={!settings.allNotifications}
          />
        </NotificationSection>

        {/* Notifications sociales */}
        <NotificationSection
          title="Activité sociale"
          description="Avis et interactions"
        >
          <NotificationToggle
            icon="⭐"
            title="Demandes d'avis"
            subtitle="Quand on vous demande de noter un produit"
            value={settings.reviews}
            onValueChange={(value) => updateSetting('reviews', value)}
            disabled={!settings.allNotifications}
          />
          <NotificationToggle
            icon="❤️"
            title="Mises à jour des favoris"
            subtitle="Changements de prix sur vos favoris"
            value={settings.wishlistUpdates}
            onValueChange={(value) => updateSetting('wishlistUpdates', value)}
            disabled={!settings.allNotifications}
          />
        </NotificationSection>

        {/* Canaux de notification */}
        <NotificationSection
          title="Canaux de notification"
          description="Comment recevoir les notifications"
        >
          <NotificationToggle
            icon="📱"
            title="Notifications push"
            subtitle="Sur votre appareil mobile"
            value={settings.pushNotifications}
            onValueChange={(value) => updateSetting('pushNotifications', value)}
            disabled={!settings.allNotifications}
          />
          <NotificationToggle
            icon="📧"
            title="Notifications par email"
            subtitle="Dans votre boîte de réception"
            value={settings.emailNotifications}
            onValueChange={(value) => updateSetting('emailNotifications', value)}
            disabled={!settings.allNotifications}
          />
          <NotificationToggle
            icon="💬"
            title="Notifications SMS"
            subtitle="Par message texte"
            value={settings.smsNotifications}
            onValueChange={(value) => updateSetting('smsNotifications', value)}
            disabled={!settings.allNotifications}
          />
        </NotificationSection>

        {/* Horaires */}
        <NotificationSection
          title="Horaires"
          description="Contrôlez quand recevoir les notifications"
        >
          <NotificationToggle
            icon="🌙"
            title="Heures silencieuses"
            subtitle={`${quietHoursTime.start} - ${quietHoursTime.end}`}
            value={settings.quietHours}
            onValueChange={(value) => updateSetting('quietHours', value)}
            disabled={!settings.allNotifications}
          />
          <NotificationToggle
            icon="📅"
            title="Notifications le weekend"
            subtitle="Recevoir des notifications samedi et dimanche"
            value={settings.weekendNotifications}
            onValueChange={(value) => updateSetting('weekendNotifications', value)}
            disabled={!settings.allNotifications}
          />
        </NotificationSection>

        {/* Statistiques */}
        <View style={styles.statsSection}>
          <Text style={styles.statsTitle}>Statistiques</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>24</Text>
              <Text style={styles.statLabel}>Cette semaine</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>156</Text>
              <Text style={styles.statLabel}>Ce mois</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>89%</Text>
              <Text style={styles.statLabel}>Taux d'ouverture</Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={handleResetToDefaults}
            activeOpacity={0.7}
          >
            <Text style={styles.resetButtonText}>Réinitialiser par défaut</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F5',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  simpleBackButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.dark,
    letterSpacing: 0.5,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 16,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.xl,
  },

  // Sections
  section: {
    marginTop: SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
  sectionHeader: {
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.dark,
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '400',
  },
  sectionContent: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: '#F0F2F5',
  },

  // Toggle items
  toggleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F5',
  },
  toggleItemDisabled: {
    opacity: 0.5,
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  toggleIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  toggleEmoji: {
    fontSize: 18,
  },
  toggleTextContainer: {
    flex: 1,
  },
  toggleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 2,
  },
  toggleTitleDisabled: {
    color: '#9CA3AF',
  },
  toggleSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '400',
  },
  toggleSubtitleDisabled: {
    color: '#D1D5DB',
  },

  // Statistiques
  statsSection: {
    marginTop: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.dark,
    marginBottom: SPACING.md,
  },
  statsGrid: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: SPACING.lg,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    textAlign: 'center',
  },

  // Actions
  actions: {
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.xl,
  },
  resetButton: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: COLORS.danger + '30',
    borderRadius: 16,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.danger,
  },
});

export default NotificationSettingsScreen;