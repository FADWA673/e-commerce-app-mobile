// mobile/src/components/common/ProfessionalIcon.js
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Ionicons, MaterialIcons, Feather, AntDesign, FontAwesome5 } from '@expo/vector-icons';
import { COLORS } from '../../utils/constants';

const ProfessionalIcon = ({ 
  name, 
  size = 20, 
  color = COLORS.primary, 
  backgroundColor = 'transparent',
  containerSize = null,
  borderRadius = null,
  style = {},
  type = 'ionicons' // ionicons, material, feather, antdesign, fontawesome5
}) => {
  const IconComponent = {
    ionicons: Ionicons,
    material: MaterialIcons,
    feather: Feather,
    antdesign: AntDesign,
    fontawesome5: FontAwesome5,
  }[type];

  const containerStyle = {
    backgroundColor,
    width: containerSize,
    height: containerSize,
    borderRadius: borderRadius || (containerSize ? containerSize / 2 : 0),
    justifyContent: 'center',
    alignItems: 'center',
    ...style,
  };

  if (containerSize) {
    return (
      <View style={containerStyle}>
        <IconComponent name={name} size={size} color={color} />
      </View>
    );
  }

  return <IconComponent name={name} size={size} color={color} style={style} />;
};

// Icônes prédéfinies pour l'application
export const AppIcons = {
  // Navigation
  home: { name: 'home-outline', type: 'ionicons' },
  products: { name: 'grid-outline', type: 'ionicons' },
  cart: { name: 'bag-outline', type: 'ionicons' },
  orders: { name: 'receipt-outline', type: 'ionicons' },
  profile: { name: 'person-outline', type: 'ionicons' },
  
  // Paramètres - Compte
  personalInfo: { name: 'person-circle-outline', type: 'ionicons' },
  password: { name: 'lock-closed-outline', type: 'ionicons' },
  email: { name: 'mail-outline', type: 'ionicons' },
  phone: { name: 'call-outline', type: 'ionicons' },
  location: { name: 'location-outline', type: 'ionicons' },
  
  // Paramètres - Notifications
  notifications: { name: 'notifications-outline', type: 'ionicons' },
  notificationSettings: { name: 'settings-outline', type: 'ionicons' },
  emailNotifications: { name: 'mail-outline', type: 'ionicons' },
  pushNotifications: { name: 'phone-portrait-outline', type: 'ionicons' },
  
  // Paramètres - Préférences
  darkMode: { name: 'moon-outline', type: 'ionicons' },
  language: { name: 'language-outline', type: 'ionicons' },
  currency: { name: 'card-outline', type: 'ionicons' },
  
  // Paramètres - Sécurité
  privacy: { name: 'shield-checkmark-outline', type: 'ionicons' },
  terms: { name: 'document-text-outline', type: 'ionicons' },
  policy: { name: 'shield-outline', type: 'ionicons' },
  
  // Paramètres - Support
  help: { name: 'help-circle-outline', type: 'ionicons' },
  contact: { name: 'chatbubble-outline', type: 'ionicons' },
  rating: { name: 'star-outline', type: 'ionicons' },
  
  // Paramètres - À propos
  info: { name: 'information-circle-outline', type: 'ionicons' },
  version: { name: 'code-outline', type: 'ionicons' },
  licenses: { name: 'document-outline', type: 'ionicons' },
  
  // Politique et confidentialité
  shield: { name: 'shield-checkmark-outline', type: 'ionicons' },
  time: { name: 'time-outline', type: 'ionicons' },
  settings: { name: 'settings-outline', type: 'ionicons' },
  
  // Actions
  edit: { name: 'create-outline', type: 'ionicons' },
  delete: { name: 'trash-outline', type: 'ionicons' },
  save: { name: 'checkmark-outline', type: 'ionicons' },
  cancel: { name: 'close-outline', type: 'ionicons' },
  back: { name: 'arrow-back-outline', type: 'ionicons' },
  forward: { name: 'chevron-forward-outline', type: 'ionicons' },
  'chevron-up': { name: 'chevron-up-outline', type: 'ionicons' },
  
  // E-commerce
  favorites: { name: 'heart-outline', type: 'ionicons' },
  favoritesFilled: { name: 'heart', type: 'ionicons' },
  search: { name: 'search-outline', type: 'ionicons' },
  filter: { name: 'filter-outline', type: 'ionicons' },
  sort: { name: 'swap-vertical-outline', type: 'ionicons' },
  
  // Statut
  success: { name: 'checkmark-circle-outline', type: 'ionicons' },
  error: { name: 'alert-circle-outline', type: 'ionicons' },
  warning: { name: 'warning-outline', type: 'ionicons' },
  loading: { name: 'refresh-outline', type: 'ionicons' },
  
  // Médias
  camera: { name: 'camera-outline', type: 'ionicons' },
  image: { name: 'image-outline', type: 'ionicons' },
  upload: { name: 'cloud-upload-outline', type: 'ionicons' },
  eye: { name: 'eye-outline', type: 'ionicons' },
  'eye-off': { name: 'eye-off-outline', type: 'ionicons' },
  
  // Déconnexion
  logout: { name: 'log-out-outline', type: 'ionicons' },
};

