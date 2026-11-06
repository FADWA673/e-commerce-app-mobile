// mobile/src/screens/profile/PrivacyScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import CustomHeader from '../../components/common/CustomHeader';
import { SimpleIcon } from '../../components/common/ProfessionalIcon';
import { COLORS, SPACING } from '../../utils/constants';

const PrivacyScreen = ({ navigation }) => {
  const { theme } = useTheme();

  const privacyOptions = [
    {
      id: 'data-collection',
      title: 'Collecte de données',
      subtitle: 'Quelles données nous collectons',
      iconKey: 'personalInfo',
      onPress: () => showDataCollection(),
    },
    {
      id: 'data-usage',
      title: 'Utilisation des données',
      subtitle: 'Comment nous utilisons vos informations',
      iconKey: 'info',
      onPress: () => showDataUsage(),
    },
    {
      id: 'data-sharing',
      title: 'Partage des données',
      subtitle: 'Avec qui nous partageons vos données',
      iconKey: 'contact',
      onPress: () => showDataSharing(),
    },
    {
      id: 'data-security',
      title: 'Sécurité des données',
      subtitle: 'Comment nous protégeons vos informations',
      iconKey: 'privacy',
      onPress: () => showDataSecurity(),
    },
    {
      id: 'cookies',
      title: 'Cookies et technologies',
      subtitle: 'Utilisation des cookies et traceurs',
      iconKey: 'notificationSettings',
      onPress: () => showCookiesPolicy(),
    },
    {
      id: 'user-rights',
      title: 'Vos droits',
      subtitle: 'Droits sur vos données personnelles',
      iconKey: 'help',
      onPress: () => showUserRights(),
    },
    {
      id: 'data-retention',
      title: 'Conservation des données',
      subtitle: 'Durée de conservation de vos informations',
      iconKey: 'version',
      onPress: () => showDataRetention(),
    },
    {
      id: 'contact-dpo',
      title: 'Contacter le DPO',
      subtitle: 'Délégué à la protection des données',
      iconKey: 'email',
      onPress: () => handleContactDPO(),
    },
  ];

  const showDataCollection = () => {
    Alert.alert(
      'Collecte de données',
      'Nous collectons les informations suivantes :\n\n• Informations d\'identification (nom, email, téléphone)\n• Données de navigation et d\'utilisation\n• Informations de commande et de paiement\n• Préférences et historique d\'achat\n• Données de géolocalisation (avec votre consentement)\n• Informations techniques de l\'appareil',
      [{ text: 'Compris', style: 'default' }]
    );
  };

  const showDataUsage = () => {
    Alert.alert(
      'Utilisation des données',
      'Nous utilisons vos données pour :\n\n• Traiter vos commandes et paiements\n• Personnaliser votre expérience\n• Améliorer nos services\n• Vous envoyer des communications marketing (avec consentement)\n• Assurer la sécurité de la plateforme\n• Respecter nos obligations légales',
      [{ text: 'Compris', style: 'default' }]
    );
  };

  const showDataSharing = () => {
    Alert.alert(
      'Partage des données',
      'Nous partageons vos données uniquement avec :\n\n• Nos partenaires de paiement sécurisé\n• Services de livraison pour vos commandes\n• Prestataires techniques (hébergement, analytics)\n• Autorités légales si requis par la loi\n\nNous ne vendons jamais vos données personnelles à des tiers.',
      [{ text: 'Compris', style: 'default' }]
    );
  };

  const showDataSecurity = () => {
    Alert.alert(
      'Sécurité des données',
      'Nous protégeons vos données par :\n\n• Chiffrement SSL/TLS pour toutes les transmissions\n• Stockage sécurisé avec chiffrement\n• Accès restreint aux données personnelles\n• Audits de sécurité réguliers\n• Conformité aux standards internationaux\n• Formation du personnel sur la protection des données',
      [{ text: 'Compris', style: 'default' }]
    );
  };

  const showCookiesPolicy = () => {
    Alert.alert(
      'Cookies et technologies',
      'Nous utilisons :\n\n• Cookies essentiels pour le fonctionnement\n• Cookies de performance et analytics\n• Cookies de personnalisation\n• Cookies publicitaires (avec consentement)\n\nVous pouvez gérer vos préférences cookies dans les paramètres de votre navigateur.',
      [{ text: 'Compris', style: 'default' }]
    );
  };

  const showUserRights = () => {
    Alert.alert(
      'Vos droits',
      'Vous avez le droit de :\n\n• Accéder à vos données personnelles\n• Rectifier des informations incorrectes\n• Supprimer vos données (droit à l\'oubli)\n• Limiter le traitement de vos données\n• Portabilité de vos données\n• Opposition au traitement\n• Retirer votre consentement à tout moment',
      [
        { text: 'Fermer', style: 'cancel' },
        { text: 'Exercer mes droits', onPress: () => handleContactDPO() }
      ]
    );
  };

  const showDataRetention = () => {
    Alert.alert(
      'Conservation des données',
      'Durées de conservation :\n\n• Données de compte : tant que le compte est actif\n• Historique des commandes : 10 ans (obligations comptables)\n• Données de navigation : 13 mois maximum\n• Données marketing : jusqu\'au retrait du consentement\n• Données de support : 3 ans après résolution\n\nSuppression automatique à l\'expiration.',
      [{ text: 'Compris', style: 'default' }]
    );
  };

  const handleContactDPO = () => {
    Alert.alert(
      'Contacter le DPO',
      'Délégué à la Protection des Données\n\nEmail: dpo@ecommerce.ma\nTéléphone: +212 5 22 XX XX XX\n\nVous pouvez nous contacter pour toute question concernant vos données personnelles ou pour exercer vos droits.',
      [
        { text: 'Fermer', style: 'cancel' },
        { text: 'Envoyer un email', onPress: () => Alert.alert('Email', 'Ouverture de l\'application email...') },
      ]
    );
  };

  const PrivacyOption = ({ option }) => (
    <TouchableOpacity
      style={[styles.optionItem, { borderBottomColor: theme.border }]}
      onPress={option.onPress}
      activeOpacity={0.7}
    >
      <View style={styles.optionLeft}>
        <SimpleIcon iconKey={option.iconKey} />
        <View style={styles.optionTextContainer}>
          <Text style={[styles.optionTitle, { color: theme.text }]}>{option.title}</Text>
          <Text style={[styles.optionSubtitle, { color: theme.textSecondary }]}>{option.subtitle}</Text>
        </View>
      </View>
      <SimpleIcon iconKey="forward" containerSize={24} size={14} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.surface }]}>
      <CustomHeader title="Confidentialité" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* En-tête informatif */}
        <View style={[styles.headerInfo, { backgroundColor: theme.background }]}>
          <SimpleIcon iconKey="privacy" containerSize={48} size={24} />
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            Protection de vos données
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
            Nous nous engageons à protéger et respecter votre vie privée. 
            Découvrez comment nous collectons, utilisons et protégeons vos données personnelles.
          </Text>
        </View>

        {/* Options de confidentialité */}
        <View style={[styles.optionsContainer, { backgroundColor: theme.background }]}>
          {privacyOptions.map((option) => (
            <PrivacyOption key={option.id} option={option} />
          ))}
        </View>

        {/* Informations de contact */}
        <View style={[styles.contactInfo, { backgroundColor: theme.background }]}>
          <Text style={[styles.contactTitle, { color: theme.text }]}>
            Questions sur la confidentialité ?
          </Text>
          <Text style={[styles.contactText, { color: theme.textSecondary }]}>
            Notre équipe de protection des données est là pour vous aider. 
            N'hésitez pas à nous contacter pour toute question.
          </Text>
          <TouchableOpacity
            style={[styles.contactButton, { backgroundColor: theme.primary }]}
            onPress={handleContactDPO}
            activeOpacity={0.8}
          >
            <SimpleIcon iconKey="email" containerSize={32} size={16} />
            <Text style={styles.contactButtonText}>Contacter le DPO</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.textSecondary }]}>
            Dernière mise à jour : Décembre 2024
          </Text>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.xl,
  },

  // En-tête informatif
  headerInfo: {
    margin: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.dark,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },

  // Container des options
  optionsContainer: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },

  // Options de confidentialité
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F5',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionTextContainer: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },

  // Informations de contact
  contactInfo: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.dark,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  contactText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: SPACING.lg,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: 25,
  },
  contactButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: SPACING.sm,
  },

  // Footer
  footer: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});

export default PrivacyScreen;