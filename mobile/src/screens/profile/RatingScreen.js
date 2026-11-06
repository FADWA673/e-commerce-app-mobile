// mobile/src/screens/profile/RatingScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import CustomHeader from '../../components/common/CustomHeader';
import { SimpleIcon } from '../../components/common/ProfessionalIcon';
import { COLORS, SPACING } from '../../utils/constants';

const RatingScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const ratingCategories = [
    {
      id: 'interface',
      title: 'Interface utilisateur',
      subtitle: 'Design et facilité d\'utilisation',
      iconKey: 'settings',
    },
    {
      id: 'performance',
      title: 'Performance',
      subtitle: 'Rapidité et fluidité',
      iconKey: 'loading',
    },
    {
      id: 'products',
      title: 'Catalogue produits',
      subtitle: 'Variété et qualité des produits',
      iconKey: 'products',
    },
    {
      id: 'delivery',
      title: 'Livraison',
      subtitle: 'Rapidité et fiabilité',
      iconKey: 'location',
    },
    {
      id: 'support',
      title: 'Service client',
      subtitle: 'Qualité du support',
      iconKey: 'contact',
    },
    {
      id: 'general',
      title: 'Expérience générale',
      subtitle: 'Satisfaction globale',
      iconKey: 'rating',
    },
  ];

  const ratingTexts = {
    1: { text: 'Très insatisfait', color: '#EF4444', emoji: '😞' },
    2: { text: 'Insatisfait', color: '#F97316', emoji: '😕' },
    3: { text: 'Neutre', color: '#EAB308', emoji: '😐' },
    4: { text: 'Satisfait', color: '#22C55E', emoji: '😊' },
    5: { text: 'Très satisfait', color: '#16A34A', emoji: '😍' },
  };
  const StarRating = ({ rating, onRatingChange, size = 40 }) => {
    return (
      <View style={styles.starContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => onRatingChange(star)}
            style={styles.starButton}
            activeOpacity={0.7}
          >
            <SimpleIcon
              iconKey={star <= rating ? 'favoritesFilled' : 'rating'}
              containerSize={size}
              size={size * 0.6}
              style={{
                backgroundColor: star <= rating ? COLORS.warning + '20' : 'transparent',
              }}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const CategoryCard = ({ category }) => {
    const isSelected = selectedCategory === category.id;
    
    return (
      <TouchableOpacity
        style={[
          styles.categoryCard,
          { 
            backgroundColor: theme.background,
            borderColor: isSelected ? theme.primary : theme.border,
            borderWidth: isSelected ? 2 : 1,
          }
        ]}
        onPress={() => setSelectedCategory(category.id)}
        activeOpacity={0.7}
      >
        <View style={styles.categoryLeft}>
          <SimpleIcon 
            iconKey={category.iconKey}
            style={{
              backgroundColor: isSelected ? theme.primary + '20' : theme.primary + '10',
            }}
          />
          <View style={styles.categoryTextContainer}>
            <Text style={[styles.categoryTitle, { color: theme.text }]}>
              {category.title}
            </Text>
            <Text style={[styles.categorySubtitle, { color: theme.textSecondary }]}>
              {category.subtitle}
            </Text>
          </View>
        </View>
        {isSelected && (
          <SimpleIcon iconKey="success" containerSize={24} size={14} />
        )}
      </TouchableOpacity>
    );
  };
  const handleSubmitRating = async () => {
    if (rating === 0) {
      Alert.alert('Évaluation requise', 'Veuillez donner une note avant de soumettre votre avis.');
      return;
    }

    if (!selectedCategory) {
      Alert.alert('Catégorie requise', 'Veuillez sélectionner une catégorie pour votre évaluation.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulation d'envoi à l'API
      await new Promise(resolve => setTimeout(resolve, 2000));

      Alert.alert(
        'Merci pour votre avis !',
        `Votre évaluation de ${rating} étoile${rating > 1 ? 's' : ''} a été enregistrée. Nous apprécions vos commentaires et travaillons constamment pour améliorer votre expérience.`,
        [
          {
            text: 'Parfait',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de l\'envoi de votre avis. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShareApp = () => {
    Alert.alert(
      'Partager l\'application',
      'Recommandez EcommerceApp à vos amis et famille !',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Partager', onPress: () => Alert.alert('Partage', 'Fonctionnalité de partage à venir') },
      ]
    );
  };

  const currentRatingInfo = rating > 0 ? ratingTexts[rating] : null;
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.surface }]}>
      <CustomHeader title="Évaluer l'application" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* En-tête */}
        <View style={[styles.headerInfo, { backgroundColor: theme.background }]}>
          <SimpleIcon iconKey="rating" containerSize={64} size={32} />
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            Votre avis compte !
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
            Aidez-nous à améliorer EcommerceApp en partageant votre expérience. 
            Votre feedback est précieux pour nous.
          </Text>
        </View>

        {/* Notation par étoiles */}
        <View style={[styles.ratingSection, { backgroundColor: theme.background }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Donnez votre note
          </Text>
          
          <StarRating rating={rating} onRatingChange={setRating} />
          
          {currentRatingInfo && (
            <View style={styles.ratingFeedback}>
              <Text style={[styles.ratingEmoji, { fontSize: 32 }]}>
                {currentRatingInfo.emoji}
              </Text>
              <Text style={[styles.ratingText, { color: currentRatingInfo.color }]}>
                {currentRatingInfo.text}
              </Text>
            </View>
          )}
        </View>

        {/* Catégories d'évaluation */}
        <View style={[styles.categoriesSection, { backgroundColor: theme.background }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Que souhaitez-vous évaluer ?
          </Text>
          <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
            Sélectionnez l'aspect qui vous intéresse le plus
          </Text>
          
          <View style={styles.categoriesContainer}>
            {ratingCategories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </View>
        </View>
        {/* Commentaire */}
        <View style={[styles.commentSection, { backgroundColor: theme.background }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Commentaire (optionnel)
          </Text>
          <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
            Partagez vos suggestions ou remarques
          </Text>
          
          <TextInput
            style={[
              styles.commentInput,
              { 
                backgroundColor: theme.surface,
                borderColor: theme.border,
                color: theme.text,
              }
            ]}
            placeholder="Décrivez votre expérience avec l'application..."
            placeholderTextColor={theme.textSecondary}
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Actions */}
        <View style={[styles.actionsSection, { backgroundColor: theme.background }]}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              { 
                backgroundColor: rating > 0 && selectedCategory ? theme.primary : theme.border,
                opacity: isSubmitting ? 0.7 : 1,
              }
            ]}
            onPress={handleSubmitRating}
            disabled={rating === 0 || !selectedCategory || isSubmitting}
            activeOpacity={0.8}
          >
            <SimpleIcon 
              iconKey={isSubmitting ? "loading" : "success"} 
              containerSize={32} 
              size={16} 
            />
            <Text style={styles.submitButtonText}>
              {isSubmitting ? 'Envoi en cours...' : 'Envoyer mon avis'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.shareButton, { borderColor: theme.border }]}
            onPress={handleShareApp}
            activeOpacity={0.8}
          >
            <SimpleIcon iconKey="contact" containerSize={32} size={16} />
            <Text style={[styles.shareButtonText, { color: theme.text }]}>
              Recommander l'app
            </Text>
          </TouchableOpacity>
        </View>

        {/* Statistiques */}
        <View style={[styles.statsSection, { backgroundColor: theme.background }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Nos statistiques
          </Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.primary }]}>4.8</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Note moyenne</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.primary }]}>2.5K+</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Avis clients</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.primary }]}>95%</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Satisfaction</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.textSecondary }]}>
            Merci de nous aider à améliorer EcommerceApp
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
    fontSize: 24,
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

  // Section commune
  ratingSection: {
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
  categoriesSection: {
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
  commentSection: {
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
  actionsSection: {
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
  statsSection: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.dark,
    marginBottom: SPACING.sm,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: SPACING.lg,
  },
  // Étoiles
  starContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: SPACING.lg,
  },
  starButton: {
    marginHorizontal: SPACING.xs,
  },
  ratingFeedback: {
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  ratingEmoji: {
    marginBottom: SPACING.sm,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
  },

  // Catégories
  categoriesContainer: {
    gap: SPACING.sm,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    borderRadius: 16,
    borderWidth: 1,
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryTextContainer: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  categorySubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },

  // Commentaire
  commentInput: {
    borderWidth: 1,
    borderRadius: 16,
    padding: SPACING.md,
    fontSize: 14,
    minHeight: 100,
    textAlignVertical: 'top',
  },

  // Actions
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: 25,
    marginBottom: SPACING.md,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: SPACING.sm,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: 25,
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: SPACING.sm,
  },

  // Statistiques
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },

  // Footer
  footer: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});

export default RatingScreen;