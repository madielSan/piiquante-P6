//Module mongoose
const mongoose = require('mongoose');
//Schéma des sauces
const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String},
    heat: { type: Number, required: true, min: 1, max: 10 },
    likes: { type: Number, required: true },
    dislikes: {type: Number, required: true},
    usersLiked: { type: [String]},
    usersDisliked: { type: [String]}
});

module.exports = mongoose.model('Sauce', sauceSchema);