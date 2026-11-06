// mobile/src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import ApiService from '../services/api';
import { storage } from '../services/storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Vérifier si l'utilisateur est connecté au démarrage
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      console.log('🔍 Vérification de l\'authentification...');
      const token = await storage.getToken();
      const savedUser = await storage.getUser();

      console.log('📦 Token:', token ? 'Existe' : 'Inexistant');
      console.log('👤 User:', savedUser ? 'Existe' : 'Inexistant');

      if (token && savedUser) {
        setUser(savedUser);
        setIsAuthenticated(true);
        console.log('✅ Utilisateur authentifié');
      } else {
        console.log('❌ Pas d\'utilisateur authentifié');
      }
    } catch (error) {
      console.error('❌ Erreur vérification auth:', error);
    } finally {
      console.log('✅ Fin du chargement');
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log('🔑 Tentative de connexion:', email);
      const response = await ApiService.login({ email, password });
      const { token, user } = response;

      await storage.saveToken(token);
      await storage.saveUser(user);

      setUser(user);
      setIsAuthenticated(true);

      console.log('✅ Connexion réussie');
      return { success: true };
    } catch (error) {
      console.error('❌ Erreur de connexion:', error);
      return {
        success: false,
        message: error.message || 'Erreur de connexion',
      };
    }
  };

  const register = async (data) => {
    try {
      console.log('📝 Tentative d\'inscription');
      const response = await ApiService.register(data);
      const { token, user } = response;

      await storage.saveToken(token);
      await storage.saveUser(user);

      setUser(user);
      setIsAuthenticated(true);

      console.log('✅ Inscription réussie');
      return { success: true };
    } catch (error) {
      console.error('❌ Erreur d\'inscription:', error);
      return {
        success: false,
        message: error.message || 'Erreur d\'inscription',
      };
    }
  };

  const logout = async () => {
    await storage.clearAll();
    setUser(null);
    setIsAuthenticated(false);
    console.log('👋 Déconnexion');
  };

  const updateUserProfile = async (data) => {
    try {
      // Note: Vous devrez ajouter cette méthode à ApiService si nécessaire
      // await ApiService.updateProfile(data);
      const updatedUser = { ...user, ...data };
      await storage.saveUser(updatedUser);
      setUser(updatedUser);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Erreur de mise à jour',
      };
    }
  };

  console.log('🔄 AuthContext - Loading:', loading, 'IsAuth:', isAuthenticated);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};