//CRUD

const Location = require('../models/LocationModel');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');

const createLocation = async (req, res) => {
  console.log(req.body);
  const { slLocationId } = req.body;
  const locationAlreadyExists = await Location.findOne({ slLocationId });
  if (locationAlreadyExists) {
    throw new CustomError.BadRequestError('Location already exists');
  }
  const location = await Location.create(req.body);
  res.status(StatusCodes.CREATED).json({ location });
};

const getLocation = async (req, res) => {
  const { id: locationId } = req.params;

  const location = await Location.findOne({
    _id: locationId,
  });

  if (!location) {
    throw new CustomError.NotFoundError(
      `No Location found with id: ${locationId}`
    );
  }

  res.status(StatusCodes.OK).json({ location });
};

const getAllLocations = async (req, res) => {
  const locations = await Location.find({});
  res.status(StatusCodes.OK).json({ locations, count: locations.length });
};

const updateLocation = async (req, res) => {
  const { id: locationId } = req.params;
  const location = await Location.findOneAndUpdate(
    { _id: locationId },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!location) {
    throw new CustomError.NotFoundError(
      `No Location found with id: ${locationId}`
    );
  }

  res.status(StatusCodes.OK).json({ location });
};
const updateLocationBySlLocationId = async (req, res) => {
  const { id: slLocationId } = req.params;
  const location = await Location.findOneAndUpdate({ slLocationId }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!location) {
    throw new CustomError.NotFoundError(
      `No Location found with id: ${slLocationId}`
    );
  }

  res.status(StatusCodes.OK).json({ location });
};

const deleteLocation = async (req, res) => {
  const { id: locationId } = req.params;
  const location = await Location.findOne({ _id: locationId });

  if (!location) {
    throw new CustomError.NotFoundError(
      `No Location found with id: ${locationId}`
    );
  }
  location.remove();
  res.status(StatusCodes.OK).json({ msg: `Success! location Removed` });
};

module.exports = {
  createLocation,
  getLocation,
  updateLocation,
  updateLocationBySlLocationId,
  getAllLocations,
  deleteLocation,
};
