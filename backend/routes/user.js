//MODULES
const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const login = require('../middleware/rate-limit');
const verify = require("../middleware/password-verify");
const { signUpValidation, validate } = require("../middleware/email-verify");
// Routes SIGNUP/LOGIN pour les utilisateurs.
router.post('/signup', signUpValidation(), validate, verify, userCtrl.signup);
router.post('/login', login, userCtrl.login);

module.exports = router; 