const express = require("express");
const router = express.Router();

const userCtrl = require("../controllers/user");
const passWord = require("../middleware/password");

router.post("/signup", passWord, userCtrl.signup);
router.post("/login", userCtrl.login);

module.exports = router;
