// ---------------------------------------------------
// MODEL SETUP - User
// ---------------------------------------------------

// 1) Importing External Libraries
const mongoose = require('mongoose'); 
const bcrypt = require('bcrypt');
const uniqueValidator = require('mongoose-unique-validator');

// 2) Creating Schema for Model (blueprint)
const UserSchema = new mongoose.Schema({
  username: { 
    type: String,
    required: [true, "Error: username is required"],
  },
  email: { 
    type: String,
    unique: true,
    required: [true, "Error: email is required"],
    validate: {
        validator: val => /^([\w-\.]+@([\w-]+\.)+[\w-]+)?$/.test(val),
        message: "Please enter a valid email"
      }
        
  },
  password: { 
    type: String,
    required: [true, "Error: password is required"],
  },
}, { timestamps: true });

// 3) Creating virtual fields

// 3.1) Create a "virtual space" to hold confirmPassword value 
UserSchema.virtual("confirmPassword")
	.get(() => this._confirmPassword)
	.set((value) => this._confirmPassword = value);

// 3.2) Compare passwords but NOT save confirmPassword into the database
UserSchema.pre("validate", function(next) {
  if(this.confirmPassword === ""){
      his.invalidate("confirmPassword", "Error: confirm password is required");
  }
  if(this.password !== this.confirmPassword) {
    this.invalidate("confirmPassword", "Error: passwords didn't match, please type them again");
  }
  // if the passwords match, we can successfully continue on to the "normal" 
  // validate steps
  next();
})
    
// 3.3) Encrypt the password BEFORE we save into the database to make sure that
// no one has access to the user's "real" password

UserSchema.pre("save", function(next) {
	bcrypt.hash(this.password, 10)
		.then((hashedPassword) => {
			this.password = hashedPassword;
			next();
		})
})

// 4) Adding uniqueValidator Plug-in
UserSchema.plugin(uniqueValidator, { message: 'Error: User already exist in the Database with same email.' });

// 5) Creating collection by Shema setted up
const UserModel = mongoose.model("User", UserSchema);

// 6) Exporting Model
module.exports = UserModel;
