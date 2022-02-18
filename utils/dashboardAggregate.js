const TenantActivity = require('../models/TenantActivityModel');

const dashboardAggregate = async (startDate, endDate) => {
  const startDateFormatted = new Date(startDate);
  let endDateFormatted = new Date(endDate);
  endDateFormatted.setDate(endDateFormatted.getDate() + 1);

  const response = await TenantActivity.aggregate([
    {
      $match: {
        $and: [
          { moveDate: { $gte: startDateFormatted, $lt: endDateFormatted } },
        ],
        //$or: [{ activityType: 'MoveIn' }, { activtyType: 'MoveOut' }],
      },
    },
    {
      $group: {
        _id: {
          location: '$location',
          unitType: '$unitType',
          unitSize: '$unitSize',
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
      $group: {
        _id: {
          location: '$_id.location',
        },
        units: {
          $push: {
            unitSize: '$_id.unitSize',
            unitType: '$_id.unitType',
            unitMoveIns: '$moveIns',
            unitMoveOuts: '$moveOuts',
            unitNet: '$net',
          },
        },
        moveIns: {
          $sum: '$moveIns',
        },
        moveOuts: {
          $sum: '$moveOuts',
        },
        net: {
          $sum: '$net',
        },
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
    {
      $sort: {
        'locationInfo.slLocationLocal': 1,
      },
    },
  ]);

  return response;
};

module.exports = dashboardAggregate;
