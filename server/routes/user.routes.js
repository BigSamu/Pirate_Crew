// ---------------------------------------------------
// ROUTES SETUP - User
// ---------------------------------------------------

// 1) Importing Controller
const UserController = require('../controllers/user.controller');

// 2) Setting up and exporting API routes for requests
module.exports = function(app) {
	// register user
	app.post("/api/users/register", UserController.register);
	// login user
	app.post("/api/users/login", UserController.login);
	// logout user
	app.get("/api/users/logout", UserController.logout);
}