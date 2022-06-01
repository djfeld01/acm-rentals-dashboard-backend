const mongoose = require('mongoose');

const UnitSchema = new mongoose.Schema({
  location: {
    type: mongoose.Types.ObjectId,
    ref: 'Location',
  },
  unitArea: {
    type: Number,
    required: [true, `Please Provide the Unit Area`],
  },
  unitSize: {
    type: String,
    required: [true, `Please provide the unit size`],
    trim: true,
  },
  unitType: {
    type: String,
    required: [true, `Please provide the unitType`],
    trim: true,
  },
  unitWidth: {
    type: Number,
    required: [true, `Please provide the unitWidth`],
  },
  unitLength: {
    type: Number,
    required: [true, `Please provide the unitLength`],
  },
  slLocationId: {
    type: Number,
    required: [true, `Please provide the Sitelink Location Id to slLocationId`],
  },
  pushRateThreshold: {
    type: Number,
    required: [
      true,
      `Please provide the push rate threshhold (defaults to .85)`,
    ],
  },
  pushRateIncrease: {
    type: Number,
    required: [
      true,
      `Please provide the push rate increase (defaults to 1.05)`,
    ],
  },
});

module.exports = mongoose.model('Unit', UnitSchema);
