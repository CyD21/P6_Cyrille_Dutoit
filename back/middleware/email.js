//==============================================================
// *Gestion de la validité des emails
//==============================================================
const checkEmail = require("email-validator"); // controle la validité des emails (regex)

module.exports = (req, res, next) => {
  if (checkEmail.validate(req.body.email)) {
    next();
  } else {
    return res
      .status(400)
      .json({ message: "Veuillez saisir une adresse électronique valide." });
  }
};
