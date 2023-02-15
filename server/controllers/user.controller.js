// ---------------------------------------------------
// CONTROLLER SETUP - User
// ---------------------------------------------------

// 1) Importing Model and External Libraries
const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// 2) Setting up and exporting LogReg requests to server
module.exports = {

  // I) REGISTER REQUEST
	register: (req, res) => {
		
    // i) Create a User instance with info passed in request
		// (this triggers our virtual field creation)
		const newUser = new User(req.body);

		// ii) Save to the database new user
		newUser.save()
			.then(() => {
				res.json({
					message: "Successfully registered",
					user: newUser,
				})
			})
			.catch((err) => {
				console.log(err);
				res.status(400).json(err);
			})
	},

  // II) LOGIN REQUEST

	login: (req, res) => {
		// find the email that they are trying to login with
		User.findOne({ email: req.body.email })
			.then((user) => {
				if(user === null) {
					// ERROR 1: email address is not in DB
					res.status(400).json({ message: "Invalid Login Attempt - 1" })
				} else {
					// Found a valid user with that email address
					// verify the password is valid
					bcrypt.compare(req.body.password, user.password)
						.then((isPasswordValid) => {
							// successfully compared the values, but the boolean tells us if they match
							if(isPasswordValid === true) {
								// return a success WITH a cookie to prove they logged in successfully
								console.log("password is valid");
								// i) Create Cookie Object and sign it with JWT
								res.cookie("usertoken", 
									jwt.sign(
                    { // we can save anything we want in this object and it will be a part of the JWT cookie
                      _id: user._id,
                      username: user.username,
                      email: user.email
                    },
                    process.env.JWT_SECRET
                  ),
									{ // options for this response cookie
										httpOnly: true,
										expires: new Date(Date.now() + 900000000)  // time until they have to log in again
									}
                )
                // ii) Return data related to successfull login
                .json({
                  message: "Successfully logged in",
                  userLoggedIn: {
                    username: user.username,
                    userId: user._id
                  }
                })
							} else {
								// ERROR 2: password is not vaild
								res.status(400).json({ message: "Invalid Login Attempt - 2" })
							}
						})
						.catch((err) => {
              // ERROR 2: error comparing passwords when using bcrypt
							res.status(400).json({ message: "Invalid Login Attempt - 3" })
						})
				}
			})
			.catch((err) => {
				// ERROR 4: specific to errors while looking for the document
				res.status(400).json({ message: "Invalid Login Attempt - 4" })
			})

	},

  // II) LOGOUT REQUEST

	logout: (req, res) => {
		console.log("Logging out!");
		res.clearCookie("usertoken");
		res.status(200).json({ 
      		message: "You have successfully logged out of our system"
    	});
	}
}