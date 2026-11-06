// mobile/src/screens/orders/CheckoutScreen.js
import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import ApiService from '../../services/api';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { COLORS, SIZES, SPACING } from '../../utils/constants';

const CheckoutScreen = ({ navigation }) => {
  const { cart, total, fetchCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const { theme } = useTheme();

  // États pour l'adresse
  const [adresse, setAdresse] = useState(user?.adresse || '');
  
  // États pour la carte bancaire
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState(user?.nom || '');
  
  // États pour le mode de paiement
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' ou 'cash'
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Formatage du numéro de carte
  const formatCardNumber = (text) => {
    const cleaned = text.replace(/\s/g, '');
    const formatted = cleaned.replace(/(.{4})/g, '$1 ').trim();
    return formatted.substring(0, 19); // 16 chiffres + 3 espaces
  };

  // Formatage de la date d'expiration
  const formatExpiryDate = (text) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  // Validation des champs
  const validateFields = () => {
    const newErrors = {};

    if (!adresse.trim()) {
      newErrors.adresse = 'Adresse de livraison requise';
    }

    if (paymentMethod === 'card') {
      if (!cardNumber.replace(/\s/g, '') || cardNumber.replace(/\s/g, '').length !== 16) {
        newErrors.cardNumber = 'Numéro de carte invalide (16 chiffres)';
      }
      if (!expiryDate || expiryDate.length !== 5) {
        newErrors.expiryDate = 'Date d\'expiration invalide (MM/AA)';
      }
      if (!cvv || cvv.length !== 3) {
        newErrors.cvv = 'CVV invalide (3 chiffres)';
      }
      if (!cardName.trim()) {
        newErrors.cardName = 'Nom sur la carte requis';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateTotal = () => {
    const deliveryFee = total >= 1000 ? 0 : 100;
    return total + deliveryFee;
  };

  const handlePlaceOrder = async () => {
    if (!validateFields()) {
      return;
    }

    const finalTotal = calculateTotal();
    const paymentMethodText = paymentMethod === 'card' ? 'Carte bancaire' : 'Paiement à la livraison';

    Alert.alert(
      'Confirmer la commande',
      `Total: ${finalTotal.toFixed(2)} DH\nMode de paiement: ${paymentMethodText}\nAdresse: ${adresse}`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          onPress: async () => {
            setLoading(true);
            
            try {
              console.log('🛒 Création de commande...');
              console.log('- Adresse:', adresse);
              console.log('- Total:', finalTotal);
              console.log('- Mode de paiement:', paymentMethod);
              console.log('- Articles:', cart.length);
              
              const orderData = {
                adresse_livraison: adresse,
                mode_paiement: paymentMethod,
                total: finalTotal,
              };

              // Ajouter les infos de carte si paiement par carte
              if (paymentMethod === 'card') {
                orderData.carte_info = {
                  numero: cardNumber.replace(/\s/g, ''), // Supprimer les espaces
                  expiration: expiryDate,
                  nom: cardName,
                  // Note: En production, ne jamais stocker le CVV
                };
              }

              const response = await ApiService.createOrder(orderData);

              console.log('✅ Commande créée:', response);

              // Recharger le panier (devrait être vide maintenant)
              await fetchCart();

              Alert.alert(
                'Succès ! 🎉',
                `Votre commande #${response.order_id} a été passée avec succès`,
                [
                  {
                    text: 'Voir mes commandes',
                    onPress: () => {
                      navigation.navigate('Orders', { screen: 'OrderHistoryMain' });
                    },
                  },
                  {
                    text: 'Continuer mes achats',
                    onPress: () => {
                      navigation.navigate('Home');
                    },
                  },
                ]
              );
            } catch (error) {
              console.error('❌ Erreur commande:', error);
              const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la commande';
              
              Alert.alert('Erreur', errorMessage);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.surface }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.text }]}>Paiement</Text>

          {/* Résumé du panier */}
          <View style={[styles.section, { backgroundColor: theme.background }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Résumé de la commande</Text>
            {cart.map((item) => (
              <View key={item.id} style={styles.orderItem}>
                <Text style={[styles.itemName, { color: theme.text }]}>
                  {item.nom} x{item.quantite}
                </Text>
                <Text style={[styles.itemPrice, { color: theme.text }]}>
                  {parseFloat(item.subtotal || item.prix * item.quantite).toFixed(2)} DH
                </Text>
              </View>
            ))}
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <View style={styles.orderItem}>
              <Text style={[styles.itemName, { color: theme.textSecondary }]}>Sous-total</Text>
              <Text style={[styles.itemPrice, { color: theme.text }]}>{total.toFixed(2)} DH</Text>
            </View>
            <View style={styles.orderItem}>
              <Text style={[styles.itemName, { color: theme.textSecondary }]}>Livraison</Text>
              <Text style={[styles.itemPrice, { color: total >= 1000 ? theme.success : theme.text }]}>
                {total >= 1000 ? 'Gratuite' : '100 DH'}
              </Text>
            </View>
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <View style={styles.totalRow}>
              <Text style={[styles.totalLabel, { color: theme.text }]}>Total</Text>
              <Text style={[styles.totalAmount, { color: theme.primary }]}>
                {calculateTotal().toFixed(2)} DH
              </Text>
            </View>
          </View>

          {/* Mode de paiement */}
          <View style={[styles.section, { backgroundColor: theme.background }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Mode de paiement</Text>
            
            <TouchableOpacity
              style={[
                styles.paymentOption,
                { borderColor: theme.border },
                paymentMethod === 'card' && { borderColor: theme.primary, backgroundColor: theme.primary + '10' }
              ]}
              onPress={() => setPaymentMethod('card')}
              activeOpacity={0.8}
            >
              <View style={styles.paymentOptionContent}>
                <View style={[
                  styles.radioButton,
                  { borderColor: theme.border },
                  paymentMethod === 'card' && { backgroundColor: theme.primary, borderColor: theme.primary }
                ]}>
                  {paymentMethod === 'card' && <View style={styles.radioButtonInner} />}
                </View>
                <Text style={[styles.paymentOptionText, { color: theme.text }]}>💳 Carte bancaire</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.paymentOption,
                { borderColor: theme.border },
                paymentMethod === 'cash' && { borderColor: theme.primary, backgroundColor: theme.primary + '10' }
              ]}
              onPress={() => setPaymentMethod('cash')}
              activeOpacity={0.8}
            >
              <View style={styles.paymentOptionContent}>
                <View style={[
                  styles.radioButton,
                  { borderColor: theme.border },
                  paymentMethod === 'cash' && { backgroundColor: theme.primary, borderColor: theme.primary }
                ]}>
                  {paymentMethod === 'cash' && <View style={styles.radioButtonInner} />}
                </View>
                <Text style={[styles.paymentOptionText, { color: theme.text }]}>💵 Paiement à la livraison</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Formulaire de carte bancaire */}
          {paymentMethod === 'card' && (
            <View style={[styles.section, { backgroundColor: theme.background }]}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Informations de la carte</Text>
              
              <Input
                value={cardNumber}
                onChangeText={(text) => {
                  setCardNumber(formatCardNumber(text));
                  setErrors({ ...errors, cardNumber: '' });
                }}
                placeholder="1234 5678 9012 3456"
                keyboardType="numeric"
                maxLength={19}
                error={errors.cardNumber}
                label="Numéro de carte"
              />

              <View style={styles.cardRow}>
                <View style={styles.cardRowItem}>
                  <Input
                    value={expiryDate}
                    onChangeText={(text) => {
                      setExpiryDate(formatExpiryDate(text));
                      setErrors({ ...errors, expiryDate: '' });
                    }}
                    placeholder="MM/AA"
                    keyboardType="numeric"
                    maxLength={5}
                    error={errors.expiryDate}
                    label="Expiration"
                  />
                </View>
                <View style={styles.cardRowItem}>
                  <Input
                    value={cvv}
                    onChangeText={(text) => {
                      setCvv(text.replace(/\D/g, ''));
                      setErrors({ ...errors, cvv: '' });
                    }}
                    placeholder="123"
                    keyboardType="numeric"
                    maxLength={3}
                    secureTextEntry
                    error={errors.cvv}
                    label="CVV"
                  />
                </View>
              </View>

              <Input
                value={cardName}
                onChangeText={(text) => {
                  setCardName(text);
                  setErrors({ ...errors, cardName: '' });
                }}
                placeholder="Nom sur la carte"
                error={errors.cardName}
                label="Nom du titulaire"
              />
            </View>
          )}

          {/* Adresse de livraison */}
          <View style={[styles.section, { backgroundColor: theme.background }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Adresse de livraison</Text>
            <Input
              value={adresse}
              onChangeText={(text) => {
                setAdresse(text);
                setErrors({ ...errors, adresse: '' });
              }}
              placeholder="Entrez votre adresse complète"
              multiline
              numberOfLines={3}
              error={errors.adresse}
              label="Adresse"
            />
          </View>

          {/* Informations de livraison */}
          <View style={[styles.infoBox, { backgroundColor: theme.background, borderColor: theme.border }]}>
            <Text style={[styles.infoTitle, { color: theme.text }]}>📦 Informations de livraison</Text>
            <Text style={[styles.infoText, { color: theme.textSecondary }]}>
              • Livraison sous 2-5 jours ouvrables
            </Text>
            <Text style={[styles.infoText, { color: theme.textSecondary }]}>
              • Livraison gratuite à partir de 1000 DH
            </Text>
            <Text style={[styles.infoText, { color: theme.textSecondary }]}>
              • Retour gratuit sous 14 jours
            </Text>
            {paymentMethod === 'card' && (
              <Text style={[styles.infoText, { color: theme.success }]}>
                • Paiement sécurisé par carte bancaire
              </Text>
            )}
          </View>

          <Button
            title={`Payer ${calculateTotal().toFixed(2)} DH`}
            onPress={handlePlaceOrder}
            loading={loading}
            style={styles.confirmButton}
          />
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
    padding: SPACING.md, // Réduit de lg à md
  },
  title: {
    fontSize: 22, // Réduit de xlarge à 22
    fontWeight: '700', // Réduit de bold à 700
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  section: {
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 16, // Réduit de large à 16
    fontWeight: '700',
    marginBottom: SPACING.md,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs, // Réduit de sm à xs
  },
  itemName: {
    fontSize: 14, // Réduit de medium à 14
    flex: 1,
  },
  itemPrice: {
    fontSize: 14, // Réduit de medium à 14
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginVertical: SPACING.sm,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: SPACING.sm,
  },
  totalLabel: {
    fontSize: 16, // Réduit de large à 16
    fontWeight: '700',
  },
  totalAmount: {
    fontSize: 18, // Réduit de large à 18
    fontWeight: '800',
  },
  
  // Styles pour le mode de paiement
  paymentOption: {
    borderWidth: 2,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  paymentOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    marginRight: SPACING.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.white,
  },
  paymentOptionText: {
    fontSize: 15,
    fontWeight: '600',
  },
  
  // Styles pour le formulaire de carte
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardRowItem: {
    flex: 1,
    marginHorizontal: SPACING.xs,
  },
  
  infoBox: {
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    borderWidth: 1,
  },
  infoTitle: {
    fontSize: 15, // Réduit de medium à 15
    fontWeight: '700',
    marginBottom: SPACING.sm,
  },
  infoText: {
    fontSize: 13, // Réduit de small à 13
    marginBottom: SPACING.xs,
    lineHeight: 18,
  },
  confirmButton: {
    marginTop: SPACING.md,
    marginBottom: SPACING.xl,
  },
});

export default CheckoutScreen;