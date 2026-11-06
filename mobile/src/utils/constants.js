// mobile/src/utils/constants.js

// URL de votre API backend
// Pour iPhone physique: utilisez l'IP WiFi de votre PC
// IP WiFi détectée : 20.30.1.113
export const API_URL = 'http://20.30.1.113:3000/api';

// URL de base pour les images et fichiers statiques
export const BASE_URL = 'http://20.30.1.113:3000';

// Fonction helper pour construire les URLs d'images
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  return `${BASE_URL}${imagePath}`;
};

// Couleurs de l'application - Thème Burgundy Foncé et Blanc
export const COLORS = {
  primary: '#722F37',        // Burgundy foncé principal
  secondary: '#8B4A52',      // Burgundy moyen
  accent: '#A0616A',         // Burgundy clair
  dark: '#2C1B1D',           // Burgundy très foncé pour les textes
  light: '#FAF8F9',         // Blanc cassé très léger
  white: '#FFFFFF',          // Blanc pur
  gray: '#8E8E8E',           // Gris moyen
  lightGray: '#C4C4C4',      // Gris clair
  success: '#2ECC71',        // Vert (gardé pour les succès)
  danger: '#E74C3C',         // Rouge (gardé pour les erreurs)
  warning: '#F39C12',        // Orange (gardé pour les avertissements)
  info: '#3498DB',           // Bleu (gardé pour les infos)
  
  // Couleurs spécifiques au thème burgundy
  cream: '#FDF9FA',          // Crème très légère
  rose: '#F5E6E8',           // Rose très pâle
  wine: '#5D252A',           // Vin foncé
  burgundy: '#722F37',       // Burgundy principal
  darkBurgundy: '#4A1E23',   // Burgundy très foncé
  sand: '#F5F1E8',           // Beige sable
};

// Tailles
export const SIZES = {
  small: 12,
  medium: 16,
  large: 20,
  xlarge: 24,
  xxlarge: 32,
};

// Devise
export const CURRENCY = {
  symbol: 'DH',
  name: 'Dirham',
};

// Espacement
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

// Status des commandes
export const ORDER_STATUS = {
  en_attente: 'En attente',
  validee: 'Validée',
  livree: 'Livrée',
  annulee: 'Annulée',
};

export const ORDER_STATUS_COLORS = {
  en_attente: COLORS.warning,
  validee: COLORS.info,
  livree: COLORS.success,
  annulee: COLORS.danger,
};