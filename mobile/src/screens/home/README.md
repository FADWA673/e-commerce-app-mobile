# Page d'Accueil - EcommerceApp

## Description
La page d'accueil de l'application e-commerce offre une expérience utilisateur complète avec tous les éléments essentiels pour la navigation et la découverte de produits.

## Fonctionnalités

### 🏠 Header avec message de bienvenue
- Message personnalisé "Bonjour ! 👋"
- Sous-titre engageant "Que cherchez-vous aujourd'hui ?"
- Design avec fond coloré (couleur primaire)

### 🔍 Barre de recherche stylée
- Champ de recherche avec icône
- Bouton de recherche dédié
- Navigation automatique vers la liste des produits avec le terme de recherche

### 📱 Catégories en défilement horizontal
- 6 catégories principales : Électronique, Vêtements, Maison, Sport, Livres, Beauté
- Icônes emoji pour chaque catégorie
- Couleurs distinctives pour chaque catégorie
- Navigation vers la liste des produits filtrée par catégorie

### ⭐ Section "Produits populaires"
- Affichage horizontal des produits les plus populaires
- Cartes produits avec image, nom, prix et note
- Bouton "Voir tout" pour accéder à la liste complète

### 🆕 Section "Nouveautés"
- Affichage horizontal des derniers produits ajoutés
- Badge "NOUVEAU" sur les produits récents
- Bouton "Voir tout" pour accéder à la liste complète

### 🎉 Bannière promotionnelle
- Offre spéciale mise en avant
- Bouton d'action pour profiter de l'offre
- Design attractif avec couleur d'accent

## Structure des Composants

### Composants réutilisables créés :
- `SearchBar` - Barre de recherche avec bouton
- `CategoryCard` - Carte de catégorie avec icône et couleur
- `ProductCard` - Carte produit avec image, prix et note
- `SectionHeader` - En-tête de section avec bouton "Voir tout"
- `PromoBanner` - Bannière promotionnelle

### Navigation
- Intégration dans le `AppNavigator` comme onglet principal "Accueil"
- Navigation vers les écrans de produits avec paramètres (recherche, catégorie)
- Navigation vers les détails des produits

## Données
- Utilisation de données mockées pour la démonstration
- Structure prête pour l'intégration avec l'API backend
- Gestion du chargement avec indicateur

## Styles
- Utilisation des constantes de couleurs et d'espacement
- Design responsive et moderne
- Ombres et élévations pour les cartes
- Cohérence avec le design system de l'application

## Améliorations futures possibles
- Intégration avec l'API pour les données réelles
- Système de recommandations personnalisées
- Carrousel d'images promotionnelles
- Notifications push pour les offres spéciales
- Géolocalisation pour les offres locales