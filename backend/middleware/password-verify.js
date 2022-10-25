/*MIDDLEWARE DE VERIFICATION DE MOT DE PASSE (SIGNUP)

MODULES */
const passwordValidator =  require('password-validator');

const passwordSchema = new passwordValidator();

// Contraintes du mot de passe
passwordSchema
.is().min(8)                                    // Longueur minimun : 8
.has().uppercase()                              // Doit avoir au moins une majuscule
.has().lowercase()                              // Doit avoir au moins une minuscule
.has().digits()                                 // Doit avoir au moins un chiffre
.has().symbols()                                // Doit avoir au moins un symbole
.has().not().spaces()                           // Ne doit pas avoir d'espaces.

module.exports = (req, res, next) => {
  if (!passwordSchema.validate(req.body.password)) {
      res.writeHead(400, '{"message":"Mot de passe requis : 8 caractères minimun. Au moins 1 Majuscule, 1 minuscule, 1 chiffre, 1 symbole, pas d\'espaces"}', {
          'content-type': 'application/json'
      });
      res.end('Format de mot de passe incorrect');
  } else {
      next();
  }
};


