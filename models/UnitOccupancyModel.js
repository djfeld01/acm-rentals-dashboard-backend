const mongoose = require('mongoose');

const UnitOccupancySchema = new mongoose.Schema({
  unit: {
    type: mongoose.Types.ObjectId,
    ref: 'Unit',
  },
  date: {
    type: Date,
    required: [true, `Please provide the date of the numbers`],
  },
  totalArea: {
    type: Number,
    required: [true, `Please provide the total area`],
  },
  occupied: {
    type: Number,
    required: [true, `Please provide the total occupied`],
  },
  vacant: {
    type: Number,
    required: [true, `Please provide the total vacant`],
  },
  unrentable: {
    type: Number,
    required: [true, `Please provide the total unrentable`],
  },
  totalUnits: {
    type: Number,
    required: [true, `Please provide the total units`],
  },
  standardRate: {
    type: Number,
    required: [true, `Please provide the standard Rate`],
  },
  actualRate: {
    type: Number,
  },
  grossPotential: {
    type: Number,
    required: [true, `Please provide the gross potential`],
  },
  grossOccupied: {
    type: Number,
    required: [true, `Please provide the gross Occupied`],
  },
  actualOccupied: {
    type: Number,
    required: [true, `Please provide the Actual Occupied`],
  },
});

UnitOccupancySchema.statics.getActualRate = async function (
  unitId,
  occupancy,
  standardRate
) {
  try {
    const unit = await this.model('Unit').findOne({ _id: unitId });

    if (occupancy >= unit.pushRateThreshold) {
      return standardRate * unit.pushRateIncrease;
    } else {
      return standardRate;
    }
  } catch (error) {
    console.log(error);
  }
};

UnitOccupancySchema.pre('save', async function () {
  const { occupied, totalUnits, standardRate } = this;
  const occupancy = occupied / totalUnits;
  let actualRate = await this.constructor.getActualRate(
    this.unit,
    occupancy,
    standardRate
  );

  actualRate = actualRate.toFixed(2);
  this.actualRate = actualRate;
});

module.exports = mongoose.model('UnitOccupancy', UnitOccupancySchema);
