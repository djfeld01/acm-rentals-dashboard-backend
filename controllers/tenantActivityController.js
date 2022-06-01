const TenantActivity = require('../models/TenantActivityModel');
// TenantActivity.on('index', (error) => {
//   console.log(error.message);
// });
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const {
  getQueryObjectFromParams,
  getQueryArrayFromParams,
} = require('../utils/getQueryFromParams');

const dashboardAggregate = require('../utils/dashboardAggregate');

const createTenantActivity = async (req, res) => {
  const { unitName, moveDate } = req.body;
  const activityAlreadyExists = await TenantActivity.findOne({
    unitName,
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

const addManyTenantActivities = async (req, res) => {
  try {
    const tenantActivities = await TenantActivity.insertMany(req.body.data, {
      ordered: false,
    });
  } catch (e) {
    //console.log(e);
  }
  //console.log(`we're doing other things`);

  res.status(StatusCodes.CREATED).json({ tenantActivities });
};

// const addManyTenantActivities = async (req, res) => {
//   const { data } = req.body;
//   const tenantActivities = data.map(async (item) => {
//     const { unitName, moveDate } = item;
//     // console.log(unitName, moveDate);
//     const activityAlreadyExists = await TenantActivity.findOne({
//       unitName,
//       moveDate,
//     });
//     if (activityAlreadyExists) {
//       // throw new CustomError.BadRequestError(
//       //   'This Tenant Activity already exists'
//       // );
//       return 'duplicate';
//     }
//     const tenantActivity = await TenantActivity.create(item);
//     console.log(tenantActivity);
//     return tenantActivity.tenantName;
//   });

//   res.status(StatusCodes.CREATED).json({ tenantActivities });
// };

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

const getFilteredTenantActivityTotaledByDay = async (req, res) => {
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
          month: { $month: '$moveDate' },
          year: { $year: '$moveDate' },
          day: { $dayOfMonth: '$moveDate' },
        },
        moveIns: {
          $sum: {
            $cond: {
              if: { $eq: ['$activityType', 'MoveIn'] },
              then: 1,
              else: 0,
            },
          },
        },
        moveOuts: {
          $sum: {
            $cond: {
              if: { $eq: ['$activityType', 'MoveOut'] },
              then: 1,
              else: 0,
            },
          },
        },
        net: {
          $sum: {
            $cond: {
              if: { $eq: ['$activityType', 'MoveIn'] },
              then: 1,
              else: {
                $cond: {
                  if: { $eq: ['$activityType', 'MoveOut'] },
                  then: -1,
                  else: 0,
                },
              },
            },
          },
        },
      },
    },

    {
      $sort: {
        _id: -1,
      },
    },
  ]);
  res.status(StatusCodes.OK).json({ tenantActivities });
};

const getFilteredTenantActivityTotaledByMonth = async (req, res) => {
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
          month: { $month: '$moveDate' },
          year: { $year: '$moveDate' },
        },
        moveIns: {
          $sum: {
            $cond: {
              if: { $eq: ['$activityType', 'MoveIn'] },
              then: 1,
              else: 0,
            },
          },
        },
        moveOuts: {
          $sum: {
            $cond: {
              if: { $eq: ['$activityType', 'MoveOut'] },
              then: 1,
              else: 0,
            },
          },
        },
        net: {
          $sum: {
            $cond: {
              if: { $eq: ['$activityType', 'MoveIn'] },
              then: 1,
              else: {
                $cond: {
                  if: { $eq: ['$activityType', 'MoveOut'] },
                  then: -1,
                  else: 0,
                },
              },
            },
          },
        },
      },
    },

    {
      $sort: {
        _id: -1,
      },
    },
  ]);
  res.status(StatusCodes.OK).json({ tenantActivities });
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
        units: {
          $push: {
            moveDate: '$moveDate',
            unitName: '$unitName',
            unitSize: '$unitSize',
            unitType: '$unitType',
          },
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
  const data = await dashboardAggregate();
  res.status(StatusCodes.OK).json({ data });
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
  addManyTenantActivities,
  getFilteredTenantActivityTotaledByDay,
  getFilteredTenantActivityTotaledByMonth,
};
