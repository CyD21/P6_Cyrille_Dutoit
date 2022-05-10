//==============================================================
// *Importation des packages
//==============================================================
const http = require("http");
const app = require("./app");

//==============================================================
// *normalizePort
// Fonction qui renvoie un port valide
//==============================================================
const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.PORT);
app.set("port", port);

//==============================================================
// *errorHandler
// Fonction qui gére de façon approprié les erreurs
// Puis elle est enregistrée sur le serveur
//==============================================================
const errorHandler = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const address = server.address();
  const bind =
    typeof address === "string" ? "pipe " + address : "port: " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges.");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use.");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

//==============================================================
// *Mise en route du serveur
// Méthode createServer du package http
//==============================================================
const server = http.createServer(app);

server.on("error", errorHandler);
server.on("listening", () => {
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("Listening on " + bind);
});

//==============================================================
// *server.listen()
// Ecoute le port défini dans les variables d'environnments
//==============================================================
server.listen(port);
