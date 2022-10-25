// MODULES
const express = require('express');
const sauceCtrl = require('../controllers/sauce')
const auth = require('../middleware/auth');
const multer = require('../middleware/multer')
const validateSauce = require('../middleware/sauce-validator');
const router = express.Router();

// Routes pour les sauces.
router.post('/', auth, multer, validateSauce.sauce, sauceCtrl.createSauce);

router.put('/:id', auth, multer, validateSauce.id, validateSauce.sauce, sauceCtrl.modifySauce);

router.delete('/:id', auth, validateSauce.id, sauceCtrl.deleteSauce);

router.get('/:id', auth, validateSauce.id, sauceCtrl.getOneSauce);
  
router.get('/', auth, sauceCtrl.getAllSauces);

router.post('/:id/like', auth, validateSauce.id, validateSauce.rate, sauceCtrl.sauceRating);

module.exports = router; 