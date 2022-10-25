//MODULES
const bcrypt = require('bcrypt'); //module de hasage de mot de passe
const User = require('../models/User');
const jwt = require('jsonwebtoken'); //module permettant de créer un token JSON
const dotenv = require('dotenv').config();
// Création d'un compte Utilisateur
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10) // salage du mot de passe 10 fois
    .then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        });
        user.save()
            .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
            .catch(error => res.status(400).json({ error }));
        }) 
    .catch(error => res.status(500).json({ error }));
};
// Authentification d'un utilisateur existant
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email})
    .then(user => {
        if (!user) {
            return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
        }
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
            if(!valid) {
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
            }
            res.status(200).json({
                userId: user._id,
                //paramétrage du token
                token: jwt.sign(
                    { userId: user._id },
                    process.env.SECRET_TOKEN,
                    { expiresIn: '24h' } 
                )
            });
        })
        .catch(error => res.status(500).json({ error }));

    })
    .catch(error => res.status(500).json({ error }));

};