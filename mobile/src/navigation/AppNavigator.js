// mobile/src/navigation/AppNavigator.js
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import Loading from '../components/common/Loading';
import { NavIcon } from '../components/common/ProfessionalIcon';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Welcome Screen
import WelcomeScreen from '../screens/welcome/WelcomeScreen';

// Home Screen
import HomeScreen from '../screens/home/HomeScreen';

// Product Screens
import ProductListScreen from '../screens/products/ProductListScreen';
import ProductDetailScreen from '../screens/products/ProductDetailScreen';

// Category & Brand Screens
import CategoryBrandsScreen from '../screens/categories/CategoryBrandsScreen';
import BrandProductsScreen from '../screens/brands/BrandProductsScreen';

// Cart Screens
import CartScreen from '../screens/cart/CartScreen';

// Order Screens
import CheckoutScreen from '../screens/orders/CheckoutScreen';
import OrderHistoryScreen from '../screens/orders/OrderHistoryScreen';
import OrderDetailScreen from '../screens/orders/OrderDetailScreen';
// Profile Screens
import ProfileScreen from '../screens/profile/ProfileScreen';
import SettingsScreen from '../screens/profile/SettingsScreen';
import ChangePasswordScreen from '../screens/profile/ChangePasswordScreen';
import NotificationSettingsScreen from '../screens/profile/NotificationSettingsScreen';
import AccountInfoScreen from '../screens/profile/AccountInfoScreen';

// Notifications & Favorites Screens
import NotificationsScreen from '../screens/notifications/NotificationsScreen';
import FavoritesScreen from '../screens/favorites/FavoritesScreen';

// New Settings Screens
import EmailSettingsScreen from '../screens/profile/EmailSettingsScreen';
import LanguageSettingsScreen from '../screens/profile/LanguageSettingsScreen';
import CurrencySettingsScreen from '../screens/profile/CurrencySettingsScreen';
import PrivacyScreen from '../screens/profile/PrivacyScreen';
import PrivacyPolicyScreen from '../screens/profile/PrivacyPolicyScreen';
import SupportScreen from '../screens/profile/SupportScreen';
import TermsScreen from '../screens/profile/TermsScreen';
import RatingScreen from '../screens/profile/RatingScreen';
import LicensesScreen from '../screens/profile/LicensesScreen';

import { COLORS } from '../utils/constants';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Stack pour l'accueil
const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: COLORS.white,
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CategoryBrands"
        component={CategoryBrandsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BrandProducts"
        component={BrandProductsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

// Stack pour les produits
const ProductStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: COLORS.white,
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen
        name="ProductList"
        component={ProductListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CategoryBrands"
        component={CategoryBrandsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BrandProducts"
        component={BrandProductsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

// Stack pour le panier
const CartStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: COLORS.white,
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen
        name="CartMain"
        component={CartScreen}
        options={{ title: 'Mon Panier' }}
      />
      <Stack.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={{ title: 'Paiement' }}
      />
    </Stack.Navigator>
  );
};

// Stack pour les commandes
const OrderStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: COLORS.white,
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen
        name="OrderHistoryMain"
        component={OrderHistoryScreen}
        options={{ title: 'Mes Commandes' }}
      />
      {/* AJOUTEZ CETTE LIGNE */}
      <Stack.Screen
        name="OrderDetail"
        component={OrderDetailScreen}
        options={{ title: 'Détails de la commande' }}
      />
    </Stack.Navigator>
  );
};
// Stack pour le profil
const ProfileStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: COLORS.white,
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen
        name="ProfileMain"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NotificationSettings"
        component={NotificationSettingsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AccountInfo"
        component={AccountInfoScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EmailSettings"
        component={EmailSettingsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LanguageSettings"
        component={LanguageSettingsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CurrencySettings"
        component={CurrencySettingsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Privacy"
        component={PrivacyScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicyScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Support"
        component={SupportScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Terms"
        component={TermsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Rating"
        component={RatingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Licenses"
        component={LicensesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OrderHistory"
        component={OrderHistoryScreen}
        options={{ title: 'Mes Commandes' }}
      />
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

// Tab Navigator pour les utilisateurs connectés
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray,
        headerShown: false,
        tabBarStyle: {
          paddingBottom: 5,
          height: 60,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color, size }) => (
            <NavIcon iconKey="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Products"
        component={ProductStack}
        options={{
          title: 'Produits',
          tabBarIcon: ({ color, size }) => (
            <NavIcon iconKey="products" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartStack}
        options={{
          title: 'Panier',
          tabBarIcon: ({ color, size }) => (
            <NavIcon iconKey="cart" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Orders"
        component={OrderStack}
        options={{
          title: 'Commandes',
          tabBarIcon: ({ color, size }) => (
            <NavIcon iconKey="orders" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => (
            <NavIcon iconKey="profile" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Stack d'authentification
const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

// Navigation principale
const AppNavigator = () => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return <Loading />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigator;