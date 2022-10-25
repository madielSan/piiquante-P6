//Middleware de vérification des entrées pour les sauces
//Modules
const Joi = require('@hapi/joi');

//Schéma des entrées valides
const sauceSchema = Joi.object({
    userId: Joi.string().trim().length(24).required(),
    name: Joi.string().trim().min(1).required(),
    manufacturer: Joi.string().trim().min(1).required(),
    description: Joi.string().trim().min(1).required(),
    mainPepper: Joi.string().trim().min(1).required(),
    heat: Joi.number().integer().min(1).max(10).required()
})
//Validation des entrées d'une sauce
exports.sauce = (req, res, next) => {
    let sauce;
    if (req.file) {
        sauce = JSON.parse(req.body.sauce);
    } else {
        sauce = req.body;
    }
    
    const {error, value} = sauceSchema.validate(sauce);
    if (error) {
        res.status(422).json({ error: "Données invalides" });
    } else {
        next();
    }
};

// Validation des entrées like et dislike d'une sauce
 const rateSchema = Joi.object({
    userId: Joi.string().trim().length(24).required(),
    like: Joi.valid(-1, 0, 1).required()
});
exports.rate = (req, res, next) => {
    const {error, value} = rateSchema.validate(req.body);
    if (error) {
        res.status(422).json({ error: "Données invalides" });
    } else {
        next();
    }
};

//Validation de l'id d'une sauce
const idSchema = Joi.string().trim().length(24).required();
exports.id = (req, res, next) => {
   const {error, value} = idSchema.validate(req.params.id);
   if (error) {
       res.status(422).json({ error: "Données invalides" });
   } else {
       next();
   }  
};