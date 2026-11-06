// mobile/src/screens/profile/ChangePasswordScreen.js
import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
} from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import CustomHeader from '../../components/common/CustomHeader';
import { SimpleIcon } from '../../components/common/ProfessionalIcon';
import { COLORS, SPACING } from '../../utils/constants';
import ApiService from '../../services/api';

const ChangePasswordScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const updateFormData = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field],
    });
  };

  const validateForm = () => {
    if (!formData.currentPassword) {
      Alert.alert('Erreur', 'Veuillez saisir votre mot de passe actuel');
      return false;
    }

    if (!formData.newPassword) {
      Alert.alert('Erreur', 'Veuillez saisir un nouveau mot de passe');
      return false;
    }

    if (formData.newPassword.length < 6) {
      Alert.alert('Erreur', 'Le nouveau mot de passe doit contenir au moins 6 caractères');
      return false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return false;
    }

    if (formData.currentPassword === formData.newPassword) {
      Alert.alert('Erreur', 'Le nouveau mot de passe doit être différent de l\'ancien');
      return false;
    }

    return true;
  };

  const handleChangePassword = async () => {
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      // Appel API réel pour changer le mot de passe
      const response = await ApiService.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      
      if (response.success) {
        Alert.alert(
          'Succès',
          'Votre mot de passe a été modifié avec succès',
          [
            {
              text: 'OK',
              onPress: () => {
                // Réinitialiser le formulaire
                setFormData({
                  currentPassword: '',
                  newPassword: '',
                  confirmPassword: '',
                });
                navigation.goBack();
              },
            },
          ]
        );
      } else {
        throw new Error(response.message || 'Erreur lors du changement de mot de passe');
      }
    } catch (error) {
      console.error('Erreur changement mot de passe:', error);
      Alert.alert(
        'Erreur', 
        error.message || 'Impossible de modifier le mot de passe. Vérifiez votre mot de passe actuel.'
      );
    } finally {
      setLoading(false);
    }
  };

  const PasswordStrengthIndicator = ({ password }) => {
    const getStrength = (pwd) => {
      if (!pwd) return { level: 0, text: '', color: '#E5E7EB' };
      
      let score = 0;
      if (pwd.length >= 6) score++;
      if (pwd.length >= 8) score++;
      if (/[A-Z]/.test(pwd)) score++;
      if (/[a-z]/.test(pwd)) score++;
      if (/[0-9]/.test(pwd)) score++;
      if (/[^A-Za-z0-9]/.test(pwd)) score++;

      if (score <= 2) return { level: 1, text: 'Faible', color: COLORS.danger };
      if (score <= 4) return { level: 2, text: 'Moyen', color: '#F59E0B' };
      return { level: 3, text: 'Fort', color: '#10B981' };
    };

    const strength = getStrength(password);

    return (
      <View style={styles.strengthContainer}>
        <View style={styles.strengthBars}>
          {[1, 2, 3].map((level) => (
            <View
              key={level}
              style={[
                styles.strengthBar,
                {
                  backgroundColor: level <= strength.level ? strength.color : '#E5E7EB',
                },
              ]}
            />
          ))}
        </View>
        <Text style={[styles.strengthText, { color: strength.color }]}>
          {strength.text}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header simple */}
      <CustomHeader
        title="Changer le mot de passe"
      />

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Info utilisateur */}
        <View style={styles.userInfo}>
          <View style={styles.userAvatar}>
            <Text style={styles.userAvatarText}>
              {user?.nom?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          <Text style={styles.userName}>{user?.nom || 'Utilisateur'}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>

        {/* Formulaire */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Sécurité du compte</Text>
            
            <Input
              label="Mot de passe actuel"
              value={formData.currentPassword}
              onChangeText={(value) => updateFormData('currentPassword', value)}
              secureTextEntry={!showPasswords.current}
              placeholder="Saisissez votre mot de passe actuel"
              rightIcon={
                <TouchableOpacity
                  onPress={() => togglePasswordVisibility('current')}
                  style={styles.eyeButton}
                >
                  <SimpleIcon 
                    iconKey={showPasswords.current ? "eye" : "eye-off"}
                    containerSize={24}
                    size={16}
                    style={{ backgroundColor: 'transparent' }}
                  />
                </TouchableOpacity>
              }
            />

            <Input
              label="Nouveau mot de passe"
              value={formData.newPassword}
              onChangeText={(value) => updateFormData('newPassword', value)}
              secureTextEntry={!showPasswords.new}
              placeholder="Saisissez un nouveau mot de passe"
              rightIcon={
                <TouchableOpacity
                  onPress={() => togglePasswordVisibility('new')}
                  style={styles.eyeButton}
                >
                  <SimpleIcon 
                    iconKey={showPasswords.new ? "eye" : "eye-off"}
                    containerSize={24}
                    size={16}
                    style={{ backgroundColor: 'transparent' }}
                  />
                </TouchableOpacity>
              }
            />

            {formData.newPassword ? (
              <PasswordStrengthIndicator password={formData.newPassword} />
            ) : null}

            <Input
              label="Confirmer le nouveau mot de passe"
              value={formData.confirmPassword}
              onChangeText={(value) => updateFormData('confirmPassword', value)}
              secureTextEntry={!showPasswords.confirm}
              placeholder="Confirmez votre nouveau mot de passe"
              rightIcon={
                <TouchableOpacity
                  onPress={() => togglePasswordVisibility('confirm')}
                  style={styles.eyeButton}
                >
                  <SimpleIcon 
                    iconKey={showPasswords.confirm ? "eye" : "eye-off"}
                    containerSize={24}
                    size={16}
                    style={{ backgroundColor: 'transparent' }}
                  />
                </TouchableOpacity>
              }
            />

            {/* Conseils de sécurité */}
            <View style={styles.securityTips}>
              <View style={styles.tipsHeader}>
                <SimpleIcon 
                  iconKey="privacy" 
                  containerSize={24} 
                  size={14}
                  style={{ backgroundColor: 'transparent', marginRight: 8 }}
                />
                <Text style={styles.tipsTitle}>Conseils pour un mot de passe sécurisé :</Text>
              </View>
              <View style={styles.tipsList}>
                <View style={styles.tipItem}>
                  <SimpleIcon 
                    iconKey="success" 
                    containerSize={16} 
                    size={10}
                    style={{ backgroundColor: 'transparent', marginRight: 8 }}
                  />
                  <Text style={styles.tipText}>Au moins 8 caractères</Text>
                </View>
                <View style={styles.tipItem}>
                  <SimpleIcon 
                    iconKey="success" 
                    containerSize={16} 
                    size={10}
                    style={{ backgroundColor: 'transparent', marginRight: 8 }}
                  />
                  <Text style={styles.tipText}>Mélange de majuscules et minuscules</Text>
                </View>
                <View style={styles.tipItem}>
                  <SimpleIcon 
                    iconKey="success" 
                    containerSize={16} 
                    size={10}
                    style={{ backgroundColor: 'transparent', marginRight: 8 }}
                  />
                  <Text style={styles.tipText}>Inclure des chiffres</Text>
                </View>
                <View style={styles.tipItem}>
                  <SimpleIcon 
                    iconKey="success" 
                    containerSize={16} 
                    size={10}
                    style={{ backgroundColor: 'transparent', marginRight: 8 }}
                  />
                  <Text style={styles.tipText}>Utiliser des caractères spéciaux</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Boutons */}
          <View style={styles.buttons}>
            <Button
              title="Annuler"
              onPress={() => navigation.goBack()}
              variant="outline"
              style={styles.cancelButton}
            />
            <Button
              title="Modifier"
              onPress={handleChangePassword}
              loading={loading}
              style={styles.saveButton}
            />
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

  // Info utilisateur
  userInfo: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
    backgroundColor: COLORS.white,
    padding: SPACING.xl,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  userAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  userAvatarText: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.white,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.dark,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },

  // Formulaire
  formSection: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.xl,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.dark,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  eyeButton: {
    padding: SPACING.xs,
  },

  // Indicateur de force
  strengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
    marginBottom: SPACING.md,
  },
  strengthBars: {
    flexDirection: 'row',
    flex: 1,
    gap: 4,
    marginRight: SPACING.md,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 12,
    fontWeight: '600',
  },

  // Conseils de sécurité
  securityTips: {
    backgroundColor: COLORS.primary + '08',
    padding: SPACING.lg,
    borderRadius: 16,
    marginTop: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.primary + '20',
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.dark,
    flex: 1,
  },
  tipsList: {
    gap: SPACING.sm,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipText: {
    fontSize: 13,
    color: COLORS.gray,
    fontWeight: '500',
    flex: 1,
  },

  // Boutons
  buttons: {
    flexDirection: 'row',
    gap: SPACING.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 1,
  },
});

export default ChangePasswordScreen;