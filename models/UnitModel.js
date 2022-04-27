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
});

module.exports = mongoose.model('Unit', UnitSchema);
