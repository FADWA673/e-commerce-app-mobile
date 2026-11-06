// mobile/src/context/ThemeContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Couleurs pour les thèmes
export const lightTheme = {
  primary: '#722F37',        // Burgundy foncé
  secondary: '#8B4A52',      // Burgundy moyen
  background: '#FFFFFF',     // Blanc pur
  surface: '#FAF8F9',        // Blanc cassé très léger
  text: '#2C1B1D',           // Burgundy très foncé pour les textes
  textSecondary: '#8E8E8E',  // Gris moyen
  border: '#F5E6E8',         // Rose très pâle
  success: '#2ECC71',
  warning: '#F39C12',
  danger: '#E74C3C',
  info: '#3498DB',
};

export const darkTheme = {
  primary: '#A0616A',        // Burgundy clair pour le mode sombre
  secondary: '#8B4A52',      // Burgundy moyen
  background: '#2C1B1D',     // Burgundy très foncé
  surface: '#4A1E23',        // Burgundy foncé
  text: '#FAF8F9',           // Blanc cassé
  textSecondary: '#C4C4C4',  // Gris clair
  border: '#5D252A',         // Vin foncé
  success: '#2ECC71',
  warning: '#F39C12',
  danger: '#E74C3C',
  info: '#3498DB',
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Charger le thème sauvegardé au démarrage
  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme !== null) {
        setIsDarkMode(savedTheme === 'dark');
      }
    } catch (error) {
      console.error('Erreur lors du chargement du thème:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = async () => {
    try {
      const newTheme = !isDarkMode;
      setIsDarkMode(newTheme);
      await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du thème:', error);
    }
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  const value = {
    isDarkMode,
    theme,
    toggleTheme,
    isLoading,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};