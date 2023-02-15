// ---------------------------------------------------
// MODEL SETUP - Piarte
// ---------------------------------------------------

// 1) Importing External Libraries
const mongoose = require('mongoose'); 
const uniqueValidator = require('mongoose-unique-validator');

// 2) Creating Schema for Model (blueprint)
const PirateSchema = new mongoose.Schema({
    name: { 
        type: String,
        unique: true,
        required: [true, "Error: pirate name is required"],
    },
    imageUrl: { 
        type: String,
        required: [true, "Error: image URL is required"],
    },
    treasureChests: {
        type: Number,
        required: [true, "Error: number of treasure chests are required"]
    },
    catchPhrase: {
        type: String,
        required: [true, "Error: catch phrase is required"]
    },
    crewPosition: {
        type: String,
        required: [true, "Error: crew position is required"],
        enum: {
          values: ["Captain", "First Mate", "Quarter Master", "Boatswain", "Powder Monkey"],
          message: '{VALUE} is not supported'
        }
    },
    pirateCharacteristics: {
        pegLeg: {
          type: Boolean,
          default: false
        },
        eyePatch: {
            type: Boolean,
            default: false
        },
        hookHand: {
            type: Boolean,
            default: false
        }
    },
    createdBy:{
        type: mongoose.Schema.Types.Mixed,
        ref: "User"
    }
}, { timestamps: true });

// 3) Adding uniqueValidator Plug-in
PirateSchema.plugin(uniqueValidator, { message: 'Error: Pirate already exist in the Database.' });

// 4) Creating collection by Shema setted up
const PirateModel = mongoose.model("Pirate", PirateSchema);

// 5) Exporting Model
module.exports = PirateModel;
