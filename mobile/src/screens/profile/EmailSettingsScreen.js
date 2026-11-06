// mobile/src/screens/profile/EmailSettingsScreen.js
import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ScrollView,
  Switch,
} from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import CustomHeader from '../../components/common/CustomHeader';
import { COLORS, SPACING } from '../../utils/constants';

const EmailSettingsScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    currentEmail: user?.email || '',
    newEmail: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState({
    orders: true,
    promotions: false,
    newsletter: true,
    security: true,
  });

  const updateFormData = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChangeEmail = async () => {
    if (!formData.newEmail) {
      Alert.alert('Erreur', 'Veuillez saisir un nouvel email');
      return;
    }

    if (!validateEmail(formData.newEmail)) {
      Alert.alert('Erreur', 'Veuillez saisir un email valide');
      return;
    }

    if (!formData.password) {
      Alert.alert('Erreur', 'Veuillez saisir votre mot de passe pour confirmer');
      return;
    }

    if (formData.currentEmail === formData.newEmail) {
      Alert.alert('Erreur', 'Le nouvel email doit être différent de l\'actuel');
      return;
    }

    setLoading(true);
    
    try {
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Succès',
        'Un email de confirmation a été envoyé à votre nouvelle adresse',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de modifier l\'email');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationChange = (key, value) => {
    setEmailNotifications({
      ...emailNotifications,
      [key]: value,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title="Paramètres Email" />

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Email actuel */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Email actuel</Text>
          <View style={styles.currentEmailContainer}>
            <Text style={styles.currentEmail}>{formData.currentEmail}</Text>
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>✓ Vérifié</Text>
            </View>
          </View>
        </View>

        {/* Changer d'email */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Changer d'email</Text>
          
          <Input
            label="Nouvel email"
            value={formData.newEmail}
            onChangeText={(value) => updateFormData('newEmail', value)}
            placeholder="Saisissez votre nouvel email"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            label="Mot de passe de confirmation"
            value={formData.password}
            onChangeText={(value) => updateFormData('password', value)}
            secureTextEntry={true}
            placeholder="Saisissez votre mot de passe"
          />

          <Button
            title="Changer l'email"
            onPress={handleChangeEmail}
            loading={loading}
            style={styles.changeButton}
          />
        </View>

        {/* Préférences de notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications par email</Text>
          
          <View style={styles.notificationItem}>
            <View style={styles.notificationInfo}>
              <Text style={styles.notificationTitle}>Commandes</Text>
              <Text style={styles.notificationDesc}>Confirmations et mises à jour</Text>
            </View>
            <Switch
              value={emailNotifications.orders}
              onValueChange={(value) => handleNotificationChange('orders', value)}
              trackColor={{ false: '#E5E7EB', true: COLORS.primary }}
              thumbColor={emailNotifications.orders ? COLORS.white : '#F3F4F6'}
            />
          </View>

          <View style={styles.notificationItem}>
            <View style={styles.notificationInfo}>
              <Text style={styles.notificationTitle}>Promotions</Text>
              <Text style={styles.notificationDesc}>Offres spéciales et réductions</Text>
            </View>
            <Switch
              value={emailNotifications.promotions}
              onValueChange={(value) => handleNotificationChange('promotions', value)}
              trackColor={{ false: '#E5E7EB', true: COLORS.primary }}
              thumbColor={emailNotifications.promotions ? COLORS.white : '#F3F4F6'}
            />
          </View>

          <View style={styles.notificationItem}>
            <View style={styles.notificationInfo}>
              <Text style={styles.notificationTitle}>Newsletter</Text>
              <Text style={styles.notificationDesc}>Nouveautés et actualités</Text>
            </View>
            <Switch
              value={emailNotifications.newsletter}
              onValueChange={(value) => handleNotificationChange('newsletter', value)}
              trackColor={{ false: '#E5E7EB', true: COLORS.primary }}
              thumbColor={emailNotifications.newsletter ? COLORS.white : '#F3F4F6'}
            />
          </View>

          <View style={styles.notificationItem}>
            <View style={styles.notificationInfo}>
              <Text style={styles.notificationTitle}>Sécurité</Text>
              <Text style={styles.notificationDesc}>Alertes de sécurité importantes</Text>
            </View>
            <Switch
              value={emailNotifications.security}
              onValueChange={(value) => handleNotificationChange('security', value)}
              trackColor={{ false: '#E5E7EB', true: COLORS.primary }}
              thumbColor={emailNotifications.security ? COLORS.white : '#F3F4F6'}
            />
          </View>
        </View>

        {/* Informations */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>ℹ️ Information importante</Text>
          <Text style={styles.infoText}>
            Lors du changement d'email, vous recevrez un lien de confirmation à votre nouvelle adresse. 
            Votre ancien email restera actif jusqu'à la confirmation.
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

  // Sections
  section: {
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

  // Email actuel
  currentEmailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.light,
    padding: SPACING.lg,
    borderRadius: 12,
  },
  currentEmail: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.dark,
    flex: 1,
  },
  verifiedBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 20,
  },
  verifiedText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },

  // Bouton
  changeButton: {
    marginTop: SPACING.lg,
  },

  // Notifications
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F5',
  },
  notificationInfo: {
    flex: 1,
    marginRight: SPACING.md,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 2,
  },
  notificationDesc: {
    fontSize: 14,
    color: '#6B7280',
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

export default EmailSettingsScreen;