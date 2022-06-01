const UnitOccupancy = require('../models/UnitOccupancyModel');
const Unit = require('../models/UnitModel');
const Location = require('../models/LocationModel');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');

const addUnitOccupancy = async (req, res) => {
  const {
    slLocationId,
    unitArea,
    unitSize,
    unitType,
    unitWidth,
    unitLength,
    date,
    totalArea,
    occupied,
    vacant,
    unrentable,
    totalUnits,
    standardRate,
    grossPotential,
    grossOccupied,
    actualOccupied,
  } = req.body;

  const unit = await Unit.findOne({
    slLocationId,
    unitArea,
    unitSize,
    unitType,
    unitWidth,
    unitLength,
  });
  if (!unit) {
    throw new CustomError.BadRequestError('Unit not in database');
  }
  const alreadyExits = await UnitOccupancy.findOne({
    date,
    totalArea,
    occupied,
    vacant,
    unrentable,
    totalUnits,
    standardRate,
    grossPotential,
    grossOccupied,
    actualOccupied,
  });
  if (alreadyExits) {
    throw new CustomError.BadRequestError(
      `Unit Occupancy already exists in database`
    );
  }

  const unitOccupancy = await UnitOccupancy.create({
    unit,
    date,
    totalArea,
    occupied,
    vacant,
    unrentable,
    totalUnits,
    standardRate,
    grossPotential,
    grossOccupied,
    actualOccupied,
  });

  res.status(StatusCodes.CREATED).send({ unitOccupancy });
};

const addManyUnitOccupancies = async (req, res) => {
  const { body } = req;

  const promises = body.map(async (item) => {
    //console.log(item);
    const {
      slLocationId,
      unitArea,
      unitSize,
      unitType,
      unitWidth,
      unitLength,
      date,
      totalArea,
      occupied,
      vacant,
      unrentable,
      totalUnits,
      standardRate,
      grossPotential,
      grossOccupied,
      actualOccupied,
    } = item;

    const unit = await Unit.findOne({
      slLocationId,
      unitArea,
      unitSize,
      unitType,
      unitWidth,
      unitLength,
    });
    if (!unit) {
      return `Location: ${slLocationId} unitType: ${unitType} unitSize: ${unitSize} doesn't exist`;
    }

    const alreadyExits = await UnitOccupancy.findOne({
      date,
      totalArea,
      occupied,
      vacant,
      unrentable,
      totalUnits,
      standardRate,
      grossPotential,
      grossOccupied,
      actualOccupied,
    });

    if (alreadyExits) {
      return `A unitOccupancy with this data already exists.`;
    }

    const unitOccupancy = await UnitOccupancy.create({
      unit,
      date,
      totalArea,
      occupied,
      vacant,
      unrentable,
      totalUnits,
      standardRate,
      grossPotential,
      grossOccupied,
      actualOccupied,
    });
    //console.log(unitOccupancy);
    return unitOccupancy;
  });
  const response = await Promise.all(promises);
  //console.log();
  res.status(StatusCodes.CREATED).send({ response });
};

const updateUnitOccupancy = async (req, res) => {
  res.send(`This will updated a unitOccupancy`);
};

const getUnitOccupancy = async (req, res) => {
  res.send(`This will get a unit occupancy by ID`);
};
const deleteUnitOccupancy = async (req, res) => {
  res.send(`This will delete a unit occupancy`);
};

module.exports = {
  addUnitOccupancy,
  addManyUnitOccupancies,
  updateUnitOccupancy,
  getUnitOccupancy,
  deleteUnitOccupancy,
};
