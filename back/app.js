const express = require("express");   // Importation du frameworks express
const helmet = require("helmet");     // Sécurise le frameworks express en définissant en-têtes HTTP
const mongoose = require("mongoose"); // Gestion de la base de données mongoDB
const dotenv = require("dotenv");     // Gestion des variables d'environements

const userRoutes = require("./routes/user");      // Importation de la route user
const saucesRoutes = require("./routes/sauces");  // Importation de la route sauces

const path = require("path"); // Gére les requêtes sur le dosssier /images

const app = express(); // Appel du frameworks express

dotenv.config(); // Appel du fichier .env (variables d'envirronements)


//==============================================================
// *Connexion à la base de données
//==============================================================
mongoose
  .connect(
    process.env.MONGO_URL, //Appel de la variables d'environement MONGO_URL
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

//==============================================================
// *CORS (Cross-Origin Ressoure Sharing)
// Défini les entêtes HTTP
//==============================================================
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});


app.use(express.json());                                            // Récupération du body au format Json
app.use(helmet.contentSecurityPolicy({useDefaults: false,}));       // Appel du package helmet
app.use("/api/auth", userRoutes);                                   // Appel de la route utilisateur dans /API/AUTH
app.use("/api/sauces", saucesRoutes);                               // Appel de la route sauces dans /API/SAUCES
app.use("/images", express.static(path.join(__dirname, "images"))); // Gestion des fichiers images de manière static

module.exports = app; // Export
