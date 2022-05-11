//==============================================================
// *Controller des routes sauces
//==============================================================

const Sauce = require("../models/sauces"); // Importation du modèle sauces
const fs = require("fs"); // Gestion des fichiers

//===================================================================================
// *Création d' une sauce POST /API/SAUCES
//====================================================================================
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Sauce enregistrée !" }))
    .catch((error) => res.status(401).json({ error }));
};

//=====================================================================================
// *Modification d'une sauce PUT /API/SAUCES/:ID 
//======================================================================================
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
      }
    : { 
      ...req.body 
      };
  Sauce.updateOne({ _id: req.params.id },{ ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
    .catch((error) => res.status(400).json({ error }));
};

//========================================================================================
// *Suppression d'une sauce DELETE /API/SAUCES/:ID
//========================================================================================
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Sauce supprimée !" }))
          .catch((error) => {res.status(400).json({ error: error });});
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

//==========================================================================================
// *Récupération d'une seule sauce GET /API/SAUCES/:ID
//==========================================================================================
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

//==========================================================================================
// *Récupération de toutes les sauces GET /API/SAUCES
//==========================================================================================
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

//==========================================================================================
// *Gestion des likes sur les sauces POST /API/SAUCES/:ID/LIKE
//==========================================================================================
exports.likeSauce = (req, res, next) => {
  const like = req.body.like;
  const idOfUser = req.body.userId;
  const choosenSauce = req.params.id;

  // Recherche la sauce choisie (choosenSauce) pour la modifier
  Sauce.findOne({ _id: choosenSauce })
    .then((sauce) => {
      // valeurs de la sauce à modifier = notation
      const changeLike = {
        usersLiked: sauce.usersLiked,
        usersDisliked: sauce.usersDisliked,
        likes: 0,
        dislikes: 0,
      };
      switch (like) {
      // Ajout d'un Dislike = -1 :
        case -1:
          changeLike.usersDisliked.push(idOfUser);
          break;
      // Modification (changelike)
        case 0:
      // Annule un like
          if (changeLike.usersLiked.includes(idOfUser)) 
          {
            const index = changeLike.usersLiked.indexOf(idOfUser);
            changeLike.usersLiked.splice(index, 1);
          } 
          else 
          {
      // Annule dislike
            const index = changeLike.usersDisliked.indexOf(idOfUser);
            changeLike.usersDisliked.splice(index, 1);
          }
          break;
      // Ajout d'un like = 1
        case 1:
          changeLike.usersLiked.push(idOfUser);
          break;

        default:
          break;
      }
      //Calcul des likes et dislikes après mofication = nombre d'userId/idOfUser dans chaque tableau
      changeLike.likes = changeLike.usersLiked.length;
      changeLike.dislikes = changeLike.usersDisliked.length;

      // Mise à jour de la base de données
      Sauce.updateOne({ _id: choosenSauce }, changeLike)
        .then(() => res.status(200).json({ message: "Sauce notée !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(404).json({ error }));
};
