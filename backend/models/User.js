// Modules mongoose
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
//Schéma utilisateur
const userSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true, }
});

userSchema.plugin(uniqueValidator); /* plugin permettant de s'assurer que deux utilisateurs
ne puissent pas partager la même adresse email */ 

module.exports = mongoose.model('User', userSchema);