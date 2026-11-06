// mobile/src/screens/profile/AccountInfoScreen.js
import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import ProfessionalIcon from '../../components/common/ProfessionalIcon';
import { COLORS, SPACING } from '../../utils/constants';
import { formatPhoneNumber, formatDate, formatPrice } from '../../utils/formatters';
import ApiService from '../../services/api';

const AccountInfoScreen = ({ navigation }) => {
  const { user, updateUserProfile } = useContext(AuthContext);
  const { theme } = useTheme();

  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    nom: user?.nom || '',
    email: user?.email || '',
    telephone: user?.telephone || '',
    adresse: user?.adresse || '',
    dateNaissance: user?.dateNaissance || '',
    genre: user?.genre || '',
  });
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(true);
  const [userStats, setUserStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    totalFavorites: 0,
    memberSince: null,
  });

  useEffect(() => {
    loadUserStats();
  }, []);

  const loadUserStats = async () => {
    try {
      setStatsLoading(true);
      
      // Charger les statistiques réelles de l'utilisateur
      const [ordersResponse, favoritesResponse] = await Promise.all([
        ApiService.getUserOrders(),
        ApiService.getFavorites(),
      ]);

      const orders = ordersResponse.orders || [];
      const favorites = favoritesResponse.favorites || [];

      // Calculer le total dépensé
      const totalSpent = orders.reduce((sum, order) => {
        return sum + (parseFloat(order.total) || 0);
      }, 0);

      // Déterminer la date d'inscription
      let memberSince = null;
      if (user?.created_at) {
        memberSince = new Date(user.created_at);
      } else if (orders.length > 0) {
        const firstOrder = orders.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))[0];
        memberSince = new Date(firstOrder.created_at);
      } else {
        memberSince = new Date('2024-01-01');
      }

      setUserStats({
        totalOrders: orders.length,
        totalSpent: totalSpent,
        totalFavorites: favorites.length,
        memberSince: memberSince,
      });

    } catch (error) {
      console.error('❌ Erreur lors du chargement des statistiques:', error);
      setUserStats({
        totalOrders: 0,
        totalSpent: 0,
        totalFavorites: 0,
        memberSince: new Date('2024-01-01'),
      });
    } finally {
      setStatsLoading(false);
    }
  };

  const updateFormData = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSave = async () => {
    if (!formData.nom.trim()) {
      Alert.alert('Erreur', 'Le nom est obligatoire');
      return;
    }

    if (!formData.email.trim()) {
      Alert.alert('Erreur', 'L\'email est obligatoire');
      return;
    }

    // Validation email simple
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Erreur', 'Format d\'email invalide');
      return;
    }

    setLoading(true);
    try {
      const result = await updateUserProfile(formData);
      if (result.success) {
        Alert.alert('Succès', 'Informations mises à jour avec succès');
        setEditing(false);
      } else {
        Alert.alert('Erreur', result.message || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Erreur lors de la mise à jour des informations');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      nom: user?.nom || '',
      email: user?.email || '',
      telephone: user?.telephone || '',
      adresse: user?.adresse || '',
      dateNaissance: user?.dateNaissance || '',
      genre: user?.genre || '',
    });
    setEditing(false);
  };

  const InfoCard = ({ icon, label, value, editable = true }) => (
    <View style={[styles.infoCard, { borderBottomColor: theme.border }]}>
      <View style={styles.infoCardHeader}>
        <View style={[styles.infoCardIcon, { backgroundColor: COLORS.primary + '15' }]}>
          <ProfessionalIcon 
            name={icon.name}
            type={icon.type}
            size={20}
            color={COLORS.primary}
          />
        </View>
        <View style={styles.infoCardContent}>
          <Text style={[styles.infoCardLabel, { color: theme.textSecondary }]}>{label}</Text>
          <Text style={[styles.infoCardValue, { color: theme.text }]}>
            {value || 'Non renseigné'}
          </Text>
        </View>
        {editable && (
          <View style={styles.editableIndicator}>
            <ProfessionalIcon 
              name="create-outline"
              type="ionicons"
              size={16}
              color={theme.textSecondary}
            />
          </View>
        )}
      </View>
    </View>
  );

  const formatMemberSince = (date) => {
    if (!date) return 'Membre depuis 2024';
    
    const year = date.getFullYear();
    const months = [
      'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
      'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
    ];
    const month = months[date.getMonth()];
    
    return `Membre depuis ${month} ${year}`;
  };

  const getAccountStatus = () => {
    if (userStats.totalOrders >= 10) return 'Compte Premium';
    if (userStats.totalOrders >= 5) return 'Compte Vérifié';
    if (userStats.totalOrders >= 1) return 'Compte Actif';
    return 'Nouveau compte';
  };

  const getUserLevel = () => {
    if (userStats.totalSpent >= 5000) return 'Client VIP';
    if (userStats.totalSpent >= 2000) return 'Client Premium';
    if (userStats.totalSpent >= 500) return 'Client Fidèle';
    return 'Client Standard';
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.surface }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.simpleBackButton}
          activeOpacity={0.8}
        >
          <ProfessionalIcon 
            name="arrow-back-outline"
            type="ionicons"
            size={20}
            color={COLORS.dark}
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Informations du compte</Text>
        {!editing && (
          <TouchableOpacity
            onPress={() => setEditing(true)}
            style={[styles.editButton, { backgroundColor: COLORS.primary }]}
          >
            <Text style={styles.editButtonText}>Modifier</Text>
          </TouchableOpacity>
        )}
        {editing && <View style={styles.headerRight} />}
      </View>

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Avatar et info de base */}
          <View style={[styles.profileHeader, { backgroundColor: COLORS.primary }]}>
            <View style={styles.avatarContainer}>
              <View style={[styles.avatar, { backgroundColor: COLORS.white }]}>
                <Text style={[styles.avatarText, { color: COLORS.primary }]}>
                  {user?.nom?.charAt(0).toUpperCase() || 'U'}
                </Text>
              </View>
              <TouchableOpacity style={[styles.cameraButton, { backgroundColor: COLORS.white }]}>
                <ProfessionalIcon 
                  name="camera-outline"
                  type="ionicons"
                  size={16}
                  color={COLORS.primary}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.memberSince}>
              {formatMemberSince(userStats.memberSince)}
            </Text>
          </View>

          {editing ? (
            /* Mode édition */
            <View style={styles.editForm}>
              <View style={[styles.formSection, { backgroundColor: theme.background }]}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Informations personnelles</Text>
                
                <Input
                  label="Nom complet *"
                  value={formData.nom}
                  onChangeText={(value) => updateFormData('nom', value)}
                  placeholder="Entrez votre nom complet"
                />

                <Input
                  label="Email *"
                  value={formData.email}
                  onChangeText={(value) => updateFormData('email', value)}
                  keyboardType="email-address"
                  placeholder="Entrez votre email"
                  autoCapitalize="none"
                />

                <Input
                  label="Téléphone"
                  value={formData.telephone}
                  onChangeText={(value) => updateFormData('telephone', value)}
                  keyboardType="phone-pad"
                  placeholder="Entrez votre numéro de téléphone"
                />

                <Input
                  label="Date de naissance"
                  value={formData.dateNaissance}
                  onChangeText={(value) => updateFormData('dateNaissance', value)}
                  placeholder="JJ/MM/AAAA"
                />

                <Input
                  label="Adresse complète"
                  value={formData.adresse}
                  onChangeText={(value) => updateFormData('adresse', value)}
                  multiline
                  numberOfLines={3}
                  placeholder="Entrez votre adresse complète"
                />
              </View>

              <View style={styles.editButtons}>
                <Button
                  title="Annuler"
                  onPress={handleCancel}
                  variant="outline"
                  style={styles.cancelButton}
                />
                <Button
                  title="Enregistrer"
                  onPress={handleSave}
                  loading={loading}
                  style={styles.saveButton}
                />
              </View>
            </View>
          ) : (
            /* Mode lecture */
            <View style={styles.viewMode}>
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Informations personnelles</Text>
                <View style={[styles.infoCards, { backgroundColor: theme.background }]}>
                  <InfoCard
                    icon={{ name: 'person-outline', type: 'ionicons' }}
                    label="Nom complet"
                    value={user?.nom}
                  />
                  <InfoCard
                    icon={{ name: 'mail-outline', type: 'ionicons' }}
                    label="Adresse email"
                    value={user?.email}
                  />
                  <InfoCard
                    icon={{ name: 'call-outline', type: 'ionicons' }}
                    label="Téléphone"
                    value={user?.telephone ? formatPhoneNumber(user.telephone) : null}
                  />
                  <InfoCard
                    icon={{ name: 'calendar-outline', type: 'ionicons' }}
                    label="Date de naissance"
                    value={user?.dateNaissance}
                  />
                  <InfoCard
                    icon={{ name: 'location-outline', type: 'ionicons' }}
                    label="Adresse"
                    value={user?.adresse}
                  />
                </View>
              </View>

              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Informations du compte</Text>
                <View style={[styles.infoCards, { backgroundColor: theme.background }]}>
                  <InfoCard
                    icon={{ name: 'card-outline', type: 'ionicons' }}
                    label="ID utilisateur"
                    value={user?.id ? `#${user.id}` : 'Non disponible'}
                    editable={false}
                  />
                  <InfoCard
                    icon={{ name: 'calendar-outline', type: 'ionicons' }}
                    label="Date d'inscription"
                    value={userStats.memberSince ? formatDate(userStats.memberSince.toISOString()) : 'Non disponible'}
                    editable={false}
                  />
                  <InfoCard
                    icon={{ name: 'checkmark-circle-outline', type: 'ionicons' }}
                    label="Statut du compte"
                    value={getAccountStatus()}
                    editable={false}
                  />
                  <InfoCard
                    icon={{ name: 'trophy-outline', type: 'ionicons' }}
                    label="Niveau"
                    value={getUserLevel()}
                    editable={false}
                  />
                </View>
              </View>

              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Statistiques</Text>
                {statsLoading ? (
                  <View style={[styles.statsGrid, { backgroundColor: theme.background }]}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
                      Chargement des statistiques...
                    </Text>
                  </View>
                ) : (
                  <View style={[styles.statsGrid, { backgroundColor: theme.background }]}>
                    <View style={styles.statItem}>
                      <Text style={[styles.statNumber, { color: COLORS.primary }]}>{userStats.totalOrders}</Text>
                      <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Commandes</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={[styles.statNumber, { color: COLORS.primary }]}>
                        {formatPrice(userStats.totalSpent)}
                      </Text>
                      <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Total dépensé</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={[styles.statNumber, { color: COLORS.primary }]}>{userStats.totalFavorites}</Text>
                      <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Favoris</Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  simpleBackButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  editButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 16,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.white,
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.xl,
  },

  // Header profil
  profileHeader: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: SPACING.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '800',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  memberSince: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },

  // Mode édition
  editForm: {
    paddingHorizontal: SPACING.lg,
  },
  formSection: {
    borderRadius: 20,
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  editButtons: {
    flexDirection: 'row',
    gap: SPACING.md,
    paddingHorizontal: SPACING.sm,
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 1,
  },

  // Mode lecture
  viewMode: {
    paddingHorizontal: SPACING.lg,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: SPACING.lg,
    letterSpacing: 0.5,
  },
  infoCards: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  infoCard: {
    borderBottomWidth: 1,
  },
  infoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  infoCardIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  infoCardContent: {
    flex: 1,
  },
  infoCardLabel: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 4,
  },
  infoCardValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  editableIndicator: {
    opacity: 0.5,
  },

  // Statistiques
  statsGrid: {
    flexDirection: 'row',
    borderRadius: 20,
    padding: SPACING.lg,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 80,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: SPACING.md,
  },
});

export default AccountInfoScreen;