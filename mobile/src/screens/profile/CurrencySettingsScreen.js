// mobile/src/screens/profile/CurrencySettingsScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
} from 'react-native';
import CustomHeader from '../../components/common/CustomHeader';
import { COLORS, SPACING } from '../../utils/constants';

const CurrencySettingsScreen = ({ navigation }) => {
  const [selectedCurrency, setSelectedCurrency] = useState('MAD');
  const [searchQuery, setSearchQuery] = useState('');

  const currencies = [
    { code: 'MAD', name: 'Dirham Marocain', symbol: 'DH', flag: '🇲🇦', rate: 1.0 },
    { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺', rate: 0.094 },
    { code: 'USD', name: 'Dollar Américain', symbol: '$', flag: '🇺🇸', rate: 0.10 },
    { code: 'GBP', name: 'Livre Sterling', symbol: '£', flag: '🇬🇧', rate: 0.081 },
    { code: 'CAD', name: 'Dollar Canadien', symbol: 'C$', flag: '🇨🇦', rate: 0.14 },
    { code: 'AUD', name: 'Dollar Australien', symbol: 'A$', flag: '🇦🇺', rate: 0.15 },
    { code: 'JPY', name: 'Yen Japonais', symbol: '¥', flag: '🇯🇵', rate: 15.2 },
    { code: 'CHF', name: 'Franc Suisse', symbol: 'CHF', flag: '🇨🇭', rate: 0.092 },
    { code: 'CNY', name: 'Yuan Chinois', symbol: '¥', flag: '🇨🇳', rate: 0.72 },
    { code: 'SAR', name: 'Riyal Saoudien', symbol: 'ر.س', flag: '🇸🇦', rate: 0.38 },
    { code: 'AED', name: 'Dirham des EAU', symbol: 'د.إ', flag: '🇦🇪', rate: 0.37 },
    { code: 'TND', name: 'Dinar Tunisien', symbol: 'د.ت', flag: '🇹🇳', rate: 0.31 },
    { code: 'DZD', name: 'Dinar Algérien', symbol: 'د.ج', flag: '🇩🇿', rate: 13.5 },
  ];

  const filteredCurrencies = currencies.filter(currency =>
    currency.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    currency.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCurrencySelect = (currencyCode) => {
    const selectedCurr = currencies.find(curr => curr.code === currencyCode);
    
    Alert.alert(
      'Changer la devise',
      `Voulez-vous changer la devise vers ${selectedCurr.name} (${selectedCurr.symbol}) ?`,
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Confirmer',
          onPress: () => {
            setSelectedCurrency(currencyCode);
            Alert.alert(
              'Devise modifiée',
              `La devise a été changée vers ${selectedCurr.name}. Les prix seront mis à jour.`,
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

  const formatPrice = (price, currency) => {
    const currencyData = currencies.find(c => c.code === currency);
    const convertedPrice = (price * currencyData.rate).toFixed(2);
    return `${convertedPrice} ${currencyData.symbol}`;
  };

  const renderCurrencyItem = (currency) => (
    <TouchableOpacity
      key={currency.code}
      style={[
        styles.currencyItem,
        selectedCurrency === currency.code && styles.selectedCurrencyItem,
      ]}
      onPress={() => handleCurrencySelect(currency.code)}
      activeOpacity={0.7}
    >
      <View style={styles.currencyInfo}>
        <Text style={styles.flag}>{currency.flag}</Text>
        <View style={styles.currencyTexts}>
          <Text style={[
            styles.currencyName,
            selectedCurrency === currency.code && styles.selectedCurrencyName,
          ]}>
            {currency.name}
          </Text>
          <Text style={[
            styles.currencyCode,
            selectedCurrency === currency.code && styles.selectedCurrencyCode,
          ]}>
            {currency.code} • {currency.symbol}
          </Text>
        </View>
      </View>
      
      <View style={styles.currencyRate}>
        <Text style={[
          styles.rateText,
          selectedCurrency === currency.code && styles.selectedRateText,
        ]}>
          1 MAD = {currency.rate} {currency.symbol}
        </Text>
        {selectedCurrency === currency.code && (
          <View style={styles.checkmark}>
            <Text style={styles.checkmarkText}>✓</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title="Devise" />

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Devise actuelle */}
        <View style={styles.currentSection}>
          <Text style={styles.currentTitle}>Devise actuelle</Text>
          <View style={styles.currentCurrency}>
            <Text style={styles.currentFlag}>
              {currencies.find(curr => curr.code === selectedCurrency)?.flag}
            </Text>
            <View style={styles.currentInfo}>
              <Text style={styles.currentName}>
                {currencies.find(curr => curr.code === selectedCurrency)?.name}
              </Text>
              <Text style={styles.currentSymbol}>
                {currencies.find(curr => curr.code === selectedCurrency)?.code} • {currencies.find(curr => curr.code === selectedCurrency)?.symbol}
              </Text>
            </View>
          </View>
        </View>

        {/* Exemple de prix */}
        <View style={styles.exampleSection}>
          <Text style={styles.exampleTitle}>Exemple de conversion</Text>
          <View style={styles.priceExample}>
            <View style={styles.priceItem}>
              <Text style={styles.priceLabel}>Prix original</Text>
              <Text style={styles.priceValue}>100.00 DH</Text>
            </View>
            <Text style={styles.arrow}>→</Text>
            <View style={styles.priceItem}>
              <Text style={styles.priceLabel}>Prix converti</Text>
              <Text style={styles.priceValue}>
                {formatPrice(100, selectedCurrency)}
              </Text>
            </View>
          </View>
        </View>

        {/* Recherche */}
        <View style={styles.searchSection}>
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher une devise..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Liste des devises */}
        <View style={styles.currenciesSection}>
          <Text style={styles.sectionTitle}>Choisir une devise</Text>
          
          <View style={styles.currenciesList}>
            {filteredCurrencies.map(renderCurrencyItem)}
          </View>
        </View>

        {/* Informations */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>💱 À propos des devises</Text>
          <Text style={styles.infoText}>
            • Les taux de change sont mis à jour quotidiennement{'\n'}
            • Les prix sont convertis en temps réel{'\n'}
            • Certains frais peuvent s'appliquer selon votre banque{'\n'}
            • Les taux affichés sont indicatifs
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

  // Devise actuelle
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
  currentCurrency: {
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
  currentInfo: {
    flex: 1,
  },
  currentName: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 2,
  },
  currentSymbol: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
  },

  // Exemple de prix
  exampleSection: {
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
  exampleTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.dark,
    marginBottom: SPACING.md,
  },
  priceExample: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: COLORS.light,
    padding: SPACING.lg,
    borderRadius: 12,
  },
  priceLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.dark,
  },
  arrow: {
    fontSize: 20,
    color: COLORS.primary,
    fontWeight: '700',
    marginHorizontal: SPACING.md,
  },

  // Recherche
  searchSection: {
    marginBottom: SPACING.lg,
  },
  searchInput: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },

  // Liste des devises
  currenciesSection: {
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
  currenciesList: {
    gap: SPACING.xs,
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.lg,
    borderRadius: 12,
    backgroundColor: COLORS.light,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCurrencyItem: {
    backgroundColor: COLORS.primary + '10',
    borderColor: COLORS.primary,
  },
  currencyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flag: {
    fontSize: 24,
    marginRight: SPACING.md,
  },
  currencyTexts: {
    flex: 1,
  },
  currencyName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 2,
  },
  selectedCurrencyName: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  currencyCode: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '400',
  },
  selectedCurrencyCode: {
    color: COLORS.primary,
    fontWeight: '500',
  },
  currencyRate: {
    alignItems: 'flex-end',
  },
  rateText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
    marginBottom: 4,
  },
  selectedRateText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  checkmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
  },

  // Informations
  infoSection: {
    backgroundColor: '#FEF3C7',
    padding: SPACING.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: SPACING.sm,
  },
  infoText: {
    fontSize: 14,
    color: '#92400E',
    lineHeight: 20,
  },
});

export default CurrencySettingsScreen;