const Sauce = require("../models/Sauce");
const fs = require("fs");
/**===================================================================================
 * *Création d' une sauce
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 ====================================================================================*/
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
    .then(() =>
      res.status(201).json({ message: "Sauce enregistrée !" })
    )
    .catch((error) =>
      res.status(401).json({ error })
    );
};

/**=====================================================================================
 * *Modification d'une sauce
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 ======================================================================================*/
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
      }
    : { ...req.body };
  Sauce.updateOne({_id: req.params.id},{...sauceObject, _id: req.params.id})
    .then(() => res.status(200).json({ message: "Sauce modifiée !"}))
    .catch((error) => res.status(400).json({ error })
    );
};

/**========================================================================================
 * *Suppression d'une sauce
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 =========================================================================================*/
exports.deleteOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() =>
            res.status(200).json({ message: "Sauce supprimée !" })
          )
          .catch((error) => { res.status(400).json({ error: error });
          });
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

/**==========================================================================================
 * *Récupération d'une seul sauce
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 ============================================================================================*/
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({_id: req.params.id,})
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

/**==========================================================================================
 * *Récupération de toutes les sauces
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 ============================================================================================*/
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

/**==========================================================================================
 * *Gestion des likes sur les sauces
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 ============================================================================================*/
exports.likeSauce = (req, res, next) => {
  const like = req.body.like;
  const idOfUser = req.body.userId;
  const choosenSauce = req.params.id;

  Sauce.findOne({ _id: choosenSauce })
    .then((sauce) => {
      const updateLike = {
        usersLiked: sauce.usersLiked,
        usersDisliked: sauce.usersDisliked,
        likes: 0,
        dislikes: 0,
      };
      switch (like) {
        case -1:
          updateLike.usersDisliked.push(idOfUser);
          break;
        case 0:
          if (updateLike.usersLiked.includes(idOfUser)) {
            const index = updateLike.usersLiked.indexOf(idOfUser);
            updateLike.usersLiked.splice(index, 1);
          } else {
            const index = updateLike.usersDisliked.indexOf(idOfUser);
            updateLike.usersDisliked.splice(index, 1);
          }
          break;
        case 1:
          updateLike.usersLiked.push(idOfUser);
          break;

        default:
          break;
      }
      updateLike.likes = updateLike.usersLiked.length;
      updateLike.dislikes = updateLike.usersDisliked.length;

      Sauce.updateOne({ _id: choosenSauce }, updateLike)
        .then(() => res.status(200).json({ message: "Sauce notée !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(404).json({ error }));
};
