const passwordValidator = require("password-validator");
const pwdSchema = new passwordValidator();

pwdSchema
  .is().min(8) // Minimum length 8
  .is().max(20) // Maximum length 100
  .has().uppercase(1) // Must have uppercase letters
  .has().lowercase(1) // Must have lowercase letters
  .has().digits(2) // Must have at least 2 digits
  .has().not().spaces() // Should not have spaces
  .is().not().oneOf(["Passw0rd", "Password123"]); // Blacklist these values

module.exports = pwdSchema;