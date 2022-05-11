//==============================================================
// *Gestion des routes utilisateur
//==============================================================
const express = require("express");
const router = express.Router(); // Gestion des routes de l'api

const userCtrl = require("../controllers/user"); // Importation du controller user

const validEmail = require("../middleware/email"); // Contrôle le format de l'email
const passWord = require("../middleware/password");// Controle le format du mot de passe
const Limit = require("../middleware/rate-limit"); // Gestion de la limitation du débit (ratelimit)

// * Enregistrement des routes utilisateur
router.post("/signup", Limit.auth , validEmail, passWord, userCtrl.signup);
router.post("/login", Limit.auth ,userCtrl.login);

// * Exportation des méthodes de routes
module.exports = router; 
