# EcommerceApp

Application e-commerce mobile (React Native / Expo) avec un backend Node.js/Express et une base de données MySQL.

---

## Structure du projet

```
EcommerceApp/
├── backend/          # API REST Node.js + Express
│   ├── src/
│   │   ├── config/       # Configuration DB, etc.
│   │   ├── controllers/  # Logique métier
│   │   ├── middleware/   # Auth JWT, upload...
│   │   └── routes/       # Définition des routes
│   ├── admin/        # Interface admin (HTML/CSS/JS)
│   ├── database/     # Scripts SQL (schema + migrations)
│   ├── uploads/      # Fichiers uploadés (produits, marques)
│   └── server.js     # Point d'entrée
│
└── mobile/           # Application React Native (Expo)
    ├── src/
    │   ├── screens/      # Écrans de l'application
    │   ├── components/   # Composants réutilisables
    │   ├── navigation/   # Configuration de la navigation
    │   ├── services/     # Appels API
    │   ├── context/      # Contextes React (auth, panier...)
    │   └── utils/        # Utilitaires
    ├── assets/       # Images, fonts
    └── App.js        # Point d'entrée
```

---

## Prérequis

- Node.js >= 18
- MySQL >= 8
- Expo CLI (`npm install -g expo-cli`)
- Un émulateur Android/iOS ou l'app Expo Go

---

## Installation

### Backend

```bash
cd backend
npm install
```

Créer un fichier `.env` à partir de l'exemple :

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=ecommerce
JWT_SECRET=your_jwt_secret
PORT=3000
```

Initialiser la base de données :

```bash
# Exécuter dans l'ordre
mysql -u root -p ecommerce < database/schema.sql
mysql -u root -p ecommerce < database/create_cart_table.sql
mysql -u root -p ecommerce < database/create_favorites_table.sql
mysql -u root -p ecommerce < database/create_orders_tables.sql
mysql -u root -p ecommerce < database/add_brands_system.sql
```

Démarrer le serveur :

```bash
npm run dev      # développement (nodemon)
npm start        # production
```

### Mobile

```bash
cd mobile
npm install
```

Configurer l'URL de l'API dans `src/services/` selon votre environnement (émulateur ou appareil physique).

Démarrer l'application :

```bash
npm start          # Expo DevTools
npm run android    # Android
npm run ios        # iOS
```

---

## Stack technique

| Côté       | Technologies                                      |
|------------|---------------------------------------------------|
| Mobile     | React Native, Expo, React Navigation, Axios       |
| Backend    | Node.js, Express, MySQL2, JWT, Multer, Bcrypt     |
| Base de données | MySQL                                        |
| Admin      | HTML / CSS / JavaScript vanilla                   |

---

## Fonctionnalités

- Authentification (inscription / connexion JWT)
- Catalogue produits avec filtres par catégorie et marque
- Système de favoris
- Panier et commandes
- Upload d'images (produits, logos marques)
- Interface d'administration
- Mode sombre

---

## Licence

MIT
