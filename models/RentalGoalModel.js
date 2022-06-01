const mongoose = require('mongoose');

const RentalGoalSchema = new mongoose.Schema({
  location: {
    type: mongoose.Types.ObjectId,
    ref: 'Location',
  },
  rentalGoal: {
    type: Number,
    required: [true, 'Please provide a rental goal number'],
  },
  month: {
    type: Date,
    required: [
      true,
      'Please provide the date of the goal- should be the first day of the month',
    ],
  },
});

module.exports = mongoose.model('RentalGoal', RentalGoalSchema);