// Composant d'icône avec style prédéfini
export const SettingsIcon = ({ iconKey, size = 18, containerSize = 40, style = {} }) => {
  const iconConfig = AppIcons[iconKey];
  
  if (!iconConfig) {
    console.warn(`Icon "${iconKey}" not found in AppIcons`);
    return null;
  }

  return (
    <ProfessionalIcon
      name={iconConfig.name}
      type={iconConfig.type}
      size={size}
      color={COLORS.primary}
      backgroundColor={COLORS.primary + '15'}
      containerSize={containerSize}
      borderRadius={containerSize / 2}
      style={{
        borderWidth: 1,
        borderColor: COLORS.primary + '20',
        elevation: 2,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        ...style,
      }}
    />
  );
};

// Composant d'icône simple sans contours pour le profil
export const SimpleIcon = ({ iconKey, size = 18, containerSize = 40, style = {} }) => {
  const iconConfig = AppIcons[iconKey];
  
  if (!iconConfig) {
    console.warn(`Icon "${iconKey}" not found in AppIcons`);
    return null;
  }

  // Cas spécial pour l'icône cart - utiliser l'emoji
  if (iconKey === 'cart') {
    return (
      <View style={{
        backgroundColor: COLORS.primary + '10',
        width: containerSize,
        height: containerSize,
        borderRadius: containerSize / 2,
        justifyContent: 'center',
        alignItems: 'center',
        ...style,
      }}>
        <Text style={{ fontSize: size, color: COLORS.primary }}>🛒</Text>
      </View>
    );
  }

  return (
    <ProfessionalIcon
      name={iconConfig.name}
      type={iconConfig.type}
      size={size}
      color={COLORS.primary}
      backgroundColor={COLORS.primary + '10'}
      containerSize={containerSize}
      borderRadius={containerSize / 2}
      style={{
        ...style,
      }}
    />
  );
};

// Composant d'icône pour la navigation
export const NavIcon = ({ iconKey, size = 20, color = COLORS.primary }) => {
  const iconConfig = AppIcons[iconKey];
  
  if (!iconConfig) {
    console.warn(`Icon "${iconKey}" not found in AppIcons`);
    return null;
  }

  // Cas spécial pour l'icône cart - utiliser l'emoji
  if (iconKey === 'cart') {
    return (
      <Text style={{ fontSize: size, color: color }}>🛒</Text>
    );
  }

  return (
    <ProfessionalIcon
      name={iconConfig.name}
      type={iconConfig.type}
      size={size}
      color={color}
    />
  );
};

export default ProfessionalIcon;