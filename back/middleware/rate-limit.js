//==============================================================
// *Gestion de la limitation de débit de base pour express
//==============================================================
const rateLimit = require("express-rate-limit");

const Limit = {
  auth: rateLimit({             // Route user AUTH
    windowMs: 15 * 60 * 1000,   // 15 minutes
    max: 100,                   // Limite chaque adresse IP à 100 requêtes par "fenêtre" (ici, par tranche de 15 minutes)
    standardHeaders: true,      // Renvoye les informations de limite de taux dans les en-têtes `RateLimit-*`
    legacyHeaders: false,       // Désactivation des en-têtes `X-RateLimit-*`
  }),
  routePpd: rateLimit({         // Route sauce POST PUT DELETE
    windowMs: 15 * 60 * 1000,   
    max: 100,                   
    standardHeaders: true,     
    legacyHeaders: false,      
  }),
  routeGet: rateLimit({         // Route sauce GET
    windowMs: 15 * 60 * 1000,
    max: 100,                   
    standardHeaders: true,      
    legacyHeaders: false,       
  }),
};

module.exports = Limit;
