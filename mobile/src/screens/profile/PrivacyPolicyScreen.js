// mobile/src/screens/profile/PrivacyPolicyScreen.js
import React, { useState } from 'react';
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

const PrivacyPolicyScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const policySection = [
    {
      id: 'introduction',
      title: '1. Introduction',
      content: `Cette politique de confidentialité décrit comment EcommerceApp collecte, utilise et protège vos informations personnelles lorsque vous utilisez notre application mobile et nos services.

En utilisant notre application, vous acceptez les pratiques décrites dans cette politique. Si vous n'acceptez pas cette politique, veuillez ne pas utiliser notre application.`,
    },
    {
      id: 'data-collection',
      title: '2. Informations que nous collectons',
      content: `Nous collectons plusieurs types d'informations :

• Informations d'identification personnelle : nom, adresse email, numéro de téléphone, adresse de livraison
• Informations de compte : mot de passe chiffré, préférences utilisateur
• Données de transaction : historique des commandes, informations de paiement (via des processeurs sécurisés)
• Données d'utilisation : pages visitées, produits consultés, temps passé sur l'application
• Informations techniques : type d'appareil, système d'exploitation, adresse IP
• Données de géolocalisation : avec votre consentement explicite pour la livraison`,
    },
    {
      id: 'data-usage',
      title: '3. Comment nous utilisons vos informations',
      content: `Nous utilisons vos informations pour :

• Traiter et livrer vos commandes
• Gérer votre compte et authentification
• Personnaliser votre expérience d'achat
• Améliorer nos produits et services
• Communiquer avec vous sur vos commandes
• Envoyer des promotions (avec votre consentement)
• Assurer la sécurité et prévenir la fraude
• Respecter nos obligations légales et réglementaires`,
    },
    {
      id: 'data-sharing',
      title: '4. Partage de vos informations',
      content: `Nous ne vendons jamais vos données personnelles. Nous partageons vos informations uniquement avec :

• Processeurs de paiement sécurisés (Stripe, PayPal)
• Services de livraison pour vos commandes
• Prestataires de services techniques (hébergement cloud sécurisé)
• Partenaires d'analyse pour améliorer nos services
• Autorités légales si requis par la loi

Tous nos partenaires sont tenus par des accords de confidentialité stricts.`,
    },
    {
      id: 'data-security',
      title: '5. Sécurité de vos données',
      content: `Nous mettons en place des mesures de sécurité robustes :

• Chiffrement SSL/TLS pour toutes les transmissions
• Chiffrement des données sensibles en base
• Authentification à deux facteurs disponible
• Accès restreint aux données personnelles
• Audits de sécurité réguliers
• Surveillance continue des menaces
• Formation du personnel sur la sécurité des données`,
    },
    {
      id: 'user-rights',
      title: '6. Vos droits',
      content: `Conformément au RGPD et aux lois locales, vous avez le droit de :

• Accéder à vos données personnelles
• Rectifier des informations incorrectes ou incomplètes
• Supprimer vos données (droit à l'oubli)
• Limiter le traitement de vos données
• Portabilité de vos données vers un autre service
• Opposition au traitement pour des raisons légitimes
• Retirer votre consentement à tout moment

Pour exercer ces droits, contactez notre DPO à dpo@ecommerce.ma`,
    },
    {
      id: 'cookies',
      title: '7. Cookies et technologies similaires',
      content: `Nous utilisons des cookies et technologies similaires :

• Cookies essentiels : nécessaires au fonctionnement de l'application
• Cookies de performance : pour analyser l'utilisation et améliorer les services
• Cookies de personnalisation : pour mémoriser vos préférences
• Cookies publicitaires : pour afficher des publicités pertinentes (avec consentement)

Vous pouvez gérer vos préférences cookies dans les paramètres de votre navigateur.`,
    },
    {
      id: 'data-retention',
      title: '8. Conservation des données',
      content: `Nous conservons vos données selon les durées suivantes :

• Données de compte : tant que votre compte est actif + 1 an après suppression
• Historique des commandes : 10 ans (obligations comptables)
• Données de navigation : 13 mois maximum
• Données marketing : jusqu'au retrait du consentement
• Données de support client : 3 ans après résolution du problème

Les données sont automatiquement supprimées à l'expiration de ces délais.`,
    },
    {
      id: 'international-transfers',
      title: '9. Transferts internationaux',
      content: `Vos données peuvent être transférées vers des pays hors UE/EEE uniquement :

• Vers des pays reconnus comme offrant un niveau de protection adéquat
• Avec des garanties appropriées (clauses contractuelles types)
• Avec votre consentement explicite

Nous nous assurons que tous les transferts respectent les standards de protection européens.`,
    },
    {
      id: 'minors',
      title: '10. Protection des mineurs',
      content: `Notre service n'est pas destiné aux personnes de moins de 16 ans. Nous ne collectons pas sciemment d'informations personnelles auprès de mineurs.

Si vous êtes parent et découvrez que votre enfant nous a fourni des informations personnelles, contactez-nous immédiatement pour que nous puissions supprimer ces données.`,
    },
    {
      id: 'updates',
      title: '11. Modifications de cette politique',
      content: `Nous pouvons mettre à jour cette politique de confidentialité périodiquement. Les modifications importantes vous seront notifiées par :

• Notification dans l'application
• Email à votre adresse enregistrée
• Bannière sur notre site web

La date de dernière modification est indiquée en bas de cette politique.`,
    },
    {
      id: 'contact',
      title: '12. Nous contacter',
      content: `Pour toute question concernant cette politique de confidentialité ou vos données personnelles :

Délégué à la Protection des Données (DPO)
Email : dpo@ecommerce.ma
Téléphone : +212 5 22 XX XX XX
Adresse : 123 Avenue Mohammed V, Casablanca, Maroc

Autorité de contrôle compétente : Commission Nationale de contrôle de la protection des Données à caractère Personnel (CNDP)`,
    },
  ];

  const PolicySection = ({ section }) => {
    const isExpanded = expandedSections[section.id];
    
    return (
      <View style={[styles.sectionContainer, { backgroundColor: theme.background }]}>
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection(section.id)}
          activeOpacity={0.7}
        >
          <Text style={[styles.sectionTitle, { color: theme.text }]}>{section.title}</Text>
          <SimpleIcon 
            iconKey={isExpanded ? "chevron-up" : "forward"} 
            containerSize={24} 
            size={14} 
          />
        </TouchableOpacity>
        
        {isExpanded && (
          <View style={styles.sectionContent}>
            <Text style={[styles.sectionText, { color: theme.textSecondary }]}>
              {section.content}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const handleAcceptPolicy = () => {
    Alert.alert(
      'Politique acceptée',
      'Merci d\'avoir pris le temps de lire notre politique de confidentialité. Vos données sont entre de bonnes mains.',
      [{ text: 'Parfait', style: 'default' }]
    );
  };

  const handleContactDPO = () => {
    Alert.alert(
      'Contacter le DPO',
      'Délégué à la Protection des Données\n\nEmail: dpo@ecommerce.ma\nTéléphone: +212 5 22 XX XX XX',
      [
        { text: 'Fermer', style: 'cancel' },
        { text: 'Envoyer un email', onPress: () => Alert.alert('Email', 'Ouverture de l\'application email...') },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.surface }]}>
      <CustomHeader title="Politique de confidentialité" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* En-tête */}
        <View style={[styles.headerInfo, { backgroundColor: theme.background }]}>
          <SimpleIcon iconKey="policy" containerSize={48} size={24} />
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            Politique de confidentialité
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
            Découvrez comment nous protégeons et utilisons vos données personnelles. 
            Cliquez sur chaque section pour en savoir plus.
          </Text>
          <Text style={[styles.lastUpdated, { color: theme.textSecondary }]}>
            Dernière mise à jour : 27 décembre 2024
          </Text>
        </View>

        {/* Sections de la politique */}
        <View style={styles.sectionsContainer}>
          {policySection.map((section) => (
            <PolicySection key={section.id} section={section} />
          ))}
        </View>

        {/* Actions */}
        <View style={[styles.actionsContainer, { backgroundColor: theme.background }]}>
          <Text style={[styles.actionsTitle, { color: theme.text }]}>
            Actions rapides
          </Text>
          
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.primary }]}
            onPress={handleAcceptPolicy}
            activeOpacity={0.8}
          >
            <SimpleIcon iconKey="success" containerSize={32} size={16} />
            <Text style={styles.actionButtonText}>J'ai lu et compris</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButtonSecondary, { borderColor: theme.border }]}
            onPress={handleContactDPO}
            activeOpacity={0.8}
          >
            <SimpleIcon iconKey="contact" containerSize={32} size={16} />
            <Text style={[styles.actionButtonSecondaryText, { color: theme.text }]}>
              Contacter le DPO
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer légal */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.textSecondary }]}>
            © 2024 EcommerceApp. Tous droits réservés.
          </Text>
          <Text style={[styles.footerSubtext, { color: theme.textSecondary }]}>
            Conforme au RGPD et aux lois marocaines sur la protection des données
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

  // En-tête
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
    fontSize: 22,
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
    marginBottom: SPACING.sm,
  },
  lastUpdated: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },

  // Sections
  sectionsContainer: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  sectionContainer: {
    marginBottom: SPACING.sm,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.dark,
    flex: 1,
  },
  sectionContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  sectionText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 22,
  },

  // Actions
  actionsContainer: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  actionsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.dark,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: 25,
    marginBottom: SPACING.md,
  },
  actionButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: SPACING.sm,
  },
  actionButtonSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: 25,
  },
  actionButtonSecondaryText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: SPACING.sm,
  },

  // Footer
  footer: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    marginTop: SPACING.lg,
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 11,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});

export default PrivacyPolicyScreen;