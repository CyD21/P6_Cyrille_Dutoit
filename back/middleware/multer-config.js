//==============================================================
// *Gestion du stockage des fichiers
//==============================================================
const multer = require("multer"); // Gestion des fichiers

// *Types de fichiers autorisés
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

// *Stockage des fichiers
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    //const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];
    callback(null, "HotSauce" + Date.now() + "." + extension);
  },
});

// *Exportation de la méthode de stockage
module.exports = multer({ storage: storage }).single("image");
