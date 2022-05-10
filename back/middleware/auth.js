//==============================================================
// *Fonction de contrôle des TOKEN d'authentication
//==============================================================

const jwt = require("jsonwebtoken"); // Permet de créer et de vérifier le TOKEN d'authentication

module.exports = (req, res, next) => {
  try {

    const token = req.headers.authorization.split(" ")[1];          // Récupération du TOKEN contenu dans le header 
    const decodedToken = jwt.verify(token, process.env.AUTH_TOKEN); // comparaison des TOKEN
    const userId = decodedToken.userId;                             // Renvoi la comparaison à userId

    if (req.body.userId && req.body.userId !== userId) {            // Contrôle des TOKEN 
      throw "Mot de passe invalide";                                // Si true arrête l'instruction, si false continue l'instruction
    } else {
      next();
    }

  } catch {
    res.status(401).json({error: new Error("Cette requête n'est pas valide !"),}); // Message en cas d'échec
  }
};
