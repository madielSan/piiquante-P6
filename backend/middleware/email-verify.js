// MIDDLEWARE DE VERIFICATION DE l'ADRESSE MAIL
const {body, validationResult} = require('express-validator');

// Vérification de l'entrée pour une adresse mail
const signUpValidation = () => {
    return [body('email').isEmail()]

};

// Validation ou message d'erreur si l'entrée n'est pas une adresse mail.
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    res.writeHead(420, '{"message":"Format adresse mail invalide"}', {
      'content-type': 'application/json'
  });
  res.end('Format d\'adresse mail invalide');
  };
  
  module.exports = {
    signUpValidation,
    validate,
  };