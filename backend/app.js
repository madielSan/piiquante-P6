//MODULES
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const path = require("path");
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const mongoMorgan = require('./middleware/logger');
//ROUTES
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');


//Connexion de l'application à la base de données MONGO_DB
mongoose.connect(process.env.MONGODB_BD,
{ useNewUrlParser: true,
  useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

  const app = express();
  app.use(helmet()); // protège les headers HTTP des attaques Cross-site-scripting (XSS), clickjacking etc...

// Paramétrage des headers CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', process.env.HOST);
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Cross-Origin-Resource-Policy', 'same-site'); //les requêtes provenant du même site peuvent lire les ressources.
    next();
  });



app.use(express.json()); //extraction du body JSON pour gérer les requêtes.
app.use(mongoSanitize());
app.use(mongoMorgan);
// app.use(morgan(":method :url :status :response-time ms - :res[content-length] [:date[web]] ")); 
app.use('/images', express.static(path.join(__dirname, 'images'))); //gestion des images de manière statique dans le dossier /images
//gestionnaire de routage
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);



module.exports = app;