// Module multer, gestion des fichiers entrants
const multer = require('multer');

// Dictionnaire MIME_TYPES
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

// Fonction storage pour paramétrer le fichier image lors de la création/modification d'une sauce.
const storage = multer.diskStorage({ 
  destination: (req, file, callback) => { 
    callback(null, 'images');
  },
  filename: (req, file, callback) => { 
    const name = file.originalname.split('.')[0].split(' ').join('_'); 
    const extension = MIME_TYPES[file.mimetype]; 
    callback(null, name + Date.now() + '.' + extension); // création du nom de fichier + date + l'extension
  }
});


module.exports = multer({storage: storage}).single('image');