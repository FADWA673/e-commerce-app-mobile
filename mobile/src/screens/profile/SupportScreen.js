// mobile/src/screens/profile/SupportScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Linking,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import CustomHeader from '../../components/common/CustomHeader';
import Button from '../../components/common/Button';
import ProfessionalIcon from '../../components/common/ProfessionalIcon';
import { COLORS, SPACING } from '../../utils/constants';

const SupportScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [message, setMessage] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const supportCategories = [
    { 
      id: 'order', 
      title: 'Commandes', 
      icon: { name: 'receipt-outline', type: 'ionicons' }, 
      description: 'Problèmes avec vos commandes',
      color: '#FF6B6B'
    },
    { 
      id: 'payment', 
      title: 'Paiement', 
      icon: { name: 'card-outline', type: 'ionicons' }, 
      description: 'Questions sur les paiements',
      color: '#4ECDC4'
    },
    { 
      id: 'account', 
      title: 'Compte', 
      icon: { name: 'person-circle-outline', type: 'ionicons' }, 
      description: 'Gestion de votre compte',
      color: '#45B7D1'
    },
    { 
      id: 'technical', 
      title: 'Technique', 
      icon: { name: 'settings-outline', type: 'ionicons' }, 
      description: 'Problèmes techniques',
      color: '#F39C12'
    },
    { 
      id: 'other', 
      title: 'Autre', 
      icon: { name: 'help-circle-outline', type: 'ionicons' }, 
      description: 'Autres questions',
      color: '#9B59B6'
    },
  ];

  const faqItems = [
    {
      id: 1,
      question: 'Comment suivre ma commande ?',
      answer: 'Vous pouvez suivre votre commande dans la section "Mes Commandes" de votre profil. Vous recevrez également des notifications par email à chaque étape.',
    },
    {
      id: 2,
      question: 'Quels sont les modes de paiement acceptés ?',
      answer: 'Nous acceptons les cartes bancaires (Visa, Mastercard), les virements bancaires, et le paiement à la livraison dans certaines zones.',
    },
    {
      id: 3,
      question: 'Comment modifier ou annuler ma commande ?',
      answer: 'Vous pouvez modifier ou annuler votre commande dans les 2 heures suivant la confirmation, depuis la section "Mes Commandes".',
    },
    {
      id: 4,
      question: 'Quelle est la politique de retour ?',
      answer: 'Vous avez 14 jours pour retourner un article non utilisé dans son emballage d\'origine. Les frais de retour sont à votre charge sauf en cas de défaut.',
    },
    {
      id: 5,
      question: 'Comment contacter le service client ?',
      answer: 'Vous pouvez nous contacter par email à support@ecommerce.ma, par téléphone au +212 5XX-XXXXXX, ou via ce formulaire de contact.',
    },
  ];

  const contactMethods = [
    {
      id: 'email',
      title: 'Email',
      subtitle: 'support@ecommerce.ma',
      icon: { name: 'mail-outline', type: 'ionicons' },
      color: '#FF6B6B',
      action: () => Linking.openURL('mailto:support@ecommerce.ma'),
    },
    {
      id: 'phone',
      title: 'Téléphone',
      subtitle: '+212 5XX-XXXXXX',
      icon: { name: 'call-outline', type: 'ionicons' },
      color: '#4ECDC4',
      action: () => Linking.openURL('tel:+2125XXXXXXXX'),
    },
    {
      id: 'whatsapp',
      title: 'WhatsApp',
      subtitle: 'Chat en direct',
      icon: { name: 'logo-whatsapp', type: 'ionicons' },
      color: '#25D366',
      action: () => Linking.openURL('https://wa.me/2125XXXXXXXX'),
    },
    {
      id: 'facebook',
      title: 'Facebook',
      subtitle: '@EcommerceApp',
      icon: { name: 'logo-facebook', type: 'ionicons' },
      color: '#1877F2',
      action: () => Linking.openURL('https://facebook.com/ecommerceapp'),
    },
  ];

  const handleSendMessage = () => {
    if (!selectedCategory) {
      Alert.alert('Erreur', 'Veuillez sélectionner une catégorie');
      return;
    }
    if (!message.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir votre message');
      return;
    }

    Alert.alert(
      'Message envoyé',
      'Votre message a été envoyé avec succès. Notre équipe vous répondra dans les 24h.',
      [
        {
          text: 'OK',
          onPress: () => {
            setMessage('');
            setSelectedCategory(null);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const SupportSection = ({ title, children }) => (
    <View style={[styles.section, { backgroundColor: theme.background }]}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>{title}</Text>
      {children}
    </View>
  );

  const CategoryItem = ({ category }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        { 
          backgroundColor: selectedCategory === category.id ? category.color + '15' : theme.surface,
          borderColor: selectedCategory === category.id ? category.color : theme.border,
        }
      ]}
      onPress={() => setSelectedCategory(category.id)}
      activeOpacity={0.7}
    >
      <View style={[
        styles.categoryIconContainer,
        { backgroundColor: category.color + '20' }
      ]}>
        <ProfessionalIcon 
          name={category.icon.name}
          type={category.icon.type}
          size={24}
          color={category.color}
        />
      </View>
      <View style={styles.categoryInfo}>
        <Text style={[
          styles.categoryTitle,
          { 
            color: selectedCategory === category.id ? category.color : theme.text,
            fontWeight: selectedCategory === category.id ? '700' : '600',
          }
        ]}>
          {category.title}
        </Text>
        <Text style={[styles.categoryDesc, { color: theme.textSecondary }]}>
          {category.description}
        </Text>
      </View>
      {selectedCategory === category.id && (
        <View style={[styles.checkmarkContainer, { backgroundColor: category.color }]}>
          <ProfessionalIcon 
            name="checkmark"
            type="ionicons"
            size={16}
            color="#FFFFFF"
          />
        </View>
      )}
    </TouchableOpacity>
  );

  const FAQItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.faqItem, { borderBottomColor: theme.border }]}
      onPress={() => setExpandedFAQ(expandedFAQ === item.id ? null : item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.faqHeader}>
        <View style={styles.faqQuestionContainer}>
          <ProfessionalIcon 
            name="help-circle-outline"
            type="ionicons"
            size={20}
            color={theme.primary}
          />
          <Text style={[styles.faqQuestion, { color: theme.text }]}>{item.question}</Text>
        </View>
        <View style={[
          styles.faqToggleContainer,
          { backgroundColor: expandedFAQ === item.id ? theme.primary : theme.surface }
        ]}>
          <ProfessionalIcon 
            name={expandedFAQ === item.id ? "chevron-up-outline" : "chevron-down-outline"}
            type="ionicons"
            size={16}
            color={expandedFAQ === item.id ? "#FFFFFF" : theme.primary}
          />
        </View>
      </View>
      {expandedFAQ === item.id && (
        <View style={styles.faqAnswerContainer}>
          <ProfessionalIcon 
            name="information-circle-outline"
            type="ionicons"
            size={16}
            color={theme.textSecondary}
          />
          <Text style={[styles.faqAnswer, { color: theme.textSecondary }]}>{item.answer}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const ContactMethod = ({ method }) => (
    <TouchableOpacity
      style={[styles.contactMethod, { backgroundColor: theme.surface, borderColor: theme.border }]}
      onPress={method.action}
      activeOpacity={0.7}
    >
      <View style={[styles.contactIconContainer, { backgroundColor: method.color + '15' }]}>
        <ProfessionalIcon 
          name={method.icon.name}
          type={method.icon.type}
          size={24}
          color={method.color}
        />
      </View>
      <View style={styles.contactInfo}>
        <Text style={[styles.contactTitle, { color: theme.text }]}>{method.title}</Text>
        <Text style={[styles.contactSubtitle, { color: theme.textSecondary }]}>
          {method.subtitle}
        </Text>
      </View>
      <View style={[styles.contactArrowContainer, { backgroundColor: theme.primary + '10' }]}>
        <ProfessionalIcon 
          name="chevron-forward-outline"
          type="ionicons"
          size={16}
          color={theme.primary}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.surface }]}>
      <CustomHeader title="Centre d'aide" />

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* FAQ */}
        <SupportSection title="Questions fréquentes">
          {faqItems.map(item => (
            <FAQItem key={item.id} item={item} />
          ))}
        </SupportSection>

        {/* Contact rapide */}
        <SupportSection title="Nous contacter">
          <View style={styles.contactGrid}>
            {contactMethods.map(method => (
              <ContactMethod key={method.id} method={method} />
            ))}
          </View>
        </SupportSection>

        {/* Formulaire de contact */}
        <SupportSection title="Envoyer un message">
          <Text style={[styles.formLabel, { color: theme.text }]}>Catégorie du problème</Text>
          <View style={styles.categoriesGrid}>
            {supportCategories.map(category => (
              <CategoryItem key={category.id} category={category} />
            ))}
          </View>

          <Text style={[styles.formLabel, { color: theme.text }]}>Votre message</Text>
          <TextInput
            style={[
              styles.messageInput,
              { 
                backgroundColor: theme.surface,
                borderColor: theme.border,
                color: theme.text,
              }
            ]}
            placeholder="Décrivez votre problème en détail..."
            placeholderTextColor={theme.textSecondary}
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />

          <Button
            title="Envoyer le message"
            onPress={handleSendMessage}
            style={styles.sendButton}
          />
        </SupportSection>

        {/* Informations utiles */}
        <View style={[styles.infoSection, { backgroundColor: theme.background }]}>
          <View style={styles.infoHeader}>
            <ProfessionalIcon 
              name="information-circle-outline"
              type="ionicons"
              size={20}
              color={theme.primary}
            />
            <Text style={[styles.infoTitle, { color: theme.text }]}>Informations utiles</Text>
          </View>
          <View style={styles.infoList}>
            <View style={styles.infoItem}>
              <ProfessionalIcon 
                name="time-outline"
                type="ionicons"
                size={16}
                color={theme.textSecondary}
              />
              <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                Notre équipe répond sous 24h en moyenne
              </Text>
            </View>
            <View style={styles.infoItem}>
              <ProfessionalIcon 
                name="flash-outline"
                type="ionicons"
                size={16}
                color={theme.textSecondary}
              />
              <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                Pour les urgences, utilisez le chat WhatsApp
              </Text>
            </View>
            <View style={styles.infoItem}>
              <ProfessionalIcon 
                name="library-outline"
                type="ionicons"
                size={16}
                color={theme.textSecondary}
              />
              <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                Consultez d'abord la FAQ pour une réponse rapide
              </Text>
            </View>
            <View style={styles.infoItem}>
              <ProfessionalIcon 
                name="camera-outline"
                type="ionicons"
                size={16}
                color={theme.textSecondary}
              />
              <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                Joignez des captures d'écran si nécessaire
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
  },

  // Sections
  section: {
    borderRadius: 20,
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: SPACING.lg,
    letterSpacing: 0.3,
  },

  // FAQ
  faqItem: {
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: SPACING.md,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: SPACING.sm,
    flex: 1,
    lineHeight: 22,
  },
  faqToggleContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  faqAnswerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: SPACING.lg,
    paddingLeft: SPACING.sm,
  },
  faqAnswer: {
    fontSize: 14,
    lineHeight: 22,
    marginLeft: SPACING.sm,
    flex: 1,
  },

  // Contact methods
  contactGrid: {
    gap: SPACING.md,
  },
  contactMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    borderRadius: 16,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  contactIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  contactSubtitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  contactArrowContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Form
  formLabel: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: SPACING.md,
    marginTop: SPACING.lg,
    letterSpacing: 0.2,
  },
  categoriesGrid: {
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    borderRadius: 16,
    borderWidth: 2,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  categoryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  categoryDesc: {
    fontSize: 14,
    fontWeight: '500',
  },
  checkmarkContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  messageInput: {
    borderWidth: 2,
    borderRadius: 16,
    padding: SPACING.lg,
    fontSize: 16,
    minHeight: 120,
    marginBottom: SPACING.lg,
    fontWeight: '500',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  sendButton: {
    marginTop: SPACING.md,
    borderRadius: 16,
    elevation: 3,
  },

  // Info section
  infoSection: {
    borderRadius: 20,
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginLeft: SPACING.sm,
    letterSpacing: 0.2,
  },
  infoList: {
    gap: SPACING.md,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    marginLeft: SPACING.sm,
    flex: 1,
    fontWeight: '500',
  },
});

export default SupportScreen;