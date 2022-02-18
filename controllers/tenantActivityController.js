const TenantActivity = require('../models/TenantActivityModel');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const {
  getQueryObjectFromParams,
  getQueryArrayFromParams,
} = require('../utils/getQueryFromParams');
const getDates = require('../utils/getDates');
const dashboardAggregate = require('../utils/dashboardAggregate');

const createTenantActivity = async (req, res) => {
  const { tenantName, moveDate } = req.body;
  const activityAlreadyExists = await TenantActivity.findOne({
    tenantName,
    moveDate,
  });
  if (activityAlreadyExists) {
    throw new CustomError.BadRequestError(
      'This Tenant Activity already exists'
    );
  }
  const tenantActivity = await TenantActivity.create(req.body);
  res.status(StatusCodes.CREATED).json({ tenantActivity });
};

const getFilteredTenantActivity = async (req, res) => {
  const queryObject = getQueryObjectFromParams(req);
  //console.log(queryObject);
  const tenantActivities = await TenantActivity.find(queryObject)
    .sort('moveDate')
    .populate({
      path: 'location',
      select: 'siteName siteAbbreviation',
    });
  res
    .status(StatusCodes.OK)
    .json({ tenantActivities, count: tenantActivities.length });
};

const getFilteredTenantActivityTotals = async (req, res) => {
  const queryArray = getQueryArrayFromParams(req);
  const tenantActivities = await TenantActivity.aggregate([
    {
      $match: {
        $and: queryArray,
      },
    },
    // { $match: queryObject },
    {
      $group: {
        _id: {
          location: '$location',
          activityType: '$activityType',
          unitType: '$unitType',
          unitSize: '$unitSize',
        },
        total: {
          $sum: 1,
        },
      },
    },
    {
      $group: {
        _id: {
          location: '$_id.location',
          activityType: '$_id.activityType',
        },
        units: {
          $push: {
            unitType: '$_id.unitType',
            unitSize: '$_id.unitSize',
            sizeTotal: '$total',
          },
        },
        total: {
          $sum: '$total',
        },
      },
    },
    {
      $sort: {
        _id: -1,
      },
    },
    {
      $lookup: {
        from: 'locations',
        localField: '_id.location',
        foreignField: '_id',
        as: 'locationInfo',
      },
    },
  ]);
  res.status(StatusCodes.OK).json({ tenantActivities });
};

const getActivitiesByEmployee = async (req, res) => {
  const queryArray = getQueryArrayFromParams(req);
  const tenantActivities = await TenantActivity.aggregate([
    {
      $match: {
        $and: queryArray,
      },
    },
    // { $match: queryObject },
    {
      $group: {
        _id: {
          location: '$location',
          activityType: '$activityType',
          employeeInitials: '$employeeInitials',
          insurance: '$insurance',
        },
        total: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        _id: -1,
      },
    },
    {
      $lookup: {
        from: 'locations',
        localField: '_id.location',
        foreignField: '_id',
        as: 'locationInfo',
      },
    },
  ]);
  res.status(StatusCodes.OK).json({ tenantActivities });
};

const getDashboardActivity = async (req, res) => {
  const { today, monthStart, weekStart, yearStart } = getDates();
  console.log(today, monthStart, weekStart, yearStart);
  const daily = await dashboardAggregate(today, today);
  const weekly = await dashboardAggregate(weekStart, today);
  const yearly = await dashboardAggregate(yearStart, today);
  const monthly = await dashboardAggregate(monthStart, today);

  res.status(StatusCodes.OK).json({ daily, weekly, monthly, yearly });
};

const getSingleActivity = async (req, res) => {
  const { id: activityId } = req.params;

  const activity = await TenantActivity.findOne({
    _id: activityId,
  });

  if (!activity) {
    throw new CustomError.NotFoundError(
      `No Location found with id: ${activityId}`
    );
  }

  res.status(StatusCodes.OK).json({ activity });
};

const updateTenanatActivity = async (req, res) => {
  const { id: activityId } = req.params;
  const activity = await TenantActivity.findOneAndUpdate(
    { _id: activityId },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!activity) {
    throw new CustomError.NotFoundError(
      `No Location found with id: ${activityId}`
    );
  }

  res.status(StatusCodes.OK).json({ activity });
};

const deleteTenantActivity = async (req, res) => {
  const { id: activityId } = req.params;
  const activity = await TenantActivity.findOne({ _id: activityId });

  if (!activity) {
    throw new CustomError.NotFoundError(
      `No Location found with id: ${activityId}`
    );
  }
  activity.remove();
  res.status(StatusCodes.OK).json({ msg: `Success! Tenant Activity Removed` });
};

module.exports = {
  createTenantActivity,
  getFilteredTenantActivity,
  getSingleActivity,
  updateTenanatActivity,
  deleteTenantActivity,
  getFilteredTenantActivityTotals,
  getActivitiesByEmployee,
  getDashboardActivity,
};
