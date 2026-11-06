// mobile/src/utils/formatters.js
import { CURRENCY } from './constants';

// Formater le prix avec la devise
export const formatPrice = (price) => {
  if (price === null || price === undefined) return '0 DH';
  
  const numericPrice = parseFloat(price);
  if (isNaN(numericPrice)) return '0 DH';
  
  // Formater avec des espaces pour les milliers
  const formattedPrice = numericPrice.toLocaleString('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  
  return `${formattedPrice} ${CURRENCY.symbol}`;
};

// Formater la date
export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Formater la date et l'heure
export const formatDateTime = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Formater le numéro de téléphone
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  // Supprimer tous les caractères non numériques
  const cleaned = phone.replace(/\D/g, '');
  
  // Formater selon le format marocain
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{4})(\d{2})(\d{2})(\d{2})/, '$1-$2-$3-$4');
  }
  
  return phone;
};

// Tronquer le texte
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength) + '...';
};