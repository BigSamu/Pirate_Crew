// ---------------------------------------------------
// SERVER INITIALIZATION AND CONFIGURATION SETUP
// ---------------------------------------------------

// 0.1) load up all of our keys and values from the .env file into memory
// (we can access this through an object called "process.env")
require("dotenv").config();
// 0.2) Supress annoying warning from MongoDB driver:
// "(node:xxxx) DeprecationWarning: collection.ensureIndex is deprecated..." 
process.noDeprecation = true;

// 1) Importing External Libraries
const express = require('express'); 
const cors = require('cors');
const socket = require('socket.io');
const cookieParser = require('cookie-parser'); // to be able to read cookies

// 2) Intiliazing Express instance ('app') and define auxiliar variables
const app = express();
const port = process.env.MY_PORT; 

// 3) Enabling cros-origin requests and parser for cookies on Express server 
// with client side

// When using credentials and cookies, we need to add options to our cors
// configuration (credentials and origin)
app.use(cors({
	credentials: true,
	origin: "http://localhost:3000",
}));
app.use(cookieParser());


// 4) Enabling settings for being able to read JSON and parse data in body of POST requests
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// 5) Initializing connection to NoSQL database (MongoDB) using Moongose interface
require("./config/mongoose.config");

// 6) Importing API routes passing the Express instance 'app'
require("./routes/pirate.routes")(app);
require("./routes/user.routes")(app);

// 7) Running instance of Express server in selected port
const server = app.listen(port, () => {
    console.log(`Listening on port: ${port}`) 
});

// 8) Creatiung new instance of socket.io and passing it it our express server instance
// We must also include a configuration settings object to prevent CORS errors
const io = socket(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['*'], // this allow all configuration of headers
    credentials: true,
  }
});

// 9) Start listening between client and server
// Before creating own event listeners the event "connection" must be listen first

io.on("connection", socket => {
  // NOTE: Each client that connects get their own server socket id!
  console.log('Server side socket id: ' + socket.id);
  
  // Use specific socket to create event listeners and emitters for clients
  socket.on("added_new_pirate", data => {
    socket.broadcast.emit("new_pirate_added", data)
  });
  socket.on("deleted_pirate", data => {
    socket.broadcast.emit("pirate_deleted", data)
  });
  socket.on("updated_pirate", data => {
    socket.broadcast.emit("pirate_updated", data)
  });
});