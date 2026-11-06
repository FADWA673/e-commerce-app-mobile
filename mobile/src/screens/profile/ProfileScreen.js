// mobile/src/screens/profile/ProfileScreen.js
import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Image,
  ActionSheetIOS,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { AuthContext } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { SettingsIcon, NavIcon, SimpleIcon } from '../../components/common/ProfessionalIcon';
import { COLORS, SIZES, SPACING, API_URL } from '../../utils/constants';
import { formatPhoneNumber } from '../../utils/formatters';

const ProfileScreen = ({ navigation }) => {
  const { user, logout, updateUserProfile } = useContext(AuthContext);
  const { theme } = useTheme();

  const [editing, setEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(user?.profile_image || null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    nom: user?.nom || '',
    telephone: user?.telephone || '',
    adresse: user?.adresse || '',
  });
  const [loading, setLoading] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(1));

  const updateFormData = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSave = async () => {
    setLoading(true);
    const result = await updateUserProfile(formData);
    setLoading(false);

    if (result.success) {
      Alert.alert('Succès', 'Profil mis à jour');
      setEditing(false);
    } else {
      Alert.alert('Erreur', result.message);
    }
  };

  const handleCancel = () => {
    setFormData({
      nom: user?.nom || '',
      telephone: user?.telephone || '',
      adresse: user?.adresse || '',
    });
    setEditing(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  // Demander les permissions pour l'accès aux médias
  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (cameraStatus !== 'granted' || mediaStatus !== 'granted') {
      Alert.alert(
        'Permissions requises',
        'Nous avons besoin d\'accéder à votre appareil photo et à votre galerie pour changer votre photo de profil.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  // Prendre une photo avec l'appareil photo
  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await uploadProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Erreur prise de photo:', error);
      Alert.alert('Erreur', 'Impossible de prendre la photo');
    }
  };

  // Sélectionner une image depuis la galerie
  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await uploadProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Erreur sélection image:', error);
      Alert.alert('Erreur', 'Impossible de sélectionner l\'image');
    }
  };

  // Supprimer la photo de profil
  const removeProfileImage = async () => {
    Alert.alert(
      'Supprimer la photo',
      'Êtes-vous sûr de vouloir supprimer votre photo de profil ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            setUploadingImage(true);
            try {
              // TODO: En production, appeler l'API pour supprimer l'image
              // await fetch(`${API_URL}/users/profile-image`, {
              //   method: 'DELETE',
              //   headers: {
              //     'Authorization': `Bearer ${userToken}`,
              //   },
              // });
              
              // Simulation d'un délai
              await new Promise(resolve => setTimeout(resolve, 1000));
              
              setProfileImage(null);
              Alert.alert('Succès', 'Photo de profil supprimée');
            } catch (error) {
              console.error('Erreur suppression image:', error);
              Alert.alert('Erreur', 'Impossible de supprimer la photo');
            } finally {
              setUploadingImage(false);
            }
          },
        },
      ]
    );
  };

  // Upload de l'image de profil
  const uploadProfileImage = async (imageUri) => {
    setUploadingImage(true);
    try {
      // Créer FormData pour l'upload
      const formData = new FormData();
      formData.append('profile_image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'profile.jpg',
      });

      // TODO: En production, remplacer par un vrai appel API
      // const response = await fetch(`${API_URL}/users/profile-image`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //     'Authorization': `Bearer ${userToken}`,
      //   },
      //   body: formData,
      // });
      // 
      // if (response.ok) {
      //   const result = await response.json();
      //   setProfileImage(result.image_url);
      // } else {
      //   throw new Error('Erreur lors de l\'upload');
      // }

      // Simulation d'un délai d'upload
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Pour la démo, on utilise l'URI local
      setProfileImage(imageUri);
      
      Alert.alert('Succès', 'Photo de profil mise à jour !');
    } catch (error) {
      console.error('Erreur upload image:', error);
      Alert.alert('Erreur', 'Impossible de mettre à jour la photo');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAvatarPress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Options pour changer la photo de profil
    const options = [
      'Prendre une photo',
      'Choisir depuis la galerie',
      ...(profileImage ? ['Supprimer la photo'] : []),
      'Annuler'
    ];

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex: options.length - 1,
          destructiveButtonIndex: profileImage ? 2 : -1,
          title: 'Photo de profil',
          message: 'Choisissez une option pour votre photo de profil',
        },
        (buttonIndex) => {
          if (buttonIndex === 0) {
            takePhoto();
          } else if (buttonIndex === 1) {
            pickImage();
          } else if (buttonIndex === 2 && profileImage) {
            removeProfileImage();
          }
        }
      );
    } else {
      // Pour Android, utiliser Alert avec boutons
      const buttons = [
        { text: 'Prendre une photo', onPress: takePhoto },
        { text: 'Choisir depuis la galerie', onPress: pickImage },
        ...(profileImage ? [{ text: 'Supprimer la photo', onPress: removeProfileImage, style: 'destructive' }] : []),
        { text: 'Annuler', style: 'cancel' },
      ];

      Alert.alert('Photo de profil', 'Choisissez une option pour votre photo de profil', buttons);
    }
  };

  const ProfileHeader = () => (
    <View style={styles.profileHeader}>
      <View style={styles.headerBackground} />
      <View style={styles.headerContent}>
        <Animated.View style={[styles.avatarContainer, { transform: [{ scale: scaleAnim }] }]}>
          <TouchableOpacity onPress={handleAvatarPress} activeOpacity={0.8}>
            <View style={styles.avatar}>
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>
                  {user?.nom?.charAt(0).toUpperCase() || 'U'}
                </Text>
              </View>
              <View style={styles.cameraIcon}>
                <Text style={styles.cameraEmoji}>📷</Text>
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
        
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user?.nom || 'Utilisateur'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'email@example.com'}</Text>
          <View style={styles.memberSince}>
            <Text style={styles.memberSinceIcon}>🗓️</Text>
            <Text style={styles.memberSinceText}>Membre depuis 2024</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const InfoCard = ({ icon, label, value, onEdit }) => (
    <View style={styles.infoCard}>
      <View style={styles.infoCardHeader}>
        <View style={styles.infoCardIcon}>
          <Text style={styles.infoCardEmoji}>{icon}</Text>
        </View>
        <View style={styles.infoCardContent}>
          <Text style={styles.infoCardLabel}>{label}</Text>
          <Text style={styles.infoCardValue}>{value || 'Non renseigné'}</Text>
        </View>
        {onEdit && (
          <TouchableOpacity onPress={onEdit} style={styles.editIconButton}>
            <Text style={styles.editIcon}>✏️</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const MenuButton = ({ icon, title, onPress, danger = false, badge = null }) => (
    <TouchableOpacity 
      style={[styles.menuButton, danger && styles.menuButtonDanger]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.menuButtonContent}>
        <View style={styles.menuButtonLeft}>
          <View style={[styles.menuButtonIcon, danger && styles.menuButtonIconDanger]}>
            <Text style={styles.menuButtonEmoji}>{icon}</Text>
          </View>
          <Text style={[styles.menuButtonText, danger && styles.menuButtonTextDanger]}>
            {title}
          </Text>
        </View>
        <View style={styles.menuButtonRight}>
          {badge && (
            <View style={styles.menuBadge}>
              <Text style={styles.menuBadgeText}>{badge}</Text>
            </View>
          )}
          <Text style={[styles.menuButtonArrow, danger && styles.menuButtonArrowDanger]}>
            →
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header élégant avec avatar */}
        <View style={styles.elegantHeader}>
          <View style={styles.headerDecoration} />
          <Animated.View style={[styles.avatarContainer, { transform: [{ scale: scaleAnim }] }]}>
            <TouchableOpacity onPress={handleAvatarPress} activeOpacity={0.8}>
              <View style={styles.elegantAvatar}>
                {profileImage ? (
                  <Image 
                    source={{ uri: profileImage }} 
                    style={styles.avatarImage}
                    resizeMode="cover"
                  />
                ) : (
                  <Text style={styles.avatarText}>
                    {user?.nom?.charAt(0).toUpperCase() || 'U'}
                  </Text>
                )}
                {uploadingImage && (
                  <View style={styles.uploadingOverlay}>
                    <Ionicons name="cloud-upload-outline" size={24} color={COLORS.white} />
                  </View>
                )}
                <View style={styles.cameraIconSmall}>
                  <Ionicons name="camera" size={12} color={COLORS.white} />
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>
          <View style={styles.userInfoHeader}>
            <Text style={styles.userNameHeader}>{user?.nom || 'Utilisateur'}</Text>
            <Text style={styles.userEmailHeader}>{user?.email || 'email@example.com'}</Text>
          </View>
        </View>

        {/* Informations personnelles */}
        <View style={styles.elegantSection}>
          <View style={styles.elegantSectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.elegantSectionTitle}>Informations personnelles</Text>
            </View>
            {!editing && (
              <TouchableOpacity 
                onPress={() => setEditing(true)}
                style={styles.elegantEditButton}
                activeOpacity={0.7}
              >
                <Text style={styles.elegantEditButtonText}>Modifier</Text>
              </TouchableOpacity>
            )}
          </View>

          {editing ? (
            <View style={styles.editForm}>
              <Input
                label="Nom complet"
                value={formData.nom}
                onChangeText={(value) => updateFormData('nom', value)}
                placeholder="Entrez votre nom complet"
              />

              <Input
                label="Téléphone"
                value={formData.telephone}
                onChangeText={(value) => updateFormData('telephone', value)}
                keyboardType="phone-pad"
                placeholder="Entrez votre numéro de téléphone"
              />

              <Input
                label="Adresse"
                value={formData.adresse}
                onChangeText={(value) => updateFormData('adresse', value)}
                multiline
                numberOfLines={3}
                placeholder="Entrez votre adresse complète"
              />

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
            <View style={styles.elegantInfoCards}>
              <View style={styles.elegantInfoCard}>
                <SimpleIcon iconKey="personalInfo" containerSize={36} />
                <View style={styles.elegantInfoContent}>
                  <Text style={styles.elegantInfoLabel}>Nom complet</Text>
                  <Text style={styles.elegantInfoValue}>{user?.nom || 'Non renseigné'}</Text>
                </View>
              </View>

              <View style={styles.elegantInfoCard}>
                <SimpleIcon iconKey="phone" containerSize={36} />
                <View style={styles.elegantInfoContent}>
                  <Text style={styles.elegantInfoLabel}>Téléphone</Text>
                  <Text style={styles.elegantInfoValue}>
                    {user?.telephone ? formatPhoneNumber(user.telephone) : 'Non renseigné'}
                  </Text>
                </View>
              </View>

              <View style={styles.elegantInfoCard}>
                <SimpleIcon iconKey="location" containerSize={36} />
                <View style={styles.elegantInfoContent}>
                  <Text style={styles.elegantInfoLabel}>Adresse</Text>
                  <Text style={styles.elegantInfoValue}>{user?.adresse || 'Non renseigné'}</Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Menu principal */}
        <View style={styles.elegantSection}>
          <Text style={styles.elegantSectionTitle}>Menu</Text>
          <View style={styles.elegantMenuButtons}>
            <TouchableOpacity 
              style={styles.elegantMenuButton}
              onPress={() => navigation.navigate('Orders', { screen: 'OrderHistory' })}
              activeOpacity={0.8}
            >
              <SimpleIcon iconKey="orders" containerSize={36} />
              <Text style={styles.elegantMenuText}>Mes commandes</Text>
              <NavIcon iconKey="forward" size={16} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.elegantMenuButton}
              onPress={() => navigation.navigate('Favorites')}
              activeOpacity={0.7}
            >
              <SimpleIcon iconKey="favorites" containerSize={36} />
              <Text style={styles.elegantMenuText}>Mes favoris</Text>
              <NavIcon iconKey="forward" size={16} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.elegantMenuButton}
              onPress={() => navigation.navigate('Notifications')}
              activeOpacity={0.7}
            >
              <SimpleIcon iconKey="notifications" containerSize={36} />
              <Text style={styles.elegantMenuText}>Notifications</Text>
              <NavIcon iconKey="forward" size={16} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.elegantMenuButton}
              onPress={() => navigation.navigate('Settings')}
              activeOpacity={0.7}
            >
              <SimpleIcon iconKey="notificationSettings" containerSize={36} />
              <Text style={styles.elegantMenuText}>Paramètres</Text>
              <NavIcon iconKey="forward" size={16} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.elegantMenuButton}
              onPress={() => Alert.alert('Support', 'Contactez-nous à support@ecommerce.ma')}
              activeOpacity={0.7}
            >
              <SimpleIcon iconKey="help" containerSize={36} />
              <Text style={styles.elegantMenuText}>Aide & Support</Text>
              <NavIcon iconKey="forward" size={16} color="#999" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Section déconnexion */}
        <View style={styles.elegantSection}>
          <TouchableOpacity 
            style={styles.elegantLogoutButton}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <SimpleIcon iconKey="logout" containerSize={36} />
            <Text style={styles.elegantLogoutText}>Déconnexion</Text>
            <NavIcon iconKey="forward" size={16} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.elegantFooter}>
          <Text style={styles.elegantVersion}>Version 1.0.0</Text>
          <Text style={styles.elegantCopyright}>© 2024 EcommerceApp</Text>
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
    paddingBottom: SPACING.lg, // Réduit de xl
  },

  // Header élégant compact
  elegantHeader: {
    backgroundColor: COLORS.primary,
    paddingTop: SPACING.lg, // Réduit de xl
    paddingBottom: SPACING.xl,
    alignItems: 'center',
    borderBottomLeftRadius: 24, // Réduit de 32
    borderBottomRightRadius: 24, // Réduit de 32
    marginBottom: SPACING.lg, // Réduit de xl
    position: 'relative',
    overflow: 'hidden',
  },
  headerDecoration: {
    position: 'absolute',
    top: -30, // Réduit de -50
    right: -30, // Réduit de -50
    width: 100, // Réduit de 150
    height: 100, // Réduit de 150
    borderRadius: 50, // Réduit de 75
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  userInfoHeader: {
    alignItems: 'center',
    marginTop: SPACING.md, // Réduit de lg
  },
  userNameHeader: {
    fontSize: 20, // Réduit de 22
    fontWeight: '700', // Réduit de 800
    color: COLORS.white,
    letterSpacing: 0.3, // Réduit de 0.5
    marginBottom: 3, // Réduit de 4
  },
  userEmailHeader: {
    fontSize: 13, // Réduit de 14
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
    letterSpacing: 0.2, // Réduit de 0.3
  },
  avatarContainer: {
    alignItems: 'center',
  },
  elegantAvatar: {
    width: 80, // Réduit de 100
    height: 80, // Réduit de 100
    borderRadius: 40, // Réduit de 50
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8, // Réduit de 12
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 }, // Réduit de 6
    shadowOpacity: 0.2, // Réduit de 0.25
    shadowRadius: 8, // Réduit de 12
    position: 'relative',
    borderWidth: 3, // Réduit de 4
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatarText: {
    fontSize: 28, // Réduit de 36
    fontWeight: '700', // Réduit de 800
    color: COLORS.primary,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 40, // Même que elegantAvatar
  },
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadingText: {
    fontSize: 24,
    color: COLORS.white,
  },
  cameraIconSmall: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: COLORS.primary,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },

  // Sections élégantes compactes
  elegantSection: {
    backgroundColor: COLORS.white,
    borderRadius: 16, // Réduit de 24
    padding: SPACING.lg, // Réduit de xl
    marginHorizontal: SPACING.md, // Réduit de lg
    marginBottom: SPACING.md, // Réduit de lg
    elevation: 3, // Réduit de 4
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, // Réduit de 3
    shadowOpacity: 0.06, // Réduit de 0.08
    shadowRadius: 8, // Réduit de 12
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.04)',
  },
  elegantSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md, // Réduit de lg
    paddingBottom: SPACING.xs, // Réduit de sm
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F5',
  },
  sectionTitleContainer: {
    flex: 1,
  },
  elegantSectionTitle: {
    fontSize: 18, // Réduit de 20
    fontWeight: '700', // Réduit de 800
    color: COLORS.dark,
    letterSpacing: 0.3, // Réduit de 0.5
  },
  elegantEditButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.sm, // Réduit de md
    paddingVertical: SPACING.xs,
    borderRadius: 12, // Réduit de 16
    elevation: 2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 1 }, // Réduit de 2
    shadowOpacity: 0.25, // Réduit de 0.3
    shadowRadius: 3, // Réduit de 4
    alignSelf: 'flex-start',
  },
  elegantEditButtonText: {
    fontSize: 11, // Réduit de 12
    fontWeight: '600', // Réduit de 700
    color: COLORS.white,
    letterSpacing: 0.2, // Réduit de 0.3
  },

  // Formulaire d'édition compact
  editForm: {
    gap: SPACING.sm, // Réduit de md
  },
  editButtons: {
    flexDirection: 'row',
    gap: SPACING.sm, // Réduit de md
    marginTop: SPACING.md, // Réduit de lg
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 1,
  },

  // Cartes d'information élégantes compactes
  elegantInfoCards: {
    gap: SPACING.sm, // Réduit de lg
  },
  elegantInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFBFC',
    padding: SPACING.md, // Réduit de xl
    borderRadius: 12, // Réduit de 20
    borderWidth: 1,
    borderColor: '#F0F2F5',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  elegantInfoContent: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  elegantInfoLabel: {
    fontSize: 12, // Réduit de 13
    color: '#666',
    fontWeight: '500',
    marginBottom: 4, // Réduit de 6
    letterSpacing: 0.1, // Réduit de 0.2
  },
  elegantInfoValue: {
    fontSize: 14, // Réduit de 16
    color: COLORS.dark,
    fontWeight: '600',
    letterSpacing: 0.2, // Réduit de 0.3
  },

  // Menu élégant compact
  elegantMenuButtons: {
    gap: SPACING.xs, // Réduit de md
  },
  elegantMenuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFBFC',
    padding: SPACING.md, // Réduit de xl
    borderRadius: 12, // Réduit de 20
    borderWidth: 1,
    borderColor: '#F0F2F5',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  elegantMenuText: {
    flex: 1,
    fontSize: 14, // Réduit de 16
    fontWeight: '600',
    color: COLORS.dark,
    letterSpacing: 0.2, // Réduit de 0.3
    marginLeft: SPACING.md,
  },
  elegantMenuBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: 10, // Réduit de 12
    paddingHorizontal: SPACING.xs, // Réduit de sm
    paddingVertical: 3, // Réduit de 4
    marginRight: SPACING.sm, // Réduit de md
    minWidth: 20, // Réduit de 24
    alignItems: 'center',
    elevation: 2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  elegantMenuBadgeText: {
    color: COLORS.white,
    fontSize: 10, // Réduit de 11
    fontWeight: '700',
    letterSpacing: 0.1, // Réduit de 0.2
  },
  elegantMenuArrow: {
    fontSize: 16, // Réduit de 18
    fontWeight: '600',
    color: '#999',
  },

  // Bouton déconnexion élégant compact
  elegantLogoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SPACING.md, // Réduit de xl
    borderRadius: 12, // Réduit de 20
    borderWidth: 1,
    borderColor: COLORS.primary + '30',
    elevation: 1,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  elegantLogoutText: {
    flex: 1,
    fontSize: 14, // Réduit de 16
    fontWeight: '600',
    color: COLORS.primary,
    letterSpacing: 0.2, // Réduit de 0.3
    marginLeft: SPACING.md,
  },
  elegantLogoutArrow: {
    fontSize: 16, // Réduit de 18
    fontWeight: '600',
    color: COLORS.danger,
  },

  // Footer élégant compact
  elegantFooter: {
    alignItems: 'center',
    paddingHorizontal: SPACING.md, // Réduit de lg
    paddingVertical: SPACING.lg, // Réduit de xl
  },
  elegantVersion: {
    fontSize: 12, // Réduit de 13
    color: '#999',
    fontWeight: '500',
    marginBottom: SPACING.xs,
  },
  elegantCopyright: {
    fontSize: 10, // Réduit de 11
    color: '#999',
    fontWeight: '400',
  },
});

export default ProfileScreen;