// mobile/src/screens/profile/TermsScreen.js
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

const TermsScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const termsSection = [
    {
      id: 'acceptance',
      title: '1. Acceptation des conditions',
      content: `En accédant et en utilisant l'application EcommerceApp, vous acceptez d'être lié par ces conditions d'utilisation et toutes les lois et réglementations applicables.

Si vous n'acceptez pas l'une de ces conditions, vous n'êtes pas autorisé à utiliser ou accéder à cette application.`,
    },
    {
      id: 'description',
      title: '2. Description du service',
      content: `EcommerceApp est une plateforme de commerce électronique qui permet aux utilisateurs de :

• Parcourir et acheter des produits
• Gérer leur compte et leurs commandes
• Suivre leurs livraisons
• Accéder au support client
• Gérer leurs préférences et favoris

Nous nous réservons le droit de modifier, suspendre ou interrompre tout aspect du service à tout moment.`,
    },
    {
      id: 'account',
      title: '3. Compte utilisateur',
      content: `Pour utiliser certaines fonctionnalités, vous devez créer un compte. Vous vous engagez à :

• Fournir des informations exactes et complètes
• Maintenir la sécurité de votre mot de passe
• Nous notifier immédiatement de toute utilisation non autorisée
• Être responsable de toutes les activités sous votre compte

Nous nous réservons le droit de suspendre ou supprimer des comptes qui violent ces conditions.`,
    },
    {
      id: 'orders',
      title: '4. Commandes et paiements',
      content: `En passant une commande, vous acceptez que :

• Toutes les commandes sont soumises à acceptation
• Les prix peuvent changer sans préavis
• Nous nous réservons le droit d'annuler des commandes
• Les paiements sont traités de manière sécurisée
• Les frais de livraison s'appliquent selon nos tarifs
• Les délais de livraison sont indicatifs

Vous êtes responsable de tous les frais associés à vos commandes.`,
    },
    {
      id: 'returns',
      title: '5. Retours et remboursements',
      content: `Notre politique de retour prévoit :

• Droit de rétractation de 14 jours pour les achats en ligne
• Produits retournés dans leur état d'origine
• Frais de retour à la charge du client (sauf défaut)
• Remboursement sous 14 jours après réception du retour
• Certains produits ne peuvent pas être retournés (hygiène, personnalisés)

Contactez notre service client pour initier un retour.`,
    },
    {
      id: 'intellectual-property',
      title: '6. Propriété intellectuelle',
      content: `Tous les contenus de l'application sont protégés par des droits d'auteur :

• Marques, logos, et designs sont notre propriété
• Images et descriptions de produits sont protégées
• Vous ne pouvez pas reproduire, distribuer ou modifier le contenu
• Utilisation autorisée uniquement pour un usage personnel
• Toute violation sera poursuivie selon la loi

Respectez les droits de propriété intellectuelle de tous les tiers.`,
    },
    {
      id: 'prohibited-uses',
      title: '7. Utilisations interdites',
      content: `Il est interdit d'utiliser l'application pour :

• Activités illégales ou frauduleuses
• Harcèlement ou comportement abusif
• Transmission de virus ou codes malveillants
• Tentatives d'accès non autorisé aux systèmes
• Collecte d'informations sur d'autres utilisateurs
• Utilisation de robots ou scripts automatisés
• Contournement des mesures de sécurité

Toute violation entraînera la suspension immédiate du compte.`,
    },
    {
      id: 'liability',
      title: '8. Limitation de responsabilité',
      content: `Notre responsabilité est limitée dans les cas suivants :

• Interruptions de service ou maintenance
• Erreurs dans les informations produits
• Problèmes de livraison dus à des tiers
• Pertes indirectes ou dommages consécutifs
• Utilisation inappropriée de l'application

Notre responsabilité totale ne peut excéder le montant de votre dernière commande.`,
    },
    {
      id: 'privacy',
      title: '9. Protection des données',
      content: `Vos données personnelles sont traitées conformément à :

• Notre politique de confidentialité
• Le Règlement Général sur la Protection des Données (RGPD)
• Les lois marocaines sur la protection des données
• Les meilleures pratiques de sécurité

Consultez notre politique de confidentialité pour plus de détails sur le traitement de vos données.`,
    },
    {
      id: 'modifications',
      title: '10. Modifications des conditions',
      content: `Nous nous réservons le droit de modifier ces conditions à tout moment :

• Les modifications prennent effet immédiatement
• Vous serez notifié des changements importants
• L'utilisation continue constitue une acceptation
• Consultez régulièrement cette page pour les mises à jour

Si vous n'acceptez pas les modifications, cessez d'utiliser l'application.`,
    },
    {
      id: 'termination',
      title: '11. Résiliation',
      content: `Ces conditions restent en vigueur jusqu'à résiliation :

• Vous pouvez supprimer votre compte à tout moment
• Nous pouvons suspendre l'accès en cas de violation
• Certaines clauses survivent à la résiliation
• Les commandes en cours restent soumises aux conditions

La résiliation n'affecte pas les droits et obligations antérieurs.`,
    },
    {
      id: 'governing-law',
      title: '12. Droit applicable',
      content: `Ces conditions sont régies par :

• Le droit marocain
• Les tribunaux de Casablanca ont compétence exclusive
• Tentative de résolution amiable avant tout litige
• Médiation possible pour certains différends

Pour toute question juridique, contactez notre service juridique à legal@ecommerce.ma`,
    },
  ];

  const TermsSection = ({ section }) => {
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

  const handleAcceptTerms = () => {
    Alert.alert(
      'Conditions acceptées',
      'Merci d\'avoir pris le temps de lire nos conditions d\'utilisation. Vous pouvez maintenant utiliser l\'application en toute sérénité.',
      [{ text: 'Parfait', style: 'default' }]
    );
  };

  const handleContactLegal = () => {
    Alert.alert(
      'Contact juridique',
      'Service juridique EcommerceApp\n\nEmail: legal@ecommerce.ma\nTéléphone: +212 5 22 XX XX XX',
      [
        { text: 'Fermer', style: 'cancel' },
        { text: 'Envoyer un email', onPress: () => Alert.alert('Email', 'Ouverture de l\'application email...') },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.surface }]}>
      <CustomHeader title="Conditions d'utilisation" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* En-tête */}
        <View style={[styles.headerInfo, { backgroundColor: theme.background }]}>
          <SimpleIcon iconKey="terms" containerSize={48} size={24} />
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            Conditions d'utilisation
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
            Ces conditions régissent votre utilisation de l'application EcommerceApp. 
            Veuillez les lire attentivement.
          </Text>
          <Text style={[styles.lastUpdated, { color: theme.textSecondary }]}>
            Dernière mise à jour : 27 décembre 2024
          </Text>
        </View>

        {/* Sections des conditions */}
        <View style={styles.sectionsContainer}>
          {termsSection.map((section) => (
            <TermsSection key={section.id} section={section} />
          ))}
        </View>

        {/* Actions */}
        <View style={[styles.actionsContainer, { backgroundColor: theme.background }]}>
          <Text style={[styles.actionsTitle, { color: theme.text }]}>
            Actions rapides
          </Text>
          
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.primary }]}
            onPress={handleAcceptTerms}
            activeOpacity={0.8}
          >
            <SimpleIcon iconKey="success" containerSize={32} size={16} />
            <Text style={styles.actionButtonText}>J'accepte les conditions</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButtonSecondary, { borderColor: theme.border }]}
            onPress={handleContactLegal}
            activeOpacity={0.8}
          >
            <SimpleIcon iconKey="contact" containerSize={32} size={16} />
            <Text style={[styles.actionButtonSecondaryText, { color: theme.text }]}>
              Contact juridique
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer légal */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.textSecondary }]}>
            © 2024 EcommerceApp. Tous droits réservés.
          </Text>
          <Text style={[styles.footerSubtext, { color: theme.textSecondary }]}>
            Conforme au droit marocain et aux standards internationaux
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

export default TermsScreen;