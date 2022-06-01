const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
  siteName: {
    type: String,
    required: [true, `Please Provide a siteName`],
  },
  streetAddres: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  zipCode: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  emailAddress: {
    type: String,
  },
  slLocationId: {
    type: Number,
    required: [true, `Please provide the Sitelink Location Id to slLocationId`],
  },
  slLocationLocal: {
    type: String,
  },
  siteAbbreviation: {
    type: String,
    maxLength: 3,
  },
  paycorNumber: {
    type: String,
    maxLength: 4,
  },
  currentOccupancy: {
    type: Number,
  },
  phoneNumber: {
    type: String,
  },
  twilioNumber: {
    type: String,
  },
});

module.exports = mongoose.model('Location', LocationSchema);
