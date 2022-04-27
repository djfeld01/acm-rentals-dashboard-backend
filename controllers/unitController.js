//CRUD

const Unit = require('../models/UnitModel');
const Location = require('../models/LocationModel');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');

const createUnit = async (req, res) => {
  console.log(req.body);
  const { slLocationId, unitArea, unitSize, unitType, unitWidth, unitLength } =
    req.body;
  const location = await Location.findOne({ slLocationId });
  if (!location) {
    throw new CustomError.BadRequestError('Location not in database');
  }
  const unitAlreadyExists = await Unit.findOne({
    location,
    unitArea,
    unitSize,
    unitType,
    unitWidth,
    unitLength,
  });
  if (unitAlreadyExists) {
    throw new CustomError.BadRequestError('Unit Already Exists');
  }
  const unit = await Unit.create({
    location,
    unitArea,
    unitSize,
    unitType,
    unitWidth,
    unitLength,
  });
  res.status(StatusCodes.CREATED).json({ unit });
};

module.exports = {
  createUnit,
};
