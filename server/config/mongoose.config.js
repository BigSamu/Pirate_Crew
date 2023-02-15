// ---------------------------------------------------
// CONFIG SETUP - Database
// ---------------------------------------------------

// 1) Importing External Libraries (Moongose)
const mongoose = require("mongoose");

// 2) Define auxiliar variables
const dbName = process.env.DB_NAME;

// 3) Setting connection to Mongo DB using 'mongoose' instance
mongoose.connect("mongodb://localhost/" + dbName,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("Sucessfully connected to Database"))
  .catch(err => console.log("Something went wrong when connecting to the database: ", err));