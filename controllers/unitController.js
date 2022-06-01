//CRUD

const Unit = require('../models/UnitModel');
const Location = require('../models/LocationModel');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');

const createUnit = async (req, res) => {
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
    slLocationId,
  });
  res.status(StatusCodes.CREATED).json({ unit });
};

const getUnit = async (req, res) => {
  const { id: unitId } = req.params;
  const unit = await Unit.findOne({
    _id: unitId,
  });
  if (!unit) {
    throw new CustomError.NotFoundError(`No unit found with id: ${unitId}`);
  }
  res.status(StatusCodes.OK).json({ unit });
};

const updateUnit = async (req, res) => {
  const { id: unitId } = req.params;
  const unit = await Unit.findOneAndUpdate({ _id: unitId }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!unit) {
    throw new CustomError.NotFoundError(`No unit found with id: ${unitId}`);
  }
  res.status(StatusCodes.OK).json({ unit });
};

const deleteUnit = async (req, res) => {
  const { id: unitId } = req.params;
  const unit = await Unit.findOne({
    _id: unitId,
  });
  if (!unit) {
    throw new CustomError.NotFoundError(`No unit found with id: ${unitId}`);
  }
  unit.remove();
  res.status(StatusCodes.OK).json({ unit });
};

module.exports = {
  createUnit,
  getUnit,
  updateUnit,
  deleteUnit,
};
