// mobile/src/screens/profile/LanguageSettingsScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import CustomHeader from '../../components/common/CustomHeader';
import { COLORS, SPACING } from '../../utils/constants';

const LanguageSettingsScreen = ({ navigation }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('fr');

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷', native: 'Français' },
    { code: 'en', name: 'Anglais', flag: '🇺🇸', native: 'English' },
    { code: 'ar', name: 'Arabe', flag: '🇸🇦', native: 'العربية' },
    { code: 'es', name: 'Espagnol', flag: '🇪🇸', native: 'Español' },
    { code: 'de', name: 'Allemand', flag: '🇩🇪', native: 'Deutsch' },
    { code: 'it', name: 'Italien', flag: '🇮🇹', native: 'Italiano' },
    { code: 'pt', name: 'Portugais', flag: '🇵🇹', native: 'Português' },
    { code: 'ru', name: 'Russe', flag: '🇷🇺', native: 'Русский' },
    { code: 'zh', name: 'Chinois', flag: '🇨🇳', native: '中文' },
    { code: 'ja', name: 'Japonais', flag: '🇯🇵', native: '日本語' },
  ];

  const handleLanguageSelect = (languageCode) => {
    setSelectedLanguage(languageCode);
    
    const selectedLang = languages.find(lang => lang.code === languageCode);
    
    Alert.alert(
      'Changer la langue',
      `Voulez-vous changer la langue vers ${selectedLang.name} ?`,
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Confirmer',
          onPress: () => {
            // Ici vous pouvez implémenter la logique de changement de langue
            Alert.alert(
              'Langue modifiée',
              `La langue a été changée vers ${selectedLang.name}. L'application va redémarrer.`,
              [
                {
                  text: 'OK',
                  onPress: () => navigation.goBack(),
                },
              ]
            );
          },
        },
      ]
    );
  };

  const renderLanguageItem = (language) => (
    <TouchableOpacity
      key={language.code}
      style={[
        styles.languageItem,
        selectedLanguage === language.code && styles.selectedLanguageItem,
      ]}
      onPress={() => handleLanguageSelect(language.code)}
      activeOpacity={0.7}
    >
      <View style={styles.languageInfo}>
        <Text style={styles.flag}>{language.flag}</Text>
        <View style={styles.languageTexts}>
          <Text style={[
            styles.languageName,
            selectedLanguage === language.code && styles.selectedLanguageName,
          ]}>
            {language.name}
          </Text>
          <Text style={[
            styles.languageNative,
            selectedLanguage === language.code && styles.selectedLanguageNative,
          ]}>
            {language.native}
          </Text>
        </View>
      </View>
      
      {selectedLanguage === language.code && (
        <View style={styles.checkmark}>
          <Text style={styles.checkmarkText}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title="Langue" />

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Langue actuelle */}
        <View style={styles.currentSection}>
          <Text style={styles.currentTitle}>Langue actuelle</Text>
          <View style={styles.currentLanguage}>
            <Text style={styles.currentFlag}>
              {languages.find(lang => lang.code === selectedLanguage)?.flag}
            </Text>
            <Text style={styles.currentName}>
              {languages.find(lang => lang.code === selectedLanguage)?.name}
            </Text>
          </View>
        </View>

        {/* Liste des langues */}
        <View style={styles.languagesSection}>
          <Text style={styles.sectionTitle}>Choisir une langue</Text>
          
          <View style={styles.languagesList}>
            {languages.map(renderLanguageItem)}
          </View>
        </View>

        {/* Informations */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>ℹ️ À propos des langues</Text>
          <Text style={styles.infoText}>
            • Le changement de langue affecte toute l'interface de l'application{'\n'}
            • Certaines traductions peuvent ne pas être complètes{'\n'}
            • L'application redémarrera après le changement{'\n'}
            • Vos préférences seront sauvegardées
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
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
  },

  // Langue actuelle
  currentSection: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  currentTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.dark,
    marginBottom: SPACING.md,
  },
  currentLanguage: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '10',
    padding: SPACING.lg,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.primary + '30',
  },
  currentFlag: {
    fontSize: 32,
    marginRight: SPACING.md,
  },
  currentName: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
  },

  // Liste des langues
  languagesSection: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
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
    marginBottom: SPACING.lg,
  },
  languagesList: {
    gap: SPACING.xs,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.lg,
    borderRadius: 12,
    backgroundColor: COLORS.light,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedLanguageItem: {
    backgroundColor: COLORS.primary + '10',
    borderColor: COLORS.primary,
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flag: {
    fontSize: 24,
    marginRight: SPACING.md,
  },
  languageTexts: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 2,
  },
  selectedLanguageName: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  languageNative: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '400',
  },
  selectedLanguageNative: {
    color: COLORS.primary,
    fontWeight: '500',
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
  },

  // Informations
  infoSection: {
    backgroundColor: '#EBF8FF',
    padding: SPACING.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: SPACING.sm,
  },
  infoText: {
    fontSize: 14,
    color: '#1E40AF',
    lineHeight: 20,
  },
});

export default LanguageSettingsScreen;