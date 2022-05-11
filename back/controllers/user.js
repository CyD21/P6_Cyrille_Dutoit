//==============================================================
// *Controller des routes utilisateur
//==============================================================

const bcrypt = require("bcrypt");             // Gestion de cryptage de données
const jwt = require("jsonwebtoken");          // Gestion des TOKEN
const loginUser = require("../models/user");  // Appel du modèles utilisateur

//=========================================================================================
// *Enregistrement compte utilisateur POST /API/AUTH/SIGNUP
//=========================================================================================
exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)    // Hash du mot de passe et salage en 10 passe
    .then((hash) => {
      const user = new loginUser({  
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch(() =>
          res.status(400).json({ message: "Adresse email existe deja" })
        );
    })
    .catch((error) => res.status(500).json({ error }));
};

//=========================================================================================
// *Login compte utilisateur POST /API/AUTH/LOGIN
//=========================================================================================
exports.login = (req, res, next) => {
  loginUser
    .findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect" });
          }
          res
            .status(200)
            .json({
              userId: user._id,
              token: jwt.sign({ userId: user._id }, process.env.AUTH_TOKEN, {
              expiresIn: "24h",
              }),
            });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
