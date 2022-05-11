//==============================================================
// *Gestion des routes sauces
//==============================================================
const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");             // Controôle de l'authentification
const multer = require("../middleware/multer-config");  // Configuration de la gestion des fichiers 
const sauceCtrl = require("../controllers/sauces");     // Importation du controller sauces
const rateLimit = require("../middleware/rate-limit");

// *Enregistrement des routes sauces
router.get("/", rateLimit.routeGet ,auth, sauceCtrl.getAllSauces);
router.get("/:id", rateLimit.routeGet ,auth, sauceCtrl.getOneSauce);
router.post("/", rateLimit.routePpd ,auth, multer, sauceCtrl.createSauce);
router.put("/:id", rateLimit.routeGet ,auth, multer, sauceCtrl.modifySauce);
router.delete("/:id", rateLimit.routeGet ,auth, sauceCtrl.deleteSauce);
router.post("/:id/like", rateLimit.routeGet ,auth, sauceCtrl.likeSauce);

// *Exportation des méthodes de routes
module.exports = router;
