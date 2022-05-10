//==============================================================
// *Gestion de la validité des mots de passe
//==============================================================
const pwdSchema = require("../models/password"); // Importation du format de mots de passe valide 

module.exports = (req, res, next) => {
  if (pwdSchema.validate(req.body.password)) {
    next();
  } else {
    res.status(400).json({
      message:
        "Votre mot de passe doit faire entre 8 et 20 caractères et contenir au moins une minuscule, une majuscule et deux chiffre",
    });
  }
};
