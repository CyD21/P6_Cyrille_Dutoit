//==============================================================
// *Gestion des routes sauces
//==============================================================
const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");             // Controôle de l'authentification
const multer = require("../middleware/multer-config");  // Configuration de la gestion des fichiers 
const sauceCtrl = require("../controllers/sauces");     // Importation du controller sauces

// *Enregistrement des routes sauces
router.get("/", auth, sauceCtrl.getAllSauces);
router.get("/:id", auth, sauceCtrl.getOneSauce);
router.post("/", auth, multer, sauceCtrl.createSauce);
router.put("/:id", auth, multer, sauceCtrl.modifySauce);
router.delete("/:id", auth, sauceCtrl.deleteSauce);
router.post("/:id/like", auth, sauceCtrl.likeSauce);

// *Exportation des méthodes de routes
module.exports = router;
