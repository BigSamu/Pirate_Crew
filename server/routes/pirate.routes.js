// ---------------------------------------------------
// ROUTES SETUP - Pirate
// ---------------------------------------------------

// 1) Importing Controller
const PirateController = require("../controllers/pirate.controller");

// 2) Importing authenticate function for restricting requests
const { authenticate } = require('../config/jwt.config');

// 3) Setting up and exporting API routes for requests
module.exports = (app) => {
    app.get("/api/pirates", authenticate, PirateController.findAllPirates);
    app.get("/api/pirates/:id", authenticate, PirateController.findPirateById);
    app.post("/api/pirates/new", authenticate, PirateController.createNewPirate);
    app.put("/api/pirates/edit/:id", authenticate, PirateController.updatePirateById);
    app.delete("/api/pirates/delete", authenticate, PirateController.deleteAllPirates);
    app.delete("/api/pirates/delete/:id", authenticate, PirateController.deletePirateById);
};