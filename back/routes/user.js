//==============================================================
// *Gestion des routes utilisateur
//==============================================================
const express = require("express");
const router = express.Router(); // Gestion des routes de l'api

const userCtrl = require("../controllers/user"); // Importation du controller user

const validEmail = require("../middleware/email"); // Contrôle le format de l'email
const passWord = require("../middleware/password");// Controle le format du mot de passe

// * Enregistrement des routes utilisateur
router.post("/signup", validEmail, passWord, userCtrl.signup);
router.post("/login", userCtrl.login);

// * Exportation des méthodes de routes
module.exports = router; 
