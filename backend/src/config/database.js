// backend/src/config/database.js
const mysql = require('mysql2');
require('dotenv').config();

// Créer le pool de connexions
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Utiliser les promesses pour les requêtes
const promisePool = pool.promise();

// Tester la connexion
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Erreur de connexion à la base de données:', err.message);
    return;
  }
  console.log('✅ Connexion à MySQL réussie via XAMPP');
  connection.release();
});

module.exports = promisePool;