const mongoose = require('mongoose');

const LocationSchema= new mongoose.Schema({
    siteName:{
        type: String,
        required: [true, `Please Provide a siteName`]
    },
    streetAddres:{
        type: String,
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    zipCode: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    emailAddress: {
        type: String
    },
    slLocationId: {
        type: Number,
        required: [true, `Please provide the Sitelink Location Id to slLocationId`]
    },
    slLocationLocal: {
        type: String,
    },
    siteAbbreviation: {
        type: String,
        maxLength: 3
    }
})

module.exports = mongoose.model('Location', LocationSchema);