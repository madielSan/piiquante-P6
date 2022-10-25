const Sauce = require('../models/Sauce');
const fs = require('fs');

//Pour créer une sauce
exports.createSauce = (req, res, next) => {
    const newSauce = JSON.parse(req.body.sauce)
    delete newSauce._id; //suppression du champs _id de la requête
    delete newSauce._userId;//suppression du champs _userId de la requête
    const sauce = new Sauce({
        ...newSauce,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`
    });
    sauce.save()
    .then(() => res.status(201).json({ message : 'Sauce enregistré !'}))
    .catch(error => res.status(400).json({ error }));
  };
//Pour modifier une sauce
  exports.modifySauce = (req, res, next) => {
    const sauceModified = req.file ? { /*vérification si req.file existe alors traitement 
    des nouvelles données de la sauce et de la nouvelle image dans le dossier /images */
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`
    } : { ...req.body};

    delete sauceModified.userId;
    Sauce.findOne({_id: req.params.id})
    .then((sauce) => {
        if (sauce.userId != req.auth.userId) { /* Si l'utilisateur n'est pas authentifié */
            res.status(403).json({ message: 'Non autorisé'});
        } else {
          const filename = sauce.imageUrl.split('/images/')[1];
          fs.unlink(`images/${filename}`, () => {
            Sauce.updateOne({ _id: req.params.id}, { ...sauceModified, _id: req.params.id })
            .then(() => res.status(200).json({message: "Sauce modifié !"}))
            .catch(error => res.status(401).json({ error }));
          });
        }
    })
    .catch(error => res.status(400).json({ error }));
  };
// Pour supprimer une sauce
  exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then((sauce) => {
        if (sauce.userId != req.auth.userId) { /* Si l'utilisateur n'est pas authentifié */
            res.status(403).json({ message: 'Non autorisé'});
        } else {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => { /*Permet de délier le fichier du dossier /images lorsque la sauce sera supprimée.*/
                Sauce.deleteOne({ _id: req.params.id})
                .then(() => res.status(200).json({message: "Objet supprimé !"}))
                .catch(error => res.status(400).json({ error }));
            });
        }
    })
    .catch(error => res.status(400).json({ error }));
};

//Pour récupérer une sauce.
  exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
  };
//Pour récupérer toutes les sauces.
  exports.getAllSauces = (req, res, next) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
  };
//Pour liker ou disliker une sauce.
  exports.sauceRating = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then(sauce => {
        if (req.body.like === 1)  { //si l'utilisateur aime la sauce (aimer la sauce = 1)
            if (sauce.usersLiked.includes(req.body.userId)) { //Si l'utilisateur aime déjà la sauce
                res.status(401).json({ message: 'Vous likez déjà cette sauce' });
            } else {
                Sauce.updateOne({ _id: req.params.id}, { $inc: { likes: 1 }, $push: { usersLiked: req.body.userId }})
                .then((sauce) => res.status(200).json({ message: 'Sauce likée !' }))
                .catch(error => res.status(400).json({ error }))
            }
        }
         else if (req.body.like === -1) { //si l'utilisateur n'aime pas la sauce ( ne pas aimer la sauce = -1)
            if (sauce.usersDisliked.includes(req.body.userId)) {// si l'utilisateur n'aime déjà pas la sauce
                res.status(401).json({ message: 'Vous dislikez déjà cette sauce' });
            } else {
                Sauce.updateOne({_id: req.params.id}, {$inc: {dislikes: 1}, $push: { usersDisliked: req.body.userId}})
                .then((sauce) => res.status(200).json({ message: 'Sauce dislikée..' }))
                .catch(error => res.status(400).json({ error }))
             }

        } else { // si l'utilisateur change d'avis sur la sauce
            if (sauce.usersLiked.includes(req.body.userId)) { //s'il aimait et qu'il n'aime plus
                Sauce.updateOne({ _id: req.params.id}, { $pull: {usersLiked: req.body.userId }, $inc: {likes: -1}} )
                .then((sauce) => res.status(200).json({ message: 'Vous n\'aimez plus cette sauce..' }))
                .catch(error => res.status(400).json({ error }));
            }
            else if (sauce.usersDisliked.includes(req.body.userId)) { //s'il n'aimait pas et qu'il aime maintenant.
                Sauce.updateOne({ _id: req.params.id}, { $pull: {usersDisliked: req.body.userId }, $inc: {dislikes: -1}} )
                .then((sauce) => res.status(200).json({ message: 'Vous aimez maintenant cette sauce..' }))
                .catch(error => res.status(400).json({ error }));

            }
        }
    })
    .catch(error => res.status(400).json({ error }));
  }