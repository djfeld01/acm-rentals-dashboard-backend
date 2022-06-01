const moment = require('moment');
const mongoose=require ('mongoose')
const ObjectId=mongoose.Types.ObjectId;

const getQueryObjectFromParams = (req) => {
  const {
    location,
    activityType,
    startDate,
    endDate,
    employeeInitials,
    insurance,
    unitSize,
    unitType,
    unitArea,
    tenantName,
  } = req.query;

  const queryObject = {};

  if (tenantName) {
    queryObject.tenantName = tenantName;
  }
  if (location) {
    queryObject.location = location;
  }
  if (activityType) {
    queryObject.activityType = activityType;
  }
  if (employeeInitials) {
    queryObject.employeeInitials = employeeInitials;
  }
  if (insurance) {
    queryObject.insurance = insurance;
  }
  if (unitSize) {
    queryObject.unitSize = unitSize;
  }
  if (unitType) {
    queryObject.unitType = unitType;
  }
  if (unitArea) {
    queryObject.unitArea = unitArea;
  }

  if (startDate && endDate) {
    queryObject.moveDate = {
      $gte: moment(startDate)
        .utcOffset('+0000')
        .format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
      $lt: moment(endDate)
        .add(1, 'days')
        .utcOffset('+0000')
        .format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
    };
  }

  return queryObject;
};

const getQueryArrayFromParams = (req) => {
  const {
    locationId,
    activityType,
    startDate,
    endDate,
    employeeInitials,
    insurance,
    unitSize,
    unitType,
    unitArea,
    tenantName,
  } = req.query;

  const queryArray = [];

  if (tenantName) {
    queryArray.push({ tenantName });
  }
  if (locationId) {
    const location= ObjectId(locationId)
    queryArray.push({ location });
  }
  if (activityType) {
    queryArray.push({ activityType });
  }
  if (employeeInitials) {
    queryArray.push({ employeeInitials });
  }
  if (insurance) {
    queryArray.push({ insurance });
  }
  if (unitSize) {
    queryArray.push({ unitSize });
  }
  if (unitType) {
    queryArray.push({ unitType });
  }
  if (unitArea) {
    queryArray.push({ unitArea });
  }

  if (startDate && endDate) {
    const startDateFormatted = new Date(startDate);
    let endDateFormatted = new Date(endDate);
    endDateFormatted.setDate(endDateFormatted.getDate() + 1);
    queryArray.push({
      moveDate: {
        $gte: startDateFormatted,
        $lt: endDateFormatted,
      },
    });
  }
  console.log(queryArray)
  return queryArray;
};

module.exports = {
  getQueryObjectFromParams,
  getQueryArrayFromParams,
};
