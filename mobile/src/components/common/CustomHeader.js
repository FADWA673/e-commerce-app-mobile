// mobile/src/components/common/CustomHeader.js
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ProfessionalIcon from './ProfessionalIcon';
import { COLORS, SPACING } from '../../utils/constants';

const CustomHeader = ({ 
  title, 
  navigation: propNavigation, 
  showBackButton = true, 
  rightComponent = null,
  backgroundColor = COLORS.white,
  titleColor = COLORS.dark,
  backButtonColor = COLORS.dark,
}) => {
  // Utiliser le hook useNavigation comme fallback
  const hookNavigation = useNavigation();
  const navigation = propNavigation || hookNavigation;

  const handleBackPress = () => {
    try {
      // Méthode simple et directe
      if (navigation && typeof navigation.goBack === 'function') {
        navigation.goBack();
        return;
      }
      
      // Fallback vers la navigation par nom
      if (navigation && typeof navigation.navigate === 'function') {
        navigation.navigate('Home', { screen: 'HomeMain' });
        return;
      }
      
      console.error('❌ Aucune méthode de navigation disponible');
    } catch (error) {
      console.error('❌ Erreur navigation:', error);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <View style={[styles.header, { backgroundColor }]}>
        {/* Bouton retour simple et élégant */}
        {showBackButton && (
          <TouchableOpacity
            style={styles.simpleBackButton}
            onPress={handleBackPress}
            activeOpacity={0.8}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <ProfessionalIcon 
              name="arrow-back-outline"
              type="ionicons"
              size={20}
              color={COLORS.dark}
            />
          </TouchableOpacity>
        )}

        {/* Titre */}
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: titleColor }]} numberOfLines={1}>
            {title}
          </Text>
        </View>

        {/* Composant à droite (optionnel) */}
        <View style={styles.rightContainer}>
          {rightComponent}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    minHeight: 56,
  },
  simpleBackButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    marginRight: 48, // Compenser la largeur du bouton retour pour centrer le titre
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  rightContainer: {
    width: 40,
    alignItems: 'flex-end',
  },
});

export default CustomHeader;