const Sauce = require("../models/sauces");
const fs = require('fs');
/**===================================================================================
 * *Création d' une sauce
 ====================================================================================*/
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  console.log(sauceObject);
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

/**=====================================================================================
 * *Modification d'une sauce
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
 =========================================================================================*/
exports.deleteSauce = (req, res, next) => {
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
 * *Récupération d'une seule sauce
 ============================================================================================*/
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({_id: req.params.id,})
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

/**==========================================================================================
 * *Récupération de toutes les sauces
 ============================================================================================*/
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

/**==========================================================================================
 * *Gestion des likes sur les sauces
 ============================================================================================*/
exports.likeSauce = (req, res, next) => {
  const like = req.body.like; // =1, 0 -1
  const idOfUser = req.body.userId;
  const choosenSauce = req.params.id;

  // console.log(like);
  // console.log(idOfUser);
  // console.log(choosenSauce);

  // rechercher la choosenSauce puis modifier ses infos
  Sauce.findOne({_id: choosenSauce})
      .then(sauce => {
          // valeurs de la sauce à modifier = notation
          const newNotes = {
              usersLiked: sauce.usersLiked,
              usersDisliked: sauce.usersDisliked,
              likes: 0,
              dislikes: 0
          }
          switch (like) {
              //en cas de pouce vers le bas like = -1 :
              case -1:
                  newNotes.usersDisliked.push(idOfUser);
                  break;
              //en cas de changement d'avis, double clic sur le même pouce, ou retrait d'un avis
              case 0:
                  // si on annule un like 
                  if(newNotes.usersLiked.includes(idOfUser)){
                      const index = newNotes.usersLiked.indexOf(idOfUser);
                      newNotes.usersLiked.splice(index, 1);
                  }
                  else { // si on annule un dislike 
                      const index = newNotes.usersDisliked.indexOf(idOfUser);
                      newNotes.usersDisliked.splice(index, 1);
                  }
                  break; 
              // en cas de pouce vers le haut, like = 1
              case 1:
                  newNotes.usersLiked.push(idOfUser);
                  break;

              default:
                  break;
          }
          //total des likes et dislikes après l'action = nombre d'userId/idOfUser dans chaque tableau
          newNotes.likes = newNotes.usersLiked.length;
          newNotes.dislikes = newNotes.usersDisliked.length;

          //mise à jour de ces valeurs dans la bdd : utilisation de la méthode update
          Sauce.updateOne({_id: choosenSauce}, newNotes)
              .then(() => res.status(200).json({ message: 'Sauce notée !' }))
              .catch(error => res.status(400).json({ error }))
          })
      .catch(error => res.status(404).json({error}));
};
