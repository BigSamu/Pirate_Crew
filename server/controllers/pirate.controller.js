// ---------------------------------------------------
// CONTROLLER SETUP - Pirate
// ---------------------------------------------------

// 1) Importing External Libraries
const jwt = require('jsonwebtoken')

// 2) Importing Model
const PirateModel = require('../models/pirate.model');

// 3) Setting up and exporting CRUD API requests to server
module.exports = {

  // I) GET REQUESTS

  // Find all Pirates
  findAllPirates: (req, res) => {
    PirateModel.find()
      .then((allPirates) => res.json(allPirates)) 
      .catch(err => res.status(500).json(err));
  },
  // Get a Pirate by Id
  findPirateById: (req, res) => {
    PirateModel.findById({ _id: req.params.id }) 
      .then((oneSinglePirate) => res.json(oneSinglePirate)) 
      .catch(err => res.status(500).json(err));
  },
  
  // II) POST REQUESTS
  // Create a Pirate
  createNewPirate: (req, res) => {
    const decodedJwt = jwt.decode(req.cookies.usertoken, {complete:true})
    const user = decodedJwt.payload

    // Create normal pirate object from what is passed in
    const pirateToCreate = new PirateModel(req.body);
    // Set user id on pirate created
    pirateToCreate.createdBy = user
    console.log(pirateToCreate)

    PirateModel.create(pirateToCreate) 
      .then((newPirate) => res.json(newPirate)) 
      .catch(err => res.status(500).json(err));
  },

  // III) UPDATE REQUESTS
  // Update a Pirate by Id
  updatePirateById: (req, res) => {
    const decodedJwt = jwt.decode(req.cookies.usertoken, {complete:true})
    const user = decodedJwt.payload
    
    PirateModel.findById({ _id: req.params.id }) 
      .then((updatedPirate) => {
        if(user._id === updatedPirate.createdBy._id){
          PirateModel.findByIdAndUpdate(
            {_id: req.params.id }, 
            req.body, 
            { new: true, 
              runValidators: true ,
              context: 'query' 
            }) 
            .then((updatedPirate) => res.json(updatedPirate)) 
            .catch(err => res.status(500).json(err));
        }
        else {
          res.status(403).json({
            message: " You are not allowed to delete/update this item"
          })
        }
      })
  },

  // IV) DELETE REQUESTS  
  // Delete all Pirates
  deleteAllPirates: (req, res) => {
    PirateModel.deleteMany({}) 
      .then((allDeletedPirates) => res.json(allDeletedPirates)) 
      .catch(err => res.status(500).json(err));
  },
  // Update a Pirate by Id
  deletePirateById: (req, res) => {
    const decodedJwt = jwt.decode(req.cookies.usertoken, {complete:true})
    const user = decodedJwt.payload
    
    PirateModel.findById({ _id: req.params.id }) 
      .then((deletedPirate) => {
        if(user._id === deletedPirate.createdBy._id){
          PirateModel.findByIdAndDelete({ _id: req.params.id }) 
            .then((deletedPirate) => res.json(deletedPirate)) 
            .catch(err => res.status(500).json(err));
        }
        else {
          res.status(403).json({
            message: " You are not allowed to delete/update this item"
          })
        }
      })
  },
};
