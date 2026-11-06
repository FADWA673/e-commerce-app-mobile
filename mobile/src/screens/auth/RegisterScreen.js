// mobile/src/screens/auth/RegisterScreen.js
import React, { useState, useContext, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  StatusBar,
} from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import ProfessionalIcon from '../../components/common/ProfessionalIcon';
import { COLORS, SIZES, SPACING } from '../../utils/constants';

const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    password: '',
    confirmPassword: '',
    telephone: '',
    adresse: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register } = useContext(AuthContext);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Animation d'entrée
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const updateFormData = (key, value) => {
    setFormData({ ...formData, [key]: value });
    if (errors[key]) {
      setErrors({ ...errors, [key]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nom) newErrors.nom = 'Nom requis';
    if (!formData.email) {
      newErrors.email = 'Email requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }
    if (!formData.password) {
      newErrors.password = 'Mot de passe requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Minimum 6 caractères';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mots de passe différents';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    const { confirmPassword, ...registerData } = formData;
    const result = await register(registerData);
    setLoading(false);

    if (!result.success) {
      Alert.alert('Erreur', result.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header élégant */}
          <Animated.View 
            style={[
              styles.header,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <TouchableOpacity 
              style={styles.simpleBackButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.8}
            >
              <ProfessionalIcon 
                name="arrow-back-outline"
                type="ionicons"
                size={20}
                color={COLORS.dark}
              />
            </TouchableOpacity>
            
            <View style={styles.logoContainer}>
              <View style={styles.logo}>
                <Text style={styles.logoText}>👤</Text>
              </View>
            </View>
            
            <Text style={styles.title}>Créer un compte</Text>
            <Text style={styles.subtitle}>Rejoignez notre communauté</Text>
          </Animated.View>

          {/* Formulaire élégant */}
          <Animated.View 
            style={[
              styles.formContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.form}>
              {/* Nom complet */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Nom complet</Text>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputIcon}>👤</Text>
                  <Input
                    value={formData.nom}
                    onChangeText={(value) => updateFormData('nom', value)}
                    placeholder="Ahmed Benali"
                    error={errors.nom}
                    style={styles.input}
                  />
                </View>
              </View>

              {/* Email */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email</Text>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputIcon}>📧</Text>
                  <Input
                    value={formData.email}
                    onChangeText={(value) => updateFormData('email', value)}
                    placeholder="votre@email.com"
                    keyboardType="email-address"
                    error={errors.email}
                    style={styles.input}
                  />
                </View>
              </View>

              {/* Téléphone */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Téléphone (optionnel)</Text>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputIcon}>📱</Text>
                  <Input
                    value={formData.telephone}
                    onChangeText={(value) => updateFormData('telephone', value)}
                    placeholder="0612345678"
                    keyboardType="phone-pad"
                    style={styles.input}
                  />
                </View>
              </View>

              {/* Adresse */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Adresse (optionnel)</Text>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputIcon}>📍</Text>
                  <Input
                    value={formData.adresse}
                    onChangeText={(value) => updateFormData('adresse', value)}
                    placeholder="Casablanca, Maroc"
                    multiline
                    numberOfLines={2}
                    style={styles.input}
                  />
                </View>
              </View>

              {/* Mot de passe */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Mot de passe</Text>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputIcon}>🔒</Text>
                  <Input
                    value={formData.password}
                    onChangeText={(value) => updateFormData('password', value)}
                    placeholder="••••••••"
                    secureTextEntry={!showPassword}
                    error={errors.password}
                    style={styles.input}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeButton}
                  >
                    <Text style={styles.eyeIcon}>
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Confirmer mot de passe */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Confirmer mot de passe</Text>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputIcon}>🔒</Text>
                  <Input
                    value={formData.confirmPassword}
                    onChangeText={(value) => updateFormData('confirmPassword', value)}
                    placeholder="••••••••"
                    secureTextEntry={!showConfirmPassword}
                    error={errors.confirmPassword}
                    style={styles.input}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeButton}
                  >
                    <Text style={styles.eyeIcon}>
                      {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.registerButton, loading && styles.registerButtonDisabled]}
                onPress={handleRegister}
                disabled={loading}
                activeOpacity={0.8}
              >
                <Text style={styles.registerButtonText}>
                  {loading ? 'Inscription...' : "S'inscrire"}
                </Text>
              </TouchableOpacity>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>ou</Text>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity
                style={styles.loginButton}
                onPress={() => navigation.goBack()}
                activeOpacity={0.8}
              >
                <Text style={styles.loginButtonText}>J'ai déjà un compte</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Footer */}
          <Animated.View 
            style={[
              styles.footer,
              { opacity: fadeAnim },
            ]}
          >
            <Text style={styles.footerText}>
              En créant un compte, vous acceptez nos{'\n'}
              <Text style={styles.footerLink}>Conditions d'utilisation</Text> et notre{' '}
              <Text style={styles.footerLink}>Politique de confidentialité</Text>
            </Text>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
  },
  
  // Header élégant
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  simpleBackButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: SPACING.lg,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  logoContainer: {
    marginBottom: SPACING.lg,
  },
  logo: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  logoText: {
    fontSize: 28,
    color: COLORS.white,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: SPACING.sm,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.gray,
    fontWeight: '500',
    letterSpacing: 0.3,
  },

  // Formulaire élégant
  formContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: SPACING.lg,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    marginBottom: SPACING.lg,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: SPACING.md,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: SPACING.sm,
    letterSpacing: 0.3,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.light,
    borderRadius: 14,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
  },
  inputIcon: {
    fontSize: 18,
    marginRight: SPACING.sm,
    color: COLORS.gray,
  },
  input: {
    flex: 1,
    paddingVertical: SPACING.md,
    fontSize: 15,
    color: COLORS.dark,
    backgroundColor: 'transparent',
    borderWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
  eyeButton: {
    padding: SPACING.sm,
  },
  eyeIcon: {
    fontSize: 16,
    color: COLORS.gray,
  },
  registerButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.lg,
    borderRadius: 14,
    alignItems: 'center',
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
  },
  registerButtonDisabled: {
    backgroundColor: COLORS.gray,
    elevation: 2,
    shadowOpacity: 0.1,
  },
  registerButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E8E8E8',
  },
  dividerText: {
    fontSize: 14,
    color: COLORS.gray,
    fontWeight: '500',
    marginHorizontal: SPACING.md,
  },
  loginButton: {
    backgroundColor: 'transparent',
    paddingVertical: SPACING.lg,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    letterSpacing: 0.3,
  },

  // Footer élégant
  footer: {
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.lg,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 18,
  },
  footerLink: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});

export default RegisterScreen;