const PasswordValidator = require("password-validator");

const pwdSchema = new PasswordValidator();

pwdSchema
  .is().min(8) // Minimum length 8
  .is().max(20) // Maximum length 100
  .has().uppercase() // Must have uppercase letters
  .has().lowercase() // Must have lowercase letters
  .has().digits() // Must have at least 2 digits
  .has().not().spaces() // Should not have spaces
  .is().not().oneOf(["Passw0rd", "Password123"]); // Blacklist these values

module.exports = (req, res, next) => {
  if (pwdSchema.validate(req.body.password)) {
    next();
  } else {
    res.status(400).json({
      message:
        "Votre mot de passe doit faire entre 8 et 20 caractères et contenir au moins une minuscule,majuscule et un chiffre",
    });
  }
};
