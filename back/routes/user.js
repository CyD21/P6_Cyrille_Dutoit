const express = require("express");
const router = express.Router();

const userCtrl = require("../controllers/user");

const validEmail =require("../middleware/email")
const passWord = require("../middleware/password");

router.post("/signup", validEmail, passWord, userCtrl.signup);
router.post("/login", userCtrl.login);

module.exports = router;
