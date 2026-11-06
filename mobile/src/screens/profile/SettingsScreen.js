// mobile/src/screens/profile/SettingsScreen.js
import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  Alert,
} from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import CustomHeader from '../../components/common/CustomHeader';
import { SettingsIcon, SimpleIcon } from '../../components/common/ProfessionalIcon';
import { COLORS, SPACING } from '../../utils/constants';

const SettingsScreen = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);
  const { isDarkMode, toggleTheme, theme } = useTheme();
  
  // États pour les paramètres locaux
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);

  const handleDeleteAccount = () => {
    Alert.alert(
      'Supprimer le compte',
      'Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            // Logique de suppression du compte
            Alert.alert('Compte supprimé', 'Votre compte a été supprimé avec succès');
            await logout();
          },
        },
      ]
    );
  };

  const SettingSection = ({ title, children }) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>{title}</Text>
      <View style={[styles.sectionContent, { backgroundColor: theme.background }]}>{children}</View>
    </View>
  );

  const SettingItem = ({ iconKey, title, subtitle, onPress, showArrow = true }) => (
    <TouchableOpacity
      style={[styles.settingItem, { borderBottomColor: theme.border }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.settingItemLeft}>
        <SimpleIcon iconKey={iconKey} />
        <View style={styles.settingTextContainer}>
          <Text style={[styles.settingTitle, { color: theme.text }]}>{title}</Text>
          {subtitle && <Text style={[styles.settingSubtitle, { color: theme.textSecondary }]}>{subtitle}</Text>}
        </View>
      </View>
      {showArrow && <SimpleIcon iconKey="forward" containerSize={24} size={14} />}
    </TouchableOpacity>
  );

  const SettingToggle = ({ iconKey, title, subtitle, value, onValueChange }) => (
    <View style={[styles.settingItem, { borderBottomColor: theme.border }]}>
      <View style={styles.settingItemLeft}>
        <SimpleIcon iconKey={iconKey} />
        <View style={styles.settingTextContainer}>
          <Text style={[styles.settingTitle, { color: theme.text }]}>{title}</Text>
          {subtitle && <Text style={[styles.settingSubtitle, { color: theme.textSecondary }]}>{subtitle}</Text>}
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: theme.border, true: theme.primary + '80' }}
        thumbColor={value ? theme.primary : theme.surface}
      />
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.surface }]}>
      <CustomHeader title="Paramètres" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Compte */}
        <SettingSection title="Compte">
          <SettingItem
            iconKey="personalInfo"
            title="Informations personnelles"
            subtitle="Nom, email, téléphone"
            onPress={() => navigation.navigate('AccountInfo')}
          />
          <SettingItem
            iconKey="password"
            title="Mot de passe"
            subtitle="Changer votre mot de passe"
            onPress={() => navigation.navigate('ChangePassword')}
          />
          <SettingItem
            iconKey="email"
            title="Email"
            subtitle="Gérer votre adresse email"
            onPress={() => navigation.navigate('EmailSettings')}
          />
        </SettingSection>

        {/* Notifications */}
        <SettingSection title="Notifications">
          <SettingItem
            iconKey="notificationSettings"
            title="Gérer les notifications"
            subtitle="Personnaliser vos préférences"
            onPress={() => navigation.navigate('NotificationSettings')}
          />
          <SettingToggle
            iconKey="emailNotifications"
            title="Notifications par email"
            subtitle="Recevoir des emails"
            value={emailNotifications}
            onValueChange={setEmailNotifications}
          />
          <SettingToggle
            iconKey="pushNotifications"
            title="Notifications push"
            subtitle="Recevoir des notifications sur votre appareil"
            value={pushNotifications}
            onValueChange={setPushNotifications}
          />
        </SettingSection>

        {/* Préférences */}
        <SettingSection title="Préférences">
          <SettingToggle
            iconKey="darkMode"
            title="Mode sombre"
            subtitle="Activer le thème sombre"
            value={isDarkMode}
            onValueChange={toggleTheme}
          />
          <SettingItem
            iconKey="language"
            title="Langue"
            subtitle="Français"
            onPress={() => navigation.navigate('LanguageSettings')}
          />
          <SettingItem
            iconKey="currency"
            title="Devise"
            subtitle="MAD (Dirham marocain)"
            onPress={() => navigation.navigate('CurrencySettings')}
          />
        </SettingSection>

        {/* Confidentialité et sécurité */}
        <SettingSection title="Confidentialité et sécurité">
          <SettingItem
            iconKey="privacy"
            title="Confidentialité"
            subtitle="Gérer vos données personnelles"
            onPress={() => navigation.navigate('Privacy')}
          />
          <SettingItem
            iconKey="terms"
            title="Conditions d'utilisation"
            subtitle="Lire les conditions"
            onPress={() => navigation.navigate('Terms')}
          />
          <SettingItem
            iconKey="policy"
            title="Politique de confidentialité"
            subtitle="Comment nous protégeons vos données"
            onPress={() => navigation.navigate('PrivacyPolicy')}
          />
        </SettingSection>

        {/* Support */}
        <SettingSection title="Support">
          <SettingItem
            iconKey="help"
            title="Centre d'aide"
            subtitle="FAQ et guides"
            onPress={() => navigation.navigate('Support')}
          />
          <SettingItem
            iconKey="contact"
            title="Nous contacter"
            subtitle="support@ecommerce.ma"
            onPress={() => Alert.alert('Contact', 'Email: support@ecommerce.ma')}
          />
          <SettingItem
            iconKey="rating"
            title="Évaluer l'application"
            subtitle="Donnez-nous votre avis"
            onPress={() => navigation.navigate('Rating')}
          />
        </SettingSection>

        {/* Zone dangereuse */}
        <View style={styles.dangerZone}>
          <Text style={styles.dangerZoneTitle}>Zone dangereuse</Text>
          <TouchableOpacity
            style={styles.dangerButton}
            onPress={handleDeleteAccount}
            activeOpacity={0.7}
          >
            <View style={styles.dangerButtonContent}>
              <SimpleIcon 
                iconKey="delete" 
                containerSize={44}
                style={{
                  backgroundColor: COLORS.danger + '15',
                }}
              />
              <View style={styles.dangerTextContainer}>
                <Text style={styles.dangerButtonText}>Supprimer mon compte</Text>
                <Text style={styles.dangerButtonSubtext}>
                  Cette action est irréversible
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2024 EcommerceApp</Text>
          <Text style={styles.footerSubtext}>Tous droits réservés</Text>
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: COLORS.dark,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.dark,
    letterSpacing: 0.5,
  },
  headerRight: {
    width: 40,
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
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.xs,
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

  // Setting items
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F5',
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingTextContainer: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 2,
    letterSpacing: 0.2,
  },
  settingSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '400',
  },

  // Zone dangereuse
  dangerZone: {
    marginTop: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  dangerZoneTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.danger,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.xs,
  },
  dangerButton: {
    backgroundColor: '#FFF5F5',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.danger + '30',
    overflow: 'hidden',
  },
  dangerButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
  dangerTextContainer: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  dangerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.danger,
    marginBottom: 2,
    letterSpacing: 0.2,
  },
  dangerButtonSubtext: {
    fontSize: 13,
    color: COLORS.danger + 'CC',
    fontWeight: '400',
  },

  // Footer
  footer: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    marginTop: SPACING.lg,
  },
  footerText: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '500',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '400',
  },
});

export default SettingsScreen;
