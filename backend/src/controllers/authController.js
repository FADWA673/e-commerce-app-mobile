// backend/src/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

// Inscription
exports.register = async (req, res) => {
  try {
    const { nom, email, password, telephone, adresse } = req.body;

    // Validation
    if (!nom || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Nom, email et mot de passe sont requis.' 
      });
    }

    // Vérifier si l'email existe déjà
    const [existingUser] = await db.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cet email est déjà utilisé.' 
      });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insérer l'utilisateur
    const [result] = await db.query(
      'INSERT INTO users (nom, email, password, telephone, adresse) VALUES (?, ?, ?, ?, ?)',
      [nom, email, hashedPassword, telephone || null, adresse || null]
    );

    // Générer le token
    const token = jwt.sign(
      { userId: result.insertId },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Inscription réussie',
      token,
      user: {
        id: result.insertId,
        nom,
        email,
        telephone,
        adresse
      }
    });
  } catch (error) {
    console.error('Erreur inscription:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur lors de l\'inscription.' 
    });
  }
};

// Connexion
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email et mot de passe requis.' 
      });
    }

    // Trouver l'utilisateur
    const [users] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: 'Email ou mot de passe incorrect.' 
      });
    }

    const user = users[0];

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Email ou mot de passe incorrect.' 
      });
    }

    // Générer le token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Connexion réussie',
      token,
      user: {
        id: user.id,
        nom: user.nom,
        email: user.email,
        telephone: user.telephone,
        adresse: user.adresse
      }
    });
  } catch (error) {
    console.error('Erreur connexion:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur lors de la connexion.' 
    });
  }
};

// Obtenir le profil
exports.getProfile = async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, nom, email, telephone, adresse, created_at FROM users WHERE id = ?',
      [req.userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Utilisateur non trouvé.' 
      });
    }

    res.json({
      success: true,
      user: users[0]
    });
  } catch (error) {
    console.error('Erreur profil:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur.' 
    });
  }
};

// Mettre à jour le profil
exports.updateProfile = async (req, res) => {
  try {
    const { nom, telephone, adresse } = req.body;

    await db.query(
      'UPDATE users SET nom = ?, telephone = ?, adresse = ? WHERE id = ?',
      [nom, telephone, adresse, req.userId]
    );

    res.json({
      success: true,
      message: 'Profil mis à jour avec succès'
    });
  } catch (error) {
    console.error('Erreur mise à jour:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur.' 
    });
  }
};